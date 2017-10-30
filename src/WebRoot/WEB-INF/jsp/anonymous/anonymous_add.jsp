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
             <h3>匿名名称管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">新增匿名名称</small></h3>
        </div>
        <div class="ibox-content">
	        <form id="frmAddCiphertext" class="form-horizontal" action="javascript:;">
                <div class="row text-center m-b">
                    <h2>基本信息</h2>
                </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">主题名称：</label>
                    <div class="col-sm-5">
                        <input class="form-control" id="name1" type="text" name="name1">
                    </div>
                 </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">导出模板：</label>
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
				      <button id="add_dict" type="button" disabled="disabled" onclick="page.eventHandler.doSubmit()" class="btn btn-lg btn-info dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;保存匿名主题</button>
				      <button id="btnCancel" type="button" disabled="disabled" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
			      </div>
	        </form>
        </div>
      </div>
    </div>
      <div style="display: none;">
      <form enctype="multipart/form-data" method="post" action="<%=basePath%>admin/anonymous/insert_anonymous.shtml" id="uploadform" name="uploadform">
        <input id="name" type="text" name="name" />
     	<input type="file" id="upload_btn" name="file" accept=".xls" onchange="selectfile()"/>
      </form>
      </div>
    <script src="<%=basePath%>static/page/anonymous/anonymous_add.js?v=<%=StaticVersion%>"></script>
  </body>
</html>