//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'table'], function (bs, $, helper, swal) {
	//存储页面table对象
	//page.$tool = $('#tableTools');
	page.$table = $('#tableList');
	//页面事件
	page.eventHandler = {
			//获取提供给表格位置的自适应浏览器的高度，最小高度500
		    getAdaptTableHeight: function () {
		        var height = $(window).height() - 30;
		        return height >= 500 ? height : 500;
		    }
	}
	//页面所用到AJAX请求的URL industry
	page.ajaxUrl = {
	    GET_LIST: helper.url.getUrlByMapping("admin/comment/find_comment_encourage.shtml")               //评论鼓励列表接口
	}

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
	        return params;
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
	    	field: 'type',
	    	title: '内容',
	    	width: '200px',
	    	formatter: function(value, data){
	    		switch(value){
	            	case 1: return data.reply_user_name+'的观点被'+data.user_name+'等人评论';
	            	case 2: return data.reply_user_name+'的观点被'+data.user_name+'等人点赞';
	            	case 3: return data.user_name+'的观点被点赞20次以上';
	            	case 4: return data.user_name+'评论被设置为精彩评论';
	            	default: return '-';
	    	    }
	    	},
	    	align: 'left'
	    },{
	    	field: 'create_time',
	    	title: '创建时间',
	    	width: '200px',
	    	formatter: function (value) {
	    		return helper.Convert.formatDate(value);
	    	},
	    	align: 'center'
	    },{
	    	field: 'type',
	    	title: '对应用户',
	    	width: '200px',
	    	formatter: function(value, data){
	    		switch(value){
	            	case 1: return data.reply_user_name;
	            	case 2: return data.reply_user_name;
	            	case 3: return data.user_name;
	            	case 4: return data.user_name;
	            	default: return '-';
	    	    }
	    	},
	    	align: 'center'
	    }]
	});

	$(window).resize(function () {
	    page.$table.bootstrapTable("resetView", {height: page.eventHandler.getAdaptTableHeight() + 10});
	});
});