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
                <h3>用户管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">全部用户</small></h3>
            </div>
            <div class="ibox-content ">
                <div id="tableTools">
                    <%--搜索条件bar  start--%>
                    <form class="form-inline bars">
                        <a class="btn btn-info" onclick="page.eventHandler.insertUser()">新增用户</a>
                        <div class="input-group m-b-xs">
                            <select id="isAuth" class="form-control">
                                <option value="">是否认证</option>
                                <option value="2">否</option>
                                <option value="1">是</option>
                            </select>
                        </div>
                        <div class="input-group m-b-xs">
                            <select id="userv" class="form-control">
                                <option value="">认证方式</option>
                            </select>
                        </div>
                        <div class="input-group m-b-xs">
                            <select id="weight" class="form-control">
                                <option value="">用户权重</option>
                            </select>
                        </div>
                        <div class="input-group m-b-xs">
                            <select id="logintype" class="form-control">
                                <option value="">注册方式</option>
                                <option value="1">在线注册</option>
                                <option value="2">商会导入</option>
                                <option value="0">后台新增</option>
                            </select>
                        </div>
                        <div class="input-group m-b-xs">
                            <input id="realname" type="text" class="form-control" placeholder="请输入搜索用户名" />
                        </div>
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
    <script src="<%=basePath%>static/page/user/all_user.js?v=<%=StaticVersion%>"></script>
</body>
</html>
