<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
	<head>
	    <meta charset="utf-8">
	    <title>编辑焦点位</title>
	    <%@ include file="../include/amdInclude.jsp"%>
	</head>
	  
	<body>
	    <div class="wrapper wrapper-content animated">
	        <div class="ibox float-e-margins">
	            <div class="ibox-content">
	                <form id="frmAddfocus" class="form-horizontal">
	                    <div class="form-group" id="fileContainer">
	                        <label class="col-sm-2 control-label">图片：</label>
	                        <div class="col-sm-9">
	                            <input id="fileSelector" type="file" multiple name="file" />
	                            <input name="fileUrl" type="hidden" id="fileUrl" />
	                        </div>
	                    </div>
	                    <div class="form-group">
	                        <label class="col-sm-2 control-label">标题：</label>
				            <div class="col-sm-9">
				              <input id="focusTitle" type="text" class="form-control title url-text-input" name="textTitle" placeholder="请输入标题" data-postion="0" />
				            </div>
	                    </div>
	                    <div class="form-group has-success">
	                        <label class="col-sm-2 control-label">类型：</label>
				            <div class="col-md-9 type-link">
				                <label for="radType1" class="radio i-checks radio-inline" data-value="0">
				                    <input id="radType1" class="radio-btn" name="radType" type="radio" value="0" checked="checked" data-toggle="#typeInLink" />站内文章
				                </label>
				                <label for="radType2" class="radio i-checks radio-inline" data-value="1">
				                    <input id="radType2" class="radio-btn" name="radType" type="radio" value="1" data-toggle="#typeOutLink" />外部链接
				                </label>
				            </div>
	                    </div>
	                    <div class="form-group" id="typeInLink">
				            <label class="col-sm-2 control-label">站内文章：</label>
				            <div class="col-md-9" id="focusLink">              
				                
				            </div>
				        </div>
				        <div class="form-group hidden" id="typeInLinkPrompt">
				            <label class="col-sm-2 control-label"></label>
				            <div class="col-md-9 text-prompt" style="color:#a94442">内部链接不能为空</div>
				        </div>
				        <div class="form-group" id="typeOutLink">
				            <label class="col-sm-2 control-label">外部链接：</label>
				            <div class="col-md-9">
				                <input id="outLink" type="text" name="outLink" placeholder="请输入外部链接" class="form-control select-url-obtain" data-value="1">                 
				               <!--  <div class="text-prompt hidden">外部链接不能为空</div>-->
				            </div>
				        </div>
				        <div class="form-group has-error hidden" id="typeOutLinkPrompt">
				            <label class="col-sm-2 control-label"></label>
				            <div class="col-md-9 text-prompt"></div>
				        </div>
				        <div class="row m-t-lg text-center" id="divAction">
			                <div class="col-md-offset-3 col-md-3"><button id="btnConfirm" type="button" disabled="disabled" class="btn btn-primary btn-block btn-lg"><i class="glyphicon glyphicon-floppy-saved"></i>&nbsp;&nbsp;确定修改</button></div>
			                <div class="col-md-3"><button id="btnCancel" type="button" disabled="disabled" class="btn btn-default btn-block btn-lg"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button></div>
			            </div>
	                    <!--<div id="divAction" class="row m-t-lg text-center">
	                        <button id="btnConfirm" type="button"class="btn btn-lg btn-primary dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;确定修改</button>
	                        <button id="btnCancel" type="button" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
	                    </div>  -->
	                </form>
	            </div>
	        </div>
	    </div>
        
        <%--页面css及js文件--%>
        <script src="<%=basePath%>static/page/focus/focalPositionEdit.js?v=<%=StaticVersion%>"></script>
	</body>
</html>
