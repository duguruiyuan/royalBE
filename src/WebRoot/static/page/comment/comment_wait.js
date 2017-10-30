//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'iCheckPlus', 'toastr', 'helper.qiniu', 'module.editor', 'module.push', 'module.fileUpload', 'module.articleSelector', 'module.inputSelector', 'validator'], function (bs, $, helper, swal, iCheck, toastr) {
    var module = {
        fileUpload: require('module.fileUpload'),
        articleSelector: require('module.articleSelector'),
        inputSelector: require('module.inputSelector')
    };
    //
    page.voice = {length: ''};
    page.article = {};
    //页面所用到AJAX请求的URL
    page.ajaxUrl = {
    	ARTICLE: helper.url.getUrlByMapping("admin/common/find_comment.shtml?status=1"),                   //文章列表接口
        USER: helper.url.getUrlByMapping("admin/backcommon/find_userlists.shtml"),                        //用户列表接口
        INSERT: helper.url.getUrlByMapping("admin/common/insert_comment.shtml"),                           //新增评论接口
        USER_INFO: helper.url.getUrlByMapping("admin/userinfo.shtml"),                   //查看用户信息
        RELATION: "commentindex.shtml"                                        //关联的打开窗口
    }

    //新增信息初始化
    page.info = {
    		obj_id: '',
    		obj_type: '',
    		title: '',
    		user_id: '',
    		user_avatar: '',
    		user_name: '',
    		user_identity: '',
    		user_v: '',
    		weight: '',
    };

    //数据相关
    //page.ref = decodeURIComponent(helper.url.queryString("ref")) || page.ajaxUrl.RELATION;

    //上传组件
    page.uploadVoice = null;
    //文章
    page.commentArticle = null;
    //用户
    page.commentUser = null;
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
    //文章
    page.$selectText = $('#selectText');
    page.$textPrompt = $('#textPrompt');

    page.$selectUser = $('#selectUser');
    page.$selectUserInput = null;
    page.$selectUserPrompt = $("#selectUserPrompt");

    page.$typVoice = $('#typVoice');
    page.$typVoicePrompt = $('#typVoicePrompt');
    page.$typVoicePrompt1 = $('#typVoicePrompt1');
    page.$button = $("#divAction button");

    //验证
    page.$form = $('#frmAddComment');
    page.$form.bootstrapValidator({
    	fields: {/*键名username和input name值对应*/
        	/*file: {
        		message:'头像验证不通过',
                validators: {
                	notEmpty: {
                        message: '头像必须上传'
                    }
                }
        	},*/
        	/*content: {
                message: '评论内容验证不通过',
                validators: {
                    
                }
            }*/
    	}
    });

    //页面事件page.eventHandler.uploadVoice
    page.eventHandler = {
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
    	
        //新增评论
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
                swal({title: "写入评论中，请稍候", type: "info", showConfirmButton: false});
                $.ajax({
                    url: page.ajaxUrl.INSERT,
                    type : 'POST',
                    data: {
                    	user_id: page.info.user_id,
          			    user_avatar: page.info.user_avatar,
          			    user_name: page.info.user_name,
          			    user_identity: page.info.user_identity,
          			    user_v: page.info.user_v,
          			    weight: page.info.weight,
          			    is_voice: page.type,
          			    obj_id: page.article.id,
          			    obj_type: page.article.type,
          			    voice_size: page.voice.length,
          			    voice: page.uploadVoice.getFiles()[0],
          			    title: page.article.title,
          			    content: page.$content.val()
                    },
                    dataType : 'json',
                    success : function(ret) {
                        if(ret.code == 0){
                            //swal({title:"新增评论成功", text: "1s后自动消失...", type: "success", timer: 1000});
                        	helper.win.changeQuoto({msg: "操作成功!", relation: page.ajaxUrl.RELATION});
                        }else{
                            swal("新增评论失败", ret.errMsg, "error");
                        }
                    },
                    error:function(ret) {
                        swal("新增评论失败", "error");
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
    	if (!page.article.id) {
    		page.$selectText.addClass('has-error').removeClass('has-success');
    	    page.$textPrompt.show();
        	flag = false;
    	}
    	
    	if (!page.$selectUserInput.val().trim()) {
    		page.$selectUser.parent().addClass('has-error').removeClass('has-success');
        	flag = false;
    	}
    	
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

    //初始化上传组件
    page.eventHandler.uploadVoice();

    //选择文章
    page.commentArticle = new module.articleSelector({
    	  container: "#selectCommentArticle",
    	  validatorContainer: "",
    	  readonly: false,
    	  isUnique: true,
    	  hasExternal: false,
    	  articleList: [],
    	  callback: function (data) {
    		  //page.info.obj_id = data.obj_id;
    		  //page.info.obj_type = data.obj_type;
    		  //console.info(data);
    		  //page.info.title = data.article_title;
    		  page.article.id = data.obj_id;
    		  page.article.type = data.obj_type;
    		  page.article.title = data.article_title;
    		  page.$selectText.removeClass('has-error').addClass('has-success');
    	      page.$textPrompt.hide();
    	      page.$selectText.find('.close').on("click", function () {
      			  page.article = {};
      			  page.$selectText.addClass('has-error').removeClass('has-success');
      			  page.$textPrompt.show();
      		  });
    	  }
    });

    //用户选择
    page.commentUser = new module.inputSelector({
      container: "#selectUser",
      validatorContainer: "#frmAddComment",
      readonly: false,
      type: "user",
      callback: function (ret) {console.log(ret);
    	  var result = ret.data;
    	  page.info.user_id = result.id;
      	  page.info.user_avatar = result.avatar || '';
      	  page.info.user_name = result.name || '';
      	  page.info.user_identity = result.identity || '';
      	  page.info.user_v = result.user_v || '0';
      	  page.info.weight = result.weight || '0';
      	  page.$selectUser.parent().addClass('has-success').removeClass('has-error');
      },
      unSelectCallback: function () {
    	  page.info = {};
    	  page.$selectUser.parent().removeClass('has-success').addClass('has-error');
      }
    });
    page.$selectUserInput = page.$selectUser.find('input');

    //调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
    iCheck.toggle.init("body");

    //绑定单选按钮事件
    page.type = 0;
    page.$radioBtns.on('ifChecked',function(event){
    	var _val = $(this).attr('data-value');
    	page.type = _val;
    	if(_val == 0){
    		$('#type-title').html('评论内容');
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