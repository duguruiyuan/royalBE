<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String pid = request.getParameter("pid");
String state = request.getParameter("state");
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
       <form id="addfeedForm" class="form-horizontal" novalidate="novalidate">
        	<div class="modal-body" id="feedForm">
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">类型</label>
        				<div class="col-xs-9">
            				<span id="typename"></span>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">信息源</label>
        				<div class="col-xs-9">
            				<span id="title"></span>
        				</div>
    				</div>
        		</div>
        		<div class="modal-footer">
            		<div class="col-sm-4 col-sm-offset-4 text-center">
				    	<button type="button" class="btn btn-primary" id="reviewyes">审核通过</button>
				    	<button type="button" class="btn btn-danger" id="reviewno">删除</button>
					</div>
        		</div>
			</form>
        	
    	<!-- 全局js -->
    	<%@ include file="../script.jsp"%>
    	<script>
    		var pid = <%=pid%>;
    		var state = <%=state%>;
    	</script>
    	<script src="<%=basePath%>js/global.js"></script>
    	<script src="<%=basePath%>js/common.js"></script>
    	<script src="<%=basePath%>js/feed/feed_common.js"></script>
		<script src="<%=basePath%>js/feed/feed_review.js"></script>
  	</body>
</html>
