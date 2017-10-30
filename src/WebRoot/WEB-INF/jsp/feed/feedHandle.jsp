<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增信息流</title>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>信息流管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">新增信息流</small></h3>
            </div>
            <div class="ibox-content">
                <form id="frmAddFeed" class="form-horizontal">
                    <div class="row text-center m-b">
                        <h2>信息源</h2>
                    </div>
                    <div class="form-group" id="articleSelectContainer">
                        <label class="col-sm-2 control-label">信息源：</label>
                        <div class="col-sm-9" id="articleSelectContent">
                            
                        </div>
                    </div>
                    <div class="form-group hidden has-error" id="articleSelectPropmt">
                        <label class="col-sm-2 control-label"></label>
                        <small class="help-block col-sm-9" data-bv-validator="notEmpty" data-bv-for="txtTitle" data-bv-result="INVALID" style="">信息源不能为空</small>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">类型：</label>
                        <div class="col-sm-9">
                            <span id="articleType" style="display:inline-block;height:34px;line-height:34px"></span>
                        </div>
                    </div>
                    <div class="hr-line-dashed"></div>
                    <div class="row text-center m-b">
                        <h2>信息流推送</h2>
                    </div>
                    <div id="objFeedPush" class="form-horizontal"></div>
                    <div class="hr-line-dashed"></div>
                    <%--操作区--%>
                    <div id="divAction" class="row m-t-lg text-center">
                        <button id="btnAudit" type="button" data-action="" disabled="disabled" class="btn btn-lg btn-primary dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;提交审核</button>
                        <button id="btnCancel" type="button" data-action="" disabled="disabled" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
                    </div>
                </form>
            </div>

        </div>
    </div>

    <%--页面css及js文件--%>
    <script src="<%=basePath%>static/page/feed/feedHandle.js?v=<%=StaticVersion%>"></script>
</body>
</html>
