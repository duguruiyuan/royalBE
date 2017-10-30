//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'iCheckPlus', 'toastr', 'datetimepicker', 'helper.qiniu', 'module.editor', 'module.otherPush', 'module.fileUpload', 'validator'], function (bs, $, helper, iCheck, toastr) {
    var module = {
        push: require('module.otherPush'),
        editor: require('module.editor'),
        fileUpload: require('module.fileUpload')
    };
    
  //页面所用到配置
    page.CONFIG = {
        GET_INFO_API: helper.url.getUrlByMapping("admin/morning/get_morning_id.shtml"),                //获取早茶接口
        ADD_API: helper.url.getUrlByMapping("admin/morning/insert_morning.shtml"),                     //新增早茶接口
        EDIT_API: helper.url.getUrlByMapping("admin/morning/update_morning_id.shtml"),                 //修改早茶接口
        AUDIT_API: helper.url.getUrlByMapping("admin/morning/audit_morning_id.shtml"),                //早茶审核接口
        PASS_STATE: {state: 1, msg: "审核通过操作成功！"},              //审核通过状态值
        AUDIT_STATE: {state: 2, msg: "提交审核成功，请等待审核！"},             //提交审核状态值
        ADD_STATE: {state: 3, msg: "保存到草稿箱操作成功！"},               //保存草稿状态值
        DEFAULT_STATE: "add",                                                  //页面新增状态
        STATE_LIST: {"edit": {action: "edit", title: "编辑早茶"},
            "add": {action: "add", title: "新增早茶"},
            "audit": {action: "audit", title: "审核修改早茶"},
            "release": {action: "release", title: "已发布早茶修改"}
        },     //页面所有状态
        RELATION: "paperlist.shtml?type=draft",                                        //关联的打开窗口
        UPLOAD_BUCKET: "image"  //存储图片的目录
    };

    //数据相关
    page.action = helper.url.queryString("action") || page.CONFIG.DEFAULT_STATE;
    page.stateInfo = page.CONFIG.STATE_LIST[page.action];
    page.id = helper.url.queryString("id");
    page.ref = decodeURIComponent(helper.url.queryString("ref")) || page.CONFIG.RELATION;
    page.info = {data: {}, feedData: {}, mobileData: {}};

    //常用的jquery对象
    page.$uploader = $(".dropzone");
    page.$form = $('#frmAddPaper');
    page.$button = $("#divAction button");
    page.$txtPeriods = $('#txtPeriods');

    //组件实例
    page.feedPush = null;
    page.mobilePush = null;
    page.fileUpload = null;
    page.editor = null;

    //页面事件
    page.eventHandler = {

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

                    toastr.error("待编辑的早茶不存在或发生错误!", "请稍候再重试或联系管理员！");
                },
                error: function () {
                    toastr.error("待编辑的早茶不存在或发生错误!", "请稍候再重试或联系管理员！");
                }
            })
        },

        //表单验证并提交执行回调
        doSubmit: function (stateInfo) {
            var bv = page.$form.data('bootstrapValidator');
            //手动触发验证
            bv.validate();
            var flag = true;
            if (page.$txtPeriods.val() == ''){
            	var _parent = page.$txtPeriods.parents('.form-group');
            	_parent.addClass('has-error');
            	$('#periodsPrompt').removeClass('hidden');
            	flag = false;
            }
            if(bv.isValid() && flag){
            	page.assist.submitStatus(1);
                var data = page.assist.getParams(stateInfo.state);
                var url =  page.CONFIG.ADD_API;
                if(page.assist.actionIsRelease() || page.assist.actionIsAudit())
                    url = page.CONFIG.AUDIT_API;
                else if(page.assist.actionIsEdit())
                    url = page.CONFIG.EDIT_API;

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
        doUpdate: function (stateInfo) {
            var bv = page.$form.data('bootstrapValidator');
            //手动触发验证
            bv.validate();
            var flag = true;
            if (page.$txtPeriods.val() == ''){
            	var _parent = page.$txtPeriods.parents('.form-group');
            	_parent.addClass('has-error');
            	$('#periodsPrompt').removeClass('hidden');
            	flag = false;
            }
            if(bv.isValid() && flag){
            	page.assist.submitStatus(1);
                var data = page.assist.getParams(stateInfo.state);
                
                var url =  page.CONFIG.EDIT_API;
                if (page.assist.actionIsAdd()) url =  page.CONFIG.ADD_API;
                
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
            data.title = $("#txtTitle").val();
            data.periods = helper.convert.formatTimestamp($('#txtPeriods').val());
            data.summary = $("#txtSummary").val();
            data.content = page.editor.getValue();
            data.id = page.id;
            data.state = state;

            //获取推送组件中的数据
            page.feedPush.getFormData(data);
            page.mobilePush.getFormData(data);

            return data;
        },

        //初始化数据绑定
        initDataBind: function () {console.log(page.info);
            //初始化富文本编辑器
    	    page.editor = new module.editor({
    	        container: "#objEditer",
    	        color: '#FFFFFF',
    	        //value: page.info.data.content,
    	        validatorContainer: '#frmAddPaper'
    	    });

    	    //初始化信息流推送组件
            page.feedPush = new module.push.feed({
                container: "#objFeedPush",
                validatorContainer: "",
                readonly: page.assist.actionIsRelease(),
                defaultPush: {selected: 1, value: module.push.pushEnum.all},
                formData: page.info.feedData
            });

            //初始化设备推送组件
            page.mobilePush = new module.push.mobile({
                container: "#objMobilePush",
                validatorContainer: "#frmAddPaper",
                readonly: page.assist.actionIsRelease(),
                range: {alluser: 2},
                formData: page.info.mobileData
            });

            var images = [];
            if(!page.assist.actionIsAdd()){
                //编辑模式初始化表单内容
                var data = page.info.data;
                $("#txtTitle").val(data.title);
                $("#txtPeriods").val(helper.convert.formatDate(data.periods, 'yyyy-MM-dd'));
                $("#txtSummary").val(data.summary);
                page.editor.setValue(data.content);

                //调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
                iCheck.toggle.init("body");
            }

            //上传（图片）组件初始化
            page.fileUpload = new module.fileUpload({
                container: "#fileSelector",
                existFiles: images && images instanceof Array ? images : []
            });

            page.assist.initFlag.EDIT = 1;
            page.assist.initComplete();
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
            page.assist.initComplete();
        });
        //当页面打开时每半个小时重新获取一次七牛token
        setInterval(function(){
            qiniu.getToken();
        }, 30*60*1000);

        //验证初始化
        page.$form.bootstrapValidator({
            //指定不验证的情况
            //excluded: [':disabled', ':hidden', ':not(:visible)'],
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
        
        //初始化日期控件
        page.$txtPeriods.datetimepicker({
            format: 'yyyy-mm-dd',
            weekStart: 1,
            todayBtn: true,
            autoclose: true,
            todayHighlight: true,
            startView: 2,
            minView: 2,
            forceParse: true
        }).on('change',function () {
        	var _parent = $(this).parents('.form-group');
        	_parent.removeClass('has-error').addClass('has-success');
        	_parent.find('small').hide();
        	_parent.find('.form-control-feedback').hide();
        	$('#periodsPrompt').addClass('hidden');
        });

        //保存并审核通过
        $("#btnPass").click(function() {
            page.eventHandler.doSubmit(page.CONFIG.PASS_STATE);
        });
        //修改
        $('#btnUpdatePass').click(function () {
        	page.eventHandler.doUpdate(page.CONFIG.PASS_STATE);
        });

        //提交审核
        $("#btnAudit").click(function() {
        	console.log($(this).attr('disabled'));
            page.eventHandler.doUpdate(page.CONFIG.AUDIT_STATE);
        });

        //保存草稿
        $("#btnSave").click(function() {
            page.eventHandler.doSubmit(page.CONFIG.ADD_STATE);
        });

        //取消
        $("#btnCancel").click(helper.win.close);
    });
});