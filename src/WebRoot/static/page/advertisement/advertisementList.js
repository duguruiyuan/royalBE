//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'datetimepicker', 'fancybox', 'table'], function (bs, $, helper, swal, layer) {
	//页面所用到配置
	page.CONFIG = {
	    GET_LIST_API: helper.url.getUrlByMapping("admin/peacockManager/find_peacockadvertisementlists.shtml"),                     //查询开机广告列表接口
	    DELETE_API: helper.url.getUrlByMapping("admin/peacockManager/stopordel_peacockadvertisementinfo.shtml"),                        //删除开机广告接口
	    DELETE_STATUS: 2,       //删除的状态码
	    REPLY_STATUS: 1,        //恢复的状态码
	    EDIT_HTML: helper.url.getUrlByMapping("admin/advertisementhandle.shtml"),                        //修改/删除/中止开机广告接口
	    TYPE_LIST: {"complete": {type: "complete", param: "status=1", title: "开机广告列表", action: ""},
	        "trash": {type: "trash", param: "status=2", title: "开机广告垃圾箱", action: ""}
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
	        params.peacock_start_time = helper.convert.formatTimestamp($("#startTime").val());
	        params.peacock_end_time = helper.convert.formatTimestamp($("#endTime").val(), {day: 1});
	        params.peacock_title = $("#keyword").val();
	        params.x = params.offset;   //服务端分页，过滤掉前xxx条记录
	        params.y = params.limit;    //服务端分页，每页记录数

	        return params;
	    },

	    //获取提供给表格位置的自适应浏览器的高度，最小高度500
	    getAdaptTableHeight: function () {
	        var height = $(window).height() - page.$tool.offset().top - page.$tool.outerHeight() - 30;
	        return height >= 500 ? height : 500;
	    },
	    
	    openInfo: function (el) {
			var options = {obj_id: el.data('id'), obj_type: el.data('type'),article_title: el.data('title'), url: el.data('url')};
			console.log(options);
			helper.win.openInfoByObj(options);
		}
	};

	//页面事件
	page.eventHandler = {
	    //打开查看
	    showAudit: function (id) {
	        
	    },

	    //打开编辑
	    showEdit: function (id) {
	    	helper.win.open({name: '修改开机广告', url: page.CONFIG.EDIT_HTML + '?action=edit&id=' + id});
	    },

	    //删除/恢复开机广告
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

	    //删除开机广告
	    delete: function (id) {
	        var data = {
	            "peacock_id": id,
	            "status": page.CONFIG.DELETE_STATUS
	        };
	        page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "删除");
	    },

	    //恢复开机广告
	    reply: function (id) {
	        var data = {
	            "peacock_id": id,
	            "status": page.CONFIG.REPLY_STATUS
	        };
	        page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "恢复");
	    },
	    
	    //中止投放
	    stop: function (id) {
	    	var data = {
	            "peacock_id": id
	        };
	        page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "中止");
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
	        idField:"peacock_id",       //当前行主键的id值
	        uniqueId:'peacock_id',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
	        dataField: "data",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
	        columns: [{
	            field: 'peacock_title',
	            title: '标题',
	            align: 'left'
	        },{
	            field: 'peacock_image',
	            title: '图片',
	            align: 'center',
	            width: "100px",
	            formatter: function (value, row) {
	                return '<a class="fancybox" rel="group" href="'+ value +'"><img alt="" style="width: 80px;" src="'+ value +'" /></a>';
	            	//return '<a class="fancybox" rel="group" href="'+ value +'" title=""><img alt="点击查看大图" style="max-height:120px" src="'+ value +'" /></a>'
	            }
	        },{
	            field: ' ',
	            title: '链接',
	            align: 'center',
	            formatter: function (value, row) {
	            	var htmlStr = '';
	            	if (!!row.obj_type) {
	            		if (row.obj_type == 20) {
	            			htmlStr = '【外部链接】<a class="jump-link" title="'+ row.peacock_url +'" data-id="0" data-type="20" data-title="" data-url="'+ row.peacock_url +'">' + row.peacock_url.substr(0, 50) + '</a>';
	        	    	} else {
	        	    		htmlStr = '【'+ helper.obj.getObjLabel(row.obj_type) +'】<a class="jump-link" title="'+ row.article_title +'" data-id="'+ row.obj_id +'" data-type="'+ row.obj_type +'" data-url="" data-title="'+ row.article_title +'">' + row.article_title.substr(0, 50) + '</a>';
	        	    	}
	            	} else {
	            		htmlStr = '—';
	            	}
	            	return htmlStr;
	            }
	        },{
	            field: 'peacock_start_time',
	            title: '开始时间',
	            width: "85px",
	            formatter: function(value){
	            	return helper.convert.formatDate(value);
	            },
	            align: 'center'
	        },{
	            field: 'peacock_end_time',
	            title: '结束时间',
	            width: "85px",
	            formatter: function(value){
	            	return helper.convert.formatDate(value);
	            },
	            align: 'center'
	        },{
	            field: 'author_name',
	            title: '创建人',
	            width: "80px",
	            align: 'center'
	        },{
	            field: 'create_time',
	            title: '创建时间',
	            width: "85px",
	            formatter: function(value){
	                return helper.convert.formatDate(value);
	            },
	            align: 'center'
	        },{
	            field: 'update_user_name',
	            title: '修改人',
	            width: "80px",
	            align: 'center'
	        },{
	            field: 'update_time',
	            title: '修改时间',
	            width: "85px",
	            formatter: function(value){
	                return helper.convert.formatDate(value);
	            },
	            align: 'center'
	        },{
	            field: 'peacock_order',
	            title: '排序',
	            width: "40px",
	            align: 'center'
	        },{
	            field: 'show_times_count',
	            title: '展示数',
	            width: "40px",
	            visible: page.type == 'complete' ? true : false,
	            align: 'center'
	        },{
	            field: 'show_people_count',
	            title: '展示人数',
	            width: "40px",
	            visible: page.type == 'complete' ? true : false,
	            align: 'center'
	        },{
	            field: 'visit_times_count',
	            title: '点击数',
	            width: "40px",
	            visible: page.type == 'complete' ? true : false,
	            align: 'center'
	        },{
	            field: 'visit_people_count',
	            title: '点击人数',
	            width: "40px",
	            visible: page.type == 'complete' ? true : false,
	            align: 'center'
	        },{
	            field: ' ',
	            title: '操作',
	            align: 'center',
	            width: "200px",
	            formatter:function(value, row){
	                var strHtml= '';
	                switch (page.type){
	                    case page.CONFIG.TYPE_LIST.complete.type:
	                    default:
	                        //待审核列表
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.stop(' + row.peacock_id + ')">中止投放</button>';
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.showEdit(' + row.peacock_id + ')">修改</button>';
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete(' + row.peacock_id + ')">删除</button>';
	                        break;
	                    case page.CONFIG.TYPE_LIST.trash.type:
	                        //垃圾箱列表
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.reply(' + row.peacock_id + ')">恢复</button>';
	                        break;
	                }

	                return strHtml;
	            }
	        }]
	    });
	    
	    page.$table.find(".fancybox").fancybox();
	    
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
	    
	    //跳转链接
	    page.$table.on('click', '.jump-link', function () {
	    	page.derive.openInfo($(this));
	    });
	});
});