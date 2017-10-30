//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'datetimepicker', 'table'], function (bs, $, helper, swal, layer) {
//页面所用到配置
page.CONFIG = {
    GET_LIST_API: helper.url.getUrlByMapping("admin/circle/find_circle_list.shtml?status=2"),    			//查询已发布圈子列表接口
    DELETE_API: helper.url.getUrlByMapping("admin/circle/audit_circle.shtml"),                     //删除圈子接口
    Follower_URL: helper.url.getUrlByMapping("admin/circleFollowers.shtml"),								//关注的人
    SHOW_URL: helper.url.getUrlByMapping("admin/circleAudit.shtml?action=trash"),                      	    //查看url
    OBJ_TYPE: 11,            //圈子的类型id
    REPLY_STATUS: 1         //恢复的状态码
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
        params.update_start_time = helper.convert.formatTimestamp($("#startTime").val());
        params.update_end_time = helper.convert.formatTimestamp($("#endTime").val(), {day: 1});
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
	showAudit:function(id){
		var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
		var title = rowDate.title+ "-查看";
        helper.win.open({name: title, url: page.CONFIG.SHOW_URL + "&id=" + id});
	},
    recovery: function (id) {    //删除圈子文章
        var row = page.$table.bootstrapTable('getRowByUniqueId', id);
        swal({
            title: "您确定要恢复选中的信息吗？",
            text: row.title,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#18a689",
            confirmButtonText: "恢复",
            cancelButtonText:'取消',
            closeOnConfirm: false
        }, function () {
            swal({title: "恢复中，请稍候", type: "info", showConfirmButton: false});
            $.ajax({
                url: page.CONFIG.DELETE_API,
                type: 'POST',
                data: {
                	id: row.id,
                	obj_type: page.CONFIG.OBJ_TYPE,
                    status: page.CONFIG.REPLY_STATUS
                },
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                        swal({title:"恢复成功", text: "1s后自动消失...", type: "success", timer: 1000});
                        page.$table.bootstrapTable('removeByUniqueId', row.id);    
                    }else{
                        swal("恢复失败", ret.errMsg, "error");
                    }
                },
                error:function(ret) {
                    swal("恢复失败", "error");
                }
            });
        });   
    },
    //关注的人
    showFollower: function (id) {
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        var title = rowDate.title+ "-关注的人";
        helper.win.open({name: title, url: page.CONFIG.Follower_URL + "?circle_id=" + id});
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
            field: 'circle_zhu_name',
            title: '圈主',
            width: "100px",
            align: 'center'
        },{
            field: 'circle_member',
            title: '成员',
            width: "150px",
            align: 'center'
        },{
            field: 'master_name',
            title: '创建人',
            width: "100px",
            align: 'center'
        },{
            field: 'create_time',
            title: '创建时间',
            width: "150px",
            formatter: function(value, row, index){
                return helper.convert.formatDate(value);
            },
            align: 'center'
        },{
            field: 'update_user_name',
            title: '删除人',
            width: "100px",
            align: 'center'
        },{
            field: 'update_time',
            title: '删除时间',
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
                var strHtml= '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.showFollower(' + row.id + ')">关注的人</button>';
                    strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.recovery(' + row.id + ')">恢复</button>';
                    return strHtml;

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


    
