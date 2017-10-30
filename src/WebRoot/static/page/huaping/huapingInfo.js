//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'toastr', 'fancybox'], function (bs, $, helper, toastr, swal) {
	//页面所用到配置page.CONFIG.RELATION
	page.CONFIG = {
	    GET_INFO_API: helper.url.getUrlByMapping("admin/sliderManager/find_powersliderInfo.shtml"),                //获取开机滑屏详情接口
	    DELETE_API: helper.url.getUrlByMapping("admin/sliderManager/stopordel_powersliderinfo.shtml"),              //删除开机滑屏接口
	    DELETE_STATUS: 2,       //删除的状态码
	    REPLY_STATUS: 1,        //恢复的状态码
	    RELATION: "huapinglist.shtml?type=complete",                                      //关联的打开窗口
	    EDIT_HTML: "huapinghandle.shtml"
	};

	//数据相关
	page.id = helper.url.queryString("id");
	page.action = helper.url.queryString("action");
	page.info = {};

	//
	page.$button = $("#divAction button");

	//页面事件
	page.eventHandler = {
		//初始化页面内容
	    initPageInfo: function () {
	    	if (page.id) {
	    		$.ajax({
	    			url: page.CONFIG.GET_INFO_API,
	    			data: {slider_id: page.id},
	    			dataType: 'json',
	    			success: function (ret) {
	    				if (ret.code == 0) {
	    					data = ret.data;console.log(data);
	    					//创建者
	    			        var template = '&nbsp;&nbsp;<i class="glyphicon glyphicon-user"></i>&nbsp;<span>{0}</span>&nbsp;&nbsp;{1}&nbsp;{2}';
	    			        var html = template.Format(data.author_name, '创建于', helper.convert.formatDate(data.create_time));
	    			        $("#divCreatePanel").html(html);
	    			        //编辑者
	    			        if(data.update_user_name){
	    			            html = template.Format(data.update_user_name, '修改于', helper.convert.formatDate(data.update_time));
	    			            $("#divEditPanel").html(html);
	    			        }
	    					$('#slider_time').html(helper.convert.formatDate(data.slider_start_time)+' ~ '+helper.convert.formatDate(data.slider_end_time));
	    					//$('#slider_end_time').html(helper.convert.formatDate(data.slider_end_time));
	    					$('#slider_name').html(data.slider_name);
	    					var images = [];
	    					if (data.slider_pic_images){
	    						var imageData = JSON.parse(data.slider_pic_images);
	    						for (var i =0 ;i < imageData.length; i++) {
	    							images.push(imageData[i].url);
	    						}
	    					}
	    			        if(images.length > 0){
	    			            template = '<a class="fancybox imgbox mg-10" rel="group" href="{0}" title=""><img alt="" style="width:100%;height:100%" src="{0}" /></a>';
	    			            html = '';
	    			            for(var i = 0; i < images.length; i++){
	    			                html += template.Format(images[i]);
	    			            }
	    			            $("#huaPingImages").html(html).find(".fancybox").fancybox();
	    			        }
	    					toastr.clear();
	    					return;
	    				}
	    				toastr.error("您查看的开机滑屏不存在或发生错误!", "请稍候再重试或联系管理员！");
	    			},
	    			error: function () {
	    				toastr.error("您查看的开机滑屏不存在或发生错误!", "请稍候再重试或联系管理员！");
	    			}
	    		});
	    	}
	    },
	    doHandler: function (data, url, prompt) {
	    	$.ajax({
	            url: url,
	            type : 'POST',
	            data: data,
	            dataType : 'json',
	            success : function(ret) {
	                if(ret.code == 0){
	                	parent.layer.close(parent.layer.index);
	                	parent.page.$table.bootstrapTable('refresh');
	                	parent.toastr.success(prompt+'滑屏操作成功');
	                    return;
	                }

	                swal("操作成功失败", ret.errMsg, "error");
	            },
	            error:function(ret) {
	                swal("操作成功失败", "请稍候再重试或联系管理员", "error");
	            }
	        });
	    },
	    //打开编辑
	    showEdit: function () {
	    	console.log(123, helper);
	    	helper.win.open({name: '修改开机滑屏', url: page.CONFIG.EDIT_HTML + '?action=edit&id=' + page.id});
	    	parent.layer.close(parent.layer.index);
	    },
	};

	//页面辅助类/方法/属性
	page.assist = {
		//关闭
		cancelPush: function () {
			parent.layer.close(parent.layer.index);
		},
		//删除开机滑屏
	    delete: function () {
	        var data = {
	            "slider_id": page.id,
	            "status": page.CONFIG.DELETE_STATUS
	        };
	        page.eventHandler.doHandler(data, page.CONFIG.DELETE_API, "删除");
	    },

	    //恢复开机滑屏
	    reply: function () {
	        var data = {
	            "slider_id": page.id,
	            "status": page.CONFIG.REPLY_STATUS
	        };
	        page.eventHandler.doHandler(data, page.CONFIG.DELETE_API, "恢复");
	    },
	    
	    //中止投放
	    stop: function () {
	    	var data = {
	            "slider_id": page.id
	        };
	        page.eventHandler.doHandler(data, page.CONFIG.DELETE_API, "中止");
	    },
	    //变更页面按钮的状态（根据页面状态）
	    setButtonShow: function () {
	        page.$button.each(function () {
	            if($(this).data("action").indexOf(page.action) == -1)
	                $(this).parent().hide();
	            else
	                $(this).parent().show();
	        });
	        //$("#divAction button").eq(0).removeClass("btn-warning").addClass("btn-primary");
	    }
	}

	//页面初始化
	$(document).ready(function(){
		toastr.info("初始化加载中，请稍候...");

	    //初始化页面渲染内容
	    page.eventHandler.initPageInfo();
	    
	    page.assist.setButtonShow();
	});
});