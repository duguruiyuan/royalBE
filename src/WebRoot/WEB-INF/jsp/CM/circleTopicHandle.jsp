<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>圈子新增-商帮帮后台</title>
    <%@ include file="../include/amdInclude.jsp"%>
    <style>
    	.pagination-detail {
    		display:none;
    	}
    </style>
  </head>
  <body class="gray-bg">
     <div class="wrapper wrapper-content animated">
             <div class="ibox float-e-margins">
                 <div class="ibox-title">
                     <h3>话题管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle"></small></h3>
                 </div>
                 <div class="ibox-content">

                     <form id="pageForm" class="form-horizontal" onsubmint="return false">
                         <div class="row text-center m-b">
                             <h2>基本信息</h2>
                         </div>

                         <div class="form-group">
                             <label class="col-sm-2 control-label">标题：</label>
                             <div class="col-sm-9">
                                 <input id="title" name="title" type="text" class="form-control" placeholder="请输入标题，50字以内"/>
                             </div>
                         </div>
                         <div class="form-group" id="circlesContainer">
                             <label class="col-sm-2 control-label">圈子：</label>
                             <div class="col-sm-9 cursor">
                                 <div id="circles" onclick="page.eventHandler.circles.openSelector()" class="form-control label-box"></div>
                             </div>
                         </div>
                         <div class="form-group has-error hidden" id="circlesPrompt">
	                         <label class="col-sm-2 control-label"></label>
	                         <div class="col-sm-9">
	                             <small class="help-block" data-bv-validator="notEmpty" data-bv-for="startTime" data-bv-result="INVALID" style="">圈子不能为空</small>
	                         </div>
	                     </div>
                         <div class="form-group">
                             <label class="col-sm-2 control-label">相关链接：</label>
                             <div class="col-xs-10 col-md-9" id="relatedLink">
                                 <!-- <div id="relatedLink" name="relatedLink" onclick="page.eventHandler.relatedLink.openAdd()" class="form-control label-box"></div> -->
                             </div>
                         </div>
                         <div class="form-group">
                            <label class="col-sm-2 control-label">摘要：</label>
                            <div class="col-sm-9">
                                <textarea id="txtSummary" name="txtSummary" class="form-control" rows="3" placeholder="请输入摘要，500字以内"></textarea>
                            </div>
                         </div>
                         <div class="form-group">
                             <label class="col-sm-2 control-label">话题简述：</label>
                             <div class="col-xs-10 col-md-9">
                                 <div id="objEditer">
                                 </div>
                             </div>
                         </div>

                         <div class="form-group" id="guestTableContainer">
                             <label class="col-sm-2 control-label">受邀人：</label>
                             <div class="col-xs-10 col-md-9">
                                 <table id="guestTable"></table>
                                 <button class="btn btn-primary m-t-sm pull-right" type="button" onclick="page.eventHandler.guest.openAdd()">添加嘉宾</button>
                                 <button class="btn btn-success m-t-sm m-r-xs pull-right" type="button" onclick="page.eventHandler.guest.openSelect()">选择用户</button>
                             </div>
                         </div>
                         <div class="form-group has-error hidden" id="guestTablePrompt">
	                         <label class="col-sm-2 control-label"></label>
	                         <div class="col-sm-9">
	                             <small class="help-block" data-bv-validator="notEmpty" data-bv-for="startTime" data-bv-result="INVALID" style="">受邀人不能为空</small>
	                         </div>
	                     </div>
                         <div class="form-group has-error hidden" id="guestTablePrompt1">
	                         <label class="col-sm-2 control-label"></label>
	                         <div class="col-sm-9">
	                             <small class="help-block" data-bv-validator="notEmpty" data-bv-for="startTime" data-bv-result="INVALID" style="">存在受邀人身份信息不完整</small>
	                         </div>
	                     </div>
                         <div class="form-group">
                             <label class="col-sm-2 control-label">相关新闻：</label>
                             <div class="col-xs-10 col-md-9" id="relationArtTable">
                             </div>
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
  </body>

	<script src="<%=basePath%>static/page/CM/circleTopicHandle.js?v=<%=StaticVersion%>"></script>
</html>
