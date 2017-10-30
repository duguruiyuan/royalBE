<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>焦点位管理</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../../include/staticInclude.jsp"%>
    <style type="text/css">
      .focal-warrper{width:100%;height:auto;overflow:hidden;border-bottom:solid 1px #ccc;position:relative;padding:15px}
      .focal-warrper .focal-title{width:100px;float:left}
      .focal-warrper .focal-content{width:500px;float:left}
      .focal-warrper .focal-delete{position: absolute;left:700px;bottom:50px}
      .row.mb15{margin-bottom:15px}
      .col-md-2.w50{width:60px;height:34px;line-height:34px;padding-right:0}
      .row .col-md-10{padding-left:0}
      .image_url{display:inline-block}
    </style>
  </head>
  
  <body>
    <div class="h-auto">
      <!-- 1 -->
      <div class="focal-warrper" data-position="1">
        <div class="focal-title">焦点位1</div>
        <div class="focal-content">
          <div class="row mb15">
            <div class="col-md-2 w50">图片：</div>
            <div class="col-md-10" id="content_one">
              <input id="fileSelector1" type="file" multiple name="file" />
            </div>
          </div>
          <div class="row mb15">
            <div class="col-md-2 w50">标题：</div>
            <div class="col-md-10">
              <input id="focusTitleOne" type="text" class="form-control title url-text-input" />
            </div>
          </div>
          <div class="row mb15">
            <div class="col-md-2 w50">链接：</div>
            <div class="col-md-10 input-group" id="focusLinkOne">
                
              <!--<input id="focusLinkOne" type="text" readonly placeholder="点击添加" class="form-control select-url-obtain" data-value="1">   -->              
            </div>
          </div>
        </div>
        <div class="focal-delete">
          <button class="btn btn-sm btn-info demo4" data-readonly='true'  type="submit">确定</button>
          <button class="btn btn-sm btn-danger demo3">删除</button>
        </div>
      </div>
      <!-- 2 -->
      <div class="focal-warrper" data-position="2">
        <div class="focal-title">焦点位2</div>
        <div class="focal-content">
          <div class="row mb15">
            <div class="col-md-2 w50">图片：</div>
            <div class="col-md-10" id="content_two">
              <input id="fileSelector2" type="file" multiple name="file" />
            </div>
          </div>
          <div class="row mb15">
            <div class="col-md-2 w50">标题：</div>
            <div class="col-md-10">
              <input id="focusTitleTwo" type="text" class="form-control title url-text-input" />
            </div>
          </div>
          <div class="row mb15">
            <div class="col-md-2 w50">链接：</div>
            <div class="col-md-10 input-group" id="focusLinkTwo">
              <!-- <input id="focusLinkTwo" type="text" readonly placeholder="点击添加" class="form-control select-url-obtain" data-value="2">  -->                
            </div>
          </div>
        </div>
        <div class="focal-delete">
          <button class="btn btn-sm btn-info demo4" type="submit">确定</button>
          <button class="btn btn-sm btn-warning move-pre">上移</button>
          <button class="btn btn-sm btn-danger demo3">删除</button>
        </div>
      </div>
      <!-- 3 -->
      <div class="focal-warrper" data-position="3">
        <div class="focal-title">焦点位3</div>
        <div class="focal-content">
          <div class="row mb15">
            <div class="col-md-2 w50">图片：</div>
            <div class="col-md-10" id="content_three">
              <input id="fileSelector3" type="file" multiple name="file" />
            </div>
          </div>
          <div class="row mb15">
            <div class="col-md-2 w50">标题：</div>
            <div class="col-md-10">
              <input id="focusTitleThree" type="text" class="form-control title url-text-input" />
            </div>
          </div>
          <div class="row mb15">
            <div class="col-md-2 w50">链接：</div>
            <div class="col-md-10 input-group" id="focusLinkThree">
              <!--  <input id="focusLinkThree" type="text" readonly placeholder="点击添加" class="form-control select-url-obtain" data-value="3">   -->              
            </div>
          </div>
        </div>
        <div class="focal-delete">
          <button class="btn btn-sm btn-info demo4" type="submit">确定</button>
          <button class="btn btn-sm btn-warning move-pre">上移</button>
          <button class="btn btn-sm btn-danger demo3">删除</button>
        </div>
      </div>
      <!-- 4 -->
      <div class="focal-warrper" data-position="4">
        <div class="focal-title">焦点位4</div>
        <div class="focal-content">
          <div class="row mb15">
            <div class="col-md-2 w50">图片：</div>
            <div class="col-md-10" id="content_four">
              <input id="fileSelector4" type="file" multiple name="file" />
            </div>
          </div>
          <div class="row mb15">
            <div class="col-md-2 w50">标题：</div>
            <div class="col-md-10">
              <input id="focusTitleFour" type="text" class="form-control title url-text-input" />
            </div>
          </div>
          <div class="row mb15">
            <div class="col-md-2 w50">链接：</div>
            <div class="col-md-10 input-group" id="focusLinkFour">
              <!--  <input id="focusLinkFour" type="text" readonly placeholder="点击添加" class="form-control select-url-obtain" data-value="4"> -->                 
            </div>
          </div>
        </div>
        <div class="focal-delete">
          <button class="btn btn-sm btn-info demo4" type="submit">确定</button>
          <button class="btn btn-sm btn-warning move-pre">上移</button>
          <button class="btn btn-sm btn-danger demo3">删除</button>
        </div>
      </div>
      <!-- 5 -->
      <div class="focal-warrper" data-position="5">
        <div class="focal-title">焦点位5</div>
        <div class="focal-content">
          <div class="row mb15">
            <div class="col-md-2 w50">图片：</div>
            <div class="col-md-10" id="content_five">
              <input id="fileSelector5" type="file" multiple name="file" />
            </div>
          </div>
          <div class="row mb15">
            <div class="col-md-2 w50">标题：</div>
            <div class="col-md-10">
              <input id="focusTitleFive" type="text" class="form-control title url-text-input" />
            </div>
          </div>
          <div class="row mb15">
            <div class="col-md-2 w50">链接：</div>
            <div class="col-md-10 input-group" id="focusLinkFive">
              <!--  <input type="text" readonly placeholder="点击添加" class="form-control select-url-obtain" data-value="5">-->                 
            </div>
          </div>
        </div>
        <div class="focal-delete">
          <button class="btn btn-sm btn-info demo4" type="submit">确定</button>
          <button class="btn btn-sm btn-warning move-pre">上移</button>
          <button class="btn btn-sm btn-danger demo3">删除</button>
        </div>
      </div>
      
    <!--<div class="modal inmodal" id="addRelatedLinkModal" tabindex="-1" role="dialog"  aria-hidden="true">
      <div class="modal-dialog modal-lg">
          <div class="modal-content">
	          <div class="modal-header center">
	          <h4 class="modal-title" style="text-align: center">相关链接</h4>
	          </div>
	          <div class="modal-body table-modal-body">
	               <form id="addRelatedLinkForm" class="form-horizontal">
	                  <div class="form-group">              
                        <div class="col-sm-8 col-sm-offset-2" id="selectArtContainer">
                            <label for="radType1" class="radio i-checks radio-inline" data-value="1">
                                <input id="radType1" name="radType" type="radio" value="1" checked="checked" />站内文章
                            </label>
                            <label for="radType2" class="radio i-checks radio-inline" data-value="0">
                                <input id="radType2" name="radType" type="radio" value="0" />站外文章
                            </label>
                        </div>
                    </div>
		             <div id="inArtContainer" style="display:none">
			           	<div class="form-group">
			                 <label class="col-sm-2 control-label">选择文章</label>
			                 <div class="col-sm-10">
			                     <input id="inLink" name="inLink" readonly type="text" class="form-control">
			                 </div>
			             </div>	
			         </div>
              
		             <div  id="outArtContainer" style="display:none">
		             	<div class="form-group">
			                 <label class="col-sm-2 control-label">链接</label>
			                 <div class="col-sm-10">
			                     <input id="outLink" name="outLink"  type="text" class="form-control">
			                 </div>
			             </div>
		             </div>
	             </form>
	          </div>
	          <div class="modal-footer">
	              <button type="button" class="btn button button-rounded" data-dismiss="modal">关闭</button>
	              <button type="button" id="releatedLinkConfirm" class="btn btn-primary button button-rounded" data-dismiss="modal">确定</button>
	          </div>
          </div>
      </div>
    </div>  -->
    <%--表单选择框组件--%>
    <link href="<%=basePath%>static/lib/iCheck/custom.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/iCheck/icheck.min.js"></script>
    <%--上传组件--%>
    <link href="<%=basePath%>static/lib/bootstrap-fileinput/css/fileinput.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-fileinput/js/fileinput.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-fileinput/js/locales/zh.js"></script>
    <%--表单验证组件--%>
    <script src="<%=basePath%>static/lib/bootstrapValidator/bootstrapValidator.min.js"></script>
    <%--弹窗 --%>
    <link href="<%=basePath%>static/lib/sweetalert/sweetalert.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/sweetalert/sweetalert.min.js"></script>
    <%--layer弹窗控件--%>
    <link href="<%=basePath%>static/lib/layer/layer.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/layer/layer.js"></script>
    <%--文章选择组件--%>
    <script src="<%=basePath%>static/common/module/module.articleSelector.js"></script>
    <!-- Bootstrap table -->
    <link href="<%=basePath%>css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table-mobile.min.js"></script>
    <script src="<%=basePath%>js/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
    <%--对第三方组件的自定义插件扩展--%>
    <%--上传对接七牛--%>
    <script src="<%=basePath%>static/common/helper.qiniu.js?v=<%=StaticVersion%>"></script>
    <%--文章选择组件--%>
    <script src="<%=basePath%>static/common/module/module.articleSelector.js?v=<%=StaticVersion%>"></script>

    <%--自定义组件--%>
    <%--文件上传组件--%>
    <script src="<%=basePath%>static/common/module/module.fileUpload.js?v=<%=StaticVersion%>"></script>
    <script src="<%=basePath%>js/public.js?v=<%=StaticVersion%>"></script>
    <%--<script src="<%=basePath%>js/ArticleSelector.js?v=<%=StaticVersion%>"></script>--%>
    <script src="<%=basePath%>js/focus/focusPosition.js?v=<%=StaticVersion%>"></script>
  </body>
</html>
