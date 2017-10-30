//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'toastr', 'sweetalert', 'module.messagePush'], function (bs, $, helper, toastr, swal) {
    var module = {
        push: require('module.messagePush')
    };

    //页面所用到配置
    page.CONFIG = {
        GET_INFO_API: helper.url.getUrlByMapping("admin/sendMessage/find_sendmessageInfo.shtml"),                //获取短信接口
        AUDIT_API: helper.url.getUrlByMapping("admin/sendMessage/sendordel_sendmessageinfo.shtml"),           //短信审核接口
        DELETE_API: helper.url.getUrlByMapping("admin/sendMessage/sendordel_sendmessageinfo.shtml"),                        //删除短信接口
        ACTION_LIST: {"show": "show", "trash": "trash", "audit": "audit", "release": "release"},                    //页面的所有状态集合
        //OBJ_TYPE: null,            //短信obj对象码
        DELETE_STATUS: 2,       //删除的状态码
        REPLY_STATUS: 1,        //恢复的状态码
        PASS_STATE: 1,          //审核通过的状态码
        NOPASS_STATE: 4,         //审核不通过的状态码
        WAIT_AUDIT_STATE: 2,      //待审核状态码
        DRAFT_STATE: 3,            //草稿箱状态码
        EDIT_HTML: helper.url.getUrlByMapping("admin/shortmessagehandle.shtml")
    };

    //数据相关
    page.action = helper.url.queryString("action") || page.CONFIG.ACTION_LIST.show;
    page.id = helper.url.queryString("id");
    page.ref = decodeURIComponent(helper.url.queryString("ref"));
    page.info = {data: {}, mobileData: {}};

    //常用的jquery对象
    page.$button = $("#divAction button");

    //组件实例
    page.mobilePush = null;

    //页面事件
    page.eventHandler = {

        //初始化编辑模式下获取页面内容
        initPageInfo: function () {
            $.ajax({
                url: page.CONFIG.GET_INFO_API,
                type: 'POST',
                data: {message_id: page.id},
                dataType: 'json',
                success: function (res) {console.log(res);
                    if(res.code == 0){
                    	page.info = res.data;
                        page.assist.initDataBind();
                        return;
                    }

                    toastr.error("您查看的短信不存在或发生错误!", "请稍候再重试或联系管理员！");
                },
                error: function () {
                    toastr.error("您查看的短信不存在或发生错误!", "请稍候再重试或联系管理员！");
                }
            });
        },

        audit: function (state) {
            //审核通过/未通过/撤回
            var label = "审核", msg = "", swalType = "";
            switch (state){
                case page.CONFIG.PASS_STATE:
                    msg = "您确定通过该短信的审核吗？";
                    swalType = "warning";
                    break;
                case page.CONFIG.NOPASS_STATE:
                    msg = "请输入未通过的原因！";
                    swalType = "input";
                    break;
                case page.CONFIG.WAIT_AUDIT_STATE:
                    label = "撤回";
                    msg = "您确定撤回该短信的发布吗？";
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
                var data = {message_id: page.id, state: state};
                if(arguments[0] && typeof arguments[0] == "string") data.audit_opinion = arguments[0];

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
            //跳转到修改页面
            //helper.win.open({name: '编辑短信', url: page.CONFIG.EDIT_HTML + '?action=edit&id=' + page.id});
            helper.win.changeQuoto({relationTitle: '编辑短信', relation: page.CONFIG.EDIT_HTML + '?action=edit&id=' + page.id});
        },

        //删除事件
        delete: function (status) {
            var label = "删除";
            if(status == page.CONFIG.REPLY_STATUS)
                label = "恢复";

            swal({
                title: "您确定要{0}该短信吗？".Format(label),
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
                    	message_id: page.id,
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

            //初始化设备推送组件
            page.mobilePush = new module.push.mobile({
                readonly: true,
                container: "#objMobilePush",
                range: {alluser: 1},
                formData: page.info
            });

            var data = page.info;
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

            //创建者
            var template = '&nbsp;&nbsp;<i class="glyphicon glyphicon-user"></i>&nbsp;<span>{0}</span>&nbsp;&nbsp;{1}&nbsp;{2}';
            var html = template.Format(data.author_name, '创建于', helper.convert.formatDate(data.create_time));
            $("#divCreatePanel").html(html);
            //编辑者
            if(data.update_name){
                html = template.Format(data.update_name, '修改于', helper.convert.formatDate(data.update_time));
                $("#divEditPanel").html(html);
            }

            //内容
            $('#content').html(data.message_content);
        	$('#sendTime').html(helper.convert.formatDate(data.message_send_time));

            //加载完毕
            this.initFlag.INFO = 1;
            this.initComplete();
        },

        //页面初始化完成状态，全部=1表示初始化完成
        initFlag: {INFO: 1},

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

        //按钮操作各个事件
        //审核通过事件
        $("#btnAuditPass").click(function () {
            page.eventHandler.audit(page.CONFIG.PASS_STATE);
        });
        //审核不通过事件
        /*$("#btnAuditNoPass").click(function () {
            page.eventHandler.audit(page.CONFIG.NOPASS_STATE);
        });*/
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