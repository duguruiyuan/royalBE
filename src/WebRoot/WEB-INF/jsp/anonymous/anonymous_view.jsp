<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>主页-商帮帮后台</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight dashboard-header">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>匿名名称管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">匿名名称列表</small></h3>
            </div>
            <div class="ibox-content ">
                <div id="tableTools">
					<form class="form-inline bars"  onsubmit="return false">
						<button id="btnAdd" type="button" onclick="page.eventHandler.showAdd()" class="btn btn-outline btn-default"><i class="glyphicon glyphicon-plus"></i></button>
				    </form>
                </div>
                <div class="m-l-sm m-r-sm">
                    <table id="tableList"></table>
                </div>
            </div>
        </div>
    </div>
	<div class="modal inmodal fade" id="user_info" tabindex="-1" role="dialog"  aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
              <span class="sr-only">Close</span>
            </button>
            <h4 class="modal-title text-center weight">词典信息</h4>
          </div>
          <div class="modal-body">
            <table class="table table-bordered" id="user_info_content"></table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">关闭</button>
            <button type="button" class="btn btn-primary" style="display:none">保存</button>
          </div>
        </div>
      </div>
    </div>
</body>
<%--     <!--日期控件-->
    <link href="<%=basePath%>static/lib/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/datetimepicker/datetimepicker.min.js"></script>
    <script src="<%=basePath%>vendor/moment/moment.min.js"></script>
    表单控件
    <link href="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
    弹窗控件
    <link href="<%=basePath%>static/lib/sweetalert/sweetalert.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/sweetalert/sweetalert.min.js"></script>
    <script src="<%=basePath%>vendor/layer/layer.js"></script>
    页面css及js文件
    <script src="<%=basePath%>js/public.js"></script>

    页面js文件
    <script type="text/javascript">
        //var rootPath = basePath;
        var rootPath = "<%=basePath%>";
    </script> --%>
<script src="<%=basePath%>static/page/anonymous/anonymous_index.js?v=<%=StaticVersion%>"></script>
</html>
