<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增/编辑早茶</title>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>早茶管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">新增/修改早茶</small></h3>
            </div>
            <div class="ibox-content">
                <form id="frmAddPaper" class="form-horizontal">
                    <div class="row text-center m-b">
                        <h2>基本信息</h2>
                    </div>
                    <div id="typLength">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">标题：</label>
                            <div class="col-sm-9">
                                <input id="txtTitle" name="txtTitle" type="text" class="form-control" placeholder="请输入标题，100字以内" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">日期：</label>
                            <div class="col-sm-5 input-group date" style="padding-left: 15px;width:260px">
                                <input id="txtPeriods" name="PeriodsDate" class="form-control form_date" size="10" type="text" data-end="#endTime" value="" placeholder="请选择日期" readonly />
                                <label for="txtPeriods" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                            </div>
                        </div>
                        <div class="form-group has-error hidden" id="periodsPrompt">
                            <label class="col-sm-2 control-label"></label>
                            <small class="help-block col-sm-9" data-bv-validator="notEmpty" data-bv-for="txtTitle" data-bv-result="INVALID" style="display: block;">日期不能为空</small>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">摘要：</label>
                            <div class="col-sm-9">
                                <textarea id="txtSummary" name="txtSummary" class="form-control" rows="3" placeholder="请输入摘要，1000字以内"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">正文：</label>
                            <%--富文本编辑器--%>
                            <div class="col-sm-9"><div id="objEditer"></div></div>
                        </div>
                    </div>
                    <%--短文表单的内容 end--%>
                    <div class="hr-line-dashed"></div>
                    <div class="row text-center m-b">
                        <h2>信息流推送</h2>
                    </div>
                    <div id="objFeedPush" class="form-horizontal"></div>
                    <div class="hr-line-dashed"></div>
                    <div class="row text-center m-b">
                        <h2>手机设备推送</h2>
                    </div>
                    <div id="objMobilePush"></div>
                    <div class="hr-line-dashed"></div>
                    <%--操作区--%>
                    <div id="divAction" class="row m-t-lg text-center">
                        <button id="btnPass" type="button" data-action="audit" disabled="disabled" class="btn btn-lg btn-primary dim m-l"><i class="glyphicon glyphicon-floppy-saved"></i>&nbsp;&nbsp;保存并审核通过</button>
                        <button id="btnUpdatePass" type="button" data-action="release" disabled="disabled" class="btn btn-lg btn-primary dim m-l"><i class="glyphicon glyphicon-floppy-saved"></i>&nbsp;&nbsp;保存并审核通过</button>
                        <button id="btnAudit" type="button" data-action="audit,add,edit" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;提交审核</button>
                        <button id="btnSave" type="button" data-action="audit,add,edit" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="glyphicon glyphicon-floppy-save"></i>&nbsp;&nbsp;保存草稿</button>
                        <button id="btnCancel" type="button" data-action="audit,release,add,edit" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <%--页面css及js文件--%>
    <script src="<%=basePath%>static/page/paper/paperHandle.js?v=<%=StaticVersion%>"></script>
</body>
</html>
