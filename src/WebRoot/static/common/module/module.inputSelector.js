/**
 * Created by xiegy on 2017/5/17.
 * 输入框选择器（单选）
 * 依赖文件lib下的jQuery、bootstrap、bootstrap-suggest，common下的helper.js
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD规范
        define(['base','jquery','helper','suggest'], factory);
    } else {
        if (typeof module === 'object' && module.exports) {
            // Node/CommonJS
            module.exports = factory(require('base'), require('jquery'), require('helper'), require('suggest'));
        } else {
            //未引入requirejs、commonjs等
            window.module = window.module || {};
            window.module.inputSelector = factory(null, window.jQuery, window.helper);
        }
    }
}(function (bs, $, helper) {
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

    var assist = {
        _areaSource: function (label, tip, level) {
            return {
                label: label,
                tip: tip,
                minWidth: "300px",
                url: helper.url.getUrlByMapping("static/common/data/cityData.json"),
                idField: "ID",       //获取到的数据源中，key的字段
                keyField: "MergerName",     //获取到的数据源中，value的字段
                level: level,             //提供选择的级数（0：全部；1：省及以下；2：地级市及以下；3：仅可选择县级市）
                getDataMethod: "firstByUrl",
                showHeader: false,
                allowNoKeyword: true,
                effectiveFields: ["ID", "MergerName", "MergerPinyin"],
                searchFields: ["ID", "MergerName", "MergerPinyin"],
                ignorecase: true,
                fnProcessData: assist._areaDataProcess
            };
        },

        /**
         * 地区数据处理转换
         * @param suggest
         * @param json
         * @returns {*}
         * @private
         */
        _areaDataProcess: function (suggest, json) {
            if (!json || !(json instanceof Object)) {
                return false;
            }

            var data = {value: []}, list = {}, filterList = {}, item = null, province = null, city = null, county = null;
            for (var i = 0; i < json.length; i++) {
                item = json[i];

                list[item["ID"]] = item;
                if(item["LevelType"] < suggest.level) continue;

                switch (item["LevelType"]){
                    case "0":
                        item["MergerPinyin"] = item["Pinyin"];
                        break;
                    case "1":
                        county = null;
                        city = null;
                        province = item;
                        item["MergerPinyin"] = province["Pinyin"];
                        break;
                    case "2":
                        county = null;
                        city = item;
                        province = list[city["ParentId"]];
                        item["MergerPinyin"] = province["Pinyin"] + city["Pinyin"];
                        break;
                    case "3":
                        county = item;
                        city = list[county["ParentId"]];
                        province = list[city["ParentId"]];
                        item["MergerPinyin"] = province["Pinyin"] + city["Pinyin"] + county["Pinyin"];
                        break;
                }

                if(item["LevelType"] != "0")
                    item["MergerName"] = item["MergerName"].replace(/中国,/, "").replace(/,/g, " ");

                filterList[item["ID"]] = item;
                data.value.push(item);
            }

            this.hashMap = filterList;
            return data;
        },

        /**
         * 通用数据处理转换
         * @param suggest
         * @param json
         * @returns {*}
         * @private
         */
        _dataProcess: function (suggest, json) {
            if (!json || !(json instanceof Object)) {
                return false;
            }

            var data = {value: []}, list = {}, mergerValue, tagValue, item;
            var json = suggest["dataField"] ? json[suggest["dataField"]] : json;
            for (var i = 0; i < json.length; i++) {
                item = json[i];
                if(suggest["imageField"]){
                    //图片域处理
                    if(item[suggest["imageField"]])
                        item["imageValue"] = '<img src="{0}" style="height: 34px;"/>'.Format(helper.url.getThumImageUrl(item[suggest["imageField"]]));
                    else
                        item["imageValue"] = setting.defaultImage;
                }
                if(suggest["mergerFields"] && suggest["mergerFields"].length > 0){
                    //合并域处理
                    mergerValue = "";
                    for(var j = 0; j < suggest["mergerFields"].length; j++){
                        mergerValue += item[suggest["mergerFields"][j]] ? item[suggest["mergerFields"][j]] + " " : "";
                    }
                    item["mergerValue"] = mergerValue.trim();
                }
                if(suggest["tagFields"]){
                    //标签域处理
                    tagValue = "";
                    for(var j = 0; j < suggest["tagFields"].length; j++){
                        tagValue += '<span class="label {1} m-r-xs" style="display:block;max-width:200px;overflow: hidden;text-overflow:ellipsis;" title="{0}">{0}</span>'.Format(item[suggest["tagFields"][j]] ? item[suggest["tagFields"][j]] + " " : "", setting.tagClass[j]);
                    }
                    item["tagValue"] = tagValue;
                }

                list[item[suggest["idField"]]] = json[i];
                data.value.push(item);
            }

            this.hashMap = list;
            return data;
        }
    };

    var setting = {
        indexSelector: 0,
        defaultImage: '<i class="fa fa-image center-block" style="font-size:30px;padding:1px 2px;"></i>',
        tagClass: ['label-info', 'label-warning', 'label-inverse', 'label-primary', 'label-success', 'label-danger'],
        defaultOptions: {
            container: "body",      //选择器所在容器
            validatorContainer: "", //外部的验证器对象
            readonly: false,        //是否只读
            type: "",               //初始化选择器类型
            data: null,            //初始化已选中的对象
            callback: null,         //选中后的回调
            unSelectCallback: null  //未选择的回调
        },

        types: {
            region: assist._areaSource("地区", "请输入地区关键字/拼音进行搜索并选择", "3"),            //地区选择器，只允许选择县级别的地区

            nativeplace: assist._areaSource("家乡", "请输入家乡关键字/拼音进行搜索并选择", "3"),       //家乡选择器，只允许选择县级别的地区

            area: assist._areaSource("地区", "请输入地区关键字/拼音进行搜索并选择", "0"),              //地区选择器，可选择任意级别的行政单位，国家、省、地级市、县级都可

            gongshanglian: {
            	label: "工商联",
                tip: "请输入工商联关键字进行搜索并选择",
                minWidth: "300px",
                url: helper.url.getUrlByMapping("admin/gslmanager/find_gsl.shtml"),
                idField: "id",       //获取到的数据源中，key的字段
                keyField: "caname",     //获取到的数据源中，value的字段
                dataField: "data",      //数据存放字段
                getDataMethod: "url",
                effectiveFields: ["caname"],
                showHeader: false,
                fnProcessData: assist._dataProcess
            },
            
            industry: {
                label: "行业",
                tip: "请输入行业关键字进行搜索并选择",
                minWidth: "300px",
                url: helper.url.getUrlByMapping("admin/backcommon/find_industrylists.shtml"),
                idField: "id",       //获取到的数据源中，key的字段
                keyField: "name",     //获取到的数据源中，value的字段
                dataField: "data",      //数据存放字段
                getDataMethod: "firstByUrl",
                effectiveFields: ["name"],
                showHeader: false,
                fnProcessData: assist._dataProcess
            },

            shanghui: {
                label: "商会",
                tip: "请输入商会关键字进行搜索并选择",
                minWidth: "300px",
                url: helper.url.getUrlByMapping("admin/backcommon/find_shanghuilists.shtml?x=0&y=20&name="),
                idField: "id",       //获取到的数据源中，key的字段
                keyField: "name",     //获取到的数据源中，value的字段
                dataField: "data",      //数据存放字段
                getDataMethod: "url",
                effectiveFields: ["name"],
                showHeader: false,
                fnProcessData: assist._dataProcess
            },

            usergroup: {
                label: "用户组",
                tip: "请输入用户组关键字进行搜索并选择",
                minWidth: "300px",
                url: helper.url.getUrlByMapping("admin/backcommon/find_usergrouplists.shtml"),
                idField: "id",       //获取到的数据源中，key的字段
                keyField: "name",     //获取到的数据源中，value的字段
                dataField: "data",      //数据存放字段
                getDataMethod: "firstByUrl",
                effectiveFields: ["name"],
                showHeader: false,
                fnProcessData: assist._dataProcess
            },

            circle: {
                label: "帮帮圈",
                tip: "请输入帮帮圈关键字进行搜索并选择",
                minWidth: "300px",
                url: helper.url.getUrlByMapping("admin/circle/find_circle_list.shtml?status=1&state=1&x=0&y=20&title="),
                idField: "id",       //获取到的数据源中，key的字段
                keyField: "title",     //获取到的数据源中，value的字段
                dataField: "data",      //数据存放字段
                imageField: "logo",     //图片字段，数据中生成"imageValue"（自动展示为图片）
                getDataMethod: "url",
                effectiveFields: ["imageValue", "title", "circle_zhu_name", "master_name"],
                effectiveFieldsAlias: {"imageValue": "LOGO", "title": "圈名", "circle_zhu_name": "圈主", "master_name": "创建人"},
                showHeader: true,
                fnProcessData: assist._dataProcess
            },

            user: {
                label: "用户",
                tip: "请输入用户姓名或机构关键字进行搜索并选择",
                minWidth: "350px",
                url: helper.url.getUrlByMapping("admin/backcommon/find_userlists.shtml?x=0&y=20&name="),
                idField: "id",               //获取到的数据源中，key的字段
                keyField: "name",           //获取到的数据源中，value的字段
                dataField: "data",                          //数据存放字段
                imageField: "image",                        //图片字段，数据中生成"imageValue"（自动展示为图片）
                tagFields: ["user_identity"],                  //标签字段，选中后自动显示
                // mergerFields: ["name", "user_identity"],     //合并字段，数据中生成"mergerValue"（用于作为选中后显示的字段）
                getDataMethod: "url",
                effectiveFields: ["imageValue", "name", "company", "companywork"],
                effectiveFieldsAlias: {"imageValue": "头像", "name": "姓名", "companywork": "职务", "company": "单位"},
                showHeader: true,
                fnProcessData: assist._dataProcess
            }
        }
    };

    /**
     * 构建选择器
     * @param options
     */
    function selector(options) {
        this.options = $.extend(true, {}, setting.defaultOptions, options);
        $.extend(this, this.options);
        this.defaultImage = setting.defaultImage;

        this.types = setting.types;
        this.typeInfo = this.types[this.type];
        this.$container = $(this.container);
        this.$validator = this.validatorContainer ? $(this.validatorContainer) : null;
        this.$input = null;

        this.selectedData = this.data;
        this.hashMap = {};

        this.indexSelector = setting.indexSelector++;
        this._r = (new Date()).valueOf() + "-" + this.indexSelector;

        this.el = {
            inputSelector: "inputSelector" + this._r,
            image: "image" + this._r,
            tag: "tag" + this._r
        };

        this.init();
    }

    /**
     * 初始化选择器
     */
    selector.prototype.init = function () {
        this.$container.empty().html(this._getTemplate());
        this.$input = $("#" + this.el.inputSelector);

        //IE BUG初始化会强制触发事件，延时构建选择器
        setTimeout(callFun(this._buildSelector, this), 10);
    };

    /**
     * 初始化选择器
     */
    selector.prototype._buildSelector = function () {
        var options = $.extend(true, this.typeInfo);
        options.fnProcessData = callFun(options.fnProcessData, this);
        
        //防止回车刷新
        $("form").submit(function(e) {  
            return false;  
        });
        
        this.$input.bsSuggest('init', options)
            .on('onSetSelectValue', callFun(this._selectedValue, this))
            .on('onUnsetSelectValue', callFun(this._unSelectedValue, this));

        if(this.readonly){
            //只读模式
            this.$input.bsSuggest("disable");
        }

        this._addValidator();
    };

    /**
     * 选中事件
     * @param el
     * @param event
     * @param keyword
     * @param data
     * @private
     */
    selector.prototype._selectedValue = function (el, event, keyword, data) {
        this.selectedData = {
            key: keyword.id,
            value: keyword.key,
            data: $.extend(true, {}, data)
        };
        if(this.typeInfo.imageField){
            //存在图片
            $("#" + this.el.image).html(data.imageValue);
        }
        if(this.typeInfo.tagFields){
            //存在标签
            $("#" + this.el.tag).html(data.tagValue);
        }

        if(this.$validator){
            this.$validator.data("bootstrapValidator").updateStatus(this.el.inputSelector,  "NOT_VALIDATED",  null );
        }

        if(this.callback && this.callback instanceof Function)
            this.callback($.extend(true, {}, this.selectedData));
    };

    /**
     * 未选中事件
     * @private
     */
    selector.prototype._unSelectedValue = function () {
        this.selectedData = null;

        if(this.typeInfo.imageField){
            //存在图片
            $("#" + this.el.image).html(this.defaultImage);
        }
        if(this.typeInfo.tagFields){
            //存在标签
            $("#" + this.el.tag).empty();
        }

        if(this.unSelectCallback && this.unSelectCallback instanceof Function)
            this.unSelectCallback();
    };

    /**
     * 动态添加bootstrap-validator的验证项
     * @private
     */
    selector.prototype._addValidator = function () {
        if(!this.$validator) return;

        var _this = this;
        var valid = this.$validator.data("bootstrapValidator");
        valid.addField(this.el.inputSelector, {
            message: this.typeInfo.label + '验证不通过',
            validators: {
                callback: {
                    message: '您还未选择' + this.typeInfo.label,
                    callback: function (value, validator) {
                        if(!value || value.trim() === "") return false;

                        if(!_this.selectedData) return false;

                        if(_this.data && _this.selectedData.key == _this.data.key && _this.selectedData.value == _this.data.value) return true;

                        for(var k in _this.hashMap){
                            if(_this.hashMap[k][_this.typeInfo["keyField"]] == value)
                                return true;
                        }

                        return false;
                    }
                }
            }
        });

        this.$container.find(".form-control-feedback").css("right", "0px");
    };

    /**
     * 获取html模板
     */
    selector.prototype._getTemplate = function () {
        var template = '<div class="form-group" style="margin: 0px;"><div class="input-group">';
        if(this.typeInfo.imageField){
            template += '<div class="input-group-btn">'
                +'<label id="{image}" style="width:34px;height:34px;margin-bottom:5px;background:#eee;overflow:hidden;color:#fff;" for="{inputSelector}">{defaultImage}</label></div>';
        }

        if(this.typeInfo.tagFields){
            template += '<div id="{tag}" style="position:absolute;top:8px;right:35px;z-index:100;"></div>';
        }

        template += '<input type="text" class="form-control" id="{inputSelector}" name="{inputSelector}" value="{selectedValue}" placeholder="{tip}" style="min-width:{minWidth};" />'
            +'<div class="input-group-btn">'
            +'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>'
            +'<ul class="dropdown-menu dropdown-menu-right" role="menu"></ul>'
            +'</div>';

        template += '</div></div>';

        var format = $.extend({
            tip: this.typeInfo.tip,
            defaultImage: this.defaultImage,
            selectedValue: this.data ? this.data.value : "",
            minWidth: this.typeInfo.minWidth ? this.typeInfo.minWidth : "auto"
        }, this.el);
        return template.Format(format);
    };

    /**
     * 【提供外部调用】获取选择器选中的数据
     * @returns {*}
     */
    selector.prototype.getValue = function () {
        return $.extend(true, {}, this.selectedData);
    };

    return selector;
}));