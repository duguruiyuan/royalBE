//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'iCheckPlus', 'toastr', 'helper.qiniu', 'module.messagePush', 'validator', 'datetimepicker', 'table'], function (bs, $, helper, iCheck, toastr) {
    var module = {
        push: require('module.messagePush')
    };

    //页面所用到配置
    page.CONFIG = {
        GET_INFO_API: helper.url.getUrlByMapping("admin/sendMessage/find_sendmessageInfo.shtml"),                //获取短信接口
        ADD_API: helper.url.getUrlByMapping("admin/sendMessage/insertorupdate_sendmessageinfo.shtml"),                     //新增短信接口
        EDIT_API: helper.url.getUrlByMapping("admin/sendMessage/insertorupdate_sendmessageinfo.shtml"),      //修改短信接口
        AUDIT_API: helper.url.getUrlByMapping("admin/sendMessage/sendordel_sendmessageinfo.shtml"),           //短信审核接口
        PASS_STATE: {state: 1, msg: "审核通过操作成功！"},              //审核通过状态值
        AUDIT_STATE: {state: 2, msg: "提交审核成功，请等待审核！"},             //提交审核状态值
        //ADD_STATE: {state: 3, msg: "保存到草稿箱操作成功！"},               //保存草稿状态值
        DEFAULT_STATE: "add",                                                  //页面新增状态
        STATE_LIST: {"edit": {action: "edit", title: "编辑短信"},
            "add": {action: "add", title: "新增短信"},
            "audit": {action: "audit", title: "审核修改短信"},
            "release": {action: "release", title: "已发布短信修改"}
        },     //页面所有状态
        RELATION: "shortmessagelist.shtml?type=wait"                                        //关联的打开窗口
    };

    //数据相关
    page.action = helper.url.queryString("action") || page.CONFIG.DEFAULT_STATE;
    page.stateInfo = page.CONFIG.STATE_LIST[page.action];
    page.id = helper.url.queryString("id");
    page.ref = decodeURIComponent(helper.url.queryString("ref")) || page.CONFIG.RELATION;
    page.info = {data: {}, mobileData: {}};

    //常用的jquery对象
    page.$form = $('#frmAddMessage');
    page.$button = $("#divAction button");
    page.$sendTime = $('#sendTime');

    //组件实例
    page.mobilePush = null;

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
                data: {message_id: page.id},
                dataType: 'json',
                success: function (res) {console.log(res);
                    if(res.code == 0){
                        page.info = res.data;//module.push.dataTransForm(res.data, res.data);
                        page.assist.initDataBind();
                        return;
                    }

                    toastr.error("待编辑的短信不存在或发生错误!", "请稍候再重试或联系管理员！");
                },
                error: function () {
                    toastr.error("待编辑的短信不存在或发生错误!", "请稍候再重试或联系管理员！");
                }
            })
        },

        //表单验证并提交执行回调
        doSubmit: function (stateInfo) {
            var bv = page.$form.data('bootstrapValidator');
            var flag = true;
            //手动触发验证
            bv.validate();
            if (!page.$sendTime.val().trim()) {
            	$('#sendTimeContainer').removeClass('has-success').addClass('has-error');
        		$('#sendTimePrompt').removeClass('hidden');
            	flag = false;
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
            data.message_content = $('#content').val();
            data.message_send_time = helper.convert.formatTimestamp($('#sendTime').val());
            data.message_id = page.id;
            data.state = state;

            //获取推送组件中的数据
            page.mobilePush.getFormData(data);
            return data;
        },

        //初始化数据绑定
        initDataBind: function () {
        	//初始化发送对象组件
            page.mobilePush = new module.push.mobile({
                container: "#objMobilePush",
                readonly: page.assist.actionIsRelease(),
                range: {alluser: 2},
                formData: page.info
            });

            if(!page.assist.actionIsAdd()){
            	$('#content').val(page.info.message_content);
            	$('#sendTime').val(helper.convert.formatDate(page.info.message_send_time));
            }


            page.assist.initFlag.EDIT = 1;
            page.assist.initComplete();
        },

        //页面初始化完成状态，全部=1表示初始化完成
        initFlag: {EDIT: 0},

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

        //初始化日期控件
        $('.form_date_all').datetimepicker({
            format: "yyyy-mm-dd hh:ii:00",
            weekStart: 1,
            todayBtn:  true,    //是否显示今天按钮
            autoclose: true,    //选择后自动关闭
            todayHighlight: true,   //高亮显示今天日期
            startView: 2,           //从月视图开始显示
            minView: 0,             //最小显示到视图，0：小时视图，1：日视图，2：月视图
            minuteStep: 15,         //小时视图的分钟步长
            forceParse: true        //选择日期不符合要求时尽可能自动转换成符合的
        }).on("changeDate", function () {
    		$('#sendTimeContainer').addClass('has-success').removeClass('has-error');
    		$('#sendTimePrompt').addClass('hidden');
        });

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
            	content: {/*键名和input name值对应*/
                    message: '短信内容验证不通过',
                    validators: {
                        notEmpty: {/*非空提示*/
                            message: '短信内容不能为空'
                        },stringLength:{
                            max: 1000,
                            message: "短信内容不能超过1000个字"
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

        //取消
        $("#btnCancel").click(helper.win.close);
    });
});