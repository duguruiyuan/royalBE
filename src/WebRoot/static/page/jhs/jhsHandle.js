//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'iCheckPlus', 'toastr', 'helper.qiniu', 'module.editor', 'module.push', 'module.fileUpload', 'module.articleSelector', 'validator'], function (bs, $, helper, iCheck, toastr) {
    var module = {
        push: require('module.push'),
        editor: require('module.editor'),
        fileUpload: require('module.fileUpload'),
        articleSelector: require('module.articleSelector')
    };
  //页面所用到AJAX请求的URL
    page.CONFIG = {
        GET_INFO_URL: helper.url.getUrlByMapping("admin/article/get_article_id.shtml"),                //获取江湖事接口
        ADD_URL: helper.url.getUrlByMapping("admin/article/insert_article.shtml"),                     //新增江湖事接口
        EDIT_URL: helper.url.getUrlByMapping("admin/article/update_article_id.shtml"),                 //修改江湖事接口
        AUDIT_URL: helper.url.getUrlByMapping("admin/article/audit_article.shtml"),                 //审核江湖事接口 
        PASS_STATE: {state: 1, msg: "审核通过操作成功！"},              //审核通过状态值
        AUDIT_STATE: {state: 2, msg: "提交审核成功，请等待审核！"},             //提交审核状态值
        ADD_STATE: {state: 3, msg: "保存到草稿箱操作成功！"},               //保存草稿状态值
        DEFAULT_STATE: "add",                                                  //页面新增状态
        STATE_LIST: {"edit": {action: "edit", title: "编辑江湖事"},
            "add": {action: "add", title: "新增江湖事"},
            "audit": {action: "audit", title: "审核修改江湖事"},
            "release": {action: "release", title: "已发布江湖事修改"}
        },     //页面所有状态
        RELATION: {WAIT: 'jhslist.shtml?type=wait', PUBLISH: 'publishedjhs.shtml', DRAFT:'jhslist.shtml?type=draft', DUSTBIN: 'jhslist.shtml?type=trash'},                                        //关联的打开窗口
        UPLOAD_BUCKET: "image"  //存储密文图片的目录
    };

    //数据相关
    page.action = helper.url.queryString("action") || page.CONFIG.DEFAULT_STATE;
    page.id = helper.url.queryString("id");
    page.info = {data: {}, feedData: {}, mobileData: {}};
    page.stateInfo = page.CONFIG.STATE_LIST[page.action];
    page.ref = decodeURIComponent(helper.url.queryString("ref")) || page.CONFIG.RELATION.DRAFT;
    page.article = {};

    //常用的jquery对象
    page.$uploader = $(".dropzone");
    page.$form = $('#frmAddJhs');
    page.$button = $("#divAction button");
    page.$articleContainer = $('#articleContainer');
    page.$articlePrompt = $('#articlePrompt');

    //相关链接jquery对象
    page.$article = $('#btnArticle');
    page.$articleTitle = $('#articleTitle');
    page.article = {
    		//related_id: '',
    		related_obj_id: '',
    		related_obj_type: '',
    		related_title: ''
    }

    //组件实例
    page.feedPush = null;
    page.mobilePush = null;
    page.fileUpload = null;
    page.coverUpload = null;
    page.articleSelector = null;
    page.editor = null;

    //页面事件page.eventHandler.selectArticle()
    page.eventHandler = {
        //选择相关链接
    	/*selectArticle: function () {
    		var selector = new module.articleSelector({
    		    modalHead: '相关链接选择',
    		    pageSize:20,
    		    pageList:[10, 20, 50, 100],
    		    area:['90%', '90%'],
    		    callback: function (data) {
    		        //page.article.related_id = data.id;
    		        page.article.related_obj_id = data.obj_id;
    		        page.article.related_obj_type = data.obj_type;
    		        page.article.related_title = data.title;
    		    	page.$articleTitle.html(subStr(HTMLDecode(data.title), 100));
    		    }
    		});
    	},*/
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

                    toastr.error("待编辑的江湖事不存在或发生错误!", "请稍候再重试或联系管理员！");
                },
                error: function () {
                    toastr.error("待编辑的江湖事不存在或发生错误!", "请稍候再重试或联系管理员！");
                }
            })
        },

        //表单验证并提交执行回调
        doSubmit: function (stateInfo) {
        	//var flag = true;
        	/*if (!page.article.obj_id) {
        		page.$articleContainer.parent().addClass('has-error').removeClass('has-success');
        		page.$articlePrompt.removeClass('hidden');
        		flag = false;
        	}*/
            var bv = page.$form.data('bootstrapValidator');
            //手动触发验证
            bv.validate();
            if(bv.isValid()){
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
                        	/*switch (state){
                        	    case 1:
                        	    	helper.win.changeQuoto({msg: "操作成功!", relation: page.CONFIG.RELATION.PUBLISH});
                        	    	break;
                        	    case 2:
                        	    	helper.win.changeQuoto({msg: "操作成功!", relation: page.CONFIG.RELATION.WAIT});
                        	    	break;
                        	    case 3:
                        	    	helper.win.changeQuoto({msg: "操作成功!", relation: page.CONFIG.RELATION.DRAFT});
                        	    	break;
                        	    case 4:
                        	    	helper.win.changeQuoto({msg: "操作成功!", relation: page.CONFIG.RELATION.DRAFT});
                        	    	break;
                        	}*/
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
        
        //
        updateSubmit: function (stateInfo) {
        	/*var flag = true;
        	if (!page.article.obj_id) {
        		page.$articleContainer.parent().addClass('has-error').removeClass('has-success');
        		page.$articlePrompt.removeClass('hidden');
        		flag = false;
        	}*/
            var bv = page.$form.data('bootstrapValidator');
            //手动触发验证
            bv.validate();
            if(bv.isValid()){
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
                        	/*switch (state){
                        	    case 1:
                        	    	helper.win.changeQuoto({msg: "操作成功!", relation: page.CONFIG.RELATION.PUBLISH});
                        	    	break;
                        	    case 2:
                        	    	helper.win.changeQuoto({msg: "操作成功!", relation: page.CONFIG.RELATION.WAIT});
                        	    	break;
                        	    case 3:
                        	    	helper.win.changeQuoto({msg: "操作成功!", relation: page.CONFIG.RELATION.DRAFT});
                        	    	break;
                        	    case 4:
                        	    	helper.win.changeQuoto({msg: "操作成功!", relation: page.CONFIG.RELATION.DRAFT});
                        	    	break;
                        	}*/
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
            data.is_short = $("[name=radType]:checked").val();
            if(data.is_short == "0"){
                data.title = $("#txtTitle").val();
                data.summary = $("#txtSummary").val();
                data.content = page.editor.getValue();
                data.image = $('#coverSelectorSrc').val();
            }else {
                data.content = $("#txtShortTitle").val();
                data.title = data.content.substr(0, 100);
                data.summary = data.title;
                var objImaSelecter = $('#objImaSelecter');
            	var imageObjs = objImaSelecter.find('.file-preview-frame');
                data.image = page.assist.mosaicImage(imageObjs);;
            }
            data.status = 1;
            data.id = page.id;
            data.state = state;
            data.obj_type = 7;
            //data.article_id = page.article.related_id;
            //var articleData = page.articleSelector.getArticles()[0];
            data.related_obj_id = page.article.obj_id ? page.article.obj_id : '';
            data.related_obj_type = page.article.obj_type ? page.article.obj_type : '';
            data.related_title = page.article.article_title ? page.article.article_title : '';
            
            //获取推送组件中的数据
            page.feedPush.getFormData(data);
            page.mobilePush.getFormData(data);

            return data;
        },

        //初始化数据绑定
        initDataBind: function () {
            //初始化富文本编辑器
        	page.editor = new module.editor({
                container: "#objEditer",
                validatorContainer: "#frmAddJhs"
            });
            
            //初始化信息流推送组件
            page.feedPush = new module.push.feed({
                container: "#objFeedPush",
                validatorContainer: "#frmAddJhs",
                readonly: page.assist.actionIsRelease(),
                defaultPush: {selected: 1, value: module.push.pushEnum.none},
                formData: page.info.feedData
            });

            //初始化设备推送组件
            page.mobilePush = new module.push.mobile({
                container: "#objMobilePush",
                validatorContainer: "#frmAddJhs",
                readonly: page.assist.actionIsRelease(),
                range: {alluser: 2},
                formData: page.info.mobileData
            });

            var images = [];
            var relatelist = [];
            if(!page.assist.actionIsAdd()){
                //编辑模式初始化表单内容
                var data = page.info.data;
                if($("[name=radType]:checked").val() != data.is_short){
                    $("[name=radType]:checked").removeAttr("checked");
                    $("[name=radType][value=" + data.is_short + "]").attr("checked", "checked");
                }
                relatelist = data.relatelist || [];
                if(data.is_short == "0"){
                	images = data.image.trim() ? data.image.split(",") : [];
                    $("#txtTitle").val(data.title);
                    $("#txtSummary").val(data.summary);
                    page.editor.setValue(data.content);
                    //上传（图片）组件初始化
                    page.fileUpload = new module.fileUpload({
                        container: "#fileSelector",
                        existFiles: []
                    });
                    //封面
                    page.coverUpload = new module.fileUpload({
                        container: "#coverSelector",
                        existFiles: images && images instanceof Array ? images : [],
                        isUnique: true,
                        completeCallback: function (data) {
                        	console.log(data);
                        	$('#coverSelectorSrc').val(data.url);
                        },
                        deleteCallback: function () {
                        	$('#coverSelectorSrc').val(' ');
                        }
                    });
                    $('#coverSelectorSrc').val(images[0]);
                } else {
                    $("#txtShortTitle").val(data.content);
                    images = data.image.trim() ? data.image.split(",") : [];
                    //上传（图片）组件初始化
                    page.fileUpload = new module.fileUpload({
                        container: "#fileSelector",
                        existFiles: images && images instanceof Array ? images : []
                    });
                    //封面
                    page.coverUpload = new module.fileUpload({
                        container: "#coverSelector",
                        existFiles: [],
                        isUnique: true,
                        completeCallback: function (data) {
                        	$('#coverSelectorSrc').val(data.url);
                        },
                        deleteCallback: function () {
                        	$('#coverSelectorSrc').val(' ');
                        }
                    });
                }
                if (data.relatelist && data.relatelist.length == 1){
                	var related = data.relatelist[0];
        	        //page.article.related_obj_id = related.obj_id;
                    page.article.obj_id = related.obj_id;
          		    page.article.obj_type = related.obj_type;
          		    page.article.article_title = related.article_title;
        	        /*page.article.related_obj_type = related.type;
        	        page.article.related_title = related.obj_title;
        	        page.$articleTitle.html(subStr(HTMLDecode(related.obj_title), 100));*/
                }
                //调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
                iCheck.toggle.init("body");
            } else {
            	page.fileUpload = new module.fileUpload({
    	            container: "#fileSelector",
    	            existFiles: []
    	        });
    	        //封面
    	        page.coverUpload = new module.fileUpload({
    	            container: "#coverSelector",
    	            existFiles: [],
    	            isUnique: true,
    	            completeCallback: function (data) {
                    	$('#coverSelectorSrc').val(data.url);
                    },
                    deleteCallback: function () {
                    	$('#coverSelectorSrc').val(' ');
                    }
    	        });
            }
            //var articleData = page.assist.setArticle(data.relatelist);
            //文章选择组件初始化
            //var relatelist = data.relatelist || [];
            page.articleSelector = new module.articleSelector({
        	  container: "#articleContainer",
        	  validatorContainer: "",
        	  readonly: false,
        	  isUnique: true,
        	  hasExternal: false,
        	  articleList: page.assist.setArticle(relatelist),
        	  callback: function (data) {console.log(data);
        		  page.article.obj_id = data.obj_id;
        		  page.article.obj_type = data.obj_type;
        		  page.article.article_title = data.article_title;
          		  page.$articleContainer.find('.close').on("click", function () {
          			  page.article = {};
          		  });
        	  }
        	});
            
            page.$articleContainer.find('.close').on("click", function () {
        	    page.article = {};
            });

            page.assist.initFlag.EDIT = 1;
            //page.assist.initUpload();
            page.assist.initComplete();
        },
        
        setArticle: function (data) {
        	var arr = [];
        	for (var i= 0; i < data.length; i++) {
        		arr.push({
        			obj_id: data[i].obj_id, 
        			obj_type: data[i].obj_type, 
        			article_title: data[i].article_title,
        			show_title: data[i].article_title
        			});
        	}
        	return arr;
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
        },
        //获取短文图片路径
        mosaicImage: function (obj) {
    		var arr = [];
    		for (var i = 0; i < obj.length; i++) {
    			
    			arr.push(obj.eq(i).data('url') ? obj.eq(i).data('url') : obj.eq(i).find('img').attr('src'));
    		}
    		return arr.join(',');
    	}
    };

    //页面初始化
    $(document).ready(function(){
        toastr.info("初始化加载中，请稍候...");

        //初始化获取七牛存储token
        var qiniu = new helper.qiniu.token(page.CONFIG.UPLOAD_BUCKET, function () {
            page.assist.initFlag.QINIU = 1;
            //page.assist.initUpload();
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
                txtTitle: {/*键名username和input name值对应*/
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
                    message:'摘要验证不通过',
                    validators: {
                    	stringLength:{
                            max: 1000,
                            message: "摘要不能超过1000个字"
                        }
                    }
                },
                txtShortTitle: {
                    message:'正文验证不通过',
                    validators: {
                        notEmpty: {
                            message: '正文不能为空'
                        },stringLength:{
                            max: 1000,
                            message: "正文不能超过1000个字"
                        }
                    }
                }
            }
        });


        //初始化页面渲染内容
        page.eventHandler.initPageInfo();

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
            page.eventHandler.updateSubmit(page.CONFIG.PASS_STATE);
        });

        //提交审核
        $("#btnAudit").click(function() {
            page.eventHandler.updateSubmit(page.CONFIG.AUDIT_STATE);
        });

        //保存草稿
        $("#btnSave").click(function() {
            page.eventHandler.doSubmit(page.CONFIG.ADD_STATE);
        });

        //取消
        $("#btnCancel").click(helper.win.close);
        
        $('#ccc').click(function () {
        	console.log(page.articleSelector.getArticles());
        });
    });
});