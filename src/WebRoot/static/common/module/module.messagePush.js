(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD规范
        define(['base','jquery','helper','module.multSelector','iCheckPlus','treeview','datetimepicker'], factory);
    } else {
        if (typeof module === 'object' && module.exports) {
            // Node/CommonJS
            module.exports = factory(require('base'), require('jquery'), require('helper'), require('module.multSelector'),
                require('iCheckPlus'), require('treeview'), require('datetimepicker'));
        } else {
            //未引入requirejs、commonjs等
            window.module = window.module || {};
            window.module.push = factory(null, window.jQuery, window.helper, window.module.multSelector, window.iCheck);
        }
    }
}(function (bs, $, helper, multSelector, iCheck) {
    var module = window.module || {};
    module.multSelector = multSelector;

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

    push.setting = {};

    /**
     * 推送默认配置
     * @type {{container: string, readonly: number, defaultPush: {selected: number, value: (*)}, range: {selected: number, alluser: number, shanghui: Array, industry: [*], region: Array, nativeplace: Array, usergroup: Array, circle: Array, user: Array}, smallTop: {selected: number, position: number, startTime: string, endTime: string}, bigTop: {selected: number, startTime: string, endTime: string}, formData: {}, initCompleteCallback: null}}
     */
    push.setting.defaultOptions = {
        //信息流推送的容器
        container: "body",
        readonly: 0,
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
            tagsC: "user_identity",
            pkeyC: "",
            keywordC: "name",
            searchType: 1
        }
    };

    /**
     * 设备推送选项的配置（与ajax字段的映射关系）
     * @type {{sb_all_user: string, sb_sh_ids: {array: string, key: string}, sb_sh_names: {array: string, key: string}, sb_industry_ids: {array: string, key: string}, sb_industry_names: {array: string, key: string}, sb_region_ids: {array: string, key: string}, sb_region_names: {array: string, key: string}, sb_nativeplace_ids: {array: string, key: string}, sb_nativeplace_names: {array: string, key: string}, sb_usergroup_ids: {array: string, key: string}, sb_usergroup_names: {array: string, key: string}, sb_circle_ids: {array: string, key: string}, sb_circle_names: {array: string, key: string}, sb_user_ids: {array: string, key: string}, sb_user_names: {array: string, key: string}, sb_title_imei: string, sb_content_imei: string}}
     */
    push.setting.mobileFormDataMap = {
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
        "user_names": {array:"range.user", key: "value"}
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
        //this.validator = this.options.validatorContainer;
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
            +'<input id="radPushPartUser{r}" name="radPushAllUser{r}" data-toggle="#divPartUserPanel{r}" type="radio" data-model="range.alluser" value="2"{partChecked} />部分用户</label></div>'
            +'<div id="divPartUserPanel{r}" class="row m-l-lg">';
        temlpate = temlpate.Format({
            r: this._r,
            allChecked: data.alluser == 1 ? ' checked="checked"': '',
            partChecked: data.alluser == 2 ? ' checked="checked"' : ''
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
    base.prototype.getRangeValues = function (k) {
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

        this.$container.empty().html(html.join("")).addClass("form-horizontal");

        //初始化各类事件
        this.initModuleEvent();

        //执行回调函数
        if(this.options.initCompleteCallback){
            this.options.initCompleteCallback.call(this, $.extend(true, {}, this.data));
        }
    };

    //获取提醒推送范围模板
    mobileClass.prototype.getRangeTemplate = function () {
        var template = '<div class="form-group">'
            +'<label class="col-sm-2 control-label">发送对象：</label>'
            +'<div class="col-sm-9">'
        template = template.Format({r: this._r, checked: this.data.range.alluser == 1 ? ' checked="checked"' : ''});
        template += this.getUserPushTemplate();
        template += '</div></div>';

        return template;
    };

    push.mobile = mobileClass;

    return push;
}));