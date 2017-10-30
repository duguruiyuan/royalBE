//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'table'], function (bs, $, helper, swal, layer) {
	//存储页面table对象
	page.$tool = $('#tableTools');
	page.$table = $('#tableList');

	//页面级的帮助对象集合
	page.derive = {
	    //获取表单参数用于搜索
	    getParams: function (params) {
	        params.shanghui = $('#shanghui').val();
	        return params;
	    }
	}

	//页面所用到AJAX请求的URL
	page.ajaxUrl = {
	    GET_LIST: helper.url.getUrlByMapping("admin/settled/find_shsettled.shtml"),                            //商会入驻列表接口
	    EXAMINE: helper.url.getUrlByMapping("admin/settled/update_settled.shtml"),                             //申请接口
	    GETONE: helper.url.getUrlByMapping("admin/settled/get_settled_id.shtml"),                                //查询单个商会列表接口
	    ENTER_INFO: helper.url.getUrlByMapping("admin/enterinfo.shtml")                                     //商会入驻详情页
	}

	//页面事件
	page.eventHandler = {
	    //审核
		examine: function (id) {
	        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
	        swal({
	            title: "您确定要处理该商会入驻申请吗？",
	            text: rowDate.EXAMINE,
	            type: "warning",
	            showCancelButton: true,
	            confirmButtonColor: "#DD6B55",
	            confirmButtonText: "处理",
	            cancelButtonText:'取消',
	            closeOnConfirm: false
	        }, function () {
	            swal({title: "处理中，请稍候", type: "info", showConfirmButton: false});
	            $.ajax({
	                url: page.ajaxUrl.EXAMINE,
	                type : 'POST',
	                data: {
	                	id: id,
	                	state: 1
	                },
	                dataType : 'json',
	                success : function(ret) {
	                    if(ret.code == 0){
	                        swal({title:"操作成功", text: "1s后自动消失...", type: "success", timer: 1000});
	                        page.$table.bootstrapTable('refresh');
	                    }else{
	                        swal("操作失败", ret.errMsg, "error");
	                    }
	                },
	                error:function(ret) {
	                    swal("操作失败", "error");
	                }
	            });
	        });
	    },
	    
	    //审核不通过
		examineno: function (id) {
	        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
	        var swalType = "input";
	        swal({
	            title: "您确定要拒绝该商会入驻申请吗？",
	            type: swalType,
	            showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText:'取消',
                inputPlaceholder: "请输入未通过的原因！",
                closeOnConfirm: false
	        }, function () {
	        	if(arguments[0] && typeof arguments[0] == "string")
                    var audit_opinion = arguments[0];
	        	
	            swal({title: "处理中，请稍候", type: "info", showConfirmButton: false});
	            $.ajax({
	                url: page.ajaxUrl.EXAMINE,
	                type : 'POST',
	                data: {
	                	id: id,
	                	state: 4,
	                	audit_opinion:audit_opinion
	                },
	                dataType : 'json',
	                success : function(ret) {
	                    if(ret.code == 0){
	                        swal({title:"操作成功", text: "1s后自动消失...", type: "success", timer: 1000});
	                        page.$table.bootstrapTable('refresh');
	                    }else{
	                        swal("操作失败", ret.errMsg, "error");
	                    }
	                },
	                error:function(ret) {
	                    swal("操作失败", "error");
	                }
	            });
	        });
	    },
	    
	    //查看商会入驻详情
	    Look: function(id){
	    	layer.open({
	            type: 2,
	            title: '商会入驻详情',
	            skin: 'layui-layer-rim', //加上边框
	            shadeClose: true,
	            scrollbar: false,
	            content: page.ajaxUrl.ENTER_INFO+'?id='+id,
	            area: [ '800px', '700px' ]
	        });
	    },

	    //获取提供给表格位置的自适应浏览器的高度，最小高度500
	    getAdaptTableHeight: function () {
	        var height = $(window).height() - page.$tool.offset().top - page.$tool.outerHeight() - 30;
	        return height >= 500 ? height : 500;
	    }
	}

	$.ajax({
		url: page.ajaxUrl.GET_LIST,
		type: 'post',
		dataType: 'json',
		data: {
			x: 0,
			y: 20
		},
		success: function(res){
			console.log(res);
		},
		error: function(xhr){
			xonsole.log(xhr);
		}
	});
	//表格初始化
	page.$table.bootstrapTable({
	    //请求相关
	    url: page.ajaxUrl.GET_LIST,  //AJAX读取列表数据的URL
	    method: "post",                  //请求方式
	    contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
	    dataType: "json",               //服务器返回数据类型
	    cache: false,                   //不缓存数据
	    queryParamsType: "limit",       //查询参数组织方式
	    queryParams: function (params) {
			params.x = params.offset;
			params.y = params.limit;
	        return page.derive.getParams(params);
	    },

	    //分页相关
	    pagination: true,            //是否分页
	    pageNumber:1,                //初始化加载第一页，默认第一页
	    pageSize: 20,                //每页的记录行数（*）
	    pageList: [10, 20, 50, 100],     //允许选择的每页的数量切换
	    sidePagination: "server",    //分页方式：client客户端分页，server服务端分页（*）

	    //表格总体外观相关
	    height: page.eventHandler.getAdaptTableHeight(),            //整个表格的高度
	    detailView: false,      //是否显示父子表
	    cardView: false,        //是否显示详细图
	    undefinedText: "—",     //当数据为空的填充字符
	    showColumns: true,      //是否显示筛选列按钮
	    showRefresh: true,      //是否显示刷新按钮
	    clickToSelect: true,    //是否开启点击选中行,自动选择rediobox 和 checkbox
	    toolbar:'#tableTools',  //工具按钮的容器

	    //表格内容相关设置
	    idField:"id",       //当前行主键的id值
	    uniqueId:'id',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
	    dataField: "data",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
	    columns: [{
	        field: 'user_name',
	        title: '联系人',
	        width: "120px",
	        formatter: function (value, row) {
	        	return '<a href="javascript:;" class="user-info-demo" onclick="page.eventHandler.Look(' + row.id + ')">'+ value +'</a>';
	        },
	        align: 'center'
	    },{
	        field: 'mobile',
	        title: '联系电话',
	        width: "120px",
	        align: 'center'
	    },{
	        field: 'shanghui',
	        title: '商会名称',
	        align: 'center'
	    },{
	        field: 'state',
	        title: '状态',
	        width: "100px",
	        formatter: function(value){
	      	  switch(value){
	      	      case 1: return '已处理';
	      	      case 2: return '待处理';
	      	      case 4: return '审核被拒';
	      	  }
	        },
	        align: 'center'
	    },{
	        field: 'update_time',
	        title: '处理时间',
	        width: "150px",
	        formatter: function(value){
	      	  return helper.convert.formatDate(value);
	        },
	        align: 'center'
	    },{
	        field: 'create_time',
	        title: '商会入驻申请时间',
	        width: "150px",
	        formatter: function(value){
	      	  return helper.convert.formatDate(value);
	        },
	        align: 'center'
	    },{
	        field: ' ',
	        title: '操作',
	        width: "200px",
	        formatter: function(value, row){
	      	  if(row.state == 1){
	      		  return '—';
	      	  }else if(row.state == 2){
	      		var strHtml = '<a class="btn btn-sm btn-info" onclick="page.eventHandler.examine(' + row.id + ')">审核通过</a>';
	      			strHtml += ' <a class="btn btn-sm btn-danger" onclick="page.eventHandler.examineno(' + row.id + ')">审核不通过</a>';
	      		  return strHtml;
	      	  }
	        },
	        align: 'center'
	    }]
	});

	$("#shanghui").keyup(function (event) {
	    if(event.keyCode == 13) $("#btnSearch").click();
	});

	//搜索
	$("#btnSearch").click(function(){
	    var params = page.$table.bootstrapTable('getOptions');
	    params = page.derive.getParams(params);
	    page.$table.bootstrapTable('refresh',params);
	});

	$(window).resize(function () {
	    page.$table.bootstrapTable("resetView", {height: page.eventHandler.getAdaptTableHeight() + 10});
	});
});