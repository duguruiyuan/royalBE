<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>评论管理</title>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body>
	<div class="wrapper wrapper-content animated fadeInRight dashboard-header">
	    <div class="ibox float-e-margins">
	        <div class="ibox-title">
                <h3>评论管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">待发评论</small></h3>
            </div>
		    <form id="frmAddComment" class="form-horizontal">
	            <div class="form-group" id="selectText">
	                <label class="col-sm-2 control-label">原文：</label>
	                <div class="col-sm-9" id="selectCommentArticle">
				        
	                </div>
	            </div>
	            <div class="form-group" id="textPrompt" style="display:none">
	                <label class="col-sm-2 control-label"></label>
	                <div class="col-sm-9" style="color:#a94442">请选择文章</div>
	            </div>
	            <!--<div class="form-group">
	                <label class="col-sm-2 control-label">评论类型：</label>
	                <div class="col-sm-9">
	                    <div class="radio i-checks" data-value="0" data-name="type">
			                <label><input type="radio" checked="" value="option2" name="a"> <i></i> 文字</label>
			            </div>
			            <div class="radio i-checks" data-value="1" data-name="type">
			                <label><input type="radio" value="option1" name="a"> <i></i> 语音</label>
			            </div>
	                </div>
	            </div>  -->
	            <div class="form-group has-success">
                    <label class="col-sm-2 control-label">评论类型：</label>
                    <div class="col-sm-9">
                        <label for="radType1" class="radio i-checks radio-inline" data-value="0">
                            <input id="radType1" name="radType" type="radio" value="0" checked="checked" data-toggle="" />文字
                        </label>
                        <label for="radType2" class="radio i-checks radio-inline" data-value="1">
                            <input id="radType2" name="radType" type="radio" value="1" data-toggle="#typVoice" />语音
                        </label>
                    </div>
                </div>
	            <div class="form-group">
	                <label class="col-sm-2 control-label">用户：</label>
	                <div class="col-sm-9" id="selectUser">
                        
                    </div>
	            </div>
	            <div class="form-group" id="typVoice">
			        <label class="col-sm-2 control-label">语音：</label>
			        <div class="col-sm-9">
			            <input id="fileSelector" type="file" multiple name="file" />
			        </div>
			    </div>
			    <div class="form-group" id="typVoicePrompt" style="display:none">
			        <label class="col-sm-2 control-label"></label>
			        <div class="col-sm-9" style="color:#a94442">语音必须上传</div>
			    </div>
			    <div class="form-group" id="typVoicePrompt1" style="display:none">
			        <label class="col-sm-2 control-label"></label>
			        <div class="col-sm-9" style="color:#a94442">语音时长要小于60秒</div>
			    </div>
			    <div class="form-group">
			        <label class="col-sm-2 control-label" id="type-title">评论内容：</label>
			        <div class="col-sm-9">
			            <textarea class="form-control" rows="3" cols="30" id="content" name="content"></textarea>
			            <small class="help-block" data-bv-validator="notEmpty" data-bv-for="content" data-bv-result="NOT_VALIDATED" style="display: none;">评论内容不能为空</small>
			        </div>
			    </div>
			    <div class="row m-t-lg text-center" id="divAction">
	                <button id="comment-success" type="button" class="btn btn-lg btn-primary dim m-l"><i class="glyphicon glyphicon-floppy-saved"></i>&nbsp;&nbsp;确定新增</button>
	                <button id="btnCancel" type="button" data-action="audit,add,edit" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
	            </div>
		    </form>
	    </div>
	</div>
	
    <%--页面css及js文件--%>
    <link href="<%=basePath%>css/comment/comment_wait.css" rel="stylesheet">
    <script src="<%=basePath%>static/page/comment/comment_wait.js?v=<%=StaticVersion%>"></script>
</body>
</html>
