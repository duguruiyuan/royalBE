<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>查看开机滑屏</title>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight article">
        <div class="ibox float-e-margins">
            <div class="ibox-content">
                <h1 class="text-warning text-center" id="slider_name"></h1>
                <div class="ibox-content">
                    <div id="divEditPanel" class="pull-right m-l-lg"></div>
                    <div id="divCreatePanel" class="pull-right m-l-lg" ></div>
                </div>
                <div class="form-horizontal">
	                <div class="form-group">
	                    <label class="col-sm-2 control-label">投放时间：</label>
	                    <div class="col-sm-9" style="line-height:34px" id="slider_time"></div>
	                    <!--<div class="col-sm-3" style="line-height:34px" id="slider_end_time"></div>-->
	                </div>
	                <!--<div class="form-group">
	                    <label class="col-sm-2 control-label">投放结束时间：</label>
	                    <div class="col-sm-10" style="line-height:34px" id="slider_end_time"></div>
	                </div>  -->
	                
	                
                </div>
                <div class="row text-center m-b">
                    <h2>滑屏图片</h2>
                </div>
                <div id="huaPingImages" class="m-t-lg text-center"></div>
                <%--操作区--%>
                <div class="row m-t-lg text-center" id="divAction">
                    <div class="col-md-offset-2 col-md-2"><button class="btn btn-primary btn-block btn-lg" data-action="complete" onclick="page.assist.stop()"><i class="glyphicon glyphicon-floppy-save"></i>&nbsp;&nbsp;中止投放</button></div>
                    <div class="col-md-2"><button class="btn btn-warning btn-block btn-lg" data-action="complete" onclick="page.eventHandler.showEdit()"><i class="glyphicon glyphicon-edit"></i>&nbsp;&nbsp;编辑</button></div>
                    <div class="col-md-2"><button class="btn btn-warning btn-block btn-lg" data-action="complete" onclick="page.assist.delete()"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;删除</button></div>
                    <div class="col-md-offset-3 col-md-3"><button class="btn btn-primary btn-block btn-lg" data-action="trash" onclick="page.assist.reply()"><i class="fa fa-reply"></i>&nbsp;&nbsp;恢复</button></div>
                    <div class="col-md-3"><button class="btn btn-default btn-block btn-lg" data-action="trash" onclick="page.assist.cancelPush()"><i class="glyphicon glyphicon-remove"></i>&nbsp;&nbsp;关闭</button></div>
                    <div class="col-md-2"><button class="btn btn-default btn-block btn-lg" data-action="complete" onclick="page.assist.cancelPush()"><i class="glyphicon glyphicon-remove"></i>&nbsp;&nbsp;关闭</button></div>
                </div>
            </div>
        </div>
    </div>

    <%--页面css及js文件--%>
    <script src="<%=basePath%>static/page/huaping/huapingInfo.js?v=<%=StaticVersion%>"></script>
</body>
</html>