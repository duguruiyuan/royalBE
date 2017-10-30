<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增匿名名称</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
  <body>
    <div class="wrapper wrapper-content animated">
    <div class="ibox float-e-margins">
        <div class="ibox-title">
             <h3>匿名名称管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">编辑匿名主题</small></h3>
        </div>
        <div class="ibox-content">
	        <form id="frmAddCiphertext" class="form-horizontal" action="javascript:;">
                <div class="row text-center m-b">
                    <h2>基本信息</h2>
                </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">主题名称</label>
                    <div class="col-sm-5">
                        <input class="form-control" id="name1" type="text" name="name1">
                    </div>
                 </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">导出模板</label>
                    <div class="col-sm-5">
          				<a href="http://file.static.shangbangbang.com/model.xls">导出xls</a>
                    </div>
                 </div>
                 <div class="form-group">
                     <label class="col-sm-4 control-label">导入词典：</label>
                     <%--图片选择器组件--%>
                     <div id="objImaSelecter" class="col-sm-5">
                          <input id="fileSelector" type="file" multiple name="file" />
                     </div>
                  </div>
			      <div id="divAction" class="row m-t-lg text-center">
				      <button id="add_dict" type="button" onclick="page.eventHandler.doSubmit()" class="btn btn-lg btn-info dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;保存匿名主题</button>
				      <button id="btnCancel" type="button" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
			      </div>
	        </form>
        </div>
      </div>
    </div>
      <div style="display: none;">
      <form enctype="multipart/form-data" method="post" action="<%=basePath%>admin/anonymous/update_anonymous.shtml" id="uploadform" name="uploadform">
        <input id="name" type="text" name="name" />
        <input id="id" type="text" name="id" />
     	<input type="file" id="upload_btn" name="file" accept=".xls" onchange="selectfile()"/>
      </form>
      </div>
      
<%--     表单选择框组件
    <link href="<%=basePath%>static/lib/iCheck/custom.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/iCheck/icheck.min.js"></script>
    上传组件
    <link href="<%=basePath%>static/lib/bootstrap-fileinput/css/fileinput.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-fileinput/js/fileinput.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-fileinput/js/locales/zh.js"></script>
    通知组件
    <link href="<%=basePath%>static/lib/toastr/css/toastr.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/toastr/js/toastr.min.js"></script>
    表单验证组件
    <script src="<%=basePath%>static/lib/bootstrapValidator/bootstrapValidator.min.js"></script>
    layer弹窗控件
    <link href="<%=basePath%>static/lib/layer/layer.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/layer/layer.js"></script>

    对第三方组件的自定义插件扩展
    上传对接七牛
    <script src="<%=basePath%>static/common/helper.qiniu.js?v=<%=StaticVersion%>"></script>
    扩展表单选择框组件的自动替换及切换功能面板插件
    <script src="<%=basePath%>static/lib/iCheck/icheck-toggle.js?v=<%=StaticVersion%>"></script>

    文件上传组件
    <script src="<%=basePath%>static/common/module/module.fileUpload.js?v=<%=StaticVersion%>"></script> --%>
   
    <script src="<%=basePath%>static/page/anonymous/anonymous_edit.js?v=<%=StaticVersion%>"></script>
  </body>
</html>