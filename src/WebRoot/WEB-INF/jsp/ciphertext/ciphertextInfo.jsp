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
    <title>查看秘闻</title>
    <%@ include file="../include/amdInclude.jsp"%>
    <script src="<%=basePath%>static/page/ciphertext/ciphertextInfo.js?v=<%=StaticVersion%>"></script>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight article">
        <div class="ibox float-e-margins">
            <div class="ibox-content col-md-offset-1 col-md-10">
                <div id="divLabelPanel" class="pull-left">
                    <span id="lblState" data-tip="秘闻发布到信息流中的状态" class="label label-inverse">发布状态加载中...</span>
                    <span id="lblStatus" data-tip="已删除的秘闻将进入垃圾箱" class="label label-inverse">垃圾箱状态加载中...</span>
                    <span id="lblType" data-tip="秘闻是否已被证实的状态" class="label label-inverse">证实状态加载中...</span>
                    <span id="lblAnonymity" data-tip="匿名主题" class="label label-inverse">匿名主题加载中...</span>
                </div>
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
                <div id="divTypePanel" class="m-t-lg">
                    <%--未经证实的统计数据--%>
                    <div class="font-16 m-b-xs">
                        <i class="fa fa-bar-chart"></i>【未经证实】投票的真实数据：
                        <span id="spanBelieveReal" class="badge badge-primary"></span>
                        <span id="spanDoubtReal" class="badge badge-warning"></span>
                    </div>
                    <div class="progress progress-striped active">
                        <div id="divBelieveReal" class="progress-bar progress-bar-primary" style="width: 50%;"></div>
                        <div id="divDoubtReal" class="progress-bar progress-bar-warning" style="width: 50%;"></div>
                    </div>
                    <div class="font-16 m-b-xs">
                        <i class="fa fa-bar-chart-o"></i>【未经证实】投票加工后的数据：
                        <span id="spanBelievePlus" class="badge badge-primary"></span>
                        <span id="spanDoubtPlus" class="badge badge-warning"></span>
                    </div>
                    <div class="progress progress-striped active">
                        <div id="divBelievePlus" class="progress-bar progress-bar-primary" style="width: 50%;"></div>
                        <div id="divDoubtPlus" class="progress-bar progress-bar-warning" style="width: 50%;"></div>
                    </div>
                </div>
                <hr />
                <div class="row text-center m-b">
                    <h2>信息流推送</h2>
                </div>
                <div id="objFeedPush" class="form-horizontal"></div>
                <div class="hr-line-dashed"></div>
                <div class="row text-center m-b">
                    <h2>手机设备推送</h2>
                </div>
                <div id="objMobilePush" class="form-horizontal"></div>
                <hr />
                <%--操作区--%>
                <div id="divAction" class="row m-t-lg text-center">
                    <button id="btnAuditPass" type="button" data-action="audit" disabled="disabled" class="btn btn-lg btn-primary dim m-l"><i class="fa fa-check-circle"></i>&nbsp;&nbsp;审核通过</button>
                    <button id="btnAuditNoPass" type="button" data-action="audit" disabled="disabled" class="btn btn-lg btn-danger dim m-l"><i class="fa fa-ban"></i>&nbsp;&nbsp;审核不通过</button>
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