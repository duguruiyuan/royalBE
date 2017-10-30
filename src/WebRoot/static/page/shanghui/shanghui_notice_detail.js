/**
 * Created by xiegy on 2017/5/8.
 */
//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastrPlus', 'module.push', 'datetimepicker', 'table', 'tableEditable'], function (bs, $, helper, swal, layer, toastr) {
//页面所用到配置
page.CONFIG = {
     //获取匿名主题的接口
    GET_INFO_API: helper.url.getUrlByMapping("admin/shanghui/find_notice_detail.shtml"), //获取商会通知接口
    ACTION_LIST: {"show": "show", "trash": "trash", "audit": "audit", "release": "release"},//页面的所有状态集合
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

    //初始化编辑模式下获取页面内容
    initPageInfo: function () {
        $.ajax({
            url: page.CONFIG.GET_INFO_API,
            type: 'POST',
            data: {NID: page.id},
            dataType: 'json',
            success: function (res) {
                if(res.code == 0){
//                    page.info = module.push.dataTransForm(res.data, res.pushdevice);
                	page.info.data = res.data;
                    page.assist.initDataBind();
                    return;
                }

                toastr.error("您查看的商会通知不存在或发生错误!", "请稍候再重试或联系管理员！");
            },
            error: function () {
                toastr.error("您查看的商会通知不存在或发生错误!", "请稍候再重试或联系管理员！");
            }
        });
    },



    //删除事件
    delete: function (status) {
        var label = "删除";
        if(status == page.CONFIG.REPLY_STATUS)
            label = "恢复";

        swal({
            title: "您确定要{0}该秘闻吗？".Format(label),
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
                    if(ret.code == 0){
                        helper.win.changeQuoto({msg: label + "成功！", relation: page.ref});
                    }else{
                        swal(label + "失败", ret.errMsg, "error");
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

        var data = page.info.data;
        console.info('发布时间',data.PUBLISHTIME);
        //创建者
        var template = '&nbsp;&nbsp;<i class="glyphicon glyphicon-user"></i>&nbsp;<span>{ }</span>&nbsp;&nbsp;{1}&nbsp;{2}';
        var html = template.Format(data.AUTHOR, '发布于', helper.convert.formatDate(data.PUBLISHTIME.time));
        $("#divCreatePanel").html(html);
        //编辑者
//        if(data.update_name){
//            html = template.Format(data.update_name, '修改于', helper.convert.formatDate(data.update_time));
//            $("#divEditPanel").html(html);
//        }

        //文章内容
//        if(data.is_length == 1){
            //长文
            $("#typLength").show();
            $("#typShort").hide();
            $("#txtTitle").html(data.TITLE);
//            $("#txtSummary").html(helper.convert.formatSpaces(data.summary));
            $("#txtContent").html(data.CONTENT);
//        }else {
//            //短文
//            $("#typLength").hide();
//            $("#typShort").show();
//            $("#txtShortContent").html(helper.convert.formatSpaces(data.content));
//            var images = data.image.split(",");
//            if(images.length > 0){
//                template = '<a class="fancybox" rel="group" href="{0}" title=""><img alt="" style="height: 240px" src="{0}" /></a>';
//                html = '';
//                for(var i = 0; i < images.length; i++){
//                    html += template.Format(images[i]);
//                }
//                $("#divShortImages").html(html).find(".fancybox").fancybox();
//            }
//        }

        //加载完毕
        this.initFlag.INFO = 1;
//        this.initComplete();
    },

    //显示未经证实的界面控制项（已审核通过才显示）
//    showUnattested: function () {
//        var data = page.info.data;
//
//        var $type = $("#lblType");
//        if(data.state != page.CONFIG.PASS_STATE || data.type == 1){
//            $("#divTypePanel").hide();
//            return;
//        }
//
//        //已发布且未经证实
//        $("#divTypePanel").show();
//
//        var rate = Math.round(data.true_count / (data.true_count + data.false_count) * 100) || 0;
//        $("#spanBelieveReal").html("{0}人（{1}%）相信是真的".Format(data.true_count, rate));
//        $("#divBelieveReal").css("width", rate + "%");
//        rate = data.true_count + data.false_count == 0 ? 0 : 100 - rate;
//        $("#spanDoubtReal").html("{0}人（{1}%）认为是假的".Format(data.false_count, rate));
//        $("#divDoubtReal").css("width", rate + "%");
//
//        rate = Math.round(data.true_count_all / (data.true_count_all + data.false_count_all) * 100) || 0;
//        $("#spanBelievePlus").html("{0}人（{1}%）相信是真的".Format(data.true_count_all, rate));
//        $("#divBelievePlus").css("width", rate + "%");
//        rate = data.true_count_all + data.true_count_all == 0 ? 0 : 100 - rate;
//        $("#spanDoubtPlus").html("{0}人（{1}%）认为是假的".Format(data.false_count_all, rate));
//        $("#divDoubtPlus").css("width", rate + "%");
//    },

    //显示匿名主题（要在读取详情及匿名主题全部读取完毕后才加载）
//    showAnonymity: function () {
//        if(page.anonymity.length == 0 || !page.info.data.anonymous_type)
//            return;
//
//        for(var i = 0; i < page.anonymity.length; i++){
//            if(page.info.data.anonymous_type == page.anonymity[i].code){
//                $("#lblAnonymity").html(page.anonymity[i].name);
//                return;
//            }
//        }
//    },

    //页面初始化完成状态，全部=1表示初始化完成
    initFlag: {ANONYMITY: 0, INFO: 1},

    //初始化全部完成后操作按钮才可用
//    initComplete: function () {
//        for(var k in this.initFlag){
//            //初始化未完成
//            if(!this.initFlag[k]) return;
//        }
//
//        page.$button.removeAttr("disabled");
//        toastr.clear();
//    },

    //变更页面按钮的状态（根据页面状态）
//    setButtonShow: function () {
//        page.$button.each(function () {
//            if($(this).data("action").indexOf(page.action) == -1)
//                $(this).hide();
//            else
//                $(this).show();
//        });
//        $("#divAction button:visible").eq(0).removeClass("btn-warning").addClass("btn-primary");
//    },

    //变更各个操作按钮操作状态
//    submitStatus: function ($btn, type) {
//        if(type){
//            //提交
//            page.$button.attr("disabled", "disabled");
//            toastr.info("提交中，请稍候...");
//            return;
//        }
//
//        //提交完成/失败
//        page.$button.removeAttr("disabled");
//    }
};

//页面初始化
$(document).ready(function(){
    toastr.info("初始化加载中，请稍候...");

    //初始化页面渲染内容
    page.eventHandler.initPageInfo();

    //初始化获取匿名主题
//    page.eventHandler.initAnonymity();

    //各小标签的提示符
//    $("#divLabelPanel .label").mouseenter(function () {
//        layer.tips($(this).data("tip"), this, {tips: 3});
//    });

    //初始化各种状态下的按钮
//    if(!page.CONFIG.ACTION_LIST[page.action])
//        page.action = page.CONFIG.ACTION_LIST.show;
//    page.assist.setButtonShow();

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