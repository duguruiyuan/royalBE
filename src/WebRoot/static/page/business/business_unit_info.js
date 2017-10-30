//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'toastr', 'sweetalert', 'module.push', 'fancybox'], function (bs, $, helper, toastr, swal) {
    var module = {
        push: require('module.push')
    };
//页面所用到配置
page.CONFIG = {
    GET_INFO_API: helper.url.getUrlByMapping("admin/business/get_business_unit_id.shtml"),              //获取招商单位接口
    DELETE_API: helper.url.getUrlByMapping("admin/business/update_business_unit_id.shtml"),             //删除招商单位接口
    UODATE_URL: helper.url.getUrlByMapping("admin/businessunitadd.shtml"),             					//编辑页面
    ACTION_LIST: {"show": "show", "trash": "trash", "audit": "audit", "release": "release"},            //页面的所有状态集合
    DELETE_STATUS: 2,       //删除的状态码
    REPLY_STATUS: 1         //恢复的状态码
};

//数据相关
page.action = helper.url.queryString("action") || page.CONFIG.ACTION_LIST.show;
page.id = helper.url.queryString("id");
page.ref = decodeURIComponent(helper.url.queryString("ref"));
page.info = {data: {}};
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
            data: {id: page.id},
            dataType: 'json',
            success: function (res) {
                if(res.code == 0){
                    page.info.data = res.data;
                    page.assist.initDataBind();
                    return;
                }

                toastr.error("您查看的招商单位不存在或发生错误!", "请稍候再重试或联系管理员！");
            },
            error: function () {
                toastr.error("您查看的招商单位不存在或发生错误!", "请稍候再重试或联系管理员！");
            }
        });
    },

    //打开修改事件
    edit: function () {
        // //跳转到各种状态的修改页面
        helper.win.open({name: "编辑招商单位", url: page.CONFIG.UODATE_URL+"?action=edit&id="+page.id});
    },

    //删除事件
    delete: function (status) {
        var label = "删除";
        if(status == page.CONFIG.REPLY_STATUS)
            label = "恢复";

        swal({
            title: "您确定要{0}该招商单位吗？".Format(label),
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


        //文章内容
        var logo = data.avatar ? data.avatar : 'http://logo.static.shangbangbang.com/zhaoshangdanwei.png';
        $('#unitLogo').attr('src',logo);
        $("#txtTitle").html(data.title);
        $("#txtAddress").html(data.address);
        $("#txtPhone").html(data.phone);
        $("#txtProfile").html(data.profile);
        $("#txtUsername").html(data.username);

        //加载完毕
        this.initFlag.INFO = 1;
        this.initComplete();
    },


    //页面初始化完成状态，全部=1表示初始化完成
    initFlag: {INFO: 0},

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

    //各小标签的提示符
    $("#divLabelPanel .label").mouseenter(function () {
        layer.tips($(this).data("tip"), this, {tips: 3});
    });

    //初始化各种状态下的按钮
    if(!page.CONFIG.ACTION_LIST[page.action])
        page.action = page.CONFIG.ACTION_LIST.show;
    page.assist.setButtonShow();

    //跳转到修改
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