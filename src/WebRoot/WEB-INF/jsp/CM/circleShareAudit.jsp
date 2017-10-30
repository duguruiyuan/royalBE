<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>圈子内容管理-商帮帮后台</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/staticInclude.jsp"%>
  </head>
  <body class="gray-bg">
  <div class="wrapper wrapper-content  animated fadeInRight article">
        <div class="row">
            <div class="col-lg-10 col-lg-offset-1">
                <div class="ibox">
                    <div class="ibox-content">
                        <div class="text-center article-title">
                            <h1>
                            </h1>
                        </div>
                        <div class="text-center">
                       		<span class="label label-default" style="margin:5px">圈子</span>
                            <span id="circleNames"></span>
                        </div>
                        <div class="text-center">
                            <span class="label label-warning" id="createTime"></span>
                        </div>
                        <div id="articleContent">
                         
                        </div>
                        <hr>
                    </div>
                </div>
                <div class="ibox-content text-center">
                    <div class="form-group">
                         <div class="col-xs-12 col-md-12">
                            <textarea id="auditOpinion" placeholder="审核意见" type="text" style="resize: vertical;" class="form-control"></textarea>
                        </div>
                    </div> 
               
                    <div class="tooltip-demo">
                        <button type="button" class="btn btn-primary" onclick="page.eventHandler.audit(0)">审核通过并发布</button>
                        <button type="button" class="btn btn-danger" onclick="page.eventHandler.audit(1)">审核不通过打回重写</button>
                    </div>
                    <br>
                </div>
            </div>
        </div>
    </div>
  </body>
   	<%--表单控件--%>
    <link href="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
    <link href="<%=basePath%>static/lib/bootstrap3-editable/css/bootstrap-editable.css" rel="stylesheet">
	<script src="<%=basePath%>static/lib/bootstrap3-editable/js/bootstrap-editable.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table-editable.min.js"></script>
    <%--弹窗控件--%>
    <link href="<%=basePath%>static/lib/sweetalert/sweetalert.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/sweetalert/sweetalert.min.js"></script>
    <%--toastr提示控件--%>
    <link href="<%=basePath%>static/lib/toastr/css/toastr.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/toastr/js/toastr.min.js"></script>
    <script src="<%=basePath%>static/lib/toastr/customOptions.js"></script>
    <%--时间转换控件--%>
	<script src="<%=basePath%>static/lib/moment/moment.min.js"></script>
	
	<script>var pageId = ${paramMap.page_id};</script>
    <%--页面css及js文件--%>	
	<script src="<%=basePath%>static/page/CM/circleShareAudit.js"></script>
</html>
