<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>查看用户</title>
    <%@ include file="../include/amdInclude.jsp"%>
    <style type="text/css">
      .form-control.w150{width:200px;display:inline-block}
      .user-info-text{height:34px;line-height:34px}
    </style>
  </head>
  <body>
      <div class="ibox-content">
          <form id="frmUserInfo" class="form-horizontal">
              <div class="form-group hidden">
                  <label class="col-sm-2 control-label">头像：</label>
                  <div class="col-sm-9" id="image"></div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">姓名：</label>
                  <div class="col-sm-9">
                      <div class="user-info-text" id="realname"></div>
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">手机号：</label>
                  <div class="col-sm-9">
                      <div class="user-info-text" id="mobile"></div>
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">用户权重：</label>
                  <div class="col-sm-9">
                      <div class="user-info-text" id="weight"></div>
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">是否认证：</label>
                  <div class="col-sm-9">
                      <div class="user-info-text" id="isAuth"></div>
                  </div>
              </div>
              <div class="form-group hidden">
                  <label class="col-sm-2 control-label">认证方式：</label>
                  <div class="col-sm-9">
                      <div class="user-info-text" id="userv"></div>
                  </div>
              </div>
              <div class="form-group hidden" style="height:120px;overflow:hidden">
                  <label class="col-sm-2 control-label">认证材料：</label>
                  <div class="col-sm-9" id="authList"></div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">单位：</label>
                  <div class="col-sm-9">
                      <div class="user-info-text" id="company"></div>
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">职务：</label>
                  <div class="col-sm-9">
                      <div class="user-info-text" id="companywork"></div>
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">所属商会：</label>
                  <div class="col-sm-9">
                      <div class="user-info-text" id="shOccupation" style="height: auto"></div>
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">常驻地：</label>
                  <div class="col-sm-9">
                      <div class="user-info-text" id="reside"></div>
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">家乡：</label>
                  <div class="col-sm-9">
                      <div class="user-info-text" id="nativeinfo"></div>
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">行业：</label>
                  <div class="col-sm-9">
                      <div class="user-info-text" id="position"></div>
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">单位地址：</label>
                  <div class="col-sm-9">
                      <div class="user-info-text" id="companyaddress"></div>
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">单位简介：</label>
                  <div class="col-sm-9">
                      <div class="user-info-text" id="companyintroduction"></div>
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">单位网址：</label>
                  <div class="col-sm-9">
                      <div class="user-info-text" id="companyweb"></div>
                  </div>
              </div>
          </form>
      </div>

    <!-- 页面文件  -->
	<script src="<%=basePath%>static/page/user/userInfo.js?v=<%=StaticVersion%>"></script>
  </body>
</html>