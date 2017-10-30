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
        GET_THEMES_API: helper.url.getUrlByMapping(""),     //获取文章接口
        GET_INFO_API: helper.url.getUrlByMapping("admin/hotspots/get_hotspots_id.shtml"),                //获取专题接口
        ADD_API: helper.url.getUrlByMapping("admin/hotspots/insert_hotspots.shtml"),                     //新增专题接口
        EDIT_API: helper.url.getUrlByMapping("admin/hotspots/update_hotspots_id.shtml"),      //修改专题接口
        AUDIT_API: helper.url.getUrlByMapping("admin/hotspots/audit_hotspots_id.shtml"),           //专题审核接口
        PASS_STATE: {state: 1, msg: "审核通过操作成功！"},              //审核通过状态值
        AUDIT_STATE: {state: 2, msg: "提交审核成功，请等待审核！"},             //提交审核状态值
        ADD_STATE: {state: 3, msg: "保存到草稿箱操作成功！"},               //保存草稿状态值
        DEFAULT_STATE: "add",                                                  //页面新增状态
        STATE_LIST: {"edit": {action: "edit", title: "编辑专题"},
            "add": {action: "add", title: "新增专题"},
            "audit": {action: "audit", title: "审核修改专题"},
            "release": {action: "release", title: "已发布专题修改"}
        },     //页面所有状态
        RELATION: "hotspotlist.shtml?type=draft",                                        //关联的打开窗口
        UPLOAD_BUCKET: "image"  //存储图片的目录
    };

    //页面本地变量数据
    page.MOCK = {
        tableUniId:0,//本地数据记录项
        SelectedArts:[],   //已选关联文章数据
    };
    page.hostpotLink = [];

    //数据相关
    page.action = helper.url.queryString("action") || page.CONFIG.DEFAULT_STATE;
    page.stateInfo = page.CONFIG.STATE_LIST[page.action];
    page.id = helper.url.queryString("id");
    page.ref = decodeURIComponent(helper.url.queryString("ref")) || page.CONFIG.RELATION;
    page.info = {data: {}, feedData: {}, mobileData: {}};

    //常用的jquery对象
    page.$uploader = $(".dropzone");
    page.$form = $('#frmAddhotspot');
    page.$button = $("#divAction button");
    page.$txtSummary = $('#txtSummary');

    //组件实例
    page.feedPush = null;
    page.mobilePush = null;
    page.fileUpload = null;
    page.hotspotLinkSelector = null;

    //专题链接
    page.$relationArtTable = $('#relationArtTable');
    page.addRelatedArtsModal = null;

    //页面事件page.eventHandler.initValidator
    page.eventHandler = {

        //初始化编辑模式下获取页面内容
        initPageInfo: function () {
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
                url: page.CONFIG.GET_INFO_API,
                type: 'POST',
                data: {id: page.id},
                dataType: 'json',
                success: function (res) {
                    if(res.code == 0){
                        page.info = module.push.dataTransForm(res.data, res.pushdevice);
                        page.assist.initDataBind();
                        return;
                    }

                    toastr.error("待编辑的专题不存在或发生错误!", "请稍候再重试或联系管理员！");
                },
                error: function () {
                    toastr.error("待编辑的专题不存在或发生错误!", "请稍候再重试或联系管理员！");
                }
            })
        },

        //表单验证并提交执行回调
        doSubmit: function (stateInfo) {
        	var flag = true;
            var bv = page.$form.data('bootstrapValidator');
            //手动触发验证
            bv.validate();
            if (page.hotspotLinkSelector.getArticles().length == 0) {
            	$('#hotspotLink').addClass('has-error').removeClass('has-success');
            	$('#hotspotLinkPrompt').removeClass('hidden');
            	flag = false;
            }
            if(bv.isValid() && flag){
                var data = page.assist.getParams(stateInfo.state);
                var url =  page.CONFIG.ADD_API;
                if(page.assist.actionIsRelease() || page.assist.actionIsAudit())
                    url = page.CONFIG.AUDIT_API;
                else if(page.assist.actionIsEdit())
                    url = page.CONFIG.EDIT_API;
                page.assist.submitStatus(1);
                $.ajax({
                    url: url,
                    type : 'POST',
                    data: data,
                    dataType : 'json',
                    success : function(ret) {
                        if(ret.code == 0){
                            helper.win.changeQuoto({msg: stateInfo.msg, relation: page.ref});
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
        //修改
        updateSubmit: function (stateInfo) {
        	var flag = true;
            var bv = page.$form.data('bootstrapValidator');
            //手动触发验证
            bv.validate();
            if (page.hotspotLinkSelector.getArticles().length == 0) {
            	$('#hotspotLink').addClass('has-error').removeClass('has-success');
            	$('#hotspotLinkPrompt').removeClass('hidden');
            	flag = false;
            }
            if(bv.isValid() && flag){
                var data = page.assist.getParams(stateInfo.state);
                var url =  page.CONFIG.EDIT_API;
                if (page.assist.actionIsAdd()) url =  page.CONFIG.ADD_API;
                page.assist.submitStatus(1);
                $.ajax({
                    url: url,
                    type : 'POST',
                    data: data,
                    dataType : 'json',
                    success : function(ret) {
                        if(ret.code == 0){
                            helper.win.changeQuoto({msg: stateInfo.msg, relation: page.ref});
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
            data.title = $('#txtTitle').val();
            data.summary = page.$txtSummary.val();
            data.related = JSON.stringify(page.hotspotLinkSelector.getArticles());
            data.id = page.id;
            data.state = state;
            data.status = 1;
            
            //获取推送组件中的数据
            page.feedPush.getFormData(data);
            page.mobilePush.getFormData(data);

            return data;
        },
        
        getRelatelist: function (data){
        	console.log(data);
        	var obj = [];
        	for (var i = 0; i < data.length; i++) {
        		if (data[i].url){
        			obj.push({
        				id: data[i].article_id,
        				title: data[i].article_title,
        				url: data[i].url
        			});
        		}else{
        			obj.push({
            			id: data[i].article_id,
            			title: data[i].article_title,
            			create_type: data[i].article_type,
            			create_time:　data[i].create_time,
            			//data[i].hotspot_id,
            			//data[i].id,
            			state: 1,
            			obj_id: data[i].obj_id,
            			obj_type: data[i].obj_type,
            			url: data[i].url
            		});
        		}
        	}
        	return obj;
        },
        
        //初始化数据绑定
        initDataBind: function () {

            //初始化信息流推送组件
            page.feedPush = new module.push.feed({
                container: "#objFeedPush",
                validatorContainer: '#frmAddhotspot',
                readonly: page.assist.actionIsRelease(),
                defaultPush: {selected: 1, value: module.push.pushEnum.none},
                formData: page.info.feedData
            });

            //初始化设备推送组件
            page.mobilePush = new module.push.mobile({
                container: "#objMobilePush",
                validatorContainer: '#frmAddhotspot',
                readonly: page.assist.actionIsRelease(),
                range: {alluser: 2},
                formData: page.info.mobileData
            });

            if(!page.assist.actionIsAdd()){
                //编辑模式初始化表单内容
                var data = page.info.data;
                $("#txtTitle").val(data.title);
                page.$txtSummary.val(data.summary);
                page.hostpotLink = page.assist.getRelatelist(data.relatelist);
                //page.$relationArtTable.bootstrapTable('append', page.hostpotLink);
                //调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
                iCheck.toggle.init("body");
            }

            page.hotspotLinkSelector = new module.articleSelector({
        	  container: "#hotspotLinkContainer",
        	  validatorContainer: "#frmAddhotspot",
        	  readonly: false,
        	  isUnique: false,
        	  hasExternal: true,
        	  articleList: page.assist.setArticle(page.info.data.relatelist),
        	  callback: function (data) {
        		  console.log(data);
        		  $('#hotspotLink').removeClass('has-error').addClass('has-success');
              	  $('#hotspotLinkPrompt').addClass('hidden');
        	  }
        	});
            
            page.assist.initFlag.EDIT = 1;
            page.assist.initUpload();
            page.assist.initComplete();
        },
        
        setArticle: function (data) {
        	var arr = [];
        	if (!data) return arr;
        	for (var i= 0; i < data.length; i++) {
        		arr.push({
        			obj_id: data[i].obj_id, 
        			obj_type: data[i].obj_type, 
        			article_title: data[i].article_title,
        			show_title: data[i].show_title,
        			url: data[i].url
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
        //获取页面外部文章表格数据
        getOutArtForm: function () {
            page.MOCK.tableUniId--;
            return {
                id: page.MOCK.tableUniId,
                title: $('#outArtTitle').val(),
                url: $('#outArtLink').val()

            }
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
        
        //保存并审核通过
        $("#btnUpdatePass").click(function() {
            page.eventHandler.updateSubmit(page.CONFIG.PASS_STATE);
        });

        //提交审核
        $("#btnAudit").click(function() {
        	page.eventHandler.updateSubmit(page.CONFIG.AUDIT_STATE);
            //page.eventHandler.doSubmit(page.CONFIG.AUDIT_STATE);
        });

        //保存草稿
        $("#btnSave").click(function() {
            page.eventHandler.doSubmit(page.CONFIG.ADD_STATE);
        });

        //取消
        $("#btnCancel").click(helper.win.close);
    });
});