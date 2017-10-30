<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>用户管理</title>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight dashboard-header">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>用户管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">推荐大咖</small></h3>
            </div>
            <div class="ibox-content ">
                <div id="tableTools">
                    <%--搜索条件bar  start--%>
                    <form class="form-inline bars">
                        <a class="btn btn-info" onclick="page.eventHandler.addrecommend()">新增大咖</a>
                        <div class="input-group m-b-xs">
                            <input id="mobile" type="text" class="form-control" placeholder="请输入搜索手机号" />
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
    <script src="<%=basePath%>static/page/user/recommend_user.js?v=<%=StaticVersion%>"></script>
</body>
</html>
