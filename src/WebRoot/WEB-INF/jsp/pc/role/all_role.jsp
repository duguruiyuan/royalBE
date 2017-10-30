<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>主页-商帮帮后台</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight dashboard-header">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>角色管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">角色列表</small></h3>
            </div>
            <div class="ibox-content ">
                <div id="tableTools">
					<form class="form-inline bars"  onsubmit="return false">
						<button id="btnAdd" type="button" onclick="showAdd()" class="btn btn-outline btn-default"><i class="glyphicon glyphicon-plus"></i></button>
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
            <h4 class="modal-title text-center weight">角色信息</h4>
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
<%-- <script src="<%=basePath%>static/common/helper.js"></script>
<%@ include file="../../script.jsp"%>
<%@ include file="../../table_script.jsp"%>
    <script src="<%=basePath%>js/public.js"></script>
   <script src="<%=basePath%>js/global.js"></script>
    <script src="<%=basePath%>js/contabs.js" type="text/javascript"></script>
    <script src="<%=basePath%>js/main.js"></script>

    页面js文件
    <script type="text/javascript">
        //var rootPath = basePath;
        var rootPath = "<%=basePath%>";
    </script> --%>
<script src="<%=basePath%>js/role/role_list.js?v=<%=StaticVersion%>"></script>
</html>
