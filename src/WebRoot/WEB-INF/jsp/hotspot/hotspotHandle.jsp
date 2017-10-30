<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增/编辑专题</title>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>专题管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">新增/修改专题</small></h3>
            </div>
            <div class="ibox-content">
                <form id="frmAddhotspot" class="form-horizontal">
                    <div class="row text-center m-b">
                        <h2>基本信息</h2>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">标题：</label>
                        <div class="col-sm-9">
                            <input id="txtTitle" name="txtTitle" type="text" class="form-control" placeholder="请输入标题，100字以内" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">摘要：</label>
                        <div class="col-sm-9">
                            <textarea id="txtSummary" name="txtSummary" class="form-control" rows="3" placeholder="请输入摘要，1000字以内"></textarea>
                        </div>
                    </div>
                    <!--<div class="form-group">
                        <label class="col-sm-2 control-label">专题链接：</label>
                        <div class="col-xs-10 col-md-9">
                            <table id="relationArtTable"></table>
                            <button class="btn btn-primary m-t-sm pull-right" type="button" onclick="page.eventHandler.relatedArts.openAdd()">添加站外文章</button>
                            <button class="btn btn-success m-t-sm m-r-xs pull-right" type="button" onclick="page.eventHandler.relatedArts.openSelect()">添加站内文章</button>
                        </div>
                    </div>  -->
                    <div class="form-group" id="hotspotLink">
                        <label class="col-sm-2 control-label">专题链接：</label>
                        <div class="col-xs-10 col-md-9" id="hotspotLinkContainer">
                            
                        </div>
                    </div>
                    <div class="form-group has-error hidden" id="hotspotLinkPrompt">
                        <label class="col-sm-2 control-label"></label>
                        <small class="help-block" data-bv-validator="notEmpty" data-bv-for="txtSummary" data-bv-result="INVALID" style="">专题链接不能为空</small>
                    </div>

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
    <script src="<%=basePath%>static/page/hotspot/hotspotHandle.js?v=<%=StaticVersion%>"></script>
</body>
</html>
