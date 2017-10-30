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
							<a class="btn btn-block btn-white" href="circleCMActivity.shtml?circle_id=${paramMap.circle_id}">活动</a>
							<a class="btn btn-block btn-white" href="circleCMTopic.shtml?circle_id=${paramMap.circle_id}">话题</a>
							<a class="btn btn-block btn-white" href="circleCMShare.shtml?circle_id=${paramMap.circle_id}">帖子</a>
							<a class="btn btn-block btn-white" href="circleCMHelp.shtml?circle_id=${paramMap.circle_id}">帮助</a>
							<a class="btn btn-block btn-white" href="circleCMTop.shtml?circle_id=${paramMap.circle_id}">置顶</a>
							<a class="btn btn-block btn-white" href="circleCMGood.shtml?circle_id=${paramMap.circle_id}">精华</a>
							<a class="btn btn-block btn-primary">评论管理</a>
						<a class="btn btn-block btn-white"  href="circleCMDeletedPosts.shtml?circle_id=${paramMap.circle_id}">已删除内容</a>
							<a class="btn btn-block btn-white" href="circleCMDeletedComments.shtml?circle_id=${paramMap.circle_id}">已删除评论</a>
						</div>
                </div>
            </div>
	       
	            <div class="col-sm-10">
	                <div class="ibox float-e-margins">
	                    <div class="ibox-title">
	                        <h3>内容管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">评论列表</small></h3>  
	                    </div>
						<div class="ibox-content">
						    <div id="tableTools">
			                    <form class="form-inline bars" onsubmit="return false">
									<button type="button" class="btn btn-primary" id="btnAdd">代发评论</button>
			                        <div class="input-group date m-b-xs">
			                            <input id="start_time" class="form-control form_date" size="10" type="text" value="" placeholder="评论日期-起" readonly />
			                            <label for="startTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
			                        </div>
			                        <div class="input-group date m-b-xs">
			                            <input id="end_time" class="form-control form_date" size="10" type="text" value="" placeholder="评论日期-止" readonly />
			                            <label for="endTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
			                        </div>
			                        <div class="input-group m-b-xs" style="width:340px">
			                            <input id="keyword" type="text" class="form-control" placeholder="请输入要搜索的内容（标题/评论内容/翻译内容）" />
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
	  		
	  		 <div id="translateModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
         	 <div class="modal-dialog">
          		<div class="modal-content">
			          <div class="modal-header center">
			          <h4 class="modal-title" style="text-align: center">评论翻译</h4>
			          </div>
			          <div class="modal-body table-modal-body">
		               <form id="translateForm" class="form-horizontal">   
				           	<div class="form-group">
				                 <div class="col-sm-12">
				                     <input id="translation" name="translation" type="text" class="form-control">
				                 </div>
				             </div>
		                </form>
			          </div>
			          <div class="modal-footer">
			          <button type="button" class="btn button button-rounded" data-dismiss="modal">关闭</button>
			          <button type="button" class="btn btn-primary button button-rounded" onclick="insertTranslation()">确定</button>
			          </div>
        					
          		</div>	
          	</div>
          </div>
  </body>
<%-- 	<!--日期控件-->
    <link href="<%=basePath%>static/lib/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/datetimepicker/datetimepicker.min.js"></script>
    表单控件
    <link href="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.js"></script>
    <link href="<%=basePath%>static/lib/bootstrap3-editable/css/bootstrap-editable.css" rel="stylesheet">
	<script src="<%=basePath%>static/lib/bootstrap3-editable/js/bootstrap-editable.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table-editable.min.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
    弹窗控件
    <link href="<%=basePath%>static/lib/sweetalert/sweetalert.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/sweetalert/sweetalert.min.js"></script>
    layer弹窗控件
    <link href="<%=basePath%>static/lib/layer/layer.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/layer/layer.js"></script>
    树组件
	<link href="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.min.css" rel="stylesheet" />
	<script src="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.js"></script>
    layer弹窗控件
    <link href="<%=basePath%>static/lib/layer/layer.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/layer/layer.js"></script>
	扩展表单选择框组件的自动替换及切换功能面板插件
	<script src="<%=basePath%>static/lib/iCheck/icheck-toggle.js?v=<%=StaticVersion%>"></script>
	
    表单选择框组件
	<link href="<%=basePath%>static/lib/iCheck/custom.css" rel="stylesheet" />
	<script src="<%=basePath%>static/lib/iCheck/icheck.min.js"></script>
    自定义组件
	推送组件
	<script src="<%=basePath%>static/common/module/module.otherPush.js?v=<%=StaticVersion%>"></script>
	<script src="<%=basePath%>static/common/module/module.multSelector.js?v=<%=StaticVersion%>"></script>
  
    <link href="<%=basePath%>static/lib/toastr/css/toastr.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/toastr/js/toastr.min.js"></script>
    <script src="<%=basePath%>static/lib/toastr/customOptions.js"></script>
    语音UI插件
    <link href="<%=basePath%>static/lib/plyr/plyr.css" rel="stylesheet">
	<script src="<%=basePath%>static/lib/plyr/plyr.js"></script> --%>
    <%--页面css及js文件--%>	
    <script>var pageId = ${paramMap.circle_id}</script>
	<script src="<%=basePath%>static/page/circles/circleCMComments.js?v=<%=StaticVersion%>"></script>
</html>
