//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'datetimepicker', 'table'], function (bs, $, helper, swal, layer) {
//页面所用到配置
page.CONFIG = {
    GET_LIST_API: helper.url.getUrlByMapping("admin/circle/find_circle_list.shtml?state=2,4&status=1"),    	//查询已发布圈子列表接口
    AUDIT_API: helper.url.getUrlByMapping("admin/circle/audit_circle.shtml"),                     //删除圈子接口
    SHOW_URL: helper.url.getUrlByMapping("admin/circleAudit.shtml?action=audit"),                      	//查看url
    OBJ_TYPE: 11,            //圈子的类型id
    AUDIT_STATE: 1         //审核的状态码
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

//页面级的帮助对象集合
page.derive = {
    //获取表单参数用于搜索
    getParams: function (params) {
        params.islength = $("#textType").val();
        params.create_start_time = helper.convert.formatTimestamp($("#startTime").val());
        params.create_end_time = helper.convert.formatTimestamp($("#endTime").val(), {day: 1});
        params.title = $("#keyword").val();
        params.x = params.offset;   //服务端分页，过滤掉前xxx条记录
        params.y = params.limit;    //服务端分页，每页记录数

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
    //审核
	showAudit: function (id) {
		var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
		var title = rowDate.title+ "-审核";
        helper.win.open({name: title, url: page.CONFIG.SHOW_URL + "&id=" + id});
    }
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
        url: page.CONFIG.GET_LIST_API,  //AJAX读取列表数据的URL
        method: "get",                  //请求方式
        contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
        dataType: "json",               //服务器返回数据类型
        cache: false,                   //不缓存数据
        queryParamsType: "limit",       //查询参数组织方式
        queryParams: function (params) {
            return page.derive.getParams(params);
        },

        //分页相关
        pagination: true,            //是否分页
        pageNumber:1,                //初始化加载第一页，默认第一页
        pageSize: 20,                //每页的记录行数（*）
        pageList: [10, 20, 50, 100],     //允许选择的每页的数量切换
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
        idField:"id",       //当前行主键的id值
        uniqueId:'id',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
        dataField: "data",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
        columns: [{
            field: 'title',
            title: '名称',
            align: 'left',
            formatter: function (value, row) {
                return '<a href="javascript:;" onclick="page.eventHandler.showAudit(' + row.id + ')">' + value + '</a>';
            }
        },{
            field: 'master_name',
            title: '申请人',
            width: "100px",
            align: 'center'
        },{
            field: 'create_time',
            title: '申请时间',
            align: 'center',
            width: "150px",
            formatter: function(value){
                return helper.convert.formatDate(value);
            }
        },{
            field: 'audit_user_name',
            title: '审核人',
            width: "100px",
            align: 'center'
        },{
            field: 'state',
            title: '审核结果',
            width: "100px",
            align: 'center',
            formatter: function(value, row, index){
                switch(value){
                    case 1: return '<span class="label label-primary">通过</span>';break;
                    case 2: return '<span class="label label-warning">待审核</span>';break;
                    case 4: return '<span class="label label-danger">不通过</span>';break;
                    default: return "";
                }
            }
        },{
            field: 'audit_opinion',
            title: '审核意见',
            width: "100px",
            align: 'center'
        },{
            field: 'audit_time',
            title: '审核时间',
            width: "150px",
            formatter: function(value, row, index){
                return helper.convert.formatDate(value);
            },
            align: 'center'
        },{
            field: ' ',
            title: '操作',
            align: 'center',
            width: "200px",
            formatter:function(value, row){
	            switch(row.state){
	                case 1: return '';break;
	                case 2: return '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.showAudit(' + row.id + ')">审核</button>';break;
	                case 4: return '&nbsp;<button type="button" class="btn btn-sm btn-primary" onclick="page.eventHandler.showAudit(' + row.id + ')">重新审核</button>';break;
	                default: return '';
	            }
            }
        }]
    });
    
    //回车搜索事件
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
})
});


    
