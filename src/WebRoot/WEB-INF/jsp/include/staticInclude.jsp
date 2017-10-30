<%--通用的子页面的头部引用，有增删改请在群里通知所有人--%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
    String StaticVersion = "2017051904";
%>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="renderer" content="webkit">
<%--CSS库--%>
<link href="<%=basePath%>static/lib/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
<link href="<%=basePath%>static/lib/font-awesome/css/font-awesome.min.css" rel="stylesheet" />
<%--JS库--%>
<script src="<%=basePath%>static/lib/jQuery/jquery.min.js"></script>
<script src="<%=basePath%>static/lib/bootstrap/js/bootstrap.js"></script>

<%--公用CSS/js--%>
<link href="<%=basePath%>static/lib/animate/animate.css" rel="stylesheet" />
<link href="<%=basePath%>static/lib/hplus/style.css" rel="stylesheet" />
<link href="<%=basePath%>static/common/extend.css" rel="stylesheet" />
<script src="<%=basePath%>static/common/config.js?v=<%=StaticVersion%>"></script>
<script src="<%=basePath%>static/common/helper.js?v=<%=StaticVersion%>"></script>
