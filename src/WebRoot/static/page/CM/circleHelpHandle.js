//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'iCheckPlus', 'toastr', 'helper.qiniu', 'module.editor', 'module.push', 'module.fileUpload', 'validator', 'module.inputSelector'], function (bs, $, helper, iCheck, toastr) {
    var module = {
        push: require('module.push'),
        editor: require('module.editor'),
        fileUpload: require('module.fileUpload'),
        inputSelector: require('module.inputSelector')
    };
    
//页面所用到配置
page.CONFIG = {
    GET_INFO_API: helper.url.getUrlByMapping("admin/circle/find_question_detail.shtml"),            //获取帮助接口
    ADD_API: helper.url.getUrlByMapping("admin/circle/audit_question.shtml"),                      //新增帮助接口
    CIRCLE_API: helper.url.getUrlByMapping("admin/circle/find_circle_list.shtml?status=1&state=1"),    //获取圈子列表
    EDIT_API: helper.url.getUrlByMapping("admin/circle/audit_question.shtml"),      //修改帮助接口
    AUDIT_API: helper.url.getUrlByMapping("admin/circle/audit_question.shtml"),      //帮助审核接口
    PASS_STATE: {state: 1, msg: "发布成功！"},              //审核通过状态值
    AUDIT_STATE: {state: 1, msg: "发布成功！"},             //提交审核状态值
    ADD_STATE: {state: 3, msg: "保存到草稿箱操作成功！"},               //保存草稿状态值
    DEFAULT_STATE: "add",                                                  //页面新增状态
    STATE_LIST: {"edit": {action: "edit", title: "编辑帮助"},
        "add": {action: "add", title: "新增帮助"},
        "audit": {action: "audit", title: "审核修改帮助"},
        "release": {action: "release", title: "已发布帮助修改"}
    },     //页面所有状态
    RELATION: "CMcircleHelpAll.shtml",                                        //关联的打开窗口
    UPLOAD_BUCKET: "image"  //存储图片的目录
};

//数据相关
page.action = helper.url.queryString("action") || page.CONFIG.DEFAULT_STATE;
page.stateInfo = page.CONFIG.STATE_LIST[page.action];
page.id = helper.url.queryString("id");
page.ref = decodeURIComponent(helper.url.queryString("ref")) || page.CONFIG.RELATION;
page.info = {data: {}, feedData: {}, mobileData: {}};

//常用的jquery对象
//page.$editor = $("#objEditer");
page.$uploader = $(".dropzone");
page.$form = $('#frmAddCiphertext');
page.$button = $("#divAction button");

//组件实例
page.feedPush = null;
page.mobilePush = null;
page.fileUpload = null;
page.circleSelector = null;
page.userSelector = null;
page.circle = {};
page.user = {};
page.editor = null;

//页面事件
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
                	console.log(res);
                    page.info = module.push.dataTransForm(res.data, res.pushdevice);
                    page.assist.initDataBind();
                    return;
                }

                toastr.error("待编辑的帮助不存在或发生错误!", "请稍候再重试或联系管理员！");
            },
            error: function () {
                toastr.error("待编辑的帮助不存在或发生错误!", "请稍候再重试或联系管理员！");
            }
        })
    },

    //表单验证并提交执行回调
    doSubmit: function (stateInfo) {
        var bv = page.$form.data('bootstrapValidator');
        //手动触发验证
        bv.validate();
        if(bv.isValid()){
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
        data.content = page.editor.getValue();
        data.image = page.fileUpload.getFiles().join(",");
        data.circle_nr_ids=page.circleSelector.getValue().key;
        data.circle_id=page.circleSelector.getValue().key;
        data.user_id=page.userSelector.getValue().key;
        
        data.id = page.id;
        data.state = state;
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
            validatorContainer: '#frmAddCiphertext'
        });

        //初始化信息流推送组件
        page.feedPush = new module.push.feed({
            container: "#objFeedPush",
            validatorContainer: '#frmAddCiphertext',
            readonly: page.assist.actionIsRelease(),
            defaultPush: {selected: 1, value: module.push.pushEnum.circle},
            formData: page.info.feedData
        });

        //初始化设备推送组件
        page.mobilePush = new module.push.mobile({
            container: "#objMobilePush",
            validatorContainer: '#frmAddCiphertext',
            readonly: page.assist.actionIsRelease(),
            range: {alluser: 2},
            formData: page.info.mobileData
        });
        
        if(!page.assist.actionIsAdd()){
            //编辑模式初始化表单内容
            var data = page.info.data;
            $("#txtTitle").val(data.title);
            $("#txtSummary").val(data.summary);
            page.editor.setValue(data.content);
            page.circle.key=data.circleList[0].id;
            page.circle.value=data.circleList[0].title;
            page.user.key=data.user_id;
            page.user.value=data.user_name;
            //调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
            //初始化圈子选择器
            page.circleSelector = new module.inputSelector({
              container: "#circleselect",
              validatorContainer: "#frmAddCiphertext",
              readonly: false,
              data:page.circle,
              type: "circle"
            });
            iCheck.toggle.init("body");
        }else{
            //初始化圈子选择器
            page.circleSelector = new module.inputSelector({
              container: "#circleselect",
              validatorContainer: "#frmAddCiphertext",
              readonly: false,
          //    data:circle,
              type: "circle"
            });
        }

        page.userSelector = new module.inputSelector({
            container: "#userselect",
            validatorContainer: "#frmAddCiphertext",
            readonly: false,
            data:page.user.value?page.user:"",
            type: "circle"
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
    initFlag: {QINIU: 0,EDIT: 0},

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
                        max: 50,
                        message: "标题不能超过50个字"
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

    //提交审核
    $("#btnAudit").click(function() {
        page.eventHandler.doSubmit(page.CONFIG.AUDIT_STATE);
    });

    //保存草稿
    $("#btnSave").click(function() {
        page.eventHandler.doSubmit(page.CONFIG.ADD_STATE);
    });

    //取消
    $("#btnCancel").click(helper.win.close);
});
});