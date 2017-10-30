<%--通用的子页面的头部引用，有增删改请在群里通知所有人，适用于AMD加载--%>
<%@ page import="java.util.Date" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
    String StaticVersion = String.valueOf(new Date().getTime());
%>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="renderer" content="webkit">
<link href="<%=basePath%>static/lib/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
<link href="<%=basePath%>static/lib/font-awesome/css/font-awesome.min.css" rel="stylesheet" />
<link href="<%=basePath%>static/lib/animate/animate.css" rel="stylesheet" />
<link href="<%=basePath%>static/lib/hplus/style.css" rel="stylesheet" />
<link href="<%=basePath%>static/common/extend.css?v=<%=StaticVersion%>" rel="stylesheet" />

<script src="<%=basePath%>static/lib/require.js?v=<%=StaticVersion%>"></script>
<script src="<%=basePath%>static/common/config.js?v=<%=StaticVersion%>"></script>
