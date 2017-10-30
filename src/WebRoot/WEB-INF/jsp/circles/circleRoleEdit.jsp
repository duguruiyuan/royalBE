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
	                        <h3>圈子管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">角色管理</small></h3>
	                    </div>
			    </div>
		  	 </div>
		  	  <div class="col-sm-12">
	                <div class="ibox float-e-margins">
	                    <div class="ibox-title">
	                        <h3>角色维护</h3>
	                    </div>
	             		<div class="ibox-content">
	             		   <div id="roleTableTools">
			                    <form class="form-inline bars">
			         				<button class="btn btn-primary" type="button" onclick="page.eventHandler.openAddPanel(0,3)">添加角色</button> 	
			                    </form>
			                </div>	
	             			<div class="m-l-sm m-r-sm">
							  	<table id="roleTable">
								</table>						   
							</div>
					</div>
			    </div>
		  	 </div>
		  	  <div class="col-sm-12">
	                <div class="ibox float-e-margins">
	                    <div class="ibox-title">
	                        <h3>管理员维护</h3>
	                    </div>
	             		<div class="ibox-content">
             				<div class="m-l-sm m-r-sm">
							  	<table id="managerTable">
								</table>
							</div>
					</div>
			    </div>
		  	 </div>
	     </div>
      </div>
      
       <div id="roleModal" class="modal fade" role="dialog" aria-labelledby="myLargeModalLabel">
         <div class="modal-dialog">
          <div class="modal-content">
	          <div class="modal-header center">
	          <h4 class="modal-title" style="text-align: center">角色</h4>
	          </div>
	          <div class="modal-body table-modal-body">
	               <form id="roleForm" class="form-horizontal">
			    		<div class="form-group">
			                 <label class="col-sm-2 control-label">角色名称</label>
			                 <div class="col-sm-10">
			                     <input id="roleName" name="roleName" type="text" class="form-control">
			                 </div>
			             </div>
			           	<div class="form-group">
			                 <label class="col-sm-2 control-label">角色类型</label>  
	                         <div class="col-sm-10">
	                         	 <input id="roleType" disabled name="roleType" data-type="3" type="text" class="form-control">
	                         </div>            
	                    <!-- <div class="col-sm-10 input-group">
	                            <select id="roleType" class="form-control">
	                                <option value="1">圈主</option>
	                                <option value="2">管理员</option>
                                    <option value="3">成员</option>
	                            </select>
	                        </div> -->
		
			             </div>
			             	<div class="form-group">
			                 <label class="col-sm-2 control-label">角色人员</label>
			                 <div class="col-sm-10">
			                     <input id="roleMan" name="roleMan" readonly onclick="page.eventHandler.openUserSelect()" type="text" class="form-control">
			                 </div>
			             </div>
	                </form>
	          </div>
	          <div class="modal-footer">
	          <button type="button" class="btn button button-rounded" data-dismiss="modal">关闭</button>
	          <button id="panelSure" type="button" class="btn btn-primary button button-rounded" data-type="0" onclick="page.eventHandler.update(this)">确定</button>
	          </div>
          </div>
        </div>
      </div> 
      
  </body>
	<%--表单控件--%>
<%--     <link href="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
    layer弹窗控件
    <link href="<%=basePath%>static/lib/layer/layer.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/layer/layer.js"></script>
    树组件
    <link href="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.js"></script>
    弹窗控件
    <link href="<%=basePath%>static/lib/sweetalert/sweetalert.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/sweetalert/sweetalert.min.js"></script>
    toastr提示控件
    <link href="<%=basePath%>static/lib/toastr/css/toastr.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/toastr/js/toastr.min.js"></script>
    <script src="<%=basePath%>static/lib/toastr/customOptions.js"></script>
    时间转换控件
	<script src="<%=basePath%>static/lib/moment/moment.min.js"></script>
	
    <script src="<%=basePath%>static/common/module/module.multSelector.js"></script> --%>
	
	<!-- <script src="<%=basePath%>static/common/tSelector.js"></script> -->
    <%--页面css及js文件--%>	
    <style>
    	.pagination-detail {
    		display:none;
    	}
    </style>
    <script>var pageId = ${paramMap.circle_id}</script>
	<script src="<%=basePath%>static/page/circles/circleRoleEdit.js"></script>
</html>
