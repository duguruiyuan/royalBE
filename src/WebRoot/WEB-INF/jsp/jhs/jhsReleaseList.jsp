<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>江湖事管理</title>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight dashboard-header">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>江湖事管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">已发布江湖事</small></h3>
            </div>
            <div class="ibox-content ">
                <div id="tableTools">
                    <%--搜索条件bar  start--%>
                    <form class="form-inline bars">
                        <div class="input-group m-b-xs">
                            <select id="is_short" class="form-control">
                                <option value="">全部文章类型</option>
                                <option value="0">文章（长文）</option>
                                <option value="1">图文（短文）</option>
                            </select>
                        </div>
                        <div class="input-group date m-b-xs">
                            <input id="start_time" class="form-control form_date" size="10" type="text" value="" placeholder="发布日期-起" readonly />
                            <label for="startTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group date m-b-xs">
                            <input id="end_time" class="form-control form_date" size="10" type="text" value="" placeholder="发布日期-止" readonly />
                            <label for="endTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group m-b-xs">
                            <input id="title" type="text" class="form-control" placeholder="请输入搜索关键字" />
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
    <script src="<%=basePath%>static/page/jhs/jhsReleaseList.js?v=<%=StaticVersion%>"></script>
</body>
</html>
