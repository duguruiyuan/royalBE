<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String pid = request.getParameter("pid");
%>

<!DOCTYPE html>
<html lang="zh_cn">
	<head>
    	<meta charset="utf-8">
    	<title>审核-早茶-商帮帮后台</title>
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
       <form id="addhotspotForm" class="form-horizontal" novalidate="novalidate">
        	<div class="modal-body" id="hotspotForm">
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">标题</label>
        				<div class="col-xs-9">
            				<span id="title"></span>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">导语</label>
        				<div class="col-xs-9">
            				<span id="summary"></span>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">状态</label>
        				<div class="col-xs-9">
            				<span id="status"></span>
        				</div>
    				</div>
        		</div>
        		<div class="modal-footer">
            		<div class="col-sm-4 col-sm-offset-4 text-center">
				    	<button type="button" class="btn btn-primary" id="reviewyes">审核通过</button>
				    	<button type="button" class="btn btn-danger" id="reviewno">审核不通过</button>
					</div>
        		</div>
			</form>
        	
    	<!-- 全局js -->
    	<%@ include file="../script.jsp"%>
    	<script>
    		var pid = <%=pid%>;
    	</script>
  <script src="<%=basePath%>js/jquery.min.js"></script>
  <script src="<%=basePath%>js/bootstrap.min.js"></script>
  <script src="<%=basePath%>js/public.js"></script>
  <script src="<%=basePath%>vendor/layer/layer.js"></script>
  <script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>
		<script src="<%=basePath%>js/hotspot/hotspot_review.js"></script>
  	</body>
</html>
