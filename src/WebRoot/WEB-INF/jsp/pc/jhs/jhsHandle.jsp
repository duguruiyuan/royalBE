<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增/编辑江湖事</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../../include/staticInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>江湖事管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">新增/修改江湖事</small></h3>
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
                                <input id="radType1" name="radType" type="radio" value="0" checked="checked" data-toggle="#typLength" />文章（长文）
                            </label>
                            <label for="radType2" class="radio i-checks radio-inline">
                                <input id="radType2" name="radType" type="radio" value="1" data-toggle="#typShort" />图文（短文）
                            </label>
                        </div>
                    </div>
                    <%--长文表单的内容 start--%>
                    <div id="typLength">
                        <div class="form-group">
	                        <label class="col-sm-2 control-label">封面：</label>
	                        <div class="col-sm-9">
	                            <input id="coverSelector" type="file" multiple name="file" />
	                        </div>
	                    </div>
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
                    <%--相关链接
                    <div class="form-group">
                        <label class="col-sm-2 control-label">相关链接：</label>
                        <div class="col-xs-10 col-md-9">
                            <button id="btnArticle" type="button" class="btn btn-primary">选择相关链接</button>
                            &nbsp;&nbsp;<span class="label-warning" id="articleTitle"></span>
                        </div>
                    </div>--%>
                    <%--相关链接--%>
                    <div class="row">
                        <label class="col-sm-2 control-label">相关链接：</label>
                        <div class="col-xs-10 col-md-9" id="articleContainer">
                            
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
                        <button id="btnPass" type="button" data-action="audit,release" disabled="disabled" class="btn btn-lg btn-primary dim m-l"><i class="glyphicon glyphicon-floppy-saved"></i>&nbsp;&nbsp;保存并审核通过</button>
                        <button id="btnAudit" type="button" data-action="audit,add,edit" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;提交审核</button>
                        <button id="btnSave" type="button" data-action="audit,add,edit" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="glyphicon glyphicon-floppy-save"></i>&nbsp;&nbsp;保存草稿</button>
                        <button id="btnCancel" type="button" data-action="audit,release,add,edit" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <%--富文本编辑器组件summernote--%>
    <link href="<%=basePath%>static/lib/summernote/summernote.css" rel="stylesheet" />
    <%--<link href="<%=basePath%>static/lib/summernote/summernote-bs3.css" rel="stylesheet" />--%>
    <script src="<%=basePath%>static/lib/summernote/summernote.min.js"></script>
    <script src="<%=basePath%>static/lib/summernote/summernote-zh-CN.js"></script>
    <%--表单选择框组件--%>
    <link href="<%=basePath%>static/lib/iCheck/custom.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/iCheck/icheck.min.js"></script>
    <link href="<%=basePath%>static/lib/bootstrap-fileinput/css/fileinput.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-fileinput/js/fileinput.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-fileinput/js/locales/zh.js"></script>
    <%--通知组件--%>
    <link href="<%=basePath%>static/lib/toastr/css/toastr.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/toastr/js/toastr.min.js"></script>
    <%--表单验证组件--%>
    <script src="<%=basePath%>static/lib/bootstrapValidator/bootstrapValidator.min.js"></script>
    <!--日期控件-->
    <link href="<%=basePath%>static/lib/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/datetimepicker/datetimepicker.min.js"></script>
    <%--layer弹窗控件--%>
    <link href="<%=basePath%>static/lib/layer/layer.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/layer/layer.js"></script>
    <%--树组件--%>
    <link href="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.js"></script>
    <%--表单控件--%>
    <link href="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
    <%--文章选择组件--%>
    <script src="<%=basePath%>static/common/module/module.articleSelector.js"></script>
    
    <%--对第三方组件的自定义插件扩展--%>
    <%--上传对接七牛--%>
    <script src="<%=basePath%>static/common/helper.qiniu.js"></script>
    <%--富文本编辑器对接七牛--%>
    <script src="<%=basePath%>static/lib/summernote/summernote-qiniu.js"></script>
    <script src="<%=basePath%>static/lib/toastr/customOptions.js"></script>
    <%--扩展表单选择框组件的自动替换及切换功能面板插件--%>
    <script src="<%=basePath%>static/lib/iCheck/icheck-toggle.js?v=<%=StaticVersion%>"></script>

    <%--自定义组件--%>
    <%--推送组件--%>
    <script src="<%=basePath%>static/common/module/module.push.js?v=<%=StaticVersion%>"></script>
    <script src="<%=basePath%>static/common/module/module.multSelector.js?v=<%=StaticVersion%>"></script>
    <%--文件上传组件--%>
    <script src="<%=basePath%>static/common/module/module.fileUpload.js?v=<%=StaticVersion%>"></script>

    <%--页面css及js文件--%>
    <script src="<%=basePath%>js/public.js?v=<%=StaticVersion%>"></script>
    <script src="<%=basePath%>js/jhs/jhsHandle.js?v=<%=StaticVersion%>"></script>
</body>
</html>
