//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'datetimepicker', 'table'], function (bs, $, helper, swal, layer) {
	//页面所用到配置
	page.CONFIG = {
	    GET_LIST_API: helper.url.getUrlByMapping("admin/article/find_article.shtml"),                     //查询江湖事列表接口
	    SUBMIT_AUDIT_API: helper.url.getUrlByMapping("admin/article/audit_article.shtml"),                //提交审核接口
	    DELETE_API: helper.url.getUrlByMapping("admin/article/delete_article_id.shtml"),                        //删除江湖事接口
	    HANDLE_URL: helper.url.getUrlByMapping("admin/jhsHandle.shtml"),                                 //新增/审核/修改江湖事url
	    SHOW_URL: helper.url.getUrlByMapping("admin/jhsInfo.shtml"),                                     //查看/审核url
	    OBJ_TYPE: 7,             //江湖事的对象类型
	    AUDIT_STATE: 2,          //提交审核状态值
	    DELETE_STATUS: 2,       //删除的状态码
	    REPLY_STATUS: 1,        //恢复的状态码
	    NOPASS_STATE: 4,        //未通过的状态码
	    STATE_LIST: {"1": "已发布", "2": "待审核", "3": "草稿", "4": "审核未通过"},
	    TYPE_LIST: {"wait": {type: "wait", param: "status=1&state=2", title: "待审核江湖事", action: "audit"},
	        "draft": {type: "draft", param: "status=1&state=3,4", title: "江湖事草稿箱", action: ""},
	        "trash": {type: "trash", param: "status=2", title: "江湖事垃圾箱", action: ""}
	    }      //页面全部状态
	};

	page.type = helper.url.queryString("type") || page.CONFIG.TYPE_LIST.wait.type;
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
	        params.is_short = $("#is_short").val();
	        params.start_time = helper.convert.formatTimestamp($("#startTime").val());
	        params.end_time = helper.convert.formatTimestamp($("#endTime").val(), {day: 1});
	        params.start_update_time = helper.convert.formatTimestamp($("#delStartTime").val());
	        params.end_update_time = helper.convert.formatTimestamp($("#delEndTime").val(), {day: 1});
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
	    //打开新增江湖事
	    showAdd: function () {
	    	helper.win.openAddByObj({obj_type: page.CONFIG.OBJ_TYPE});
	    },

	    //打开审核
	    showAudit: function (id) {
	    	var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
	        var method = page.typeInfo.action == "audit" ? helper.win.openAuditByObj : helper.win.openInfoByObj;
	        method({obj_id: id, obj_type: page.CONFIG.OBJ_TYPE, article_title: rowDate.title});
	    },

	    //打开编辑
	    showEdit: function (id) {
	    	var action = page.typeInfo.action ? page.typeInfo.action : "edit";
	        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
	        helper.win.openEditByObj({obj_id: id, obj_type: page.CONFIG.OBJ_TYPE, article_title: rowDate.title, params: {action: action}});
	    },

	    //提交审核/删除/恢复江湖事
	    doHandler: function (id, data, api, label) {
	        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
	        swal({
	            title: "您确定要{0}选中的信息吗？".Format(label),
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

	    //提交审核江湖事
	    submitAudit: function (id) {
	        var data = {
	            "id": id,
	            "state": page.CONFIG.AUDIT_STATE
	        };
	        page.eventHandler.doHandler(id, data, page.CONFIG.SUBMIT_AUDIT_API, "提交审核");
	    },

	    //删除江湖事
	    delete: function (id) {
	        var data = {
	            "id": id,
	            "status": page.CONFIG.DELETE_STATUS
	        };
	        page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "删除");
	    },

	    //恢复江湖事
	    reply: function (id) {
	        var data = {
	            "id": id,
	            "status": page.CONFIG.REPLY_STATUS
	        };
	        page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "恢复");
	    },

	    //江湖事状态为审核拒绝时刻显示拒绝原因
	    showTip: function (el) {
	        layer.tips($(el).data("tip"), el, {tips: 3});
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
	            field: ' ',
	            title: '标题/内容',
	            align: 'left',
	            formatter: function(value, row){
	            	switch(row.is_short){
	            	    case 0: return '<a href="javascript:;" onclick="page.eventHandler.showAudit('+row.id+')">'+ row.title.substr(0,35) +'</a>';
	            	    case 1: return '<a href="javascript:;" onclick="page.eventHandler.showAudit('+row.id+')">'+ row.content.substr(0,35) +'</a>';
	                    default: return '-';
	                }
	            }
	        },{
	            field: 'is_short',
	            title: '类型',
	            width: "120px",
	            formatter: function(value){
	                switch(value){
		                case 0: return '文章（长文）';
		    		    case 1: return '图文（短文）';
	                    default: return '-';
	                }
	            },
	            align: 'center'
	        },{
	            field: 'author_name',
	            title: '创建人',
	            width: "100px",
	            align: 'center'
	        },{
	            field: 'create_time',
	            title: '创建时间',
	            width: "150px",
	            formatter: function(value){
	                return helper.convert.formatDate(value);
	            },
	            align: 'center'
	        },{
	            field: 'update_name',
	            title: page.type == page.CONFIG.TYPE_LIST.trash.type ? '删除人' : '最后修改人',
	            width: "100px",
	            align: 'center'
	        },{
	            field: 'update_time',
	            title: page.type == page.CONFIG.TYPE_LIST.trash.type ? '删除时间' : '修改时间',
	            width: "150px",
	            formatter: function(value){
	                return helper.convert.formatDate(value);
	            },
	            align: 'center'
	        },{
	            field: 'state',
	            title: '审核状态',
	            width: "100px",
	            align: 'center',
	            visible: page.type == page.CONFIG.TYPE_LIST.draft.type,
	            formatter: function (value, row) {
	                var state = page.CONFIG.STATE_LIST[value];
	                if(!state) state = "未知";

	                if(value == page.CONFIG.NOPASS_STATE)
	                    state = '<span class="text-danger" onmouseenter="page.eventHandler.showTip(this)" data-tip="审核意见：{1}">{0}</span>'.Format(state, row.audit_opinion);

	                return state;
	            }
	        },{
	            field: ' ',
	            title: '操作',
	            align: 'center',
	            width: "200px",
	            formatter:function(value, row){
	                var strHtml= '';
	                switch (page.type){
	                    case page.CONFIG.TYPE_LIST.wait.type:
	                    default:
	                        //待审核列表
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.showAudit(' + row.id + ')">审核</button>';
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.showEdit(' + row.id + ')">编辑</button>';
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete(' + row.id + ')">删除</button>';
	                        break;
	                    case page.CONFIG.TYPE_LIST.draft.type:
	                        //草稿箱列表
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.submitAudit(' + row.id + ')">提交审核</button>';
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.showEdit(' + row.id + ')">编辑</button>';
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete(' + row.id + ')">删除</button>';
	                        break;
	                    case page.CONFIG.TYPE_LIST.trash.type:
	                        //垃圾箱列表
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.reply(' + row.id + ')">恢复</button>';
	                        break;
	                }

	                return strHtml;
	            }
	        }]
	    });

	    //回车搜索事件
	    $("#keyword").keyup(function (event) {
	        if(event.keyCode == 13)
	            $("#btnSearch").click();
	    });

	    //新增江湖事操作
	    $("#btnAdd").click(page.eventHandler.showAdd);

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