//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'iCheckPlus', 'toastr', 'helper.qiniu', 'module.editor', 'module.push', 'module.fileUpload', 'validator', 'module.multSelector', 'module.inputSelector'], function (bs, $, helper, iCheck, toastr) {
    var module = {
        push: require('module.push'),
        editor: require('module.editor'),
        fileUpload: require('module.fileUpload'),
        multSelector: require('module.multSelector'),
        inputSelector: require('module.inputSelector')
    };
//页面所用到配置
page.CONFIG = {
	GET_USER_LIST: helper.url.getUrlByMapping("admin/backcommon/find_userlists.shtml?x=0&y=50"),       //获取用户列表的接口
    GET_INFO_API: helper.url.getUrlByMapping("admin/circle/find_circle_detail.shtml"),                 //获取圈子信息接口
    ADD_API: helper.url.getUrlByMapping("admin/circle/insert_circle.shtml"),                     	   //新增圈子接口
    EDIT_API: helper.url.getUrlByMapping("admin/circle/update_circle.shtml"),       				   //修改圈子接口
    AUDIT_API: helper.url.getUrlByMapping("admin/circle/update_circle.shtml"),       				   //修改圈子接口
    PASS_STATE: {state: 1, msg: "操作成功！"},              //审核通过状态值
    AUDIT_STATE: {state: 2, msg: "保存成功！"},             //提交审核状态值
    ADD_STATE: {state: 3, msg: "保存到草稿箱操作成功！"},               //保存草稿状态值
    DEFAULT_STATE: "add",                                                  //页面新增状态
    STATE_LIST: {"edit": {action: "edit", title: "编辑圈子"},
        "add": {action: "add", title: "新增圈子"},
        "audit": {action: "audit", title: "审核修改圈子"},
        "release": {action: "release", title: "编辑圈子"}
    },     //页面所有状态
    RELATION: "circleslist.shtml?type=wait",                                        //关联的打开窗口
    UPLOAD_BUCKET: "logo"  //存储图片的目录
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

page.MOCK = {
		MasterData:[],//已选圈主数据
		MembersData:[],//已选成员数据
		OldMaster:[],//旧圈主数据
		OldMembers:[],//旧成员数据
		OldMemberdis:"",
		NewMemberdis:""
	};
//页面级的帮助对象集合
page.derive = {
    //获取带label效果的文本节点组
    getLabelList: function (data,key) {
        var template = '';
        var index = 1;
        for(var i=0;i <data.length;i++){
            if(index === 1){
                index++;
                template +='<div class="label label-primary label-item">'+data[i][key]+'</div>';
            }else if(index === 2){
                index++;
                template +='<div class="label label-warning label-item">'+data[i][key]+'</div>';
            }else if(index === 3){
                index++;
                template +='<div class="label label-info label-item">'+data[i][key]+'</div>';
            }else if(index === 4){
                index++;
                template +='<div class="label label-danger label-item">'+data[i][key]+'</div>';
            }else if(index === 5){
                index=1;
                template +='<div class="label label-success label-item">'+data[i][key]+'</div>';
            }
        }
        return template;
    }
};
//组件实例
page.fileUpload = null;
page.masterSelect = null;
//页面事件
page.eventHandler = {
		//圈主选择器
		openMasterSelect: function(){
	    var selector = new module.multSelector({
	        url: page.CONFIG.GET_USER_LIST,
	        searchType: 1,//服务端搜索
	        keyword: "",
	        method: "GET",
	        dataC: "data",
	        keywordC: "name",
	        keyC: "id",
	        valueC: "name",
	        tagsC: "user_identity",
	        pkeyC: "",
	        title: "请选择",
	        selectedData: page.MOCK.MasterData,
	        callback: function(data){
	            var masterdata = [];
	            var master = {};
	            //转换
	            master.value = data[0].value;
	            master.key = data[0].key;
	            masterdata[0]=master;
	            //渲染
	            $('#master').html(
	                page.derive.getLabelList(masterdata,'value')
	            );
	        	//映射
	
	            page.MOCK.MasterData = masterdata;
	
	        }
	    });
	},
	//成员选择器
	openMembersSelect: function(){
	    var selector = new module.multSelector({
	        url: page.CONFIG.GET_USER_LIST,
	        searchType: 1,//服务端搜索
	        keyword: "",
	        method: "GET",
	        dataC: "data",
	        keywordC: "name",
	        keyC: "id",
	        valueC: "name",
	        tagsC: "user_identity",
	        pkeyC: "",
	        title: "请选择",
	        selectedData: page.MOCK.MembersData,
	        callback: function(data){
	            //转换
	            for(var i=0;i<data.length;i++){
	                data[i].name = data[i].value;
	                data[i].id = data[i].key;
	            }
	            //渲染
	            $('#members').html(
	                page.derive.getLabelList(data,'value')
	            );
	            //映射
	
	            page.MOCK.MembersData = data;
//	            if (data.length === 0) {
//	            	$('#membersContainer').addClass('has-error').removeClass('has-success');
//	            	$('#membersPrompt').removeClass('hidden');
//	            } else {
//	            	$('#membersContainer').removeClass('has-error').addClass('has-success');
//	            	$('#membersPrompt').addClass('hidden');
//	            }
	
	        }
	    });
	},

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
            async :false,
            data: {id: page.id},
            dataType: 'json',
            success: function (res) {
                if(res.code == 0){
                	page.info.data = res.data;
                    page.assist.initDataBind();
                    return;
                }

                toastr.error("待编辑的圈子不存在或发生错误!", "请稍候再重试或联系管理员！");
            },
            error: function () {
                toastr.error("待编辑的圈子不存在或发生错误!", "请稍候再重试或联系管理员！");
            }
        });
        
    },

    //表单验证并提交执行回调
    doSubmit: function (stateInfo) {
    	var flag = true;
        var bv = page.$form.data('bootstrapValidator');
        //手动触发验证
        bv.validate();
        /*if(!page.assist.checkothers()){
        	return;
        }*/
//        if (page.MOCK.MembersData.length === 0) {
//        	$('#membersContainer').addClass('has-error').removeClass('has-success');
//        	$('#membersPrompt').removeClass('hidden');
//        }
        if(bv.isValid() && flag) {
            var data = page.assist.getParams(stateInfo.state);
//            toastr.error("操作失败!", "保存功能正在调试!");
            console.log(data);
//            return;
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
        data.title = $("#circleName").val();
        data.description = $("#circleDes").val();
        data.brief = $("#circleBrief").val();
        data.rule = $("#circleRules").val();
        data.logo = page.fileUpload.getFiles().join(",");
        var master = page.masterSelect.getValue();
        data.user_id= master.key;
        data.user_name=master.value;
        var User_list = [];
		for(var i=0;i<page.MOCK.MembersData.length;i++){
			var temp = {'user_id':page.MOCK.MembersData[i].id,'user_name':page.MOCK.MembersData[i].name};
			User_list.push(temp);
		}
        data.user_list=JSON.stringify(User_list);
        
        data.deleteCircleZhuList = JSON.stringify(page.MOCK.OldMaster);
        data.deleteCircleUserList = JSON.stringify(page.MOCK.OldMembers);
        data.oldMemberids = page.MOCK.OldMemberdis;
        
        data.id = page.id;
        data.state = state;

        return data;
    },
    checkothers: function(){
    	var title = $('#circleName').val().trim('g');
    	var description = $.trim($('#circleDes').val());
    	var rule = $.trim($('#circleRules').val());
    	var brief = $.trim($('#circleBrief').val());
    	var ss = page.masterSelect.getValue();
    	if(brief===""){
    		toastr.error("圈子简介不能为空！");
        	return false;
    	}else if(page.MOCK.MembersData.length === 0){
    		toastr.error("圈子成员不能为空！");
        	return false;
    	}else if(rule === ""){
    		toastr.error("圈子规则不能为空！");
        	return false;
    	}
    	return true;
    },
    //初始化数据绑定
    initDataBind: function () {
        //初始化富文本编辑器
//        page.$editor.summernote({
//            height: 500
//        });

        if(!page.assist.actionIsAdd()){
            //编辑模式初始化表单内容
            var data = page.info.data;
            $("#circleName").val(data.title);
            $("#circleRules").val(data.rule);
            $("#circleBrief").val(data.brief);
            $("#circleDes").val(data.description);
//            page.$editor.code(data.content);
            
        	var master={};
            master.key=data.circle_zhu_id;
            master.value=data.circle_zhu_name;
            master.user_id=data.circle_zhu_id;
            master.user_name=data.circle_zhu_name;
            //写入圈主旧数据
            page.MOCK.OldMaster[0]=master;
            page.MOCK.MasterData[0]=master;
            var memberdis="";
            if(data.circleMemberList){
            	for(var i=0;i<data.circleMemberList.length;i++){
            		var memner={};
            		memner.key=data.circleMemberList[i].user_id;
            		memner.value=data.circleMemberList[i].user_name;
            		memner.user_id=data.circleMemberList[i].user_id;
            		memner.user_name=data.circleMemberList[i].user_name;
            		memner.id=data.circleMemberList[i].user_id;
            		memner.name=data.circleMemberList[i].user_name;
            		page.MOCK.MembersData[i]=memner;
                    //写入成员旧数据
            		page.MOCK.OldMembers[i]=memner;
            		if(i==0)
            			memberdis = data.circleMemberList[i].user_id;
            		else
            			memberdis = memberdis + ";" +data.circleMemberList[i].user_id;
            		
            		data.circleMemberList[i].key=data.circleMemberList[i].user_id;
            		data.circleMemberList[i].value=data.circleMemberList[i].user_name;
            	}
            }
            page.MOCK.OldMemberdis = memberdis;
//            console.log(memberdata);
            $('#members').html(
	                page.derive.getLabelList(data.circleMemberList,'value')
	        );
//            page.MOCK.MembersData
            page.masterSelect= new module.inputSelector({
                container: "#masterSelect",
                validatorContainer: "#frmAddCiphertext",
                readonly: false,
                data:master,
                type: "user"
              });
            //调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
            iCheck.toggle.init("body");
        }else{
            page.masterSelect= new module.inputSelector({
                container: "#masterSelect",
                validatorContainer: "#frmAddCiphertext",
                readonly: false,
                type: "user"
              });
        };
        
        page.assist.initFlag.EDIT = 1;
        page.assist.initUpload();
        page.assist.initComplete();
    },

    //初始化七牛完成，编辑模式下加载数据完成，以上两者都完成后才初始化上传组件
    initUpload: function () {
        if(page.assist.initFlag.QINIU == 1 && page.assist.initFlag.EDIT == 1){
            //上传（图片）组件初始化
            var images = [];
            if(page.info.data.logo)
                images[0] = page.info.data.logo;
            page.fileUpload = new module.fileUpload({
                container: "#circleAvatar",
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
        	circleName: {/*键名和input name值对应*/
                message: '圈子名称不能为空',
                validators: {
                    notEmpty: {/*非空提示*/
                        message: '圈子名称不能为空'
                    },stringLength:{
                        max: 50,
                        message: "圈子名称不能超过50个字"
                    }
                }
            },circleDes: {/*键名和input name值对应*/
                message: '圈子签名不能为空',
                validators: {
                    notEmpty: {/*非空提示*/
                        message: '圈子签名不能为空'
                    },stringLength:{
                        max: 100,
                        message: "圈子签名不能超过100个字"
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
        page.eventHandler.doSubmit(page.CONFIG.PASS_STATE);
    });

    //保存草稿
    $("#btnSave").click(function() {
        page.eventHandler.doSubmit(page.CONFIG.ADD_STATE);
    });

    //取消
    $("#btnCancel").click(helper.win.close);
});
});