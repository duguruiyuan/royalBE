<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增用户组</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
  <body>
    <div class="wrapper wrapper-content animated">
    <div class="ibox float-e-margins">
        <div class="ibox-title">
             <h3>用户组管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">编辑用户组</small></h3>
        </div>
        <div class="ibox-content">
	        <form id="frmAddCiphertext" class="form-horizontal" action="javascript:;">
                <div class="row text-center m-b">
                    <h2>基本信息</h2>
                </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">用户组名称</label>
                    <div class="col-sm-5">
        				<input id="id" type="hidden" name="id" />
                        <input class="form-control" id="usergroupname" type="text" name="usergroupname">
                    </div>
                 </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">按商会职务</label>
                    <div class="col-sm-5">
				        <span id="dutiesnames"></span>
				        <input type="hidden" id="dutiesids" name="dutiesids"/>
				        <button class="btn btn-info" id="select_duties">选择职务</button>
                    </div>
                 </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">按用户选择</label>
                    <div class="col-sm-5">
				        <span id="usernames"></span>
				        <input type="hidden" id="userids" name="userids"/>
				        <button class="btn btn-info" id="select_user">选择用户</button>
                    </div>
                 </div>
			      <div id="divAction" class="row m-t-lg text-center">
				      <button id="add_user" type="button" class="btn btn-lg btn-info dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;保存用户组</button>
				      <button id="btnCancel" type="button" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
			      </div>
	        </form>
        </div>
      </div>
    </div>
<%-- 	<script src="<%=basePath%>static/common/helper.js"></script>
    <script src="<%=basePath%>js/jquery.min.js"></script>
    <script src="<%=basePath%>js/bootstrap.min.js"></script>
    <!-- Bootstrap table -->
	<script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table.min.js"></script>
	<script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table-mobile.min.js"></script>
	<script src="<%=basePath%>js/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
    <script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>
    layer弹窗控件
    <link href="<%=basePath%>static/lib/layer/layer.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/layer/layer.js"></script>
    树组件
    <link href="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.js"></script>
    
    <script src="<%=basePath%>static/common/module/module.multSelector.js"></script> --%>
    <script type="text/javascript">
    var dutiesData = [];
    var userData = [];
    var page = {};
    require(['base', 'jquery', 'helper', 'iCheckPlus', 'toastr', 'validator', 'module.multSelector'], function (bs, $, helper, iCheck, toastr) {
        var module = {
                multSelector: require('module.multSelector')
            };
	    page.$form = $('#frmAddCiphertext');
	    page.$button = $('#divAction button');
    var pid = helper.url.queryString("id");
    
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
	
	$(function () {
		//获取修改记录信息
		 $.ajax({
	         url:'usergroup/get_usergroup.shtml',
	         dataType: 'json',
	         type: 'post',
	         data:{
	             "id":pid
	         },
	         success:function(res){
	       	  	if(res.code == 0){
		       	  	$('#id').val(res.data.id);
		            $('#usergroupname').val(res.data.usergroupname);
		      		$('#usernames').html(res.data.realnames);
		        	$('#userids').val(res.data.userids);
		        	$('#dutiesids').val(res.data.dutiesids);
		        	$('#dutiesnames').html(res.data.dutiesnames);
		        	dutiesData = res.data.dutieslist;
		        	userData = res.data.userlist;
	           	}
	         },
	         error: function(res){
	        	 console.log(res.data.userids);
	         }
	     });
	});
    $('#select_duties').on('click',function(){
        //商会职务
        var DutiesSelect = new module.multSelector({
    	  url: '<%=basePath%>admin/backcommon/find_occupationinfo.shtml?x=0&y=100',
    	  searchType: 1,
    	  keyword: "",
    	  method: "GET",
    	  dataC: "data",
    	  keywordC: "name",
    	  keyC: "id",
    	  valueC: "name",
    	  tagsC: "",
    	  pkeyC: "",
    	  title: "职务选择",
          selectedData: dutiesData,
    	  callback: function(data){
    		  dutiesData = data;
          	$('#dutiesnames').empty();
          	$('#dutiesids').val('');
        	var i=0;
        	var dutiesnames = '';
        	var dutiesids = '';
        	for(i=0;i<data.length;i++){
        		if(i==0){
        			dutiesnames = data[i].value;
        			dutiesids = data[i].key;
        		}
        		else{
        			dutiesnames = dutiesnames+','+data[i].value;
        			dutiesids = dutiesids+','+data[i].key;
        		}
        	}
        	$('#dutiesnames').html(dutiesnames);
        	$('#dutiesids').val(dutiesids);
    	  }
    	});
    });
	    $('#select_user').on('click',function(){
	        //用户选择器
	        var userSelect = new module.multSelector({
	    	  url: '<%=basePath%>admin/backcommon/find_userlists.shtml?x=0&y=100',
	    	  searchType: 1,
	    	  keyword: "",
	    	  method: "POST",
	    	  dataC: "data",
	    	  keywordC: "name",
	    	  keyC: "id",
	    	  valueC: "name",
	    	  tagsC: "",
	    	  pkeyC: "",
	    	  title: "用户选择",
	          selectedData: userData,
	    	  callback: function(data){
	    		  userData = data;
	          	$('#usernames').empty();
	        	$('#userids').val('');
	        	var i=0;
	        	var usernames = '';
	        	var userids = '';
	        	for(i=0;i<data.length;i++){
	        		if(i==0){
	        			usernames = data[i].value;
	        			userids = data[i].key;
	        		}
	        		else{
	        			usernames = usernames+','+data[i].value;
	        			userids = userids+','+data[i].key;
	        		}
	        	}
	        	$('#usernames').html(usernames);
	        	$('#userids').val(userids);
	    	  }
	    	});
	    });
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
                	usergroupname: {/*键名username和input name值对应*/
                        message: '用户组名称验证不通过',
                        validators: {
                            notEmpty: {/*非空提示*/
                                message: '用户组名称不能为空'
                            },stringLength:{
                                max: 200,
                                message: "用户组名称不能超过200个字"
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
            			url: '<%=basePath%>admin/usergroup/update_usergroup.shtml',
            			data: {
            				usergroupname: $("#usergroupname").val(),
            				dutiesids: $("#dutiesids").val(),
            				userids: $("#userids").val(),
            				id: pid
            			},
            			type: 'post',
            			dataType: 'json',
            			success: function(res){
            				console.log(res);
            				if(res.code == 0){
            					//swal({title: "用户组修改成功",type: "success"});
            					helper.win.changeQuoto({msg: "操作成功!", relation: "usergroupview.shtml"});
            				}else if(res.code == 1){
            					toastr.error("修改失败!", res.errMsg);
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
    //    		var usergroupname = $('#usergroupname').val();
    //    		if(usergroupname==''){
    //        		$('#usergroupname').focus();
    //				toastr.error("保存失败!", '用户组名称不能为空');
    //        		return;
    //    		}
        	});

            //取消
            $("#btnCancel").click(helper.win.close);
        });
    });
    </script>
  </body>
</html>