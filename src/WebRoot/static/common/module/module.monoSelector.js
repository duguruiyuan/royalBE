/**
 * Created by lianhy on 2017/5/10.
 * 单选选择器,
 * 依赖文件lib下的jQuery、layer,bootstrap,bootstap-table
 */
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
            window.module.monoSelector = factory(null, window.jQuery, window.helper, window.layer);
        }
    }
}(function (bs, $, helper, layer) {
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

    var selector = function(params) {

        /**
         * 设置参数
         * @type {{type:string,template:string,templateData:{img:string,},url:string}}
         */
        this.defaults = {
            type: params.type,//定制组件类型，'user'用户选择器，用户模板数据，该选项如果存在其余参数全部失效
            url: params.url,//数据的url，当且仅当
            idField: params.idField,       //当前行主键的id值
            uniqueId: params.uniqueId,      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
            dataField: params.dataField,    //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
            modalHead: params.modalHead,
            keyword: params.keyword,
            pageSize:params.pageSize,
            pageList:params.pageList,
            columns: params.columns,
            area: params.area //宽高
            //窗口标题文字
        };

        this._r = (new Date()).valueOf();
        //页面相关元素 驼峰id,中线class
        this.el = {
            panel: 'panel' + this._r,
            table: 'table' + this._r,//表格
            tableTools: 'tableTools' + this._r,//表格工具栏
            typeSelector: 'typeSelector' + this._r,//工具栏类型搜索
            selectItem: 'select-item' + this._r,//工具栏类型搜索条目
            reset: 'reset' + this._r,//工具栏重置键
            search: 'search' + this._r,//工具栏搜索按钮
            keyword: 'keyword' + this._r//工具栏搜索框
        };
        this.urlMap = {
            'user': helper.url.getUrlByMapping("admin/backcommon/find_userlists.shtml"),//用户数据接口
        };

        this.layer = null;//窗口对象
        this.table = null;//表格对象

        //回调函数
        /**
         * 回调函数
         * params{data:{}}
         */
        this.callback = params.callback;

        this.init();
    };

    /**
     * 初始化
     */
    selector.prototype.init = function () {
        this._buildParams();
        this._buildView();
        this._buildEvents();
    };
    /**
     * 构造组件参数
     */
    selector.prototype._buildParams = function () {

        if(this.defaults&&this.defaults.type!==''){
            this._buildUniqueModule();
        }

        if(this.defaults.area===undefined)
            this.defaults.area = ['90%', '90%'];
        if(this.defaults.pageList===undefined)
            this.defaults.area = [15, 20, 50, 100];
        if(this.defaults.pageSize===undefined)
            this.defaults.pageSize = 20;
        if(this.defaults.modalHead===undefined)
            this.defaults.modalHead = '选择';
        if(this.defaults.dataField===undefined)
            this.defaults.dataField = 'data';
        if(this.defaults.uniqueId===undefined)
            this.defaults.uniqueId = 'id';
        if(this.defaults.idField===undefined)
            this.defaults.idField = 'id';

    };

    /**
     * 构造视图界面
     */
    selector.prototype._buildView = function () {
        var _this = this;
        //获取皮肤模板
        var template = _this._getTemplate();
        //打开窗口
        _this.layer = layer.open({
            type: 1,
            title: _this.defaults.modalHead,
            skin: 'layui-layer-rim', //加上边框
            area: ['90%', '90%'], //宽高
            content: template,
            scrollbar: false,
            btn : [ '确认', '取消'],
            btn1 : function(elem) {
                _this.confirm();
            },
            btn2 : function(elem) {
                layer.close(_this.layer);
            }
            // cancel: callFun(this.saveSelected, this)
        });
        //初始化表格视图
        _this.table = $('#'+_this.el.table).bootstrapTable({
            //请求相关
            url: _this.defaults.url,  //AJAX读取列表数据的URL
            method: "get",                  //请求方式
            contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
            dataType: "json",               //服务器返回数据类型
            cache: false,                   //不缓存数据
            queryParamsType: "limit",       //查询参数组织方式
            queryParams: function (params) {
                var keyword = $('#'+_this.el.keyword).val();
                if(keyword&&keyword!=="")params[_this.defaults.keyword] = keyword;
                params.x = params.offset;
                params.y = params.limit;
                return params;
            },

            //分页相关
            pagination: true,            //是否分页
            pageNumber:1,                //初始化加载第一页，默认第一页
            pageSize: _this.defaults.pageSize,                //每页的记录行数（*）
            pageList: _this.defaults.pageList,     //允许选择的每页的数量切换
            sidePagination: "server",    //分页方式：client客户端分页，server服务端分页（*）

            //表格总体外观相关
            // height:800,            //整个表格的高度
            height: (function () {
                var height = $('#'+_this.el.panel).parent().height() - $('#'+_this.el.tableTools).outerHeight()+25;
                return height >= 500 ? height : 500;
            })(),            //整个表格的高度
            detailView: false,      //是否显示父子表
            cardView: false,        //是否显示详细图
            undefinedText: "—",     //当数据为空的填充字符
            showColumns: true,      //是否显示筛选列按钮
            showRefresh: true,      //是否显示刷新按钮
            clickToSelect: true,    //是否开启点击选中行,自动选择rediobox 和 checkbox
            singleSelect: true,     //是否单选
            toolbar:'#'+_this.el.tableTools,  //工具按钮的容器
            //classes: 'table table-hover table-no-bordered',
            buttonsClass: 'default btn-outline',

            //表格内容相关设置
            idField:"id",       //当前行主键的id值
            uniqueId:'id',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
            dataField: 'data',//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
            columns: _this.defaults.coloums
        });

    };
    //获取默认的layer模板
    selector.prototype._getTemplate = function () {
        var template =  '<div id="{panel}">'+
            '<div id="{tableTools}">'+
            '<form class="form-inline bars" onsubmit="return false">'+
            '<div class="input-group m-r-xs">'+
            '<input id="{keyword}" name="{keyword}" type="text" class="form-control" placeholder="请输入搜索关键字">'+
            '</div>'+
            '<button id="{search}" type="button" class="btn btn-primary m-r-xs">搜索</button>'+
            '<button id="{reset}" type="button" class="btn btn-white m-r-xs">重置</button>'+
            '</form>'+
            '</div>'+
            '<div class="m-l-sm m-r-sm">'+
            '<table id="{table}"></table>'+
            '</div>'+
            '</div>';
        return template.Format(this.el);
    };
    //初始化可选定制
    selector.prototype._buildUniqueModule = function () {
        var _this = this;
        switch(_this.defaults.type){
            case 'user':  _this.defaults.coloums = [{
                field: 'selected',
                radio: true
            }, {
                field: 'name',
                title: '姓名',
                width: '200px',
                align: 'center'
            }, {
                field: 'company',
                title: '公司',
                align: 'center'
            }];
                _this.defaults.modalHead = "用户选择";
                _this.defaults.url = helper.url.getUrlByMapping("admin/backcommon/find_userlists.shtml");
                _this.defaults.keyword = 'name';break;
            default:return;
        }
    };
    /**
     * 初始化绑定事件
     * @private
     */
    selector.prototype._buildEvents = function (){
        var _this = this;
        //绑定搜索
        $('#'+this.el.search).click(callFun(this.search, this));
        //绑定回车查询
        $('#'+this.el.keyword).keyup(callFun(this.enterSearch, this));
        //绑定重置
        $('#'+this.el.reset).click(callFun(this.reset, this));
    };

    /**
     * 查询已知所有查询条件
     * @params
     */
    selector.prototype.search = function(){
        this.table.bootstrapTable('refresh');
    };
    /**
     * 回车查询
     * @params
     */
    selector.prototype.enterSearch = function (el, event) {
        if(event.keyCode == 13)this.search();
    };
    /**
     * 查询条件重置
     * @params
     */
    selector.prototype.reset = function(){
        $('#'+this.el.keyword).val('');
        this.table.bootstrapTable('refresh');
    };
    /**
     * 确认选择
     * @params
     */
    selector.prototype.confirm = function(){
        if(this.table.bootstrapTable('getSelections').length!==0){
            this.callback(this.table.bootstrapTable('getSelections')[0]);
            layer.close(this.layer);
        }
    };

    return selector;
}));