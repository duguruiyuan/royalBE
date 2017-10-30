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
      		 <div class="col-sm-2">
                <div class="ibox float-e-margins">
                 		<div class="ibox-title">
	                       <h3>圈子管理</h3>
	                    </div>
	             		<div class="ibox-content">
	             			<a class="btn btn-block btn-white" href="circleCMAll.shtml?circle_id=${paramMap.circle_id}">全部</a>
							<a class="btn btn-block btn-white"  href="circleCMActivity.shtml?circle_id=${paramMap.circle_id}">活动</a>
							<a class="btn btn-block btn-white"  href="circleCMTopic.shtml?circle_id=${paramMap.circle_id}">话题</a>
							<a class="btn btn-block btn-white"  href="circleCMShare.shtml?circle_id=${paramMap.circle_id}">帖子</a>
							<a class="btn btn-block btn-white"  href="circleCMHelp.shtml?circle_id=${paramMap.circle_id}">帮助</a>
							<a class="btn btn-block btn-white"  href="circleCMTop.shtml?circle_id=${paramMap.circle_id}">置顶</a>
							<a class="btn btn-block btn-white"  href="circleCMGood.shtml?circle_id=${paramMap.circle_id}">精华</a>
							<a class="btn btn-block btn-white"  href="circleCMComments.shtml?circle_id=${paramMap.circle_id}">评论管理</a>
							<a class="btn btn-block btn-primary">已删除内容</a>
							<a class="btn btn-block btn-white"  href="circleCMDeletedComments.shtml?circle_id=${paramMap.circle_id}">已删除评论</a>
						</div>
                </div>
            </div>
	       
            <div class="col-sm-10">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h3>内容管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">已删除帖子列表</small></h3> 
                    </div>
					<div class="ibox-content">
					    <div id="tableTools">
		                    <form class="form-inline bars" onsubmit="return false">
		                        <div class="input-group m-b-xs">
		                        	<input id="keyword" name="keyword" type="text" class="form-control" placeholder="请输入搜索关键字">
		                        </div>
		                        <button onclick="page.eventHandler.search()" type="button" class="btn btn-primary">搜索</button>
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
  </body>
	<!--日期控件-->
<%--     <link href="<%=basePath%>static/lib/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/datetimepicker/datetimepicker.min.js"></script>
    表单控件
    <link href="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
    弹窗控件
    <link href="<%=basePath%>static/lib/sweetalert/sweetalert.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/sweetalert/sweetalert.min.js"></script>
    layer弹窗控件
    <link href="<%=basePath%>static/lib/layer/layer.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/layer/layer.js"></script>
    
    toastr提示控件
    <link href="<%=basePath%>static/lib/toastr/css/toastr.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/toastr/js/toastr.min.js"></script>
    <script src="<%=basePath%>static/lib/toastr/customOptions.js"></script> --%>
    <%--页面css及js文件--%>	
    <script>var pageId = ${paramMap.circle_id}</script>
	<script src="<%=basePath%>static/page/circles/circleCMDeletedPosts.js?v=<%=StaticVersion%>"></script>
</html>
