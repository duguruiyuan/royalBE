//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'iCheckPlus', 'toastr', 'helper.qiniu', 'module.editor', 'module.push', 'module.fileUpload', 'validator','module.inputSelector'], function (bs, $, helper, iCheck, toastr) {
    var module = {
            push: require('module.push'),
            editor: require('module.editor'),
            fileUpload: require('module.fileUpload'),
            inputSelector: require('module.inputSelector')
        };
	
	//页面所用到配置
page.CONFIG = {
    GET_INDUSTRY_API: helper.url.getUrlByMapping("admin/backcommon/find_industrylists.shtml"),     //获取行业列表的接口
    GET_UNIT_API: helper.url.getUrlByMapping("admin/business/find_business_unit.shtml?status=1"),     //获取招商单位列表的接口
    GET_INFO_API: helper.url.getUrlByMapping("admin/business/get_business_id.shtml"),                //获取商机接口
    ADD_API: helper.url.getUrlByMapping("admin/business/insert_business.shtml"),                     //新增商机接口
    EDIT_API: helper.url.getUrlByMapping("admin/business/update_business_id.shtml"),      			//修改商机接口
    AUDIT_API: helper.url.getUrlByMapping("admin/business/audit_business_id.shtml"),           		//商机审核接口
    PASS_STATE: {state: 1, msg: "审核通过操作成功！"},              //审核通过状态值
    AUDIT_STATE: {state: 2, msg: "提交审核成功，请等待审核！"},             //提交审核状态值
    ADD_STATE: {state: 3, msg: "保存到草稿箱操作成功！"},               //保存草稿状态值
    DEFAULT_STATE: "add",                                                  //页面新增状态
    STATE_LIST: {"edit": {action: "edit", title: "编辑商机"},
        "add": {action: "add", title: "新增商机"},
        "audit": {action: "audit", title: "审核修改商机"},
        "release": {action: "release", title: "已发布商机修改"}
    },     //页面所有状态
    RELATION: "shangjilist.shtml?type=draft",                                        //关联的打开窗口
    UPLOAD_BUCKET: "file"  //存储图片的目录
};

//数据相关
 page.action = helper.url.queryString("action") || page.CONFIG.DEFAULT_STATE;
 page.stateInfo = page.CONFIG.STATE_LIST[page.action];
 page.id = helper.url.queryString("id");
 page.ref = decodeURIComponent(helper.url.queryString("ref")) || page.CONFIG.RELATION;
 page.info = {data: {},feedData: {}, mobileData: {}};
 page.filearray= new Array();

//常用的jquery对象
// page.$editor = $("#objEditer");
 page.$uploader = $(".dropzone");
 page.$form = $('#frmAddCiphertext');
 page.$button = $("#divAction button");

//组件实例
page.feedPush = null;
page.mobilePush = null;
page.fileUpload = null;
page.placeSelector = null;
page.editor = null;

