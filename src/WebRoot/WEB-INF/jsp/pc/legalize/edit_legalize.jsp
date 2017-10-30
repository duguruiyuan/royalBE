<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>编辑认证方式</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../../include/amdInclude.jsp"%>
</head>
  <body>
    <div class="wrapper wrapper-content animated">
    <div class="ibox float-e-margins">
        <div class="ibox-title">
             <h3>认证方式管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">编辑认证方式</small></h3>
        </div>
        <div class="ibox-content">
	        <form id="frmAddCiphertext" class="form-horizontal">
                <div class="row text-center m-b">
                    <h2>基本信息</h2>
                </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">认证名称</label>
                    <div class="col-sm-5">
      					<input id="id" type="hidden" name="id" value="${data.id}"/>
                        <input class="form-control" id="name" type="text" name="name" value="${data.name}">
                    </div>
                 </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">认证强度</label>
                    <div class="col-sm-5">
				        <select id="comment" name="comment" class="form-control">
				        	<option value="0" selected>弱认证</option>
				        	<option value="1">强认证</option>
				        </select>
                    </div>
                 </div>
			      <div id="divAction" class="row m-t-lg text-center">
				      <button id="add_user" type="button" class="btn btn-lg btn-info dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;保存认证方式</button>
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
        var legalizeinfo = ${data};
        require(['base', 'jquery', 'helper', 'toastr', 'validator'], function (bs, $, helper, toastr) {
        $(document).ready(function(){
        	checkselect();
        	//保存
        	$("#add_user").on('click',function(){
        		var name = $('#name').val();
        		if(name==''){
            		$('#name').focus();
            		swal('保存失败','认证方式名称不能为空','error');
            		return;
        		}
        		$.ajax({
        			url: '<%=basePath%>admin/legalize/update_legalize.shtml',
        			data: {
        				id: $("#id").val(),
        				name: $("#name").val(),
        				comment: $("#comment").val()
        			},
        			type: 'post',
        			dataType: 'json',
        			success: function(res){
        				console.log(res);
        				if(res.code == 0){
        				//	swal({title: "认证方式修改成功",type: "success"});
        					helper.win.changeQuoto({msg: "操作成功!", relation: "legalize/index.shtml"});
        				}else if(res.code == 1){
        					swal("修改失败！", res.errMsg, "error");
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
        	$("#comment option[value='"+legalizeinfo.comment+"']").attr("selected", true);
        }
    </script>
  </body>
</html>