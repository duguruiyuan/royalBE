/**
 * Created by xiegy on 2017/5/15.
 * 文章/内容选择器（支持单选、多选）
 * 依赖文件lib下的jQuery、bootstrap、bootstrap-table、bootstrapValidator、layer，common下的helper.js
 */
if(!module){var module={};}
if(!module.selector){module.selector={};}

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD规范
        define(['base','jquery','helper','layer','table'], factory);
    } else {
        if (typeof module === 'object' && module.exports) {
            // Node/CommonJS
            module.exports = factory(require('base'), require('jquery'), require('helper'), require('layer'), require('table'));
        } else {
            //未引入requirejs、commonjs等
            window.module = window.module || {};
            window.module.articleSelector = factory(null, window.jQuery, window.helper, window.layer);
        }
    }
}(function(bs, $, helper, layer) {
    var setting = {
        /**
         * 默认配置项（开放给外部传入）
         * @type {{container: string, validatorContainer: string, readonly: boolean, isUnique: boolean, articleList: Array, callback: Function}}
         */
        defaultOptions: {
            container: "body",
            validatorContainer: "",
            isCircle: false,
            url: '',
            readonly: false,
            isUnique: false,
            hasExternal: true,
            articleList: [],        //数据格式：{obj_id: 1, obj_type: 2, show_title: '', article_title: '', url: '', display_order: 2}
            callback: null
        },
        /**
         * 内部私有配置字段
         * @private
         */
        private: {
            _selectApi: helper.url.getUrlByMapping("admin/backcommon/find_articlelists.shtml"),
            _selectCircleApi: helper.url.getUrlByMapping("admin/circle/find_circle_list.shtml"),
            _selectList: helper.obj.getSelectList(),
            _externalType: helper.obj.getExternalType(),
            _getObjLabel: helper.obj.getObjLabel,
            _pageSize: 20,
            _pageList: [10, 20, 50, 100]
        },
        //对象拦截
        callFun: function (fun, _this, _arg) {
            return function () {
                var arg = [];
                arg.push(this);
                arg.push.apply(arg, arguments);
                arg.push.apply(arg, _arg);
                return fun.apply(_this, arg);
            }
        }
    };

    /**
     * 选择器基类（主要负责打开选择器前的各种处理）
     * @param options
     */
    function base(options) {
        this.options = $.extend(true, {}, this.defaultOptions, options, this._private);
        $.extend(this, this.options);
        this.$container = $(this.container);    //容器
        this.layer = null;                      //打开的选择器窗口对象
        this._total = 0;                         //计数器，用于自增长创建索引使用（防止删除的项重叠用）
        this._r = (new Date()).valueOf();

        //页面相关元素
        this.el = {
            divPanel: "divPanel" + this._r,
            tableTools: "tableTools" + this._r,
            typeSelector: "typeSelector" + this._r,
            txtKeyword: "txtKeyword" + this._r,
            btnSearch: "btnSearch" + this._r,
            btnReset: "btnReset" + this._r,
            table: "table" + this._r,
            divNoSelectMsg: "divNoSelectMsg" + this._r,
            txtExternalTitle: "txtExternalTitle" + this._r,
            txtExternalLink: "txtExternalLink" + this._r
        };

        if(options){
            this.init();
        }

    }

    /**
     * 初始化构建
     */
    base.prototype.init = function () {
        if(this.isUnique){
            //构建单选
            this._buildSingleView();
            return;
        }

        //构建多选
        this._buildMultView();
    };

    /**
     * 构建单选view及事件
     * @private
     */
    base.prototype._buildSingleView = function () {
        this.$container.empty().html(this._getSingleViewTemplate());

        if(this.readonly)
            this.$container.find("button").hide();

        //绑定事件
        this.$container.find(".close").on("click", this.callFun(this._remove, this));
        this.$container.find(".well").on("click", this.callFun(this._show, this));
        this.$container.find(".handle-inside").on("click", this.callFun(this._openSelector, this));
        this.$container.find(".handle-incircle").on("click", this.callFun(this._openCirecle, this));
        this.$container.find(".handle-outside").on("click", this.callFun(this._openExternal, this))
    };

    /**
     * 构建多选view及事件
     * @private
     */
    base.prototype._buildMultView = function () {
        if(this.readonly){
            //多选时只读模式下也按单选查看模式构建
            return this._buildSingleView();
        }

        this.$container.empty().html(this._getMultViewTemplate());
        this._changeTableState();
        this._addValidator();

        this.$container.on("change", "input", this.callFun(this._change, this));
        this.$container.on("click", ".handle-show", this.callFun(this._show, this));
        this.$container.on("click", ".handle-delete", this.callFun(this._remove, this));
        this.$container.on("click", ".handle-up", this.callFun(this._changeOrder, this, [-1]));
        this.$container.on("click", ".handle-down", this.callFun(this._changeOrder, this, [1]));
        this.$container.find(".handle-inside").on("click", this.callFun(this._openSelector, this));
        this.$container.find(".handle-outside").on("click", this.callFun(this._openExternal, this))
    };

    /**
     * 变更无记录、上移/下移的显示状态
     * @private
     */
    base.prototype._changeTableState = function () {
        this.articleList.length == 0 ? $("#" + this.el.divNoSelectMsg).show() : $("#" + this.el.divNoSelectMsg).hide();

        var $first = this.$container.find("tbody tr:first");
        var $last = this.$container.find("tbody tr:last");
        if($first.get(0) == $last.get(0)){
            $first.find(".handle-up,.handle-down").attr("disabled", "disabled");
            return;
        }

        $first.find(".handle-up").attr("disabled", "disabled");
        $first.find(".handle-down").removeAttr("disabled");
        $last.find(".handle-up").removeAttr("disabled");
        $last.find(".handle-down").attr("disabled", "disabled");
        this.$container.find("tbody tr:not(:first,:last)").find(".handle-up,.handle-down").removeAttr("disabled");
    };

    /**
     * 查看文章详情
     * @param el
     * @private
     */
    base.prototype._show = function (el) {
        var $el = $(el);
        var options = {obj_id: $el.data("obj-id"), obj_type: $el.data("obj-type"), article_title: $el.data("article-title"), url: $el.data("url")};
        helper.win.openInfoByObj(options);
    };
    /**
     * 删除已选中的项
     * @param el
     * @private
     */
    base.prototype._remove = function (el, event) {
        var $el = $(el).closest($(el).data("row-el"));
        this._deleteData($el.index());

        var _this = this;
        $el.hide("slow", function () {
            $el.remove();
            _this._changeTableState();
        });

        event.stopPropagation();
    };

    /**
     *
     * @param el
     * @private
     */
    base.prototype._change = function (el) {
        var $el = $(el);
        this._changeData($el.closest($(el).data("row-el")).index(), $el.val());
    };

    /**
     * 变更位置
     * @param el
     * @param offset  位置偏移量，-1：上移，+1：下移
     * @private
     */
    base.prototype._changeOrder = function (el, event, offset) {
        var $el = $(el).closest($(el).data("row-el"));

        var index = $el.index();
        this._changeOrderData(index, offset);

        var _this = this;
        switch (offset){
            case -1:
                $el.hide("normal", function () {
                    $el.insertBefore($el.prev()).show("normal");
                    _this._changeTableState();
                });
                break;
            case 1:
                $el.hide("normal", function () {
                    $el.insertAfter($el.next()).show("normal");
                    _this._changeTableState();
                });
                break;
        }
    };

    /**
     * 打开新增外部链接事件
     * @private
     */
    base.prototype._openExternal = function () {
        this.layer = layer.open({
            type: 1,
            title: '请输入外链信息',
            skin: 'layui-layer-rim', //加上边框
            area: ['500px', '330px'], //宽高
            scrollbar: false,
            content: this._getExternalTemplate(),
            success: this.callFun(this._externalValidator, this)
        });

        $("#" + this.el.divPanel + " input").keyup(this.callFun(this._enterSaveExternal, this));
        $("#" + this.el.divPanel + " .handle-save").click(this.callFun(this._saveExternal, this));
        $("#" + this.el.divPanel + " .handle-cancel").click(this.callFun(this._cancelExternal, this));
    };

    /**
     * 设置外部链接事件的验证器
     * @private
     */
    base.prototype._externalValidator = function () {
        var fields = {};
        fields[this.el.txtExternalTitle] = {
            message: '标题验证不通过',
            validators: {
                notEmpty: {/*非空提示*/
                    message: '标题不能为空'
                },stringLength:{
                    max: 100,
                    message: "标题不能超过100个字"
                }
            }
        };
        fields[this.el.txtExternalLink] = {
            message: '链接验证不通过',
            validators: {
                notEmpty: {/*非空提示*/
                    message: '链接地址不能为空'
                },
                regexp: {
                    regexp: /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,
                    message: '链接地址不正确'
                }
            }
        };

        $("#" + this.el.divPanel).bootstrapValidator({
            //指定不验证的情况
            excluded: [':disabled', ':hidden', ':not(:visible)'],
            message: '验证未通过',
            feedbackIcons: {/*输入框不同状态，显示图片的样式*/
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: fields
        });

        $("#" + this.el.txtExternalTitle).focus();
    };

    /**
     * 回车键保存外链
     * @private
     */
    base.prototype._enterSaveExternal = function (el, event) {
        if(event.keyCode == 13)
            this._saveExternal();
    };
    /**
     * 保存外链
     * @private
     */
    base.prototype._saveExternal = function () {
        var bv = $("#" + this.el.divPanel).data("bootstrapValidator");
        bv.validate();
        if(!bv.isValid())  return;

        var data = {
            obj_id: 0,
            obj_type: this._externalType,
            show_title: $("#" + this.el.txtExternalTitle).val(),
            url: $("#" + this.el.txtExternalLink).val()
        };
        data.article_title = data.show_title + data.url;

        this._selectedCallback(data);

        layer.close(this.layer);
    };
    base.prototype._cancelExternal = function () {
        layer.close(this.layer);
    };

    /**
     * 动态添加bootstrap-validator的验证项
     * @private
     */
    base.prototype._addValidator = function () {
        if(!this.validatorContainer || this.validatorContainer === "") return;

        var valid = $(this.validatorContainer).data("bootstrapValidator");
        this.$container.find("input").each(function () {
            valid.addField($(this).attr("name"), {
                message:'文章显示标题验证不通过',
                validators: {
                    notEmpty: {/*非空提示*/
                        message: '文章的显示标题不能为空'
                    },
                    stringLength:{
                        max: 100,
                        message: "文章的显示标题不能超过100个字"
                    }
                }
            });
        });
    };

    /**
     * 选择器打开并选中后的回调
     * @param data
     * @private
     */
    base.prototype._selectedCallback = function (data) {
        this._insertData(data);
        if(this.isUnique)
            this._buildSingleView();
        else{
            this.$container.find("table tbody").append(this._getMultItemTemplate(data));
            this._changeTableState();
            this._addValidator();
        }

        //回调函数
        if(this.callback && this.callback instanceof Function)
            this.callback(data);
    };

    /**
     * 增加一项
     * @param item
     * @private
     */
    base.prototype._insertData = function (item) {
        if(this.isUnique){
            //单选时
            this.articleList = [item];
            return;
        }

        //多选时
        this.articleList.push(item);
    };

    /**
     * 删除某一项
     * @param index
     * @private
     */
    base.prototype._deleteData = function (index) {
        this.articleList.splice(index, 1);
    };

    /**
     * 变更某一项的显示标题
     * @param index
     * @param title
     * @private
     */
    base.prototype._changeData = function (index, title) {
        if(index <0 || index >= this.articleList.length) return;

        this.articleList[index].show_title = title;
    };

    /**
     * 变更某一项的位置
     * @param index     要变更的项
     * @param offset    位置偏移量，-1：上移，+1：下移
     * @private
     */
    base.prototype._changeOrderData = function (index, offset) {
        var newIndex = index + offset;
        if(newIndex < 0 || newIndex >= this.articleList.length) return;

        this.articleList[index] = this.articleList.splice(newIndex, 1, this.articleList[index])[0];
    };


    /**
     * 单选时的模板
     * @returns {string}
     * @private
     */
    base.prototype._getSingleViewTemplate = function () {
        var template = '', data = {};
        this.articleList.sort(function (a, b) {
            return a.display_order - b.display_order;
        });

        for(var i = 0; i < this.articleList.length; i++){
            template += '<div class="well text-primary cursor m-b-xs" title="点击预览" data-obj-id="{obj_id}" data-obj-type="{obj_type}" data-article-title="{article_title}" data-url="{url}">'
                +'<button type="button" class="close" data-row-el=".well" data-dismiss="alert"><span>&times;</span></button>'
                +'<span class="text-warning">【{obj_label}】</span>{show_title}'
                +'</div>';

            data = {"obj_label": this._getObjLabel(this.articleList[i]["obj_type"])};
            data = $.extend(data, this.articleList[i]);
            template = template.Format(data);
        }
        template += '<div class="m-b-md"><button type="button" class="handle-inside btn btn-primary"><i class="glyphicon glyphicon-file"></i>&nbsp;选择文章</button>';
        if (this.isCircle) {
        	template += '<button type="button" class="handle-incircle btn btn-warning m-l-xs"><i class="glyphicon glyphicon-user"></i>&nbsp;选择圈子</button>';
        }
        if(this.hasExternal){
            template += '<button type="button" class="handle-outside btn btn-warning m-l-xs"><i class="glyphicon glyphicon-link"></i>&nbsp;添加站外文章</button>';
        }

        template += '</div>';

        return template;
    };

    /**
     * 多选时的模板
     * @returns {string}
     * @private
     */
    base.prototype._getMultViewTemplate = function () {
        var template = '', data = {};
        this.articleList.sort(function (a, b) {
            return a.display_order - b.display_order;
        });

        template = '<div class="full-width">'
            +'<table class="table table-hover table-bordered m-b-xs">'
            +'<thead><tr><th class="text-center">显示标题</th><th class="text-center" style="width: 400px;">原文章标题</th><th class="text-center" style="width:200px;">操作</th></tr></thead>'
            +'<tbody>';

        for(var i = 0; i < this.articleList.length; i++){
            template += this._getMultItemTemplate(this.articleList[i]);
        }

        template += '</tbody></table>'
            +'<div id="{0}" class="text-center text-muted m-b-md">您还没有选中任何文章</div>'.Format(this.el.divNoSelectMsg)
            +'<div class="m-b-md clearfix">';

        if(this.hasExternal){
            template += '<button type="button" class="handle-outside btn btn-warning pull-right m-l-xs"><i class="glyphicon glyphicon-link"></i>&nbsp;添加站外文章</button>';
        }

        template += '<button type="button" class="handle-inside btn btn-primary pull-right"><i class="glyphicon glyphicon-file"></i>&nbsp;添加站内文章</button>'
            +'</div></div>';

        return template;
    };
    /**
     * 获取某一项的模板
     * @param article
     * @returns {String}
     * @private
     */
    base.prototype._getMultItemTemplate = function (article) {
        var template = '<tr>'
            +'<td><div class="form-group" style="margin: 0px;">'
            +'<input type="text" id="articleTitle{r}_{total}" name="articleTitle{r}_{total}" data-row-el="tr" class="form-control" value="{show_title}" placeholder="请输入要显示的文章标题" />'
            +'</div></td>'
            +'<td><span class="text-warning">【{obj_label}】</span>{article_title}</td>'
            +'<td class="text-center">'
            +'<button type="button" class="handle-show btn btn-sm btn-info" data-obj-id="{obj_id}" data-obj-type="{obj_type}" data-article-title="{article_title}" data-url="{url}" title="预览"{disabled}><i class="fa fa-external-link"></i></button>'
            +'<button type="button" class="handle-delete btn btn-sm btn-danger m-l-xs" data-row-el="tr" title="删除"><i class="fa fa-trash"></i></button>'
            +'<button type="button" class="handle-up btn btn-sm btn-warning m-l-xs" data-row-el="tr" title="上移"><i class="fa fa-arrow-up"></i></button>'
            +'<button type="button" class="handle-down btn btn-sm btn-warning m-l-xs" data-row-el="tr" title="下移"><i class="fa fa-arrow-down"></i></button>'
            +'</td>'
            +'</tr>';

        var url = helper.url.getInfoUrlByObj(article.obj_id, article.obj_type, article.url);
        var data = {r: this._r,
            total: this._total++,
            disabled: url === "" ? ' disabled="disabled"' : '',
            "obj_label": this._getObjLabel(article.obj_type)
        };
        data = $.extend(data, article);
        return template.Format(data);
    };

    /**
     * 获取打开输入外链的模板
     * @returns {string}
     * @private
     */
    base.prototype._getExternalTemplate = function () {
        var template = '<div id="{divPanel}" style="wrapper wrapper-content full-height">'
            +'<form class="form-horizontal p-lg" onsubmit="return false">'
            +'<div class="form-group">'
            +'<label class="col-sm-2 control-label">标题</label>'
            +'<div class="col-sm-9"><input id="{txtExternalTitle}" name="{txtExternalTitle}" type="text" class="form-control" /></div></div>'
            +'<div class="form-group">'
            +'<label class="col-sm-2 control-label">链接</label>'
            +'<div class="col-sm-9"><input id="{txtExternalLink}" name="{txtExternalLink}"  type="text" class="form-control" placeholder="请输入以http|ftp|https开头的完整url链接" /></div></div>'
            +'<div class="form-group">'
            +'<div class="col-sm-4 col-sm-offset-2"><button class="handle-save btn btn-primary btn-block" type="button"><i class="fa fa-check"></i>&nbsp;保存</button></div>'
            +'<div class="col-sm-4"><button class="handle-cancel btn btn-default btn-block" type="button"><i class="fa fa-remove"></i>&nbsp;取消</button></div>'
            +'</div>'
            +'</form>'
            +'</div>';

        return template.Format(this.el);
    };


    base.prototype.defaultOptions = setting.defaultOptions;
    base.prototype._private = setting.private;
    base.prototype.callFun = setting.callFun;

    /**
     * 【提供外部调用】获取所有的选中的文章列表
     */
    base.prototype.getArticles = function () {
        var data = $.extend(true, [], this.articleList);
        $.each(data, function (i, n) {
            n.display_order = i + 1;
        });

        return data;
    };


    /**
     * 选择器部分
     */
    function selector(options) {
        base.call(this, options);
        this.$table = null;
        this.$tableTools = null;
    }
    selector.prototype = new base();

    /**
     * 打开选择器
     * @private
     */
    selector.prototype._openSelector = function () {
        var template = this._getSelectorTemplate();

        this.layer = layer.open({
            type: 1,
            title: '请选择文章',
            skin: 'layui-layer-rim', //加上边框
            area: ['90%', '90%'], //宽高
            content: template,
            scrollbar: false
        });

        this.$tableTools = $("#" + this.el.tableTools);
        this.initTable();

        //绑定事件
        $("#"+this.el.tableTools+' li a').click(this.callFun(this._searchByType, this));
        $("#"+this.el.txtKeyword).keyup(this.callFun(this._enterSearch, this));
        $("#"+this.el.btnSearch).click(this.callFun(this._search, this));
        $("#"+this.el.btnReset).click(this.callFun(this._reset, this));
        this.$table.on("click", ".handle-view", this.callFun(this._show, this));
        this.$table.on("click", ".handle-selected", this.callFun(this._selected, this));
        this.$table.on("dblclick", "tr", this.callFun(this._selected, this));

        $(window).resize(this.callFun(this._resize, this));
    };
    
    /**
     * 打开圈子选择器
     * @private
     */
    selector.prototype._openCirecle = function () {
        var template = this._getSelectorCircleTemplate();

        this.layer = layer.open({
            type: 1,
            title: '请选择圈子',
            skin: 'layui-layer-rim', //加上边框
            area: ['90%', '90%'], //宽高
            content: template,
            scrollbar: false
        });

        this.$tableTools = $("#" + this.el.tableTools);
        this.initCirecleTable();

        //绑定事件
        $("#"+this.el.tableTools+' li a').click(this.callFun(this._searchByType, this));
        $("#"+this.el.txtKeyword).keyup(this.callFun(this._enterSearch, this));
        $("#"+this.el.btnSearch).click(this.callFun(this._search, this));
        $("#"+this.el.btnReset).click(this.callFun(this._reset, this));
        this.$table.on("click", ".handle-view", this.callFun(this._show, this));
        this.$table.on("click", ".handle-selected", this.callFun(this._selected, this));
        this.$table.on("dblclick", "tr", this.callFun(this._selected, this));

        $(window).resize(this.callFun(this._resize, this));
    };
    
    /**
     * 初始化表格视图
     */
    selector.prototype.initTable = function () {
        this.$table = $('#'+this.el.table).bootstrapTable({
            //请求相关
            url: this.options.url ? this.options.url + '?is_feed=1' : this._selectApi + '?is_feed=1',  //AJAX读取列表数据的URL
            method: "get",                  //请求方式
            contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
            dataType: "json",               //服务器返回数据类型
            cache: false,                   //不缓存数据
            queryParamsType: "limit",       //查询参数组织方式
            queryParams: this.callFun(this._queryParam, this),

            //分页相关
            pagination: true,            //是否分页
            pageNumber:1,                //初始化加载第一页，默认第一页
            pageSize: this._pageSize,                //每页的记录行数（*）
            pageList: this._pageList,     //允许选择的每页的数量切换
            sidePagination: "server",    //分页方式：client客户端分页，server服务端分页（*）

            //表格总体外观相关
            height: this._getAdaptTableHeight(),            //整个表格的高度
            detailView: false,      //是否显示父子表
            cardView: false,        //是否显示详细图
            undefinedText: "—",     //当数据为空的填充字符
            showColumns: false,      //是否显示筛选列按钮
            showRefresh: false,      //是否显示刷新按钮
            clickToSelect: true,    //是否开启点击选中行,自动选择rediobox 和 checkbox
            singleSelect: true,     //是否单选

            //表格内容相关设置
            idField:"id",       //当前行主键的id值
            uniqueId:'id',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
            dataField: 'data',//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
            columns: [{
                field: 'obj_type',
                title: '类型',
                width: '150px',
                align: 'center',
                formatter: this.callFun(this._formatterType, this)
            }, {
                field: 'title',
                title: '文章标题<span class="text-warning">&nbsp;&nbsp;<i class="fa fa-lightbulb-o"></i>&nbsp;在任一行上《双击鼠标》可直接选中文章</span>',
                align: 'left'
            }, {
                field: '',
                title: '操作',
                width: '200px',
                align: 'center',
                formatter: this.callFun(this._formatterHandle, this)
            }]
        });
    };
    
    /**
     * 初始化圈子表格视图
     */
    selector.prototype.initCirecleTable = function () {
        this.$table = $('#'+this.el.table).bootstrapTable({
            //请求相关
            url: this._selectCircleApi + '?state=1&status=1',  //AJAX读取列表数据的URL
            method: "get",                  //请求方式
            contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
            dataType: "json",               //服务器返回数据类型
            cache: false,                   //不缓存数据
            queryParamsType: "limit",       //查询参数组织方式
            queryParams: this.callFun(this._queryCircleParam, this),

            //分页相关
            pagination: true,            //是否分页
            pageNumber:1,                //初始化加载第一页，默认第一页
            pageSize: this._pageSize,                //每页的记录行数（*）
            pageList: this._pageList,     //允许选择的每页的数量切换
            sidePagination: "server",    //分页方式：client客户端分页，server服务端分页（*）

            //表格总体外观相关
            height: this._getAdaptTableHeight(),            //整个表格的高度
            detailView: false,      //是否显示父子表
            cardView: false,        //是否显示详细图
            undefinedText: "—",     //当数据为空的填充字符
            showColumns: false,      //是否显示筛选列按钮
            showRefresh: false,      //是否显示刷新按钮
            clickToSelect: true,    //是否开启点击选中行,自动选择rediobox 和 checkbox
            singleSelect: true,     //是否单选

            //表格内容相关设置
            idField:"id",       //当前行主键的id值
            uniqueId:'id',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
            dataField: 'data',//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
            columns: [{
                field: 'title',
                title: '名称',
                width: '150px',
                align: 'center'
                //formatter: this.callFun(this._formatterType, this)
            }, {
                field: 'circle_zhu_name',
                title: '圈主',
                align: 'left'
            }, {
                field: 'master_name',
                title: '创建人',
                align: 'left'
            }, {
                field: 'create_time',
                title: '创建时间',
                align: 'left',
                formatter: function(value){
                    return helper.convert.formatDate(value);
                }
            }, {
                field: '',
                title: '操作',
                width: '200px',
                align: 'center',
                formatter: this.callFun(this._formatterHandle, this)
            }]
        });
    };
    /**
     * 类型查询
     * @params{elem:{}}
     */
    selector.prototype._searchByType = function(elem){
        var $this = $(elem);
        $('#'+this.el.typeSelector).data('obj-type',$this.data('obj-type')).html(this._getMenuTemplate($this.data('obj-type')));
        this.$table.bootstrapTable('refresh');
    };
    /**
     * 查询已知所有查询条件
     */
    selector.prototype._search = function(){
        this.$table.bootstrapTable('refresh');
    };
    /**
     * 回车查询
     * @params
     */
    selector.prototype._enterSearch = function (el, event) {
        if(event.keyCode == 13)
            this._search();
    };
    /**
     * 重置
     * @private
     */
    selector.prototype._reset = function () {
        $('#'+this.el.txtKeyword).val('');
        $('#'+this.el.typeSelector).data('obj_type','').html(this._getMenuTemplate());
        this.$table.bootstrapTable('refresh');
    };

    /**
     * 选中后事件
     * @private
     */
    selector.prototype._selected = function (el) {
        var rowDate = this.$table.bootstrapTable('getRowByUniqueId', $(el).data("uniqueid"));
        if(rowDate){
            var data = {
                "obj_id": rowDate.obj_id,
                "obj_type": rowDate.obj_type,
                "show_title": rowDate.title,
                "article_title": rowDate.title,
                "url": ""
            };

            this._selectedCallback(data);
            layer.close(this.layer);
        }
    };

    //表格请求参数
    selector.prototype._queryParam = function (table, params) {
        var keyword = $('#'+this.el.txtKeyword).val();
        if(keyword && keyword!=="") params.name = keyword;

        var searchType = $('#'+this.el.typeSelector).data('obj-type');
        if(searchType && searchType!=="") params.objtype = searchType;

        params.x = params.offset;
        params.y = params.limit;

        return params;
    };
    
    //表格请求参数
    selector.prototype._queryCircleParam = function (table, params) {
        var keyword = $('#'+this.el.txtKeyword).val();
        if(keyword && keyword!=="") params.title = keyword;

        params.x = params.offset;
        params.y = params.limit;

        return params;
    };
    
    //文章类型转换
    selector.prototype._formatterType = function (table, value) {
        return this._getObjLabel(value);
    };
    //操作
    selector.prototype._formatterHandle = function (table, value, row) {
        var url = helper.url.getInfoUrlByObj(row.obj_id, row.obj_type, "");
        var data = {
            id: row.id,
            obj_id: row.obj_id,
            obj_type: row.obj_type,
            article_title: row.title,
            disabled: url === "" ? ' disabled="disabled"': '',
            url: url
        };
        var template = '<button type="button" class="handle-selected btn btn-sm btn-info" data-uniqueid="{id}"><i class="fa fa-check-square-o"></i>&nbsp;选中</button>'
            +'<button type="button" class="handle-view btn btn-sm btn-default m-l-xs" data-obj-id="{obj_id}" data-obj-type="{obj_type}" data-article-title="{article_title}" data-url="{url}"{disabled}><i class="fa fa-external-link"></i>&nbsp;查看</button>';
        return template.Format(data)
    };

    //获取提供给表格位置的自适应浏览器的高度，最小高度500
    selector.prototype._getAdaptTableHeight = function () {
        var height = $("#" + this.el.divPanel).height() - this.$tableTools.outerHeight() - 20;
        return height >= 500 ? height : 500;
    };

    /**
     * 自适应窗口大小
     * @private
     */
    selector.prototype._resize = function () {
        this.$table.bootstrapTable("resetView", {height: this._getAdaptTableHeight()});
    };

    /**
     * 选择器的模板
     * @private
     */
    selector.prototype._getSelectorTemplate = function () {
        var template = '<div id="{divPanel}" class="wrapper wrapper-content animated full-height">'
            +'<div id="{tableTools}" class="m-b">'
            +'<form class="bars" onsubmit="return false">'
            +'<div class="input-group">'
            +'<div class="input-group-btn">'
            +'<button id="{typeSelector}" type="button" class="btn btn-white btn-outline dropdown-toggle" data-obj-type="" data-toggle="dropdown">{menuTemplate}</button>'
            +'<ul class="dropdown-menu">';

        for(var i = 0; i < this._selectList.length; i++){
            template += '<li><a data-obj-type="{objType}" href="#">{objLabel}</a></li>'.Format(this._selectList[i]);
        }
 
        template += '</ul></div>'
            +'<input id="{txtKeyword}" name="{txtKeyword}" type="text" class="form-control" placeholder="请输入搜索关键字，按回车键搜索" />'
            +'<div class="input-group-btn">'
            +'<button id="{btnSearch}" type="button" class="btn btn-primary"><i class="glyphicon glyphicon-search"></i></button>'
            +'<button id="{btnReset}" type="reset" class="btn btn-default">重置</button>'
            +'</div></div></form>'
            +'</div>'
            +'<table id="{table}"></table>'
            +'</div>';

        var format = $.extend({menuTemplate: this._getMenuTemplate()}, this.el);
        return template.Format(format);
    };
    
    /**
     * 选择器的模板
     * @private
     */
    selector.prototype._getSelectorCircleTemplate = function () {
        var template = '<div id="{divPanel}" class="wrapper wrapper-content animated full-height">'
            +'<div id="{tableTools}" class="m-b">'
            +'<form class="bars" onsubmit="return false">'
            +'<div class="input-group">'
            +'<input id="{txtKeyword}" name="{txtKeyword}" type="text" class="form-control" placeholder="请输入搜索关键字，按回车键搜索" />'
            +'<div class="input-group-btn">'
            +'<button id="{btnSearch}" type="button" class="btn btn-primary"><i class="glyphicon glyphicon-search"></i></button>'
            +'<button id="{btnReset}" type="reset" class="btn btn-default">重置</button>'
            +'</div></div></form>'
            +'</div>'
            +'<table id="{table}"></table>'
            +'</div>';

        var format = $.extend({menuTemplate: this._getMenuTemplate()}, this.el);
        return template.Format(format);
    };
    
    selector.prototype._getMenuTemplate = function (objType) {
        if(objType === undefined) objType = "";

        return '{0}&nbsp;<span class="caret"></span>'.Format(this._getObjLabel(objType));
    };

    return selector;
}));