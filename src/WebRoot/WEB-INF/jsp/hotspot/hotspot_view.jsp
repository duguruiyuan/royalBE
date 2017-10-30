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
    	<title>早茶查看-商帮帮后台</title>
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
       <form id="addprojectForm" class="form-horizontal" novalidate="novalidate">
        	<div class="modal-body" id="projectForm">
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">标题</label>
        				<div class="col-xs-9">
            				<span id="title"></span>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">导语</label>
        				<div class="col-xs-9">
            				<span id="summary"></span>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">状态</label>
        				<div class="col-xs-9">
            				<span id="status"></span>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">专题链接</label>
        				<div class="col-xs-9">
            				<table id="relationArtList"></table>  
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">信息流推送</label>
        				<div class="col-xs-9">
            				<div class="row">
				        <div class="col-md-9">
				          <div class="row" id="reminderObject" >
				            <div id="all" class="col-md-3 text-align"  style="display: none">
				              	 全部用户
					        </div>
				          </div>
				          <div class="row" style="display: none" id ="part">
				            <div class="row" style="display: none" id ="sh" >
				              <div class="col-md-3 text-align">商会：</div>
				              <div class="col-md-6">
				                <span id="shanghui"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="hy">
				             <div class="col-md-3 text-align">行业：</div>
				             <div class="col-md-6">
				                 <span id="industry"></span>
				             </div>
				            </div>
				            <div class="row" style="display: none" id ="dq">
				              <div class="col-md-3 text-align">地区：</div>
				              <div class="col-md-6">
				                 <span id="region"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="jg">
				              <div class="col-md-3 text-align">籍贯：</div>
				              <div class="col-md-6">
				                  <span id="nativeplace"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="yhz">
				              <div class="col-md-3 text-align">用户组：</div>
				              <div class="col-md-6">
				                  <span id="usergroup"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="yh">
				              <div class="col-md-3 text-align">用户：</div>
				              <div class="col-md-5">
				                  <span id="user"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="qz">
				              <div class="col-md-3 text-align">圈子：</div>
				              <div class="col-md-6">
				                  <span id="circle"></span>
				              </div>
				            </div>
				          </div>
				        </div>
				      </div>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">设备推送</label>
        				<div class="col-xs-9">
            				<div class="row">
				        <div class="col-md-9">
				          <div class="row" style="display: none" id ="sb_title" >
				              <div class="col-md-3 text-align">手机通知栏内容：</div>
				              <div class="col-md-6">
				                <span class="info-con"></span>
				              </div>
				          </div>
				          <div class="row" style="display: none" id ="sb_content" >
				              <div class="col-md-3 text-align">消息内容：</div>
				              <div class="col-md-6">
				                <span class="info-con"></span>
				              </div>
				          </div>
				          <div class="row" id="sb_reminderObject" >
				            <div id="sb_all" class="col-md-3 text-align"  style="display: none">
				              	 
					        </div>
				          </div>
				          <div class="row" style="display: none" id ="sb_part">
				            <div class="row" style="display: none" id ="sb_sh" >
				              <div class="col-md-3 text-align">商会：</div>
				              <div class="col-md-6">
				                <span class="info-con"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="sb_hy">
				             <div class="col-md-3 text-align">行业：</div>
				             <div class="col-md-6">
				                 <span class="info-con"></span>
				             </div>
				            </div>
				            <div class="row" style="display: none" id ="sb_dq">
				              <div class="col-md-3 text-align">地区：</div>
				              <div class="col-md-6">
				                 <span class="info-con"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="sb_jg">
				              <div class="col-md-3 text-align">籍贯：</div>
				              <div class="col-md-6">
				                  <span class="info-con"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="sb_yhz">
				              <div class="col-md-3 text-align">用户组：</div>
				              <div class="col-md-6">
				                  <span class="info-con"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="sb_yh">
				              <div class="col-md-3 text-align">用户：</div>
				              <div class="col-md-5">
				                  <span class="info-con"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="sb_qz">
				              <div class="col-md-3 text-align">圈子：</div>
				              <div class="col-md-6">
				                  <span class="info-con"></span>
				              </div>
				            </div>
				          </div>
				        </div>
				      </div>
        				</div>
    				</div>
        		</div>
			</form>
        	
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
		<script src="<%=basePath%>js/hotspot/hotspot_view.js"></script>
  	</body>
</html>
