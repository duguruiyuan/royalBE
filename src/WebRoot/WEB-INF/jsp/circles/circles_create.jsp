<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>圈子新增-商帮帮后台</title>
    <meta charset="utf-8">
    <%@ include file="../head-meta.jsp"%>
    <%@ include file="../head-link.jsp"%>
    <link href="<%=basePath%>css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <link href="<%=basePath%>css/circles.css" rel="stylesheet">
    <link href="<%=basePath%>css/cropBox.css" rel="stylesheet">
    <link href="<%=basePath%>vendor/toastr/css/toastr.min.css" rel="stylesheet">
    <style>
    	.pagination-detail {
    		display:none;
    	}
    </style>
  </head>
  <body class="gray-bg">
     <div class="wrapper wrapper-content animated fadeInRight">
	 <div class="row">
            <div class="col-sm-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <span class="font-18-bold">圈子管理 > 全部 > 新增圈子</span>
                    </div>
                    <div class="ibox-content">
                        <form method="get" class="form-horizontal">
                            <div class="form-group">
                                <label class="col-sm-2 control-label">头像</label>
                                <div class="col-xs-10 col-md-8">               
                                 	<div id="circleAvatar" class="form-avatar-box  cursor" onclick="openAvatarSelect()">
                                 		<img src="<%=basePath%>/img/imageHolder.jpg">
                                	</div>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">名称</label>
                          		<div class="col-xs-10 col-md-8"> 
                                    <input id="circleName" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">圈主</label>
                           		<div class="col-xs-10 col-md-8"> 
                                    <input id="master" onclick="masterSelect()" type="text" readonly placeholder="点击选择圈主" class="form-control">
                                </div>
                            </div>
                 
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">成员</label>
      						   <div class="col-xs-10 col-md-8"> 
                                    <input id="members" onclick="memberSelect()" type="text" readonly placeholder="点击选择成员" class="form-control">
                                </div>
                            </div>
                       		<div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">圈子规则</label>
                                <div class="col-xs-10 col-md-8"> 
                                    <textarea id="circleRules" type="text" style="resize: vertical;" class="form-control"></textarea>
                                </div>
                            </div>
              				<div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">圈子简介</label>
                                   <div class="col-xs-10 col-md-8"> 
                                    <textarea id="circleBrief" type="text" style="resize: vertical;" class="form-control"></textarea>
                                </div>
                            </div>
       						<div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">圈子描述</label>
                                 <div class="col-xs-10 col-md-8"> 
                                    <textarea id="circleDes" type="text" style="resize: vertical;" class="form-control"></textarea>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <div class="col-sm-4 col-sm-offset-2">
                                    <button class="btn btn-primary" type="button" onclick="post(this)">保存</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
	    </div>
  </body>
    <!-- 全局js -->
    <%@ include file="../script.jsp"%>
    <script src="<%=basePath%>js/public.js"></script>
    <%@ include file="../table_script.jsp"%>
    <!-- 自定义js -->
    <script src="<%=basePath%>js/global.js"></script>
	<script src="<%=basePath%>js/moduelMenu.js" type="text/javascript"></script>
    <script src="<%=basePath%>vendor/metisMenu/jquery.metisMenu.js"></script>
    <script src="<%=basePath%>vendor/slimscroll/jquery.slimscroll.min.js"></script>
    <script src="<%=basePath%>js/main.js"></script>
    <script src="<%=basePath%>js/contabs.js" type="text/javascript"></script>
	<script src="<%=basePath%>vendor/pace/pace.min.js"></script>
    <script src="<%=basePath%>vendor/toastr/js/toastr.min.js"></script>
	<script src="<%=basePath%>js/common.js"></script>
	<script src="<%=basePath%>js/cropBox.js"></script>
    <script src="<%=basePath%>js/TSelector.js"></script>
    <script src="<%=basePath%>js/AvatarUpload.js"></script>
	<script src="<%=basePath%>js/circles/circlesCreate.js"></script>
</html>
