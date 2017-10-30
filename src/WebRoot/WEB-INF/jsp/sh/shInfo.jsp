<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>查看商会</title>
    <%@ include file="../include/amdInclude.jsp"%>
    <script src="<%=basePath%>static/page/sh/shInfo.js?v=<%=StaticVersion%>"></script>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight article">
        <div class="ibox float-e-margins">
            <div class="ibox-content col-md-offset-1 col-md-10">
                <div id="divEditPanel" class="pull-right m-l-lg"></div>
                <div id="divCreatePanel" class="pull-right m-l-lg" ></div>
                <div class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-2 control-label">商会名称：</label>
                        <div class="col-sm-9">
                            <input id="shName" name="shName" class="form-control" placeholder="请输入商会名称" />
                        </div>
                    </div>
                </div>
                <%--操作区--%>
                <div id="divAction" class="row m-t-lg text-center">
                    
                </div>
            </div>
        </div>
    </div>
</body>
</html>