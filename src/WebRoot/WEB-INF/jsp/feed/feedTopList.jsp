<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>信息流列表</title>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight dashboard-header">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>信息流管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">大置顶列表</small></h3>
            </div>
            <div class="ibox-content ">
                <div id="tableTools">
                    <%--搜索条件bar  start--%>
                    <form class="form-inline bars">
                        <div class="input-group date m-b-xs">
                            <input id="startTime" class="form-control form_date" size="10" type="text" data-end="#endTime" value="" placeholder="推送日期-起" readonly />
                            <label for="startTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group date m-b-xs">
                            <input id="endTime" class="form-control form_date" size="10" type="text" data-start="#startTime" value="" placeholder="推送日期-止" readonly />
                            <label for="endTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group m-b-xs">
                            <input id="keyword" type="text" class="form-control" placeholder="请输入搜索的标题" />
                        </div>
                        <button id="btnSearch" type="button" class="btn btn-primary">搜索</button>
                        <button type="reset" class="btn btn-default">重置</button>
                    </form>
                    <%--搜索条件bar  end--%>
                </div>
                <div class="m-l-sm m-r-sm">
                    <%--表格容器--%>
                    <table id="tableList"></table>
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
						            <input id="editStartTime" class="form-control form_date_all" size="10" type="text" value="" placeholder="开始日期" readonly>     
						            <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
					        	</div> 
			                 </div>
			             </div>
			           	<div class="form-group">
			                 <label class="col-sm-2 control-label">结束时间</label>
			                 <div class="col-sm-10">
			                     <div class="input-group date form_date1 " data-date="" data-date-format="yyyy-mm-dd hh:ii" data-link-format="yyyy-mm-dd hh:ii">
						            <input id="editEndTime" class="form-control form_date_all" size="10" type="text" value="" placeholder="结束日期" readonly>       
						            <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
					        	</div>
			                 </div>
			             </div>
	                </form>
	          </div>
	          <div class="modal-footer">
	              <button type="button" class="btn btn-primary button button-rounded" onclick="page.eventHandler.sendEditTime()">确定</button>
	              <button type="button" class="btn button button-rounded" data-dismiss="modal">关闭</button>
	          </div>
          </div>
          </div>
     </div>
    
    <%--页面css及js文件--%>
    <script src="<%=basePath%>static/page/feed/feedTopList.js?v=<%=StaticVersion%>"></script>
</body>
</html>
