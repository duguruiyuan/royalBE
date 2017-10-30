/**
 * Created by xiegy on 2017/5/24.
 * 文本编辑器
 * 依赖文件lib下的jQuery、bootstrap、summernote、layer，common下的helper.js、helper.qiniu.js
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD规范
        define(['base','jquery','helper','layer','helper.qiniu','summernote'], factory);
    } else {
        if (typeof module === 'object' && module.exports) {
            // Node/CommonJS
            module.exports = factory(require('base'), require('jquery'), require('helper'), require('layer'), require('hepler.qiniu'), require('summernote'));
        } else {
            //未引入requirejs、commonjs等
            window.module = window.module || {};
            window.module.editor = factory(null, window.jQuery, window.helper, window.layer);
        }
    }
}(function (bs, $, helper, layer) {
    var layerIndex;
    //对象拦截
    function callFun(fun, _this, _arg) {
        return function () {
            var arg = [];
            arg.push(this);
            arg.push.apply(arg, arguments);
            arg.push.apply(arg, _arg);
            return fun.apply(_this, arg);
        }
    }

    var setting = {
        defaultOptions: {
            container: "body",      //编辑器所在容器
            validatorContainer: "", //外部验证容器
            readonly: false,        //是否只读模式
            height: 500,            //默认高度
            value: '',              //初始传入的值
            callback: null          //回调函数（每次改变值都会回调该函数）
        },

        private: {
            lang: 'zh-CN'
        }
    };

    function editor(options) {
        this.options = $.extend(true, {}, setting.defaultOptions, options, setting.private);
        this.options.callbacks = {
            onImageUpload: callFun(this._upload, this),
            onBlur: callFun(this._change, this)
        };

        this.value = this.options.value;
        this.$editor = $(this.options.container);
        this.$validator = this.options.validatorContainer ? $(this.options.validatorContainer) : null;
        this._r = (new Date()).valueOf();
        this.el = {txtEditor: "txtEditor" + this._r};
        this.init();
    }

    /**
     * 初始化编辑器
     */
    editor.prototype.init = function () {
        this.$editor.summernote(this.options);
        if(this.value){
            this.setValue(this.value);
        }

        this._addValidator();

        if(this.options.readonly){
            this.$editor.next().find("button").attr("disabled", "disabled");
            this.$editor.next().find(".note-editable").attr("contenteditable", false);
        }
    };

    /**
     * 添加验证器
     * @private
     */
    editor.prototype._addValidator = function(){
        if(!this.$validator) return;

        this.$editor.next().after(this.getTxtTemplate());
        var valid = this.$validator.data("bootstrapValidator");
        if(!valid) return;

        var _this = this;
        valid.addField(this.el.txtEditor, {
            validators: {
                callback: {
                    message: '内容不能为空',
                    callback: function (value, validator) {
                        return _this._replaceEmpty(value) !== "";
                    }
                }
            }
        });
    };

    /**
     * 内容有变更时触发
     * @private
     */
    editor.prototype._change = function () {
        var value = this._replaceEmpty(this.$editor.summernote("code"));
        if(this.value === value) return;

        this.value = value;
        $("#" + this.el.txtEditor).val(value);
        if(this.$validator){
            this.setValid(false);
        }

        if(this.options.callback && this.options.callback instanceof Function){
            this.options.callback(value);
        }
    };

    /**
     * 设置各种空值为字符串空
     * @param value
     * @private
     */
    editor.prototype._replaceEmpty = function (value) {
        return value.replace(/^(<p>((<br>)*|(&nbsp;\s*)*)<\/p>)+$|^(&nbsp;\s*)+$/ig, "").trim();
    };

    /**
     * 上传到七牛
     * @param el
     * @param files
     * @private
     */
    editor.prototype._upload = function (el, files) {
        if (layer) {
            layerIndex = layer.msg('上传中，请稍候', {icon: 4, time: 0, shade: 0.2});
        }

        helper.qiniu.upload(files[0], function (res) {
            if (res.code == 1) {
                //上传成功
                $(el).summernote("insertImage", res.url);
                if (layer)
                    layer.close(layerIndex);

                return;
            }

            if (layer)
                layerIndex = layer.alert(res.msg, 8)
        });
    };

    /**
     * 隐藏辅助验证器用
     * @returns {String}
     */
    editor.prototype.getTxtTemplate = function () {
        var template = '<div style="margin-top:-20px;width:0px;height:0px;overflow:hidden">'
            +'<textarea id="{txtEditor}" name="{txtEditor}" style="width:0px;height:0px;">{content}</textarea>'
            +'</div>';

        return template.Format({
            txtEditor: this.el.txtEditor,
            content: this.value
        });
    };

    /**
     * 【外部调用】设置编辑器的值
     * @param value
     */
    editor.prototype.setValue = function (value) {
        this.$editor.summernote("code", value);
        if (value) this._change();
    };

    /**
     * 【外部调用】获取编辑器的值
     * @returns {string}
     */
    editor.prototype.getValue = function () {
        return this._replaceEmpty(this.$editor.summernote("code"));
    };

    /**
     * 设置验证器是否通过或重新验证
     * @param isPassOrReValid 。ture：pass；false：reCalid
     */
    editor.prototype.setValid = function (isPassOrReValid) {
        var valid, name;
        if(this.$validator && (valid = this.$validator.data("bootstrapValidator"))){
            name = this.el.txtEditor;
            valid.updateStatus(name, isPassOrReValid ? "VALID" : "NOT_VALIDATED");
            if(!isPassOrReValid){
            	setTimeout(function () {
                    valid.validate(name);
                });
            }
        }
    };

    return editor;
}));