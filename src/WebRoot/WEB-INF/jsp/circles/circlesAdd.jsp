<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增/编辑圈子</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>圈子管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">新增/修改圈子</small></h3>
            </div>
            <div class="ibox-content">
                <form id="frmAddCiphertext" class="form-horizontal">
                    <div class="row text-center m-b">
                        <h2>基本信息</h2>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">头像：</label>    
                        <div class="col-sm-9">         
                            <input type="file" id="circleAvatar" multiple name="file">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">名称：</label>
                        <div class="col-sm-9">
                            <input id="circleName" name="circleName" type="text" class="form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">圈主：</label>
                        <div class="col-sm-9" id="masterSelect">
                           <!--  <div id="master" onclick="page.eventHandler.openMasterSelect()"  class="form-control label-box"></div> -->
                        </div>
                    </div>
                        <div class="form-group" id="membersContainer">
                            <label class="col-sm-2 control-label">成员：</label>
                            <div class="col-sm-9">
                                <div id="members" onclick="page.eventHandler.openMembersSelect()"  class="form-control label-box"></div>
                                <small id="membersPrompt" class="help-block hidden" style="">圈子成员不能为空</small>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">圈子签名：</label>
                            <div class="col-sm-9">
                                <textarea id="circleDes" name="circleDes" rows="3" style="resize: vertical;" class="form-control"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">圈子简介：</label>
                            <div class="col-sm-9">
                                <textarea id="circleBrief" rows="5" style="resize: vertical;" class="form-control"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">圈子规则：</label>
                            <div class="col-sm-9">
                                <textarea id="circleRules" rows="6" style="resize: vertical;" class="form-control"></textarea>
                            </div>
                        </div>
                    <div class="hr-line-dashed"></div>
                    <%--操作区--%>
                    <div id="divAction" class="row m-t-lg text-center">
                        <button id="btnAudit" type="button" data-action="release,add" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;保&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;存</button>
                        <button id="btnCancel" type="button" data-action="audit,release,add,edit" disabled="disabled" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
                    </div>
                </form>
            </div>

        </div>
    </div>
    <script src="<%=basePath%>static/page/circles/circlesHandle.js?v=<%=StaticVersion%>"></script>
</body>
</html>
