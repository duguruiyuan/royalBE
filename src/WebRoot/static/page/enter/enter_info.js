//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'toastr', 'fancybox'], function (bs, $, helper, toastr, fancybox) {
	
	//页面所用到AJAX请求的URL industry
	page.ajaxUrl = {
	    GET_INFO: helper.url.getUrlByMapping("admin/settled/get_settled_id.shtml")               //商会入驻详情接口
	}

	//页面参数
	page.id = helper.url.queryString("id");

	//页面事件
	page.eventHandler = {
			initEnterInfo: function (id) {
				toastr.info("初始化加载中，请稍候...");
				$.ajax({
					url: page.ajaxUrl.GET_INFO,
					data: {
						'id': id
					},
					dataType: 'json',
					type: 'post',
					success: function (res) {
						if (res.code == 0) {
							var result = res.data;console.log(result);
					  		$('#user_name').html(result.user_name);
					  		$('#mobile').html(result.mobile);
					  		$('#user_address').html(result.user_address);
					  		$('#user_message').html(result.user_message);
					  		if (result.image && result.image.trim()) {
					  			var template = '<a class="fancybox" rel="group" href="{0}"><img style="height: 120px" src="{0}" /></a>';
					  			var html = template.Format(result.image);
				                $("#image").html(html).find(".fancybox").fancybox();
					  		} else {
					  			$("#image").html('—')
					  		}
					  		$('#shanghui').html(result.shanghui);
					  	    //$('#user_id').html(result.user_id);
					  		$('#update_time').html(helper.convert.formatDate(result.update_time));
					  		$('#create_time').html(helper.convert.formatDate(result.create_time));
					  		toastr.clear();
					  		return;
						}
						toastr.error("OMG!", res.errMsg);
					},
					error: function () {
						toastr.error("OMG!", "获取匿名称列表错误，请稍候再重试！");
					}
				});
			}
	}

	//页面初始化
	page.eventHandler.initEnterInfo(page.id);
});