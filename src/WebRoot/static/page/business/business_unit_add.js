//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'iCheckPlus', 'toastr', 'helper.qiniu', 'module.editor', 'module.push', 'module.fileUpload', 'validator'], function (bs, $, helper, iCheck, toastr) {
    var module = {
        push: require('module.push'),
        editor: require('module.editor'),
        fileUpload: require('module.fileUpload')
    };
//页面所用到配置
page.CONFIG = {
    GET_INFO_API: helper.url.getUrlByMapping("admin/business/get_business_unit_id.shtml"),              //获取招商单位接口
    ADD_API: helper.url.getUrlByMapping("admin/business/insert_business_unit_id.shtml"),                //新增招商单位接口
    EDIT_API: helper.url.getUrlByMapping("admin/business/update_business_unit_id.shtml"),      			//修改招商单位接口
    PASS_STATE: {state: 1, msg: "审核通过操作成功！"},              		//审核通过状态值
    AUDIT_STATE: {state: 2, msg: "提交审核成功，请等待审核！"},           //提交审核状态值
    ADD_STATE: {state: 3, msg: "保存成功！"},               	//保存草稿状态值
    DEFAULT_STATE: "add",                                           //页面新增状态
    STATE_LIST: {"edit": {action: "edit", title: "编辑招商单位"},
        "add": {action: "add", title: "新增招商单位"},
        "audit": {action: "audit", title: "审核修改招商单位"},
        "release": {action: "release", title: "已发布招商单位修改"}
    },     //页面所有状态
    RELATION: "businessunit.shtml",                                        //关联的打开窗口
    UPLOAD_BUCKET: "logo"  //存储图片的目录
};

//数据相关
page.action = helper.url.queryString("action") || page.CONFIG.DEFAULT_STATE;
page.stateInfo = page.CONFIG.STATE_LIST[page.action];
page.id = helper.url.queryString("id");
page.ref = decodeURIComponent(helper.url.queryString("ref")) || page.CONFIG.RELATION;
page.info = {data: {}};

//常用的jquery对象
page.$uploader = $(".dropzone");
page.$form = $('#frmAddCiphertext');
page.$button = $("#divAction button");

//组件实例
page.feedPush = null;
page.mobilePush = null;
page.fileUpload = null;

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
        	$("#password").attr("placeholder","请输入密码");
        	$("#password").val("");
            return;
        }

        $.ajax({
            url: page.CONFIG.GET_INFO_API,
            type: 'POST',
            data: {id: page.id},
            dataType: 'json',
            success: function (res) {
                if(res.code == 0){
                    page.info.data =res.data;
                    page.assist.initDataBind();
                    return;
                }

                toastr.error("待编辑的招商单位不存在或发生错误!", "请稍候再重试或联系管理员！");
            },
            error: function () {
                toastr.error("待编辑的招商单位不存在或发生错误!", "请稍候再重试或联系管理员！");
            }
        })
    },

    //表单验证并提交执行回调
    doSubmit: function (stateInfo) {
        var bv = page.$form.data('bootstrapValidator');
        //手动触发验证
        bv.validate();
        if(bv.isValid()){
//        	if(page.fileUpload.getFiles().length==0){
//        		toastr.error("操作失败!", "请上传招商单位logo图片!");
//        		return;
//        	}
            var data = page.assist.getParams(stateInfo.state);
            var url =  page.CONFIG.ADD_API;
            if(page.assist.actionIsEdit())
                url = page.CONFIG.EDIT_API;
//            console.log(data);
//            return;
            page.assist.submitStatus(1);
            $.ajax({
                url: url,
                type : 'POST',
                data: data,
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                        helper.win.changeQuoto({msg: stateInfo.msg, relation: page.ref});
                    }else if(ret.code == 2){
                        toastr.error("操作失败!", ret.errMsg);
                        $("#username").focus();
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
        return !this.actionIsEdit();
    },
    //判断当前模式是否是编辑模式
    actionIsEdit: function () {
        return page.action == page.CONFIG.STATE_LIST.edit.action && page.id;
    },
    
    //获取页面参数
    getParams: function (state) {
        var data = {};
        data.avatar = page.fileUpload.getFiles().join(",");
        data.id = page.id;
        data.username= $("#username").val();
        data.password=$("#password").val();
        data.title= $("#title").val();
        data.address= $("#address").val();
        data.phone= $("#phone").val();
        data.profile= $("#profile").val();
        data.status = 1;
        return data;
    },

    //初始化数据绑定
    initDataBind: function () {
    	if(!page.assist.actionIsAdd()){
            //编辑模式初始化表单内容
            var data = page.info.data;
            $("#username").val(data.username);
            $("#title").val(data.title);
            $("#address").val(data.address);
            $("#phone").val(data.phone);
            $("#profile").val(data.profile);
            $("#password").val("");
            
            //调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
            iCheck.toggle.init("body");
        }


        page.assist.initFlag.EDIT = 1;
        page.assist.initUpload();
        page.assist.initComplete();
    },

    //初始化七牛完成，编辑模式下加载数据完成，以上两者都完成后才初始化上传组件
    initUpload: function () {
        if(page.assist.initFlag.QINIU == 1 && page.assist.initFlag.EDIT == 1){
            //上传（图片）组件初始化
            var images = [];
            if(page.info.data.avatar)
                images = page.info.data.avatar.split(",");
            page.fileUpload = new module.fileUpload({
                container: "#fileSelector",
                isUnique: true,
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

    //初始化页面渲染内容
    page.eventHandler.initPageInfo();

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
        	username: {/*键名和input name值对应*/
                message: '账号名验证不通过',
                validators: {
                    notEmpty: {/*非空提示*/
                        message: '账号名不能为空'
                    },stringLength:{
                        max: 50,
                        message: "账号名不能超过50个字"
                    }
                }
            },
            title: {/*键名和input name值对应*/
                message: '单位名称验证不通过',
                validators: {
                    notEmpty: {/*非空提示*/
                        message: '单位名称不能为空'
                    },stringLength:{
                        max: 50,
                        message: "单位名称不能超过50个字"
                    }
                }
            },
            address: {/*键名和input name值对应*/
                message: '单位地址验证不通过',
                validators: {
                    notEmpty: {/*非空提示*/
                        message: '单位地址不能为空'
                    },stringLength:{
                        max: 150,
                        message: "单位地址不能超过150个字"
                    }
                }
            },
            phone: {/*键名和input name值对应*/
                message: '联系电话验证不通过',
                validators: {
                    notEmpty: {/*非空提示*/
                        message: '联系电话不能为空'
                    }
                }
            },
            profile: {/*键名和input name值对应*/
                message: '单位简介验证不通过',
                validators: {
                    notEmpty: {/*非空提示*/
                        message: '单位简介不能为空'
                    },stringLength:{
                        max: 500,
                        message: "单位名称不能超过500个字"
                    }
                }
            }
        }
    });

    //调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
    iCheck.toggle.init("body");

    //初始化各种状态下的按钮
    page.assist.setButtonShow();

    //保存
    $("#btnSave").click(function() {
        page.eventHandler.doSubmit(page.CONFIG.ADD_STATE);
    });

    //取消
    $("#btnCancel").click(helper.win.close);
});
});