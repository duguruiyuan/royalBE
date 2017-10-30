<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>信息流列表</title>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight dashboard-header">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>信息流管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">信息流列表</small></h3>
            </div>
            <div class="ibox-content ">
                <div id="tableTools">
                    <%--搜索条件bar  start--%>
                    <form class="form-inline bars">
                        <button id="btnAdd" data-type="draft" type="button" class="btn btn-outline btn-default"><i class="glyphicon glyphicon-plus"></i></button>
                        <div class="input-group m-b-xs">
                            <select id="feedType" class="form-control">
                                <!--<option value="">全部</option>
				                <option value="1">早报</option>
				                <option value="2">秘闻</option>
				                <option value="4">活动</option>
				                <option value="5">话题</option>
				                <option value="18">圈子帮助</option>
				                <option value="19">帖子</option>
				                <option value="8">榜样</option>
				                <option value="6">专题</option>
				                <option value="9">工商联新闻</option>
				                <option value="10">商机(招商项目)</option>
				                <option value="13">商会咨询</option>
				                <option value="7">江湖事</option>-->
				                <!--<option value="12">用户动态</option>-->
				                <!--  <option value="14">商会通知</option>-->
                            </select>
                        </div>
                        <div class="input-group m-b-xs" id="authorTypeContainer" style="display:none">
                            <select id="authorType" class="form-control">
                                <option value="">信息流来源</option>
                                <option value="">全部</option>
                                <option value="0">普通用户</option>
				                <option value="1">招商单位</option>
				                <option value="2">运营</option>
				                <option value="3">系统</option>
				                <option value="4">商会</option>
                            </select>
                        </div>
                        <div class="input-group date m-b-xs">
                            <input id="startTime" class="form-control form_date" size="10" type="text" data-end="#endTime" value="" placeholder="日期-起" readonly />
                            <label for="startTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group date m-b-xs">
                            <input id="endTime" class="form-control form_date" size="10" type="text" data-start="#startTime" value="" placeholder="日期-止" readonly />
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
    
    <%--页面css及js文件--%>
    <script src="<%=basePath%>static/page/feed/feedList.js?v=<%=StaticVersion%>"></script>
</body>
</html>
