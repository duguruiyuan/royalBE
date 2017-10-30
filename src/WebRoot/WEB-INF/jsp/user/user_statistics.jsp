<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>用户统计</title>
    <%@ include file="../include/staticInclude.jsp"%>
  </head>
  <body class="gray-bg">
      <div class="wrapper wrapper-content animated fadeInRight article">
	        <div class="ibox float-e-margins">
	            <div class="ibox-title">
	                <h3>统计管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">新增用户统计</small></h3>
	            </div>
	            <div class="font-18" style="margin-top: 40px">
	                <div class="row text-center m-b">
		                <div class="col-md-2">昨日新增用户</div>
		                <div class="col-md-8" id="yesterdate-count"></div>
		                <div class="col-md-2">
		                    <a class="btn btn-primary" id="yesterdate-btn">查看详情</a>
		                </div>
		            </div>
		            <div class="row text-center m-b">
		                <div class="col-md-2">本月新增用户</div>
		                <div class="col-md-8" id="mounth-count"></div>
		                <div class="col-md-2">
		                    <a class="btn btn-primary" id="mounth-btn">查看详情</a>
		                </div>
		            </div>
	            </div>
	            <div class="row">
		            <div class="col-sm-12">
		                <div class="ibox float-e-margins">
		                    <div class="ibox-title" style="height: auto; overflow: hidden">
		                        <h3>新增用户线性图</h3>
		                        <div style="float: right">
		                            <form class="form-inline bars">
			                            <div class="input-group date m-b-xs">
				                            <input id="startTime" class="form-control form_date" size="10" type="text" data-end="#endTime" value="" placeholder="注册日期-起" readonly />
				                            <label for="startTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
				                        </div>
				                        <div class="input-group date m-b-xs">
				                            <input id="endTime" class="form-control form_date" size="10" type="text" data-start="#startTime" value="" placeholder="注册日期-止" readonly />
				                            <label for="endTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
				                        </div>
				                        <button id="btnSearch" type="button" class="btn btn-primary">搜索</button>
                                        <button type="reset" class="btn btn-default">重置</button>
			                        </form>
		                        </div>
		                    </div>
		                    <div class="ibox-content">
		                        <div id="morris-one-line-chart"></div>
		                    </div>
		                </div>
		            </div>
		        </div>
	        </div>
	    </div>
  </body>
  <!--日期控件-->
  <link href="<%=basePath%>static/lib/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet">
  <script src="<%=basePath%>static/lib/datetimepicker/datetimepicker.min.js"></script>
  <script src="<%=basePath%>vendor/moment/moment.min.js"></script>
  <%--layer弹窗控件--%>
  <link href="<%=basePath%>static/lib/layer/layer.css" rel="stylesheet">
  <script src="<%=basePath%>static/lib/layer/layer.js"></script>
  <!--线性图控件-->
  <link href="<%=basePath%>static/lib/morris/morris.min.css" rel="stylesheet">
  <script src="<%=basePath%>static/lib/morris/morris.js"></script>
  <script src="<%=basePath%>static/lib/morris/raphael.min.js"></script>
  
  <script src="<%=basePath%>static/page/user/user_statistics.js"></script>
</html>
