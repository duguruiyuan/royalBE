<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>评论管理</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../../include/staticInclude.jsp"%>
</head>
<body class="gray-bg" style="background:#fff">
	<div class="wrapper wrapper-content animated fadeInRight dashboard-header">
	    <div class="ibox float-e-margins ibox-content">
	        <div class="ibox-title">
	            <h3>评论管理&nbsp;&nbsp;&nbsp;<small>代发评论</small></h3>
	        </div>
		    <form id="frmAddCiphertext" class="form-horizontal">
	            <div class="form-group" id="selectText">
	                <label class="col-sm-2 control-label">原文：</label>
	                <div class="col-sm-9">
				        <button type="button" class="btn btn-primary" id="select_text">选择文章</button>
				        &nbsp;&nbsp;<span class="label-warning" id="articleTitle"></span>
				        <div id="textPrompt" style="display:none;color:#ed5565"></div>
	                </div>
	            </div>
	            <div class="form-group">
	                <label class="col-sm-2 control-label">评论类型：</label>
	                <div class="col-sm-9">
	                    <div class="radio i-checks" data-value="0" data-name="type">
			                <label><input type="radio" checked="" value="option2" name="a"> <i></i> 文字</label>
			            </div>
			            <div class="radio i-checks" data-value="1" data-name="type">
			                <label><input type="radio" value="option1" name="a"> <i></i> 语音</label>
			            </div>
	                </div>
	            </div>
	            <div class="form-group" id="selectExampleUser">
	                <label class="col-sm-2 control-label">用户：</label>
	                <div class="col-sm-9">
                        <span id="user_info"></span>
                        <span class="btn btn-info" id="select_user">选择榜样人物</span>
                        <div id="exampleUserPrompt" style="display:none;color:#ed5565"></div>
                    </div>
	            </div>
	            <div class="form-group" id="voice-comment" style="display:none">
			        <label class="col-sm-2 control-label">语音：</label>
			        <div class="col-sm-9">
			            <input id="fileSelector" type="file" multiple name="file" />
			            <!--<button class="btn btn-success " type="button"><i class="fa fa-upload"></i>&nbsp;&nbsp;
			               <span class="bold">上传</span>
			            </button>  -->
			        </div>
			    </div>
			    <div class="form-group">
			        <label class="col-sm-2 control-label" id="type-title">评论内容：</label>
			        <div class="col-sm-9">
			            <textarea class="form-control" rows="3" cols="30" id="content" name="content"></textarea>
			        </div>
			    </div>
			    <div class="row m-t-lg text-center">
	                <button id="comment-success" type="button" class="btn btn-lg btn-primary dim m-l"><i class="glyphicon glyphicon-floppy-saved"></i>&nbsp;&nbsp;确定新增</button>
	                <button id="btnCancel" type="button" data-action="audit,add,edit" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
	            </div>
		    </form>
	    </div>
	</div>
	<%--表单验证组件--%>
    <script src="<%=basePath%>static/lib/bootstrapValidator/bootstrapValidator.min.js"></script>
    <!--日期控件-->
    <link href="<%=basePath%>static/lib/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/datetimepicker/datetimepicker.min.js"></script>
    <%--表单控件--%>
    <link href="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
    <%--上传组件--%>
    <link href="<%=basePath%>static/lib/bootstrap-fileinput/css/fileinput.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-fileinput/js/fileinput.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-fileinput/js/locales/zh.js"></script>
    <%--弹窗控件--%>
    <link href="<%=basePath%>static/lib/sweetalert/sweetalert.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/sweetalert/sweetalert.min.js"></script>
    <script src="<%=basePath%>vendor/layer/layer.js"></script>
    <!-- iCheck -->
    <link href="<%=basePath%>css/plugins/iCheck/custom.css" rel="stylesheet">
    <script src="<%=basePath%>js/plugins/iCheck/icheck.min.js"></script>
    <%-- 选择用户 --%>
    <link href="<%=basePath%>css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
    <%--上传对接七牛--%>
    <script src="<%=basePath%>static/common/helper.qiniu.js"></script>
    <script src="<%=basePath%>js/TSelector.js"></script>
    <%--用户选择组件--%>
    <script src="<%=basePath%>static/common/module/module.monoSelector.js?v=<%=StaticVersion%>"></script>
    <%--自定义组件--%>
    <%--文件上传组件--%>
    <script src="<%=basePath%>static/common/module/module.fileUpload.js?v=<%=StaticVersion%>"></script>
    <%--文章选择组件--%>
    <script src="<%=basePath%>static/common/module/module.articleSelector.js?v=<%=StaticVersion%>"></script>
    <!-- 选择文章 -->
    <script src="<%=basePath%>js/ArticleSelector.js?v=<%=StaticVersion%>"></script>
    <%--页面css及js文件--%>
    <link href="<%=basePath%>css/comment/comment_wait.css" rel="stylesheet">
    <script src="<%=basePath%>js/public.js?v=<%=StaticVersion%>"></script>
    <script src="<%=basePath%>js/comment/comment_wait.js?v=<%=StaticVersion%>"></script>
</body>
</html>
