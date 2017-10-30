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
    	<title>修改-招商单位-商帮帮后台</title>
    	<%@ include file="../head-meta.jsp"%>
    	<%@ include file="../head-link.jsp"%>
	</head>
  
	<body class="gray-bg" style="background:#fff;padding-top:20px">
       <form id="addpaperForm" class="form-horizontal" novalidate="novalidate">
        	<div class="modal-body" id="paperForm">
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">LOGO</label>
        				<div class="col-xs-4">
			            	<img alt="image" class="img-circle" id="avatar" style="width:50px;" src="">
			        	</div>
			        	<div class="col-xs-4">
			            	<div class="uploadImg-box" id="container">
                        	 	<label id="upLoadImgBtn" class="btn btn-inverted btn-bold btn-success" for="upLoadImg">上传图片</label>
                         		<input id="upLoadImg" name="upLoadImg" type="file" style="position:absolute;clip:rect(0 0 0 0);" value="">
                   			</div>
			        	</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">账户名</label>
        				<div class="col-xs-9">
            				<input type="text" class="form-control" name="username" id="username"  placeholder="请输入账户名" required="" >
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">密码</label>
        				<div class="col-xs-9">
            				<input type="password" class="form-control" name="password" id="password"  placeholder="请输入密码" required="" >
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">单位名称</label>
        				<div class="col-xs-9">
            				<input type="text" class="form-control" name="title" id="title"  placeholder="请输入单位名称" required="" >
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">单位地址</label>
        				<div class="col-xs-9">
            				<input type="text" class="form-control" name="address" id="address"  placeholder="请输入单位地址" required="" >
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">联系电话</label>
        				<div class="col-xs-9">
            				<input type="text" class="form-control" name="phone" id="phone"  placeholder="联系电话" required="" >
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">单位简介</label>
        				<div class="col-xs-9">
            				<textarea class="form-control" rows="5" id="profile" placeholder="请输入单位简介"></textarea>
        				</div>
    				</div>
        		</div>
        		<div class="modal-footer">
            		<div class="col-sm-4 col-sm-offset-4 text-center">
				    	<button type="button" class="btn btn-primary" id="save">确认修改</button>
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
		<script src="<%=basePath%>js/business/business_unit_edit.js"></script>
  	</body>
</html>
