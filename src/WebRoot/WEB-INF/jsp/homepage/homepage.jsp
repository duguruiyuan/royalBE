<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>主页-商帮帮后台</title>
    <meta charset="utf-8">
    <%@ include file="../head-meta.jsp"%>
    <%@ include file="../head-link.jsp"%>
    <link href="<%=basePath%>css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
  </head>

  <body style="background: url('../img/bg.png') center no-repeat">

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
	<script src="<%=basePath%>vendor/tree-multi-select/jquery.tree-multiselect.js"></script>
	
	<script src="<%=basePath%>js/CitySelector.js"></script>
	<script>
    var selector3 = new CitySelector({
        headText: '地区选择',
        onConfirm:function(data){
            console.log(data)
        }
    });
    function openSelector3(){
        selector3.openSelector();
    }
	</script>
</html>
