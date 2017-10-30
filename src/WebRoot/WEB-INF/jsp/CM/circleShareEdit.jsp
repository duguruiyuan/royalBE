<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>圈子新增-商帮帮后台</title>
    <%@ include file="../include/staticInclude.jsp"%>
    <style>
    	.pagination-detail {
    		display:none;
    	}
    </style>
  </head>
  <body class="gray-bg">
     <div class="wrapper wrapper-content animated fadeInRight">
	 <div class="row">
            <div class="col-sm-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h3>内容管理 > 帖子 > 编辑</h3>
                    </div>
                    <div class="ibox-content">
                        <form id="pageForm" class="form-horizontal bars">         
                            <div class="form-group">
                                <label class="col-sm-2 control-label">标题</label>
                             <div class="col-xs-10 col-md-8">  
                                    <input id="title" name="title" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">圈子</label>
                                  <div class="col-xs-10 col-md-8"> 
                                    <input id="circles" name="circles" onclick="page.circlesSelector.openSelector()" type="text" readonly placeholder="点击选择" class="form-control">
                                </div>
                            </div>   
                             <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">导语</label>
                                  <div class="col-xs-10 col-md-8"> 
                                    <textarea id="summary" name="summary" type="text" placeholder="点击添加" class="form-control"></textarea>
                                </div>
                            </div>  
                          	<div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">正文</label>
                                <div class="col-xs-10 col-md-8">      
                                    <div id="contentEditor">
							    	</div>                   
                                </div>
                            </div>   
                             <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <div class="col-sm-4 col-sm-offset-2">
                                    <button class="btn btn-primary" type="button" onclick="page.eventHandler.post(this)">保存</button>
                                </div>
                            </div>          	
                        </form>
                    </div>
                </div>
            </div>
        </div>
	    </div>
	    </div>
  </body>  

 	<%--表单控件--%>
    <link href="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
    <%--弹窗控件--%>
    <link href="<%=basePath%>static/lib/sweetalert/sweetalert.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/sweetalert/sweetalert.min.js"></script>
    <%--toastr提示控件--%>
    <link href="<%=basePath%>static/lib/toastr/css/toastr.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/toastr/js/toastr.min.js"></script>
    <script src="<%=basePath%>static/lib/toastr/customOptions.js"></script>
  	<%--上传对接七牛--%>
    <script src="<%=basePath%>static/common/helper.qiniu.js"></script>
    <%--富文本编辑器组件summernote--%>
    <link href="<%=basePath%>static/lib/summernote/summernote.css" rel="stylesheet">
    <link href="<%=basePath%>static/lib/summernote/summernote-bs3.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/summernote/summernote.min.js"></script>
    <script src="<%=basePath%>static/lib/summernote/summernote-zh-CN.js"></script>
    <%--富文本编辑器对接七牛--%>
    <script src="<%=basePath%>static/lib/summernote/summernote-qiniu.js"></script>
    <%--日期选择控件--%>
    <script src="<%=basePath%>static/lib/layer/laydate/laydate.js"></script>
    <%--表单验证控件--%>
    <script src="<%=basePath%>static/lib/bootstrapValidator/bootstrapValidator.min.js"></script>
    <%--页面css及js文件--%>	
    <script>var pageId = ${paramMap.page_id}</script>
    <script src="<%=basePath%>static/common/tSelector.js"></script>
	<script src="<%=basePath%>static/page/CM/circleShareEdit.js"></script>
</html>
