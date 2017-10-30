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

//存储页面$对象
page.$form = $('#pageForm');
    page.$title = $('#title');
    page.$place = $('#place');
    page.$address = $('#address');
    page.$circles = $('#circles');
    page.$startTime = $('#startTime');  //活动开始时间
    page.$endTime = $('#endTime');  //活动开始时间
    page.$guestTable = $('#guestTable');//邀请嘉宾表格
        page.addGuestModal = null;//邀请嘉宾模态
//    page.$briefEditor = $('#briefEditor');  //活动介绍
    page.$vedioLink = $('#vedioLink');  //视频直播地址
    page.$relationArtTable = $('#relationArtTable');//相关报道表格
        page.addRelatedArtsModal = null;//相关报道模态

    page.$goodArtTable = $('#goodArtTable');//精彩内容表格
        page.goodArtsModal = null;//精彩内容模态
page.$button = $("#divAction button");
page.info = {data: {}, feedData: {}, mobileData: {}};
page.feedPush = null;//信息流推送
page.mobilePush = null;//设备推送
page.relatedArticle = null;//文章选择
page.placeSelector = null;//地址选择
page.editor = null;
page.goodEditor = null;//精彩活动编辑器
page.fileUpload = null;

//页面所用到AJAX请求的URL
page.CONST = {
    GET_DETAIL:	helper.url.getUrlByMapping("admin/activity/find_activity_detail.shtml"),  //获取详情接口,编辑审核时需要
    GET_CIRCLES_LIST: helper.url.getUrlByMapping("admin/circle/find_circle_list.shtml?status=1&state=1&x=0&y=50"),     			//圈子选择接口
    INSERT_GUEST: helper.url.getUrlByMapping("admin/common/insert_guest.shtml"),                 //新增嘉宾接口
    GET_USER_LIST: helper.url.getUrlByMapping("admin/backcommon/find_userlists.shtml?x=0&y=50"),    //人员选择接口
    UPDATE: helper.url.getUrlByMapping("admin/activity/insert_activity.shtml"),  				//新增活动，修改，审核
    EDIT_API: helper.url.getUrlByMapping("admin/activity/update_activity.shtml"),      			//修改活动接口
    AUDIT_API: helper.url.getUrlByMapping("admin/activity/audit_activity.shtml"),           	//活动审核接口
    PASS_STATE: {state: 1, msg: "审核通过操作成功！"},              //审核通过状态值
    AUDIT_STATE: {state: 2, msg: "提交审核成功，请等待审核！"},             //提交审核状态值
    ADD_STATE: {state: 3, msg: "保存到草稿箱操作成功！"},               //保存草稿状态值
    DEFAULT_STATE: "add",                                                  //页面新增状态
    STATE_LIST: {"edit": {action: "edit", title: "编辑活动"},
        "add": {action: "add", title: "新增活动"},
        "audit": {action: "audit", title: "审核修改活动"},
        "release": {action: "release", title: "已发布活动修改"}
    },
    RELATION: "CMcircleActivityReview.shtml?type=draft",                                        //关联的打开窗口
    UPLOAD_BUCKET: "image"  //存储活动图片的目录
};

page.action = helper.url.queryString("action") || page.CONST.DEFAULT_STATE;
page.stateInfo = page.CONST.STATE_LIST[page.action];
page.id = helper.url.queryString("id");
page.ref = decodeURIComponent(helper.url.queryString("ref")) || page.CONST.RELATION;
if (new RegExp('(circleCMActivity)').test(page.ref)) {
	page.ref = helper.url.getUrlByMapping('admin/' + page.ref.replace(RegExp.$1, 'circleCMAll') + '&ref=circlesAll.shtml');
}

//页面本地变量数据
page.MOCK = {
    action: helper.url.queryString("action"),//页面状态标志新增修改审核
    pageId: helper.url.queryString("id"),//修改审核页面id
    tableUniId:0,//本地数据记录项

    title: '',
    SelectedCircles:[],//已选圈子数据
    SelectedCircleIds:'',//已选圈子字符串id
    SelectedCircleNames:'',//已选圈子名称
    SelectedUser:[],   //已选内部嘉宾数据，可以从选择器选的
    SelectedGuest:[],   //已选外部嘉宾数据，手动添加的
    SelectedSummary:[],   //已选精彩内容
    FeedData: {},//信息流推送保存数据
    MobileData: {}//设备推送保存数据
};

