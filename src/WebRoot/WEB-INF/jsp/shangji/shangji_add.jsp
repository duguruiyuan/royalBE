<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增/编辑商机</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>商机管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">新增/修改商机</small></h3>
            </div>
            <div class="ibox-content">
                <form id="frmAddCiphertext" class="form-horizontal">
                    <div class="row text-center m-b">
                        <h2>基本信息</h2>
                    </div>
                    <%--表单的内容 start--%>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">标题：</label>
                            <div class="col-sm-9">
                                <input id="title" name="title" type="text" class="form-control" placeholder="请输入标题" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">招商单位：</label>
                            <div class="col-sm-9">
                               <%--  <input id="unitid" name="unitid" type="text" class="form-control" placeholder="请输入招商单位" />--%>
	                            <select id="unitid" name="unitid" class="form-control">
	                                <option value="0">加载中,请稍候...</option>
	                            </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">招商地区：</label>
                            <div class="col-sm-9" id="placeSelect">
                                <!-- <input id="area" name="area" type="text" class="form-control" placeholder="请输入招商地区" /> -->
                            </div>
                        </div>
	                    <div class="form-group">
	                        <label class="col-sm-2 control-label">招商行业：</label>
	                        <div class="col-sm-9">
	                            <select id="industry" name="industry" class="form-control">
	                                <option value="0">加载中,请稍候...</option>
	                            </select>
	                        </div>
	                    </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">招商方式：</label>
                            <div class="col-sm-9">
                                <input id="type" name="type" type="text" class="form-control" placeholder="请输入招商方式" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">招商金额：</label>
                            <div class="col-sm-9">
                                <input id="money" name="money" type="text" class="form-control" placeholder="请输入招商金额" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">联系人：</label>
                            <div class="col-sm-9">
                                <input id="contact" name="contact" type="text" class="form-control" placeholder="请输入联系人" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">联系电话：</label>
                            <div class="col-sm-9">
                                <input id="phone" name="phone" type="text" class="form-control" placeholder="多个电话请用逗号隔开" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">联系地址：</label>
                            <div class="col-sm-9">
                                <input id="address" name="address" type="text" class="form-control" placeholder="请输入联系地址" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">上传文件：</label>
                            <%--文件选择器组件--%>
                            <div id="objImaSelecter" class="col-sm-9">
                                <input id="fileSelector" type="file" multiple name="file" />
                            </div>
                        </div>
                    <%--表单的内容 end--%>
                    <div class="hr-line-dashed"></div>
                    <div class="row text-center m-b">
                        <h2>信息流推送</h2>
                    </div>
                    <div id="objFeedPush" class="form-horizontal"></div>
                    <div class="hr-line-dashed"></div>
                    <div class="row text-center m-b">
                        <h2>手机设备推送</h2>
                    </div>
                    <div id="objMobilePush"></div>
                    <div class="hr-line-dashed"></div>
                    <%--操作区--%>
                    <div id="divAction" class="row m-t-lg text-center">
                        <button id="btnPass" type="button" data-action="audit" disabled="disabled" class="btn btn-lg btn-primary dim m-l"><i class="glyphicon glyphicon-floppy-saved"></i>&nbsp;&nbsp;保存并审核通过</button>
                        <button id="btnUpdatePass" type="button" data-action="release" disabled="disabled" class="btn btn-lg btn-primary dim m-l"><i class="glyphicon glyphicon-floppy-saved"></i>&nbsp;&nbsp;保存并审核通过</button>
                        <button id="btnAudit" type="button" data-action="audit,add,edit" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;提交审核</button>
                        <button id="btnSave" type="button" data-action="audit,add,edit" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="glyphicon glyphicon-floppy-save"></i>&nbsp;&nbsp;保存草稿</button>
                        <button id="btnCancel" type="button" data-action="audit,release,add,edit" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
                    </div>
                </form>
            </div>

        </div>
    </div>


    <%--页面css及js文件--%>
    <script src="<%=basePath%>static/page/shangji/shangjiHandle.js?v=<%=StaticVersion%>"></script>
</body>
</html>
