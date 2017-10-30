//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'datetimepicker', 'table'], function (bs, $, helper, swal, layer) {
//页面所用到配置
page.CONFIG = {
    GET_LIST_API: helper.url.getUrlByMapping("admin/business/find_business_unit.shtml?status=2"),    		//查询已发布招商单位列表接口
    DELETE_API: helper.url.getUrlByMapping("admin/business/update_business_unit_id.shtml"),                 //删除招商单位接口
    PROJECT_URL: helper.url.getUrlByMapping("admin/businessunitproject.shtml?status=1&state=1"),            //查看项目
    USER_URL: helper.url.getUrlByMapping("admin/businessunituser.shtml"),                                	//查看关注的用户
    ADD_URL: helper.url.getUrlByMapping("admin/businessunitadd.shtml"),                                		//新增招商单位
    EDIT_URL: helper.url.getUrlByMapping("admin/businessunitedit.shtml"),                                	//编辑页面
    SHOW_URL: helper.url.getUrlByMapping("admin/businessunitinfo.shtml"),                                	//查看页面
    DELETE_STATUS: 1       //删除的状态码
};

//存储页面table对象
page.$tool = $('#tableTools');
page.$table = $('#tableList');
page.feedPush = new Object();

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
        params.start_time = helper.convert.formatTimestamp($("#startTime").val());
        params.end_time = helper.convert.formatTimestamp($("#endTime").val(), {day: 1});
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
    //查看项目
    showProject: function (id) {
        helper.win.open({name: "招商单位项目",url: page.CONFIG.PROJECT_URL+"&unitid="+id});
    },

    //查看关注的用户
    showUser: function (id) {
        helper.win.open({name: "关注的用户",url: page.CONFIG.USER_URL+"?action=trash&unitid="+id});
    },
    //查看单位详情
    show: function (id) {
        helper.win.open({name: "查看单位信息",url: page.CONFIG.SHOW_URL+"?action=trash&id="+id});
    },

    //打开编辑
    showEdit: function (id) {
        helper.win.open({name: "编辑单位信息",url: page.CONFIG.EDIT_URL+"?unitid="+id});
    },

    //删除/取消发布招商单位
    doHandler: function (id, data, api, label) {
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        swal({
            title: "您确定要{0}选中的招商单位吗？".Format(label),
            text: rowDate.title,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: label,
            cancelButtonText:'取消',
            closeOnConfirm: false
        }, function () {
            swal({title: label + "中，请稍候", type: "info", showConfirmButton: false});
            $.ajax({
                url: api,
                type : 'POST',
                data: data,
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                        swal({title: label+ "成功", text: "1s后自动消失...", type: "success", timer: 1000});
                        page.$table.bootstrapTable('remove', {
                            field: "id",
                            values: id
                        });
                        page.$table.bootstrapTable('removeByUniqueId', id);
                        page.$table.bootstrapTable('refresh');
                    }else{
                        swal(label + "失败", ret.errMsg, "error");
                    }
                },
                error:function(ret) {
                    swal(label + "失败", "请稍候再重试或联系管理员", "error");
                }
            });
        });
    },

    //取消发布招商单位
    backout: function (id) {
        var data = {
            "id": id,
            "state": page.CONFIG.WAIT_AUDIT_STATE
        };
        page.eventHandler.doHandler(id, data, page.CONFIG.SUBMIT_AUDIT_API, "撤回发布");
    },

    //删除招商单位
    delete: function (id) {
        var data = {
            "id": id,
            "status": page.CONFIG.DELETE_STATUS
        };
        page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "恢复");
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
        minimumCountColumns: 2,

        columns: [{
            field: 'title',
            title: '标题/内容',
            align: 'left',
            formatter: function (value, row) {
                return '<a href="javascript:;" onclick="page.eventHandler.show(' + row.id + ')">' + value + '</a>';
            }
        },{
            field: 'username',
            title: '登录账户',
            width: "100px",
            align: 'center'
        },{
            field: 'create_time',
            title: '创建时间',
            width: "150px",
            align: 'center',
            formatter:function(value, row){ 
            	return helper.convert.formatDate(value); 
            },
        },{
            field: ' ',
            title: '操作',
            align: 'center',
            width: "350px",
            formatter:function(value, row){
                var strHtml= '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.showProject(' + row.id + ')">查看项目</button>';
                strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.showUser(' + row.id + ')">查看关注的用户</button>';
                strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete(' + row.id + ')">恢复</button>';
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
});
});
