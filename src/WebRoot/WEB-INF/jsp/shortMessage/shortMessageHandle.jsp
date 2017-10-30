<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增/编辑短信</title>
    <%@ include file="../include/amdInclude.jsp"%>
    <script src="<%=basePath%>static/page/shortMessage/shortMessageHandle.js?v=<%=StaticVersion%>"></script>
</head>
<body>
    <div class="wrapper wrapper-content animated">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>短信管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">新增/修改短信</small></h3>
            </div>
            <div class="ibox-content">
                <form id="frmAddMessage" class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-2 control-label">短信内容：</label>
                        <div class="col-sm-9">
                            <textarea id="content" name="content" class="form-control" rows="5" placeholder="请输入短信内容，1000字以内"></textarea>
                        </div>
                    </div>
                    <div class="form-group" id="sendTimeContainer">
                        <label class="col-sm-2 control-label">发送时间：</label>
                        <div class="col-sm-3">
                            <div class="input-group date form_date " data-date="" data-date-format="yyyy-mm-dd hh:ii" data-link-format="yyyy-mm-dd hh:ii">
                                <input id="sendTime" class="form-control form_date_all" size="10" type="text" data-end="#endTime" value="" placeholder="短信发送时间" readonly />
                                <label for="sendTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group has-error hidden" id="sendTimePrompt">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-9">
                            <small class="help-block" data-bv-validator="notEmpty" data-bv-for="startTime" data-bv-result="INVALID" style="">发送时间不能为空</small>
                        </div>
                    </div>
                    <div id="objMobilePush"></div>
                    <%--操作区--%>
                    <div class="row">
                        <label class="col-sm-2 control-label"></label>
                        <div id="divAction" class="col-sm-9 m-t-lg">
	                        <button id="btnPass" type="button" data-action="audit" disabled="disabled" class="btn btn-lg btn-primary dim m-l"><i class="glyphicon glyphicon-floppy-saved"></i>&nbsp;&nbsp;保存并审核通过</button>
	                        <button id="btnAudit" type="button" data-action="audit,add,edit" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;提交审核</button>
	                        <button id="btnCancel" type="button" data-action="audit,add,edit" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
