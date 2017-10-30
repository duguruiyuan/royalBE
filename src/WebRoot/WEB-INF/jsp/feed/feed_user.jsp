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
    <title>主页-商帮帮后台</title>
    <%@ include file="../head-meta.jsp"%>
    <%@ include file="../head-link.jsp"%>
    <link href="<%=basePath%>css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <link href="<%=basePath%>vendor/layer/layer.css" rel="stylesheet">
</head>
  <body class="gray-bg">
    <div class="animated fadeInRight">
        <div class="row">
            <div class="col-sm-12">
                <div class="ibox">
                    <div class="ibox-content">                                        		
                   	    <div id="table-toolbar" class="form-inline">
							<form id="searchForm" class="right inline" >
								<select id="pushType" class="form-control">
	                                <option value="">全部</option>
	                                <option value="1">已推送</option>
	                                <option value="0">未推送</option>
	                            </select>
					        	<input type="text" name="title" id="title" class="form-control" placeholder="姓名">		

	        	
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
  </body>
<%@ include file="../script.jsp"%>
<script>
 	var pid = <%=pid%>;
</script>
<%@ include file="../table_script.jsp"%>
<script src="<%=basePath%>js/feed/feed_common.js"></script>
<script src="<%=basePath%>js/feed/feed_user.js"></script>
</html>
