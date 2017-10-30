//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'iCheckPlus', 'toastr', 'helper.qiniu', 'module.editor', 'module.push', 'module.fileUpload', 'validator', 'module.inputSelector'], function (bs, $, helper, iCheck, toastr) {
	
	var module = {
        push: require('module.push'),
        editor: require('module.editor'),
        fileUpload: require('module.fileUpload'),
        inputSelector: require('module.inputSelector')
    };
	
	//榜样人物信息
	page.user = {};
	//页面所用到AJAX请求的URL page.CONFIG.SELECT_URL
	page.CONFIG = {
	    GET_INFO_URL: helper.url.getUrlByMapping("admin/example/get_example_id.shtml"),                //获取榜样接口
	    ADD_URL: helper.url.getUrlByMapping("admin/example/insert_example.shtml"),                     //新增榜样接口
	    EDIT_URL: helper.url.getUrlByMapping("admin/example/update_example.shtml"),                    //修改榜样接口
	    AUDIT_URL: helper.url.getUrlByMapping('admin/example/audit_example.shtml'),                    //审核榜样接口
	    SELECT_URL: helper.url.getUrlByMapping("admin/backcommon/find_userlists.shtml"),               //获取榜样人物接口
	    USER_INFO: helper.url.getUrlByMapping("admin/userinfo.shtml"),                   //查看用户信息
	    PASS_STATE: {state: 1, msg: "审核通过操作成功！"},              //审核通过状态值
	    AUDIT_STATE: {state: 2, msg: "提交审核成功，请等待审核！"},             //提交审核状态值
	    ADD_STATE: {state: 3, msg: "保存到草稿箱操作成功！"},               //保存草稿状态值
	    DEFAULT_STATE: "add",                                                  //页面新增状态
	    STATE_LIST: {"edit": {action: "edit", title: "编辑榜样"},
	        "add": {action: "add", title: "新增榜样"},
	        "audit": {action: "audit", title: "审核修改榜样"},
	        "release": {action: "release", title: "已发布榜样修改"}
	    },     //页面所有状态
	    RELATION: {WAIT: 'examplelist.shtml?type=wait', PUBLISH: 'publishedciphertext.shtml', DRAFT:'examplelist.shtml?type=draft', DUSTBIN: 'examplelist.shtml?type=trash'},          //关联的打开窗口
	    UPLOAD_BUCKET: "image"  //存储密文图片的目录
	};

	//数据相关
	page.action = helper.url.queryString("action") || page.CONFIG.DEFAULT_STATE;
	page.id = helper.url.queryString("id");
	page.info = {data: {}, feedData: {}, mobileData: {}};
	page.stateInfo = page.CONFIG.STATE_LIST[page.action];
	page.ref = decodeURIComponent(helper.url.queryString("ref")) || page.CONFIG.RELATION.DRAFT;

	//常用的jquery对象
	page.$uploader = $(".dropzone");
	page.$form = $('#frmAddExample');
	page.$button = $("#divAction button");
	page.imgSrc = $('#fileSelectorSrc');
	page.$user_info = $('#user_info');
	page.$selectExampleUser = $('#selectExampleUser');
	page.$selectExampleUserInput = null;
	//组件实例
	page.feedPush = null;
	page.mobilePush = null;
	page.fileUpload = null;
	page.selectExample = null;
	page.editor = null;

	//页面事件page.eventHandler.showUser
	page.eventHandler = {
		showUser: function (id) {
			layer.open({
		        type: 2,
		        title: '查看用户信息',
		        skin: 'layui-layer-rim',
		        shadeClose: true,
		        scrollbar: false,
		        content: page.CONFIG.USER_INFO + '?id=' + id,
		        area: ['90%', '90%']
		    });
	    },
	    //初始化编辑模式下获取页面内容
	    initPageInfo: function () {
	        page.assist.initFlag.EDIT = 0;
	        
	        //新增/编辑/审核模式判断及设定
	        if(!page.CONFIG.STATE_LIST[page.action]) {
	            page.action = page.CONFIG.DEFAULT_STATE;
	            page.stateInfo = page.CONFIG.STATE_LIST[page.action];
	        }
	        document.title = page.stateInfo.title;
	        $("#pageSubTitle").html(page.stateInfo.title);
	        //新增模式下
	        console.log(page.assist.actionIsAdd());
	        if(page.assist.actionIsAdd()) {
	            page.assist.initDataBind();
	            return;
	        }

	        $.ajax({
	            url: page.CONFIG.GET_INFO_URL,
	            type: 'POST',
	            data: {id: page.id},
	            dataType: 'json',
	            success: function (res) {console.log(res);
	                if(res.code == 0){
	                    page.info = module.push.dataTransForm(res.data, res.pushdevice);
	                    page.assist.initDataBind();
	                    return;
	                }

	                toastr.error("待编辑的榜样不存在或发生错误!", "请稍候再重试或联系管理员！");
	            },
	            error: function () {
	                toastr.error("待编辑的榜样不存在或发生错误!", "请稍候再重试或联系管理员！");
	            }
	        })
	    },

	    //表单验证并提交执行回调
	    doSubmit: function (stateInfo) {
	    	var bv = page.$form.data('bootstrapValidator');
	        //手动触发验证bv.isValid()
	        bv.validate();
	        var flag = true;
	        if (!page.imgSrc.val()) {
	        	page.imgSrc.parents('.form-group').addClass('has-error');
	        	$('#filePrompt').show();
	        	flag = false;
	        }
	        if (!page.$selectExampleUserInput.val()){
	        	page.user = {};
	        }
	        if(bv.isValid() && flag){
	            var data = page.assist.getParams(stateInfo.state);
	            var url =  page.CONFIG.ADD_URL;
	            if(page.assist.actionIsRelease() || page.assist.actionIsAudit())
	                url = page.CONFIG.AUDIT_URL;
	            else if(page.assist.actionIsEdit())
	                url = page.CONFIG.EDIT_URL;

	            page.assist.submitStatus(1);
	            $.ajax({
	                url: url,
	                type : 'POST',
	                data: data,
	                dataType : 'json',
	                success : function(ret) {
	                    if(ret.code == 0){
	                        helper.win.changeQuoto({msg: "操作成功!", relation: page.ref});
	                    }else{
	                        toastr.error("操作失败!", ret.errMsg);
	                    }
	                },
	                error:function() {
	                    toastr.error("操作失败!", "请稍候再重试");
	                },
	                complete: function () {
	                	page.assist.submitStatus(0);
	                }
	            });
	            return;
	        }

	        //验证未通过
	        bv.getInvalidFields().focus();
	    },
	    
	    //表单验证并提交执行回调
	    doUpdate: function (stateInfo) {
	    	var bv = page.$form.data('bootstrapValidator');
	        //手动触发验证bv.isValid()
	        bv.validate();
	        var flag = true;
	        if (!page.imgSrc.val()) {
	        	page.imgSrc.parents('.form-group').addClass('has-error');
	        	$('#filePrompt').show();
	        	flag = false;
	        }
	        if (!page.$selectExampleUserInput.val()){
	        	page.user = {};
	        }
	        if(bv.isValid() && flag){
	            var data = page.assist.getParams(stateInfo.state);
                
	            var url =  page.CONFIG.EDIT_URL;
                if (page.assist.actionIsAdd()) url =  page.CONFIG.ADD_URL;
	            
	            page.assist.submitStatus(1);
	            $.ajax({
	                url: url,
	                type : 'POST',
	                data: data,
	                dataType : 'json',
	                success : function(ret) {
	                    if(ret.code == 0){
	                        helper.win.changeQuoto({msg: "操作成功!", relation: page.ref});
	                    }else{
	                        toastr.error("操作失败!", ret.errMsg);
	                    }
	                },
	                error:function() {
	                    toastr.error("操作失败!", "请稍候再重试");
	                },
	                complete: function () {
	                	page.assist.submitStatus(0);
	                }
	            });
	            return;
	        }

	        //验证未通过
	        bv.getInvalidFields().focus();
	    }
	};

	//页面辅助类/方法/属性
	page.assist = {
		//判断当前模式是否是新增模式
	    actionIsAdd: function () {
	        return !this.actionIsEdit() && !this.actionIsAudit() && !this.actionIsRelease();
	    },
	    //判断当前模式是否是编辑模式
	    actionIsEdit: function () {
	        return page.action == page.CONFIG.STATE_LIST.edit.action && page.id;
	    },
	    //判断当前模式是否是编辑审核模式
	    actionIsAudit: function () {
	        return page.action == page.CONFIG.STATE_LIST.audit.action && page.id;
	    },
	    //判断当前模式是否是已发布模式
	    actionIsRelease: function () {
	        return page.action == page.CONFIG.STATE_LIST.release.action && page.id;
	    },

	    //获取页面参数
	    getParams: function (state) {
	        var data = {};
	        
	        data.id = page.id;
	        data.image = page.imgSrc.val();
	        data.title = $('#txtTitle').val();
	        data.user_id = page.user.id ? page.user.id : 0;
	        data.user_type = page.user.type ? page.user.type : 0;
	        //data.user_image = page.user.image ? page.user.image : '';
	        data.user_avatar = page.user.image ? page.user.image : '';
	        data.user_name = page.user.name ? page.user.name : '';
	        data.user_identity = page.user.identity ? page.user.identity : '';
	        data.user_v = page.user.v ? page.user.v : '';
	        data.state = state;
	        data.summary = $("#txtSummary").val();
	        data.content = page.editor.getValue();
	        data.obj_type = 8;
	        
	        //获取推送组件中的数据
	        page.feedPush.getFormData(data);
	        page.mobilePush.getFormData(data);

	        return data;
	    },

	    //初始化数据绑定
	    initDataBind: function () {console.log(page.info);
	    	//初始化选择榜样人物
	        var example = {};
	        if (!!page.info.data.user_id) {
	    		example.key = page.info.data.user_id,
	    		example.value = page.info.data.user_name
	        }
	    	page.selectExample = new module.inputSelector({
	    		container: "#selectExampleUser",
	    		validatorContainer: "",
	    		readonly: false,
	    		type: "user",
	    		data: example.key ? example : '',
	    		callback: function (ret) {console.log(ret);
	    		    var result = ret.data;
	    		    page.user = {
	            			id: result.id,
	            			type: result.type || 0,
	            			image: result.image || '',
	            			avatar: result.avatar || '',
	            			name: result.name || '',
	            			identity: result.user_identity || '',
	            			v: result.user_v || ''
	            	  }
	    			//$('#selectExampleUserCon').addClass('has-success').removeClass('has-error');
	    		},
	    		unSelectCallback: function () {console.log('删除');
	    			page.user = {};
	    		}
	        });
	    	page.$selectExampleUserInput = page.$selectExampleUser.find('input[class="form-control"]');
	    	
	        //初始化富文本编辑器
	    	page.editor = new module.editor({
	            container: "#objEditer",
	            validatorContainer: '#frmAddExample'
	        });

	        //初始化信息流推送组件
	        page.feedPush = new module.push.feed({
	            container: "#objFeedPush",
	            validatorContainer: "#frmAddExample",
	            readonly: page.assist.actionIsRelease(),
	            defaultPush: {selected: 1, value: module.push.pushEnum.none},
	            formData: page.info.feedData
	        });

	        //初始化设备推送组件
	        page.mobilePush = new module.push.mobile({
	            container: "#objMobilePush",
	            validatorContainer: "#frmAddExample",
	            readonly: page.assist.actionIsRelease(),
	            range: {alluser: 2},
	            formData: page.info.mobileData
	        });

	        var images = [];
	        if(!page.assist.actionIsAdd()){
	            //编辑模式初始化表单内容
	            var data = page.info.data;console.log(data);
	            $('#txtTitle').val(data.title);
	            page.$user_info.attr('data-id', data.user_id).html(data.user_name);
	            page.user = {
	          			id: data.user_id,
	          			type: data.user_type || '',
	          			image: data.user_image || '',
	          			avatar: data.user_avatar || '',
	          			name: data.user_name || '',
	          			identity: data.identity_type || '',
	          			v: data.user_v || ''
	          	  };
	            console.log(page.user);
	            $("#txtSummary").val(data.summary);
	            page.editor.setValue(data.content);
	            
	            images = data.image ? data.image.split(",") : [];console.log(images[0]);
	            page.imgSrc.val(images[0]);
	            //调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
	            iCheck.toggle.init("body");
	        }
	        
	        //上传（图片）组件初始化
	        page.fileUpload = new module.fileUpload({
	            container: "#fileSelector",
	            existFiles: images && images instanceof Array ? images : [],
	            isUnique: true,
	            completeCallback: function (data) {
	            	page.imgSrc.val(data.url);
	            	page.imgSrc.parents('.form-group').removeClass('has-error');
	            	$('#filePrompt').hide();
	            },
	            deleteCallback: function () {
	            	page.imgSrc.val('');
	            	page.imgSrc.parents('.form-group').addClass('has-error');
	            	$('#filePrompt').show();
	            }
	        });
	        
	        page.assist.initFlag.EDIT = 1;
	        page.assist.initUpload();
	        page.assist.initComplete();
	    },
	    
	    //初始化七牛完成，编辑模式下加载数据完成，以上两者都完成后才初始化上传组件
	    initUpload: function () {
	        if(page.assist.initFlag.QINIU == 1 && page.assist.initFlag.EDIT == 1){
	            //上传（图片）组件初始化
	            var images = [];
	            if(page.info.data.image)
	                images = page.info.data.image.split(",");
	            page.fileUpload = new module.fileUpload({
	                container: "#fileSelector",
	                existFiles: images && images instanceof Array ? images : []
	            });
	        }
	    },
	    
	    //页面初始化完成状态，全部=1表示初始化完成
	    initFlag: {QINIU: 0, EDIT: 1},

	    //初始化全部完成后操作按钮才可用
	    initComplete: function () {
	        for(var k in this.initFlag){
	            //初始化未完成
	            if(!this.initFlag[k]) return;
	        }

	        page.$button.removeAttr("disabled");
	        toastr.clear();
	    },

	    //变更页面按钮的状态（根据页面状态）
	    setButtonShow: function () {
	        page.$button.each(function () {
	            if($(this).data("action").indexOf(page.action) == -1)
	                $(this).hide();
	            else
	                $(this).show();
	        });
	        $("#divAction button:visible").eq(0).removeClass("btn-warning").addClass("btn-primary");
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
	    
	    //初始化获取七牛存储token
	    var qiniu = new helper.qiniu.token(page.CONFIG.UPLOAD_BUCKET, function () {
	        page.assist.initFlag.QINIU = 1;
	        page.assist.initUpload();
	        page.assist.initComplete();
	    });
	    //当页面打开时每半个小时重新获取一次七牛token
	    setInterval(function(){
	        qiniu.getToken();
	    }, 30*60*1000);

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
	        	txtTitle: {/*键名和input name值对应*/
	                message: '标题验证不通过',
	                validators: {
	                    notEmpty: {/*非空提示*/
	                        message: '标题不能为空'
	                    },stringLength:{
	                        max: 100,
	                        message: "标题不能超过100个字"
	                    }
	                }
	            },
	            txtSummary:{
	                message: '摘要验证不通过',
	                validators: {
	                	stringLength:{
	                        max: 1000,
	                        message: "摘要不能超过1000个字"
	                    }
	                }
	            }
	        }
	    });
	    
	    //初始化页面渲染内容
	    page.eventHandler.initPageInfo();
	    
	    //page.$selectExampleUser = $('#selectExampleUser');
	    
	    console.log(page.$selectExampleUserInput);
	    //选择榜样人物
	    /*$('#select_user').on('click',function(){
	    	$('#selectExampleUser').removeClass('has-error');
	    	$('#exampleUserPrompt').html('').hide();
	    	new module.monoSelector({
	            type: 'user',
	            callback: function(data){
	            	  var result = data;
	            	  page.user = {
	            			id: result.id,
	            			type: result.type || '',
	            			image: result.image || '',
	            			avatar: result.avatar || '',
	            			name: result.name || '',
	            			identity: result.identity_type || '',
	            			v: result.user_v || ''
	            	  }
	            	  page.$user_info.attr('data-id', result.id).html(result.name);
	          
	            }
	        });
	    });*/
	    
	    //
	    page.$user_info.click(function () {
	    	var id = $(this).attr('data-id');
	    	if(id) page.eventHandler.showUser(id);
	    });
	    //调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
	    iCheck.toggle.init("body");

	    //初始化各种状态下的按钮
	    page.assist.setButtonShow();

	    //保存并审核通过
	    $("#btnPass").click(function() {
	        page.eventHandler.doSubmit(page.CONFIG.PASS_STATE);
	    });
	    
	    //修改
	    $("#btnUpdatePass").click(function() {
	        page.eventHandler.doUpdate(page.CONFIG.PASS_STATE);
	    });

	    //提交审核
	    $("#btnAudit").click(function() {
	        page.eventHandler.doUpdate(page.CONFIG.AUDIT_STATE);
	    });

	    //保存草稿
	    $("#btnSave").click(function() {
	        page.eventHandler.doSubmit(page.CONFIG.ADD_STATE);
	    });

	    //取消
	    $("#btnCancel").click(helper.win.close);
	    
	    //查看
	    $('#abc').click(function(){
	    	console.log(page.fileUpload.getFiles());
	    });
	});
});