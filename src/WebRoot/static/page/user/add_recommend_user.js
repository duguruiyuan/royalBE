var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'toastr', 'module.inputSelector', 'validator'], function (bs, $, helper, swal, toastr) {
    var module = {
        inputSelector: require('module.inputSelector')
    };
    //页面所用到AJAX请求的URL page.ajaxUrl.ADD_REM
    page.ajaxUrl = {
        ADD_REM: helper.url.getUrlByMapping("admin/userManager/add_bigshotuserinfo.shtml"),                      //新增大咖接口
    }

    page.$form = $('#frmAddRecommend');
    page.$selectUserContainer = $('#selectUserContainer');
    page.$selectUserInput = null;
    page.$selectUserPrompt = $("#selectUserPrompt");
    page.$button = $("#divAction button");

    page.userId = null;
    page.userName = '';
    
    //页面辅助类/方法/属性page.assist.submitStatus
    page.assist = {
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
            }
    }
    
    page.$form.bootstrapValidator({
    	fields: {
    		weight: {
                message: '排序验证不通过',
                validators: {
                    notEmpty: {
                        message: '排序不能为空'
                    }
                }
            }
    	}
    });

    var selector = new module.inputSelector({
      container: "#selectUserContainer",
      validatorContainer: "#frmAddRecommend",
      readonly: false,
      type: "user",
      callback: function (data) {
    	  page.userId = data.key;
    	  page.userName = data.value;
    	  page.$selectUserContainer.parent().removeClass('has-error').addClass('has-success');
      }
    })

    page.$selectUserInput = page.$selectUserContainer.find('input');
    //确定
    $('#success_dk').on('click',function(){
    	var bv = page.$form.data('bootstrapValidator');
    	//手动触发验证
        bv.validate();
        var flag = true;
        if (!page.$selectUserInput.val().trim()) {
        	page.$selectUserContainer.parent().addClass('has-error').removeClass('has-success');
        }
    	if (bv.isValid()) {
    		page.assist.submitStatus(true);
    		$.ajax({
	      		url: page.ajaxUrl.ADD_REM,
	      		data: {
	      			usid: page.userId,
	      			weight: $('#weight').val()
	      		},
	      		type: 'post',
	      		dataType: 'json',
	      		success: function(res){
	      			if(res.code == 0){
	    				parent.page.refresh();
	    				parent.page.derive.toastr('操作成功');
	                	parent.layer.close(parent.layer.index);
	                    return;
	      			}
	      			swal({title: '新增大咖失败', text: res.errMsg, type: 'error'});
	      		},
	      		error: function(xhr){
	      			toastr.error("操作失败!", "请稍候再重试");
	      		},
	      		complete: function () {
                    page.assist.submitStatus(false);
                }
      	    });
    	}
    });
    //取消
    $('#cancel_btn').on('click',function(){
    	parent.layer.close(parent.layer.index);
    });
});