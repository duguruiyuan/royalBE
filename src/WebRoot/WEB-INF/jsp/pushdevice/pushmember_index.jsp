<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>查看推送用户</title>
 	<%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/staticInclude.jsp"%>
</head>
<body class="gray-bg">
<div class="wrapper wrapper-content animated fadeInRight dashboard-header">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>设备推送管理 > 查看推送用户</h3>
            </div>
            <div class="ibox-content ">
                <div id="tableTools">
                    <form class="form-inline bars">
                        <div class="input-group m-b-xs">
                            <input id="realname" name="realname" type="text" class="form-control" placeholder="请输入姓名" />
                        </div>
                        <button id="btnSearch" type="button" class="btn btn-primary">搜索</button>
                        <button type="reset" class="btn btn-default">重置</button>
                    </form>
                </div>
                <div class="m-l-sm m-r-sm">
                    <table id="tableList"></table>
                </div>
            </div>
        </div>
    </div>

    <!--日期控件-->
    <link href="<%=basePath%>static/lib/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/datetimepicker/datetimepicker.min.js"></script>
    <%--表单控件--%>
    <link href="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
    <%--弹窗控件--%>
    <link href="<%=basePath%>static/lib/sweetalert/sweetalert.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/sweetalert/sweetalert.min.js"></script>
    <script src="<%=basePath%>vendor/layer/layer.js"></script>

	<%--页面css及js文件--%>
	<script src="<%=basePath%>js/public.js"></script>
    <script src="<%=basePath%>static/page/pushdevice/pushmember.js"></script>
  </body>
</html>
