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
                        <h3>内容管理 > 圈子活动 > 审核</h3>
                    </div>
                    <div class="ibox-content">
                        <form class="form-horizontal">

                            <div class="form-group">
                                <label class="col-sm-2 control-label">标题</label>
                          		<div class="col-xs-10 col-md-8"> 
                          			<div class="form-control" id="title"></div> 
                 
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">圈子</label>
                           		<div class="col-xs-10 col-md-8"> 
                           			<div class="form-control label-box" id="circles">
      							
      								</div> 

                        
                                </div>
                            </div>
                 
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">开始时间</label>
      							<div class="col-xs-10 col-md-3"> 
                          			<div class="form-control" id="startTime"></div> 
                                </div>
                                    <label class="col-sm-2 control-label">结束时间</label>
      							<div class="col-xs-10 col-md-3"> 
                          			<div class="form-control" id="endTime"></div> 
                                </div>
                            </div>
                       		<div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">地点</label>
                                <div class="col-xs-10 col-md-8"> 
                                   		<div class="form-control" id="place"></div> 
                                </div>
                            </div>
              				<div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">分享嘉宾</label>
                                <div class="col-xs-10 col-md-8"> 
                                   <table id="guestTable"></table> 
         					    </div>
                            </div>
       						<div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">活动介绍</label>
                                 <div class="col-xs-10 col-md-8">
                                 	<div class="form-control" id="description"></div> 
                                    <!-- <textarea id="circleDes" type="text" style="resize: vertical;" class="form-control"></textarea> -->
                                </div>
                            </div>
                            
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">审核意见</label>
                                 <div class="col-xs-10 col-md-8">
                                    <textarea id="auditOpinion" type="text" style="resize: vertical;" class="form-control"></textarea>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-sm-12 col-sm-offset-2">
                                    <button id="auditPass" class="btn btn-primary" type="button" onclick="page.eventHandler.audit(0)">审核通过</button>
                                    <button id="auditReject" class="btn btn-danger" type="button" onclick="page.eventHandler.audit(1)">审核不通过</button>
                                </div>
                             
                            </div>
                        </form>
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
        <%--时间转换控件--%>
	<script src="<%=basePath%>static/lib/moment/moment.min.js"></script>
      <script>var pageId = ${paramMap.page_id}</script>
   	<script src="<%=basePath%>static/page/CM/circleActivityAudit.js"></script>
</html>
