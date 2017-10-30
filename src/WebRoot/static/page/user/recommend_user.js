//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastrPlus', 'datetimepicker', 'table'], function (bs, $, helper, swal, layer, toastr) {
	//存储页面table对象
	page.$tool = $('#tableTools');
	page.$table = $('#tableList');

	//页面级的帮助对象集合
	page.derive = {
	    //获取表单参数用于搜索
	    getParams: function (params) {
	        params.mobile = $('#mobile').val();
	        return params;
	    },
        toastr: function (text) {
        	toastr.success(text);
        }
	};

	//页面所用到AJAX请求的URL page.ajaxUrl.ADD_REM
	page.ajaxUrl = {
	    GET_LIST: helper.url.getUrlByMapping("admin/userManager/find_bigshotuserinfolists.shtml"),             //大咖列表接口
	    DELETE: helper.url.getUrlByMapping("admin/userManager/del_bigshotuserinfo.shtml"),                      //删除大咖接口
	    ADD_REM: helper.url.getUrlByMapping("admin/addrecommenduser.shtml"),                      //新增大咖接口
	};

	/**
	 * 提供给引用页面刷新用，如果未声明该方法，则引用页面调用将使用浏览器重载重新刷新本页面
	 */
	page.refresh = function () {
	    $("#btnSearch").click();
	};

	//页面事件
	page.eventHandler = {
	    //删除评论
	    delete: function (id) {
	        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
	        swal({
	            title: "您确定要删除选中的大咖吗？",
	            text: rowDate.realname,
	            type: "warning",
	            showCancelButton: true,
	            confirmButtonColor: "#DD6B55",
	            confirmButtonText: "删除",
	            cancelButtonText:'取消',
	            closeOnConfirm: false
	        }, function () {
	            swal({title: "删除中，请稍候", type: "info", showConfirmButton: false});
	            $.ajax({
	                url: page.ajaxUrl.DELETE,
	                type : 'POST',
	                data: {
	                	usid: id
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
	    
	    //新增大咖
	    addrecommend: function(){
	    	layer.open({
	            type: 2,
	            title: '新增大咖',
	            skin: 'layui-layer-rim', //加上边框
	            shadeClose: true,
	            scrollbar: false,
	            content: page.ajaxUrl.ADD_REM,
	            area: [ '90%', '90%' ]
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
	    idField:"usid",       //当前行主键的id值
	    uniqueId:'usid',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
	    dataField: "rows",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
	    columns: [{
	        field: 'realname',
	        title: '姓名',
	        width: "100px",
	        formatter: function (value, row) {
	        	return '<a href="javascript:;" class="user-info-demo" onclick="page.eventHandler.updateUser(' + row.usid + ')">'+ value +'</a>';
	        },
	        align: 'center'
	    },{
	        field: 'mobile',
	        title: '手机号',
	        width: "120px",
	        align: 'center'
	    },{
	        field: 'company',
	        title: '单位',
	        align: 'center'
	    },{
	        field: 'companywork',
	        title: '职务',
	        formatter: function(value){
	        	if(!value) return '—';
	        	return value;
	        },
	        align: 'center'
	    },/*{
	        field: 'lastlogintime',
	        title: '最后登录时间',
	        width: "150px",
	        formatter: function(value){
	        	return helper.Convert.formatDate(value);
	        },
	        align: 'center'
	    },*/{
	        field: 'weight',
	        title: '用户权重',
	        width: "100px",
	        align: 'center'
	    },{
	        field: 'reorder',
	        title: '排序',
	        width: "60px",
	        align: 'center'
	    },{
	        field: ' ',
	        title: '操作',
	        width: "150px",
	        formatter:function(value, row){
	            return '<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.delete(' + row.usid + ')">删除</button>';
	        },
	        align: 'center'
	    }]
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