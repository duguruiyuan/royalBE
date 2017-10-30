<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增行业</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
  <body>
    <div class="wrapper wrapper-content animated">
    <div class="ibox float-e-margins">
        <div class="ibox-title">
             <h3>行业管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">新增行业</small></h3>
        </div>
        <div class="ibox-content">
	        <form id="frmAddCiphertext" class="form-horizontal">
                <div class="row text-center m-b">
                    <h2>基本信息</h2>
                </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">行业名称</label>
                    <div class="col-sm-5">
                        <input class="form-control" id="name" type="text" name="name">
                    </div>
                 </div>
			      <div id="divAction" class="row m-t-lg text-center">
				      <button id="add_user" type="button" disabled="disabled" class="btn btn-lg btn-info dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;保存行业</button>
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
        	
        	//页面辅助类/方法/属性 page.assist.submitStatus
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
                }
            };
        	
        	$(document).ready(function(){
        		page.assist.submitStatus(false);
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
                            message: '行业名称验证不通过',
                            validators: {
                                notEmpty: {/*非空提示*/
                                    message: '行业名称不能为空'
                                },stringLength:{
                                    max: 200,
                                    message: "行业名称不能超过200个字"
                                }
                            }
                        }
                    }
                });
	        	//保存
	        	$("#add_user").on('click',function(){
	        		var bv = page.$form.data('bootstrapValidator');
	                //手动触发验证
	                bv.validate();
	                if(bv.isValid()){
		        		page.assist.submitStatus(true);
		        		$.ajax({
		        			url: '<%=basePath%>admin/industry/insert_industry.shtml',
		        			data: {
		        				name: $("#name").val()
		        			},
		        			type: 'post',
		        			dataType: 'json',
		        			success: function(res){
		        				console.log(res);
		        				if(res.code == 0){
		        					//swal({title: "行业添加成功",type: "success"});
		        					helper.win.changeQuoto({msg: "操作成功!", relation: "industry/index.shtml"});
		        				}else if(res.code == 1){
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
	//        		var name = $('#name').val();
	//        		if(name==''){
	//            		$('#name').focus();
	//    				toastr.error("添加失败!", '行业名称不能为空');
	//            		return;
	//        		}
	        	});
	
	            //取消
	            $("#btnCancel").click(helper.win.close);
	        });
        });
    </script>
  </body>
</html>