<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>榜样管理</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../../include/staticInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight dashboard-header">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>榜样管理 > 已发布榜样</h3>
            </div>
            <div class="ibox-content ">
                <div id="tableTools">
                    <%--搜索条件bar  start--%>
                    <form class="form-inline bars">
                        <div class="input-group date m-b-xs">
                            <input id="start_time" class="form-control form_date" size="10" type="text" value="" placeholder="发布日期-起" readonly />
                            <label for="startTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group date m-b-xs">
                            <input id="end_time" class="form-control form_date" size="10" type="text" value="" placeholder="发布日期-止" readonly />
                            <label for="endTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group m-b-xs">
                            <input id="keyword" type="text" class="form-control" placeholder="请输入搜索关键字" />
                        </div>
                        <button id="btnSearch" type="button" class="btn btn-primary">搜索</button>
                        <button type="reset" class="btn btn-default">重置</button>
                    </form>
                    <%--搜索条件bar  end--%>
                </div>
                <div class="m-l-sm m-r-sm">
                    <%--表格容器--%>
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
	<%--修改表格组件--%>
	<link href="<%=basePath%>static/lib/bootstrap3-editable/css/bootstrap-editable.css" rel="stylesheet">
	<script src="<%=basePath%>static/lib/bootstrap3-editable/js/bootstrap-editable.js"></script>
	<script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table-editable.min.js"></script>
	<%--弹窗控件--%>
	<link href="<%=basePath%>static/lib/sweetalert/sweetalert.css" rel="stylesheet" />
	<script src="<%=basePath%>static/lib/sweetalert/sweetalert.min.js"></script>
	<%--通知组件--%>
	<link href="<%=basePath%>static/lib/toastr/css/toastr.min.css" rel="stylesheet" />
	<script src="<%=basePath%>static/lib/toastr/js/toastr.min.js"></script>
	<script src="<%=basePath%>static/lib/toastr/customOptions.js"></script>
	<%--layer弹窗控件--%>
	<link href="<%=basePath%>static/lib/layer/layer.css" rel="stylesheet">
	<script src="<%=basePath%>static/lib/layer/layer.js"></script>
	<%--树组件--%>
	<link href="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.min.css" rel="stylesheet" />
	<script src="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.js"></script>
	<%--表单选择框组件--%>
	<link href="<%=basePath%>static/lib/iCheck/custom.css" rel="stylesheet" />
	<script src="<%=basePath%>static/lib/iCheck/icheck.min.js"></script>
	
	<%--扩展表单选择框组件的自动替换及切换功能面板插件--%>
	<script src="<%=basePath%>static/lib/iCheck/icheck-toggle.js?v=<%=StaticVersion%>"></script>
	
	<%--自定义组件--%>
	<%--推送组件--%>
	<script src="<%=basePath%>static/common/module/module.push.js?v=<%=StaticVersion%>"></script>
	<script src="<%=basePath%>static/common/module/module.multSelector.js?v=<%=StaticVersion%>"></script>
    <%--页面css及js文件--%>
    <script src="<%=basePath%>js/public.js?v=<%=StaticVersion%>"></script>
    <script src="<%=basePath%>js/example/published_ciphertext.js?v=<%=StaticVersion%>"></script>
</body>
</html>
