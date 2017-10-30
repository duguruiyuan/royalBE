/**
 * Created by lianhy on 2017/5/6.
 * 文章选择器,按常理是多选,设计为单选
 * 依赖文件lib下的jQuery、layer,bootstrap,bootstap-table
 */
if(!module) {var module = {};}
if(!module.articleSelector) module.articleSelector = {};
/**
 * 配置项
 */
(function ($) {
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
            url: params.url||'backcommon/find_articlelists.shtml',//文章的url,
            idField: params.idField||"id",       //当前行主键的id值
            uniqueId: params.uniqueId||'id',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
            dataField: params.dataField||'data',//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
            modalHead: params.modalHead||'文章选择',
            pageSize:params.pageSize||20,
            pageList:params.pageList||[15, 20, 50, 100],
            area: params.area||['90%', '90%'] //宽高
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
        this._buildView();
        this._buildEvents();
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
                var searchType = $('#'+_this.el.typeSelector).attr('data-value');
                if(keyword&&keyword!=="")params.name = keyword;
                if(searchType&&searchType!=="")params.objtype = searchType;
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
            columns: [{
                field: 'selected',
                radio: true
            }, {
                field: 'title',
                title: '标题',
                align: 'center'
            }, {
                field: 'obj_type',
                title: '类型',
                width: '200px',
                align: 'center',
                formatter: function(value,row,index){
                    switch(value){
                        case 1: return '早报';break;
                        case 2: return '秘闻';break;
                        case 4: return '活动';break;
                        case 5: return '话题';break;
                        case 18: return '圈子帮助';break;
                        case 19: return '圈子分享';break;
                        case 8: return '榜样';break;
                        case 6: return '热点';break;
                        case 9: return '工商联新闻';break;
                        case 10: return '商机(招商项目)';break;
                        case 12: return '用户动态';break;
                        case 13: return '商会资讯';break;
                        case 14: return '商会通知';break;
                        default: return '其他'
                    }
                }
            }]
        });

    };
    //获取默认的layer模板
    selector.prototype._getTemplate = function () {
        // var template =  '<div style="margin-bottom: 10px;display: flex;display: -webkit-flex;justify-content: space-around;align-items: center" id="ASelectorTool">' +
        //                 '<form class="form-inline bars" onsubmit="return false">'+
        //                 '<div class="input-group m-b-xs">'+
        //                 '<select id="textType" class="form-control">'+
        //                 '<option value="">全部</option>'+
        //                 '<option value="0">图文（短文）</option>'+
        //                 '<option value="1">早报</option>'+
        //                 '<option value="2">秘闻</option>'+
        //                 '<option value="4">活动</option>'+
        //                 '<option value="5">话题</option>'+
        //                 '<option value="18">圈子帮助</option>'+
        //                 '<option value="19">圈子分享</option>'+
        //                 '<option value="8">榜样</option>'+
        //                 '<option value="6">热点）</option>'+
        //                 '<option value="9">工商联新闻</option>'+
        //                 '<option value="10">商机(招商项目)</option>'+
        //                 '<option value="12">用户动态</option>'+
        //                 '<option value="13">商会资讯</option>'+
        //                 '<option value="14">商会通知</option>'+
        //                 '</select>'+
        //                 '</div>'+
        //                 '<div class="input-group m-b-xs">'+
        //                 '<input id="{keyword}" name="keyword" type="text" class="form-control" placeholder="请输入搜索关键字">'+
        //                 '</div>'+
        //                 '<button id="{search}" type="button" class="btn btn-primary m-r-sm">搜索</button>'+
        //                 '<button id="{reset}" type="button" class="btn btn-white m-r-sm">重置</button>'+
        //                 '</form>'+
        //                 '</div>'+
        //                 '<table id="{table}"></table>'+
        //                 '</div>';


        var template =  '<div id="{panel}">'+
                        '<div id="{tableTools}">'+
                        '<form class="form-inline bars" onsubmit="return false">'+
                        '<div class="btn-group m-r-xs">'+
                        '<button id="{typeSelector}" type="button" data-value="" class="btn btn-white dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                        '全部<span class="caret"></span>'+
                        '</button>'+
                        '<ul class="dropdown-menu">'+
                        '<li><a data-value="" class="{selectItem}">全部</a></li>'+
                        '<li><a data-value="1" class="{selectItem}">早报</a></li>'+
                        '<li><a data-value="2" class="{selectItem}">秘闻</a></li>'+
                        '<li><a data-value="4" class="{selectItem}">活动</a></li>'+
                        '<li><a data-value="5" class="{selectItem}">话题</a></li>'+
                        '<li><a data-value="18" class="{selectItem}">圈子帮助</a></li>'+
                        '<li><a data-value="19" class="{selectItem}">圈子分享</a></li>'+
                        '<li><a data-value="8" class="{selectItem}">榜样</a></li>'+
                        '<li><a data-value="6" class="{selectItem}">热点</a></li>'+
                        '<li><a data-value="9" class="{selectItem}">工商联新闻</a></li>'+
                        '<li><a data-value="10" class="{selectItem}">商机(招商项目)</a></li>'+
                        '<li><a data-value="12" class="{selectItem}">用户动态</a></li>'+
                        '<li><a data-value="13" class="{selectItem}">商会资讯</a></li>'+
                        '<li><a data-value="14" class="{selectItem}">商会通知</a></li>'+
                        '</ul>'+
                        '</div>'+
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

    /**
     * 初始化绑定事件
     * @private
     */
    selector.prototype._buildEvents = function (){
        var _this = this;
        //绑定类型选择事件
        $('.'+this.el.selectItem).click(callFun(this.searchByType, this));
        //绑定搜索
        $('#'+this.el.search).click(callFun(this.search, this));
        //绑定回车查询
        $('#'+this.el.keyword).keyup(callFun(this.enterSearch, this));
        //绑定重置
        $('#'+this.el.reset).click(callFun(this.reset, this));
    };

    /**
     * 类型查询
     * @params{elem:{}}
     */
    selector.prototype.searchByType = function(elem){
        var $this = $(elem);
        $('#'+this.el.typeSelector)
            .attr('data-value',$this.attr('data-value'))
            .html($this.text()+'<span class="caret"></span>');
        this.table.bootstrapTable('refresh');
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
        $('#'+this.el.typeSelector)
            .attr('data-value','')
            .html('全部'+'<span class="caret"></span>');
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

    module.articleSelector = selector;
})(jQuery);