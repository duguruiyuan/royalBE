<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>设备推送列表</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/amdInclude.jsp"%>
    <%--页面css及js文件--%>
    <script src="<%=basePath%>js/public.js?v=<%=StaticVersion%>"></script>
    <script src="<%=basePath%>static/page/pushdevice/pushdevice_common.js?v=<%=StaticVersion%>"></script>
    <script src="<%=basePath%>static/page/pushdevice/pushdeviceList.js?v=<%=StaticVersion%>"></script>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight dashboard-header">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>设备推送管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">设备推送列表</small></h3>
            </div>
            <div class="ibox-content ">
                <div id="tableTools">
                    <%--搜索条件bar  start--%>
                    <form class="form-inline bars">
                        <button id="btnAdd" data-type="draft" type="button" class="btn btn-outline btn-default"><i class="glyphicon glyphicon-plus"></i></button>
                        <div class="input-group date m-b-xs">
                            <input id="startTime" class="form-control form_date" size="10" type="text" data-end="#endTime" value="" placeholder="创建日期-起" readonly />
                            <label for="startTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group date m-b-xs">
                            <input id="endTime" class="form-control form_date" size="10" type="text" data-start="#startTime" value="" placeholder="创建日期-止" readonly />
                            <label for="endTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div data-type="trash" class="input-group date m-b-xs">
                            <input id="delStartTime" class="form-control form_date" size="10" type="text" data-end="#delEndTime" value="" placeholder="删除日期-起" readonly />
                            <label for="delStartTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div data-type="trash" class="input-group date m-b-xs">
                            <input id="delEndTime" class="form-control form_date" size="10" type="text" data-start="#delStartTime" value="" placeholder="删除日期-止" readonly />
                            <label for="delEndTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
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
