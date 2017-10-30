<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>推送</title>
    <%@ include file="../include/staticInclude.jsp"%>
  </head>
  <body>
    
    
    <!--选择框控件-->
    <script src="<%=basePath%>vendor/tree-multi-select/jquery.tree-multiselect.js"></script>
    <script src="<%=basePath%>js/CitySelector.js"></script>
    <script src="<%=basePath%>js/TSelector.js"></script>
    <!--单选多选按钮-->
    <link href="<%=basePath%>css/plugins/iCheck/custom.css" rel="stylesheet">
    <script src="<%=basePath%>js/plugins/iCheck/icheck.min.js"></script>
    <!-- Bootstrap table -->
	<script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table.min.js"></script>
	<script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table-mobile.min.js"></script>
	<script src="<%=basePath%>js/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
	<!--日期控件-->
    <link href="<%=basePath%>vendor/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet">
    <script src="<%=basePath%>vendor/datetimepicker/datetimepicker.min.js"></script>
    <%--页面css及js文件--%>
    <script src="<%=basePath%>js/info_push.js"></script>
    <script src="<%=basePath%>js/public.js"></script>
    <script>
    /*window.parent.Information={
        isDefault:
        isAdditional:
        isAllUser:
        shangHui:
        hangYe:
        diQu:
        jiGuan:
        yongHuZu:
        yongHu:
        qiangZi:
        smallTop:
        bigTop:
    };*/	
    </script>
  </body>
</html>