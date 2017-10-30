//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastrPlus', 'module.push', 'datetimepicker', 'table', 'tableEditable'], function (bs, $, helper, swal, layer, toastr) {
//页面所用到AJAX请求的URL
page.CONFIG = {
    GET_LIST: helper.url.getUrlByMapping("admin/article/find_articlestatistics.shtml")    //查询文章数据统计
};

//存储页面table对象
page.$tool = $('#tableTools');
page.$table = $('#tableList');

/**
 * 提供给引用页面刷新用，如果未声明该方法，则引用页面调用将使用浏览器重载重新刷新本页面
 */
page.refresh = function () {
    $("#btnSearch").click();
};
var i=0;
//页面级的帮助对象集合
page.derive = {
    //获取表单参数用于搜索
    getParams: function (params) {
    	params.obj_type = $("#obj_type").val();
        params.start_create_time = helper.convert.formatTimestamp($("#startTime").val());
        params.end_create_time = helper.convert.formatTimestamp($("#endTime").val(), {day: 1});
        params.keywords = $("#keywords").val();
        params.x = params.offset;   //服务端分页，过滤掉前xxx条记录
        params.y = params.limit;    //服务端分页，每页记录数
        console.log(params);
        return params;
    },

    
    //获取提供给表格位置的自适应浏览器的高度，最小高度500
    getAdaptTableHeight: function () {
        var height = $(window).height() - page.$tool.offset().top - page.$tool.outerHeight() - 30;
        return height >= 500 ? height : 500;
    }
    
};

//页面事件
page.eventHandler = {
    
};


$(document).ready(function () {
    //初始化日期控件
    $('.form_date').datetimepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: true,
        startView: 2,
        minView: 2,
        forceParse: true
    }).on("click", function (e) {
        //设置日期控件前后日期的依赖
        var $this = $(e.target);
        if($this.attr("data-start")){
            $this.datetimepicker("setStartDate", $($this.attr("data-start")).val());
        }
        if($this.attr("data-end")){
            $this.datetimepicker("setEndDate", $($this.attr("data-end")).val());
        }
    });

    //表格初始化
    page.$table.bootstrapTable({
        //请求相关
        url: page.CONFIG.GET_LIST,  //AJAX读取列表数据的URL
        method: "post",                  //请求方式
        contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
        dataType: "json",               //服务器返回数据类型
        cache: false,                   //不缓存数据
        queryParamsType: "limit",       //查询参数组织方式
        queryParams: function (params) {
            return page.derive.getParams(params);
        },

        //分页相关
       // sortable: true,
        pagination: true,            //是否分页
        pageNumber:1,                //初始化加载第一页，默认第一页
        pageSize: 20,                //每页的记录行数（*）
        pageList: [10,20, 50, 100],     //允许选择的每页的数量切换
        sidePagination: "server",    //分页方式：client客户端分页，server服务端分页（*）

        //表格总体外观相关
        height: page.derive.getAdaptTableHeight(),            //整个表格的高度
        detailView: false,      //是否显示父子表
        cardView: false,        //是否显示详细图
        undefinedText: "—",     //当数据为空的填充字符
        showColumns: true,      //是否显示筛选列按钮
        showRefresh: true,      //是否显示刷新按钮
        clickToSelect: true,    //是否开启点击选中行,自动选择rediobox 和 checkbox
        toolbar:'#tableTools',  //工具按钮的容器
        //classes: 'table table-hover table-no-bordered',
        //buttonsClass: 'default btn-outline',

        //表格内容相关设置
        idField:"obj_id",       //当前行主键的id值
        uniqueId:'obj_id',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
        dataField: "data",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
        columns: [{
            field: 'obj_title',
            title: '标题',
            align: 'left'
        }, {
            field: 'obj_type_name',
            title: '类型',
            align: 'center'
        },{
            field: 'create_time',
            title: '发布时间',
            width: "100px",
            formatter: function(value){
                return helper.convert.formatDate(value);
            },
            align: 'center',
            sortable : true
        },{
            field: 'comment_count',
            title: '评论数',
            width: '40px',
            align: 'center',
            sortable : true
        },{
            field: 'share_count',
            title: '分享数',
            width: '40px',
            align: 'center',
            sortable : true
        },{
            field: 'zan_count',
            title: '点赞数',
            width: '40px',
            align: 'center',
            sortable : true
        },{
            field: 'favorite_count',
            title: '收藏数',
            width: '40px',
            align: 'center',
            sortable : true
        },{
            field: 'show_times_count',
            title: '曝光次',
            width: '40px',
            align: 'center',
            sortable : true
        },{
            field: 'visit_times_count',
            title: '访问次',
            width: '40px',
            align: 'center',
            sortable : true
        },{
            field: 'show_people_count',
            title: '曝光人数',
            width: '40px',
            align: 'center',
            sortable : true
        },{
            field: 'visit_people_count',
            title: '访问人数',
            width: '40px',
            align: 'center',
            sortable : true
        },{
            field: 'wx_visit_times_count',
            title: '微信点击数',
            width: '40px',
            align: 'center',
            sortable : true
        },{
            field: 'wx_visit_people_count',
            title: '微信点击人数',
            width: '40px',
            align: 'center',
            sortable : true
        }]
    });

    $("#keyword").keyup(function (event) {
        if(event.keyCode == 13)
            $("#btnSearch").click();
    });

    //搜索
    $("#btnSearch").click(function(){
        var params = page.$table.bootstrapTable('getOptions');
        params = page.derive.getParams(params);

        page.$table.bootstrapTable('refresh',params);
    });

    $(window).resize(function () {
        page.$table.bootstrapTable("resetView", {height: page.derive.getAdaptTableHeight() + 10});
    })
});
});
