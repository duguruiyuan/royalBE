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
     <div class="wrapper wrapper-content animated fadeInRight">
	  	 <div class="row">
            <div class="col-sm-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                		<h3>圈子管理 &nbsp;&nbsp;&nbsp;<small id="pageSubTitle">关注圈子的人</small></h3>
                    </div>
             		<div class="ibox-content">
	
					    <div id="tableTools">
		                    <form class="form-inline bars" onsubmit="return false">
		                        <div class="input-group m-b-xs">
		                        	<input id="keyword" name="keyword" type="text" class="form-control" placeholder="请输入搜索关键字">
		                        </div>
		                        <button type="button" class="btn btn-success" onclick="page.eventHandler.search()">搜索</button>
								<button type="button" class="btn btn-white" onclick="page.eventHandler.reset()">重置</button>
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
  </body>
	<%--表单控件--%>
<%--     <link href="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
    弹窗控件
    <link href="<%=basePath%>static/lib/sweetalert/sweetalert.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/sweetalert/sweetalert.min.js"></script>
    toastr提示控件
    <link href="<%=basePath%>static/lib/toastr/css/toastr.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/toastr/js/toastr.min.js"></script>
    <script src="<%=basePath%>static/lib/toastr/customOptions.js"></script>
    时间转换控件
	<script src="<%=basePath%>static/lib/moment/moment.min.js"></script> --%>
    <%--页面css及js文件--%>	
	<script src="<%=basePath%>static/page/circles/circlesFollowers.js"></script>
</html>
