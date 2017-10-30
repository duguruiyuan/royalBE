<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>评论管理</title>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight dashboard-header">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>评论管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">垃圾箱</small></h3>
            </div>
            <div class="ibox-content ">
                <div id="tableTools">
                    <%--搜索条件bar  start--%>
                    <form class="form-inline bars">
                        <div class="input-group date m-b-xs">
                            <input id="start_time" class="form-control form_date" size="10" type="text" value="" placeholder="评论日期-起" readonly />
                            <label for="startTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group date m-b-xs">
                            <input id="end_time" class="form-control form_date" size="10" type="text" value="" placeholder="评论日期-止" readonly />
                            <label for="endTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group m-b-xs" style="width:340px">
                            <input id="keyword" type="text" class="form-control" placeholder="请输入要搜索的内容（标题/评论内容/翻译内容）" />
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
    <div class="modal inmodal fade" id="see_translate" tabindex="-1" role="dialog"  aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title">编辑翻译</h4>
                </div>
                <div class="modal-body">
                    <textarea class="form-control" rows="5" cols="15" id="content-warpper"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-info" id="upload_translate">确定</button>
                    <button type="button" class="btn btn-white" data-dismiss="modal">取消</button>
                </div>
            </div>
        </div>
    </div>

    <%--页面css及js文件--%>
    <script src="<%=basePath%>static/page/comment/comment_dustbin.js?v=<%=StaticVersion%>"></script>
</body>
</html>
