//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'iCheckPlus', 'toastr', 'helper.qiniu', 'module.editor', 'module.push', 'module.fileUpload', 'module.articleSelector', 'validator'], function (bs, $, helper, iCheck, toastr) {
    var module = {
        push: require('module.push'),
        editor: require('module.editor'),
        fileUpload: require('module.fileUpload'),
        articleSelector: require('module.articleSelector')
    };
	//页面所用到配置
	page.CONFIG = {
	    GET_ARTICLE_API: helper.url.getUrlByMapping("admin/pushDevice/find_deviceinfo.shtml"),     //获取信息源的接口
	    ADD_API: helper.url.getUrlByMapping("admin/pushDevice/add_pushdeviceinfo.shtml"),                     //新增信息流接口
	    AUDIT_STATE: {state: 2, msg: "提交审核成功，请等待审核！"},             //提交审核状态值
	    RELATION: "pushdevicelist.shtml?type=wait",                           //关联的打开窗口
	};
	
	//常用的jquery对象
	page.$form = $('#frmAddCiphertext');
	page.$button = $("#divAction button");
	page.$articleTitle = $('#articleTitle');
	page.$articleType = $('#articleType');
	page.$articleSelect = $('#articleSelect');
	page.$articleSelectContainer = $('#articleSelectContainer');
	page.$articleSelectPropmt = $('#articleSelectPropmt');
	page.$objMobilePush = $('#objMobilePush');
	page.$objMobilePushTitle = null;
	//组件实例
	page.mobilePush = null;
	page.articleSelect = null;
	page.article = {
			state: '',
			obj_id: '',
			obj_type: ''
	}
	
	//页面事件
	page.eventHandler = {
	//    selectArticle: function () {
	//    	new module.articleSelector({
	//		    modalHead: '信息源选择',
	//		    pageSize: 20,
	//		    pageList: [10, 20, 50, 100],
	//		    area: ['90%', '90%'],
	//		    callback: function (data) {console.log(data);
	//		        page.article.state = data.state;
	//		        page.article.obj_id = data.obj_id;
	//		        page.article.obj_type = data.obj_type;
	//		    	page.$articleTitle.html(subStr(HTMLDecode(data.title), 100));
	//		    	page.$articleType.html(getTypeName(data.obj_type));
	//		    }
	//		});
	//    },
	    //表单验证并提交执行回调
	    doSubmit: function (stateInfo) {
	
	    	var display_position = $('#typeSelect').find('.checked').children().eq(0).val();
	        var bv = page.$form.data('bootstrapValidator');
	        //手动触发验证
	        bv.validate();
	        if (display_position == 1) {
	        	if (!page.article.obj_id) {
	            	page.$articleSelectContainer.addClass('has-error');
	            	page.$articleSelectPropmt.show().find('div').html('请选择信息源');
	            	return;
	            }
	        }
	    	
	    	
	    	/*var bbbbb = $('.note-editable');
	    	if (bbbbb.html() == '') {
	    		bbbbb.parents('.form-group').addClass('has-error');
	    	}*/
	    	
	        if(bv.isValid()){
	            var data = page.assist.getParams(stateInfo.state,display_position);
	            if (data.sb_all_user != 2) {
	            	if (data.sb_title_imei == '') {
	            		console.info('ceshi', data.sb_title_imei);
	            		page.$objMobilePushTitle.parents('.form-group').addClass('has-error');
	            		return;
	            	}
	            };
	            page.assist.submitStatus(true);
	            $.ajax({
	                url: page.CONFIG.ADD_API,
	                type : 'POST',
	                data: data,
	                dataType : 'json',
	                success : function(ret) {
	                    if(ret.code == 0){
	                    	console.info('ceshi','ok');
	                        helper.win.changeQuoto({msg: stateInfo.msg, relation: page.CONFIG.RELATION});
	                    }else{
	                        toastr.error("操作失败!", ret.errMsg);
	                    }
	                },
	                error:function() {
	                    toastr.error("操作失败!", "请稍候再重试");
	                },
	                complate: function () {
	                	page.assist.submitStatus(false);
	                }
	            });
	            return;
	        }
	
	        //验证未通过
	        bv.getInvalidFields().focus();
	    }
	};
	
	//页面辅助类/方法/属性page.assist.submitStatus
	page.assist = {
	    //获取页面参数
	    getParams: function (state,display_position) {
	        var data = {};
	        if(display_position == 1){
	        	data.obj_id = page.article.obj_id;
	            data.obj_type = page.article.obj_type;
	            data.display_position = display_position;
	        }else{
	        	
	        	data.display_position = display_position;
	        }
	        data.state = page.CONFIG.AUDIT_STATE.state;
	        //获取推送组件中的数据
	        page.mobilePush.getFormData(data);
	
	        return data;
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
        }
	};
	
	//页面初始化
	$(document).ready(function(){
	    toastr.info("初始化加载中，请稍候...");
	    
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
	        fields: {/*验证*/
	            /*txtTitle: {//键名username和input name值对应
	                message: '标题验证不通过',
	                validators: {
	                    notEmpty: {//非空提示
	                        message: '标题不能为空'
	                    },stringLength:{
	                        max: 50,
	                        message: "标题不能超过50个字"
	                    }
	                }
	            }*/
	        }
	    });
	    
	    //初始化信息流推送组件
	    page.mobilePush = new module.push.mobile({
	        container: "#objMobilePush",
	        validatorContainer: "#frmAddCiphertext",
	        defaultPush: {selected: 1, value: module.push.pushEnum.none}
	    });
	    //初始化信息源
	    page.articleSelect = new module.articleSelector({
	    	  container: "#articleSelectContent",
	    	  validatorContainer: "",
	    	  readonly: false,
	    	  isUnique: true,
	    	  hasExternal: false,
	    	  articleList: [],
	    	  callback: function (data) {console.log(data);
	    		  //page.article.state = data.state;
			      page.article.obj_id = data.obj_id;
			      page.article.obj_type = data.obj_type;
	    		  page.$articleType.html(helper.obj.getObjLabel(data.obj_type));
	    		  page.$articleSelectContainer.removeClass('has-error');
	          	  page.$articleSelectPropmt.hide().find('div').html('');
	    	  }
	    	})
	    
	    page.assist.submitStatus(false);
	    
	    toastr.clear();
	    //调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
	    
	//    page.$typeSelections.eq(1).removeAttr('checked')
	//    page.$typeSelections.eq(1).attr('checked','checked')
	    //编辑模式
	    page.$objMobilePushTitle = page.$objMobilePush.find('input[class="form-control"]');
	    page.$objMobilePushTitle.on('focus',function () {
	    	page.$objMobilePushTitle.parents('.form-group').removeClass('has-error');
	    });
	    page.$objMobilePush.find('.i-checks').on('ifChecked',function () {
	    	page.$objMobilePushTitle.parents('.form-group').removeClass('has-error');
	    });
	    iCheck.toggle.init("body");
	    
	//    //选择文章
	//    page.$articleSelect.click(function() {
	//        page.eventHandler.selectArticle();
	//    });
	    
	    //提交审核
	    $("#btnAudit").click(function() {
	        page.eventHandler.doSubmit(page.CONFIG.AUDIT_STATE);
	    });
	
	    //取消
	    $("#btnCancel").click(helper.win.close);
	});
});