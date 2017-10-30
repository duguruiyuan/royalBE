<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>查看商机</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight article">
        <div class="ibox float-e-margins">
            <div class="ibox-content col-md-offset-1 col-md-10">
                <div id="divLabelPanel" class="pull-left">
                    <span id="lblState" data-tip="招商项目发布到信息流中的状态" class="label label-inverse">发布状态加载中...</span>
                    <span id="lblStatus" data-tip="已删除的招商项目将进入垃圾箱" class="label label-inverse">垃圾箱状态加载中...</span>
                    <span id="lblAnonymity" data-tip="招商行业行业名称" class="label label-inverse">行业名称加载中...</span>
                </div>
                <div id="divEditPanel" class="pull-right m-l-lg"></div>
                <div id="divCreatePanel" class="pull-right m-l-lg" ></div>
                <div class="text-center article-title"><h1 id="title"></h1></div>
                <div class="article-title">
                    <div class="text-center article-title"><h1 id="txtTitle"></h1></div>
                    <div class="row">
                        <label class="col-sm-2 control-label text-right">招商单位：</label>
	                    <div class="col-xs-10 col-md-9 text-left" id="unit_name">
	                        
	                    </div>
                    </div>
                    <hr />
                    <div class="row">
                        <label class="col-sm-2 control-label text-right">招商地区：</label>
	                    <div class="col-xs-10 col-md-9 text-left" id="area">
	                        
	                    </div>
                    </div>
                    <hr />
                    <div class="row">
                        <label class="col-sm-2 control-label text-right">招商方式：</label>
	                    <div class="col-xs-10 col-md-9 text-left" id="type">
	                        
	                    </div>
                    </div>
                    <hr />
                    <div class="row">
                        <label class="col-sm-2 control-label text-right">招商金额：</label>
	                    <div class="col-xs-10 col-md-9 text-left" id="money">
	                        
	                    </div>
                    </div>
                    <hr />
                    <div class="row">
                        <label class="col-sm-2 control-label text-right">联系人：</label>
	                    <div class="col-xs-10 col-md-9 text-left" id="contact">
	                        
	                    </div>
                    </div>
                    <hr />
                    <div class="row">
                        <label class="col-sm-2 control-label text-right">联系电话：</label>
	                    <div class="col-xs-10 col-md-9 text-left" id="phone">
	                        
	                    </div>
                    </div>
                    <hr />
                    <div class="row">
                        <label class="col-sm-2 control-label text-right">联系地址：</label>
	                    <div class="col-xs-10 col-md-9 text-left" id="address">
	                        
	                    </div>
                    </div>
                    <hr />
                    <div class="row">
                        <label class="col-sm-2 control-label text-right">上传附件：</label>
	                    <div class="col-xs-10 col-md-9 text-left" id="files">
	                        
	                    </div>
                    </div>
                    </div>
                <br />
                <div class="hr-line-dashed"></div>
                <div class="row text-center m-b">
                    <h2>信息流推送</h2>
                </div>
                <div id="objFeedPush" class="form-horizontal"></div>
                <div class="hr-line-dashed"></div>
                <div class="row text-center m-b">
                    <h2>手机设备推送</h2>
                </div>
                <div id="objMobilePush" class="form-horizontal"></div>
                <hr />
                <%--操作区--%>
                <div id="divAction" class="row m-t-lg text-center">
                    <button id="btnAuditPass" type="button" data-action="audit" disabled="disabled" class="btn btn-lg btn-primary dim m-l"><i class="fa fa-check-circle"></i>&nbsp;&nbsp;审核通过</button>
                    <button id="btnAuditNoPass" type="button" data-action="audit" disabled="disabled" class="btn btn-lg btn-danger dim m-l"><i class="fa fa-ban"></i>&nbsp;&nbsp;审核不通过</button>
                    <button id="btnBackout" type="button" data-action="release" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="fa fa-arrow-circle-right"></i>&nbsp;&nbsp;撤&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</button>
                    <button id="btnEdit" type="button" data-action="audit,show,release" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="glyphicon glyphicon-edit"></i>&nbsp;&nbsp;编&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;辑</button>
                    <button id="btnDelete" type="button" data-action="audit,show,release" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;删&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;除</button>
                    <button id="btnReply" type="button" data-action="trash" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="fa fa-reply"></i>&nbsp;&nbsp;恢&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;复</button>
                    <button id="btnCancel" type="button" data-action="audit,show,release,trash" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
                </div>
            </div>
        </div>
    </div>


    <%--页面css及js文件--%>
    <script src="<%=basePath%>static/page/shangji/shangjiInfo.js?v=<%=StaticVersion%>"></script>
</body>
</html>