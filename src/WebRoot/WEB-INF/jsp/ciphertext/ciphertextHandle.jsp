<%--
  User: xiegy
  Date: 2017/4/24
  Time: 11:14
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增/编辑秘闻</title>
    <%@ include file="../include/amdInclude.jsp"%>
    <script src="<%=basePath%>static/page/ciphertext/ciphertextHandle.js?v=<%=StaticVersion%>"></script>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>秘闻管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">新增/修改秘闻</small></h3>
            </div>
            <div class="ibox-content">
                <form id="frmAddCiphertext" class="form-horizontal">
                    <div class="row text-center m-b">
                        <h2>基本信息</h2>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">类型：</label>
                        <div class="col-sm-9">
                            <label for="radType1" class="radio i-checks radio-inline">
                                <input id="radType1" name="radType" type="radio" value="1" checked="checked" data-toggle="#typLength" />文章（长文）
                            </label>
                            <label for="radType2" class="radio i-checks radio-inline">
                                <input id="radType2" name="radType" type="radio" value="0" data-toggle="#typShort" />图文（短文）
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">是否证实：</label>
                        <div class="col-sm-9">
                            <label for="radIsAffirm1" class="radio i-checks radio-inline">
                                <input id="radIsAffirm1" name="radIsAffirm" type="radio" value="1" />是
                            </label>
                            <label for="radIsAffirm2" class="radio i-checks radio-inline">
                                <input id="radIsAffirm2" name="radIsAffirm" type="radio" value="0" checked="checked" />否
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">匿名主题：</label>
                        <div class="col-sm-9">
                            <select id="selTheme" name="selTheme" class="form-control">
                                <option value="0">加载中,请稍候...</option>
                            </select>
                        </div>
                    </div>
                    <%--长文表单的内容 start--%>
                    <div id="typLength">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">标题：</label>
                            <div class="col-sm-9">
                                <input id="txtTitle" name="txtTitle" type="text" class="form-control" placeholder="请输入标题，50字以内" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">摘要：</label>
                            <div class="col-sm-9">
                                <textarea id="txtSummary" name="txtSummary" class="form-control" rows="3" placeholder="请输入摘要，500字以内"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">正文：</label>
                            <%--富文本编辑器--%>
                            <div class="col-sm-9"><div id="objEditer"></div></div>
                        </div>
                    </div>
                    <%--长文表单的内容 end--%>
                    <%--短文表单的内容 start--%>
                    <div id="typShort">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">正文：</label>
                            <div class="col-sm-9">
                                <textarea id="txtShortTitle" name="txtShortTitle" class="form-control" placeholder="请输入正文，500字以内" rows="5"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">图片：</label>
                            <%--图片选择器组件--%>
                            <div id="objImaSelecter" class="col-sm-9">
                                <%--<div class="dropzone" style="border-style: dashed">--%>
                                    <%--<div class="dz-preview"></div>--%>
                                <%--</div>--%>
                                <input id="fileSelector" type="file" multiple name="file" />
                            </div>
                        </div>
                    </div>
                    <%--短文表单的内容 end--%>
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
</body>
</html>
