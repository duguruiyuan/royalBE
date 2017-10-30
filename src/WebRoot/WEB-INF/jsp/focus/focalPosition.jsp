<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>焦点位管理</title>
    <%@ include file="../include/amdInclude.jsp"%>
    <style type="text/css">
      .focal-warrper{width:100%;height:auto;overflow:hidden;border-bottom:solid 1px #ccc;position:relative;padding:15px}
      .focal-warrper .focal-title{width:100px;float:left}
      .focal-warrper .focal-content{width:500px;float:left}
      .focal-warrper .focal-delete{position: absolute;left:700px;bottom:50px}
      .row.mb15{margin-bottom:15px}
      .col-md-2.w50{width:90px;height:34px;line-height:34px;padding-right:0}
      .row .col-md-10{padding-left:0}
      .image_url{display:inline-block}
      .type-link{height:34px;line-height:34px}
      .has-error .text-prompt{display:block}
      .text-prompt{display:none;color:#a94442}
    </style>
  </head>
  
  <body>
    <div class="h-auto">
      <!-- 1 -->
      <div class="focal-warrper">
        <div class="focal-title">焦点位1</div>
        <div class="focus-warrper-container" data-position="1">
	        <div class="focal-content">
	          <div class="row mb15">
	            <label class="col-md-2 w50">图片：</label>
	            <div class="col-md-9" style="line-height:34px" id="imageOne"></div>
	          </div>
	          <div class="row mb15">
	            <label class="col-md-2 w50">标题：</label>
	            <div class="col-md-9" style="line-height:34px" id="titleOne"></div>
	          </div>
	          <div class="row mb15">
	              <label class="col-md-2  w50 control-label">类型：</label>
	              <div class="col-md-9" style="line-height:34px" id="typeOne"></div>
	          </div>
	          <div class="row mb15">
	            <label class="col-md-2 w50">链接：</label>
	            <div class="col-md-9" style="line-height:34px" id="linkOne"></div>
	          </div>
	          
	        </div>
	        <div class="focal-delete">
	          <button class="btn btn-sm btn-info edit-focal" type="button">编辑</button>
	          <button class="btn btn-sm btn-danger demo3">删除</button>
	        </div>
	    </div>
      </div>
      <!-- 2 -->
      <div class="focal-warrper">
        <div class="focal-title">焦点位2</div>
        <div class="focus-warrper-container" data-position="2">
	        <div class="focal-content">
	          <div class="row mb15">
	            <label class="col-md-2 w50">图片：</label>
	            <div class="col-md-9" style="line-height:34px" id="imageTwo"></div>
	          </div>
	          <div class="row mb15">
	            <label class="col-md-2 w50">标题：</label>
	            <div class="col-md-9" style="line-height:34px" id="titleTwo"></div>
	          </div>
	          <div class="row mb15">
	              <label class="col-md-2  w50 control-label">类型：</label>
	              <div class="col-md-9" style="line-height:34px" id="typeTwo"></div>
	          </div>
	          <div class="row mb15">
	            <label class="col-md-2 w50">链接：</label>
	            <div class="col-md-9" style="line-height:34px" id="linkTwo"></div>
	          </div>
	        </div>
	        <div class="focal-delete">
	          <button class="btn btn-sm btn-info edit-focal" type="button">编辑</button>
	          <button class="btn btn-sm btn-warning move-pre">上移</button>
	          <button class="btn btn-sm btn-danger demo3">删除</button>
	        </div>
	    </div>
      </div>
      <!-- 3 -->
      <div class="focal-warrper">
        <div class="focal-title">焦点位3</div>
        <div class="focus-warrper-container" data-position="3">
	        <div class="focal-content">
	          <div class="row mb15">
	            <label class="col-md-2 w50">图片：</label>
	            <div class="col-md-9" style="line-height:34px" id="imageThree"></div>
	          </div>
	          <div class="row mb15">
	            <label class="col-md-2 w50">标题：</label>
	            <div class="col-md-9" style="line-height:34px" id="titleThree"></div>
	          </div>
	          <div class="row mb15">
	              <label class="col-md-2  w50 control-label">类型：</label>
	              <div class="col-md-9" style="line-height:34px" id="typeThree"></div>
	          </div>
	          <div class="row mb15">
	            <label class="col-md-2 w50">链接：</label>
	            <div class="col-md-9" style="line-height:34px" id="linkThree"></div>
	          </div>
	        </div>
	        <div class="focal-delete">
	          <button class="btn btn-sm btn-info edit-focal" type="button">编辑</button>
	          <button class="btn btn-sm btn-warning move-pre">上移</button>
	          <button class="btn btn-sm btn-danger demo3">删除</button>
	        </div>
	    </div>
      </div>
      <!-- 4 -->
      <div class="focal-warrper">
        <div class="focal-title">焦点位4</div>
        <div class="focus-warrper-container" data-position="4">
	        <div class="focal-content">
	          <div class="row mb15">
	            <label class="col-md-2 w50">图片：</label>
	            <div class="col-md-9" style="line-height:34px" id="imageFour"></div>
	          </div>
	          <div class="row mb15">
	            <label class="col-md-2 w50">标题：</label>
	            <div class="col-md-9" style="line-height:34px" id="titleFour"></div>
	          </div>
	          <div class="row mb15">
	              <label class="col-md-2  w50 control-label">类型：</label>
	              <div class="col-md-9" style="line-height:34px" id="typeFour"></div>
	          </div>
	          <div class="row mb15">
	            <label class="col-md-2 w50">链接：</label>
	            <div class="col-md-9" style="line-height:34px" id="linkFour"></div>
	          </div>
	        </div>
	        <div class="focal-delete">
	          <button class="btn btn-sm btn-info edit-focal" type="button">编辑</button>
	          <button class="btn btn-sm btn-warning move-pre">上移</button>
	          <button class="btn btn-sm btn-danger demo3">删除</button>
	        </div>
	    </div>
      </div>
      <!-- 5 -->
      <div class="focal-warrper">
        <div class="focal-title">焦点位5</div>
        <div class="focus-warrper-container" data-position="5">
	        <div class="focal-content">
	          <div class="row mb15">
	            <label class="col-md-2 w50">图片：</label>
	            <div class="col-md-9" style="line-height:34px" id="imageFive"></div>
	          </div>
	          <div class="row mb15">
	            <label class="col-md-2 w50">标题：</label>
	            <div class="col-md-9" style="line-height:34px" id="titleFive"></div>
	          </div>
	          <div class="row mb15">
	              <label class="col-md-2  w50 control-label">类型：</label>
	              <div class="col-md-9" style="line-height:34px" id="typeFive"></div>
	          </div>
	          <div class="row mb15">
	            <label class="col-md-2 w50">链接：</label>
	            <div class="col-md-9" style="line-height:34px" id="linkFive"></div>
	          </div>
	        </div>
	        <div class="focal-delete">
	          <button class="btn btn-sm btn-info edit-focal" type="button">编辑</button>
	          <button class="btn btn-sm btn-warning move-pre">上移</button>
	          <button class="btn btn-sm btn-danger demo3">删除</button>
	        </div>
	    </div>
      </div>
     
    <script src="<%=basePath%>static/page/focus/focusPositionNew.js?v=<%=StaticVersion%>"></script>
  </body>
</html>
