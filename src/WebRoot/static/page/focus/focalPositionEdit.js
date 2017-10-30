//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'iCheckPlus', 'toastrPlus', 'helper.qiniu', 'module.fileUpload', 'module.articleSelector', 'validator'], function (bs, $, helper, iCheck, toastr) {
    var module = {
        fileUpload: require('module.fileUpload'),
        articleSelector: require('module.articleSelector')
    };
  //页面所用到配置page.CONFIG.INSERT
    page.CONFIG = {
        GET_FOCAL_API: helper.url.getUrlByMapping("admin/jdw/get_jdw_id.shtml"),               //获取焦点位详情的接口
        INSERT: helper.url.getUrlByMapping("admin/jdw/insert_update_jdw.shtml"),               //新增焦点位
        UPLOAD_BUCKET: "image"  //存储图片的目录
    };

    //数据
    page.id = helper.url.queryString("id");
    page.position = helper.url.queryString("position");
    page.info = {id: 0, image_url: '', obj_title: '', title: '', title_id: '', type: ''}
    console.log(page.id, page.position);
    //常用的jquery对象
    page.$focusTitle = $('#focusTitle');
    page.$outLink = $('#outLink');
    page.$form = $('#frmAddfocus');
    page.$fileContainer = $('#fileContainer');
    page.$fileUrl = $('#fileUrl');
    page.$typeInLink = $('#typeInLink');
    page.$typeOutLink= $('#typeOutLink');
    page.$focusLink = $('#focusLink');
    page.$button = $("#divAction button");

    //组件实例
    page.fileUpload = null;
    page.articleSelect = null;

    //页面事件
    page.eventHandler = {
    	initPageInfo: function () {
    		//新增模式下
    		if (!page.id || page.id == 0) {
    			page.assist.initDataBind();
    			return;
    		}
    		$.ajax({
    			url: page.CONFIG.GET_FOCAL_API,
    			data: {id: page.id},
    			type: 'post',
    			dataType: 'json',
    			success: function (ret) {
    				if (ret.code == 0) {
    					page.info = ret.data;
    					page.assist.initDataBind();
    					return;
    				}
    				toastr.error("待编辑的焦点位不存在或发生错误!", "请稍候再重试或联系管理员！");
    			},
    			error: function () {
    				toastr.error("待编辑的焦点位不存在或发生错误!", "请稍候再重试或联系管理员！");
    			}
    		});
    	},
    	//表单验证并提交执行回调
        doSubmit: function () {
        	var flag = true;
        	var bv = page.$form.data('bootstrapValidator');
        	if (!page.$fileUrl.val().trim()) {
        		page.$fileContainer.addClass('has-error').removeClass('has-success');
        		page.$fileContainer.find('.help-block').show();
        		flag = false;
        	}
        	if ($("[name=radType]:checked").val() == 0) {
        		if (page.info.obj_title == '') {
        			page.$typeInLink.addClass('has-error').removeClass('has-success');
        			$('#typeInLinkPrompt').removeClass('hidden');
        			flag = false;
        		}
        	} else {
        		/*if (!page.$outLink.val().trim()){
        			page.$typeOutLink.addClass('has-error').removeClass('has-success');
        		    $('#typeOutLinkPrompt').removeClass('hidden').find('.text-prompt').html('外部链接不能为空');
        		    flag = false;
        		} else {
        			var reg = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
        			if (reg.test(page.$outLink.val())) {}
        		}*/
        	}
            //手动触发验证
            bv.validate();
            if (bv.isValid() && flag) {
            	page.assist.submitStatus(true);
            	if ($("[name=radType]:checked").val() == 1) {
            		page.info.obj_title = '';
            		page.info.type = 20;
            		page.info.title_id = page.$outLink.val()
            	}
            	var data = {
    				'id': page.info.id,
        			'image_url': page.$fileUrl.val(),
        			'title': page.$focusTitle.val(),
        			'type': page.info.type,
        			'obj_title': page.info.obj_title,
        			'position': page.position,
        			'title_id': page.info.title_id	
    			};
            	page.assist.upload(data);
            }
        }
    }

    //页面辅助类/方法/属性page.assist.upload
    page.assist = {
    	initDataBind: function () {
    		//初始化图片上传
    		page.fileUpload = new module.fileUpload({
        		container: "#fileSelector",
    		    existFiles: page.assist.getImage(),
    		    isUnique: true,
    		    completeCallback: function (data) {console.log(data);
    		    	page.info.image_url = data.url;
    		    	page.$fileUrl.val(data.url);
    		    	page.$fileContainer.removeClass('has-error').addClass('has-success');
    	    		page.$fileContainer.find('.help-block').hide();
    		    },
    		    deleteCallback: function () {
    		    	page.$fileUrl.val('');
    		    	page.$fileContainer.addClass('has-error').removeClass('has-success');
    	    		page.$fileContainer.find('.help-block').show();
    		    }
    		});
    		//初始化文章选择器
    		page.articleSelect = new module.articleSelector({
        		  container: "#focusLink",
        		  readonly: false,
        		  isUnique: true,
        		  hasExternal: false,
        		  articleList: page.assist.getArticle(),
        		  callback: function (data) {console.log(data);
        			  page.info.type = data.obj_type;
        			  page.info.title_id = data.obj_id;
        			  page.info.obj_title = data.show_title;
        			  page.$typeInLink.removeClass('has-error').addClass('has-success');
          			  $('#typeInLinkPrompt').addClass('hidden');
        			  page.$focusLink.find('.close').on("click", function () {
        				  page.info.type = '';
            			  page.info.title_id = '';
            			  page.info.obj_title = '';
            			  page.$typeInLink.addClass('has-error').removeClass('has-success');
              			  $('#typeInLinkPrompt').removeClass('hidden');
        	  		  });
        		  }
        	});
    		page.$focusLink.find('.close').on("click", function () {
    			page.info.type = '';
    			page.info.title_id = '';
    			page.info.obj_title = '';
    			page.$typeInLink.addClass('has-error').removeClass('has-success');
    			$('#typeInLinkPrompt').removeClass('hidden');
    		});
    		//
    		page.$fileUrl.val(page.info.image_url);
    		page.$focusTitle.val(page.info.title);
    		if (page.info.type && page.info.type == 20) {
    			page.$outLink.val(page.info.title_id);
                $("[name=radType]:checked").removeAttr("checked");
                $("[name=radType][value=1]").attr("checked", "checked");
    		}
    		iCheck.toggle.init("body");
    		page.assist.initFlag.EDIT = 1;
    		page.assist.initComplete();
    	},
    	getImage: function () {
    		var arr = [];
    		if (page.info.image_url.trim()) arr.push(page.info.image_url);
    		return arr;
    	},
    	getArticle: function () {
    		var articleArr = [];
    		if (!!page.info.type && page.info.type != 20) {
    			articleArr.push({
    				obj_id: page.info.title_id, 
    				obj_type: page.info.type, 
    				show_title: page.info.obj_title, 
    				article_title: page.info.obj_title
    			});
    		}
    		return articleArr;
    	},
    	upload: function (data) {
    		$.ajax({
    			url: page.CONFIG.INSERT,
    			data: data,
    			type: 'post',
    			dataType: 'json',
    			success: function (ret) {
    				if(ret.code == 0){
    					
    					if (page.id == 0) {
    						parent.page.info[page.position-1] = ret.data;
    						parent.page.refresh(ret.data.id, page.position);
    						parent.page.assist.toastrModal('新增焦点位成功');
    					} else {
    						//parent.page.info[page.position-1] = page.info
    						parent.page.info[page.position-1] = data;
    						parent.page.refresh(page.id, page.position);
    						parent.page.assist.toastrModal('修改焦点位成功');
    						//parent.toastr.success('修改焦点位成功');
    					}
    					
    					parent.layer.closeAll();
    					
                        return;
                    }
                    swal("操作失败", ret.errMsg, "error");
    			},
    			error: function () {
    				swal("操作失败", "请稍候再重试或联系管理员", "error");
    			},
    			complete: function () {
    				page.assist.submitStatus(false);
    			}
    		});
    	},
    	//取消
    	cancel: function () {
    		parent.layer.close(parent.layer.index);
    	},
    	
    	//变更各个操作按钮操作状态
        submitStatus: function (type) {
            if(type){
                //提交
                page.$button.attr("disabled", "disabled");
                toastr.info("提交中，请稍候...");
                return;
            }

            //提交完成/失败
            page.$button.removeAttr("disabled");
        },
        
        //页面初始化完成状态，全部=1表示初始化完成
        initFlag: {QINIU: 0, EDIT: 0},

        //初始化全部完成后操作按钮才可用
        initComplete: function () {
            for(var k in this.initFlag){
                //初始化未完成
                if(!this.initFlag[k]) return;
            }

            page.$button.removeAttr("disabled");
            toastr.clear();
        },
    }

    toastr.info("初始化加载中，请稍候...");
    //初始化获取七牛存储token
    var qiniu = new helper.qiniu.token(page.CONFIG.UPLOAD_BUCKET, function () {
    	page.assist.initFlag.QINIU = 1;
        page.assist.initComplete();
    });
    //当页面打开时每半个小时重新获取一次七牛token
    setInterval(function(){
        qiniu.getToken();
    }, 30*60*1000);

    //初始化页面
    page.eventHandler.initPageInfo();

    //验证初始化
    page.$form.bootstrapValidator({
        //指定不验证的情况
       // excluded: [':disabled', ':hidden', ':not(:visible)'],
        message: '验证未通过',
        feedbackIcons: {/*输入框不同状态，显示图片的样式*/
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {/*验证*/
        	fileUrl: {/*键名和input name值对应*/
                message: '图片验证不通过',
                validators: {
                    notEmpty: {/*非空提示*/
                        message: '图片不能为空'
                    }
                }
            },
            textTitle: {
                message:'标题验证不通过',
                validators: {
                	notEmpty: {
                        message: '标题不能为空'
                    }
                }
            },
            outLink: {
            	message: '链接验证不通过',
                validators: {
                    notEmpty: {/*非空提示*/
                        message: '链接地址不能为空'
                    },
                    regexp: {
                        regexp: /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,
                        message: '链接地址不正确'
                    }
                }
            }
        }
    });

    //确定
    $('#btnConfirm').click(function () {
    	page.eventHandler.doSubmit();
    });

    //取消
    $('#btnCancel').click(function () {
    	parent.layer.close(parent.layer.index);
    });

    $('.i-checks').on('ifChecked',function(event){
    	var _val = $(this).attr('data-value');
    	if(_val == 1){
    		page.$typeInLink.removeClass('has-error').removeClass('has-success');
    		$('#typeInLinkPrompt').addClass('hidden');
    	}
    });
});