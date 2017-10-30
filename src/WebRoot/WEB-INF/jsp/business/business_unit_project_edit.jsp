<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String unitid = request.getParameter("unitid");
%>

<!DOCTYPE html>
<html lang="zh_cn">
	<head>
    	<meta charset="utf-8">
    	<title>新增-项目管理-商帮帮后台</title>
    	<%@ include file="../head-meta.jsp"%>
    	<%@ include file="../head-link.jsp"%>
    	<style>
    	.help-block {
		    margin-top: 0;
		}
		.modal-body {
		    padding: 20px 30px;
		}
    	</style>
	</head>
  
	<body class="gray-bg" style="background:#fff;padding-top:20px">
       <form id="addprojectForm" class="form-horizontal" novalidate="novalidate">
        	<div class="modal-body" id="projectForm">
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">标题</label>
        				<div class="col-xs-9">
            				<input type="text" class="form-control" name="title" id="title"  placeholder="请输入标题" required="" >
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">招商地区</label>
        				<div class="col-xs-9">
            				<input type="text" class="form-control" name="area" id="area"  placeholder="请输入招商地区">
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">招商行业</label>
        				<div class="col-xs-9">
            				<input type="text" class="form-control" name="industry" id="industry"  placeholder="请输入招商行业">
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">投资方式</label>
        				<div class="col-xs-9">
            				<input type="text" class="form-control" name="type" id="type"  placeholder="请输入投资方式">
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">投资金额</label>
        				<div class="col-xs-9">
            				<input type="text" class="form-control" name="money" id="money"  placeholder="请输入投资金额">
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">联系人</label>
        				<div class="col-xs-9">
            				<input type="text" class="form-control" name="contact" id="contact"  placeholder="请输入联系人">
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">联系电话</label>
        				<div class="col-xs-9">
            				<input type="text" class="form-control" name="phone" id="phone"  placeholder="请输入联系电话">
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">投资地址</label>
        				<div class="col-xs-9">
            				<input type="text" class="form-control" name="address" id="address"  placeholder="请输入投资地址">
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">上传文件</label>
        				<div class="col-xs-8" id="container">
            				<label id="upLoadFileBtn" class="btn btn-inverted btn-bold btn-success" for="upLoadFile">上传文件</label>
            				<input id="upLoadFile" name="upLoadFile" type="file" style="position:absolute;clip:rect(0 0 0 0);" value="">
        				</div>
    				</div>
        		</div>
        		<div class="modal-footer">
            		<div class="col-sm-4 col-sm-offset-4 text-center">
				    	<button type="button" class="btn btn-primary" id="publish">确认修改</button>
					</div>
        		</div>
			</form>
        	
    	<!-- 全局js -->
    	<%@ include file="../script.jsp"%>
    	<script>
    		var unitid = <%=unitid%>;
    	</script>
    	<script src="<%=basePath%>js/global.js"></script>
		<script src="<%=basePath%>js/upload_img/plupload.full.min.js"></script>
		<script src="<%=basePath%>js/upload_img/qiniu.min.js"></script>
    	<script src="<%=basePath%>vendor/validate/jquery.validate.min.js"></script>
		<script src="<%=basePath%>js/business/business_unit_project_edit.js"></script>
  	</body>
</html>
