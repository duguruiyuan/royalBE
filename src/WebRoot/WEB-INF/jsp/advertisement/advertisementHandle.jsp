<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增/编辑开机广告</title>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>开机广告管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">新增/修改开机广告</small></h3>
            </div>
            <div class="ibox-content">
                <form id="frmAddAdvertisement" class="form-horizontal">
                    <div class="form-group" id="fileSelectorContainer">
                        <label class="col-sm-2 control-label">图片：</label>
                        <div id="objImaSelecter" class="col-sm-9">
                            <input id="fileSelector" type="file" multiple name="file" />
                            <input id="fileSelectorSrc" type="hidden">
                        </div>
                    </div>
                    <div class="form-group has-error hidden" id="fileSelectorPrompt">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-9">
                            <small class="help-block" data-bv-validator="notEmpty" data-bv-for="startTime" data-bv-result="INVALID" style="">图片不能为空</small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">标题：</label>
                        <div class="col-sm-9">
                            <input class="form-control" name="peacockTitle" id="peacockTitle" placeholder="请输入标题，50字以内">
                        </div>
                    </div>
                    
                    <!--<div class="form-group">
                        <label class="col-sm-2 control-label">名称：</label>
                        <div class="col-sm-9">
                            <input class="form-control" name="textTitle">
                        </div>
                    </div>  -->
                    <div class="form-group" id="startTimeContainer">
                        <label class="col-sm-2 control-label">投放开始时间：</label>
                        <div class="col-sm-3">
                            <div class="input-group date form_date1 " data-date="" data-date-format="yyyy-mm-dd hh:ii" data-link-format="yyyy-mm-dd hh:ii">
                                <input id="startTime" name="startTime" class="form-control form_date_all" size="10" type="text" data-end="#endTime" value="" placeholder="投放开始时间" readonly />
                                <label for="startTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group has-error hidden" id="startTimePrompt">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-9">
                            <small class="help-block" data-bv-validator="notEmpty" data-bv-for="startTime" data-bv-result="INVALID" style="">投放开始时间不能为空</small>
                        </div>
                    </div>
                    <div class="form-group" id="editEndTimeContainer">
                        <label class="col-sm-2 control-label">投放结束时间：</label>
                        <div class="col-sm-3">
                            <div class="input-group date form_date1 " data-date="" data-date-format="yyyy-mm-dd hh:ii" data-link-format="yyyy-mm-dd hh:ii">
					            <input id="editEndTime" name="editEndTime" class="form-control form_date_all" size="10" type="text" value="" placeholder="投放结束日期" readonly>       
					            <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
				        	</div>
                        </div>
                    </div>
                    <div class="form-group has-error hidden" id="editEndTimePrompt">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-9">
                            <small class="help-block" data-bv-validator="notEmpty" data-bv-for="startTime" data-bv-result="INVALID" style="">投放开始时间不能为空</small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">排序：</label>
                        <div class="col-sm-9">
                            <input class="form-control" name="sortNumber" id="sortNumber" placeholder="请输入开机广告排序">
                        </div>
                    </div>
                    <div class="form-group" id="advertisementLinkContainer">
                        <label class="col-sm-2 control-label">链接：</label>
                        <div id="advertisementLink" class="col-sm-9">
                            
                        </div>
                    </div>
                    <div class="form-group has-error hidden" id="advertisementLinkPrompt">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-9">
                            <small class="help-block" data-bv-validator="notEmpty" data-bv-for="startTime" data-bv-result="INVALID" style="">链接不能为空</small>
                        </div>
                    </div>
                    <%--操作区--%>
                    <div id="divAction" class="row m-t-lg text-center">
                        <button id="btnPreservation" disabled="disabled" type="button" class="btn btn-lg btn-primary dim m-l"><i class="glyphicon glyphicon-floppy-saved"></i>&nbsp;&nbsp;保&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;存</button>
                        <button id="btnCancel" disabled="disabled" type="button" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
                    </div>
                </form>
            </div>

        </div>
    </div>
    
    <%--页面css及js文件--%>
    <script src="<%=basePath%>static/page/advertisement/advertisementHandle.js?v=<%=StaticVersion%>"></script>
</body>
</html>
