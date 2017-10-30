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
    	<title>审核-商机-商帮帮后台</title>
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
       <form id="addpaperForm" class="form-horizontal" novalidate="novalidate">
        	<div class="modal-body" id="paperForm">
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">标题</label>
        				<div class="col-xs-9">
            				<span id="title"></span>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">招商地区</label>
        				<div class="col-xs-9">
            				<span id="area"></span>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">招商行业</label>
        				<div class="col-xs-9">
            				<span id="industry"></span>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">投资方式</label>
        				<div class="col-xs-9">
            				<span id="type"></span>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">投资金额</label>
        				<div class="col-xs-9">
            				<span id="money"></span>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">联系人</label>
        				<div class="col-xs-9">
            				<span id="contact"></span>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">联系电话</label>
        				<div class="col-xs-9">
            				<span id="phone"></span>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">投资地址</label>
        				<div class="col-xs-9">
            				<span id="address"></span>
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
    	<script src="<%=basePath%>js/public.js"></script>
    	<script src="<%=basePath%>js/global.js"></script>
    	<script src="<%=basePath%>js/common.js"></script>
		<script src="<%=basePath%>js/shangji/shangji_review.js"></script>
  	</body>
</html>
