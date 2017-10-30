//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'iCheckPlus', 'toastr', 'sortable', 'datetimepicker', 'helper.qiniu', 'module.fileUpload', 'validator'], function (bs, $, helper, iCheck, toastr) {
    var module = {
        fileUpload: require('module.fileUpload')
    };
    //页面所用到配置page.CONFIG.RELATION
    page.CONFIG = {
        GET_INFO_API: helper.url.getUrlByMapping("admin/sliderManager/find_powersliderInfo.shtml"),                //获取开机滑屏详情接口
        ADD_API: helper.url.getUrlByMapping("admin/sliderManager/insertorupdate_powersliderinfo.shtml"),            //新增/修改开机滑屏接口
        EDIT_API: helper.url.getUrlByMapping(""),      //修改开机滑屏接口
        DEFAULT_STATE: "add",                                                  //页面新增状态
        STATE_LIST: {"edit": {action: "edit", title: "编辑开机滑屏"},
            "add": {action: "add", title: "新增开机滑屏"}
        },     //页面所有状态
        RELATION: "huapinglist.shtml?type=complete",                                        //关联的打开窗口
        UPLOAD_BUCKET: "image"  //存储图片的目录
    };

    //数据相关
    page.action = helper.url.queryString("action") || page.CONFIG.DEFAULT_STATE;
    page.stateInfo = page.CONFIG.STATE_LIST[page.action];
    page.id = helper.url.queryString("id");
    page.ref = decodeURIComponent(helper.url.queryString("ref")) || page.CONFIG.RELATION;
    page.info = {};

    //常用的jquery对象
    page.$form = $('#frmAddHuaping');
    page.$startTime = $('#startTime');
    page.$editEndTime = $('#editEndTime');
    page.$button = $("#divAction button");

    //组件实例
    page.fileUpload = null;

    //页面事件
    page.eventHandler = {
    	//初始化编辑模式下获取页面内容
        initPageInfo: function () {
        	//新增/审核模式判断及设定
            if(!page.CONFIG.STATE_LIST[page.action]) {
                page.action = page.CONFIG.DEFAULT_STATE;
                page.stateInfo = page.CONFIG.STATE_LIST[page.action];
            }
            document.title = page.stateInfo.title;
            $("#pageSubTitle").html(page.stateInfo.title);
            //btnPreservation
        	if (page.action == 'add') {
        		page.assist.initDataBind();
        		toastr.clear();
    			return;
        	}
        	if (page.action == 'edit' && !!page.id) {
        		$.ajax({
        			url: page.CONFIG.GET_INFO_API,
        			data: {slider_id: page.id},
        			dataType: 'json',
        			success: function (ret) {
        				if (ret.code == 0) {
        					page.info = ret.data;
        					page.assist.initDataBind();
        					return;
        				}
        			},
        			error: function () {
        				
        			}
        		});
        	}
        	toastr.clear();
        },
        
        //保存
        preservation: function () {
        	var flag = true;
        	var bv = page.$form.data('bootstrapValidator');
            //手动触发验证
            bv.validate();
            if (!page.$startTime.val().trim()) {
            	$('#startTimeContainer').removeClass('has-success').addClass('has-error');
        		$('#startTimePrompt').removeClass('hidden');
            	flag = false;
            }
            if (!page.$editEndTime.val().trim()) {
            	$('#editEndTimeContainer').removeClass('has-success').addClass('has-error');
        		$('#editEndTimePrompt').removeClass('hidden');
            	flag = false;
            }
            if (page.fileUpload.getFiles().length == 0) {
            	$('#fileSelectorContainer').removeClass('has-success').addClass('has-error');
            	$('#fileSelectorPrompt').removeClass('hidden');
            	flag = false;
            }
            if (bv.isValid() && flag) {
            	var data = page.assist.getParams();
            	page.assist.submitStatus(true);
            	$.ajax({
            		url: page.CONFIG.ADD_API,
            		type : 'POST',
            		data: data,
            		dataType : 'json',
            		success: function (ret) {
            			if (ret.code == 0) {
            				var msg = page.action == 'edit' ? '修改开机滑屏成功' : '新增开机滑屏成功';
            				helper.win.changeQuoto({msg: msg, relation: page.ref});
            				return;
            			}
            			toastr.error("操作失败!", ret.errMsg);
            		},
            		error:function() {
                        toastr.error("操作失败!", "请稍候再重试");
                    },
                    complate: function () {
                    	page.assist.submitStatus(false);
                    }
            	});
            }
        }
    };

    //页面辅助类/方法/属性 page.assist.submitStatus
    page.assist = {
    	initDataBind: function () {
    		//初始化页面内容
    		//初始化图片
    		var images = [];
    		if (page.info.slider_pic_images){
    			var imageData = JSON.parse(page.info.slider_pic_images);
    			for (var i =0 ;i < imageData.length; i++) {
    				images.push(imageData[i].url);
    			}
    		}
    		page.fileUpload = new module.fileUpload({
                container: "#fileSelector",
                existFiles: images && images instanceof Array ? images : [],
                completeCallback: function (data) {
                	$('#fileSelectorContainer').addClass('has-success').removeClass('has-error');
                	$('#fileSelectorPrompt').addClass('hidden');
                	$('.file-preview-thumbnails').sortable();
                },
                deleteCallback: function (data) {
                	if (data.files.length == 0) {
                		$('#fileSelectorContainer').removeClass('has-success').addClass('has-error');
                    	$('#fileSelectorPrompt').removeClass('hidden');
                	}
                	$('.file-preview-thumbnails').sortable();
                }
            });
    		$('.file-preview-thumbnails').sortable();
    		if (page.action != 'add' && page.id) {
    			$('#textName').val(page.info.slider_name);
    			$('#startTime').val(helper.convert.formatDate(page.info.slider_start_time));
    			$('#editEndTime').val(helper.convert.formatDate(page.info.slider_end_time));
    		}
    		
    	},
    	//获取参数
    	getParams: function () {
    		var data = {};
    		var objImaSelecter = $('#objImaSelecter');
        	var imageObjs = objImaSelecter.find('.file-preview-frame');
    		if (page.action == page.CONFIG.STATE_LIST.edit.action && page.id) {
    			data.slider_id = page.id;
    		}
    		data.slider_name = $('#textName').val();
    		data.slider_start_time = helper.convert.formatTimestamp($('#startTime').val());
    		data.slider_end_time = helper.convert.formatTimestamp($('#editEndTime').val());
    		data.slider_pic_images = page.assist.mosaicImage(imageObjs);
    		return data;
    	},
    	//拼接开机滑屏照片
    	mosaicImage: function (obj) {
    		var arr = [];
    		for (var i = 0; i < obj.length; i++) {
    			console.log(i);
    			arr.push({
    				url: obj.eq(i).data('url') ? obj.eq(i).data('url') : obj.eq(i).find('img').attr('src'),
    				order: i+1
    			});
    		}
    		return JSON.stringify(arr);
    	},
    	//页面初始化完成状态，全部=1表示初始化完成
        initFlag: {QINIU: 0},

        //初始化全部完成后操作按钮才可用
        initComplete: function () {
            for(var k in this.initFlag){
                //初始化未完成
                if(!this.initFlag[k]) return;
            }

            page.$button.removeAttr("disabled");
            toastr.clear();
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
        }).on("changeDate",function(el){
        	var _name = $(el.target).attr('name');
        	if (_name == 'startTime') {
        		$('#startTimeContainer').addClass('has-success').removeClass('has-error');
        		$('#startTimePrompt').addClass('hidden');
        	}
        	if (_name == 'editEndTime') {
        		$('#editEndTimeContainer').addClass('has-success').removeClass('has-error');
        		$('#editEndTimePrompt').addClass('hidden');
        	}
        });
    	
    	//初始化获取七牛存储token
        var qiniu = new helper.qiniu.token(page.CONFIG.UPLOAD_BUCKET, function () {
        	page.assist.initFlag.QINIU = 1;
            page.assist.initComplete();
        });
        //当页面打开时每半个小时重新获取一次七牛token
        setInterval(function(){
            qiniu.getToken();
        }, 30*60*1000);
        
        //初始化页面渲染内容
        page.eventHandler.initPageInfo();
        
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
            	textName: {/*键名和input name值对应*/
                    message: '标题验证不通过',
                    validators: {
                        notEmpty: {/*非空提示*/
                            message: '标题不能为空'
                        },stringLength:{
                            max: 100,
                            message: "标题不能超过100个字"
                        }
                    }
                }
            }
        });
        
        //保存
        $('#btnPreservation').click(function () {
        	page.eventHandler.preservation();
        });
        
        //取消
        $("#btnCancel").click(helper.win.close);
    });
});