//页面事件
page.eventHandler = {
    initTheme: function () {
        //初始化获取行业
        $.ajax({
            url: page.CONFIG.GET_INDUSTRY_API,
            async:false,
            type: 'post',
            dataType: 'json',
            success: function(res){
                if(res.code == 0){
                    var result = res.data;
                    var arr = [];
                    arr.push('<option value="">请选择</option>');
                    for(var i = 0; i < result.length; i++){
                        arr.push('<option value="' + result[i].id + '">' + result[i].name + '</option>');
                    }
                    $('#industry').html(arr.join(''));
                    page.assist.initFlag.THEME = 1;
                    page.assist.initComplete();
                    return;
                }

                toastr.error("OMG!", res.errMsg);
            },
            error: function(){
                toastr.error("OMG!", "获取行业列表错误，请稍候再重试！");
            }
        });
    },
    initUnit: function () {
        //初始化招商单位
        $.ajax({
            url: page.CONFIG.GET_UNIT_API,
            async:false,
            type: 'post',
            dataType: 'json',
            success: function(res){
                if(res.code == 0){
                    var result = res.data;
                    var arr = [];
                    arr.push('<option value="">请选择</option>');
                    for(var i = 0; i < result.length; i++){
                        arr.push('<option data-avatar="'+result[i].avatar+'" data-profile="'+result[i].profile+'" value="' + result[i].id + '">' + result[i].title + '</option>');
                    }
                    $('#unitid').html(arr.join(''));
                    page.assist.initFlag.UNIT = 1;
                    page.assist.initComplete();
                    return;
                }

                toastr.error("OMG!", res.errMsg);
            },
            error: function(){
                toastr.error("OMG!", "获取单位列表错误，请稍候再重试！");
            }
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
        if(page.assist.actionIsAdd()) {
            page.assist.initDataBind();
            return;
        }

        $.ajax({
            url: page.CONFIG.GET_INFO_API,
            async:false,
            type: 'POST',
            data: {id: page.id},
            dataType: 'json',
            success: function (res) {
                if(res.code == 0){
                    page.info = module.push.dataTransForm(res.data, res.pushdevice);
                    page.assist.initDataBind();
                    return;
                }

                toastr.error("待编辑的商机不存在或发生错误!", "请稍候再重试或联系管理员！");
            },
            error: function () {
                toastr.error("待编辑的商机不存在或发生错误!", "请稍候再重试或联系管理员！");
            }
        })
    },

    //表单验证并提交执行回调
    doSubmit: function (stateInfo) {
        var bv = page.$form.data('bootstrapValidator');
        var placej = page.placeSelector.getValue();
        if(placej.value==undefined||placej.value==""){
        	toastr.error("操作失败!", "请选择招商地区。");
        	return;
        }
        //手动触发验证
        bv.validate();
        if(bv.isValid()){
            var data = page.assist.getParams(stateInfo.state);
            var url =  page.CONFIG.ADD_API;
            if(page.assist.actionIsRelease() || page.assist.actionIsAudit())
                url = page.CONFIG.AUDIT_API;
            else if(page.assist.actionIsEdit())
                url = page.CONFIG.EDIT_API;
      //      var url = page.assist.actionIsAudit() ? page.CONFIG.AUDIT_API : (page.assist.actionIsEdit() ? page.CONFIG.EDIT_API : page.CONFIG.ADD_API);
            
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
    
    doUpdate: function (stateInfo) {
        var bv = page.$form.data('bootstrapValidator');
        var placej = page.placeSelector.getValue();
        if(placej.value==undefined||placej.value==""){
        	toastr.error("操作失败!", "请选择招商地区。");
        	return;
        }
        //手动触发验证
        bv.validate();
        if(bv.isValid()){
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
        data.unit_id=$('#unitid').val(),
        data.unit_name=$('#unitid').find("option:selected").text(),
        data.unit_avatar=$('#unitid').find("option:selected").data("avatar"),
        data.unit_profile=$('#unitid').find("option:selected").data("profile"),
        data.title=$('#title').val(),
        
        data.area=page.placeSelector.getValue().value,
        
        data.industry=$('#industry').val(),
        data.industry_name=$('#industry').find("option:selected").text(),
        data.type=$('#type').val(),
        data.money=$('#money').val(),
        data.contact=$('#contact').val(),
        data.phone=$('#phone').val(),
        data.address=$('#address').val(),
     //   data.file_id=$('#industry').val(),
        data.id = page.id;
        data.state = state;
        var oldfileids ='';
        if(page.info.data.fileid!=undefined)
        	oldfileids=page.info.data.fileid;
        for(var i=0;i<page.filearray.length;i++){
        	if(oldfileids=='')
        		oldfileids = page.filearray[i].fileid;
        	else
        		oldfileids = oldfileids+','+page.filearray[i].fileid;
        }
        data.file_id = oldfileids;
        
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
            validatorContainer: "#frmAddCiphertext",
            readonly: page.assist.actionIsRelease(),
            defaultPush: {selected: 1, value: module.push.pushEnum.none},
            formData: page.info.feedData
        });

        //初始化设备推送组件
        page.mobilePush = new module.push.mobile({
            container: "#objMobilePush",
            validatorContainer: "#frmAddCiphertext",
            readonly: page.assist.actionIsRelease(),
            range: {alluser: 2},
            formData: page.info.mobileData
        });

        var files = [];
        var filenames = [];
        var fileids = '';
        var placej = {};
        if(!page.assist.actionIsAdd()){
            //编辑模式初始化表单内容
        	$("#title").val(page.info.data.title);
        	$("#unitid").val(page.info.data.unit_id);
//        	$("[name=unitid][value=" + page.info.data.unit_id + "]").attr("checked", "checked");
//        	$("#area").val(page.info.data.area);
        	placej.key=1;
        	placej.value=page.info.data.area;
        	$("#industry").val(page.info.data.industry);
//        	$("[name=industry][value=" + page.info.data.industry + "]").attr("checked", "checked");
        	$("#type").val(page.info.data.type);
        	$("#money").val(page.info.data.money);
        	$("#contact").val(page.info.data.contact);
        	$("#phone").val(page.info.data.phone);
        	$("#address").val(page.info.data.address);
        	if(page.info.data.files){
        		files = page.info.data.files;
        		for(var i=0;i<files.length;i++){
        			var file={};
           		  	file.fileid=files[i].fileid;
           		  	file.attachment=files[i].attachment;
           		  	page.filearray[i]=file;
           		  	
        			filenames[i]=files[i].attachment;
        			if(fileids=='')
        				fileids=files[i].fileid;
        			else
        				fileids=fileids+','+files[i].fileid;
        		}
        	}else{
        		page.info.data.files=new array();
        	}

            //初始化地点选择器
            page.placeSelector = new module.inputSelector({
                container: "#placeSelect",
                validatorContainer: "",
                readonly: false,
                data:placej,
                type: "area"
              });
            
            //调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
            iCheck.toggle.init("body");
        }else{
            //初始化地点选择器
            page.placeSelector = new module.inputSelector({
                container: "#placeSelect",
                validatorContainer: "",
                readonly: false,
//                data:placej,
                type: "area"
              });
        };
        //上传（图片）组件初始化
        page.fileUpload = new module.fileUpload({
            container: "#fileSelector",
            fileType: "doc",
            bucket: page.CONFIG.UPLOAD_BUCKET,
            existFiles: filenames && filenames instanceof Array ? filenames : [],
            completeCallback:function(json){
            	var file_name = json.oldFilename;
            	var qiniu_url = json.url;
            	var file_size = json.file.size;
            	$.ajax({
                    url: helper.url.getUrlByMapping("insert_business.shtml"),
                    dataType: 'json',
                    type: 'post',
                    data:{
                    	file_name: file_name,
                    	qiniu_url: qiniu_url,
                    	file_size: file_size
                    },
                    success:function(data){
                 	   if(data.code == 0){
                 		   for(var i=0;i<page.filearray.length;i++){
                 			   if(data.data.qiniu_url==page.filearray[i].attachment)
                 				   return;
                 		   }
                 		  var file={};
                 		  file.fileid=data.data.id;
                 		  file.attachment=data.data.qiniu_url;
                 		  page.filearray[page.filearray.length]=file;
                 	//	  console.log("add",page.filearray);
                 		  return;
                 	   }
                 	  toastr.error("服务器存储失败!", data.errMsg);
                    },
                    error: function(msg){
                    	toastr.error("服务器存储失败!", msg);
                    }
                });
            },
            deleteCallback:function(json){
//            	console.log("json",json);
            	if(json!=null){
                	var size = page.filearray.length;
                	for(var i=0;i<size;i++){
                		if(json.url==page.filearray[i].attachment){
                			page.filearray.splice(i,1);
                			i--;
                			size--;
                		}
                	}
            	}
//            	console.log("delete",page.filearray);
            }
        });
        
        page.assist.initFlag.EDIT = 1;
   //     page.assist.initUpload();
        page.assist.initComplete();
    },
    
    //初始化七牛完成，编辑模式下加载数据完成，以上两者都完成后才初始化上传组件
//    initUpload: function () {
//    	console.info(1111)
//        if(page.assist.initFlag.QINIU == 1 && page.assist.initFlag.EDIT == 1){
//            //上传（图片）组件初始化
//            var images = [];
//            if(page.info.data.image)
//                images = page.info.data.image.split(",");
//            page.fileUpload = new module.fileUpload({
//                container: "#fileSelector",
//                existFiles: images && images instanceof Array ? images : []
//            });
//        }
//    },
    
    //页面初始化完成状态，全部=1表示初始化完成
    initFlag: {QINIU: 0, THEME: 0, UNIT: 0, EDIT: 1},

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
        excluded: [':disabled', ':hidden', ':not(:visible)'],
        message: '验证未通过',
        feedbackIcons: {/*输入框不同状态，显示图片的样式*/
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {/*验证*/
        	title: {/*键名username和input name值对应*/
                message: '项目标题验证不通过',
                validators: {
                    notEmpty: {/*非空提示*/
                        message: '标题不能为空'
                    },stringLength:{
                        max: 50,
                        message: "标题不能超过50个字"
                    }
                }
            },
            unitid:{
                message:'招商单位验证不通过',
                validators: {
                	notEmpty: {/*非空提示*/
                        message: '请选择招商单位'
                    }
                }
            },
            industry: {
                message:'招商行业验证不通过',
                validators: {
                    notEmpty: {
                        message: '请选择招商行业'
                    }
                }
            },
            type: {
                message:'招商方式验证不通过',
                validators: {
                    notEmpty: {
                        message: '招商方式不能为空'
                    }
                }
            },
            money: {
                message:'招商金额验证不通过',
                validators: {
                    notEmpty: {
                        message: '招商金额不能为空'
                    }
                }
            }/*,
            contact: {
                message:'联系人验证不通过',
                validators: {
                    notEmpty: {
                        message: '联系人不能为空'
                    }
                }
            },
            phone: {
                message:'联系电话验证不通过',
                validators: {
                    notEmpty: {
                        message: '联系电话不能为空'
                    }
                }
            }*/
        }
    });
    //初始化获取行业
    page.eventHandler.initTheme();
    
  //初始化获取招商单位
    page.eventHandler.initUnit();
    
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
});
});