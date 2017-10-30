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
     <div class="wrapper wrapper-content animated fadeInRight">
	  	 <div class="row">
	       
	            <div class="col-sm-12">
	                <div class="ibox float-e-margins">
	                    <div class="ibox-title">
	                        <h3>内容管理 > 帖子 > 已发布</h3>
	                    </div>
	             		<div class="ibox-content">
						    <div id="tableTools">
						         <form class="form-inline bars">
						         	<div class="input-group m-b-xs">
			                        	<input id="circleKeyword" name="keyword" type="text" class="form-control" placeholder="请输入圈子关键字">
			                        </div>
			                      	<div class="input-group m-b-xs">
			                        	<input id="titleKeyword" name="keyword" type="text" class="form-control" placeholder="请输入标题关键字">
			                        </div>
                                    <div class="input-group m-b-xs">
			                       		<input placeholder="发布日期始" readonly class="form-control layer-date" id="startTime" name="startTime">
			                        </div>
	                               <div class="input-group m-b-xs">
			                       		<input placeholder="发布日期末" readonly class="form-control layer-date" id="endTime" name="endTime">
			                        </div> 
			                        <button onclick="page.eventHandler.search()" type="button" class="btn btn-success">搜索</button>
									<button onclick="page.eventHandler.reset()" type="reset" class="btn btn-white">重置</button>
			                    </form>			
							</div>
						   <div class="m-l-sm m-r-sm">
							   	<table id="tableList">
								</table>
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
              <%--日期选择控件--%>
    <script src="<%=basePath%>static/lib/layer/laydate/laydate.js"></script>
    <%--时间转换控件--%>
	<script src="<%=basePath%>static/lib/moment/moment.min.js"></script>
    <%--页面css及js文件--%>	
	<script src="<%=basePath%>static/page/CM/circleShareReleased.js"></script>
</html>
