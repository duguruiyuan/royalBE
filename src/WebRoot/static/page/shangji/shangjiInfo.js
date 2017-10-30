/**
 * Created by xiegy on 2017/5/8.
 */
//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'toastr', 'sweetalert', 'module.push', 'fancybox'], function (bs, $, helper, toastr, swal) {
    var module = {
        push: require('module.push')
    };

//页面所用到配置
page.CONFIG = {
	GET_INDUSTRY_API: helper.url.getUrlByMapping("admin/backcommon/find_industrylists.shtml"),     //获取行业的接口
	GET_UNIT_API: helper.url.getUrlByMapping("admin/business/find_business_unit.shtml?status=1"),     //获取招商单位的接口
	GET_INFO_API: helper.url.getUrlByMapping("admin/business/get_business_id.shtml"),                //获取招商项目接口
    AUDIT_API: helper.url.getUrlByMapping("admin/business/audit_business_id.shtml"),           //招商项目审核接口
    DELETE_API: helper.url.getUrlByMapping("admin/business/delete_business_id.shtml"),                        //删除招商项目接口
    UPDATE_URL: helper.url.getUrlByMapping("admin/shangjiadd.shtml"),                   					//在审核状态进入修改招商项目url
    ACTION_LIST: {"show": "show", "trash": "trash", "audit": "audit", "release": "release"},                    //页面的所有状态集合
    DELETE_STATUS: 2,       //删除的状态码
    REPLY_STATUS: 1,        //恢复的状态码
    PASS_STATE: 1,          //审核通过的状态码
    NOPASS_STATE: 4,         //审核不通过的状态码
    WAIT_AUDIT_STATE: 2,      //待审核状态码
    DRAFT_STATE: 3            //草稿箱状态码
};

//数据相关
page.action = helper.url.queryString("action") || page.CONFIG.ACTION_LIST.show;
page.id = helper.url.queryString("id");
page.ref = decodeURIComponent(helper.url.queryString("ref"));
page.info = {data: {}, feedData: {}, mobileData: {}};
page.anonymity = [];

//常用的jquery对象
page.$button = $("#divAction button");

//组件实例
page.feedPush = null;
page.mobilePush = null;

