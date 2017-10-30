/**
 * Created by xiegy on 2017/4/22.
 * 所有公共的js帮助（工具）的方法/函数在这里，帮助类为js静态类（对象），以helper为类名开头，便于各页面可读性及合作人员的调用查找
 * 每次增加、修改，请务必查询库中是否已有相关的，如无再做增删改，并请务必在tower中@所有开发人员
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD规范
        define(['jquery'], factory);
    } else {
        if (typeof module === 'object' && module.exports) {
            // Node/CommonJS
            module.exports = factory(require('jquery'));
        } else {
            //未引入requirejs、commonjs等
            window.helper = factory(window.jQuery);
        }
    }
}(function ($) {
    var helper = {};
    /**
     * Created by xiegy on 2017/4/22.
     * 通用的配置项
     * 以“_”开头，全部大写，以“_”隔开多个单词
     */
    helper.CONFIG = {
        _BASE_FOLDER: (config && config.BASE_FOLDER) || '/Sbbyy',                            //实际项目部署时的基础文件夹（请到config.js文件设置）
        _OBJ_LIST: {
            "": {objType: "", objLabel: "全部文章", infoUrl: "", editUrl: "", addUrl: ""},
            "1": {objType: 1, objLabel: "早茶", infoUrl: "admin/paperinfo.shtml?id=", editUrl: "admin/paperhandle.shtml?id=", addUrl: "admin/paperhandle.shtml"},
            "2": {objType: 2, objLabel: "秘闻", infoUrl: "admin/ciphertextinfo.shtml?id=", editUrl: "admin/ciphertexthandle.shtml?id=", addUrl: "admin/ciphertexthandle.shtml"},
            "3": {objType: 3, objLabel: "用户", infoUrl: "", editUrl: "", addUrl: ""},
            "4": {objType: 4, objLabel: "活动", infoUrl: "admin/circleActivityInfo.shtml?id=", editUrl: "admin/circleActivityHandle.shtml?id=", addUrl: "admin/circleActivityHandle.shtml"},
            "5": {objType: 5, objLabel: "话题", infoUrl: "admin/circletopicinfo.shtml?id=", editUrl: "admin/circleTopicHandle.shtml?id=", addUrl: "admin/circleTopicHandle.shtml"},
            "6": {objType: 6, objLabel: "专题", infoUrl: "admin/hotspotinfo.shtml?id=", editUrl: "admin/hotspothandle.shtml?id=", addUrl: "admin/hotspothandle.shtml"},
            "7": {objType: 7, objLabel: "江湖事", infoUrl: "admin/jhsInfo.shtml?id=", editUrl: "admin/jhsHandle.shtml?id=", addUrl: "admin/jhsHandle.shtml"},
            "8": {objType: 8, objLabel: "榜样", infoUrl: "admin/exampleinfo.shtml?id=", editUrl: "admin/exampleHandle.shtml?id=", addUrl: "admin/exampleHandle.shtml"},
            "9": {objType: 9, objLabel: "工商联新闻", infoUrl: "admin/gslinfo.shtml?id=", editUrl: "admin/shangjiadd.shtml?id=", addUrl: "admin/shangjiadd.shtml"},
            "10": {objType: 10, objLabel: "招商项目", infoUrl: "admin/shangjireinfo.shtml?id=", editUrl: "admin/shangjiadd.shtml?id=", addUrl: "admin/shangjiadd.shtml"},
            "11": {objType: 11, objLabel: "圈子", infoUrl: "admin/circleAudit.shtml?id=", editUrl: "", addUrl: ""},
            "12": {objType: 12, objLabel: "用户动态", infoUrl: "", editUrl: "", addUrl: ""},
            "13": {objType: 13, objLabel: "商会资讯", infoUrl: "admin/shanghuidetail.shtml?id=", editUrl: "", addUrl: ""},
            "14": {objType: 14, objLabel: "商会通知", infoUrl: "admin/shanghuinoticedetail.shtml?id=", editUrl: "", addUrl: ""},
            "15": {objType: 15, objLabel: "评论", listUrl: "admin/commentindex.shtml", infoUrl: "", editUrl: "", addUrl: ""},
            "16": {objType: 16, objLabel: "关注", infoUrl: "", editUrl: "", addUrl: ""},
            "17": {objType: 17, objLabel: "招商单位", infoUrl: "admin/businessunitinfo.shtml?id=", editUrl: "admin/businessunitadd.shtml?id=", addUrl: "admin/businessunitadd.shtml"},
            "18": {objType: 18, objLabel: "求帮帮", infoUrl: "admin/CMcircleHelpInfo.shtml?id=", editUrl: "", addUrl: ""},
            "19": {objType: 19, objLabel: "帖子", infoUrl: "admin/circleshareinfo.shtml?id=", editUrl: "admin/circlesharehandle.shtml?id=", addUrl: "admin/circlesharehandle.shtml"},
            "20": {objType: 20, objLabel: "外链", infoUrl: "", editUrl: "", addUrl: ""},
            "21": {objType: 21, objLabel: "大咖观点", infoUrl: "", editUrl: "", addUrl: ""},
            "22": {objType: 22, objLabel: "信息流", infoUrl: "", editUrl: "", addUrl: ""},
            "23": {objType: 23, objLabel: "我的消息", infoUrl: "", editUrl: "", addUrl: ""},
            "24": {objType: 24, objLabel: "分享名片", infoUrl: "", editUrl: "", addUrl: ""},
            "25": {objType: 25, objLabel: "分享商帮帮", infoUrl: "", editUrl: "", addUrl: ""},
            "26": {objType: 26, objLabel: "用户动态-点赞", infoUrl: "", editUrl: "", addUrl: ""},
            "27": {objType: 27, objLabel: "用户动态-关注", infoUrl: "", editUrl: "", addUrl: ""},
            "28": {objType: 28, objLabel: "用户动态-评论", infoUrl: "", editUrl: "", addUrl: ""},
            "29": {objType: 29, objLabel: "用户动态-大咖发表观点", infoUrl: "", editUrl: "", addUrl: ""},
            "30": {objType: 30, objLabel: "用户动态-活动发表分享", infoUrl: "", editUrl: "", addUrl: ""},
            "31": {objType: 31, objLabel: "用户动态-圈子发布帮帮", infoUrl: "", editUrl: "", addUrl: ""},
            "32": {objType: 32, objLabel: "用户动态-圈子发布活动", infoUrl: "", editUrl: "", addUrl: ""},
            "33": {objType: 33, objLabel: "用户动态-圈子发布话题", infoUrl: "", editUrl: "", addUrl: ""},
            "34": {objType: 34, objLabel: "用户动态-圈子发布帖子", infoUrl: "", editUrl: "", addUrl: ""},
            "35": {objType: 35, objLabel: "参与活动分享", infoUrl: "", editUrl: "", addUrl: ""},
            "36": {objType: 36, objLabel: "参与话题讨论 ", infoUrl: "", editUrl: "", addUrl: ""},
            "37": {objType: 37, objLabel: "评论点赞", infoUrl: "", editUrl: "", addUrl: ""},
            "38": {objType: 38, objLabel: "用户动态-关注", infoUrl: "", editUrl: "", addUrl: ""},
            "0": {objType: 0, objLabel: "其它", infoUrl: "", editUrl: "", addUrl: ""}
        },      //各模块详情页的配置
        _OBJ_SELECT_ARRAY: ["",1,2,4,5,6,7,8,9,10,13,18,19],     //可供筛选的文章分类
        _OBJ_EXTERNAL_TYPE: 20,      //外链模块
        _OBJ_COMMENT_TYPE: 15       //评论模块
    };

    /**
     * 内容对象管理
     * @type {{getObjLabel: helper.obj.getObjLabel, getSelectList: helper.obj.getSelectList}}
     */
    helper.obj = {
        /**
         * 获取所有对象类型
         * @returns {Array}
         */
        getObjList: function () {
            return $.extend(true, {}, helper.CONFIG._OBJ_LIST);
        },

        /**
         * 获取指定类型的对象信息
         * @param objType
         * @returns {json}
         */
        getObj: function (objType) {
            var item = helper.CONFIG._OBJ_LIST[objType];
            if(!item)  return null;

            return $.extend({}, item);
        },

        /**
         * 获取指定对象类型的名称
         * @returns {String}
         */
        getObjLabel: function (objType) {
            var item = helper.CONFIG._OBJ_LIST[objType];
            if(!item)  return "";

            return item.objLabel;
        },

        /**
         * 获取所有可供选择的文章类型列表
         * @returns {Array}
         */
        getSelectList: function () {
            var list = [];
            var selArr = helper.CONFIG._OBJ_SELECT_ARRAY;
            for(var i = 0; i < selArr.length; i++){
                list.push($.extend({}, helper.CONFIG._OBJ_LIST[selArr[i]]));
            }

            return list;
        },

        /**
         * 获取外链的编号
         * @returns {number}
         */
        getExternalType: function () {
            return helper.CONFIG._OBJ_EXTERNAL_TYPE;
        }
    };

    /**
     * Created by xiegy on 2017/4/22.
     * url相关操作帮助类
     */
    helper.url = {
        /**
         * Created by xiegy on 2017/4/22.
         * 获取根目录
         * 如总是获取到：http://www.shangbangbang.com/
         */
        getRootPath: function () {
            var rootPath = window.location.origin ? window.location.origin : window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
            return rootPath + "/";
        },

        /**
         * Created by xiegy on 2017/4/22.
         * 获取本项目在实际部署的基目录（即本项目的相对目录）
         * 如项目实际部署在根目录的/sbbyy/子文件夹下，则获取返回的即是：http://www.shangbangbang.com/sbbyy/
         */
        getBasePath: function () {
            return this.getRootPath() + (helper.CONFIG._BASE_FOLDER == "" ? "" : helper.CONFIG._BASE_FOLDER.substr(1) + "/");
        },

        /**
         * Created by xiegy on 2017/4/22.
         * 根据mapping获取该mapping实际的完整路径
         *
         * 假设mapping为：admin/ciphertext.shtml，
         * 项目部署在http://www.shangbangbang.com/sbbyy/下，
         * 则该调用该方法返回http://www.shangbangbang.com/sbbyy/admin/ciphertext.shtml
         * @param mapping 访问相对与项目基目录的路径
         * @returns {完整URL}
         */
        getUrlByMapping: function (mapping) {
            return helper.CONST.BASE_PATH + mapping;
        },

        /**
         * 获取图片缩略图地址
         * @param url
         * @param w
         * @param h
         * @param type
         * @returns {*}
         */
        getThumImageUrl: function (url, w, h, type) {
            if (!url || url.trim() === "") return "";

            type = type ? type : 2;
            w = w ? w : 100;
            h = h ? h : 100;

            return "{0}?imageView/{1}/w/{2}/h/{3}".Format(url, type, w, h);
        },

        /**
         * Created by xiegy on 2017/5/17.
         * 根据模块获取访问路径
         * @param obj_id
         * @param obj_type
         * @param url
         * @param urlType
         * @param params
         * @returns {string}
         */
        getUrlByObj: function (obj_id, obj_type, url, urlType, params) {
            var obj = helper.CONFIG._OBJ_LIST[obj_type];
            if(!obj) return "";

            if(obj_type != helper.CONFIG._OBJ_EXTERNAL_TYPE){
                if(obj[urlType] === "") return "";

                url = helper.url.getUrlByMapping(obj[urlType]) + obj_id;
            }

            var querystring = "";
            if(params && params instanceof Object){
                for(var k in params){
                    querystring += "&" + k + "=" + encodeURIComponent(params[k]);
                }

                if(querystring.length > 0)
                    url += url.indexOf("?") == -1 ? "?" + querystring.substr(1) : querystring;
            }

            return url;
        },

        /**
         * Created by xiegy on 2017/5/17.
         * 根据模块获取访问路径
         * @param obj_id
         * @param obj_type
         * @param url
         * @param params
         * @returns {string}
         */
        getInfoUrlByObj: function (obj_id, obj_type, url, params) {
            return helper.url.getUrlByObj(obj_id, obj_type, url, "infoUrl", params);
        },
        /**
         * Created by xiegy on 2017/5/17.
         * 根据模块获取访问编辑路径
         * @param obj_id
         * @param obj_type
         * @param params
         * @returns {string}
         */
        getEditUrlByObj: function (obj_id, obj_type, params) {
            if(!params) params = {};
            if(!params.action) params.action = "edit";
            return helper.url.getUrlByObj(obj_id, obj_type, "", "editUrl", params);
        },
        /**
         * Created by xiegy on 2017/5/19.
         * 根据模块获取新增路径
         * @param obj_type
         * @param params
         * @returns {string}
         */
        getAddUrlByObj: function (obj_type, params) {
            return helper.url.getUrlByObj("", obj_type, "", "addUrl", params);
        },
        /**
         * 获取指定对象类型指定文章的评论url
         * @param obj_id
         * @param obj_type
         */
        getCommentListUrlByObj: function (obj_id, obj_type) {
            var obj = helper.CONFIG._OBJ_LIST[helper.CONFIG._OBJ_COMMENT_TYPE];
            return helper.url.getUrlByMapping("{0}?obj_id={1}&obj_type={2}".Format(obj["listUrl"], obj_id, obj_type));
        },

        /**
         * 获取querystring
         * @param name 如果name存在，则获取指定name的value，如果不存在返回整个querystring的json对象
         * @return {*}
         */
        queryString: function (name) {
            var qs = {};
            var qsStr = window.location.search;
            if(qsStr.indexOf("?") != -1){
                qsStr = qsStr.substr(1);
                var arr = qsStr.split("&");
                var kv;
                for(var i = 0; i < arr.length; i++)
                {
                    kv = arr[i].split("=");
                    qs[kv[0]] = kv.length > 1 ? kv[1] : "";
                }
            }

            if(name){
                return qs[name] ? qs[name] : "";
            }

            return qs;
        }
    };

    /**
     * Created by xiegy on 2017/5/4.
     * 通用父子窗体控制交换中心
     */
    helper.win = {
        /**
         * 取消、关闭所用的事件
         */
        close: function () {
            if(window.parent == window){
                return window.close();
            }
            window.parent.closeFrm();
        },

        /**
         * 打开指定的窗体
         * @type {{name: string, url: string}}
         */
        open: function (options) {
            var def = {name: "", url: ""};
            options = $.extend(def, options);
            ref = location.href.replace(/[\W\w]+\//, "").replace(/[\?\&]r=.+/, "");
            options.url += options.url.indexOf("?") == - 1? "?" : "&";
            options.url += "ref=" + encodeURIComponent(ref);
            
            if(window.parent == window){
                window.open(options.url);
                return;
            }
            
            //window.parent.openRelation(options);
            
            var _parent = window.parent;
            
            while (typeof _parent.openRelation != 'function') {
            	_parent = _parent.parent;
            }
            
            _parent.openRelation(options);
        },

        /**
         * 根据obj类型打开窗体
         * @type {{obj_id: int, obj_type: int, article_title: string, url: string, urlType: string, label: string, params: json}}
         */
        openByObj: function (options) {
            var def = {obj_id: "", obj_type: 0, article_title: "", url: "", urlType: "infoUrl", label: "查看", params: {}};
            options = $.extend(def, options);
            var url = helper.url.getUrlByObj(options.obj_id, options.obj_type, options.url, options.urlType, options.params);
            if(url !== ""){
                helper.win.open({name: options.label + helper.CONFIG._OBJ_LIST[options.obj_type].objLabel, url: url});
            }
        },
        /**
         * 根据obj类型打开查看的窗体
         * @type {{obj_id: int, obj_type: int, article_title: string, url: string, params: json}}
         */
        openInfoByObj: function (options) {
            options.urlType = "infoUrl";
            options.label = "查看";
            return helper.win.openByObj(options);
        },
        /**
         * 根据obj类型打开审核的窗体
         * @type {{obj_id: int, obj_type: int, article_title: string, url: string, params: json}}
         */
        openAuditByObj: function (options) {
            options.urlType = "infoUrl";
            options.label = "审核";
            options.params = {"action": "audit"};
            return helper.win.openByObj(options);
        },
        /**
         * 根据obj类型打开编辑的窗体
         * @type {{obj_id: int, obj_type: int, article_title: string, params: json}}
         */
        openEditByObj: function (options) {
            options.urlType = "editUrl";
            options.label = "编辑";
            if(!options.params) options.params = {};
            if(!options.params.action) options.params.action = "edit";

            return helper.win.openByObj(options);
        },
        /**
         * 根据obj类型打开新增的窗体
         * @type {{obj_type: int, params: json}}
         */
        openAddByObj: function (options) {
            options.urlType = "addUrl";
            options.label = "新增";
            return helper.win.openByObj(options);
        },
        /**
         * 根据obj类型打开评论列表的窗体
         * @type {{obj_id: int, obj_type: int, article_title: string}}
         */
        openCommentByObj: function (options) {
            var url = helper.url.getCommentListUrlByObj(options.obj_id, options.obj_type);
            var name = options.article_title.substr(0, 5) + "..评论";
            helper.win.open({name: name, url: url});
        },

        /**
         * 关闭本窗口，并激活父窗口刷新对应子窗口
         * @type {{title: string, msg: string, close: boolean, relationTitle: string, relation: string}}
         */
        changeQuoto: function (options) {
            var def = {title: "", msg: "", close: true, relationTitle: "", relation: ""};
            options = $.extend(def, options);

            if(window.parent == window){
                if(options.relation){
                    window.open(options.relation);
                }

                window.close();
                return;
            }

            window.parent.changeRelation(options);
        },

        /**
         * 跳转到编辑页
         * @type {{obj_id: int, obj_type: int, article_title: string, params: json}}
         */
        redirectEditByObj: function (options) {
            var ref = {obj_id: "", obj_type: "", article_title: "", params: {}};
            options = $.extend(ref, options);

            var data = {
                relationTitle: "编辑" + helper.CONFIG._OBJ_LIST[options.obj_type].objLabel,
                relation: helper.url.getEditUrlByObj(options.obj_id, options.obj_type, options.params)
            };
            helper.win.changeQuoto(data);
        }
    };

    /**
     * Created by xiegy on 2017/4/22.
     * 通用的数据类型转换类
     */
    helper.convert = {
        //格式化时间戳成yyyy-MM-dd hh:mm:ss格式
        /**
         * 将Number时间戳或Date日期格式的格式化成字符串格式，字符串如：yyyy-MM-dd hh:mm:ss
         * @param time 时间戳或Date日期格式
         * @param format 格式化的格式，默认yyyy-MM-dd hh:mm:ss
         * @returns {string} 返回格式化后的格式
         */
        formatDate: function (time, format) {
            if(time == undefined || time == null || (!(time instanceof Date) && typeof time != "number")) return "-";
            var t = time instanceof Date ? time : new Date(time);

            if(!format)
                format = "yyyy-MM-dd hh:mm:ss";
            var o = {
                "M+": t.getMonth() + 1, //月份
                "d+": t.getDate(), //日
                "h+": t.getHours(), //小时
                "m+": t.getMinutes(), //分
                "s+": t.getSeconds(), //秒
                "q+": Math.floor((t.getMonth() + 3) / 3), //季度
                "S": t.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(format))
                format = format.replace(RegExp.$1, (t.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(format))
                    format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return format;
        },

        /**
         * 将yyyy-MM-dd hh:mm:ss格式的时间转换成时间戳
         * @param timeStr  yyyy-MM-dd hh:mm:ss格式
         * @param timespan 在指定时间上增加，对象类型见helper.CONST.TIME_SPAN
         * @returns {时间戳}
         */
        formatTimestamp: function(timeStr, timespan){
            var date = this.formatToDate(timeStr, timespan);
            return date instanceof Date ? date.valueOf() : "";
        },

        /**
         * 将yyyy-MM-dd hh:mm:ss格式的时间转换成Date格式
         * @param timeStr  yyyy-MM-dd hh:mm:ss格式
         * @param timespan 在指定时间上增加，对象类型见helper.CONST.TIME_SPAN
         * @returns {Date}日期格式
         */
        formatToDate: function (timeStr, timespan) {
            if(timeStr == "" || timeStr == undefined || timeStr == null) return "";

            var reg = /^(\d{4})\-(\d{1,2})\-(\d{1,2})(?:\s(\d{2})){0,1}(?:\:(\d{2})){0,1}(?:\:(\d{2})){0,1}$/;
            if(!reg.test(timeStr)){
                return new Date();
            }
            timespan = timespan ? helper.extendObj({}, helper.CONST.TIME_SPAN, timespan) : helper.CONST.TIME_SPAN;

            var arr = timeStr.match(reg);
            var year = parseInt(arr[1]) + timespan.year;
            var month = parseInt(arr[2]) + timespan.month;
            var day = parseInt(arr[3]) + timespan.day;
            var hour = (arr[4] ? parseInt(arr[4]) : 0)  + timespan.hour;
            var minute = (arr[5] ? parseInt(arr[5]) : 0) + timespan.minute;
            var second = (arr[6] ? parseInt(arr[6]) : 0) + timespan.second;
            var date = new Date(year, month - 1, day, hour, minute, second);
            return date;
        },

        /**
         * 将富文本输入框的内容中空格和回车，转换成html格式
         * @param txt
         * @returns {string}
         */
        formatSpaces: function (str) {
            str = str.replace(/[\r\n]/g,"<br/>");
            str = str.replace(/\s/g,"&nbsp;");
            return str;
        }
    };
    helper.Convert = helper.convert;

//对象克隆，将params的第2及以后的对象克隆到第1个对象中，如果多个对象同时存在同一个key，越后面的会覆盖前面的同样key的值。（本克隆为深克隆）
    helper.extendObj = function () {
        if(arguments.length == 0) return "";
        if(arguments.length == 1) return arguments[0];

        var obj = arguments[0];
        for(var i = 1; i < arguments.length; i++){
            for(var key in arguments[i]){
                if(arguments[i][key] instanceof Object || arguments[i][key] instanceof Array){
                    var obj1 = arguments[i][key] instanceof Array ? [] : {};
                    obj[key] = helper.extendObj(obj1, arguments[i][key]);
                    continue;
                }
                obj[key] = arguments[i][key];
            }
        }
        return obj;
    };
    /**
     * 判断对象是否存在或为true
     * @param obj
     * @return
     */
    helper.isExistOrTrue = function (obj) {
        if(typeof obj == "string")
            return obj.trim() && obj.trim() != "0";
        var rtn = obj && true;
        return typeof rtn == "boolean" ? rtn : false;
    };

    /**
     * Created by xiegy on 2017/4/22.
     * 通用的常态变量
     * 1、常量命名规范为：全部大写，以“_”隔开多个单词
     * 2、如果以“_”开头代表内部常量，不建议外部调用
     */
    helper.CONST = {
        ROOT_PATH: helper.url.getRootPath(),        //获取站点根目录
        BASE_PATH: helper.url.getBasePath(),        //获取项目实际部署的基目录
        TIME_SPAN: {year: 0, month: 0, day: 0,hour: 0, minute: 0, second: 0}    //默认的时间差值
    };

    /**
     * 扩展字符串Format原型，支持{0}{1}等替换
     * @param args 要替换的值，按顺序替换掉{0}、{1}...的值，也可以json对象替换
     * @returns {String}
     * @constructor
     */
    String.prototype.Format = function(args){
        if (arguments.length == 0) return this;

        var result = this;
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(!args[key] != undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }

            return result;
        }

        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] != undefined) {
                var reg= new RegExp("({)" + i + "(})", "g");
                result = result.replace(reg, arguments[i]);
            }
        }

        return result;
    };
    /**
     * 增加去除前后空格的语法糖
     * @param global 传入g或G表示去除字符串中所有空格，否则去除前后空格
     * @return {string}
     */
    String.prototype.trim = function (global) {
        return (global!==undefined&&global.toLowerCase()==="g")?
            this.replace(/\s/g,""):
            this.replace(/(^\s*)|(\s*$)/g, "");
    };

    if(config && config.RUN_TYPE === "debug") window.helper = helper;
    return helper;
}));