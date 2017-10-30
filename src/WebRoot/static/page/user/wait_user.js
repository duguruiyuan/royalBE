//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastrPlus', 'datetimepicker', 'table'], function (bs, $, helper, swal, layer, toastr) {
	//存储页面table对象
	page.$tool = $('#tableTools');
	page.$table = $('#tableList');
	//是否认证下拉
	//page.$status = $("#status");
	//认证方式下拉
	page.$userv = $("#userv");

	//页面级的帮助对象集合
	page.derive = {
	    //获取表单参数用于搜索
	    getParams: function (params) {
	        //params.status = page.$status.val();
	    	params.auth_type = page.$userv.val();
	        params.realname = $('#realname').val();
	        params.mobile = $('#mobile').val();
	        params.x = params.offset;
	        params.y = params.limit;
	        return params;
	    },
	    //插入节点
	    setOptions: function (dom,data,keyName){
	    	var key = keyName || 'name';
	    	var arr = [];
	    	for(var i = 0; i < data.length; i++){
	    		arr.push('<option value="'+data[i].id+'">'+data[i][key]+'</option>');
	    	}
	    	dom.append(arr.join(''));
	    },
        toastr: function (text) {
        	toastr.success(text);
        }
	}

	//页面所用到AJAX请求的URL industry
	page.ajaxUrl = {
	    GET_LIST: helper.url.getUrlByMapping("admin/userManager/find_pendingauthuserinfolists.shtml"),        //用户列表接口
	    UPDARE: helper.url.getUrlByMapping("admin/userManager/check_userinfo.shtml"),                         //审核用户接口
	    LOGINTYPE: helper.url.getUrlByMapping("admin/legalize/find_legalizelists.shtml"),                      //认证方式接口
	    AUTH_HTML: helper.url.getUrlByMapping("admin/examineuser.shtml"),                         //审核用户页面
	    USER_INFO: helper.url.getUrlByMapping("admin/userinfo.shtml")                   //查看用户信息
	}

	/**
	 * 提供给引用页面刷新用，如果未声明该方法，则引用页面调用将使用浏览器重载重新刷新本页面
	 */
	page.refresh = function () {
	    $("#btnSearch").click();
	};

	//页面事件
	page.eventHandler = {
	    //审核
		examine: function (id) {
	        layer.open({
	            type: 2,
	            skin: 'layui-layer-rim', //加上边框
	            title: '审核用户信息',
	            shadeClose: true,
	            scrollbar: false,
	            content: page.ajaxUrl.AUTH_HTML + '?id=' + id,
	            area: [ '95%', '95%' ]
	        });
	    },
	    
	    //查看或编辑用户
	    updateUser: function(id){
	    	layer.open({
	            type: 2,
	            skin: 'layui-layer-rim', //加上边框
	            title: '查看或编辑用户信息',
	            shadeClose: true,
	            scrollbar: false,
	            content: helper.CONST.BASE_PATH+'admin/edituser.shtml?id='+id,
	            area: [ '95%', '95%' ]
	        });
	    },
	    
	    showUser: function (id) {
	    	layer.open({
		        type: 2,
		        title: '查看用户信息',
		        skin: 'layui-layer-rim',
		        shadeClose: true,
		        scrollbar: false,
		        content: page.ajaxUrl.USER_INFO + '?id=' + id,
		        area: ['95%', '95%']
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
	    dataField: "data",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
	    columns: [{
	        field: 'realname',
	        title: '姓名',
	        width: "130px",
	        formatter: function (value, row) {
	        	return '<a href="javascript:;" class="user-info-demo" onclick="page.eventHandler.showUser(' + row.usid + ')">'+ value +'</a>';
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
	        field: 'auth_image',
	        title: '认证材料',
	        formatter: function(value){
	        	if(!value) return '—';
	        	return '<a href="javascript:;">点击查看</a>';
	        },
	        align: 'center'
	    },*/{
	        field: 'auth_type',
	        title: '认证方式',
	        width: "120px",
	        align: 'center'
	    },{
	        field: 'update_time',
	        title: '申请时间',
	        width: "120px",
	        formatter: function (value) {
	        	if (!value)  return '—';
	        	return helper.Convert.formatDate(value.time);
	        },
	        align: 'center'
	    },{
	    	field: 'isAuth',
	    	title: '认证结果',
	    	width: "100px",
	    	formatter: function(value){
	    		switch (value) {
	    		    case 1: return '<span class="text-primary">认证通过</span>';
	    		    case 3: return '待认证';
	    		    case 4: return '<span class="text-danger">拒绝认证</span>';
	    		    default: "—";
	    		}
	    	},
	    	align: 'center'
	    },{
	        field: ' ',
	        title: '操作',
	        width: "150px",
	        formatter:function(value, row){
	            return '<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.examine(' + row.usid + ')">审核</button>';;
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

	//初始化认证方式
	$.ajax({
		url: page.ajaxUrl.LOGINTYPE,
		type: 'post',
		dataType: 'json',
		success: function(res){
			page.derive.setOptions(page.$userv,res.data)
		},
		error: function(xhr){
			console.log(xhr);
		}
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