<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增设备推送</title>
    <%@ include file="../include/amdInclude.jsp"%>

    <%--页面css及js文件--%>
    <script src="<%=basePath%>js/public.js?v=<%=StaticVersion%>"></script>
    <script src="<%=basePath%>static/page/pushdevice/pushdevice_common.js?v=<%=StaticVersion%>"></script>
    <script src="<%=basePath%>static/page/pushdevice/pushdeviceHandle.js?v=<%=StaticVersion%>"></script>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>设备推送管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">新增设备推送</small></h3>
            </div>
            <div class="ibox-content">
                <form id="frmAddCiphertext" class="form-horizontal">
                	
                    <div class="row text-center m-b">
                        <h2>信息源</h2>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">点击行为：</label>
                        <div class="col-sm-9" id="typeSelect">
                            <label for="radType1" class="radio i-checks radio-inline">
                                <input id="radType1" class="typeSelections" name="radType" type="radio" value="1" checked="checked" data-reverse data-toggle="#typeToggle" />查看信息源
                            </label>
                            <label for="radType2" class="radio i-checks radio-inline">
                                <input id="radType2" class="typeSelections" name="radType" type="radio" value="2"/>查看我的消息
                            </label>
                            <label for="radType3" class="radio i-checks radio-inline">
                                <input id="radType3" class="typeSelections" name="radType" type="radio" value="3"/>打开首页
                            </label>
                            <label for="radType4" class="radio i-checks radio-inline">
                                <input id="radType4" class="typeSelections" name="radType" type="radio" value="4"/>打开发现
                            </label>
                            <label for="radType5" class="radio i-checks radio-inline">
                                <input id="radType5" class="typeSelections" name="radType" type="radio" value="5"/>打开商会
                            </label>
                        </div>
                    </div>
                    <div id="typeToggle">
	                    <div class="form-group" id="articleSelectContainer">
	                        <label class="col-sm-2 control-label">信息源：</label>
	                        <div class="col-sm-9" id="articleSelectContent">
	                            
	                        </div>
	                    </div>
	                    <div class="form-group" id="articleSelectPropmt" style="display:none">
	                        <label class="col-sm-2 control-label"></label>
	                        <div class="col-sm-9" style="color:#ed5565">
	                            
	                        </div>
	                    </div>
	                    <div class="form-group">
	                        <label class="col-sm-2 control-label">类型：</label>
	                        <div class="col-sm-9">
	                            <span id="articleType" style="display:inline-block;height:34px;line-height:34px"></span>
	                        </div>
	                    </div>
                      </div>
                    <div class="hr-line-dashed"></div>
                    <div class="row text-center m-b">
                        <h2>设备推送</h2>
                    </div>
                    <div id="objMobilePush" class="form-horizontal"></div>
                    <div class="hr-line-dashed"></div>
                    <%--操作区--%>
                    <div id="divAction" class="row m-t-lg text-center">
                        <button id="btnAudit" type="button" disabled="disabled" data-action="" class="btn btn-lg btn-warning dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;提交审核</button>
                        <button id="btnCancel" type="button" disabled="disabled" data-action="" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
                    </div>
                </form>
            </div>

        </div>
    </div>

</body>
</html>
