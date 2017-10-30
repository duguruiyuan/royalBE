//初始化页面对象
var page = {};

//页面级的帮助对象集合
page.derive = {
    //获取表单参数用于搜索
    getParams: function (params) {
        params.startcreatetime = helper.convert.formatTimestamp($("#startcreatetime").val());
        params.endcreatetime = helper.convert.formatTimestamp($("#endcreatetime").val(), {day: 1});
        return params;
    }
}

//页面所用到AJAX请求的URL
page.CONFIG = {
    GET_COUNT_LIST: helper.url.getUrlByMapping("admin/userManager/find_newuserlinear.shtml"),    //查询待审核密文列表接口
    GET_ADD_COUNT: helper.url.getUrlByMapping("admin/userManager/find_newuserinfolist.shtml"),    //获取昨日新增用户
    USER_LIST: helper.url.getUrlByMapping("admin/userlist.shtml")         //用户列表页
}

//
page.date = {};
page.lineData = [];
page.$startTime = $('#startTime');
page.$endTime = $('#endTime');
page.index = '';

//页面事件
page.eventHandler = {
	initPageInfo: function () {
		page.assist.getLine();
		page.assist.getCount(1);
		page.assist.getCount(2);
	}
}

//页面辅助类/方法/属性
page.assist = {
	getNowData: function () {
		var t = new Date();
		page.date.year = t.getFullYear();
		page.date.month = (t.getMonth() + 1) < 10 ? '0' + (t.getMonth() + 1) : t.getMonth() + 1;
		page.date.day = t.getDate() < 10 ? '0' + t.getDate() : t.getDate();
		page.$startTime.val(page.date.year + '-' + page.date.month + '-01');
		page.$endTime.val(page.date.year + '-' + page.date.month + '-' + page.date.day);
	},
	getLine: function () {
		$.ajax({
			url: page.CONFIG.GET_COUNT_LIST,
			data: {
				start_time: page.$startTime.val(),
				end_time: page.$endTime.val()
			},
			type: 'post',
			dataType: 'json',
			success: function (res) {
				console.info(res.data);
				page.assist.setLine(res.data);
			}
		});
	},
	getCount: function (type) {
		$.ajax({
			url: page.CONFIG.GET_ADD_COUNT,
			data: {
				search_type: type
			},
			type: 'post',
			dataType: 'json',
			success: function (res) {console.log(res);
				type == 1 ? $('#yesterdate-count').html(res.total) : $('#mounth-count').html(res.total);
			}
		});
	},
	setLine: function (data) {
		Morris.Line({
	        element: 'morris-one-line-chart',
	        data: data,
	        xkey: 'create_time',
	        ykeys: ['total'],
	        resize: true,
	        hideHover: true,
	        lineWidth:4,
	        labels: ['create_time'],
	        lineColors: ['#1ab394'],
	        pointSize:5,
	        hoverCallback: function (index, options, content) {
	        	if (page.index == index) return;
	        	page.index = index;
	        	var result = options.data[index];
	        	$('#morris-one-line-chart').find('.morris-hover').html(result.create_time + '新增' + result.total + '个用户');
	        }
	    });
	},
	showUserList: function (type) {
		layer.open({
            type: 2,
            title: '用户列表',
            skin: 'layui-layer-rim', //加上边框
            shadeClose: true,
            scrollbar: false,
            content: page.CONFIG.USER_LIST + '?type=' + type,
            area: ['95%', '95%']
        });
	}
}

$(document).ready(function(){
	page.assist.getNowData();
	
	//
	page.eventHandler.initPageInfo();
	
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
    }).on("change", function (e) {
        //设置日期控件前后日期的依赖
        //var $this = $(e.target);
        //console.log($this.val());
        //page.assist.getLine();
    });
	
    $('#yesterdate-btn').click(function () {
    	page.assist.showUserList(1);
    });
    
    $('#mounth-btn').click(function () {
    	page.assist.showUserList(2);
    });
    $("#btnSearch").click(function(){
    	$('#morris-one-line-chart').html('');
    	if (page.$startTime.val() == '' || page.$endTime.val() == '') {
    		page.assist.getNowData();
    	}
    	page.assist.getLine();
    });
});
