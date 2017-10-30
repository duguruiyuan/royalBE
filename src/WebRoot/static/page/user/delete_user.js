//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastrPlus', 'datetimepicker', 'table'], function (bs, $, helper, swal, layer, toastr) {
	//页面级的帮助对象集合
	page.derive = {
	    //获取表单参数用于搜索
	    getParams: function (params) {
	        params.realname = $("#realname").val();
	        params.mobile = $("#mobile").val();
	        params.x = params.offset;
	        params.y = params.limit;
	        return params;
	    },
        toastr: function (text) {
        	toastr.success(text);
        }
	};
    
	/**
	 * 提供给引用页面刷新用，如果未声明该方法，则引用页面调用将使用浏览器重载重新刷新本页面
	 */
	page.refresh = function () {
	    $("#btnSearch").click();
	};
	
	//页面所用到AJAX请求的URL
	page.ajaxUrl = {
	    GET_LIST: helper.url.getUrlByMapping("admin/userManager/find_dustbinuserinfolists.shtml"),                   //查询所有评论接口
	    UPDATE: helper.url.getUrlByMapping("admin/userManager/del_dustbinuserinfo.shtml")                       //查询评论列表
	};

	//存储页面table对象
	page.$tool = $('#tableTools');
	page.$table = $('#tableList');

	//页面事件
	page.eventHandler = {
	    //恢复
		recoveryUser: function (id) {
	        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
	        swal({
	            title: "您确定要恢复选中的用户吗？",
	            text: rowDate.title,
	            type: "warning",
	            showCancelButton: true,
	            confirmButtonColor: "#DD6B55",
	            confirmButtonText: "恢复",
	            cancelButtonText:'取消',
	            closeOnConfirm: false
	        }, function () {
	            swal({title: "恢复中，请稍候", type: "info", showConfirmButton: false});
	            $.ajax({
	                url: page.ajaxUrl.UPDATE,
	                type : 'POST',
	                data: {
	                	usid: id
	                },
	                dataType : 'json',
	                success : function(ret) {
	                    if(ret.code == 0){
	                        swal({title:"恢复成功", text: "1s后自动消失...", type: "success", timer: 1000});
	                        page.$table.bootstrapTable('remove', {
	                            field: "id",
	                            values: id
	                        });
	                        page.$table.bootstrapTable('removeByUniqueId', id);
	                        page.$table.bootstrapTable('refresh');
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
	    
	    //查看或编辑用户
	    updateUser: function(id){
	    	layer.open({
	            type: 2,
	            title: '查看或编辑用户信息',
	            skin: 'layui-layer-rim', //加上边框
	            scrollbar: false,
	            shadeClose: true,
	            content: helper.CONST.BASE_PATH+'admin/edituser.shtml?id='+id,
	            area: [ '95%', '95%' ]
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
	    idField:"usid",       //当前行主键的id值
	    uniqueId:'usid',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
	    dataField: "rows",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
	    columns: [{
	        field: 'realname',
	        title: '姓名',
	        width: "120px",
	        formatter: function (value, row) {
	        	return '<a href="javascript:;" class="user-info-demo" onclick="page.eventHandler.updateUser(' + row.usid + ')">'+ value +'</a>';
	        },
	        align: 'center'
	    },{
	    	field: 'mobile',
	    	title: '手机号',
	    	width: "100px",
	    	align: 'center'
	    },{
	    	field: 'company',
	    	title: '单位',
	    	width: "100px",
	    	align: 'center'
	    },{
	    	field: 'companywork',
	    	title: '职务',
	    	width: "100px",
	    	align: 'center'
	    },{
	    	field: 'createdate',
	    	title: '注册时间',
	    	width: "120px",
	    	formatter: function(value){
	    		return helper.Convert.formatDate(value.time);
	    	},
	    	align: 'center'
	    },{
	    	field: 'weight',
	    	title: '用户权重',
	    	width: "100px",
	    	align: 'center'
	    },{
	        field: 'logintype',
	        title: '注册方式',
	        width: "80px",
	        formatter: function(value){
	        	switch(value){
		        	case 0: return '后台新增';
		    	    case 1: return '在线注册';
		    	    case 2: return '商会导入';
	        	}
	        },
	        align: 'center'
	    },{
	        field: 'isAuth',
	        title: '是否认证',
	        width: "60px",
	        formatter: function(value){
	        	var type = parseInt(value);
	        	switch(type){
	        	    case 1: return '是';
	        	    default: return '否';
	        	}
	        },
	        align: 'center'
	    },{
	        field: 'auth_type',
	        title: '认证方式',
	        width: "80px",
	        align: 'center'
	    },{
	        field: 'delete_reason',
	        title: '删除原因',
	        align: 'center'
	    },{
	    	field: 'usid',
	    	title: '操作',
	    	width: "100px",
	    	formatter: function(value, row){
	    		return '<a class="btn btn-sm btn-info" onclick="page.eventHandler.recoveryUser(' + row.usid + ')">恢复</a>';
	    	},
	    	align: 'center'
	    }]
	});

	$("#realname").keyup(function (event) {
	    if(event.keyCode == 13) $("#btnSearch").click();
	});

	$("#mobile").keyup(function (event) {
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