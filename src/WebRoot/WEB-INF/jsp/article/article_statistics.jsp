<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>文章数据统计</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight dashboard-header">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>文章数据统计 &nbsp;&nbsp;<small id="pageSubTitle">文章数据统计</small></h3>
            </div>
            <div class="ibox-content ">
                <div id="tableTools">
                    <form class="form-inline bars">
                     	<div class="input-group m-b-xs">
                       		 类型
                        </div>
                        <div class="input-group m-b-xs">
                            <select class="form-control m-b" id="obj_type" name="obj_type">
				              <option value="">全部</option>
				              <option value="1">早茶</option>
				              <option value="2">秘闻</option>
				              <option value="4">活动</option>
				              <option value="5">话题</option>
				              <option value="18">求帮帮</option>
				              <option value="19">帖子</option>
				              <option value="8">榜样</option>
				              <option value="6">专题</option>
				              <option value="9">工商联新闻</option>
				              <option value="10">商机</option>
				              <option value="13">商会资讯</option>
				              <option value="14">商会通知</option>
				              <option value="7">江湖事</option>
				            </select>
                        </div>
                        <div class="input-group date m-b-xs">
                            <input id="startTime" class="form-control form_date" size="12" type="text" value="" placeholder="发布日期-起" readonly />
                            <label for="startTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group date m-b-xs">
                            <input id="endTime" class="form-control form_date" size="12" type="text" value="" placeholder="发布日期-止" readonly />
                            <label for="endTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group m-b-xs">
                            <input id="keywords" type="text" class="form-control" placeholder="请输入关键字" />
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


	<%--页面css及js文件--%>
	<script src="<%=basePath%>js/public.js"></script>
    <script src="<%=basePath%>static/page/article/article_statistics.js?v=<%=StaticVersion%>"></script>
</body>
</html>
