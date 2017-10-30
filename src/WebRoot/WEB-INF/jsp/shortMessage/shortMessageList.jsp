<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>短信列表</title>
    <%@ include file="../include/amdInclude.jsp"%>
    <script src="<%=basePath%>static/page/shortMessage/shortMessageList.js?v=<%=StaticVersion%>"></script>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight dashboard-header">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>短信管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">短信列表</small></h3>
            </div>
            <div class="ibox-content ">
                <div id="tableTools">
                    <%--搜索条件bar  start--%>
                    <form class="form-inline bars">
                        <button id="btnAdd" data-type="draft" type="button" class="btn btn-outline btn-default"><i class="glyphicon glyphicon-plus"></i></button>
                        <div class="input-group date m-b-xs">
                            <input id="startTime" class="form-control form_date" size="10" type="text" data-end="#endTime" value="" placeholder="发送日期-起" readonly />
                            <label for="startTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group date m-b-xs">
                            <input id="endTime" class="form-control form_date" size="10" type="text" data-start="#startTime" value="" placeholder="发送日期-止" readonly />
                            <label for="endTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group m-b-xs">
                            <input id="founder" type="text" class="form-control" placeholder="请输入创建人" />
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
</body>
</html>
