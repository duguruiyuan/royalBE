//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'toastr', 'fancybox'], function (bs, $, helper, toastr, fancybox) {
	//页面所用到配置
	page.CONFIG = {
	    SELECT_LIST: helper.url.getUrlByMapping("admin/userManager/get_userinfo.shtml")     //获取用户信息
	};

	page.id = helper.url.queryString("id");

	//页面事件
	page.eventHandler = {
	    userInfo: function () {
	        //初始化用户信息
	        $.ajax({
	            url: page.CONFIG.SELECT_LIST,
	            data: {
	            	'usid': page.id
	            },
	            type: 'post',
	            dataType: 'json',
	            success: function(res){
	                if(res.code == 0){
	                    var result = res.userInfo;console.log(result);
	                    if(result.image && result.image.trim()){
	        				var template = '<a class="fancybox" rel="group" href="{0}" title=""><img alt="" style="height: 120px" src="{0}" /></a>';
	                        var html = template.Format(result.image);
	                        $("#image").html(html).parents('.form-group').removeClass('hidden');
	                        //$("#image").find(".fancybox").fancybox();
	        			} else {
	        				$('#image').html('—');
	        			}
	                    $('#realname').html(result.realname);
	                    $('#mobile').html(result.mobile);
	                    $('#weight').html(result.weight_name);
	                    $('#isAuth').html(result.isAuth == 1 ? '是' : '否');
	                    if (result.isAuth == 1 && result.auth_type && result.auth_type_name) {
	                    	$('#userv').html(result.auth_type_name).parents('.form-group').removeClass('hidden');
	                    }
	                    if (result.authList && result.authList.length != 0) {
	                    	var image = result.authList[0].IMAGE || '';
	                    	if (image.trim() != '') {
	                    		var template = '<a class="fancybox" rel="group" href="{0}" title=""><img alt="" style="height: 120px" src="{0}" /></a>';
		                        var html = template.Format(image);
		                        $("#authList").html(html).parents('.form-group').removeClass('hidden');
		                        $("#authList").find(".fancybox").fancybox();
	                    	}
	                    }
	                    
	                    $('#frmUserInfo').find(".fancybox").fancybox();
	                    $('#company').html(result.company);
	                    $('#companywork').html(result.companywork);
	                    $('#shOccupation').html(result.shOccupation || '—');
	                    $('#nativeinfo').html(result.nativeinfo);
	                    $('#reside').html(result.reside);
	                    $('#nativeinfo').html(result.nativeinfo);
	                    $('#position').html(page.assist.getPosition(result.industry));
	                    //$('#companyaddress').html(result.companyaddress || '—');
	                    if (result.companyaddress && result.street) {
	                    	$('#companyaddress').html(result.companyaddress + ' ' + result.street);
	                    } else if (result.companyaddress) {
	                    	$('#companyaddress').html(result.companyaddress);
	                    } else {
	                    	$('#companyaddress').html('—');
	                    }
	                    $('#companyintroduction').html(result.companyintroduction || '—');
	                    $('#companyweb').html(result.companyweb || '—');
	                    return;
	                }

	                toastr.error("OMG!", res.errMsg);
	            },
	            error: function(){
	                toastr.error("OMG!", "获取匿名称列表错误，请稍候再重试！");
	            }
	        });
	    }
	};

	//页面辅助类/方法/属性
	page.assist = {
	    //
		getPosition: function (str) {
			if (!str) return '';
			if (!/^\[(.+)\]$/.test(str)) return '—';
			var arr = [];
			var data = JSON.parse(str) || '';
			if (data.length == 0) return '—';
			for (var i = 0; i < data.length; i++) {
				arr.push(data[i].industry);
			}
			return arr.join('，');
		}
	};

	//页面初始化
	$(document).ready(function(){
	    toastr.info("初始化加载中，请稍候...");
	 
	    page.eventHandler.userInfo();
	    
	    toastr.clear();
	    
	    //关闭
	    $("#btnCancel").click(helper.win.close);
	});
});