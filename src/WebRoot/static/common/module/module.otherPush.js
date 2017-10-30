/**
 * Created by xiegy on 2017/4/26.
 * 推送组件，包含：信息流推送、移动设备推送
 * 依赖文件lib下的jQuery、bootstrap、datetimepicker、icheck、treeview、layer、summernote（设备推送组件用到）
 * common下的helper.js
 * common/module下的module.multSelector.js、module.editor
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD规范
        define(['base','jquery','helper','module.multSelector','module.editor','iCheckPlus','treeview','summernote','datetimepicker'], factory);
    } else {
        if (typeof module === 'object' && module.exports) {
            // Node/CommonJS
            module.exports = factory(require('base'), require('jquery'), require('helper'), require('module.multSelector'), require('module.editor'),
                require('iCheckPlus'), require('treeview'), require('summernote'), require('datetimepicker'));
        } else {
            //未引入requirejs、commonjs等
            window.module = window.module || {};
            window.module.push = factory(null, window.jQuery, window.helper, window.module.multSelector, window.module.editor, window.iCheck);
        }
    }
}(function (bs, $, helper, multSelector, editor, iCheck) {
    var module = window.module || {};
    module.multSelector = multSelector;
    module.editor = editor;

    function noop(){};
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

    var push = {};
    /**
     * 信息流默认推送取值枚举对象
     * @type {{none: {code: number, label: string}, circle: {code: number, label: string}, activity: {code: number, label: string}, topic: {code: number, label: string}, default: {code: number, label: string}}}
     */
    push.pushEnum = {
        none: {code: 0, label: "无"},
        circle: {code: 11, label: "关注圈子的人"},
        activity: {code:4, label: "关注活动的人"},
        topic: {code: 5, label: "关注话题的人"},
        topicActivity: {code: null, label: "关注话题的人/关注活动的人"},
        all: {code: 1, label: "全部用户"},
        default: {code: 1, label: "默认推送"}
    };

    push.setting = {};

    /**
     * 推送默认配置
     * @type {{container: string, readonly: number, defaultPush: {selected: number, value: (*)}, range: {selected: number, alluser: number, shanghui: Array, industry: [*], region: Array, nativeplace: Array, usergroup: Array, circle: Array, user: Array}, smallTop: {selected: number, position: number, startTime: string, endTime: string}, bigTop: {selected: number, startTime: string, endTime: string}, formData: {}, initCompleteCallback: null}}
     */
    push.setting.defaultOptions = {
        //信息流推送的容器
        container: "body",
        readonly: 0,
        validatorContainer: "", //外部的验证器对象
        //默认推送
        defaultPush: {
            /**
             * 是否默认推送，1：是，0：否
             */
            selected: 1,
            /**
             * 默认推送的范围，push.pushEnum中取值
             */
            value: push.pushEnum.default
        },
        //额外推送
        range: {
            /**
             * 是否额外推送，1：是，0：否
             */
            selected: 0,
            /**
             * 是否全部用户，1：全部，0：非全部
             */
            alluser: 0,
            /**
             * 推送的商会列表，数组对象，对象为{key: 1, value: "商会名称"}结构
             */
            shanghui: [],
            /**
             * 推送的行业列表，数组对象，对象为{key: 1, value: "行业名称"}结构
             */
            industry: [],
            /**
             * 推送的地区列表，数组对象，对象为{key: 1, value: "地名"}结构
             */
            region: [],
            /**
             * 推送的家乡/籍贯列表，数组对象，对象为{key: 1, value: "地名"}结构
             */
            nativeplace: [],
            /**
             * 推送的用户组列表，数组对象，对象为{key: 1, value: "组名"}结构
             */
            usergroup: [],
            /**
             * 推送的帮帮圈列表，数组对象，对象为{key: 1, value: "圈名"}结构
             */
            circle: [],
            /**
             * 推送的用户列表，数组对象，对象为{key: 1, value: "姓名"}结构
             */
            user: []
        },
        //小置顶
        smallTop: {
            /**
             * 是否小置顶，1：是，0：否
             */
            selected: 0,
            /**
             * 小置顶的位置
             */
            position: 3,
            /**
             * 小置顶的开始时间，"yyyy-MM-dd hh:mm:ss"格式
             */
            startTime: "",
            /**
             * 小置顶的结束时间，"yyyy-MM-dd hh:mm:ss"格式
             */
            endTime: ""
        },
        //大置顶
        bigTop: {
            /**
             * 是否大置顶，1：是，0：否
             */
            selected: 0,
            /**
             * 大置顶的开始时间，"yyyy-MM-dd hh:mm:ss"格式
             */
            startTime: "",
            /**
             * 大置顶的结束时间，"yyyy-MM-dd hh:mm:ss"格式
             */
            endTime: ""
        },
        //用于ajax的数据与组件data数据的映射关系
        formData: {},
        //初始化完成后的回调函数
        initCompleteCallback: null
    };

    /**
     * 选择组件设置（multSelector.js）
     * @type {{shanghui: {label: string, title: string, url: (*), dataC: string, keyC: string, valueC: string, pkeyC: string, keywordC: string, searchType: number}, industry: {label: string, title: string, url: (*), dataC: string, keyC: string, valueC: string, pkeyC: string, keywordC: string, searchType: number}, region: {label: string, title: string, url: (*), keyC: string, valueC: string, pkeyC: string, keywordC: string}, nativeplace: {label: string, title: string, url: (*), keyC: string, valueC: string, pkeyC: string, keywordC: string}, usergroup: {label: string, title: string, url: (*), dataC: string, keyC: string, valueC: string, pkeyC: string, keywordC: string, searchType: number}, circle: {label: string, title: string, url: (*), dataC: string, keyC: string, valueC: string, pkeyC: string, keywordC: string, searchType: number}, user: {label: string, title: string, url: (*), dataC: string, keyC: string, valueC: string, tagsC: string, pkeyC: string, keywordC: string, searchType: number}}}
     */
    push.setting.rangeSetting = {
        shanghui: {
            label: "&nbsp;&nbsp;&nbsp;&nbsp;商会",
            title: "请选择要推送的商会",
            url: helper.url.getUrlByMapping("admin/backcommon/find_shanghuilists.shtml?x=0&y=100"),
            dataC: "data",
            keyC: "id",
            valueC: "name",
            pkeyC: "",
            keywordC: "name",
            searchType: 1
        },
        industry: {
            label: "&nbsp;&nbsp;&nbsp;&nbsp;行业",
            title: "请选择要推送的行业",
            url: helper.url.getUrlByMapping("admin/backcommon/find_industrylists.shtml"),
            dataC: "data",
            keyC: "id",
            valueC: "name",
            pkeyC: "",
            keywordC: "name",
            searchType: 1
        },
        region: {
            label: "&nbsp;&nbsp;&nbsp;&nbsp;地区",
            title: "请选择要推送的地区",
            url: helper.url.getUrlByMapping("static/common/data/cityData.json"),
            keyC: "ID",
            valueC: "Name",
            pkeyC: "ParentId",
            keywordC: "Name"
        },
        nativeplace: {
            label: "&nbsp;&nbsp;&nbsp;&nbsp;家乡",
            title: "请选择要推送的家乡",
            url: helper.url.getUrlByMapping("static/common/data/cityData.json"),
            keyC: "ID",
            valueC: "Name",
            pkeyC: "ParentId",
            keywordC: "Name"
        },
        usergroup: {
            label: "用户组",
            title: "请选择要推送的用户组",
            url: helper.url.getUrlByMapping("admin/backcommon/find_usergrouplists.shtml?x=0&y=100"),
            dataC: "data",
            keyC: "id",
            valueC: "name",
            pkeyC: "",
            keywordC: "name",
            searchType: 1
        },
        circle: {
            label: "帮帮圈",
            title: "请选择要推送的帮帮圈",
            url: helper.url.getUrlByMapping("admin/circle/find_circle_list.shtml?status=1&state=1&x=0&y=100"),
            dataC: "data",
            keyC: "id",
            valueC: "title",
            pkeyC: "",
            keywordC: "title",
            searchType: 1
        },
        user: {
            label: "&nbsp;&nbsp;&nbsp;&nbsp;用户",
            title: "请选择要推送的用户",
            url: helper.url.getUrlByMapping("admin/backcommon/find_userlists.shtml?x=0&y=100"),
            dataC: "data",
            keyC: "id",
            valueC: "name",
            tagsC: "company",
            pkeyC: "",
            keywordC: "name",
            searchType: 1
        }
    };

    /**
     * 信息流推送选项的配置（与ajax字段映射关系）
     * @type {{is_default: string, is_extra_push: string, all_user: string, sh_ids: {array: string, key: string}, sh_names: {array: string, key: string}, industry_ids: {array: string, key: string}, industry_names: {array: string, key: string}, region_ids: {array: string, key: string}, region_names: {array: string, key: string}, nativeplace_ids: {array: string, key: string}, nativeplace_names: {array: string, key: string}, usergroup_ids: {array: string, key: string}, usergroup_names: {array: string, key: string}, circle_ids: {array: string, key: string}, circle_names: {array: string, key: string}, user_ids: {array: string, key: string}, user_names: {array: string, key: string}, small_top: string, small_start_time: {key: string, type: string}, small_end_time: {key: string, type: string}, display_position: string, big_top: string, big_start_time: {key: string, type: string}, big_end_time: {key: string, type: string}}}
     */
    push.setting.feedFormDataMap = {
        "is_default": "defaultPush.selected",
        "is_extra_push": "range.selected",
        "all_user": "range.alluser",
        "sh_ids": {array:"range.shanghui", key: "key"},
        "sh_names": {array:"range.shanghui", key: "value"},
        "industry_ids": {array:"range.industry", key: "key"},
        "industry_names": {array:"range.industry", key: "value"},
        "region_ids": {array:"range.region", key: "key"},
        "region_names": {array:"range.region", key: "value"},
        "nativeplace_ids": {array:"range.nativeplace", key: "key"},
        "nativeplace_names": {array:"range.nativeplace", key: "value"},
        "usergroup_ids": {array:"range.usergroup", key: "key"},
        "usergroup_names": {array:"range.usergroup", key: "value"},
        "circle_ids": {array:"range.circle", key: "key"},
        "circle_names": {array:"range.circle", key: "value"},
        "user_ids": {array:"range.user", key: "key"},
        "user_names": {array:"range.user", key: "value"},
        "small_top": "smallTop.selected",
        "small_start_time": {key: "smallTop.startTime", type: "Timestamp"},
        "small_end_time": {key: "smallTop.endTime", type: "Timestamp"},
        "display_position": "smallTop.position",
        "big_top": "bigTop.selected",
        "big_start_time": {key: "bigTop.startTime", type: "Timestamp"},
        "big_end_time": {key: "bigTop.endTime", type: "Timestamp"}
    };

    /**
     * 设备推送选项的配置（与ajax字段的映射关系）
     * @type {{sb_all_user: string, sb_sh_ids: {array: string, key: string}, sb_sh_names: {array: string, key: string}, sb_industry_ids: {array: string, key: string}, sb_industry_names: {array: string, key: string}, sb_region_ids: {array: string, key: string}, sb_region_names: {array: string, key: string}, sb_nativeplace_ids: {array: string, key: string}, sb_nativeplace_names: {array: string, key: string}, sb_usergroup_ids: {array: string, key: string}, sb_usergroup_names: {array: string, key: string}, sb_circle_ids: {array: string, key: string}, sb_circle_names: {array: string, key: string}, sb_user_ids: {array: string, key: string}, sb_user_names: {array: string, key: string}, sb_title_imei: string, sb_content_imei: string}}
     */
    push.setting.mobileFormDataMap = {
        "sb_all_user": "range.alluser",
        "sb_sh_ids": {array:"range.shanghui", key: "key"},
        "sb_sh_names": {array:"range.shanghui", key: "value"},
        "sb_industry_ids": {array:"range.industry", key: "key"},
        "sb_industry_names": {array:"range.industry", key: "value"},
        "sb_region_ids": {array:"range.region", key: "key"},
        "sb_region_names": {array:"range.region", key: "value"},
        "sb_nativeplace_ids": {array:"range.nativeplace", key: "key"},
        "sb_nativeplace_names": {array:"range.nativeplace", key: "value"},
        "sb_usergroup_ids": {array:"range.usergroup", key: "key"},
        "sb_usergroup_names": {array:"range.usergroup", key: "value"},
        "sb_circle_ids": {array:"range.circle", key: "key"},
        "sb_circle_names": {array:"range.circle", key: "value"},
        "sb_user_ids": {array:"range.user", key: "key"},
        "sb_user_names": {array:"range.user", key: "value"},
        "sb_title_imei": "msgTitle",
        "sb_content_imei": "msgContent"
    };


    /**
     * 数据转换（从ajax取得的数据格式转换成页面所需要加载用的数据格式）
     * @param infoData
     * @param pushData
     */
    push.dataTransForm = function(infoData, pushData) {
        var info = {data: {}, feedData: {}, mobileData: {}};
        var feed, mobile;

        info.data = infoData;
        if(!pushData || !(pushData instanceof Array)) return data;
        for(var i = 0; i < pushData.length; i++){
            if(!pushData[i]) continue;
            if(pushData[i]["is_push_type"] == "1"){
                //信息流推送
                feed = pushData[i];
                // if(feed["feedTmpList"] && feed["feedTmpList"] instanceof Array){
                //     //大小置顶的数据转换
                //     for(var j = 0; j < feed["feedTmpList"].length; j++){
                //         if(feed["feedTmpList"][j].type == "1"){
                //             //小置顶
                //             feed["small_top"] = "1";
                //             feed["small_start_time"] = feed["feedTmpList"][j]["start_time"];
                //             feed["small_end_time"] = feed["feedTmpList"][j]["end_time"];
                //             feed["display_position"] = feed["feedTmpList"][j]["display_position"];
                //         }
                //         else if(feed["feedTmpList"][j].type == "2"){
                //             //大置顶
                //             feed["big_top"] = "1";
                //             feed["big_start_time"] = feed["feedTmpList"][j]["start_time"];
                //             feed["big_end_time"] = feed["feedTmpList"][j]["end_time"];
                //         }
                //     }
                // }
                info.feedData = feed;
                continue;
            }
            if(pushData[i]["is_push_type"] == "2"){
                //设备推送
                mobile = {};
                for(var key in pushData[i]){
                    mobile["sb_" + key] = pushData[i][key];
                }
                info.mobileData = mobile;
                continue;
            }
        }

        return info;
    };


    /**
     * 推送组件基类
     * @param options
     */
    var base = function(options){
        this._r = (new Date()).valueOf();

        options = $.extend(true, {}, this.defaultOptions, options);
        this.options = options;

        this.container = this.options.container;
        this.validator = this.options.validatorContainer;
        this.$container = $(this.container);
        this.data = this.options;
        this.formData = this.options.formData;
        this.readonly = this.options.readonly;
    };

    base.prototype.init = noop;

    //获取通用推送范围模板
    base.prototype.getUserPushTemplate = function () {
        var data = this.data.range;
        var _r = this._r;
        var temlpate = '<div class="radio i-checks">'
            +'<label for="radPushAllUser{r}">'
            +'<input id="radPushAllUser{r}" name="radPushAllUser{r}" type="radio" data-model="range.alluser" value="1"{allChecked} />全部用户</label></div>'
            +'<div class="radio i-checks">'
            +'<label for="radPushPartUser{r}">'
            +'<input id="radPushPartUser{r}" name="radPushAllUser{r}" data-toggle="#divPartUserPanel{r}" type="radio" data-model="range.alluser" value="0"{partChecked} />部分用户</label></div>'
            +'<div id="divPartUserPanel{r}" class="row m-l-lg">';
        temlpate = temlpate.Format({
            r: this._r,
            allChecked: data.alluser == 1 ? ' checked="checked"': '',
            partChecked: data.alluser == 0 ? ' checked="checked"' : ''
        });

        for(var item in this.rangeSetting){
            var rangeValues = this.getRangeValues(item);
            rangeValues = rangeValues ? rangeValues : "未选择";
            temlpate += '<div class="{0} m-xs">'.Format(rangeValues != "未选择" ? "text-info" : "text-muted")
                +'<span class="font-bold m-l-sm text-right m-r-xs">{0}：</span>'.Format(this.rangeSetting[item].label)
                +'<button type="button" class="btn btn-xs btn-warning btn-outline" data-range="{0}"><i class="glyphicon glyphicon-plus"></i>&nbsp;选择</button>'.Format(item)
                +'<span id="span{0}{1}" class="m-l-xs">{2}</span></div>'.Format(item, _r, rangeValues);
        }
        temlpate += '</div>';

        return temlpate;
    };
    //初始化各类事件
    base.prototype.initModuleEvent = function () {
        //调用iCheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
        iCheck.toggle.init(this.$container);

        //初始化选择器
        this._initSelector();
        //初始化数据单向绑定（DOM->数据源）
        this._initModelBinding();
        this._initShowStatus();
    };

    /**
     * 初始化选择器
     * @private
     */
    base.prototype._initSelector = function(){
        var _this = this;
        this.$container.find("button[data-range]").click(function () {
            var rangeKey = $(this).attr("data-range");
            var data = _this.rangeSetting[rangeKey];
            if(!data) return;

            data = $.extend(true, {}, data, {
                selectedData: _this.data.range[rangeKey],
                callback: function (d) {
                    var obj = {range: {}};
                    obj.range[rangeKey] = $.extend([], d);
                    _this.setData(obj, 1);
                }
            });

            new module.multSelector(data);
        })
    };

    //初始化数据与input单向绑定（DOM->实例data的绑定），即页面操作变更后数据同步更新到组件data
    base.prototype._initModelBinding = function () {
        this.$container.find("input:not(:checkbox):not(:radio)").change(callFun(this._inputChange, this));
        this.$container.find(".i-checks").on("ifChanged", callFun(this._inputChange, this));
    };
    base.prototype._inputChange = function (target) {
        var $input = $(target);
        if($input.get(0).tagName.toLowerCase() != "input"){
            $input = $input.find("input");
        }

        //如果为radio且未选择，则不做任何处理（该情况是radio切换产生的事件）
        if($input.is(":radio") && !$input.is(":checked")) return;

        var model = $input.attr("data-model");
        if(!model) return;

        var arr = model.split(".");
        var modelObj = this.data;
        for(var i = 0; i < arr.length - 1; i++){
            if(!modelObj[arr[i]] || !(modelObj[arr[i]] instanceof Object)) return;

            modelObj = modelObj[arr[i]];
        }

        if($input.is(":checkbox") && !$input.is(":checked")){
            //如果为checkbox未选中时则设为0
            modelObj[arr[arr.length - 1]] = "0";
            return;
        }

        modelObj[arr[arr.length - 1]] = $input.val();
    };

    //初始化组件是否只读状态，将全部表单控件设置成只读
    base.prototype._initShowStatus = function () {
        if(this.readonly){
            var $ipt = this.$container.find(":input");
            $ipt.iCheck("disable");
            $ipt.attr("disabled", "disabled");
            this.$container.find("[contenteditable]").attr("contenteditable", false).attr("hasEdit", true);
            return;
        }
    };

    /**
     * 提供给组件调用外的接口，获取组件当前最新的数据情况，数据格式：组件的data对象
     */
    base.prototype.getData = function () {
        return $.extend(true, {}, this.data);
    };

    /**
     * 提供给组件外部调用的接口，设置组件data数据
     * @param data push.setting.defaultOptions或this.data数据对象结构
     * @param flag 是否重新加载组件，1：是，0：否，默认否
     */
    base.prototype.setData = function (data, flag) {
        this.data = $.extend(true, this.data, data);
        if(data && data.range){
            //数组不做深克隆，深克隆会保留原来的数据
            for(var key in data.range){
                this.data.range[key] = $.extend([], data.range[key]);
            }
        }
        // this.data = {
        //     defaultPush: $.extend(true, {}, data.defaultPush),
        //     range: $.extend(true, {}, data.range),
        //     smallTop: $.extend(true, {}, data.smallTop),
        //     bigTop: $.extend(true, {}, data.bigTop)
        // };

        if(flag)
            this.init();
    };

    /**
     * 提供给组件调用外的接口，获取组件当前最新的数据情况，数据格式：直接用于业务ajax请求的formData数据格式
     * 对应的映射关系：this.options.formDataMap
     * @param formData 如果有传递该对象进来，则在该对象上做数据扩充，并回传扩充后的formData数据格式，未传则返回全新的formData数据格式进来0
     */
    base.prototype.getFormData = function (formData) {
        if(!formData) formData = {};

        var map = this.options.formDataMap;
        for(var key in map){
            formData[key] = this._getMapData(map[key]);
        }
        
        return formData;
    };

    /**
     * 通过外部传入的formData，根据映射配置条件，变更组件data的数据
     * 对应的映射关系：this.options.formDataMap
     * @param formData
     * @param flag 是否重新加载组件，1：是，0：否，默认否
     */
    base.prototype.setFormData = function (formData, flag) {
        var map = this.options.formDataMap;

        var optObj = {};
        for(var key in map){
            if(formData[key] == undefined) continue;

            var arrayKey = map[key].array;
            if(map[key] instanceof Object && arrayKey){
                //json数组
                if(!optObj[arrayKey])
                    optObj[arrayKey] = [];
                optObj[arrayKey].push({"key": map[key].key, "value": formData[key]});
                continue;
            }

            this._setMapData(map[key], formData[key]);
        }

        for(var item in optObj){
            this._setMapData(item, optObj[item]);
        }

        if(flag){
            this.$container.empty();
            this.init();
        }
    };


    /**
     * 根据映射条件，获取映射对应的组件data对象或值
     * @param mapOption 映射条件
     * @param data 根据映射条件，从该对象取值
     * @param deepOffset 要获取的映射条件的级深偏移，默认0，mapOption=push.data.range.shanghui，push.data.range.shanghui，push.data.range，以此类推
     * @private
     */
    base.prototype._getMapData = function (mapOption, data, deepOffset) {
        data = data ? data : this.data;
        deepOffset = deepOffset ? deepOffset : 0;
        var type;

        //映射关系的类别是json对象
        if(mapOption instanceof Object){
            if(mapOption.array){
                //映射关系中存在json数组，将数组对应的值用","隔开并返回
                data = this._getMapData(mapOption.array, data);
                return this._getArrayJsonString(mapOption.key, data);
            }

            if(mapOption.type) type = mapOption.type;
            if(mapOption.key) mapOption = mapOption.key;
        }

        //映射关系的类别是字符串
        var arr = mapOption.split(".");
        for(var i = 0; i < arr.length - 1 - deepOffset; i++){
            if(!data[arr[i]] || !(data[arr[i]] instanceof Object)) return "";

            data = data[arr[i]];
        }

        data = data[arr[arr.length - 1 - deepOffset]];
        if(type == "Timestamp" && typeof data == "string"){
            //数值类型为时间戳格式
            data = helper.convert.formatTimestamp(data);
        }

        return data;
    };

    /**
     * 根据映射条件，设置映射对应的组件data对象或值
     * @param mapOption 映射条件
     * @param value 要设置的值到映射条件的值
     * @param data 根据映射条件，在该对象里查找子对象
     * @private
     */
    base.prototype._setMapData = function (mapOption, value, data) {
        data = data ? data : this.data;
        var type, i, j, temp;

        //映射关系的类别是数组
        if(value instanceof Array){
            //映射关系中存在json数组，将value数据中的","分隔，并设置到对象数组中
            data = this._getMapData(mapOption, data, 1);
            temp = mapOption.split(".");
            var _key =  temp[temp.length - 1];
            if(data[_key] instanceof Array){
                //准备重新整合json数组的元数据
                var newArr = [];
                var newValue = [];
                var newKey = [];
                var len = 0;
                temp = [];
                for(var item in value){
                    newKey.push(value[item].key);
                    temp = value[item].value.split(",");
                    newValue.push(temp);
                    len = Math.max(len, temp.length);
                }

                //重新整合json数组
                for(i = 0; i < len; i++){
                    var newObj = {};
                    for(j = 0; j < newKey.length; j++){
                        newObj[newKey[j]] = newValue[j][i] ? newValue[j][i] : "";
                    }
                    newArr.push(newObj);
                }
                data[_key] = newArr;
                return;
            }
        }

        //映射关系的类别是json对象
        if(mapOption instanceof Object){
            if(mapOption.type) type = mapOption.type;
            if(mapOption.key) mapOption = mapOption.key;
        }

        //映射关系的类别是字符串
        var arr = mapOption.split(".");
        for(i = 0; i < arr.length - 1; i++){
            if(!data[arr[i]] || !(data[arr[i]] instanceof Object)) return;

            data = data[arr[i]];
        }

        if(type == "Timestamp"){
            if(typeof value != "number"){
                value = isNaN(parseInt(value)) ? 0 : parseInt(value);
            }
            value = helper.convert.formatDate(value, "yyyy-MM-dd hh:mm");
        }

        if(data[arr[arr.length - 1]] != undefined)
            data[arr[arr.length - 1]] = value;
    };


    /**
     *  数据处理获取相关
     */
    //指定额外推送的k获取推送的key集合，以","隔开
    base.prototype.getRangeKeys = function (k) {
        return this._getArrayJsonString("key", this.data.range[k]);
    };
    //指定额外推送的k获取推送的名称集合，以","隔开
    base.prototype.getRangeValues = function (k) {console.log(this.data.range);
        return this._getArrayJsonString("value", this.data.range[k]);
    };

    /**
     * 从指定的键值对数组中，将指定key的内容返回
     * @param key 数组中，每个json对象要返回的key
     * @param array 指定的数组
     * @return {","隔开的字符串}
     */
    base.prototype._getArrayJsonString = function(key, arr){
        if(!arr) return "";
        var rtn = [];
        for(var i = 0; i < arr.length; i++){
            rtn.push(arr[i][key] ? arr[i][key] : "");
        }
        return rtn.join(",");
    };

    //推送范围的默认配置
    base.prototype.defaultOptions = push.setting.defaultOptions;
    //额外推送的标签名称
    base.prototype.rangeSetting = push.setting.rangeSetting;

    push.base = base;


    /**
     * 定义信息流推送类，继承自push.base类
     * @param options
     */
    var feedClass = function(options) {
        //继承base类的构造函数
        push.base.call(this, options);
        options = this.options;

        this.el = {
            chkDef: "chkDefaultPush" + this._r,
            chkRange: "chkRangePush" + this._r,
            divRange: "divRangePushPanel" + this._r,
            chkSm: "chkSmallTop" + this._r,
            divSm: "divSmallTopPanel" + this._r,
            smBT: "iptSmallTopST" + this._r,
            smET: "iptSmallTopET" + this._r,
            smPosition: "iptTopPosition" + this._r,
            chkBg: "chkBigTop" + this._r,
            divBg: "divBigTopPanel" + this._r,
            bgBT: "iptBigTopST" + this._r,
            bgET: "iptBigTopET" + this._r

        };

        this.data = {
            defaultPush: $.extend(true, {}, options.defaultPush),
            range: $.extend(true, {}, options.range),
            smallTop: $.extend(true, {}, options.smallTop),
            bigTop: $.extend(true, {}, options.bigTop)
        };
        //设置信息流推送的映射关系
        this.options.formDataMap = push.setting.feedFormDataMap;
        //初始化中如果传入了formData数据结构，则将该数据追加到覆盖数据中
        if(!(this.formData instanceof Function)){
            this.setFormData(this.formData);
        }

        this.init();
    };

    //继承base类的原型链
    feedClass.prototype = new push.base();
    //初始化信息流推送组件
    feedClass.prototype.init = function () {
        var html = [];
        html.push(this.getDefaultPushTemplate());
        html.push(this.getRangePushTemplate());
        //html.push(this.getSmallTopTemplate());
        //html.push(this.getBigTopTemplate());

        this.$container.empty().html(html.join("")).addClass("form-horizontal");

        //初始化各类事件
        this.initModuleEvent();
        this._initDateEvent();
        //this._addValidator();

        //执行回调函数
        if(this.options.initCompleteCallback){
            this.options.initCompleteCallback.call(this, $.extend(true, {}, this.data));
        }
    };

    //初始化日期选择器
    feedClass.prototype._initDateEvent = function () {
        var _this = this;
        this.$container.find(".form_date").datetimepicker({
            format: "yyyy-mm-dd hh:ii",
            weekStart: 1,
            todayBtn:  true,    //是否显示今天按钮
            autoclose: true,    //选择后自动关闭
            todayHighlight: true,   //高亮显示今天日期
            startView: 2,           //从月视图开始显示
            minView: 0,             //最小显示到视图，0：小时视图，1：日视图，2：月视图
            minuteStep: 15,         //小时视图的分钟步长
            forceParse: true        //选择日期不符合要求时尽可能自动转换成符合的
        }).on("click", function (e) {
            //设置日期控件前后日期的依赖
            var $this = $(e.target);
            if($this.attr("data-start")){
                var startTime = $this.attr("data-start") == "now" ? new Date() : $($this.attr("data-start")).val();
                $this.datetimepicker("setStartDate", startTime);
            }
            if($this.attr("data-end")){
                // var endTime = $($this.attr("data-end")).val();
                var endTime = $this.attr("data-end") == "now" ? new Date() : $($this.attr("data-end")).val();
                $this.datetimepicker("setEndDate", endTime);
            }
        }).on("change", function (e) {
            if(_this.validator){
                var name = $(e.target).attr("name");
                $(_this.validator).data("bootstrapValidator").updateStatus(name, "NOT_VALIDATED").validate(name);
            }
        });
    };

    /**
     * 验证器
     * @private
     */
    /*feedClass.prototype._addValidator = function () {
        if(!this.validator) return;

        var valid = $(this.validator).data("bootstrapValidator");

        valid.addField(this.el.smBT, this._getDateValidator("小置顶的开始日期"))
            .addField(this.el.smET, this._getDateValidator("小置顶的结束日期"))
            .addField(this.el.bgBT, this._getDateValidator("大置顶的开始日期"))
            .addField(this.el.bgET, this._getDateValidator("大置顶的结束日期"))
            .addField(this.el.smPosition, {
                validators: {
                    notEmpty: {
                        message: '请输入小置顶的位置'
                    },
                    regexp: {
                        regexp: /^[1-9]$/,
                        message: '小置顶位置位置只能在数字【1-9】之间'
                    }
                }
            });
    };*/
    feedClass.prototype._getDateValidator = function (label) {
        return {
            validators: {
                callback: {
                    message: '请选择' + label,
                    callback: function (value, validator) {
                        var result = value !== "";
                        return result;
                    }
                }
            }
        };
    };

    //获取默认推送范围模板
    feedClass.prototype.getDefaultPushTemplate = function () {
        var template = '<div class="form-group">'
            +'<label class="col-sm-2 control-label">默认推送范围：</label>'
            +'<div class="col-sm-9">'
            +'<div class="checkbox i-checks">'
            +'<label for="{chkDef}">'
            +'<input id="{chkDef}" name="{chkDef}" type="checkbox" data-model="defaultPush.selected" value="1"{checked} />{label}'
            +'</label></div></div></div>';
        var dp = this.data.defaultPush;
        var kv = dp.value instanceof Object ? dp.value : push.pushEnum.default;

        var formatData = {
            chkDef: this.el.chkDef,
            label: kv.label,
            checked: Number(dp.selected) ? ' checked="checked"' : ''
        };
        return template.Format(formatData);
    };
    //获取额外推送范围模板
    feedClass.prototype.getRangePushTemplate = function () {
        var template = '<div class="form-group">'
            +'<label class="col-sm-2 control-label">额外推送范围：</label>'
            +'<div class="col-sm-9">'
            +'<div class="checkbox i-checks">'
            +'<label for="{chkRange}">'
            +'<input id="{chkRange}" name="{chkRange}" type="checkbox" data-model="range.selected" data-toggle="#{divRange}" data-showType="disabled" value="1"{checked} />额外推送'
            +'</label></div>'
            +'<div id="{divRange}" class="row m-l-lg">';

        template = template.Format({
            chkRange: this.el.chkRange,
            divRange: this.el.divRange,
            checked: (Number(this.data.range.selected) ? ' checked="checked"' : '')
        });

        template += this.getUserPushTemplate();
        template += '</div></div></div>';

        return template;
    };
    //获取小置顶模板
    /*feedClass.prototype.getSmallTopTemplate = function () {
        var template = '<div class="form-group">'
            +'<label class="col-sm-2 control-label">小置顶：</label>'
            +'<div class="col-sm-9">'
            +'<div class="form-inline m-l-md">'
            +'<div class="checkbox i-checks">'
            +'<label for="{chkSm}">'
            +'<input id="{chkSm}" name="{chkSm}" type="checkbox" data-model="smallTop.selected" data-toggle="#{divSm}" data-showType="disabled" value="1"{checked} />启用&nbsp;&nbsp;&nbsp;&nbsp;</label></div>'
            +'<div id="{divSm}" class="input-group">'
            +'<input id="{smBT}" name="{smBT}" class="form-control form_date" type="text" data-model="smallTop.startTime" data-start="now" data-end="#{smET}" value="{startTime}" placeholder="开始日期" />'
            +'<label for="{smBT}" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>'
            +'<label class="input-group-addon">至</label>'
            +'<input id="{smET}" name="{smET}" class="form-control form_date" type="text" data-model="smallTop.endTime" data-start="#{smBT}" value="{endTime}" placeholder="结束日期" />'
            +'<label for="{smET}" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>'
            +'<label for="{smPosition}" class="input-group-addon"><i class="glyphicon glyphicon-pushpin"></i>&nbsp;&nbsp;置顶位置：</label>'
            +'<input id="{smPosition}" name="{smPosition}" type="text" class="form-control" value="{position}" data-model="smallTop.position" placeholder="请输入置顶位置" />'
            +'</div></div></div></div>';
        var data = this.data.smallTop;

        return template.Format({
            chkSm: this.el.chkSm,
            chkBg: this.el.chkBg,
            divSm: this.el.divSm,
            smBT: this.el.smBT,
            smET: this.el.smET,
            smPosition: this.el.smPosition,
            checked: Number(data.selected) ? ' checked="checked"' : '',
            startTime: data.startTime,
            endTime: data.endTime,
            position: data.position
        });
    };*/
    //获取大置顶模板
    /*feedClass.prototype.getBigTopTemplate = function () {
        var template = '<div class="form-group">'
            +'<label class="col-sm-2 control-label">大置顶：</label>'
            +'<div class="col-sm-9">'
            +'<div class="form-inline m-l-md">'
            +'<div class="checkbox i-checks">'
            +'<label for="{chkBg}">'
            +'<input id="{chkBg}" name="{chkBg}" type="checkbox" data-model="bigTop.selected" data-toggle="#{divBg}" data-showType="disabled" value="1"{checked} />启用&nbsp;&nbsp;&nbsp;&nbsp;</label></div>'
            +'<div id="{divBg}" class="input-group">'
            +'<input id="{bgBT}" name="{bgBT}" class="form-control form_date" type="text" data-model="bigTop.startTime" data-start="now" data-end="#{bgET}" value="{startTime}" placeholder="开始日期" />'
            +'<label for="{bgBT}" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>'
            +'<label class="input-group-addon">至</label>'
            +'<input id="{bgET}" name="{bgET}" class="form-control form_date" type="text" data-model="bigTop.endTime" data-start="#{bgBT}" value="{endTime}" placeholder="结束日期" />'
            +'<label for="{bgET}" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>'
            +'</div></div></div></div>';
        var data = this.data.bigTop;

        return template.Format({
            chkBg: this.el.chkBg,
            divBg: this.el.divBg,
            bgBT: this.el.bgBT,
            bgET: this.el.bgET,
            checked: Number(data.selected) ? ' checked="checked"' : '',
            startTime: data.startTime,
            endTime: data.endTime
        });

    };*/

    push.feed = feedClass;


    /**
     * 定义设备推送类，继承自push.base类
     * @param options
     */
    var mobileClass = function(options) {
        //继承base类的构造函数
        push.base.call(this, options);
        options = this.options;
        this.data = {
            msgTitle: options.msgTitle ? options.msgTitle : "",
            msgContent: options.msgContent ? options.msgContent : "",
            range: $.extend(true, {}, options.range)
        };
        this.editor = null;

        //设置信息流推送的映射关系
        this.options.formDataMap = push.setting.mobileFormDataMap;
        //初始化中如果传入了formData数据结构，则将该数据追加到覆盖数据中
        if(!(this.formData instanceof Function)){
            this.setFormData(this.formData);
        }

        this.init();
    };

    //继承base类的原型链
    mobileClass.prototype = new push.base();
    //初始化设备推送组件
    mobileClass.prototype.init = function () {
        var html = [];
        html.push(this.getRangeTemplate());
        html.push(this.getContentTemplate());

        this.$container.empty().html(html.join("")).addClass("form-horizontal");

        //初始化各类事件
        this._initContent();
        this.initModuleEvent();
        this._addValidator();

        //执行回调函数
        if(this.options.initCompleteCallback){
            this.options.initCompleteCallback.call(this, $.extend(true, {}, this.data));
        }
    };

    //初始化富文本编辑器
    mobileClass.prototype._initContent = function () {
        var _this = this;
        this.editor = new module.editor({
            container: "#objEditer" + this._r,
            validatorContainer: this.validator,
            height: 200,
            value: this.data.msgContent,
            callback: function (value) {
                if(_this.data.msgContent != value){
                    _this.data.msgContent = value;
                }

                if(_this.validator){
                    _this.setValid(value !== "");
                }
            }
        });
    };

    //添加验证器
    mobileClass.prototype._addValidator = function () {
        if(!this.validator) return;

        var _this = this;
        var valid = $(this.validator).data("bootstrapValidator");
        valid.addField("txtTitle" + this._r, {
            validators: {
                callback: {
                    message: '通知栏内容和推送消息内容请至少填写一个，且通知栏内容不能超过100个字',
                    callback: function (value, validator) {
                        var result = (value.trim() !== "" && value.length <= 100) || _this.editor.getValue().length > 0;
                        _this.editor.setValid(result);

                        return result;
                    }
                }
            }
        });
    };

    /**
     * 设置验证器是否通过或重新验证
     * @param isPassOrReValid。ture：pass；false：reCalid
     */
    mobileClass.prototype.setValid = function (isPassOrReValid) {
        var valid;
        if(this.validator && (valid = $(this.validator).data("bootstrapValidator"))){
            var name = "txtTitle" + this._r;
            valid.updateStatus(name, isPassOrReValid ? "VALID" : "NOT_VALIDATED");
            if(!isPassOrReValid) {
                setTimeout(function () {
                    valid.validate(name);
                });
            }
        }
    };

    //获取提醒推送范围模板
    mobileClass.prototype.getRangeTemplate = function () {
        var template = '<div class="form-group">'
            +'<label class="col-sm-2 control-label">提醒对象：</label>'
            +'<div class="col-sm-9">'
            +'<div class="radio i-checks">'
            +'<label for="radNoPush{r}">'
            +'<input id="radNoPush{r}" name="radPushAllUser{r}" type="radio" data-model="range.alluser" data-toggle="#divContentPanel{r}" data-showType="disabled" data-reverse="true" value="2"{checked} />不提醒</label></div>'
        template = template.Format({r: this._r, checked: this.data.range.alluser == 2 ? ' checked="checked"' : ''});
        template += this.getUserPushTemplate();
        template += '</div></div>';

        return template;
    };
    //获取提醒内容模板
    mobileClass.prototype.getContentTemplate = function () {
        var template = '<div id="divContentPanel{r}">'
            +'<div class="form-group"><label class="col-sm-2 control-label">通知栏内容：</label>'
            +'<div class="col-sm-9">'
            +'<input id="txtTitle{r}" name="txtTitle{r}" type="text" class="form-control" value="{msgTitle}" data-model="msgTitle" placeholder="请输入通知栏内容，120字以内"></div></div>'
            +'<div class="form-group"><label class="col-sm-2 control-label">消息内容：</label>'
            +'<div class="col-sm-9"><div id="objEditer{r}"></div>'
            +'</div></div></div>';
        return template.Format({r: this._r, msgTitle: this.data.msgTitle});
    };

    push.mobile = mobileClass;

    return push;
}));