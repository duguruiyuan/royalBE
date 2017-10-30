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
    	<link href="<%=basePath%>vendor/froala/css/froala_editor.min.css" type="text/css" rel="stylesheet">
    	<link href="<%=basePath%>vendor/froala/css/froala_style.min.css" type="text/css" rel="stylesheet">
    	<link href="<%=basePath%>vendor/froala/css/froala_plugins.min.css" type="text/css" rel="stylesheet">
    	<link href="<%=basePath%>css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    	<link href="<%=basePath%>vendor/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet">
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
            				<input type="text" class="form-control" name="title" id="title"  placeholder="请输入标题" required="" >
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">日期</label>
        				<div class="col-xs-9">
            				<div class="input-group date form_date " data-date="" data-date-format="yyyy-mm-dd " data-link-format="yyyy-mm-dd">
					            <input id="periods" class="form-control" size="10" type="text" value="" placeholder="选择早报的日期" readonly>     
					            <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
				        	</div>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">导语</label>
        				<div class="col-xs-9">
            				<textarea class="form-control" rows="5" id="summary" placeholder="请输入导语"></textarea>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">正文</label>
        				<div class="col-xs-9">
            				<div id="content"></div>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">信息流推送</label>
        				<div class="col-xs-9">
            				<button type="button" class="btn btn-info" onclick="openFeedPush()">信息流推送</button>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">设备推送</label>
        				<div class="col-xs-9">
            				<button type="button" class="btn btn-info" onclick="openDevicePush()">设备推送</button>
        				</div>
    				</div>
        		</div>
        		<div class="modal-footer">
            		<div class="col-sm-4 col-sm-offset-4 text-center">
				    	<button type="button" class="btn btn-primary" id="publish">提交审核</button>
				    	<button type="button" class="btn btn-info" id="save">保存草稿</button>
				    	<button type="button" class="btn btn-white" id="clear">取消</button>
					</div>
        		</div>
			</form>
        	
    	<!-- 全局js -->
    	<%@ include file="../script.jsp"%>
    	<script src="<%=basePath%>js/global.js"></script>
    	<script src="<%=basePath%>vendor/validate/jquery.validate.min.js"></script>
    	<script src="<%=basePath%>vendor/froala/froala_editor.min.js"></script>
		<script src="<%=basePath%>vendor/froala/froala_plugins.min.js"></script>
		<script src="<%=basePath%>vendor/froala/froala_zh_cn.js"></script>
		<script src="<%=basePath%>vendor/datetimepicker/datetimepicker.min.js"></script>
		<script src="<%=basePath%>js/common.js"></script>
		<script src="<%=basePath%>js/paper/paperadd.js"></script>
  	</body>
</html>