//页面事件
page.eventHandler = {
    initAnonymity: function () {
        //初始化获取行业
        $.ajax({
            url: page.CONFIG.GET_INDUSTRY_API,
            type: 'post',
            dataType: 'json',
            success: function(res){
                if(res.code == 0){
                    page.anonymity = res.data;
                    page.assist.showAnonymity();
                    page.assist.initFlag.ANONYMITY = 1;
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
                    page.unit = res.data;
                    page.assist.showUnit();
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

                toastr.error("您查看的招商项目不存在或发生错误!", "请稍候再重试或联系管理员！");
            },
            error: function () {
                toastr.error("您查看的招商项目不存在或发生错误!", "请稍候再重试或联系管理员！");
            }
        });
    },

    audit: function (state) {
        //审核通过/未通过/撤回
        var label = "审核", msg = "", swalType = "";
        switch (state){
            case page.CONFIG.PASS_STATE:
                msg = "您确定通过该招商项目的审核吗？";
                swalType = "warning";
                break;
            case page.CONFIG.NOPASS_STATE:
                msg = "请输入未通过的原因！";
                swalType = "input";
                break;
            case page.CONFIG.WAIT_AUDIT_STATE:
                label = "撤回";
                msg = "您确定撤回该招商项目的发布吗？";
                swalType = "warning";
                break;
            default:
                return;
        }

        swal({
            title: msg,
            type: swalType,
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText:'取消',
            inputPlaceholder: msg,
            closeOnConfirm: false
        }, function () {
            var data = {id: page.id, state: state};
            if(arguments[0] && typeof arguments[0] == "string")
                data.audit_opinion = arguments[0];
            data.unit_id = page.info.data.unit_id;
            data.unit_name = page.info.data.unitname;
            page.feedPush.getFormData(data);
            page.mobilePush.getFormData(data);
            
            swal({title: label + "中，请稍候", type: "info", showConfirmButton: false});
            $.ajax({
                url: page.CONFIG.AUDIT_API,
                type : 'POST',
                data: data,
                dataType : 'json',
                success : function(ret) {
                    switch (parseInt(ret.code)){
                        case 0:
                            helper.win.changeQuoto({msg: label + "完成！", relation: page.ref});
                            break;
                        case 2:
                            //大置顶冲突
                            swal({title: label + "失败", text: ret.errMsg, type: "error"}, function () {
                                page.eventHandler.edit();
                            });
                            break;
                        default:
                            swal(label + "失败", ret.errMsg, "error");
                            break;
                    }
                },
                error:function(ret) {
                    swal(label + "失败", "请稍候再重试或联系管理员", "error");
                }
            });
        });
    },

    //打开修改事件
    edit: function () {
        //跳转到审核状态下的修改页面
        var title = "编辑招商项目";
        var url = page.CONFIG.UPDATE_URL + "?action=";
        if(page.action == page.CONFIG.ACTION_LIST.audit || page.action == page.CONFIG.ACTION_LIST.release){
            title = "审核编辑招商项目";
            url += page.action;
        }else
            url += "edit";

        url += "&id=" + page.id + "&ref=" + encodeURIComponent(page.ref);

        helper.win.changeQuoto({relationTitle: title, relation: url});
    },

    //删除事件
    delete: function (status) {
        var label = "删除";
        if(status == page.CONFIG.REPLY_STATUS)
            label = "恢复";

        swal({
            title: "您确定要{0}该招商项目吗？".Format(label),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: label,
            cancelButtonText:'取消',
            closeOnConfirm: false
        }, function () {
            swal({title: label + "中，请稍候", type: "info", showConfirmButton: false});
            $.ajax({
                url: page.CONFIG.DELETE_API,
                type : 'POST',
                data: {
                    id: page.id,
                    status: status
                },
                dataType : 'json',
                success : function(ret) {
                    switch (parseInt(ret.code)){
                    case 0:
                        helper.win.changeQuoto({msg: label + "完成！", relation: page.ref});
                        break;
                    case 2:
                        //大置顶冲突
                        swal({title: label + "失败", text: ret.errMsg, type: "error"}, function () {
                            page.eventHandler.edit();
                        });
                        break;
                    default:
                        swal(label + "失败", ret.errMsg, "error");
                        break;
                    }
                },
                error:function(ret) {
                    swal(label + "失败", "请稍候再重试或联系管理员", "error");
                }
            });
        });
    }


};

//页面辅助类/方法/属性
page.assist = {
    //初始化数据绑定
    initDataBind: function () {
        //初始化信息流推送组件
        page.feedPush = new module.push.feed({
            readonly: true,
            container: "#objFeedPush",
            defaultPush: {selected: 1, value: module.push.pushEnum.none},
            formData: page.info.feedData
        });

        //初始化设备推送组件
        page.mobilePush = new module.push.mobile({
            readonly: true,
            container: "#objMobilePush",
            range: {alluser: 2},
            formData: page.info.mobileData
        });

        var data = page.info.data;
        //审核状态
        var $state = $("#lblState");
        $state.removeClass("label-inverse");
        switch (data.state){
            case page.CONFIG.PASS_STATE:
                $state.addClass("label-success").html("已发布");
                if(page.action == page.CONFIG.ACTION_LIST.audit){
                    page.action = page.CONFIG.ACTION_LIST.release;
                    page.assist.setButtonShow();
                }
                break;
            case page.CONFIG.WAIT_AUDIT_STATE:
                $state.addClass("label-warning").html("待审核");
                break;
            case page.CONFIG.DRAFT_STATE:
            default:
                $state.addClass("label-warning").html("草稿箱");
                break;
            case page.CONFIG.NOPASS_STATE:
                $state.addClass("label-danger").html("审核未通过");
                if(data.audit_opinion)
                    $state.data("tip", "原因：" + data.audit_opinion);
                break;
        }

        //垃圾箱状态
        var $status = $("#lblStatus");
        if(data.status == page.CONFIG.DELETE_STATUS) {
            $status.removeClass("label-inverse").addClass("label-danger").html("垃圾箱");
            if(page.action != page.CONFIG.ACTION_LIST.trash){
                page.action = page.CONFIG.ACTION_LIST.trash;
                page.assist.setButtonShow();
            }
        }
        else{
            $status.hide();
            if(page.action == page.CONFIG.ACTION_LIST.trash){
                page.action = page.CONFIG.ACTION_LIST.show;
                page.assist.setButtonShow();
            }
        }

        //显示行业
        this.showAnonymity();
        //显示招商单位
    //    this.showUnit();

        //创建者
        var template = '&nbsp;&nbsp;<i class="glyphicon glyphicon-user"></i>&nbsp;<span>{0}</span>&nbsp;&nbsp;{1}&nbsp;{2}';
        var html = template.Format(data.unit_name, '创建于', helper.convert.formatDate(data.create_time));
        $("#divCreatePanel").html(html);
        //编辑者
        if(data.update_name){
            html = template.Format(data.update_name, '修改于', helper.convert.formatDate(data.update_time));
            $("#divEditPanel").html(html);
        }

        //文章内容
        $("#title").html(helper.convert.formatSpaces(data.title));
        $("#unit_name").html(helper.convert.formatSpaces(data.unit_name));
        $("#area").html(helper.convert.formatSpaces(data.area));
        $("#type").html(helper.convert.formatSpaces(data.type));
        $("#money").html(helper.convert.formatSpaces(data.money));
        $("#contact").html(helper.convert.formatSpaces(data.contact));
        $("#phone").html(helper.convert.formatSpaces(data.phone));
        $("#address").html(helper.convert.formatSpaces(data.address));
        var files = data.files;
        var filenames='';
        for(var i=0;i<files.length;i++){
        	if(i==0)
        		filenames='<a target="_blank" href="'+files[i].attachment+'">'+files[i].filename+'</a>';
        	else
        		filenames+='</br><a target="_blank" href="'+files[i].attachment+'">'+files[i].filename+'</a>';
        }
        $("#files").append(filenames);
      //  $("#title").html(helper.convert.formatSpaces(data.title));

        //加载完毕
        this.initFlag.INFO = 1;
        this.initComplete();
    },

    //显示未经证实的界面控制项（已审核通过才显示）
    showUnattested: function () {
        var data = page.info.data;

        var $type = $("#lblType");
        if(data.state != page.CONFIG.PASS_STATE || data.type == 1){
            $("#divTypePanel").hide();
            return;
        }

        //已发布且未经证实
        $("#divTypePanel").show();

        var rate = Math.round(data.true_count / (data.true_count + data.false_count) * 100) || 0;
        $("#spanBelieveReal").html("{0}人（{1}%）相信是真的".Format(data.true_count, rate));
        $("#divBelieveReal").css("width", rate + "%");
        rate = data.true_count + data.false_count == 0 ? 0 : 100 - rate;
        $("#spanDoubtReal").html("{0}人（{1}%）认为是假的".Format(data.false_count, rate));
        $("#divDoubtReal").css("width", rate + "%");

        rate = Math.round(data.true_count_all / (data.true_count_all + data.false_count_all) * 100) || 0;
        $("#spanBelievePlus").html("{0}人（{1}%）相信是真的".Format(data.true_count_all, rate));
        $("#divBelievePlus").css("width", rate + "%");
        rate = data.true_count_all + data.true_count_all == 0 ? 0 : 100 - rate;
        $("#spanDoubtPlus").html("{0}人（{1}%）认为是假的".Format(data.false_count_all, rate));
        $("#divDoubtPlus").css("width", rate + "%");
    },

    //显示行业（要在读取详情及行业全部读取完毕后才加载）
    showAnonymity: function () {
        if(page.anonymity.length == 0)
            return;

        for(var i = 0; i < page.anonymity.length; i++){
            if(page.info.data.industry == page.anonymity[i].id){
                $("#lblAnonymity").html(page.anonymity[i].name);
                return;
            }
        }
    },
    
    //显示行业（要在读取详情及行业全部读取完毕后才加载）
    showUnit: function () {
        if(page.unit.length == 0)
            return;

        for(var i = 0; i < page.unit.length; i++){
            if(page.info.data.unit_id == page.unit[i].id){
                $("#lblUnit").html(page.unit[i].title);
                return;
            }
        }
    },
    
    //页面初始化完成状态，全部=1表示初始化完成
    initFlag: {ANONYMITY: 0,UNIT:0, INFO: 1},

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
    submitStatus: function ($btn, type) {
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

    //初始化页面渲染内容
    page.eventHandler.initPageInfo();

    //初始化获取行业
    page.eventHandler.initAnonymity();
    //初始化招商单位
    page.eventHandler.initUnit();

    //各小标签的提示符
    $("#divLabelPanel .label").mouseenter(function () {
        layer.tips($(this).data("tip"), this, {tips: 3});
    });

    //初始化各种状态下的按钮
    if(!page.CONFIG.ACTION_LIST[page.action])
        page.action = page.CONFIG.ACTION_LIST.show;
    page.assist.setButtonShow();

    //按钮操作各个事件
    //审核通过事件
    $("#btnAuditPass").click(function () {
        page.eventHandler.audit(page.CONFIG.PASS_STATE);
    });
    //审核不通过事件
    $("#btnAuditNoPass").click(function () {
        page.eventHandler.audit(page.CONFIG.NOPASS_STATE);
    });
    //撤销发布事件
    $("#btnBackout").click(function () {
        page.eventHandler.audit(page.CONFIG.WAIT_AUDIT_STATE);
    });

    //审核状态下跳转到修改（适用于局部小改的情况）
    $("#btnEdit").click(page.eventHandler.edit);

    //删除事件
    $("#btnDelete").click(function () {
        page.eventHandler.delete(page.CONFIG.DELETE_STATUS);
    });
    //恢复事件
    $("#btnReply").click(function () {
        page.eventHandler.delete(page.CONFIG.REPLY_STATUS);
    });
    //取消事件
    $("#btnCancel").click(helper.win.close);
});
});