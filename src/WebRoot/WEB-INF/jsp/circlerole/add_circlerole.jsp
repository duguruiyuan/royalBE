<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增圈子角色</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
  <body>
    <div class="wrapper wrapper-content animated">
    <div class="ibox float-e-margins">
        <div class="ibox-title">
             <h3>圈子角色管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">新增圈子角色</small></h3>
        </div>
        <div class="ibox-content">
	        <form id="frmAddCiphertext" class="form-horizontal">
                <div class="row text-center m-b">
                    <h2>基本信息</h2>
                </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">角色名称</label>
                    <div class="col-sm-5">
                        <input class="form-control" id="name" type="text" name="name">
                    </div>
                 </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">角色类型</label>
                    <div class="col-sm-5">
				        <select id="roletype" name="roletype" class="form-control"></select>
                    </div>
                 </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">角色排序</label>
                    <div class="col-sm-5">
				        <input id="sort" name="sort" type="number" class="form-control">
                    </div>
                 </div>
			      <div id="divAction" class="row m-t-lg text-center">
				      <button id="preservation_user" type="button" disabled="disabled" class="btn btn-lg btn-info dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;保存圈子角色</button>
				      <button id="btnCancel" type="button" disabled="disabled" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
			      </div>
	        </form>
        </div>
      </div>
    </div>
    <script type="text/javascript">
        var addressData = [];
        var page = {};
        require(['base', 'jquery', 'helper', 'toastr', 'validator'], function (bs, $, helper, toastr) {
        page.$form = $('#frmAddCiphertext');
        page.$button = $('#divAction button');
        //页面事件
        page.eventHandler = {
        		checkdata: function(){
                	var name = $('#name').val();
                	var roletype = $('#roletype').val();
                	var sort = $('#sort').val();
                	if(name==""){
                		$('#name').focus();
        				toastr.error("添加失败!", '圈角色名称不能为空');
                		return false;
                	}
                	if(roletype==""){
        				toastr.error("添加失败!", '请选择圈角色类型');
                		return false;
                	}
                	if(sort==""||sort<0){
                    		$('#sort').focus();
        					toastr.error("添加失败!", '请输入圈角色排序');
                    		return false;
                    }
                	return true;
                }  
      };
        
        //页面辅助类/方法/属性 page.assist.submitStatus();
        page.assist = {
    		//页面初始化完成状态，全部=1表示初始化完成
            initFlag: {TYPE: 0},

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
        
        $(document).ready(function(){
        	//圈角色类型
            $.ajax({
            	url: '<%=basePath%>admin/circlerole/get_circletyperole.shtml',
            	type: 'post',
        		dataType: 'json',
        		success: function(res){
        			if(res.code == 0){
        				var result = res.data;
        				var arr = ['<option value="">请选择</option>'];
        				for(var i = 0; i < result.length; i++){
        					arr.push('<option value="'+result[i].code+'">'+result[i].name+'</option>');
        				}
        				$('#roletype').empty().append(arr.join(''));
        				page.assist.initFlag.TYPE = 1;
        				page.assist.initComplete();
        			}else{
        				toastr.error("加载错误!", res.errMsg);
        			}
        		},
        		error: function(xhr){
    				toastr.error("加载错误!", 'error');
        		}
            });
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
                	name: {/*键名username和input name值对应*/
                        message: '圈角色名称验证不通过',
                        validators: {
                            notEmpty: {/*非空提示*/
                                message: '圈角色名称不能为空'
                            },stringLength:{
                                max: 200,
                                message: "圈角色名称不能超过200个字"
                            }
                        }
                    },
                    roletype: {/*键名username和input name值对应*/
                        message: '圈角色类型验证不通过',
                        validators: {
                            notEmpty: {/*非空提示*/
                                message: '圈角色类型不能为空'
                            }
                        }
                    },
                    sort: {/*键名username和input name值对应*/
                        message: '圈角色排序验证不通过',
                        validators: {
                            notEmpty: {/*非空提示*/
                                message: '圈角色排序不能为空'
                            }
                        }
                    }
                }
            });
        	//保存
        	$("#preservation_user").on('click',function(){
        		var bv = page.$form.data('bootstrapValidator');
                //手动触发验证
                bv.validate();
                if(bv.isValid()){
                	page.assist.submitStatus(true);
            		$.ajax({
            			url: '<%=basePath%>admin/circlerole/insert_circlerole.shtml',
            			data: {
            				name: $("#name").val(),
            				roletype: $("#roletype").val(),
            				usertype: 2,
            				sort :$("#sort").val()
            			},
            			type: 'post',
            			dataType: 'json',
            			success: function(res){
            				if(res.code == 0){
            					helper.win.changeQuoto({msg: "操作成功!", relation: "circlerole/index.shtml"});
            				}else{
            					toastr.error("添加失败!", res.errMsg);
            				}
            			},
            			error: function(xhr){
            				console.log(xhr);
            			},
            			complate: function () {
            				 page.assist.submitStatus(false);
            			}
            		});
                }
              	//验证未通过
                bv.getInvalidFields().focus();
         //   	if(!page.eventHandler.checkdata()) return;
        	});

            //取消
            $("#btnCancel").click(helper.win.close);
        });
        });
    </script>
  </body>
</html>