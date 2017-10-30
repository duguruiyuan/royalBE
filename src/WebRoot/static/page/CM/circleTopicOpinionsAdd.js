//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'iCheckPlus', 'toastr', 'helper.qiniu', 'module.editor', 'module.push', 'module.fileUpload', 'module.articleSelector', 'module.inputSelector', 'validator'], function (bs, $, helper, swal, iCheck, toastr) {
    var module = {
        fileUpload: require('module.fileUpload'),
        articleSelector: require('module.articleSelector'),
        inputSelector: require('module.inputSelector')
    };
    //
	page.topic_id = helper.url.queryString("page_id");
    page.voice = {length: ''};
    //页面所用到AJAX请求的URL
    page.ajaxUrl = {
        TOPIC_DETAIL: helper.url.getUrlByMapping("admin/topic/find_topic_detail.shtml?"),                  //话题详情接口
        USER: helper.url.getUrlByMapping("admin/backcommon/find_userlists.shtml"),                         //大咖列表接口
        INSERT: helper.url.getUrlByMapping("admin/topic/insert_topic_guest_opinion.shtml"),                //新增观点接口
        USER_INFO: helper.url.getUrlByMapping("admin/userinfo.shtml"),                   				   //查看用户信息
        RELATION: "CMcircleTopicOpinionsAll.shtml?page_id="+page.topic_id                                  //关联的打开窗口
    }

    //新增信息初始化
    page.info = {
    		guest_id: '',//嘉宾id
    		content: '',//观点内容
    		is_voice: '',//是否语音
    		voice: '',//语音url
    		voice_size: ''//语音长度
    };

    //数据相关
    page.ref = decodeURIComponent(helper.url.queryString("ref")) || page.ajaxUrl.RELATION;

    //上传组件
    page.uploadVoice = null;
    page.articleSelector = null;
    //表单按钮
    page.$radioBtns = $('.i-checks');
    //文章显示节点
    page.$chamberInfo = $('#chamber_info');
    //用户显示节点
    page.$userInfo = $('#user_info');
    //内容节点
    page.$content = $('#content');
    //确定按钮
    page.$submit = $('#comment-success');

    page.$typVoice = $('#typVoice');
    page.$typVoicePrompt = $('#typVoicePrompt');
    page.$typVoicePrompt1 = $('#typVoicePrompt1');
    page.$button = $("#divAction button");

    //验证
    page.$form = $('#frmAddComment');
    page.$form.bootstrapValidator({
    	fields: {/*键名username和input name值对应*/
    		guestUser: {
        		message:'用户验证不通过',
                validators: {
                	notEmpty: {
                        message: '请选择用户'
                    }
                }
        	}
        	/*content: {
                message: '观点内容验证不通过',
                validators: {
                    
                }
            }*/
    	}
    });

    //页面事件page.eventHandler.uploadVoice
    page.eventHandler = {
    	//初始化时获取页面内容
    	initPageInfo: function () {
    		$.ajax({
                url: page.ajaxUrl.TOPIC_DETAIL,
                async :false,
                type: 'POST',
                data: {id: page.topic_id},
                dataType: 'json',
                success: function (res) {
                    if(res.code == 0){
//                    	$("#topictitle").html(res.data.title);
                    	var articleList = [];
                    	var article1 = {};
                    	article1.obj_id=page.topic_id;
                    	article1.obj_type=5;
                    	article1.show_title=res.data.title;
                    	article1.article_title=res.data.title;
                    	article1.display_order=0;
                    	articleList.push(article1);
//                    	console.log(articleList);
                        page.articleSelector = new module.articleSelector({
                    	  container: "#linkContainer",
                    	  validatorContainer: "",
                    	  readonly: true,
                    	  isUnique: true,
                    	  articleList: articleList,
                    	  callback: function (data) {
                    	  }
                    	});
                        
                    	var gusetlist = res.data.guest;
                    	var arr = [];
//                    	console.log(gusetlist);
                    	arr.push('<option value="">请选择</option>');
                        for(var i = 0; i < gusetlist.length; i++){
                            arr.push('<option value="' + gusetlist[i].id + '">' + gusetlist[i].user_name + '</option>');
                        }
                        $('#guestUser').html(arr.join(''));
                        return;
                    }

                    toastr.error("话题不存在或发生错误!", "请稍候再重试或联系管理员！");
                },
                error: function () {
                    toastr.error("话题不存在或发生错误!", "请稍候再重试或联系管理员！");
                }
            })
    	},
    	showUser: function (id) {
    		layer.open({
    	        type: 2,
    	        title: '查看用户信息',
    	        skin: 'layui-layer-rim',
    	        shadeClose: true,
    	        scrollbar: false,
    	        content: page.ajaxUrl.USER_INFO + '?id=' + id,
    	        area: ['90%', '90%']
    	    });
        },
        
    	//上传组件
    	uploadVoice: function () {
    		page.uploadVoice = new module.fileUpload({
    			  container: "#fileSelector",
    			  fileType: "media",
    			  bucket: "media",
    			  existFiles: [],
    			  isUnique: true,
    			  completeCallback: function (data) {
    				  if(data.duration>60){
        				  page.voice.length = '';
        				  page.$typVoice.addClass('has-error').removeClass('has-success');
        				  page.$typVoicePrompt1.show();
    				  }else{
        				  page.voice.length = data.duration;
        				  page.$typVoice.addClass('has-success').removeClass('has-error');
        				  page.$typVoicePrompt.hide();
        				  page.$typVoicePrompt1.hide();
    				  }
    			  },
    			  deleteCallback: function () {
    				  page.voice.length = '';
    				  page.$typVoice.addClass('has-error').removeClass('has-success');
    				  page.$typVoicePrompt.show();
    			  }
    		});
    	},
    	
        //新增观点
        insertComment: function () {
        	swal({
                title: "您确定要新增这条信息吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText:'取消',
                closeOnConfirm: false
            }, function () {
                swal({title: "写入观点中，请稍候", type: "info", showConfirmButton: false});
//        		guest_id: '',//嘉宾id
//        		content: '',//观点内容
//        		is_voice: '',//是否语音
//        		voice: '',//语音url
//        		voice_size: ''//语音长度
                page.info.guest_id = $('#guestUser').val();
                page.info.content = page.$content.val();
                page.info.is_voice = page.type;
                page.info.voice = page.uploadVoice.getFiles()[0]?page.uploadVoice.getFiles()[0]:'';
                page.info.voice_size = page.voice.length;
//                console.log(page.info);
//                return;
                $.ajax({
                    url: page.ajaxUrl.INSERT,
                    type : 'POST',
                    data: page.info,
                    dataType : 'json',
                    success : function(ret) {
                        if(ret.code == 0){
                            //swal({title:"新增观点成功", text: "1s后自动消失...", type: "success", timer: 1000});
                        	helper.win.changeQuoto({msg: "操作成功!", relation: page.ref});
                        }else{
                            swal("新增观点失败", ret.errMsg, "error");
                        }
                    },
                    error:function(ret) {
                        swal("新增观点失败", "error");
                    },
                    complete: function () {
                    	page.assist.submitStatus(false);
                    }
                });
            });
        }
    };
    
    //页面辅助类/方法/属性
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
    };

    //提交
    page.$submit.on('click',function(){
    	var flag = true;
//    	if (!page.$selectUserInput.val().trim()) {
//    		page.$selectUser.parent().addClass('has-error').removeClass('has-success');
//        	flag = false;
//    	}
    	
    	if (page.type == 1 && !page.voice.length) {
    		page.$typVoice.addClass('has-error').removeClass('has-success');
    		page.$typVoicePrompt.show();
    		flag = false;
    	}
    	if (page.type == 0 && !page.$content.val().trim()) {
    		page.$content.parents('.form-group').addClass('has-error').removeClass('has-success');
    		page.$content.next().show();
    		flag = false;
    	}
    	var bv = page.$form.data('bootstrapValidator');
    	//手动触发验证
        bv.validate();
        if (bv.isValid() && flag){
        	page.assist.submitStatus(true);
        	page.eventHandler.insertComment();
        }
    });
    
    //初始化页面渲染内容
    page.eventHandler.initPageInfo();
    
    //初始化上传组件
    page.eventHandler.uploadVoice();

    //调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
    iCheck.toggle.init("body");

    //绑定单选按钮事件
    page.type = 0;
    page.$radioBtns.on('ifChecked',function(event){
    	var _val = $(this).attr('data-value');
    	page.type = _val;
    	if(_val == 0){
    		$('#type-title').html('观点内容');
    		page.$typVoice.removeClass('has-error');
    		page.$typVoicePrompt.hide();
    	}else if(_val == 1){
    		$('#type-title').html('翻译内容');
    		page.$content.parents('.form-group').removeClass('has-error');
    		page.$content.next().hide();
    	}
    });
    //取消
    $("#btnCancel").click(helper.win.close);
});