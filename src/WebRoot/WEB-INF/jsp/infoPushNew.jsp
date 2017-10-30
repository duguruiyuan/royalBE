<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>再次推送榜样</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="include/staticInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>榜样管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">再次推送</small></h3>
            </div>
            <div class="ibox-content">
                <form id="frmAddCiphertext" class="form-horizontal">
                    <div class="row text-center m-b">
                        <h2>信息流再次推送</h2>
                    </div>
                    <div id="objFeedPush" class="form-horizontal"></div>
                    <div id="divAction" class="row m-t-lg text-center">
                        <button id="btnAudit" type="button" class="btn btn-lg btn-primary dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;确定推送</button>
                        <button id="btnCancel" type="button" class="btn btn-lg btn-default dim m-l"><i class="glyphicon glyphicon-floppy-remove"></i>&nbsp;&nbsp;取消操作</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <%--表单选择框组件--%>
    <link href="<%=basePath%>static/lib/iCheck/custom.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/iCheck/icheck.min.js"></script>
    <link href="<%=basePath%>static/lib/bootstrap-fileinput/css/fileinput.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-fileinput/js/fileinput.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-fileinput/js/locales/zh.js"></script>
    <!--日期控件-->
    <link href="<%=basePath%>static/lib/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/datetimepicker/datetimepicker.min.js"></script>
    <%--layer弹窗控件--%>
    <link href="<%=basePath%>static/lib/layer/layer.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/layer/layer.js"></script>
    
    <%--对第三方组件的自定义插件扩展--%>
    <%--扩展表单选择框组件的自动替换及切换功能面板插件--%>
    <script src="<%=basePath%>static/lib/iCheck/icheck-toggle.js"></script>

    <%--自定义组件--%>
    <%--推送组件--%>
    <script src="<%=basePath%>static/common/module/module.push.js"></script>
    <script src="<%=basePath%>static/common/module/module.multSelector.js"></script>

    <%--页面css及js文件--%>
    <script src="<%=basePath%>js/push/infoPushNew.js"></script>
</body>
</html>
