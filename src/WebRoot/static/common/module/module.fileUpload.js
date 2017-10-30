/**
 * Created by xiegy on 2017/5/3.
 * 扩展fileinput上传图片直传七牛的扩展
 * 依赖文件lib下的jQuery、bootstrap、fileinput，common下的helper.js、helper.qiniu.js文件（在引入本文件前引入helper.qiniu.js文件，并在引入前初始化new helper.qiniu.token()）,如未引入，组件将自动初始化一次
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD规范
        define(['base','jquery','helper','helper.qiniu','fileinput'], factory);
    } else {
        if (typeof module === 'object' && module.exports) {
            // Node/CommonJS
            module.exports = factory(require('base'), require('jquery'), require('helper'), require('hepler.qiniu'), require('fileinput'));
        } else {
            //未引入requirejs、commonjs等
            window.module = window.module || {};
            window.module.fileUpload = factory(null, window.jQuery, window.helper);
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

    /**
     * 定义上传组件类
     * @param options
     */
    var fileUpload = function (options) {
        if(typeof options == "string"){
            options = {container: options};
        }
        this.options = $.extend(true, {}, this.defaultOptions, options);
        this.options.fileType = this.options.extensions[this.options.fileType] ? this.options.fileType : "image";
        this.options.allowedFileExtensions = this.options.extensions[this.options.fileType].ext;
        this.qiniu = null;

        this.container = this.options.container;
        this.$container = $(this.container);
        this.files = this.options.existFiles;
        this.completeCallback = this.options.completeCallback;
        this.deleteCallback = this.options.deleteCallback;

        if(this.options.isUnique){
            //单选
            this.options.overwriteInitial = true;
            this.options.maxFileCount = 1;
            this.options.dropZoneEnabled = false;
            this.$container.removeAttr("multiple");
        }

        this.init();
    };

    /**
     * 组件初始化
     */
    fileUpload.prototype.init = function () {
        //初始化七牛
        if(this.options.bucket || !helper.qiniu.instance){
            this.qiniu = new helper.qiniu.token({
                bucket: this.options.extensions[this.options.fileType].bucket,
                callback: callFun(this._build, this),
                noShare: true
            });
            var _this = this;
            setInterval(function(){
                _this.qiniu.getToken();
            }, 30*60*1000);
            return;
        }

        this.qiniu = helper.qiniu.instance;
        this._build();
    };

    /**
     * 构造组件
     * @private
     */
    fileUpload.prototype._build = function () {
        this._buildInitialPreview();

        this.options.uploadExtraData = {
            token: this.qiniu.tokenString
        };

        var _this = this;

        this.$container.fileinput(this.options);
        this.$container.on("filebatchpreupload", function (event, data) {
            data.extra.key = _this._getUniqKey(data.filenames);
        }).on("filepreupload", function (event, data, previewId, index) {
            data.extra.key = _this._getUniqKey(data.filenames, index + 1);
        }).on("filebatchselected", function (event, files) {
            if(files.length == 0) return;
            $(this).fileinput("upload");
        }).on("fileuploaded", function(event, data, previewId, index) {
            //上传成功，保存图片
            var url = _this.qiniu.getUploadVisitUrlByKey(data.response.key);
            _this._addFile(url);
            $("#"+previewId).attr("data-url", url);
            //上传成功后的回调
            if(_this.completeCallback && _this.completeCallback instanceof Function){
                var param = {oldFilename: data.filenames[index], newFilename: data.response.key, url: url, file: data.files[index], files: _this.getFiles()};
                var duration = 0;
                if(_this._isAudio(param.oldFilename))
                    duration = $("#"+previewId+" audio").get(0).duration;
                if(_this._isVideo(param.oldFilename))
                    duration = $("#"+previewId+" video").get(0).duration;
                param.duration = isNaN(Number(duration)) ? 0 : duration;

                _this.completeCallback(param);
            }
        }).on("filepredelete", function (event, key, xhr, extra) {
            _this._removeFile(extra.url);
        }).on("filesuccessremove", function (event, previewId) {
            _this._removeFile($("#" + previewId).attr("data-url"));
        });
    };

    /**
     * 删除文件
     * @param url
     * @private
     */
    fileUpload.prototype._removeFile = function (url) {
        for(var i = 0; i < this.files.length; i++){
            if(this.files[i] == url){
                this.files.splice(i, 1);
                helper.qiniu.delete(url, null);
                if(this.deleteCallback && this.deleteCallback instanceof Function)
                    this.deleteCallback({filename: this._getFilename(url), url: url, files: this.getFiles()});
                return;
            }
        }
    };

    /**
     * 增加文件
     * @param url
     * @private
     */
    fileUpload.prototype._addFile = function (url) {
        if(this.options.isUnique){
            for(var i = 0; i < this.files.length; i++) {
                this.$container.parents(".file-input").find("[data-url='" + this.files[i] +"']").find(".kv-file-remove").click();
            }
            this.files = [url];
            return;
        }

        this.files.push(url);
    };

    /**
     * 获取唯一的七牛上传键
     * @param filename
     * @return {string}
     * @private
     */
    fileUpload.prototype._getUniqKey = function (files, index) {
        if(index == undefined){
            index = 0;
            for(var i = 0; i < files.length; i++){
                if(files[i] == undefined)
                    index++;
            }
        }

        if(index >= files.length)
            index = files.length - 1;

        var filename = files[index];
        var ext = filename.substr(filename.lastIndexOf("."));
//        var name = new Date().getTime() + ext.toUpperCase();
        var name = new Date().getTime() + ext.toLowerCase();
        if(!this._isImages(filename)){
            //非图片的保留文件的名称前缀
            var label = filename.substr(0, filename.lastIndexOf("."));
            name = label + "_" + name;
        }
        return name;
    };

    /**
     * 构造初始化传入的文件
     * @private
     */
    fileUpload.prototype._buildInitialPreview = function () {
        var preview = [], config = [], file = "", template = "";
        for (var i = 0; i < this.files.length; i++) {
            file = this.files[i];

            //传入文件的删除事件
            config.push({
                caption: this._isImages(file) ? "" : this._getFilename(file),
                width: "160px",
                url: helper.url.getUrlByMapping("static/common/data/success.json"),
                key: "",
                type: "file",
                extra: {url: file}
            });
            
            //图片直接展示
            //console.log(this.options.fileType);
            if (this.options.fileType == 'image') {
                preview.push('<a href="{0}" target="_blank" title="点击查看大图"><img src="{0}" class="file-preview-image" style="height: 160px;" /></a>'.Format(file));
                config[i].type = "image";
                continue;
            }
            /*if (this._isImages(file)) {
                preview.push('<a href="{0}" target="_blank" title="点击查看大图"><img src="{0}" class="file-preview-image" style="height: 160px;" /></a>'.Format(file));
                config[i].type = "image";
                continue;
            }*/
            //音频文件
            if(this._isAudio(file)){
                preview.push(this._audioTemplate(file));
                config[i].type = "audio";
                continue;
            }
            //视频文件
            if(this._isVideo(file)){
                preview.push(this._videoTemplate(file));
                config[i].type = "video";
                continue;
            }

            //非图片非音频显示缩略图
            template = this.options.previewFileIcon;
            for(var k in this.options.previewFileExtSettings){
                if(this.options.previewFileExtSettings[k](file.substr(file.lastIndexOf(".")))){
                    template = this.options.previewFileIconSettings[k];
                    break;
                }
            }
            template = '<div class="file-preview-other-frame"><div class="file-preview-other"><span class="file-other-icon"><a href="{0}" target="_blank" title="点击查看或下载">{1}</a></i></span></div></div>'.Format(file, template);
            preview.push(template);
        }

        this.options.initialPreview = preview;
        this.options.initialPreviewConfig = config;
    };

    /**
     * 获取文件名称
     * @param file
     * @returns {string}
     * @private
     */
    fileUpload.prototype._getFilename = function (file) {
        return decodeURIComponent(file.substr(file.lastIndexOf("/") + 1));
    };
    /**
     * 判断是否是图片
     * @private
     */
    fileUpload.prototype._isImages = function (filename) {
        return this._isType(filename, "image");
    };
    /**
     * 判断是否是多媒体文件
     * @private
     */
    fileUpload.prototype._isMedia = function (filename) {
        return this._isType(filename, "media");
    };
    /**
     * 判断是否是文档文件
     * @private
     */
    fileUpload.prototype._isDoc = function (filename) {
        return this._isType(filename, "doc");
    };
    /**
     * 判断文件是否是指定类型
     * @param filename
     * @param type
     * @private
     */
    fileUpload.prototype._isType = function (filename, type) {
        var ext = this.options.extensions[type].ext.join("|");
        var reg = new RegExp("^[\\w\\W]+\.(" + ext + ")", "ig");
        return reg.test(filename);
    };
    /**
     * 判断是否是音频格式
     * @param filename
     * @returns {*}
     * @private
     */
    fileUpload.prototype._isAudio = function (filename) {
        return this.options.previewFileExtSettings.audio(filename.substr(filename.lastIndexOf(".")));
    };
    /**
     * 判断是否是视频格式
     * @param filename
     * @returns {*}
     * @private
     */
    fileUpload.prototype._isVideo = function (filename) {
        return this.options.previewFileExtSettings.video(filename.substr(filename.lastIndexOf(".")));
    };

    /**
     * 开放给外部的接口方法，获取上传成功的文件（图片）列表（含之前传入未被删除的）
     */
    fileUpload.prototype.getFiles = function () {
        return $.extend(true, [], this.files);
    };
    /**
     * 音频文件显示模板
     * @param file
     * @returns {String}
     * @private
     */
    fileUpload.prototype._audioTemplate = function (file) {
        var template = '<div class="player file-preview-audio"><audio controls><source src="{0}" type="audio/{1}"><embed src="{0}"/></audio></div>';
        return template.Format(file, file.substr(file.lastIndexOf(".") + 1));
    };
    /**
     * 视频文件显示模板
     * @param file
     * @returns {String}
     * @private
     */
    fileUpload.prototype._videoTemplate = function (file) {
        var template = '<div class="player"><video style="width:auto;max-width:280px;height:160px;max-height:160px;" controls crossorigin>'
            + '<source src="{0}" type="video/{1}">'
            + '<object data="{0}" style="height:160px;"><embed style="height:160px;" src="{0}"></embed></object>'
            + '</video></div>';
        return template.Format(file, file.substr(file.lastIndexOf(".") + 1));
    };

    /**
     * 组件默认配置
     * @type {{container: string, uploadUrl: *, allowedFileExtensions: [*], overwriteInitial: boolean, uploadedFiles: Array, language: string, maxFileSize: number, maxFileCount: number, browseOnZoneClick: boolean, showCaption: boolean, showUpload: boolean, showRemove: boolean, dropZoneEnabled: boolean, previewFileIconSettings: {docx: string, xlsx: string, pptx: string, pdf: string, zip: string, sql: string}, slugCallback: fileUpload.defaultOptions.slugCallback}}
     */
    fileUpload.prototype.defaultOptions = {
        container: ":file",     //【接口外部调用】选择器
        isUnique: false,        //【接口外部调用】是否只能单选
        fileType: 'image',       //【接口外部调用】上传类型，
        existFiles: [],          //【接口外部调用】已上传的文件列表
        bucket: "",               //【接口外部调用】指定七牛上传空间，如果传入该值，则上传组件总是重新初始化七牛，且独立于外部的七牛配置
        completeCallback: null,   //【接口外部调用】上传成功后的回调事件
        deleteCallback: null,     //【接口外部调用】删除成功后的回调事件
        uploadUrl: helper.qiniu.UploadUrl,      //上传地址
        uploadAsync: true,
        fileActionSettings: {showZoom: false},
        allowedPreviewTypes: ['image','audio','video'],         //显示预览的类型
        allowedFileExtensions: [],  //上传格式限制
        extensions: {
            image: {bucket: "image", ext: ['jpeg','jpg','png','gif']},  //图片上传格式限制
            media: {bucket: "media", ext: ['amr','mp3','ogg','wav','wma','aac','vox','avi','mpg','mkv','mov','mp4','3gp','webm','wmv','flv','rm','rmvb']},   //媒体文件上传格式显示
            doc: {bucket: "file", ext: ['doc','docx','xls','xlsx','ppt','pptx','pdf','txt','zip']},
            all: {bucket: "file", ext: []}
        },
        overwriteInitial: false,    //是否对初始化覆盖
        language : 'zh',            //语言包
        maxFileSize: 20480,         //文件最大限制，单位Kb
        maxFileCount: 10,           //最大文件数
        browseOnZoneClick: true,    //是否预览区域可以点击上传
        showCaption: false,         //是否显示上传文件状态框
        showUpload: false,           //是否显示上传按钮
        showRemove: false,          //是否显示删除按钮
        showClose: false,           //是否显示右上角删除按钮
        dropZoneEnabled: true,      //是否显示拖拽区域
        // preferIconicPreview: true,  //是否强制使用下面的图标配置（针对初始化进来的）
        initialPreviewShowDelete: true,  //初始化传入的预览图是否显示删除按钮
        enctype: 'multipart/form-data',
        previewFileIcon: '<i class="fa fa-file"></i>',
        previewFileIconSettings: {
            'doc': '<i class="fa fa-file-word-o text-primary"></i>',
            'xls': '<i class="fa fa-file-excel-o text-success"></i>',
            'ppt': '<i class="fa fa-file-powerpoint-o text-danger"></i>',
            'pdf': '<i class="fa fa-file-pdf-o text-danger"></i>',
            'zip': '<i class="fa fa-file-archive-o text-muted"></i>',
            'htm': '<i class="fa fa-file-code-o text-info"></i>',
            'txt': '<i class="fa fa-file-text-o text-info"></i>',
            'video': '<i class="fa fa-file-movie-o text-warning"></i>',
            'audio': '<i class="fa fa-file-audio-o text-warning"></i>',
            'jpg': '<i class="fa fa-file-photo-o text-danger"></i>',
            'gif': '<i class="fa fa-file-photo-o text-warning"></i>',
            'png': '<i class="fa fa-file-photo-o text-primary"></i>'
        },
        previewFileExtSettings: {
            'doc': function(ext) {
                return ext.match(/(doc|docx)$/i);
            },
            'xls': function(ext) {
                return ext.match(/(xls|xlsx)$/i);
            },
            'ppt': function(ext) {
                return ext.match(/(ppt|pptx)$/i);
            },
            'zip': function(ext) {
                return ext.match(/(zip|rar|tar|gzip|gz|7z)$/i);
            },
            'htm': function(ext) {
                return ext.match(/(php|js|css|htm|html)$/i);
            },
            'txt': function(ext) {
                return ext.match(/(txt|ini|md|sql)$/i);
            },
            'video': function(ext) {
                return ext.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv|flv|rm|rmvb)$/i);
            },
            'audio': function(ext) {
                return ext.match(/(amr|mp3|ogg|wav|wma|aac|vox)$/i);
            }
        },
        slugCallback: function (filename) {
            //选中文件后的回调
            return filename.replace('(', '_').replace(']', '_');
        }
    };

    return fileUpload;
}));