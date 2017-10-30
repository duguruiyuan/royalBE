//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'validator', 'fancybox'], function (bs, $, helper) {
	//页面所用到配置page.CONFIG.REPLY_STATUS  
	page.CONFIG = {
	    GET_USER_API: helper.url.getUrlByMapping("admin/userManager/get_userinfo.shtml"),    //获取用户信息接口
	    GET_EXAMINE_API: helper.url.getUrlByMapping("admin/userManager/check_userinfo.shtml"),    //审核用户接口
	    GET_AUTH_API: helper.url.getUrlByMapping("admin/legalize/find_legalizelists.shtml"),         //获取认证方式接口
	    REPLY_STATUS: 1,        //认证通过的状态码
	    NOPASS_STATE: 4,        //拒绝认证的状态码
	};

	page.id = helper.url.queryString("id");

	//
	page.$form = $('#formExamineUser');

	//页面事件page.eventHandler.getStr
	page.eventHandler = {
			initUser: function (result) {
				if(!!result.image){
					template = '<a class="fancybox" rel="group" href="{0}" title=""><img alt="" style="height: 120px" src="{0}" /></a>';
	                html = '';
	                html += template.Format(result.image);
	                $("#upload_content").html(html).find(".fancybox").fancybox();
				} else {
					$('#upload_content').html('—');
				}
				$('#realname').html(page.eventHandler.getStr(result.realname));
				$('#mobile').html(page.eventHandler.getStr(result.mobile));
				var images = [];
				if(result.authList && result.authList.length != 0){
		        	for (var i = 0; i < result.authList.length; i++){
		        		if(result.authList[i].IMAGE && result.authList[i].IMAGE != '') {
		        			images.push(result.authList[i].IMAGE);
		        			//$('#upload_content_cl').append('<img width="160px" src="'+ result.authList[i].IMAGE +'">');
		        		}
		        	}
		        	if(images.length > 0){
		                template = '<a class="fancybox" rel="group" href="{0}"><img style="height: 120px;margin:0 5px" src="{0}" /></a>';
		                html = '';
		                for(var i = 0; i < images.length; i++){
		                    html += template.Format(images[i]);
		                }
		                $("#divShortImages").html(html).find(".fancybox").fancybox();
		            }else{
			        	$('#divShortImages').html('—');
			        }
		        }else{
		        	$('#divShortImages').html('—');
		        }
				$('#company').html(page.eventHandler.getStr(result.company));
				$('#companywork').html(page.eventHandler.getStr(result.companywork));
				//获取认证方式
		        /*$.ajax({
		        	url: page.CONFIG.GET_AUTH_API,
		        	type: 'post',
		        	dataType: 'json',
		        	success: function(res){
		        		page.userv = res.data;
		        		page.eventHandler.setSelectOption($('#userv'), page.userv, result.auth_type);
		        	},
		        	error: function(xhr){
		        		console.log(xhr);
		        	}
		        });*/
		        $.ajax({
		            url: page.CONFIG.GET_AUTH_API,
		            type: 'post',
		            dataType: 'json',
		            success: function(res){
		                if(res.code == 0){
		                    var data = res.data, selected = '', comment = '';

		                    var arr = ['<option value="">请选择</option>'];
		                    for(var i = 0; i < data.length; i++){
		                        selected = result.auth_type ==data[i].id ? ' selected="selected"' : '';
		                        comment = data[i].comment == 0 ? '强认证' : '弱认证';
		                        arr.push('<option value="' + data[i].id + '"' + selected +'>' + data[i].name + '（'+ comment +'）' + '</option>');
		                    }
		                    $('#userv').html(arr.join(''));
		                    return;
		                }

		                toastr.error("OMG!", res.errMsg);
		            },
		            error: function(){
		                toastr.error("OMG!", "获取认证方式列表错误，请稍候再重试！");
		            }
		        });
			},
			load: function () {
				$.ajax({
		        	url: page.CONFIG.GET_USER_API ,
		        	type: 'post',
		        	dataType: 'json',
		        	data: {
		        		usid: page.id
		        	},
		        	success: function(res){console.log(res);
		        		if(res.code == 0){
		        			page.eventHandler.initUser(res.userInfo);
		        		}
		        	},
		        	error: function () {
		        		
		        	}
				});
			},
			setSelectOption: function (dom,data,index,idKey,nameKey) {
				if(data == '') return;
				var idKey = idKey || 'id';
				var nameKey = nameKey || 'name';
				var arr = ['<option value="">请选择</option>'];
				for(var i = 0; i < data.length; i++){
					if(index == data[i][idKey]){
						arr.push('<option value="'+data[i][idKey]+'" selected="selected">'+data[i][nameKey]+'</option>');
					}else{
						arr.push('<option value="'+data[i][idKey]+'">'+data[i][nameKey]+'</option>');
					}
				}
				dom.append(arr.join(''));
			},
			getStr: function (str) {
				if (!str && !str.trim()) return '';
				return str;
			},
			examineUser: function (status) {
				var bv = page.$form.data('bootstrapValidator');
		        //手动触发验证
		        bv.validate();
		        if(bv.isValid()){
		        	$.ajax({
						url: page.CONFIG.GET_EXAMINE_API,
						data: {
		            		usid: page.id,
		            		auth_type: $('#userv').val(),
		            		status: status
		            	},
		            	type: 'post',
		            	dataType: 'json',
		            	success: function(res){
		            		if(res.code == 0){
		            			parent.page.derive.toastr('操作成功');
		            			parent.page.refresh();
		            			parent.layer.close(parent.layer.index);
		            			/*swal({title:"审核成功", text: "1s后自动消失...", type: "success", timer: 1000});
		            			setTimeout(function(){
		            				parent.layer.close(parent.layer.index);
		            			},1000)*/
		            		}else{
		            			swal({
		            				title: '审核失败',
		            				success: 'error'
		            			});
		            		}
		            	},
		            	error: function(xhr){
		            		console.log(xhr);
		            	}
					});
		        }
			}
	}
	//初始化
	page.eventHandler.load();

	//验证初始化
	page.$form.bootstrapValidator({
		  //指定不验证的情况
	    excluded: [':disabled', ':hidden', ':not(:visible)'],
	    message: '验证未通过',
	    feedbackIcons: {/*输入框不同状态，显示图片的样式*/
	        valid: 'glyphicon glyphicon-ok',
	        invalid: 'glyphicon glyphicon-remove',
	        validating: 'glyphicon glyphicon-refresh'
	    },
	    fields: {
	    	
	        userv: {
	            message:'认证方式验证不通过',
	            validators: {
	                notEmpty: {
	                    message: '认证方式必须选择'
	                }
	            }
	        }
	    }
	  });

	//认证通过
	$('#preservation_user').click(function () {
		page.eventHandler.examineUser(page.CONFIG.REPLY_STATUS);
	});

	//拒绝认证
	$('#btnAuditNoPass').click(function () {
		page.eventHandler.examineUser(page.CONFIG.NOPASS_STATE);
	});

	//取消
	$('#cancel-btn').on('click',function(){
		parent.layer.close(parent.layer.index);
	});
});