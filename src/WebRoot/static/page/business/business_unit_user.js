//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'datetimepicker', 'table'], function (bs, $, helper, swal, layer) {
page.unitid = helper.url.queryString("unitid");
//页面所用到配置
page.CONFIG = {
    GET_LIST_API: helper.url.getUrlByMapping("admin/circle/circle_follow.shtml"),                  		//查询关注招商单位得人列表接口
    USER_INFO: helper.url.getUrlByMapping("admin/userinfo.shtml"),                   					//查看用户信息
    SUBMIT_AUDIT_API: helper.url.getUrlByMapping("admin/business/update_business_id.shtml"),    		//提交审核接口
    DELETE_API: helper.url.getUrlByMapping("admin/business/delete_business_id.shtml"),                  //删除招商单位项目接口
    HANDLE_URL: helper.url.getUrlByMapping("admin/businessunitprojectadd.shtml"),                       //新增/审核/修改招商单位项目url
    SHOW_URL: helper.url.getUrlByMapping("admin/shangjireinfo.shtml"),                                  //查看/审核url
    AUDIT_STATE: 2,          //提交审核状态值
    DELETE_STATUS: 2,       //删除的状态码
    REPLY_STATUS: 1,        //恢复的状态码
    NOPASS_STATE: 4,        //未通过的状态码
    STATE_LIST: {"1": "已发布", "2": "待审核", "3": "草稿", "4": "审核未通过"},
    TYPE_LIST: {"wait": {type: "wait", param: "status=1&state=2", title: "待审核招商单位项目", action: "audit"},
        "draft": {type: "draft", param: "status=1&state=3,4", title: "招商单位项目草稿箱", action: ""},
        "trash": {type: "trash", param: "status=2", title: "招商单位项目垃圾箱", action: ""},
        "all": {type: "all", param: "obj_type=17&obj_id="+page.unitid, title: "关注招商单位的人", action: ""}
    }      //页面全部状态
};
page.type = helper.url.queryString("type") || page.CONFIG.TYPE_LIST.all.type;
page.typeInfo = page.CONFIG.TYPE_LIST[page.type];

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
        params.user_name = $("#keyword").val();
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
	//查看用户信息
	showUser: function (id) {
		layer.open({
		    type: 2,
		    title: '查看用户信息',
		    skin: 'layui-layer-rim',
		    shadeClose: true,
		    scrollbar: false,
		    content: page.CONFIG.USER_INFO + '?id=' + id,
		    area: ['80%', '80%']
		});
	}
};


$(document).ready(function () {
    //初始化页面状态
    if(!page.CONFIG.TYPE_LIST[page.type]){
        page.typeInfo = page.CONFIG.TYPE_LIST.wait;
        page.type = page.typeInfo.type;
    }
    document.title = page.typeInfo.title;
    $("#pageSubTitle").html(page.typeInfo.title);

    //按照不同模块切换显示/隐藏
    $("[data-type]").each(function () {
        $(this).data("type") == page.type ? $(this).show() : $(this).hide();
    });

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
        url: "{0}?{1}".Format(page.CONFIG.GET_LIST_API, page.typeInfo.param),  //AJAX读取列表数据的URL
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
            field: 'user_name',
            title: '姓名',
            align: 'left',
            formatter: function (value, row) {
                return '<a href="javascript:;" onclick="page.eventHandler.showUser(' + row.user_id + ')">' + value + '</a>';
            }
        },{
            field: 'company',
            title: '单位',
            width: "250px",
            align: 'center'
        },{
            field: 'companywork',
            title: '职务',
            width: "150px",
            align: 'center'
        },{
            field: 'create_time',
            title: '关注时间',
            width: "200px",
            formatter: function(value){
                return helper.convert.formatDate(value);
            },
            align: 'center'
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
});
});

