<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
<head>
    <meta charset="utf-8">
    <title>主页-商帮帮后台</title>
    <%@ include file="../head-meta.jsp"%>
    <%@ include file="../head-link.jsp"%>
    <link href="<%=basePath%>css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <link href="<%=basePath%>vendor/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet">
    <link href="<%=basePath%>vendor/layer/layer.css" rel="stylesheet">
</head>
  <body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight">
        <div class="row">
            <div class="col-sm-12">
                <div class="ibox">
                	<div class="ibox-title">
                        <h2>大置顶</h2> 
                    </div>
                    <div class="ibox-content">                                        		
                   	    <div id="table-toolbar" class="form-inline">
							<form id="searchForm" class="right inline" >
								<div class="input-group date form_date " data-date="" data-date-format="yyyy-mm-dd " data-link-format="yyyy-mm-dd">
						            <input id="startTime" class="form-control" size="10" type="text" value="" placeholder="开始日期" readonly>     
						            <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
					        	</div>  
					        	<div class="input-group date form_date " data-date="" data-date-format="yyyy-mm-dd " data-link-format="yyyy-mm-dd">
						            <input id="endTime" class="form-control" size="10" type="text" value="" placeholder="结束日期" readonly>       
						            <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
					        	</div>
					        	<input type="text" name="title" id="title" class="form-control" placeholder="标题">			        	
					        	<button id="search" type="button" class="btn btn-info">查询</button>
					        	<button id="reset" type="reset" class="btn btn-default">重置</button>
				        	</form>
						</div>
                        <table id="feedTable">
                        </table>
                   	</div>
               	</div>
           	</div>
       	</div>
	</div>
	<div id="editTime" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
          <div class="modal-dialog">
          <div class="modal-content">
	          <div class="modal-header center">
	          <h4 class="modal-title" style="text-align: center">修改时间</h4>
	          </div>
	          <div class="modal-body table-modal-body">
	               <form id="addGuestForm" class="form-horizontal">
			    		<div class="form-group">
			                 <label class="col-sm-2 control-label">开始时间</label>
			                 <div class="col-sm-10">
			                     <div class="input-group date form_date1 " data-date="" data-date-format="yyyy-mm-dd hh:ii" data-link-format="yyyy-mm-dd hh:ii">
						            <input id="editStartTime" class="form-control" size="10" type="text" value="" placeholder="开始日期" readonly>     
						            <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
					        	</div> 
			                 </div>
			             </div>
			           	<div class="form-group">
			                 <label class="col-sm-2 control-label">结束时间</label>
			                 <div class="col-sm-10">
			                     <div class="input-group date form_date1 " data-date="" data-date-format="yyyy-mm-dd hh:ii" data-link-format="yyyy-mm-dd hh:ii">
						            <input id="editEndTime" class="form-control" size="10" type="text" value="" placeholder="结束日期" readonly>       
						            <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
					        	</div>
			                 </div>
			             </div>
			             <div id="editId" style="display: none;"></div>
	                </form>
	          </div>
	          <div class="modal-footer">
	          <button type="button" class="btn button button-rounded" data-dismiss="modal">关闭</button>
	          <button type="button" class="btn btn-primary button button-rounded" onclick="sendEditTime(this)">确定</button>
	          </div>
          </div>
          </div>
     </div>
  </body>
<%@ include file="../script.jsp"%>
<%@ include file="../table_script.jsp"%>
<script src="<%=basePath%>vendor/datetimepicker/datetimepicker.min.js"></script>
<script src="<%=basePath%>vendor/moment/moment.min.js"></script>
<script src="<%=basePath%>js/feed/feed_common.js"></script>
<script src="<%=basePath%>js/feed/feed_top_large.js"></script>
</html>
