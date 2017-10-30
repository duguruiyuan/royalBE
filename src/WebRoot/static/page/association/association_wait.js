//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'datetimepicker', 'table'], function (bs, $, helper, swal, layer) {
//页面所用到AJAX请求的URL
page.CONFIG = {
    GET_LIST: helper.url.getUrlByMapping("admin/association/find_article_association.shtml?status=1&state=2"),      //查询待审核内容接口
    DELETE: helper.url.getUrlByMapping("admin/association/delete_article_association.shtml"),                        //删除内容接口
    AUDIT: helper.url.getUrlByMapping("admin/association/audit_article_association.shtml"),                   //审核
    DETAIL: helper.url.getUrlByMapping("admin/association/get_article_association.shtml")                   //查询详情
 //   VIEW:helper.url.getUrlByMapping("admin/gslview.shtml")									//详情页面
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
        params.start_time = helper.convert.formatTimestamp($("#startTime").val());
        params.end_time = helper.convert.formatTimestamp($("#endTime").val(), {day: 1});
        params.title = $("#keyword").val();
        params.obj_type = $("#obj_type").val();
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
    //打开审核
    showAudit: function (id) {
        helper.win.open({name: "审核工商联要闻",url: page.CONFIG.AUDIT + "&id=" + id});
    },
    //审核
    auditData: function(id){
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
    	helper.win.openAuditByObj({obj_id: rowDate.obj_id, obj_type: rowDate.obj_type, article_title: rowDate.title});
    	return;	
    },
    //打开编辑
    showEdit: function (id) {
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
    	helper.win.openEditByObj({obj_id: rowDate.obj_id, obj_type: rowDate.obj_type, article_title: rowDate.title, params: {action: "audit"}});
    	return;
    },

    //删除工商联要闻
    delete: function (id,obj_id,obj_type) {
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        swal({
            title: "您确定要删除选中的信息吗？",
            text: rowDate.title,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "删除",
            cancelButtonText:'取消',
            closeOnConfirm: false
        }, function () {
            swal({title: "删除中，请稍候", type: "info", showConfirmButton: false});
            $.ajax({
                url: page.CONFIG.DELETE,
                type : 'POST',
                data: {
                    id: id,
        			obj_id: obj_id,
        			obj_type: obj_type,
                    status: 2
                },
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                        swal({title:"删除成功", text: "1s后自动消失...", type: "success", timer: 1000});
                        page.$table.bootstrapTable('remove', {
                            field: "id",
                            values: id
                        });
                        page.$table.bootstrapTable('removeByUniqueId', id);
                        page.$table.bootstrapTable('refresh');
                    }else{
                        swal("删除失败", ret.errMsg, "error");
                    }
                },
                error:function(ret) {
                    swal("删除失败", "error");
                }
            });
        });
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
        url: page.CONFIG.GET_LIST,  //AJAX读取列表数据的URL
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
        idField:"id",       //当前行主键的id值
        uniqueId:'id',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
        dataField: "data",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
        columns: [{
            field: 'title',
            title: '标题',
            align: 'left',
            formatter: gslDetail,
            events: 'detailsEvents'
        },{
        	field: 'obj_type',
        	title: '类型',
            width: "150px",
        	formatter: function(value){
        		switch(value){
        		    case 1: return '早茶';
        		    case 2: return '秘闻';
        		    case 4: return '活动';
        		    case 5: return '话题';
        		    case 18: return '圈子帮助';
        		    case 19: return '帖子';
        		    case 8: return '榜样';
        		    case 6: return '专题';
        		    case 9: return '工商联新闻';
        		    case 10: return '商机(招商项目)';
        		    case 12: return '用户动态';
        		    case 13: return '商会资讯';
        		    case 14: return '商会通知';
        		    case 7: return '江湖事';
        		    default: return '-';
        		}
        	},
        	align: 'center'
        },{
        	field: 'create_name',
        	title: '提交人',
            width: "100px",
        	align: 'center'
        },{
        	field: 'create_time',
        	title: '提交时间',
            width: "150px",
        	formatter: function(value){
        		return helper.convert.formatDate(value);
        	},
        	align: 'center'
        },{
            field: ' ',
            title: '操作',
            align: 'center',
            width: "200px",
            formatter:function(value, row){
            	var surl = helper.url.getUrlByMapping("admin/gslreview.shtml?pid="+row.id);
                var strHtml=' <button type="button" class="btn btn-sm btn-primary" onclick="page.eventHandler.auditData('+row.id+')">审核</button>';
                strHtml+=' <button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.showEdit(' + row.id + ')">编辑</button>';
                strHtml+=' <button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete('+row.id+',' + row.obj_id + ','+row.obj_type+')">删除</button>';
                return strHtml;
            }
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
window.detailsEvents = {
        'click .gslDetail': function (e, value, row, index) {
        	helper.win.openAuditByObj({obj_id: row.obj_id, obj_type: row.obj_type, article_title: row.title});
        	return;
        },
    };
function gslDetail(value, row) {
	var size = value.length;
	if(size>60)
		value = value.substring(0,60);
    return '<a href="#" class="gslDetail">' + value + '</a>';
}
});