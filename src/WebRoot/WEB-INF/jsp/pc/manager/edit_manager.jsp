<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增角色</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../../include/amdInclude.jsp"%>
</head>
  <body>
    <div class="wrapper wrapper-content animated">
    <div class="ibox float-e-margins">
        <div class="ibox-title">
             <h3>用户管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">编辑用户</small></h3>
        </div>
        <div class="ibox-content">
	        <form id="frmAddCiphertext" class="form-horizontal">
                <div class="row text-center m-b">
                    <h2>基本信息</h2>
                </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">账户名</label>
                    <div class="col-sm-5">
                    	<input type="hidden" id="id" name="id" value="${data.id}">
                        <input class="form-control" id="username" type="text" name="username" value="${data.username}">
                    </div>
                 </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">姓名</label>
                    <div class="col-sm-5">
                        <input class="form-control" id="realname" type="text" name="realname" value="${data.realname}">
                    </div>
                 </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">密码</label>
                    <div class="col-sm-5">
                        <input class="form-control" id="password" type="password" name="password" placeholder="不修改请留空">
                    </div>
                 </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">角色</label>
                    <div class="col-sm-5">
				        <select id="roleid" name="roleid" class="form-control">
				          <option value="">请选择</option>
				          <c:forEach var="list" items="${rolelist}">
				          	<option value="${list.roleid}">${list.rolename}</option>
				          </c:forEach>
				        </select>
                    </div>
                 </div>
			      <div id="divAction" class="row m-t-lg text-center">
				      <button id="preservation_user" type="button" class="btn btn-lg btn-info dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;保存用户</button>
				      <button id="btnCancel" type="button" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
			      </div>
	        </form>
        </div>
      </div>
    </div>
<%-- 	<script src="<%=basePath%>static/common/helper.js"></script>
    <script src="<%=basePath%>js/jquery.min.js?v=2.1.4"></script>
    <script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script> --%>
    <script type="text/javascript">
        var addressData = [];
        var userinfo = ${data};
        require(['base', 'jquery', 'helper', 'toastr', 'validator'], function (bs, $, helper, toastr) {
        $(document).ready(function(){
        	 checkselect();
        	//保存
        	$("#preservation_user").on('click',function(){
            	if(!checkdata())
            		return;
        		$.ajax({
        			url: '<%=basePath%>admin/manager/update_userinfo.shtml',
        			data: {
        				id: $("#id").val(),
        				username: $("#username").val(),
        				realname: $("#realname").val(),
        				password: $("#password").val(),
        				roleid: $("#roleid").val(),
        				status: $("#status").val()
        			},
        			type: 'post',
        			dataType: 'json',
        			success: function(res){
        				console.log(res);
        				if(res.code == 0){
        				//	swal({title: "用户修改成功",type: "success"});
        					helper.win.changeQuoto({msg: "操作成功!", relation: "manager/index.shtml"});
        				}else if(res.code == 1){
        					swal('用户修改失败',res.errMsg,'error');
        				}
        			},
        			error: function(xhr){
        				console.log(xhr);
        			}
        		});
        	});

            //取消
            $("#btnCancel").click(helper.win.close);
        });
        });
        function checkselect(){
        	//alert(userinfo.roleid+'----'+userinfo.status);
        	$("#roleid option[value='"+userinfo.roleid+"']").attr("selected", true);
        	$("#status option[value='"+userinfo.status+"']").attr("selected", true);
        //	alert(userinfo.roleid+'----'+userinfo.status);
        	$("#roleid option[value='"+userinfo.roleid+"']").attr("selected", true);
        	$("#status option[value='"+userinfo.status+"']").attr("selected", true);
        	
        	var is_spuer = $("#id").val();
        	if(is_spuer==1){
        		$('#username').attr("disabled",true);
        		$('#realname').attr("disabled",true);
        		$('#roleid').attr("disabled",true);
        		$('#status').attr("disabled",true);
        	}
        }
        
        function checkdata(){
        	var username = $('#username').val();
        	var realname = $('#realname').val();
        	if(username==""){
        		$('#username').focus();
        		swal('保存失败','账号名不能为空','error');
        		return false;
        	}
        	if(realname==""){
        		$('#realname').focus();
        		swal('保存失败','姓名不能为空','error');
        		return false;
        	}
        	return true;
        }
    </script>
  </body>
</html>