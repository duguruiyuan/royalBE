//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'iCheckPlus', 'toastr', 'datetimepicker', 'helper.qiniu', 'module.fileUpload', 'module.inputSelector', 'module.multSelector', 'validator'], function (bs, $, helper, iCheck, toastr) {
    var module = {
        fileUpload: require('module.fileUpload'),
        inputSelector: require('module.inputSelector'),
        multSelector: require('module.multSelector')
    };
  //页面所用到配置page.CONFIG.VALIDATE
    page.CONFIG = {
        GET_LIST_API: helper.url.getUrlByMapping("admin/legalize/find_legalizelists.shtml"),                     //认证方式接口
        GET_WEIGHT_API: helper.url.getUrlByMapping("admin/weights/find_weightslists.shtml"),                     //用户权重接口
        GET_HY_API: helper.url.getUrlByMapping("admin/common/find_industry.shtml"),                              //行业接口
        GET_ADDRESS: helper.url.getUrlByMapping("json/district.json"),                                           //地址
        INDUSTRY_LIST: helper.url.getUrlByMapping("admin/backcommon/find_industrylists.shtml"),                  //行业列表接口
        INSERT: helper.url.getUrlByMapping("admin/userManager/add_userinfo.shtml"),                               //新增用户
        VALIDATE: helper.url.getUrlByMapping("admin/userManager/validate_mobile.shtml"),            //手机号码验证
        UPLOAD_BUCKET: "avatar"  //存储图片的目录
    };

    //行业数据
    page.industryData = [];

    //上传组件
    page.fileUpload = null;
    page.moduleIndustry = null;
    page.moduleregion = null;
    page.moduleNativeplace = null;
    page.moduleArea = null;

    //常用qiuery节点
    page.$form = $('#frmAddUser');
    page.$selectIndustry = $('#selectIndustry');
    page.$street = $('#street');
    page.$button = $("#divAction button");

    //验证初始化
    page.$form.bootstrapValidator({
        fields: {
        	
        	realname: {/*键名username和input name值对应*/
                message: '姓名验证不通过',
                validators: {
                    notEmpty: {/*非空提示*/
                        message: '姓名不能为空'
                    },stringLength:{
                        max: 30,
                        message: "标题不能超过30个字"
                    }
                }
            },
            mobile:{
                message:'手机号验证不通过',
                validators: {
                	notEmpty: {
                        message: '手机号码不能为空'
                    },
                    /*regexp: {
                        regexp: /^1[3|5|8]{1}[0-9]{9}$/,
                        message: '请输入正确的手机号码'
                    },*/
                    threshold: 5,
                    remote: {
                    	url: page.CONFIG.VALIDATE,
                    	message: '手机号码已被注册',
                    	delay: 500,
                    	type: 'post'
                    }
                }
            },
            isAuth: {
                message:'是否认证验证不通过',
                validators: {
                    notEmpty: {
                        message: '是否认证必须选择'
                    }
                }
            },
            userv: {
                message:'认证方式验证不通过',
                validators: {
                    notEmpty: {
                        message: '认证方式必须选择'
                    }
                }
            },
            company: {
                message: '单位验证不通过',
                validators: {
                    notEmpty: {
                        message: '单位不能为空'
                    }/*,stringLength:{
                        max: 100,
                        message: "单位不能超过100个字"
                    }*/
                }
            },
            companywork: {
                message: '职务验证不通过',
                validators: {
                    notEmpty: {
                        message: '职务不能为空'
                    }/*,stringLength:{
                        max: 100,
                        message: "职务不能超过100个字"
                    }*/
                }
            },
            position: {
                message:'认证方式验证不通过',
                validators: {
                    notEmpty: {
                        message: '认证方式必须选择'
                    }
                }
            },
            companyweb: {
            	message: '单位网址验证不通过',
            	validators: {
            		regexp: {
                        regexp: /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,
                        message: '单位网址不正确'
                    }
            	}
            }
        }
    });
    //页面事件page.eventHandler.submitStatus
    page.eventHandler = {
    		setIndustryList: function (data) {
    			var arr = [];
    			for (var i = 0; i < data.length; i++) {
    				arr.push(data[i].value);
    			}
    			return arr.join('，');
    		},
    		setIndustryData: function (data) {
    			var arr = [];
    			for (var i = 0; i < data.length; i++) {
    				arr.push({
    					industry_id: data[i].key,
    					industry: data[i].value
    				});
    			}
    			return JSON.stringify(arr);
    		},
    		selectedData: function (data) {
    			var arr = [];
    			for (var i = 0; i < data.length; i++) {
    				arr.push({
    					key: data[i].key,
    					value: data[i].value
    				});
    			}
    			return arr;
    		}
    }

    //页面辅助类/方法/属性page.assist.submitStatus
    page.assist = {
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
        //页面初始化完成状态，全部=1表示初始化完成
        initFlag: {WEIGHT: 0, TYPE: 0, QINIU: 0},
        //初始化全部完成后操作按钮才可用
        initComplete: function () {
            for(var k in this.initFlag){
                //初始化未完成
                if(!this.initFlag[k]) return;
            }

            page.$button.removeAttr("disabled");
            toastr.clear();
        }
    }

    //初始化用户权重
    $.ajax({
    	url: page.CONFIG.GET_WEIGHT_API,
    	type: 'post',
    	dataType: 'json',
    	success: function(res){
    		//setOptions($('#weight'),res.data,'weightsname');
    		var data = res.data;
    		var arr = ['<option value="">请选择</option>'];
    		for(var i = 0; i < data.length; i++){
    			i == 0 ? arr.push('<option value="'+data[i].id+'" selected="selected">'+ data[i].weightsname +'</option>') : arr.push('<option value="'+data[i].id+'">'+ data[i].weightsname +'</option>');
    		}
    		$('#weight').append(arr.join(''));
    		page.assist.initFlag.WEIGHT = 1;
            page.assist.initComplete();
    	},
    	error: function(xhr){
    		console.log(xhr);
    	}
    });
    //初始化认证方式
    $.ajax({
    	url: page.CONFIG.GET_LIST_API,
    	type: 'post',
    	dataType: 'json',
    	success: function(res){
    		var data = res.data;
    		var comment = '';
    		var arr = ['<option value="">请选择</option>'];
    		for(var i = 0; i < data.length; i++){
    			comment = data[i].comment == 2 ? '强认证' : '弱认证';
    			arr.push('<option value="'+data[i].id+'">'+data[i].name+'（'+ comment +'）</option>');
    		}
    		$('#userv').append(arr.join(''));
    		page.assist.initFlag.TYPE = 1;
            page.assist.initComplete();
    	},
    	error: function(xhr){
    		console.log(xhr);
    	}
    });
    //初始化上传组件
    page.fileUpload = new module.fileUpload({
        container: "#fileSelector",
        existFiles: [],
        isUnique: true
    });
    //初始化地区选择器
    page.moduleregion = new module.inputSelector({
      container: "#selectRegion",
      validatorContainer: "#frmAddUser",
      readonly: false,
      type: "region",
      callback: function () {
    	  $('#selectRegionContainer').removeClass('has-error').addClass('has-success');
      }
    });
    //初始化家乡选择器
    page.moduleNativeplace = new module.inputSelector({
      container: "#selectNativeplace",
      validatorContainer: "#frmAddUser",
      readonly: false,
      type: "nativeplace",
      callback: function () {
    	  $('#selectNativeplaceContainer').removeClass('has-error').addClass('has-success');
      }
    });
    //初始化单位地址选择器
    page.moduleArea = new module.inputSelector({
      container: "#selectArea",
      validatorContainer: "",
      readonly: false,
      type: "area",
      callback: function () {
    	  page.$street.show();
    	  $('#selectAreaContainer').addClass('has-success');
    	  //$('#selectAreaContainer').removeClass('has-error').addClass('has-success');
    	  //$('#selectAreaPrompt').addClass('hidden');
      },
      unSelectCallback: function () {
    	  page.$street.hide();
    	  //$('#selectAreaContainer').addClass('has-error').removeClass('has-success');
    	  //$('#selectAreaPrompt').removeClass('hidden');
      }
    });

    var addressData = [];
    $(document).ready(function(){
    	/*$.ajax({
    		url: page.CONFIG.GET_HY_API,
    		type: 'post',
    		dataType: 'json',
    		success: function(res){
    			var result = res.data,arr =['<option value="">请选择</option>'];
    			for(var i =0; i < result.length; i++){
    				arr.push('<option value="'+result[i].NAME+'">'+result[i].NAME+'</option>');
    			}
    			$("#position").append(arr.join(''));
    		}
    	});*/
    	/*$.ajax({
    		url: page.CONFIG.GET_ADDRESS,
    		dataType: 'json',
    		success: function(res){
    			addressData = res;
    			var arr =['<option>请选择</option>'];
    			for(var i =0; i < res.length; i++){
    				arr.push('<option value="'+res[i].name+'">'+res[i].name+'</option>');
    			}
    			$("#nativeinfo").append(arr.join(''));
    			$("#nativeinfo1").append(arr.join(''));
    			$("#nativeinfo2").append(arr.join(''));
    		}
    	});*/
    	
    	//选择行业
    	page.$selectIndustry.click(function () {
    		page.moduleIndustry = new module.multSelector({
                title: "请选择要推送的行业",
                url: page.CONFIG.INDUSTRY_LIST,
                dataC: "data",
                keyC: "id",
                valueC: "name",
                pkeyC: "",
                keywordC: "name",
                searchType: 1,
                selectedData: page.industryData,
                callback: function (data) {console.log(data);
                    page.industryData = data;
                	$('#selectIndustryList').html(page.eventHandler.setIndustryList(data));
                	if (data.length == 0) {
                		$('#selectIndustryContainer').addClass('has-error').removeClass('has-success');
                		$('#selectIndustryPrompt').removeClass('hidden');
                	} else {
                		$('#selectIndustryContainer').removeClass('has-error').addClass('has-success');
                		$('#selectIndustryPrompt').addClass('hidden');
                	}
                }
    		});
    	});
    	
    	//初始化日期控件
        $('#birthday').datetimepicker({
            format: 'yyyy-mm-dd',
            weekStart: 1,
            todayBtn: true,
            autoclose: true,
            todayHighlight: true,
            startView: 2,
            minView: 2,
            forceParse: true
        });
    	
    	//调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
        iCheck.toggle.init("body");
        
        //初始化获取七牛存储token
        var qiniu = new helper.qiniu.token(page.CONFIG.UPLOAD_BUCKET, function () {
        	page.assist.initFlag.QINIU = 1;
            page.assist.initComplete();
        });
        //当页面打开时每半个小时重新获取一次七牛token
        setInterval(function(){
            qiniu.getToken();
        }, 30*60*1000);
    	
    	//保存
    	$("#preservation_user").on('click',function(){
    		var flag = true;
    		var bv = page.$form.data('bootstrapValidator');
    		//手动触发验证
            bv.validate();
            if (page.industryData.length == 0) {
            	$('#selectIndustryContainer').addClass('has-error').removeClass('has-success');
        		$('#selectIndustryPrompt').removeClass('hidden');
        		flag = false;
            }
            if(bv.isValid() && flag){
            	//toastr.success('新增用户中，请稍后。。。');
            	page.assist.submitStatus(true);
            	$.ajax({
        			url: page.CONFIG.INSERT,
        			data: {
        				image: page.fileUpload.getFiles()[0],
        				realname: $("#realname").val(),
        				mobile: $("#mobile").val(),
        				weight: $("#weight").val(),
        				birthday: $('#birthday').val(),
        				isAuth: $("[name=radType]:checked").val(),
        				auth_type: $("#userv").val(),
        				company: $("#company").val(),
        				companywork: $("#companywork").val(),
        				reside: page.moduleregion.getValue().value,
        				reside_id: page.moduleregion.getValue().key,
        				nativeinfo: page.moduleNativeplace.getValue().value,
        				nativeinfo_id: page.moduleNativeplace.getValue().key,
        				position: page.eventHandler.setIndustryData(page.industryData),
        				companyaddress: page.moduleArea.getValue().value,
        				companyaddress_id: page.moduleArea.getValue().key,
        				street: $('#streetText').val(),
        				companyintroduction: $("#companyintroduction").val(),
        				companyweb: $('#companyweb').val()
        			},
        			type: 'post',
        			dataType: 'json',
        			success: function(res){
        				console.log(res);
        				if(res.code == 0){
    						parent.page.refresh();
    						parent.page.derive.toastr('新增用户成功');
    	                	parent.layer.close(parent.layer.index);
        					return;
        				}
        				toastr.error("操作失败!", res.errMsg);
        			},
        			error: function(xhr){
        				toastr.error("操作失败!", "请稍候再重试");
        			},
                    complete: function () {
                    	page.assist.submitStatus(false);
                    }
        		});
            }
            bv.getInvalidFields().focus();
    	});
    	
    	//取消
    	$('#btnCancel').on('click',function () {
    		parent.layer.close(parent.layer.index);
    	});
    });
});