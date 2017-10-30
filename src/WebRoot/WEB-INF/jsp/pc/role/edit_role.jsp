<%@ page contentType="text/html;charset=UTF-8" language="java" %>
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
             <h3>角色管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">编辑角色</small></h3>
        </div>
        <div class="ibox-content">
	        <form id="frmAddCiphertext" class="form-horizontal">
                <div class="row text-center m-b">
                    <h2>基本信息</h2>
                </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">角色名称</label>
                    <div class="col-sm-5">
        				<input id="roleid" type="hidden" name="roleid" value="${data.roleid}">
                        <input class="form-control" id="rolename" type="text" name="rolename" value="${data.rolename}">
                    </div>
                 </div>
			      <div id="divAction" class="row m-t-lg text-center">
				      <button id="edit_user" type="button" class="btn btn-lg btn-info dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;保存角色</button>
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
        require(['base', 'jquery', 'helper', 'toastr', 'validator'], function (bs, $, helper, toastr) {
        $(document).ready(function(){
        	$("#edit_user").on('click',function(){
            	var rolename = $('#rolename').val();
            	if(rolename==''){
            		$('#rolename').focus();
            		swal('保存失败','角色名称不能为空','error');
            		return;
            	}
        		$.ajax({
        			url: '<%=basePath%>admin/role/update_roleinfo.shtml',
        			data: {
        				rolename: $("#rolename").val(),
        				roleid: $("#roleid").val()
        			},
        			type: 'post',
        			dataType: 'json',
        			success: function(res){
        				console.log(res);
        				if(res.code == 0){
        					//swal({title: "角色修改成功",type: "success"});
        					helper.win.changeQuoto({msg: "操作成功!", relation: "role/index.shtml"});
        				}else if(res.code == 1){
        					swal({
        						title: '角色修改失败',
        						title: errMsg,
        						type: 'error'
        					});
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
    </script>
  </body>
</html>