<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>查看短信</title>
    <%@ include file="../include/amdInclude.jsp"%>
    <script src="<%=basePath%>static/page/shortMessage/shortMessageInfo.js?v=<%=StaticVersion%>"></script>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight article">
        <div class="ibox float-e-margins">
            <div class="ibox-content col-md-offset-1 col-md-10">
                <div id="divLabelPanel" class="pull-left">
                    <span id="lblState" data-tip="短信发布到信息流中的状态" class="label label-inverse">发布状态加载中...</span>
                    <span id="lblStatus" data-tip="已删除的短信将进入垃圾箱" class="label label-inverse">垃圾箱状态加载中...</span>
                </div>
                <div id="divEditPanel" class="pull-right m-l-lg"></div>
                <div id="divCreatePanel" class="pull-right m-l-lg" ></div>
                <div class="" style="clear: both;padding-top:60px">
                    <div class="row text-center m-b">
	                    <h2>短信内容</h2>
	                    <div id="content" class="text-center font-16" style="line-height:25px"></div>
	                </div>
	                <div class="row">
                        <label class="col-sm-2 control-label text-right">发送时间：</label>
                        <div id="sendTime" class="col-sm-9" style="line-height:18px"></div>
                    </div>
                    <!--<div class="row">
                        <label class="col-sm-2 control-label text-right">短信内容：</label>
                        <div id="content" class="col-sm-9" style="line-height:18px"></div>
                    </div>
                    <div class="row">
                        <label class="col-sm-2 control-label text-right">发送时间：</label>
                        <div id="sendTime" class="col-sm-9" style="line-height:18px"></div>
                    </div>-->
                </div>
                <div id="objMobilePush" class="form-horizontal"></div>
                <%--操作区--%>
                <div id="divAction" class="row m-t-lg text-center">
                    <button id="btnAuditPass" type="button" data-action="audit" disabled="disabled" class="btn btn-lg btn-primary dim m-l"><i class="fa fa-check-circle"></i>&nbsp;&nbsp;审核通过</button>
                    <%--<button id="btnAuditNoPass" type="button" data-action="audit" disabled="disabled" class="btn btn-lg btn-danger dim m-l"><i class="fa fa-ban"></i>&nbsp;&nbsp;审核不通过</button>--%>
                    <button id="btnBackout" type="button" data-action="release" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="fa fa-arrow-circle-right"></i>&nbsp;&nbsp;撤&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</button>
                    <button id="btnEdit" type="button" data-action="audit,show,release" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="glyphicon glyphicon-edit"></i>&nbsp;&nbsp;编&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;辑</button>
                    <button id="btnDelete" type="button" data-action="audit,show,release" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;删&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;除</button>
                    <button id="btnReply" type="button" data-action="trash" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="fa fa-reply"></i>&nbsp;&nbsp;恢&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;复</button>
                    <button id="btnCancel" type="button" data-action="audit,show,release,trash" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>