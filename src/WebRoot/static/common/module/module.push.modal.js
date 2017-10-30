/**
 * Created by lianhy on 2017/5/4.
 * 个别表格推送需要做成推送组件拓展弹出集成窗口
 * 在推送组件原有基础拓展frame窗口
 * 依赖文件lib下的jQuery、layer,sweetAlert
 * 依赖文件common下的module.push.js
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD规范
        define(['jquery','helper','module.push','layer','sweetalert', 'validator'], factory);
    } else {
        if (typeof module === 'object' && module.exports) {
            // Node/CommonJS
            module.exports = factory(require('jquery'), require('helper'), require('module.push'), require('layer'), require('sweetalert'), require('validator'));
        } else {
            //未引入requirejs、commonjs等
            window.module = window.module || {};
            if(!window.module.push){console.log('未能找到module.push插件请先引入')}
            window.module.push = factory(window.jQuery, window.helper, window.module.push, window.layer, window.swal, window.validator);
        }
    }
}(function ($, helper, push, layer, swal) {
    //对象拦截
    function callFun(fun, _this, _arg) {
        return function () {
            var arg = [];
            arg.push(this);
            arg.push.apply(arg, arguments);
            arg.push.apply(arg, _arg);
            fun.apply(_this, arg);
        }
    }

    var pushModal = function(params) {
        /**
         * 推送窗口设置参数
         * @type {{type:string,template:string,templateData:{img:string,},modalHead:string}}
         */
        this.defaults = {
            type: params.modal.type||'feed',//feed信息流，mobile设备
            template: params.modal.template||'pure',    //模板类型：circles，圈子,pure纯推送模板
            templateData: params.modal.templateData||{
                objId: params.modal.objId,
                objType: params.modal.objType,
                // logo: params.modal.logo, //有头像模板的src
                title: params.modal.title, //标题字段
                brief: params.modal.brief, //简介字段
                summary: params.modal.brief, //描述字段
                image: params.modal.image, //图片字段
                extra: params.modal.extra||{} //其他字段
            },

            pushUrl: params.pushUrl||helper.url.getUrlByMapping("admin/common/commont_push.shtml"),
            modalHead: params.modalHead||'推送'//窗口标题文字
        };
        /**
         * 推送组件参数映射
         */
        console.info(params)
        this.pushOptions = {
            container: "#pushContainer",
            validatorContainer: '#pushContainer',
            readonly: params.readonly||'',
            defaultPush: params.defaultPush||{selected: 1, value: push.pushEnum.none},
            range: params.range,
            smallTop:params.smallTop,
            bigTop: params.bigTop,
            formData: params.formData
        };

        this._r = (new Date()).valueOf();
        //页面相关元素 驼峰id,中线class
        this.el = {
            pushModal: "pushModal"+ this._r,
            starBtn: "star-btn" + this._r,//星星
            pushBrief: "pushBrief" + this._r//简介输入框
        };

        this.pushObj = null;//推送公用组件对象
        this.layer = null;//窗口对象

        this.init();
    };

    /**
     * 初始化
     */
    pushModal.prototype.init = function () {
        this._buildView();
        this._buildEvents();
    };

    /**
     * 构造视图界面
     */
    pushModal.prototype._buildView = function () {
        var _this = this;
        //获取皮肤模板
        var template = _this.getTemplate();
        //打开窗口
        _this.layer = layer.open({
            type: 1,
            title: _this.defaults.modalHead,
            skin: 'layui-layer-molv', //加上边框
            area: ['90%', '90%'], //宽高
            content: template,
            success: function(){},
            btn : [ '确认推送' ],
            btn1 : function(elem) {
                _this.post();
                return false;
            }

            // cancel: callFun(this.saveSelected, this)
        });
        _this.setValidator();
        //接入推送组件
        _this.pushObj = _this.defaults.type==="feed"?
            new push.feed(_this.pushOptions):
            new push.mobile(_this.pushOptions);

        // $(window).resize(callFun(this._resize, this));
    };


    //获取默认的layer模板
    pushModal.prototype.getTemplate = function () {
        var _this = this;
        var template = '';

        switch (_this.defaults.template){
            case 'circles': template += '<div id="{pushModal}" class="form-horizontal" style="padding:20px 0;width: auto;overflow-x:hidden">'+
                _this.getImgBox('圈子头像',_this.defaults.templateData.image)+
                '<div class="hr-line-dashed"></div>'+
                _this.getTxtBox('圈子名称',_this.defaults.templateData.title)+
                '<div class="hr-line-dashed"></div>'+
                _this.getTxtBox('圈子简介',_this.defaults.templateData.brief)+
                '<div class="hr-line-dashed"></div>'+
                _this.starLvl()+
                '<div class="hr-line-dashed"></div>'+
                '<form id="pushContainer" class="m-l-md m-r-md"></form>'+
                '</div>';break;
            default: template += '<div id="{pushModal}" class="form-horizontal" style="padding:20px 0;width: auto;overflow-x:hidden">'+
                '<div id="pushContainer" class="m-l-md m-r-md"></div>'+
                '</div>';
        }
        return template.Format(this.el);
    };
    
    //验证初始化
    pushModal.prototype.setValidator = function () {
    	//验证初始化
        $('#pushContainer').bootstrapValidator({
            //指定不验证的情况
            excluded: [':disabled', ':hidden', ':not(:visible)'],
            message: '验证未通过',
            feedbackIcons: {/*输入框不同状态，显示图片的样式*/
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {}
        });
    }
    /**
     * 发送
     * @params 无
     */
    pushModal.prototype.post = function () {
    	var bv = $('#pushContainer').data('bootstrapValidator');
        bv.validate();
        if (bv.isValid()) {
        	var _this = this;

            var data = {
                obj_id: _this.defaults.templateData.objId,
                obj_type: _this.defaults.templateData.objType,
                title: _this.defaults.templateData.title,
                image: _this.defaults.templateData.image,
                brief: _this.defaults.templateData.brief,
                extra: _this.defaults.templateData.extra,
                summary: _this.defaults.templateData.brief
            };
            if(_this.defaults.template === 'circles')
                data.extra.star = $('#'+_this.el.pushModal).find('.fa-star').length;
            data.extra = JSON.stringify(data.extra);
            $.extend(data, _this.pushObj.getFormData());

            swal({
                title: "您确定要推送该信息吗？",
                // text: row.title,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#18a689",
                confirmButtonText: "确认",
                cancelButtonText:'取消',
                closeOnConfirm: false
            }, function () {
                swal({title: "推送中，请稍候", type: "info", showConfirmButton: false});
                $.ajax({
                    url: _this.defaults.pushUrl,
                    type: 'POST',
                    data: data,
                    dataType : 'json',
                    success : function(ret) {
                        if(ret.code == 0){
                            swal({title:"推送成功", text: "1s后自动消失...", type: "success", timer: 1000});
                            setTimeout(function(){
                                layer.close(_this.layer);
                            },1000);

                        }else{
                            swal("推送失败", ret.errMsg, "error");
                        }
                    },
                    error:function(ret) {
                        swal("推送失败", "error");
                    }
                });
            });
        }
    };

    //HTML模板可复用拆分块
    /**
     * 文本板块
     * @params {labelTxt:string，contentTxt:string}
     */
    pushModal.prototype.getTxtBox = function (labelTxt,contentTxt) {
        var template =  '<div class="form-group">'+
            '<label class="col-sm-2 control-label">'+labelTxt+'：</label>'+
            '<div class="col-xs-10 col-md-8">'+
            '<div class="form-control" style="height:auto;">'+contentTxt+'</div>'+
            '</div>'+
            '</div>';
        return template;
    };
    /**
     * 图片板块
     * @params {labelTxt:string,url:string}
     */
    pushModal.prototype.getImgBox = function (labelTxt,url) {
        var template = '<div class="form-group">'+
            '<label class="col-sm-2 control-label">'+labelTxt+'：</label>'+
            '<div class="col-xs-10 col-md-8 cursor">'+
            '<div style="width:90px;height:90px" >'+
            '<img style="width:90px;height:90px"  src="'+url+'">'+
            '</div>'+
            '</div>'+
            '</div>';
        return template;
    };
    // /**
    //  * 标签板块
    //  * @params {labelTxt:string}
    //  */
    // pushModal.prototype.brief = function (labelTxt,contentTxt) {
    //     var template = '<div class="form-group">'+
    //         '<label class="col-sm-2 control-label">'+labelTxt+'：</label>'+
    //         '<div class="col-xs-10 col-md-8">'+
    //         '<div class="form-control">'++'</div>'+
    //         '</div>'+
    //         '</div>';
    //     return template;
    // };
    // /**
    //  * 简介板块
    //  * @params {labelTxt:string}
    //  */
    // pushModal.prototype.brief = function (labelTxt) {
    //     var template = '<div class="form-group">'+
    //                     '<label class="col-sm-2 control-label">'+labelTxt+'：</label>'+
    //                     '<div class="col-xs-10 col-md-8">'+
    //                     '<textarea id="{pushBrief}" type="text" style="resize: vertical;" class="form-control"></textarea>'+
    //                     '</div>'+
    //                     '</div>';
    //     return template;
    // };
    // //获取简介内容
    // pushModal.prototype.getBrief = function () {
    //     return $('#'+this.el.pushBrief).val().trim();
    // };


    /**
     * 推荐星级板块
     * @params {labelTxt:string}
     */
    pushModal.prototype.starLvl = function(){
        var template = '<div class="form-group">'+
            '<label class="col-sm-2 control-label">推荐星级：</label>'+
            '<div class="col-xs-10 col-md-8">'+
            '<div class="color-gold flex-row-start m-t-xs">'+
            '<i class="fa fa-star font-16 m-r-sm cursor {starBtn}"></i>'+
            '<i class="fa fa-star-o font-16 m-r-sm cursor {starBtn}"></i>'+
            '<i class="fa fa-star-o font-16 m-r-sm cursor {starBtn}"></i>'+
            '<i class="fa fa-star-o font-16 m-r-sm cursor {starBtn}"></i>'+
            '<i class="fa fa-star-o font-16 m-r-sm cursor {starBtn}"></i>'+
            '</div>'+
            '</div>'+
            '</div>';
        return template;
    };
    //点击星星
    /**
     * 推荐星级板块-点击星星
     * @params {elem:{}}
     */
    pushModal.prototype.starLvl.action = function(elem) {
        var $this = $(elem);
        var index = $this.index();
        var $siblings = $this.siblings();
        for(var i=0;i<$siblings.length;i++){
            if($siblings.eq(i).hasClass('fa-star'))$siblings.eq(i).addClass('fa-star-o').removeClass('fa-star');
            if(i<index)$siblings.eq(i).addClass('fa-star').removeClass('fa-star-o');
        }
        $this.addClass('fa-star').removeClass('fa-star-o');
    };
    /**
     * 初始化绑定事件
     * @private
     */
    pushModal.prototype._buildEvents = function (){
        //点击星星
        $('.'+this.el.starBtn).click(callFun(this.starLvl.action, this))

    };
    push.modal = pushModal;

    return push;
}));