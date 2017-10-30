<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>审核用户</title>
    <%@ include file="../include/amdInclude.jsp"%>
    <style type="text/css">
        .line-height34 {line-height:34px}
    </style>
  </head>
  <body>
      <div class="ibox-content">
          <form id="formExamineUser" class="form-horizontal">
              <div class="form-group">
                  <label class="col-sm-2 control-label">头像：</label>
                  <div class="col-sm-9 line-height34" id="upload_content">
                      
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">姓名：</label>
                  <div class="col-sm-9 line-height34" id="realname">
                      
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">手机号：</label>
                  <div class="col-sm-9 line-height34" id="mobile">
                      
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">单位：</label>
                  <div class="col-sm-9 line-height34" id="company">
                      
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">职务：</label>
                  <div class="col-sm-9 line-height34" id="companywork">
                      
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">认证材料：</label>
                  <div class="col-sm-9 line-height34" id="divShortImages" class="m-t-lg text-left"></div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">认证方式：</label>
                  <div class="col-sm-9 line-height34">
                      <select name="userv" class="form-control" id="userv"></select>
                  </div>
              </div>
              <div class="row m-t-lg text-center">
                  <div class="col-md-offset-2 col-md-3" id="preservation_user"><button type="button" class="btn btn-primary btn-block btn-lg"><i class="fa fa-check-circle"></i>&nbsp;&nbsp;通过认证</button></div>
                  <div class="col-md-3" id="btnAuditNoPass"><button type="button" class="btn btn-danger btn-block btn-lg"><i class="fa fa-ban"></i>&nbsp;&nbsp;拒绝认证</button></div>
                  <div class="col-md-3" id="cancel-btn"><button type="button" class="btn btn-default btn-block btn-lg"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button></div>
              </div>  
              <!--<div class="row m-t-lg text-center">
                  <button id="preservation_user" type="button" class="btn btn-lg btn-primary dim m-l"><i class="fa fa-check-circle"></i>&nbsp;&nbsp;通过认证</button>
                  <button id="btnAuditNoPass" type="button" class="btn btn-lg btn-danger dim m-l"><i class="fa fa-ban"></i>&nbsp;&nbsp;拒绝认证</button>
                  <button id="cancel-btn" type="button" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
              </div>-->
          </form>
      </div>
    
    <script src="<%=basePath%>static/page/user/examine_user.js?v=<%=StaticVersion%>"></script>
  </body>
</html>