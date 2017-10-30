<%--
  User: xiegy
  Date: 2017/5/8
  Time: 10:44
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>查看商会通知</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight article">
        <div class="ibox float-e-margins">
            <div class="ibox-content col-md-offset-1 col-md-10">
<!--                 <div id="divLabelPanel" class="pull-left"> -->
<!--                     <span id="lblState" data-tip="秘闻发布到信息流中的状态" class="label label-inverse">发布状态加载中...</span> -->
<!--                     <span id="lblStatus" data-tip="已删除的秘闻将进入垃圾箱" class="label label-inverse">垃圾箱状态加载中...</span> -->
<!--                     <span id="lblType" data-tip="秘闻是否已被证实的状态" class="label label-inverse">证实状态加载中...</span> -->
<!--                     <span id="lblAnonymity" data-tip="匿名主题" class="label label-inverse">匿名主题加载中...</span> -->
<!--                 </div> -->
                <div id="divEditPanel" class="pull-right m-l-lg"></div>
                <div id="divCreatePanel" class="pull-right m-l-lg" ></div>
                <div id="typLength">
                    <%--长文--%>
                    <div class="text-center article-title"><h1 id="txtTitle"></h1></div>
                    <blockquote id="txtSummary" class="m-b-lg text-left"></blockquote>
                    <div id="txtContent"></div>
                </div>
                <div id="typShort" class="article-title">
                    <%--短文--%>
                    <div id="txtShortContent" class="text-left font-18"></div>
                    <div id="divShortImages" class="m-t-lg text-left"></div>
                </div>

            </div>
        </div>
    </div>


    <%--页面css及js文件--%>
    <script src="<%=basePath%>static/page/shanghui/shanghui_notice_detail.js?v=<%=StaticVersion%>"></script>
</body>
</html>