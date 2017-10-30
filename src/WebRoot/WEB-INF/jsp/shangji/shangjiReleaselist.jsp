<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>已发布商机列表</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
<div class="wrapper wrapper-content animated fadeInRight dashboard-header">
    <div class="ibox float-e-margins">
        <div class="ibox-title">
            <h3>商机管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">已发布商机列表</small></h3>
        </div>
        <div class="ibox-content ">
            <div id="tableTools">
                <%--搜索条件bar  start--%>
                <form class="form-inline bars">
                    <div class="input-group date m-b-xs">
                        <input id="releaseStartTime" class="form-control form_date" size="10" type="text" data-end="#releaseEndTime" value="" placeholder="发布日期-起" readonly />
                        <label for="releaseStartTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                    </div>
                    <div class="input-group date m-b-xs">
                        <input id="releaseEndTime" class="form-control form_date" size="10" type="text" data-start="#releaseStartTime" value="" placeholder="发布日期-止" readonly />
                        <label for="releaseEndTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
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

<%--页面css及js文件--%>
<script src="<%=basePath%>static/page/shangji/shangjiReleaseList.js?v=<%=StaticVersion%>"></script>
</body>
</html>
