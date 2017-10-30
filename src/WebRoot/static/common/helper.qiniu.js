/**
 * Created by xiegy on 2017/4/25.
 * 七牛上传文件的帮助类
 * 依赖于第三方库jQuery，即必须引入jQuery.js
 * 依赖于自有helper类，即必须引入helper.js
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD规范
        define(['jquery','helper'], factory);
    } else {
        if (typeof module === 'object' && module.exports) {
            // Node/CommonJS
            module.exports = factory(require('jquery'), require('helper'));
        } else {
            //未引入requirejs、commonjs等
            window.helper.qiniu = factory(window.jQuery, window.helper);
        }
    }
}(function ($, helper) {
    var qiniu = {};
    qiniu.CONFIG = {
        _RUN_TYPE: (config && config.RUN_TYPE) || 'debug',                             //环境状态，"debug"、"test"、"release"，目前仅"debug"和"release"生效（请到config.js文件设置）
        _UPLOAD_PATH: "http://up-z2.qiniu.com/",                //上传地址（七牛）
        _DELETE_PATH: helper.url.getUrlByMapping("qiniu/delete.shtml"),                     //删除七牛文件的地址
        _GET_TOKEN_URL: helper.url.getUrlByMapping("qiniu/simple_uptoken.shtml?bucket="),   //获取七牛token的地址
        _DEFAULT_BUCKET: "image",                               //七牛默认的上传空间名称
        _DEBUG_BUCKET: "debug"                                  //debug调试用的上传空间名称
    };

    //七牛上传的空间名称与访问文件基路径的对应关系配置
    qiniu.CONFIG.BucketSetting = [
        {bucket: "avatar", baseUrl: "http://avatar.static.shangbangbang.com"},      //存储个人头像使用
        {bucket: "image", baseUrl: "http://image.static.shangbangbang.com"},        //存储图片使用
        {bucket: "media", baseUrl: "http://media.static.shangbangbang.com"},        //存储视频音频使用
        {bucket: "file", baseUrl: "http://file.static.shangbangbang.com"},          //存储附件文件使用
        {bucket: "logo", baseUrl: "http://logo.static.shangbangbang.com"},           //存储圈子及各种LOGO图标使用
        {bucket: "debug", baseUrl: "http://debug.static.shangbangbang.com"}           //debug调试用，外部按照正常情况传，该空间统一配置无需外部接入变更
    ];

    qiniu.UploadUrl = qiniu.CONFIG._UPLOAD_PATH;         //上传地址
    qiniu.DeleteUrl = qiniu.CONFIG._DELETE_PATH;         //删除地址

    /**
     * Created by xiegy on 2017/4/25.
     * 获取访问的地址
     * @param key 上传返回的key或存储的文件名
     * @param bucket 存放在七牛的空间名称
     * @returns {完整访问URL}
     */
    qiniu.getUploadVisitUrlByKey = function (key, bucket) {
        if(!bucket){
            bucket = this.instance ? this.instance.bucket : this._defaultBucket;
        }
        var basePath = this.getVisitBasePath(bucket);
        basePath = basePath.lastIndexOf("/") == basePath.length - 1 ? basePath : basePath + "/";
        return basePath + key;
    };

    /**
     * Created by xiegy on 2017/4/25.
     * 根据存储空间名称获取访问url基路径
     * @param bucket 存储在七牛的具体空间名称
     * @returns {七牛访问URL的基路径}
     */
    qiniu.getVisitBasePath = function (bucket)
    {
        if(!bucket){
            bucket = qiniu.CONFIG._DEFAULT_BUCKET;
        }

        var setting = qiniu.CONFIG.BucketSetting;
        for(var i = 0; i < setting.length; i++){
            if(setting[i].bucket == bucket){
                return setting[i].baseUrl;
            }
        }

        return "";
    };

    /**
     * 使用七牛上传
     * @param file
     * @param callback
     * @param qiniuInstance
     */
    qiniu.upload = function(file, callback, qiniuInstance){
        qiniuInstance = qiniuInstance ? qiniuInstance : qiniu.instance;

        if(!qiniuInstance){
            //从未初始化过七牛，先初始化七牛
            new qiniu.token({
                callback: function (ret) {
                    if(ret.code == 1)
                        qiniu._doUpload(file, callback, ret.qiniu);
                    else if(layer) layer.alert(ret.msg, 8);
                },
                noShare: true
            });
            return;
        }

        qiniu._doUpload(file, callback, qiniuInstance);
    };
    /**
     * 执行上传到七牛
     * @param file
     * @param callback
     * @param qiniuInstance
     * @private
     */
    qiniu._doUpload = function (file, callback, qiniuInstance) {
        var filename = false;
        try {
            filename = file["name"];
        } catch (e) {
            filename = false;
        }

        var ext = filename.substr(filename.lastIndexOf("."));
        var name = new Date().getTime() + ext.toUpperCase();
        if(!(/^[\w\W]+\.(jpg|jpeg|png|gif)/ig.test(filename)))
            name = filename.substr(0, filename.lastIndexOf(".")) + "-" + name;  //非图片保留原文件名称

        var data = new FormData();
        data.append("file", file);
        data.append("key", name);
        data.append("token", qiniuInstance.tokenString);
        $.ajax({
            data: data,
            type: "POST",
            url: qiniu.UploadUrl,
            cache: false,
            contentType: false,
            processData: false,
            success: function (ret) {
                var url = qiniu.getUploadVisitUrlByKey(ret.key, qiniuInstance.bucket);
                if(callback && callback instanceof Function)
                    callback({code: 1, msg: "", oldFilename: filename, newFilename: name, url: url, file: file});
            },
            error: function (xhr,txtStatus,thrown) {
                if(callback && callback instanceof Function)
                    callback({code: 0, msg: "上传失败，请稍候重试或联系管理员！"});
            }
        });
    };
    /**
     * 从七牛中删除文件
     * @param url
     * @param callback
     */
    qiniu.delete = function (url, callback) {
        //七牛key
        var key = url.substr(url.lastIndexOf("/") + 1);
        //根据url获取对应的七牛空间
        var bucket = "";
        var buckets = qiniu.CONFIG.BucketSetting;
        for(var i = 0; i < buckets.length; i++){
            if(url.indexOf(buckets[i].baseUrl) >= 0){
                bucket = buckets[i].bucket;
                break;
            }
        }
        var returns = {code: 0, msg: "", filename: key, url: url};

        if(bucket === ""){
            if(callback && callback instanceof Function){
                returns.code = 9;
                returns.msg = "删除异常，要删除的文件非七牛文件";
                callback(returns);
            }
            return;
        }

        $.ajax({
            data: {bucket: bucket, key: key},
            type: "POST",
            url: qiniu.DeleteUrl,
            dataType : "json",
            cache: false,
            success: function (ret) {
                if(ret.code == "0"){
                    returns.code = 1;
                    return;
                }
                returns.code = 0;
                returns.msg = ret.errMsg;
            },
            error: function (xhr,txtStatus,thrown) {
                returns.code = 0;
                returns.msg = "删除异常，请求删除处理失败，请稍候再重试或联系管理员";
            },
            complete: function () {
                if(callback && callback instanceof Function)
                    callback(returns);
            }
        });
    };


    //token实例
    qiniu.instance = null;                   //整个token的实例对象
    qiniu._defaultBucket = qiniu.CONFIG._RUN_TYPE == "debug" ? qiniu.CONFIG._DEBUG_BUCKET : qiniu.CONFIG._DEFAULT_BUCKET;         //上传文件存储的默认空间名称

    /**
     * Created by xiegy on 2017/4/25.
     * 获取七牛token的实例类
     * @param options 存储在七牛的具体的空间名称 或 json对象{bucket: "", callback: function, noShare: bool}
     * @param callback 获取到token后的回调事件
     * //option.noShare:不共享本实例到全局共用，true：不共享，false：共享。（默认共享，共享后将覆盖原有的七牛实例，即：单例模式）
     */
    qiniu.token = function(options, callback) {
        if(options === undefined || options === null) options = {};
        if(typeof options == "string") options = {bucket: options, callback: callback};

        if(callback && callback instanceof Function && !options.callback){
            options.callback = callback;
        }

        this.bucket = qiniu._defaultBucket;
        this.noShare = options.noShare ? true : false;
        if(qiniu.CONFIG._RUN_TYPE != "debug" && options.bucket){
            this.bucket = options.bucket;
        }
        this.tokenUrl = qiniu.CONFIG._GET_TOKEN_URL + this.bucket;
        this.tokenString = "";

        this.getToken(options.callback);
    };
    /**
     * Created by xiegy on 2017/4/25.
     * 重新获取token
     * @param callback 获取到token后的回调事件
     */
    qiniu.token.prototype.getToken = function (callback) {
        var _this = this;
        var returns = {};
        $.ajax({
            url: this.tokenUrl,
            type: "post",
            dataType : "json",
            success: function (ret) {
                if(ret.code == "0"){
                    _this.tokenString = ret.uptoken;

                    if(!_this.noShare){
                        qiniu.instance = _this;
                    }

                    returns = {code: 1, qiniu: _this};
                    return;
                }

                returns = {code: 0, msg: ret.errMsg};
            },
            error: function (xhr,txtStatus,thrown) {
                returns = {code: 0, msg: "初始化存储失败，请稍候刷新重试或联系管理员！"};
            },
            complete: function () {
                if(callback && callback instanceof Function){
                    callback(returns);
                }

                if(returns.code != 1 && layer) layer.alert(returns.msg, 8);
            }
        })
    };
    /**
     * Created by xiegy on 2017/4/25.
     * 获取访问的地址
     * @param key 上传返回的key或存储的文件名
     */
    qiniu.token.prototype.getUploadVisitUrlByKey = function (key) {
        return qiniu.getUploadVisitUrlByKey(key, this.bucket);
    };
    /**
     * 上传事件
     * @param file
     * @param callback
     */
    qiniu.token.prototype.upload = function (file, callback) {
        return qiniu.upload(file, callback, this);
    };
    qiniu.token.prototype.delete = function (file, callback) {
        return qiniu.delete(file, callback);
    };

    helper.qiniu = qiniu;
    return helper.qiniu;
}));