<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>主页-商帮帮后台</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight dashboard-header">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>圈子角色管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">圈子角色列表</small></h3>
            </div>
            <div class="ibox-content ">
                <div id="tableTools">
					<form class="form-inline bars"  onsubmit="return false">
						<button id="btnAdd" type="button" onclick="page.eventHandler.showAdd()" class="btn btn-outline btn-default"><i class="glyphicon glyphicon-plus"></i></button>
				    </form>
                </div>
                <div class="m-l-sm m-r-sm">
                    <table id="tableList"></table>
                </div>
            </div>
        </div>
    </div>
<%-- 	<script src="<%=basePath%>static/common/helper.js"></script>
    <!--日期控件-->
    <link href="<%=basePath%>vendor/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet">
    <script src="<%=basePath%>vendor/datetimepicker/datetimepicker.min.js"></script>
    表单控件
    <link href="<%=basePath%>css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table-mobile.min.js"></script>
    <script src="<%=basePath%>js/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
    弹窗控件
    <link href="<%=basePath%>css/plugins/sweetalert/sweetalert.css" rel="stylesheet">
    <script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>

    <script src="<%=basePath%>js/global.js"></script>
    <script src="<%=basePath%>js/contabs.js" type="text/javascript"></script>
    <script src="<%=basePath%>js/public.js"></script>
    页面js文件
    <script type="text/javascript">
        //var rootPath = basePath;
        var rootPath = "<%=basePath%>";
    </script> --%>
    <script src="<%=basePath%>static/page/circlerole/circlerole_list.js?v=<%=StaticVersion%>"></script>
</body>
</html>
