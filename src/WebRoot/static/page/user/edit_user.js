//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'iCheckPlus', 'toastr', 'fancybox', 'datetimepicker', 'helper.qiniu', 'module.fileUpload', 'module.inputSelector', 'module.multSelector', 'validator'], function (bs, $, helper, iCheck, toastr, fancybox) {
    var module = {
        fileUpload: require('module.fileUpload'),
        inputSelector: require('module.inputSelector'),
        multSelector: require('module.multSelector')
    };
  //页面所用到配置
    page.CONFIG = {
        GET_USER_API: helper.url.getUrlByMapping("admin/userManager/get_userinfo.shtml"),    //获取用户信息接口
        GET_WEIGHT_API: helper.url.getUrlByMapping("admin/weights/find_weightslists.shtml"),    //获取用户权重接口
        GET_AUTH_API: helper.url.getUrlByMapping("admin/legalize/find_legalizelists.shtml"),         //获取认证方式接口
        GET_ADDRES_API: helper.url.getUrlByMapping("json/district.json"),         //获取地址接口
        UPDATE_USER_API: helper.url.getUrlByMapping("admin/userManager/update_userinfo.shtml"),         //修改用户信息接口
        INDUSTRY_LIST: helper.url.getUrlByMapping("admin/backcommon/find_industrylists.shtml"),                  //行业列表接口
        VALIDATE: helper.url.getUrlByMapping("admin/userManager/validate_mobile.shtml"),            //手机号码验证
        DELETE: helper.url.getUrlByMapping("admin/userManager/delete_userinfo.shtml"),            //删除用户
        UPLOAD_BUCKET: "avatar"  //存储图片的目录
    };

    //数据相关
    page.id = helper.url.queryString("id");
    page.info = {};
    page.industry = [];  
    page.addressData = {region: {}, nativeplace: {}, area: {}}  //地区数据

    //常用的jquery对象
    page.$form = $('#frmAddUser');
    page.$button = $("#divAction button");
    page.$selectIndustry = $('#selectIndustry');
    page.$street = $('#street');
    page.$birthday = $('#birthday');

    //组件实例
    page.fileUpload = null;
    page.headerUpload = null;
    page.moduleIndustry = null;
    page.moduleregion = null;
    page.moduleNativeplace = null;
    page.moduleArea = null;

    //页面事件
    page.eventHandler = {
        initWEIGHT: function (id) {
            //初始化获取用户权重
            $.ajax({
                url: page.CONFIG.GET_WEIGHT_API,
                type: 'post',
                dataType: 'json',
                success: function(res){
                    if(res.code == 0){
                        var result = res.data, selected = '';

                        var arr = ['<option value="">请选择</option>'];
                        for(var i = 0; i < result.length; i++){
                        	selected = id == result[i].id ? ' selected="selected"' : '';
                            arr.push('<option value="' + result[i].id + '"' + selected +'>' + result[i].weightsname + '</option>');
                        }
                        $('#weight').html(arr.join(''));
                        page.assist.initFlag.WEIGHT = 1;
                        page.assist.initComplete();
                        return;
                    }

                    toastr.error("OMG!", res.errMsg);
                },
                error: function(){
                    toastr.error("OMG!", "获取用户权重列表错误，请稍候再重试！");
                }
            });
        },
        
        initTYPE: function (id) {
            //初始化获取认证方式
            $.ajax({
                url: page.CONFIG.GET_AUTH_API,
                type: 'post',
                dataType: 'json',
                success: function(res){
                    if(res.code == 0){
                        var result = res.data, selected = '', comment = '';

                        var arr = ['<option value="">请选择</option>'];
                        for(var i = 0; i < result.length; i++){
                            selected = id ==result[i].id ? ' selected="selected"' : '';
                            comment = result[i].comment == 2 ? '强认证' : '弱认证';
                            arr.push('<option value="' + result[i].id + '"' + selected +'>' + result[i].name + '（'+ comment +'）' + '</option>');
                        }
                        $('#userv').html(arr.join(''));
                        page.assist.initFlag.TYPE = 1;
                        page.assist.initComplete();
                        return;
                    }

                    toastr.error("OMG!", res.errMsg);
                },
                error: function(){
                    toastr.error("OMG!", "获取认证方式列表错误，请稍候再重试！");
                }
            });
        },

        //初始化编辑模式下获取页面内容
        initPageInfo: function () {

            $.ajax({
                url: page.CONFIG.GET_USER_API,
                type: 'POST',
                data: {usid: page.id},
                dataType: 'json',
                success: function (res) {
                    if(res.code == 0){
                    	page.info = res.userInfo;
                    	page.addressData.region = {key: page.info.reside_id, value: page.info.reside};
                    	page.addressData.nativeplace = {key: page.info.nativeinfo_id, value: page.info.nativeinfo};
                    	page.industry = page.assist.selectedData(page.info.industry);
                    	page.addressData.area = {key: page.info.companyaddress_id, value: page.info.companyaddress};
                        page.assist.initDataBind();
                        return;
                    }

                    toastr.error("待编辑的用户不存在或发生错误!", "请稍候再重试或联系管理员！");
                },
                error: function () {
                    toastr.error("待编辑的用户不存在或发生错误!", "请稍候再重试或联系管理员！");
                }
            })
        },

        //表单验证并提交执行回调
        doSubmit: function () {
            var bv = page.$form.data('bootstrapValidator');
            //手动触发验证
            bv.validate();
            var flag = true;
            if (page.industry.length == 0) {
            	$('#selectIndustryContainer').addClass('has-error').removeClass('has-success');
        		$('#selectIndustryPrompt').removeClass('hidden');
        		flag = false;
            }
            if(bv.isValid() && flag){
                var data = page.assist.getParams();
                var url =  page.CONFIG.UPDATE_USER_API;

                page.assist.submitStatus(1);
                $.ajax({
                    url: url,
                    type : 'POST',
                    data: data,
                    dataType : 'json',
                    success : function(ret) {
                        if(ret.code == 0){
                        	parent.page.refresh();
        					parent.page.derive.toastr('修改用户成功');
        					parent.layer.close(parent.layer.index);
        					return;
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

        //获取页面参数
        getParams: function () {
            var data = {
        		usid: page.id,
    			image: $('#headImageUrl').val(),
    		    realname: $('#realname').val(),
    		    password: $('#user_password').val(),
    		    mobile: $('#mobile').val(),
    		    weight: $("#weight").val(),
    		    birthday: page.$birthday.val(),
    		    isAuth: $("[name=radType]:checked").val(),
    		    company: $('#company').val(),
    		    companywork: $('#companywork').val(),
    		    auth_type: $("#userv").val(),
    		    company: $('#company').val(),
    		    companywork: $('#companywork').val(),
    		    reside: page.moduleregion.getValue().value,
    		    reside_id: page.moduleregion.getValue().key,
    		    nativeinfo: page.moduleNativeplace.getValue().value,
    			nativeinfo_id: page.moduleNativeplace.getValue().key,
    		    position: page.assist.setIndustryData(page.industry),
    		    companyaddress: page.moduleArea.getValue().value,
    			companyaddress_id: page.moduleArea.getValue().key,
    			street: $('#streetText').val(),
    		    companyintroduction: $("#companyintroduction").val(),
    		    companyweb: $('#companyweb').val()
            };

            return data;
        },

        //初始化数据绑定
        initDataBind: function () {
        	
        	//初始化常驻地选择器
    		page.moduleregion = new module.inputSelector({
    		  container: "#selectRegion",
    		  validatorContainer: "#frmAddUser",
    		  readonly: false,
    		  type: "region",
    		  data: page.addressData.region.key ? page.addressData.region : '',
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
    		  data: page.addressData.nativeplace.key ? page.addressData.nativeplace : '',
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
    		  data: page.addressData.area.key ? page.addressData.area : '',
    		  callback: function () {
    			  page.$street.show();
    			  $('#selectAreaContainer').addClass('has-success');
    		  },
    		  unSelectCallback: function () {
    			  page.$street.hide();
    		  }
    		});
    		
            //初始化表单内容
        	if(1 == page.info.isAuth){
                $("[name=radType]:checked").removeAttr("checked");
                $("[name=radType][value=1]").attr("checked", "checked");
            }
        	
            $("#weight").val(page.info.weight);
            $("#userv").val(page.info.auth_type);
            $('#selectIndustryList').html(page.assist.setIndustryList(page.assist.selectedData(page.info.industry)));
            console.log(page.info);
            if (page.info.realname && page.info.realname.trim() != '') $('#realname').val(page.info.realname);
            if (page.info.authList && page.info.authList.length != 0) {
            	var image = page.info.authList[0].IMAGE || '';
            	if (image.trim() != '') {
            		var template = '<a class="fancybox" rel="group" href="{0}" title=""><img alt="" style="height: 120px" src="{0}" /></a>';
                    var html = template.Format(image);
                    $("#materialSelector").parents('.form-group').removeClass('hidden');
                    $("#materialSelector").html(html).find(".fancybox").fancybox();
            	}
            }
            if (page.info.mobile && page.info.mobile.trim() != '') $('#mobile').val(page.info.mobile);
            if (page.info.company && page.info.company.trim() != '') $('#company').val(page.info.company);
    		if (page.info.companywork && page.info.companywork.trim() != '') $('#companywork').val(page.info.companywork);
    		if (page.info.companyintroduction && page.info.companyintroduction.trim() != '') $('#companyintroduction').val(page.info.companyintroduction);
    		if (page.info.companyaddress) {
    			page.$street.show();
    			$('#streetText').val(page.info.street);
    		}
    		if (page.info.companyweb && page.info.companyweb.trim() != '') $('#companyweb').val(page.info.companyweb);
    		if (page.info.birthday && page.info.birthday.trim() != '') page.$birthday.val(page.info.birthday);
    		
            //调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
            iCheck.toggle.init("body");

            page.assist.initFlag.EDIT = 1;
            page.assist.initUpload();
            page.assist.initComplete();
        },

        //初始化七牛完成，编辑模式下加载数据完成，以上两者都完成后才初始化上传组件
        initUpload: function () {
            if(page.assist.initFlag.QINIU == 1 && page.assist.initFlag.EDIT == 1){
                //上传（图片）组件初始化
                var images = [];
                console.log(page.info);
                if(page.info.image) {
                	/*var arr = page.info.image.split(",");
                	if (page.info.image) {
                		if (/.jpg|.jpeg|.png|.gif|.bmp$/i.test(page.info.image)) {
                			images.push(page.info.image);
                		} else {
                			images.push(page.info.image + '.jpg');
                		}
                	}*/
                	//images = page.info.image.split(",");
                	//images = ;
                	//images.push('http://wx.qlogo.cn/mmopen/icPNWZMqF4hAa4L138phZFe0maEZVLXHYNVialfmf9tPsBP3d7ibuqJeSQHEsJ2aZDXPhC3OztQHfoQXNFkufTSaPhvEV1SMd96/0');
                	images.push(page.info.image);
                	$('#headImageUrl').val(page.info.image);
                } 
                page.fileUpload = new module.fileUpload({
                    container: "#fileSelector",
                    existFiles: images,
                    isUnique: true,
                    completeCallback: function (data) {console.log(data);
                    	$('#headImageUrl').val(data.url);
                    },
                    deleteCallback: function () {
                    	$('#headImageUrl').val('');
                    }
                });
            }
        },

        //页面初始化完成状态，全部=1表示初始化完成
        initFlag: {QINIU: 0, WEIGHT: 0, TYPE: 0, EDIT: 0},

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
        },
        
        //显示行业数据
        setIndustryList: function (data) {
    		var arr = [];
    		for (var i = 0; i < data.length; i++) {
    			arr.push(data[i].value);
    		}
    		return arr.join('，');
    	},
    	
    	//初始化行业数据
    	selectedData: function (str) {
    		var arr = [];
    		if (!str) return arr;
    		if (!/^\[(.+)\]$/.test(str)) return arr;
    		var data = JSON.parse(str) || '';
    		for (var i = 0; i < data.length; i++) {
    			arr.push({
    				key: data[i].industry_id,
    				value: data[i].industry
    			});
    		}
    		return arr;
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
        
        //初始化日期控件
        page.$birthday.datetimepicker({
            format: 'yyyy-mm-dd',
            weekStart: 1,
            todayBtn: true,
            autoclose: true,
            todayHighlight: true,
            startView: 2,
            minView: 2,
            forceParse: true
        });
        
        //初始化页面渲染内容
        page.eventHandler.initPageInfo();

        //初始化获取用户权重
        page.eventHandler.initWEIGHT();
        
        //初始化获取认证方式
        page.eventHandler.initTYPE();


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

        //调用icheck自定义扩展插件icheck-toggle.js的初始化及切换面板功能初始化
        iCheck.toggle.init("body");
        
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
                selectedData: page.industry,
                callback: function (data) {
                	page.industry = data;
                	$('#selectIndustryList').html(page.assist.setIndustryList(data));
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
        
        //保存
        $("#preservation_user").click(function() {
            page.eventHandler.doSubmit();
        });

        //取消
    	$("#btnCancel").on('click',function(){
    		parent.layer.close(parent.layer.index);
    	});
    });
});