<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>待审核内容</title>
    <%--CSS库--%>
    <link href="<%=basePath%>css/bootstrap.min.css" rel="stylesheet">
    <%--JS库--%>
    <script src="<%=basePath%>vendor/jQuery/jquery.min.js"></script>
    <script src="<%=basePath%>vendor/bootstrap/js/bootstrap.js"></script>

    <%--公用CSS/js--%>
    <link href="<%=basePath%>css/style.css" rel="stylesheet">
    <script src="<%=basePath%>js/public.js"></script>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight dashboard-header">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>内容审核> 待审核</h3><span id="bigtoplist" style="display:none;">点击跳转<a class="J_menuItem_other" id="conflict" href_url="feedtopconflict.shtml" data-view="win"  data-index="conflict">置顶冲突</a></span>
            </div>
            <div class="ibox-content ">
                <div id="tableTools">
                    <form class="form-inline bars">
                        <div class="input-group date m-b-xs">
                            <input id="startTime" class="form-control form_date" size="10" type="text" value="" placeholder="开始日期" readonly />
                            <label for="start_time" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group date m-b-xs">
                            <input id="endTime" class="form-control form_date" size="10" type="text" value="" placeholder="结束日期" readonly />
                            <label for="end_time" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group m-b-xs">
                        类型
                        </div>
                        <div class="input-group m-b-xs">
				            <select class="form-control m-b" id="obj_type" name="obj_type">
				              <option value="">全部</option>
				              <option value="1">早报</option>
				              <option value="2">秘闻</option>
				              <option value="4">活动</option>
				              <option value="5">话题</option>
				              <option value="18">圈子帮助</option>
				              <option value="19">帖子</option>
				              <option value="8">榜样</option>
				              <option value="6">专题</option>
				              <option value="9">工商联新闻</option>
				              <option value="10">商机(招商项目)</option>
				              <option value="12">用户动态</option>
				              <option value="13">商会咨询</option>
				              <option value="14">商会通知</option>
				              <option value="7">江湖事</option>
				            </select>
                        </div>
                        <div class="input-group m-b-xs">
                            <input id="keyword" type="text" class="form-control" placeholder="请输入搜索关键字" />
                        </div>
                        <button id="btnSearch" type="button" class="btn btn-primary">搜索</button>
                        <button type="reset" class="btn btn-default">重置</button>
                    </form>
                </div>
                <div class="m-l-sm m-r-sm">
                    <table id="tableList"></table>
                </div>
            </div>
        </div>
    </div>


    <!--日期控件-->
    <link href="<%=basePath%>vendor/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet">
    <script src="<%=basePath%>vendor/datetimepicker/datetimepicker.min.js"></script>
    <%--表单控件--%>
    <link href="<%=basePath%>css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table-mobile.min.js"></script>
    <script src="<%=basePath%>js/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
    <%--弹窗控件--%>
    <link href="<%=basePath%>css/plugins/sweetalert/sweetalert.css" rel="stylesheet">
    <script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>

    <link href="<%=basePath%>vendor/layer/layer.css" rel="stylesheet">
    <script src="<%=basePath%>vendor/layer/layer.js"></script>
    <script src="<%=basePath%>js/common.js"></script>

    <script src="<%=basePath%>js/global.js"></script>
    <script src="<%=basePath%>js/contabs.js" type="text/javascript"></script>
    <script src="<%=basePath%>js/public.js"></script>
    
    <%--页面js文件--%>
    <script type="text/javascript">
        //var rootPath = basePath;
        var rootPath = "<%=basePath%>";
    </script>
    <script src="<%=basePath%>js/association/association_wait.js"></script>
</body>
</html>