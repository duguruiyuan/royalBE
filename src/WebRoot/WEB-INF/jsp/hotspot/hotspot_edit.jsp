<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String pid = request.getParameter("pid");
%>

<!DOCTYPE html>
<html lang="zh_cn">
	<head>
    	<meta charset="utf-8">
    	<title>修改-专题-商帮帮后台</title>
    	<%@ include file="../head-meta.jsp"%>
    	<%@ include file="../head-link.jsp"%>
    	<style>
    	.help-block {
		    margin-top: 0;
		}
		.modal-body {
		    padding: 20px 30px;
		}
    	</style>
	</head>
  
	<body class="gray-bg" style="background:#fff;padding-top:20px">
       <form id="addhotspotForm" class="form-horizontal" novalidate="novalidate">
        	<div class="modal-body" id="hotspotForm">
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">标题</label>
        				<div class="col-xs-9">
            				<input type="text" class="form-control" name="title" id="title"  placeholder="请输入标题" required="" >
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">导语</label>
        				<div class="col-xs-9">
            				<textarea class="form-control" rows="5" id="summary" placeholder="请输入导语"></textarea>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">专题链接</label>
        				<div class="col-xs-9">
            				<table id="relationArtList"></table>  
                           <button class="btn btn-primary mg-t-10" style="float:right;margin:10px;" type="button" onclick="openArtAdd()">添加站外文章</button>
                           <button class="btn btn-success mg-t-10 mg-r-20" style="float:right;margin:10px;" type="button" onclick="openArtSelector()">添加站内文章</button>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">信息流推送</label>
        				<div class="col-xs-9">
            				<button type="button" class="btn btn-info" onclick="openFeedPush()">信息流推送</button>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">设备推送</label>
        				<div class="col-xs-9">
            				<button type="button" class="btn btn-info" onclick="openDevicePush()">设备推送</button>
        				</div>
    				</div>
        		</div>
        		<div class="modal-footer">
            		<div class="col-sm-4 col-sm-offset-4 text-center">
				    	<button type="button" class="btn btn-primary" id="publish">确认修改</button>
					</div>
        		</div>
			</form>
			<div id="addOutArtModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
         	 <div class="modal-dialog">
          		<div class="modal-content">
			          <div class="modal-header center">
			          <h4 class="modal-title" style="text-align: center">添加文章</h4>
			          </div>
			          <div class="modal-body table-modal-body">
			               <form id="addOutArtForm" class="form-horizontal">   
					           	<div class="form-group">
					                 <label class="col-sm-2 control-label">标题</label>
					                 <div class="col-sm-10">
					                     <input id="outArtTitle" name="outArtTitle" type="text" class="form-control">
					                 </div>
					             </div>
					             	<div class="form-group">
					                 <label class="col-sm-2 control-label">链接</label>
					                 <div class="col-sm-10">
					                     <input id="outArtLink" name="outArtLink"  type="text" class="form-control">
					                 </div>
					             </div>
			                </form>
			          </div>
			          <div class="modal-footer">
			          <button type="button" class="btn button button-rounded" data-dismiss="modal">关闭</button>
			          <button type="button" class="btn btn-primary button button-rounded" onclick="insertArtAdd()">确定</button>
			          </div>
        					
          </div>	
          </div>
          </div>
        	
    	<!-- 全局js -->
    	<%@ include file="../script.jsp"%>
    	<script>
    		var pid = <%=pid%>;
    	</script>
    	<%--表单控件--%>
	    <link href="<%=basePath%>css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
	    <script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table.min.js"></script>
	    <script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table-mobile.min.js"></script>
	    <script src="<%=basePath%>js/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
	    <script src="<%=basePath%>js/public.js"></script>
    	<script src="<%=basePath%>js/global.js"></script>
    	<script src="<%=basePath%>vendor/validate/jquery.validate.min.js"></script>
		<script src="<%=basePath%>js/common.js"></script>
		<script src="<%=basePath%>js/ArticleSelector.js"></script>
		<script src="<%=basePath%>js/hotspot/hotspot_edit.js"></script>
  	</body>
</html>
