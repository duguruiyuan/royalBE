//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'iCheckPlus', 'toastr', 'helper.qiniu', 'module.editor', 'module.push', 'module.fileUpload', 'module.articleSelector', 'validator'], function (bs, $, helper, iCheck, toastr) {
    var module = {
        push: require('module.push'),
        editor: require('module.editor'),
        articleSelector: require('module.articleSelector')
    };
  //页面所用到配置page.CONFIG.GET_ARTICLE
    page.CONFIG = {
        GET_ARTICLE_API: helper.url.getUrlByMapping("admin/anonymous/find_anonymousdictlists.shtml"),     //获取信息源的接口
        ADD_API: helper.url.getUrlByMapping("admin/common/commont_push.shtml"),                     //新增信息流接口
        GET_ARTICLE: helper.url.getUrlByMapping("admin/backcommon/find_articlelists.shtml"),     //获取信息源文章列表
        AUDIT_STATE: {state: 2, msg: "提交审核成功，请等待审核！"},             //提交审核状态值
        RELATION: "feedlist.shtml?type=wait",                           //关联的打开窗口
    };

    //常用的jquery对象
    page.$form = $('#frmAddFeed');
    page.$button = $("#divAction button");
    page.$articleTitle = $('#articleTitle');
    page.$articleType = $('#articleType');
    page.$articleSelect = $('#articleSelect');
    page.$articleSelectContainer = $('#articleSelectContainer');
    page.$articleSelectPropmt = $('#articleSelectPropmt');
    page.$button = $("#divAction button");
    
    //组件实例
    page.feedPush = null;
    page.articleSelect = null;

    page.article = {
    		state: 1,
    		obj_id: '',
    		obj_type: ''
    }

    //页面事件
    page.eventHandler = {
        
        //表单验证并提交执行回调
        doSubmit: function (stateInfo) {
            var flag = true;
            if (!page.article.obj_id) {
            	page.$articleSelectContainer.addClass('has-error').removeClass('has-success');
    			page.$articleSelectPropmt.removeClass('hidden');
            	flag = false
            }
            var bv = page.$form.data('bootstrapValidator');
            //手动触发验证
            bv.validate();
            if(bv.isValid() && flag){
            	page.assist.submitStatus(true);
                var data = page.assist.getParams(stateInfo.state);
                $.ajax({
                    url: page.CONFIG.ADD_API,
                    type : 'POST',
                    data: data,
                    dataType : 'json',
                    success : function(ret) {
                        if(ret.code == 0){
                            helper.win.changeQuoto({msg: stateInfo.msg, relation: page.CONFIG.RELATION});
                        }else{
                            toastr.error("操作失败!", ret.errMsg);
                        }
                    },
                    error:function() {
                        toastr.error("操作失败!", "请稍候再重试");
                    },
                    complete: function () {
                    	page.assist.submitStatus(false);
                    }
                });
                return;
            }
        }
    };

    //页面辅助类/方法/属性
    page.assist = {
        //获取页面参数
        getParams: function (state) {
            var data = {};
            data.obj_id = page.article.obj_id;
            data.obj_type = page.article.obj_type;
            data.state = page.article.state;
            //获取推送组件中的数据
            page.feedPush.getFormData(data);

            return data;
        },
        initDataBind: function (pushEnum) {
        	page.feedPush = new module.push.feed({
                container: "#objFeedPush",
                validatorContainer: "#frmAddFeed",
                defaultPush: {selected: 1, value: pushEnum}
            });
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
                
            }
        });
        
        //初始化信息流推送组件
        page.assist.initDataBind(module.push.pushEnum.none);
        
        //初始化信息源
        page.articleSelect = new module.articleSelector({
        	  container: "#articleSelectContent",
        	  validatorContainer: "",
        	  url: page.CONFIG.GET_ARTICLE,
        	  readonly: false,
        	  isUnique: true,
        	  hasExternal: false,
        	  articleList: [],
        	  callback: function (data) {console.log(data);
        		  //page.article.state = data.state;
    		      page.article.obj_id = data.obj_id;
    		      page.article.obj_type = data.obj_type;
        		  page.$articleType.html(helper.obj.getObjLabel(data.obj_type));
        		  page.$articleSelectContainer.removeClass('has-error').addClass('has-success');
              	  page.$articleSelectPropmt.addClass('hidden');
              	  //话题、活动、帮助、帖子
              	  if (data.obj_type == 1) {
              		  page.assist.initDataBind(module.push.pushEnum.all);
              	  } else if (data.obj_type == 11 || data.obj_type == 4 || data.obj_type == 5 || data.obj_type == 19 || data.obj_type == 18) {
              		  page.assist.initDataBind(module.push.pushEnum.circle);
              	  } else {
              		  page.assist.initDataBind(module.push.pushEnum.none);
              	  }
              	  //话题观点、话题相关资讯、活动精彩内容、活动相关报
              	  /*if (data.obj_type == ) {
            		  page.assist.initDataBind(module.push.pushEnum.topicActivity);
            	  }*/
              	  $('#articleSelectContent').find('.close').on("click", function () {
        			  page.article = {};
        			  page.$articleSelectContainer.addClass('has-error').removeClass('has-success');
        			  page.$articleSelectPropmt.removeClass('hidden');
        			  page.$articleType.html('');
        		  });
        	  }
        	})
        
        toastr.clear();
        //调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
        iCheck.toggle.init("body");
        
        page.assist.submitStatus(false);
        
        //提交审核
        $("#btnAudit").click(function() {
            page.eventHandler.doSubmit(page.CONFIG.AUDIT_STATE);
        });

        //取消
        $("#btnCancel").click(helper.win.close);
    });
});