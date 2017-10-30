<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>圈子内容管理-商帮帮后台</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/amdInclude.jsp"%>
  </head>
  <body class="gray-bg">
    <div class="wrapper wrapper-content animated">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>圈子管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">推荐圈子</small></h3>
            </div>
            <div class="ibox-content">
	        <div class="col-sm-12 col-md-4">
                <div id="circleBox1" class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h3>推荐圈子一<button id="circleBtn1" class="btn btn-warning right" style="display: none;" data-index="1" onclick="page.eventHandler.delete(1);">取消推荐</button></h3> 
                        <br/> 
                    	<div id="circleselect1"></div>         
                    </div>
                    <div id="circleContent1" data-index="1" data-id="">     
           				
                    </div>
				</div>
		    </div>
            <div class="col-sm-12 col-md-4">
               <div id="circleBox2" class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h3>推荐圈子二<button id="circleBtn2" class="btn btn-warning right" style="display: none;" data-index="2" onclick="page.eventHandler.delete(2);">取消推荐</button></h3> 
                        <br/>   
                    <div id="circleselect2"></div> 
                    </div>
                     <div id="circleContent2" data-index="2" data-id="">
             		
					</div>
				</div>
		    </div>
            <div class="col-sm-12 col-md-4">
              <div id="circleBox3" class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h3>推荐圈子三<button id="circleBtn3" class="btn btn-warning right" style="display: none;" data-index="3" onclick="page.eventHandler.delete(3);">取消推荐</button></h3>
                        <br/> 
                    <div id="circleselect3"></div>
                    </div>
                     <div id="circleContent3"  data-index="3" data-id="">
                    </div>
				</div>
		    </div>
            </div>

        </div>
    </div>
  </body>
  	<%--表单控件--%>
<%--     <link href="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-suggest/bootstrap-suggest.js"></script>
    表单验证组件
    <script src="<%=basePath%>static/lib/bootstrapValidator/bootstrapValidator.min.js"></script>
	弹窗控件
	<link href="<%=basePath%>static/lib/sweetalert/sweetalert.css" rel="stylesheet" />
	<script src="<%=basePath%>static/lib/sweetalert/sweetalert.min.js"></script>
    toastr提示控件
    <link href="<%=basePath%>static/lib/toastr/css/toastr.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/toastr/js/toastr.min.js"></script>
    <script src="<%=basePath%>static/lib/toastr/customOptions.js"></script>
    图片懒加载占位
    <script src="<%=basePath%>static/lib/jquery-lazyload/jquery.lazyload.min.js"></script>
	<link href="<%=basePath%>static/common/extend.css" rel="stylesheet">
	
    layer弹窗控件
    <link href="<%=basePath%>static/lib/layer/layer.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/layer/layer.js"></script>
    树组件
    <link href="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.js"></script>
    
    <script src="<%=basePath%>static/common/module/module.inputSelector.js"></script> --%>
    
	<script src="<%=basePath%>static/page/circles/circlesRecom.js?v=<%=StaticVersion%>"></script>
</html>
