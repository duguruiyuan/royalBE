//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'iCheckPlus', 'toastr', 'helper.qiniu', 'module.editor', 'module.push', 'module.fileUpload', 'validator', 'module.articleSelector', 'module.multSelector', 'module.inputSelector','module.multSelectorPlus'], function (bs, $, helper, iCheck, toastr) {
    var module = {
            push: require('module.push'),
            editor: require('module.editor'),
            fileUpload: require('module.fileUpload'),
            articleSelector: require('module.articleSelector'),
            multSelector: require('module.multSelector'),
            inputSelector: require('module.inputSelector'),
            multSelectorPlus: require('module.multSelectorPlus')
    };

page.$form = $('#pageForm');
//页面所用到配置
page.CONFIG = {
    GET_INFO_API: helper.url.getUrlByMapping("admin/topic/find_topic_detail.shtml"),                //获取话题接口
    GET_CIRCLES_LIST: helper.url.getUrlByMapping("admin/circle/find_circle_list.shtml?status=1&state=1&x=0&y=50"),     			//圈子选择接口
    INSERT_GUEST: helper.url.getUrlByMapping("admin/common/insert_guest.shtml"),                 //新增嘉宾接口
    GET_USER_LIST: helper.url.getUrlByMapping("admin/backcommon/find_userlists.shtml?x=0&y=50"),    //人员选择接口  			//圈子选择接口
    ADD_API: helper.url.getUrlByMapping("admin/topic/insert_topic.shtml"),                     //新增话题接口
    EDIT_API: helper.url.getUrlByMapping("admin/topic/update_topic.shtml"),      //修改话题接口
    AUDIT_API: helper.url.getUrlByMapping("admin/topic/audit_topic.shtml"),           //话题审核接口
    PASS_STATE: {state: 1, msg: "审核通过操作成功！"},              //审核通过状态值
    AUDIT_STATE: {state: 2, msg: "提交审核成功，请等待审核！"},             //提交审核状态值
    ADD_STATE: {state: 3, msg: "保存到草稿箱操作成功！"},               //保存草稿状态值
    DEFAULT_STATE: "add",                                                  //页面新增状态
    STATE_LIST: {"edit": {action: "edit", title: "编辑话题"},
        "add": {action: "add", title: "新增话题"},
        "audit": {action: "audit", title: "审核修改话题"},
        "release": {action: "release", title: "已发布话题修改"}
    },     //页面所有状态
    RELATION: "circletopiclist.shtml?type=draft",                                        //关联的打开窗口
    UPLOAD_BUCKET: "image"  //存储图片的目录
};

//数据相关
page.action = helper.url.queryString("action") || page.CONFIG.DEFAULT_STATE;
page.stateInfo = page.CONFIG.STATE_LIST[page.action];
page.id = helper.url.queryString("id");
page.ref = decodeURIComponent(helper.url.queryString("ref")) || page.CONFIG.RELATION;
page.info = {data: {}, feedData: {}, mobileData: {}};
page.SelectedCircles=[];//已选圈子数据
page.SelectedCircleIds="";
page.SelectedCircleNames="";
page.tableUniId=0;
page.SelectedUser=[];   //已选内部嘉宾数据，可以从选择器选的
page.SelectedGuest=[];	//已选外部嘉宾数据，手动添加的
page.SelectedArts=[];	//已选关联文章数据
if (new RegExp('(circleCMTopic)').test(page.ref)) {
	page.ref = helper.url.getUrlByMapping('admin/' + page.ref.replace(RegExp.$1, 'circleCMAll') + '&ref=circlesAll.shtml');
}
console.log(page.ref);
page.linkArticle = null;//相关链接文章选择
page.relatedArticle = null;//相关新闻文章选择
page.fileUpload = null;

//常用的jquery对象
page.$uploader = $(".dropzone");
//page.$form = $('#frmAddCiphertext');
page.$button = $("#divAction button");
page.$guestTable = $('#guestTable');//邀请嘉宾表格

