<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html lang="zh_cn">
<head>
    <meta charset="utf-8">
    <title>登录-商帮帮后台</title>
    <%@ include file="../head-meta.jsp"%>
    <%@ include file="../head-link.jsp"%>
    <script>if(window.top !== window.self){ window.top.location = window.location;}</script>
</head>

<body class="gray-bg">
    <div class="middle-box text-center loginscreen animated fadeInDown">
        <div>
            <div>
                <h1 class="logo-name">商</h1>
            </div>
            <h3>欢迎使用商帮帮管理后台</h3>

            <form id="loginForm" class="m-t" role="form">
                <div class="form-group">
                    <input id="username" name="username" type="text" class="form-control" placeholder="用户名" required="">
                </div>
                <div class="form-group">
                    <input id="password" name="password" type="password" class="form-control" placeholder="密码" required="">
                </div>
                <button type="submit" class="btn btn-primary block full-width m-b">登 录</button>
            </form>
        </div>
    </div>

    <!-- 全局js -->
    <%@ include file="../script.jsp"%>
	<!-- 模块js -->
 	<script src="<%=basePath%>js/global.js"></script>
    <script src="<%=basePath%>vendor/validate/jquery.validate.min.js"></script>
    <script src="<%=basePath%>vendor/validate/messages_zh.min.js"></script>
    <script src="<%=basePath%>js/login/login.js"></script>

</body>

</html>
