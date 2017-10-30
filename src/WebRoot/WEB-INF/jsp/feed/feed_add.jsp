<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html lang="zh_cn">
	<head>
    	<meta charset="utf-8">
    	<title>新增-早茶-商帮帮后台</title>
    	<%@ include file="../head-meta.jsp"%>
    	<%@ include file="../head-link.jsp"%>
    	<link href="<%=basePath%>css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
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
        				<label class="col-xs-2 control-label ">选择信息源</label>
        				<div class="col-xs-9">
        					<span id="article-title"></span>
            				<button class="btn btn-success mg-t-10 mg-r-20" type="button" onclick="openArtSelector()">点击选择</button>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">类型</label>
        				<div class="col-xs-9">
            				<span id="article-type"></span>
            				<span id="article-id" style="display:none;"></span>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">信息流推送</label>
        				<div class="col-xs-9">
            				<button type="button" class="btn btn-info" onclick="openFeedPush()">信息流推送</button>
        				</div>
    				</div>
        		</div>
        		<div class="modal-footer">
            		<div class="col-sm-4 col-sm-offset-4 text-center">
				    	<button type="button" class="btn btn-primary" onclick="submitFeed()">提交审核</button>
				    	<button type="button" class="btn btn-white" onclick="clickCancel()">取消</button>
					</div>
        		</div>
			</form>
        	
    	<!-- 全局js -->
    	<%@ include file="../script.jsp"%>
    	<%@ include file="../table_script.jsp"%>
    	<script src="<%=basePath%>js/global.js"></script>
    	<script src="<%=basePath%>vendor/validate/jquery.validate.min.js"></script>
		<script src="<%=basePath%>js/ArticleSelector.js"></script>
		<script src="<%=basePath%>js/feed/feed_add.js"></script>
  	</body>
</html>
