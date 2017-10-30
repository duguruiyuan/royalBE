<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>会话日志</title>
    <%@ include file="../include/amdInclude.jsp"%>
  </head>
  <body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight dashboard-header">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>用户管理&nbsp;&nbsp;&nbsp;<small>会话日志列表</small></h3>
            </div>
            <div class="ibox-content">
                <div class="row font-18">
                    <div class="col-md-2">
                        <div id="userHead" style="width: 120px;height: 120px;border-radius: 50%;overflow: hidden; float: right"></div>
                    </div>
                    <div class="col-md-10">
                        <div class="row m-b m-t" style="height:auto;overflow:hidden">
                            <div class="col-md-6" id="userName"></div>
                        </div>
                        <div class="row m-b m-t">
                            <div class="col-md-6" id="userCompany">11111111111</div>
                            <div class="col-md-6" id="userTime">222222222222</div>
                        </div>
                    </div>
                </div>
                <div id="tableTools">
                    <%--搜索条件bar  start--%>
                    <form class="form-inline bars">
                        <div class="input-group date m-b-xs">
                            <input id="startTime" class="form-control form_date" size="10" type="text" data-end="#endTime" value="" placeholder="创建日期-起" readonly />
                            <label for="startTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group date m-b-xs">
                            <input id="endTime" class="form-control form_date" size="10" type="text" data-start="#startTime" value="" placeholder="创建日期-止" readonly />
                            <label for="endTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
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
  <script src="<%=basePath%>static/page/user/userLog.js?v=<%=StaticVersion%>"></script>
</html>