//页面级的帮助对象集合
page.assist = {
    //判断当前模式是否是新增模式
    actionIsAdd: function () {
    	return !this.actionIsEdit() && !this.actionIsAudit() && !this.actionIsRelease();
    },
    //判断当前模式是否是编辑模式
    actionIsEdit: function () {
    	return page.action == page.CONST.STATE_LIST.edit.action && page.id;
    },
    //TODO 判断当前模式是否是编辑审核模式（预留，需求待定）
    actionIsAudit: function () {
    	return page.action == page.CONST.STATE_LIST.audit.action && page.id;
    },
    //判断当前模式是否是已发布模式
    actionIsRelease: function () {
        return page.action == page.CONST.STATE_LIST.release.action && page.id;
    },

    //页面初始化完成状态，全部=1表示初始化完成
    initFlag: {QINIU: 1, EDIT: 1},
    
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
        	'image':page.fileUpload.getFiles().join(","),
            'name': $('#guestName').val(),
            'user_name': $('#guestName').val(),
            'company': $('#guestCompany').val(),
            'companywork': $('#guestPosition').val(),
            'user_identity':$('#user_identity').val(),
            'guestProfile':$('#guestProfile').val()
        }
    },
    //获取页面外部文章表格数据
    getOutArtForm: function () {
        page.MOCK.tableUniId--;
        return {
            id: page.MOCK.tableUniId,
            title: $('#outArtTitle').val(),
            url: $('#outArtLink').val()

        }
    },
    //获取新增精彩内容数据页面外部文章表格数据
    getGoodArtCode: function () {
        page.MOCK.tableUniId--;
        return {
            id:  page.MOCK.tableUniId,
            create_time: new Date().getTime(),
            content: page.goodEditor.getValue()
        }

    },
    //初始化数据绑定
    initDataBind: function () {
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

        var relateart = [];
        var releteplace = {};
        if(!page.assist.actionIsAdd()){
        	var data = page.info.data;
            //编辑模式初始化表单内容
            page.$title.val(page.MOCK.title);
            page.$place.val(page.MOCK.place);
            page.$address.val(data.address);
      //      page.$circles = page.MOCK.SelectedCircles.title.join(",");
            page.$startTime.val(helper.convert.formatDate(page.MOCK.startTime, "yyyy-MM-dd hh:mm"));  //活动开始时间
            page.$endTime.val(helper.convert.formatDate(page.MOCK.endTime, "yyyy-MM-dd hh:mm"));  //活动开始时间
//            page.$guestTable = $('#guestTable');//邀请嘉宾表格
            page.editor.setValue(page.MOCK.content); //活动介绍
            page.$vedioLink.val(data.live_url);  //视频直播地址
            
            relateart = page.MOCK.RelatedList;//相关报道表格
            releteplace.value = page.MOCK.place;
            releteplace.key = "";
            //渲染圈子
            page.MOCK.SelectedCircles = data.circleList;
            var circleids="";
            var circlenames="";
            for(var i=0;i<page.MOCK.SelectedCircles.length;i++){
            	page.MOCK.SelectedCircles[i].key=page.MOCK.SelectedCircles[i].id;
            	page.MOCK.SelectedCircles[i].value=page.MOCK.SelectedCircles[i].title;
            	if(i==0){
            		circleids=page.MOCK.SelectedCircles[i].id;
            		circlenames=page.MOCK.SelectedCircles[i].title;
            	}
            	else{
            		circleids=circleids+","+page.MOCK.SelectedCircles[i].id;
            		circlenames=circlenames+","+page.MOCK.SelectedCircles[i].title;
            	}
            }
            page.MOCK.SelectedCircleIds =circleids;
            page.MOCK.SelectedCircleNames =circlenames;
            //渲染
            $("#circles").html(
                page.assist.getLabelList(page.MOCK.SelectedCircles,'value')
            );
            //嘉宾初始化数据
            page.MOCK.SelectedUser = data.guestList;
            for(var i=0;i<page.MOCK.SelectedUser.length;i++){
            	page.MOCK.SelectedUser[i].name=page.MOCK.SelectedUser[i].user_name;
            	page.MOCK.SelectedUser[i].company=page.MOCK.SelectedUser[i].user_identity;
            	page.MOCK.SelectedUser[i].image=page.MOCK.SelectedUser[i].user_avatar;
            	page.MOCK.SelectedUser[i].id=page.MOCK.SelectedUser[i].user_id;
            	page.MOCK.SelectedUser[i].key = page.MOCK.SelectedUser[i].user_id;
               	page.MOCK.SelectedUser[i].value = page.MOCK.SelectedUser[i].user_name;
            	page.MOCK.SelectedUser[i].companywork="";
            }
            //精彩内容初始化数据
            page.MOCK.SelectedSummary = data.summarylist;  //user_identity
//            page.$goodArtTable = $('#goodArtTable');//精彩内容表格
            //调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
            iCheck.toggle.init("body");
        }else{
            releteplace.value = "";
            releteplace.key = "";
        };
        
        //初始化文章选择
        page.relatedArticle = new module.articleSelector({
        	  container: "#relatedArtice",
        	  validatorContainer: "",
        	  readonly: false,
        	  isUnique: false,
        	  articleList:relateart,
        	  callback: function(json){
        	  }
        });
        //初始化地点选择器
        page.placeSelector = new module.inputSelector({
            container: "#placeSelect",
            validatorContainer: "#pageForm",
            readonly: false,
            data:releteplace,
            type: "area"
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

        $('button').removeAttr("disabled");
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
    formatterData: function (arr) {
    	for (var i = 0, len = arr.length; i < len; i++) {
    		arr[i].display_order = i + 1;
    	}
    	return arr;
    },
    //获取页面发送表单参数
    getPageParams: function (state) {
        var data = {
        	'id':page.id,
            'state': state,
            'title': page.$title.val(),
            'circle_nr_ids': page.MOCK.SelectedCircleIds,
            'circle_nr_names': page.MOCK.SelectedCircleNames,
//            'place': page.$place.val(),
            'address':page.$address.val(),
            'live_url': page.$vedioLink.val(),
            'start_time': helper.convert.formatTimestamp(page.$startTime.val()),
            'end_time': helper.convert.formatTimestamp(page.$endTime.val()),
            'content': page.editor.getValue(),
            'related': JSON.stringify(page.relatedArticle.getArticles()),
            'guest': JSON.stringify(page.assist.formatterData(page.$guestTable.bootstrapTable('getData'))),
            'summary': JSON.stringify(page.$goodArtTable.bootstrapTable('getData'))
        };

        //获取推送组件中的数据
        page.feedPush.getFormData(data);
        page.mobilePush.getFormData(data);

        return data;
    }
};

//页面事件
page.eventHandler = {
    //初始化编辑模式下获取页面内容
    initPageInfo: function () {
        //新增/编辑/审核模式判断及设定
        if(!page.CONST.STATE_LIST[page.action]) {
            page.action = page.CONST.DEFAULT_STATE;
            page.stateInfo = page.CONST.STATE_LIST[page.action];
        }
        document.title = page.stateInfo.title;
        $("#pageSubTitle").html(page.stateInfo.title);

        //新增模式下
        if(page.assist.actionIsAdd()) {
            page.assist.initDataBind();
            return;
        }
        //编辑模式下
        $.ajax({
            url: page.CONST.GET_DETAIL,
            type: 'GET',
            async:false,
            data: {id: page.MOCK.pageId},
            dataType: 'json',
            success: function (res) {
                if(res.code == 0){
//                    page.MOCK.SelectedCircles = res.data.circleList;
                    page.MOCK.startTime = res.data.start_time;
                    page.MOCK.endTime = res.data.end_time;
                    page.MOCK.title = res.data.title;
                    page.MOCK.content = res.data.content;
                    page.MOCK.place = res.data.place;
//                    page.MOCK.GuestList = res.data.guestList;
                    page.MOCK.RelatedList = res.data.relatedlist;
                    page.MOCK.SummaryList = res.data.summarylist;
                    page.info = module.push.dataTransForm(res.data, res.pushdevice);
                    page.assist.initDataBind();
                    return;
                }

                toastr.error("待编辑的活动不存在或发生错误!", "请稍候再重试或联系管理员！");
            },
            error: function () {
                toastr.error("待编辑的活动不存在或发生错误!", "请稍候再重试或联系管理员！");
            }
        })
    },
    circles:{
        openSelector: function(){
            var selector = new module.multSelector({
                url: page.CONST.GET_CIRCLES_LIST,
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
                selectedData: page.MOCK.SelectedCircles,
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
                        $.extend(true,data[i], data[i].originData);
                        data[i].originData = null;
                    };
                    //渲染
                    page.$circles.html(
                        page.assist.getLabelList(data,'value')
                    );
                    //映射
                    page.MOCK.SelectedCircles = data;
                    page.MOCK.SelectedCircleIds = ids;
                    page.MOCK.SelectedCircleNames = names;
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
            $table.bootstrapTable('removeByUniqueId', row.id);
            //移除嘉宾
            if (row.user_type == 1) {
        		for (var i=0;i<page.MOCK.SelectedGuest.length; i++){
        			if(page.MOCK.SelectedGuest[i].id === row.id) page.MOCK.SelectedGuest.splice(i, 1);
                }
        	} else if (row.user_type == 0) {
        		for (var i=0;i<page.MOCK.SelectedUser.length; i++){
        			if(page.MOCK.SelectedUser[i].id === row.id) page.MOCK.SelectedUser.splice(i, 1);
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
                         //   '<input id="guestProfile" name="guestProfile"  type="text" class="form-control">'+
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
//            if(page.MOCK.SelectedCircleIds ===""){
//                toastr.warning('请先选择圈子再选择嘉宾');
//            }else{
                var selector = new module.multSelector({
//                    url: page.CONST.GET_USER_LIST+'&circleids='+ page.MOCK.SelectedCircleIds,
                	url: page.CONST.GET_USER_LIST,
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
                    selectedData: page.MOCK.SelectedUser,
                    callback: function(data){
                    	//转换
                    	console.log(data);
                    	var flag = true;
                       for(var i=0;i<data.length;i++){
                        	var originData = data[i].originData;
                            data[i].name = data[i].value;
                            data[i].user_name = data[i].value;
                            data[i].id = data[i].key;
                            data[i].user_id = data[i].key;
                            data[i].user_avatar = data[i].image;
                            data[i].user_type = 0;//普通用户
                            if(originData!=undefined){
                                data[i].companywork = originData.companywork;
                                data[i].company = originData.company;
                                var company = originData.company?originData.company:'';
                                var companywork = originData.companywork?originData.companywork:'';
                                data[i].user_identity = company+companywork;
                                data[i].user_avatar = originData.image?originData.image:'';
                                data[i].user_v = originData.user_v;
                            }
                            if(data[i].is_send==undefined){
                            	data[i].is_send = 2;
                            }
                            
//                            $.extend(true,data[i], data[i].originData);
                            data[i].originData = null;
                            if(data[i].user_identity==""){
                            	flag =false;
                            }
                        };
                        //渲染
                        page.$guestTable.bootstrapTable('append', page.MOCK.SelectedGuest);
                        page.$guestTable.bootstrapTable('load', data);
                        //映射
                        page.MOCK.SelectedUser = data;
                        if (page.$guestTable.bootstrapTable('getData') != 0) {
                        	$('#guestTableContainer').addClass('has-success').removeClass('has-error');
                    		$('#guestTablePrompt').addClass('hidden');
                        } else {
                        	$('#guestTableContainer').removeClass('has-success').addClass('has-error');
                    		$('#guestTablePrompt').removeClass('hidden');
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
                $.ajax({
                    url: page.CONST.INSERT_GUEST,
                    type : 'POST',
                    data: page.assist.getGuestForm(),
                    dataType : 'json',
                    success : function(res) {
                        if(res.code == 0){
                                // temp.id = res.data.id;
                                // temp.name = res.data.name;
                                // temp.companywork = res.data.user_identity;
                                // temp.company = res.data.user_company;
                        		res.data.user_avatar = image;
                        		res.data.image = image;
                                res.data.user_type = 1;
                                res.data.is_send = 2;
                                res.data.user_identity = res.data.company+"   "+res.data.companywork;
                            page.$guestTable.bootstrapTable('append', res.data);
                            page.MOCK.SelectedGuest.push(res.data);
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
    relatedArts: {	//相关新闻，报道
        openAdd: function() {
             var template = '<div style="width: 100%;padding: 20px">' +
                            '<form id="addOutArtForm" class="form-horizontal">'+
                            '<div class="form-group">'+
                            '<label class="col-sm-2 control-label">标题</label>'+
                            '<div class="col-sm-9">'+
                            '<input id="outArtTitle" name="outArtTitle" type="text" class="form-control">'+
                            '</div>'+
                            '</div>'+
                            '<div class="form-group">'+
                            '<label class="col-sm-2 control-label">链接</label>'+
                            '<div class="col-sm-9">'+
                            '<input id="outArtLink" name="outArtLink"  type="text" class="form-control">'+
                            '</div>'+
                            '</div>'+
                             '<div class="form-group">'+
                             '<button class="btn btn-primary m-t-sm m-r-md pull-right" type="button" onclick="page.eventHandler.relatedArts.insertOutArts()">确认</button>'+
                             '<button class="btn btn-white m-t-sm m-r-xs pull-right" type="button" onclick="page.eventHandler.relatedArts.closeAdd()">取消</button>'+
                             '</div>'+
                            '</form>'+
                            '</div>';
                        page.addRelatedArtsModal = layer.open({
                            type: 1,
                            title: this.title,
                            skin: 'layui-layer-molv', //加上边框
                            area: ['500px', 'auto'], //宽高
                            scrollbar: false,
                            content: template,
                            success: page.eventHandler.relatedArts.initValidator
                            // btn : [ '确认', '取消'],
                            // btn1 : function() {
                            //     page.eventHandler.relatedArts.insertOutArts();
                            // },
                            // btn2 : function() {
                            //     layer.close(page.addRelatedArtsModal);
                            // }
                        });

        },
        closeAdd: function () {
            layer.close(page.addRelatedArtsModal);
        },
        initValidator: function () {
            $('#addOutArtForm').bootstrapValidator({
                //指定不验证的情况
                excluded: [':disabled', ':hidden', ':not(:visible)'],
                message: '验证未通过',
                feedbackIcons: {/*输入框不同状态，显示图片的样式*/
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {/*验证*/
                    outArtTitle: {/*键名username和input name值对应*/
                        message: '标题验证不通过',
                        validators: {
                            notEmpty: {/*非空提示*/
                                message: '标题不能为空'
                            },stringLength:{
                                max: 50,
                                message: "标题不能超过50个字"
                            }
                        }
                    },
                    outArtLink: {/*键名username和input name值对应*/
                        message: '链接验证不通过',
                        validators: {
                            notEmpty: {/*非空提示*/
                                message: '链接地址不能为空'
                            }
                        }
                    }
                }
            });
        },
        openSelect: function(){  		    //插入新增外链文章
            var selector = new module.articleSelector({
                callback:function(data){
                    page.$relationArtTable.bootstrapTable('append', data);
                }
            });
        },
        insertOutArts: function (elem) {
            var bv = $('#addOutArtForm').data('bootstrapValidator');
            //手动触发验证
            bv.validate();
            if(bv.isValid()){
                page.$relationArtTable.bootstrapTable('append', page.assist.getOutArtForm());
                layer.close(page.addRelatedArtsModal);
                return;
            }
            //验证未通过
            bv.getInvalidFields().focus();
        }
    },
    goodArts: {
        openAdd: function () {
            var template = '<div id="goodArtsEditorPanel" style="width: 100%;padding: 20px">' +
                            '<div id="goodArtsEditor"></div>'+
                            '</div>';
            page.goodArtsModal = layer.open({
                type: 1,
                title: this.title,
                skin: 'layui-layer-molv', //加上边框
                area: ['90%', '60%'], //宽高
                scrollbar: false,
                content: template,
                success: function(){
                    page.goodEditor = new module.editor({
                        container: "#goodArtsEditor"
                    });
//                    $('#goodArtsEditor').summernote({
//                        height: (function () {
//                            var height = $('#goodArtsEditorPanel').parent().height()-100;
//                            return height >= 400 ? height : 400;
//                        })()
//                    })
                },
                btn : [ '确认', '取消'],
                btn1 : function() {
                    page.eventHandler.goodArts.insert();
                },
                btn2 : function() {
                    layer.close(page.goodArtsModal);
                }
            });
        },
        insert: function () {//插入精彩内容
            page.$goodArtTable.bootstrapTable('append',page.assist.getGoodArtCode());
            layer.close(page.goodArtsModal);
        }
    },
    doSubmit: function(stateInfo){	//提交表单
        var flag = true;
        var bv = page.$form.data('bootstrapValidator');
        //手动触发验证
        bv.validate();
        if (!page.MOCK.SelectedCircleIds && page.MOCK.SelectedCircleIds.trim() == '') {
        	$('#circlesContainer').removeClass('has-success').addClass('has-error');
    		$('#circlesPrompt').removeClass('hidden');
        	flag = false;
        }
        if (!page.$startTime.val().trim()) {
        	$('#startTimeContainer').removeClass('has-success').addClass('has-error');
    		$('#startTimePrompt').removeClass('hidden');
        	flag = false;
        }
        if (!page.$endTime.val().trim()) {
        	$('#endTimeContainer').removeClass('has-success').addClass('has-error');
    		$('#endTimePrompt').removeClass('hidden');
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
            var data = page.assist.getPageParams(stateInfo.state);
            var url =  page.CONST.UPDATE;
            if(page.assist.actionIsRelease() || page.assist.actionIsAudit())
                url = page.CONST.AUDIT_API;
            else if(page.assist.actionIsEdit())
                url = page.CONST.EDIT_API;
            data.place=page.placeSelector.getValue().value;
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
    
    doUpdate: function(stateInfo){	//提交表单
        var flag = true;
        var bv = page.$form.data('bootstrapValidator');
        //手动触发验证
        bv.validate();
        if (!page.MOCK.SelectedCircleIds && page.MOCK.SelectedCircleIds.trim() == '') {
        	$('#circlesContainer').removeClass('has-success').addClass('has-error');
    		$('#circlesPrompt').removeClass('hidden');
        	flag = false;
        }
        if (!page.$startTime.val().trim()) {
        	$('#startTimeContainer').removeClass('has-success').addClass('has-error');
    		$('#startTimePrompt').removeClass('hidden');
        	flag = false;
        }
        if (!page.$endTime.val().trim()) {
        	$('#endTimeContainer').removeClass('has-success').addClass('has-error');
    		$('#endTimePrompt').removeClass('hidden');
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
            var data = page.assist.getPageParams(stateInfo.state);

            var url = page.CONST.EDIT_API;
            if (page.assist.actionIsAdd()) url =  page.CONST.UPDATE;
            data.place=page.placeSelector.getValue().value;

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

$(document).ready(function () {
    //表单验证初始化
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
                message: '标题验证不通过',
                validators: {
                    notEmpty: {/*非空提示*/
                        message: '标题不能为空'
                    },stringLength:{
                        max: 50,
                        message: "标题不能超过50个字"
                    }
                }
            }/*,
           address: {
                message: '详细地址验证不通过',
                validators: {
                    notEmpty: {
                        message: '详细地址不能为空'
                    },stringLength:{
                        max: 50,
                        message: "详细地址不能超过50个字"
                    }
                }
            }*/
        }
    });

    //初始化日期控件
    $('.form_date').datetimepicker({
        format: "yyyy-mm-dd hh:ii:00",
        weekStart: 1,
        todayBtn:  true,    //是否显示今天按钮
        autoclose: true,    //选择后自动关闭
        todayHighlight: true,   //高亮显示今天日期
        startView: 2,           //从月视图开始显示
        minView: 0,             //最小显示到视图，0：小时视图，1：日视图，2：月视图
        minuteStep: 15,         //小时视图的分钟步长
        forceParse: true        //选择日期不符合要求时尽可能自动转换成符合的
    }).on("change", function (el) {
        //设置日期控件前后日期的依赖
    	var _name = $(el.target).attr('name');
    	if (_name == 'startTime') {
    		$('#startTimeContainer').addClass('has-success').removeClass('has-error');
    		$('#startTimePrompt').addClass('hidden');
    	}
    	if (_name == 'endTime') {
    		$('#endTimeContainer').addClass('has-success').removeClass('has-error');
    		$('#endTimePrompt').addClass('hidden');
    	}
    });


    //初始化介绍编辑器
    page.editor = new module.editor({
        container: "#briefEditor",
        validatorContainer: '#pageForm'
    });


    //初始化获取七牛存储token
    var qiniu = new helper.qiniu.token(page.CONST.UPLOAD_BUCKET, function () {
        page.assist.initFlag.QINIU = 1;
        page.assist.initComplete();
    });
    //当页面打开时每半个小时重新获取一次七牛token
    setInterval(function(){
        qiniu.getToken();
    }, 30*60*1000);

    //初始化页面渲染内容
    page.eventHandler.initPageInfo();

    /*
     * 邀请嘉宾表格初始化
     *
     */
    page.$guestTable.bootstrapTable({
        detailView: false,
        // classes: 'table table-hover table-no-bordered',
        data:page.MOCK.SelectedUser,
        undefinedText: "—",//为空的填充字符
        uniqueId: 'id',
        columns: [{
            field: 'name',
            title: '姓名',
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
            		var len = page.MOCK.SelectedUser.length || 1;
            	} else {
            		var len = $('#guestTable').bootstrapTable("getData").length;
            	}
            	
                var strHtml = ' <button type="button" class="del btn btn-sm btn-danger">删除</button>';
                strHtml += (index === 0) ? ' <button type="button" class="btn btn-sm btn-warning" disabled="disabled">上移</button>' : ' <button type="button" class="moveUp btn btn-sm btn-warning">上移</button>';
                strHtml += (index === len-1) ? ' <button type="button" class="btn btn-sm btn-warning" disabled="disabled">下移</button>' : ' <button type="button" class="moveDown btn btn-sm btn-warning">下移</button>';
                return strHtml;
            },
            events: {
                //上移
                'click .moveUp':function (e, value, row, index) {
                    page.eventHandler.table.moveUp(page.$guestTable, value, row, index);
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

    /*
     * 精彩内容表格初始化
     *
     */
	page.$goodArtTable.bootstrapTable({
        detailView: false,
       // classes: 'table table-hover table-no-bordered',
        data:page.MOCK.SelectedSummary,
        undefinedText: "—",//为空的填充字符
        uniqueId: 'id',
        columns: [{
            field: 'content',
            title: '内容',
            align: 'left'
        }, {
            field: 'user_identity',
            title: '发布人',
            width: '100px',
            align: 'center'
        },{
            field: 'create_time',
            title: '发布时间',
            width: '150px',
            align: 'center',
            formatter: function(value, row, index){
                return helper.convert.formatDate(value);
            }
        },{
            title: '操作',
            align: 'center',
            width: '134px',
            formatter:function(value, row, index){
                var strHtml=' <button type="button" class="btn btn-sm btn-primary" onclick="window.parent.openFrm(this)" data-title="'+ row.title +'-外链" data-index="'+row.url+'">查看</button>';
                    strHtml = ' <button type="button" class="del btn btn-sm btn-danger">删除</button>';
                return strHtml;
            },
            events: {
                //删除
                'click .del': function (e, value, row, index) {
                    page.$goodArtTable.bootstrapTable('removeByUniqueId', row.id);

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
        page.eventHandler.doSubmit(page.CONST.PASS_STATE);
    });
    
    //修改
    $("#btnUpdatePass").click(function() {
        page.eventHandler.doUpdate(page.CONST.PASS_STATE);
    });

    //提交审核
    $("#btnAudit").click(function() {
        page.eventHandler.doUpdate(page.CONST.AUDIT_STATE);
    });

    //保存草稿
    $("#btnSave").click(function() {
        page.eventHandler.doSubmit(page.CONST.ADD_STATE);
    });

    //取消
    $("#btnCancel").click(helper.win.close);
});
});