//组件实例
page.feedPush = null;
page.mobilePush = null;
page.fileUpload = null;
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
            async :false,
            type: 'POST',
            data: {id: page.id},
            dataType: 'json',
            success: function (res) {
                if(res.code == 0){
                    page.info = module.push.dataTransForm(res.data, res.pushdevice);
                    page.assist.initDataBind();
                    return;
                }

                toastr.error("待编辑的话题不存在或发生错误!", "请稍候再重试或联系管理员！");
            },
            error: function () {
                toastr.error("待编辑的话题不存在或发生错误!", "请稍候再重试或联系管理员！");
            }
        })
    },
    circles:{
        openSelector: function(){
            var selector = new module.multSelector({
                url: page.CONFIG.GET_CIRCLES_LIST,
                searchType: 1,//服务端搜索
                keyword: "",
                method: "GET",
                dataC: "data",
                keywordC: "title",
                keyC: "id",
                valueC: "title",
                tagsC: "",
                pkeyC: "",
                title: "请选择圈子",
                selectedData: page.SelectedCircles,
                callback: function(data){
                    //转换
                    var ids = "";
                    var names = "";
                    for(var i=0;i<data.length;i++){
                        data[i].name = data[i].value;
                        data[i].id = data[i].key;
                        ids += data[i].key;
                        names += data[i].value;
                        if(i<data.length-1){
                            ids +=",";
                            names +=",";
                        }
                    }
                    //渲染
                    $("#circles").html(
                        page.assist.getLabelList(data,'value')
                    );
                    //映射
                    page.SelectedCircles = data;
                    page.SelectedCircleIds = ids;
                    page.SelectedCircleNames = names;
                    if (data.length != 0) {
                    	$('#circlesContainer').addClass('has-success').removeClass('has-error');
                		$('#circlesPrompt').addClass('hidden');
                    } else {
                    	$('#circlesContainer').removeClass('has-success').addClass('has-error');
                		$('#circlesPrompt').removeClass('hidden');
                    }
                }
            });
        }
    },
    table: {    //表格事件
        moveUp: function($table,value, row, index){	//表格row上移
            var data = $table.bootstrapTable('getData');
            data[index] = data.splice(index-1,1,data[index])[0];
            $table.bootstrapTable('load',data);
        },
        moveDown: function($table,value, row, index){	//表格row上移
            var data = $table.bootstrapTable('getData');
            data[index] = data.splice(index+1,1,data[index])[0];
            $table.bootstrapTable('load',data);
        },
        delete: function($table,value, row, index){	//表格row删除
        	$('#guestTable').bootstrapTable('removeByUniqueId', row.id);
        	if (row.user_type == 1) {
        		for (var i=0;i<page.SelectedGuest.length; i++){
                    if(page.SelectedGuest[i].id === row.id) page.SelectedGuest.splice(i, 1);
                }
        	} else if (row.user_type == 0) {
        		for (var i=0;i<page.SelectedUser.length; i++){
                    if(page.SelectedUser[i].id === row.id) page.SelectedUser.splice(i, 1);
                }
        	}
        }
    },
    guest: {	//嘉宾模块
        openAdd: function(){		//打开新增嘉宾填写面板

            var template =  '<div style="width: 100%;padding: 20px 20px 0 20px">' +
                            '<form id="addGuestForm" class="form-horizontal">'+
                            '<div class="form-group">'+
                            '<label class="col-sm-2 control-label">上传头像</label>'+
                            '<div class="col-sm-9">'+
                            '<input type="file" id="userAvatar" multiple name="file">'+
                            '</div>'+
                            '</div>'+
                            '<div class="form-group">'+
                            '<label class="col-sm-2 control-label">姓名</label>'+
                            '<div class="col-sm-9">'+
                            '<input id="guestName" name="guestName" type="text" class="form-control">'+
                            '</div>'+
                            '</div>'+
                            '<div class="form-group">'+
                            '<label class="col-sm-2 control-label">单位</label>'+
                            '<div class="col-sm-9">'+
                            '<input id="guestCompany" name="guestCompany" type="text" class="form-control">'+
                            '</div>'+
                            '</div>'+
                            '<div class="form-group">'+
                            '<label class="col-sm-2 control-label">职务</label>'+
                            '<div class="col-sm-9">'+
                            '<input id="guestPosition" name="guestPosition"  type="text" class="form-control">'+
                            '</div>'+
                            '</div>'+
                            '<div class="form-group">'+
                            '<label class="col-sm-2 control-label">介绍</label>'+
                            '<div class="col-sm-9">'+
                            '<textarea id="guestProfile" class="form-control" name="guestProfile"></textarea>'+
                          //  '<input id="guestProfile" name="guestProfile"  type="text" class="form-control">'+
                            '</div>'+
                            '</div>'+
                            '<div class="form-group">'+
                            '<button class="btn btn-primary m-t-sm m-r-md pull-right" type="button" onclick="page.eventHandler.guest.insertGuest(this)">确认</button>'+
                            '<button class="btn btn-white m-t-sm m-r-xs pull-right" type="button" onclick="page.eventHandler.guest.closeAdd()">取消</button>'+
                            '</div>'+
                           '</form>' +
                            '</div>';
            page.addGuestModal = layer.open({
                type: 1,
                title: this.title,
                skin: 'layui-layer-molv', //加上边框
                area: ['500px', 'auto'], //宽高
                scrollbar: false,
                content: template,
                // btn : [ '确认', '取消'],
                // yes : function(index, layero) {
                //     console.log(index)
                //     console.log(layero)
                //     console.log(this)
                //     page.eventHandler.guest.insertGuest(this);
                // },
                // no : layer.close(page.addGuestModal),

                success: page.eventHandler.guest.initValidator
            });
            
            page.fileUpload = new module.fileUpload({
                container: "#userAvatar",
                isUnique: true,
                bucket: "logo",
                existFiles:[]
            });

        },
        closeAdd: function(){
            layer.close(page.addGuestModal);
        },
        //初始化表单验证
        initValidator: function () {
            $('#addGuestForm').bootstrapValidator({
                //指定不验证的情况
                excluded: [':disabled', ':hidden', ':not(:visible)'],
                message: '验证未通过',
                feedbackIcons: {/*输入框不同状态，显示图片的样式*/
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {/*验证*/
                    guestName: {/*键名username和input name值对应*/
                        message: '嘉宾姓名验证不通过',
                        validators: {
                            notEmpty: {/*非空提示*/
                                message: '嘉宾姓名不能为空'
                            },stringLength:{
                                max: 50,
                                message: "嘉宾姓名不能超过50个字"
                            }
                        }
                    },
                    guestCompany: {/*键名username和input name值对应*/
                        message: '嘉宾单位验证不通过',
                        validators: {
                            notEmpty: {/*非空提示*/
                                message: '嘉宾单位不能为空'
                            },stringLength:{
                                max: 100,
                                message: "嘉宾单位不能超过100个字"
                            }
                        }
                    },
                    guestPosition: {/*键名username和input name值对应*/
                        message: '嘉宾职务验证不通过',
                        validators: {
                            notEmpty: {/*非空提示*/
                                message: '嘉宾职务不能为空'
                            },stringLength:{
                                max: 100,
                                message: "嘉宾职务不能超过100个字"
                            }
                        }
                    },
                    guestProfile: {/*键名username和input name值对应*/
                        message: '嘉宾介绍验证不通过',
                        validators: {
                            stringLength:{
                                max: 200,
                                message: "嘉宾介绍不能超过200个字"
                            }
                        }
                    }
                }
            });
        },
        openSelect: function(){  //打开嘉宾选择面板
//            if(page.SelectedCircleIds ===""){
//                toastr.warning('请先选择圈子再选择嘉宾');
//            }else{
                //var circleids = JSON.stringify($("#guestTable").attr('data-circlesids'));
                var selector = new module.multSelector({
                    url: page.CONFIG.GET_USER_LIST,
                    searchType: 1,//服务端搜索
                    keyword: "",
                    method: "GET",
                    dataC: "data",
                    keywordC: "name",
                    keyC: "user_id",
                    valueC: "user_name",
                    tagsC: "user_identity",
                    pkeyC: "",
                    title: "请选择",
                    selectedData: page.SelectedUser,
                    callback: function(data){
                        //转换
                    	console.log(data);
                    	page.index = data.length
                    	var flag = true;
                        for(var i=0;i<data.length;i++){
                        	var originData = data[i].originData;
                            data[i].name = data[i].value;
                            if(originData!=undefined){
                                data[i].companywork = originData.companywork;
                                data[i].company = originData.company;
                                var company = originData.company?originData.company:'';
                                var companywork = originData.companywork?originData.companywork:'';
                                data[i].user_identity = company+companywork;
//                                data[i].user_identity = originData.company+originData.companywork;
                                data[i].user_avatar = originData.image?originData.image:'';
                                data[i].user_v = originData.user_v;
                               
                            }
                            if(data[i].is_send==undefined){
                            	data[i].is_send = 2;
                            }
                            data[i].user_name = data[i].value;
                            data[i].user_id = data[i].key;
                            data[i].display_order = i+1;
                            data[i].id = data[i].key;
                            data[i].user_type = 0;//普通用户
                            data[i].originData = null;
                            if(data[i].user_identity==""){
                            	flag =false;
                            }
                        };
                        //渲染
                        
                        $("#guestTable").bootstrapTable('append', page.SelectedGuest);
                        $("#guestTable").bootstrapTable('load', data);
                        //映射
                        page.SelectedUser = data;
                        if (page.$guestTable.bootstrapTable('getData').length != 0) {
                        	$('#guestTableContainer').addClass('has-success').removeClass('has-error');
                    		$('#guestTablePrompt').addClass('hidden');
                        } else {
                        	$('#guestTableContainer').removeClass('has-success').addClass('has-error');
                    		$('#guestTablePrompt').removeClass('hidden');
                    		flag = false;
                        }
                        if(!flag){
                        	$('#guestTableContainer').removeClass('has-success').addClass('has-error');
                    		$('#guestTablePrompt1').removeClass('hidden');
                        }else{
                        	$('#guestTableContainer').addClass('has-success').removeClass('has-error');
                    		$('#guestTablePrompt1').addClass('hidden');
                        }
                    }
                });
//            }
        },
        insertGuest: function(elem){	//向后添加嘉宾并返回嘉宾数据
            var bv = $('#addGuestForm').data('bootstrapValidator');
            var image= page.fileUpload.getFiles().join(",");
            //手动触发验证
            bv.validate();
            if(bv.isValid()){
                page.assist.submitStatus(1);
                var guestdata =page.assist.getGuestForm();
                	guestdata.name=guestdata.user_name;
                	guestdata.company=guestdata.user_company;
//                	guestdata.companywork=guestdata.companywork;
                $.ajax({
                    url: page.CONFIG.INSERT_GUEST,
                    type : 'POST',
                    data: guestdata,
                    dataType : 'json',
                    success : function(res) {
                        if(res.code == 0){
                            var temp = {};
                                temp.id = res.data.id;
                                temp.user_id = res.data.id;
                                temp.name = res.data.user_name;
                                temp.companywork = res.data.user_identity;
                                temp.company = res.data.user_company;
                                temp.image = image;
                                temp.user_type = 1;
                                temp.is_send = 2;
                                temp.user_name = res.data.user_name;
                                temp.user_identity = res.data.company+"   "+res.data.companywork;
                                temp.user_avatar = image;
                            $("#guestTable").bootstrapTable('append', temp);
                            page.SelectedGuest.push(temp);
                            layer.close(page.addGuestModal);
                            $('#guestTableContainer').addClass('has-success').removeClass('has-error');
                    		$('#guestTablePrompt').addClass('hidden');
                        }else{
                            toastr.error("操作失败!", res.errMsg);
                        }
                        page.assist.submitStatus(0);
                    },
                    error:function() {
                        toastr.error("操作失败!", "请稍候再重试");
                        page.assist.submitStatus(0);
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
    },
    //表单验证并提交执行回调
    doSubmit: function (stateInfo) {
    	var flag = true;
        var bv = page.$form.data('bootstrapValidator');
        //手动触发验证
        bv.validate();
        if (!page.SelectedCircleIds && page.SelectedCircleIds.trim() == '') {
        	$('#circlesContainer').removeClass('has-success').addClass('has-error');
    		$('#circlesPrompt').removeClass('hidden');
        	flag = false;
        }
        if (page.$guestTable.bootstrapTable('getData').length === 0) {
        	$('#guestTableContainer').removeClass('has-success').addClass('has-error');
    		$('#guestTablePrompt').removeClass('hidden');
    		flag = false;
        }
    	var guestlist = page.$guestTable.bootstrapTable('getData');
    	for(var i=0;i<guestlist.length;i++){
    		if(guestlist[i].user_identity==""){
            	$('#guestTableContainer').removeClass('has-success').addClass('has-error');
        		$('#guestTablePrompt1').removeClass('hidden');
        		flag = false;
        		break;
    		}
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
    
    doUpdate: function (stateInfo) {
    	var flag = true;
        var bv = page.$form.data('bootstrapValidator');
        //手动触发验证
        bv.validate();
        if (!page.SelectedCircleIds && page.SelectedCircleIds.trim() == '') {
        	$('#circlesContainer').removeClass('has-success').addClass('has-error');
    		$('#circlesPrompt').removeClass('hidden');
        	flag = false;
        }
        if (page.$guestTable.bootstrapTable('getData').length === 0) {
        	$('#guestTableContainer').removeClass('has-success').addClass('has-error');
    		$('#guestTablePrompt').removeClass('hidden');
    		flag = false;
        }
    	var guestlist = page.$guestTable.bootstrapTable('getData');
    	for(var i=0;i<guestlist.length;i++){
    		if(guestlist[i].user_identity==""){
            	$('#guestTableContainer').removeClass('has-success').addClass('has-error');
        		$('#guestTablePrompt1').removeClass('hidden');
        		flag = false;
        		break;
    		}
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
    formatterData: function (arr) {
    	for (var i = 0, len = arr.length; i < len; i++) {
    		arr[i].display_order = i + 1;
    	}
    	return arr;
    },

    //获取页面参数
    getParams: function (state) {
        var data = {};
        data.title = $("#title").val();
        data.summary = $("#txtSummary").val();
        data.content = page.editor.getValue();
        
        data.id = page.id;
        data.state = state;
        data.topcircle_ids= page.SelectedCircleIds;
        data.circle_nr_ids= page.SelectedCircleIds;
        data.circle_nr_names= page.SelectedCircleNames;
        data.relatedUrl=JSON.stringify(page.linkArticle.getArticles());
        data.guest=JSON.stringify(page.assist.formatterData(page.$guestTable.bootstrapTable('getData')));
        data.related=JSON.stringify(page.relatedArticle.getArticles());
        var guestlist = page.$guestTable.bootstrapTable('getData');
        var oldids="";
        for(var i=0;i<guestlist.length;i++){
        	if(guestlist[i].oldid!=undefined){
        		if(oldids=="")
        			oldids = guestlist[i].oldid;
        		else
        			oldids = oldids + ',' +guestlist[i].oldid;
        	}
        }
        data.oldids=oldids;
//        SelectedCircles
//        page.SelectedCircleIds="";
//        page.tableUniId=0;
//        page.SelectedUser=[];   //已选内部嘉宾数据，可以从选择器选的
//        page.SelectedGuest=[];	//已选外部嘉宾数据，手动添加的
//        page.SelectedArts=[];	//已选关联文章数据
        //获取推送组件中的数据
        page.feedPush.getFormData(data);
        page.mobilePush.getFormData(data);

        return data;
    },    
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
    },
    //获取页面嘉宾表格数据
    getGuestForm: function () {
        return {
        	'image' : page.fileUpload.getFiles().join(","),
            'name': $('#guestName').val(),
            'user_name': $('#guestName').val(),
            'user_company': $('#guestCompany').val(),
            'companywork': $('#guestPosition').val(),
            'user_identity':$('#user_identity').val(),
            'guestProfile':$('#guestProfile').val()
        }
    },
    //获取页面外部文章表格数据
    getOutArtForm: function () {
        page.tableUniId--;
        return {
            id: page.tableUniId,
            title: $('#outArtTitle').val(),
            url: $('#outArtLink').val()

        }
    },
    //获取新增精彩内容数据页面外部文章表格数据
    getGoodArtCode: function () {
        page.tableUniId--;
        return {
            id:  page.tableUniId,
            create_time: new Date().getTime(),
            content: $('#goodArtsEditor').code()
        }

    },
    //初始化数据绑定
    initDataBind: function () {
        //初始化富文本编辑器
    	page.editor = new module.editor({
            container: "#objEditer",
            validatorContainer: '#pageForm'
        });

        //初始化信息流推送组件
        page.feedPush = new module.push.feed({
            container: "#objFeedPush",
            validatorContainer: '#pageForm',
            readonly: page.assist.actionIsRelease(),
            defaultPush: {selected: 1, value: module.push.pushEnum.circle},
            formData: page.info.feedData
        });

        //初始化设备推送组件
        page.mobilePush = new module.push.mobile({
            container: "#objMobilePush",
            validatorContainer: '#pageForm',
            readonly: page.assist.actionIsRelease(),
            range: {alluser: 2},
            formData: page.info.mobileData
        });
        var linkart = [];
        var relateart = [];
        if(!page.assist.actionIsAdd()){
            //编辑模式初始化表单内容
            var data = page.info.data;

            $("#title").val(data.title);
            $("#txtSummary").val(data.summary);
            page.editor.setValue(data.content);
            
            linkart = data.relatedUrl;
            relateart = data.related;
            page.SelectedCircles=data.circleList;
            var circleids = "";
            var circlenames = "";
            for(var i=0;i<page.SelectedCircles.length;i++){
            	page.SelectedCircles[i].key=page.SelectedCircles[i].id;
            	page.SelectedCircles[i].value=page.SelectedCircles[i].title;
            	if(i==0){
            		circleids = page.SelectedCircles[i].id;
            		circlenames = page.SelectedCircles[i].title;
            	}
            	else{
            		circleids = circleids+","+page.SelectedCircles[i].id;
            		circlenames = circlenames+","+page.SelectedCircles[i].title;
            	}
            }
            page.SelectedCircleIds = circleids;
            page.SelectedCircleNames = circlenames;
            
            //渲染
            $("#circles").html(
                page.assist.getLabelList(page.SelectedCircles,'value')
            );
            
            page.SelectedUser = data.guest;
            for(var i=0;i<page.SelectedUser.length;i++){
            	page.SelectedUser[i].name=page.SelectedUser[i].user_name;
            	page.SelectedUser[i].company=page.SelectedUser[i].user_identity;
            	page.SelectedUser[i].oldid=page.SelectedUser[i].id;
            	page.SelectedUser[i].value=page.SelectedUser[i].user_name;
            	page.SelectedUser[i].key=page.SelectedUser[i].user_id;
            	page.SelectedUser[i].companywork="";
            }
            //调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
            iCheck.toggle.init("body");
        }

        //初始化文章选择
        page.linkArticle = new module.articleSelector({
        	  container: "#relatedLink",
        	  validatorContainer: "",
        	  readonly: false,
        	  isUnique: true,
        	  articleList:linkart,
        	  callback: function(json){
        		//  console.log(json);
        	  }
        });
        
        page.relatedArticle = new module.articleSelector({
        	  container: "#relationArtTable",
        	  validatorContainer: "",
        	  readonly: false,
        	  isUnique: false,
        	  articleList:relateart,
        	  callback: function(json){
        		//  console.log(json);
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
            title: {/*键名和input name值对应*/
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
    /*
     * 邀请嘉宾表格初始化
     *
     */
    $('#guestTable').bootstrapTable({
        detailView: false,
        // classes: 'table table-hover table-no-bordered',
        data:page.SelectedUser,
        undefinedText: "—",//为空的填充字符
        uniqueId: 'id',
        columns: [{
            field: 'name',
            title: '姓名',
            width: '150px',
            align: 'center'
        },{
            field: 'image',
            title: '图片',
            width: '100px',
            visible: false,
            align: 'center'
        }, {
            field: 'user_identity',
            title: '用户身份',
            align: 'center'
        }, {
            field: 'company',
            title: '单位',
            visible: false,
            align: 'center'
        },{
            field: 'companywork',
            title: '职务',
            visible: false,
            align: 'center'
        },{
            field: '操作',
            title: '删除',
            align: 'center',
            width: '200px',
            formatter:function(value, row, index){
            	var oGetData = $('#guestTable').bootstrapTable("getData");
            	var len = 0;
            	if (oGetData.length == 1) {
            		var len = page.SelectedUser.length || 1;
            	} else {
            		var len = $('#guestTable').bootstrapTable("getData").length;
            	}
            	
                var strHtml = ' <button type="button" class="del btn btn-sm btn-danger">删除</button>';
                strHtml += (index === 0) ? ' <button type="button" class="moveUp btn btn-sm btn-warning" disabled="disabled">上移</button>' : ' <button type="button" class="moveUp btn btn-sm btn-warning">上移</button>';
                strHtml += (index === len-1) ? ' <button type="button" class="moveDown btn btn-sm btn-warning" disabled="disabled">下移</button>' : ' <button type="button" class="moveDown btn btn-sm btn-warning">下移</button>';
                return strHtml;
            },
            events: {
                //上移
                'click .moveUp':function (e, value, row, index) {
                    page.eventHandler.table.moveUp($("#guestTable"), value, row, index)
                },
                //下移
                'click .moveDown':function (e, value, row, index) {
                    page.eventHandler.table.moveDown($("#guestTable"), value, row, index)
                },
                //删除
                'click .del': function (e, value, row, index) {
                    page.eventHandler.table.delete(page.$guestTable, value, row, index);
                    if (page.$guestTable.bootstrapTable('getData').length == 0) {
                    	$('#guestTableContainer').removeClass('has-success').addClass('has-error');
                		$('#guestTablePrompt').removeClass('hidden');
                    }

                	$('#guestTableContainer').removeClass('has-error').addClass('has-success');
            		$('#guestTablePrompt1').addClass('hidden');
                	var guestlist = page.$guestTable.bootstrapTable('getData');
                	for(var i=0;i<guestlist.length;i++){
                		if(guestlist[i].user_identity==""){
                        	$('#guestTableContainer').removeClass('has-success').addClass('has-error');
                    		$('#guestTablePrompt1').removeClass('hidden');
                    		flag = false;
                    		break;
                		}
                	}
                }
            }
        }]
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
});
});