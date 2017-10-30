<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增用户</title>
    <%@ include file="../include/amdInclude.jsp"%>
  </head>
  <body>
      <div class="ibox-content">
          <form id="frmAddUser" class="form-horizontal">
              <div class="form-group">
                  <label class="col-sm-2 control-label">头像：</label>
                  <div class="col-sm-9">
                      <input id="fileSelector" type="file" multiple name="file" />
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">姓名：</label>
                  <div class="col-sm-9">
                      <input class="form-control" id="realname" type="text" name="realname" placeholder="请输入姓名">
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">手机号：</label>
                  <div class="col-sm-9">
                      <input class="form-control" id="mobile" type="text" name="mobile" maxlength="11" placeholder="请输入手机号">
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">用户权重：</label>
                  <div class="col-sm-9">
                      <select id="weight" name="weight" class="form-control"></select>
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">出生日期：</label>
                  <div class="col-sm-5 input-group date" style="padding-left: 15px;width:260px">
                      <input id="birthday" name="birthday" class="form-control form_date" size="10" type="text" data-end="#endTime" value="" placeholder="请选择出生日期" readonly />
                      <label for="birthday" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">是否认证：</label>
                  <div class="col-sm-9">
                      <label for="radType1" class="radio i-checks radio-inline">
                          <input id="radType1" name="radType" type="radio" value="1" data-toggle="#uservContainer" />是
                      </label>
                      <label for="radType2" class="radio i-checks radio-inline">
                          <input id="radType2" name="radType" type="radio" value="2" checked="checked" data-toggle="" />否
                      </label>
                  </div>
              </div>
              <div id="uservContainer">
                  <div class="form-group">
	                  <label class="col-sm-2 control-label">认证方式：</label>
	                  <div class="col-sm-9">
	                      <select id="userv" name="userv" class="form-control">
				          </select>
	                  </div>
	              </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">单位：</label>
                  <div class="col-sm-9">
                      <input id="company" type="text" name="company" class="form-control" placeholder="请输入单位名称">
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">职务：</label>
                  <div class="col-sm-9">
                      <input id="companywork" type="text" name="companywork" class="form-control" placeholder="请输入职务">
                  </div>
              </div>
              <div class="form-group" id="selectRegionContainer">
                  <label class="col-sm-2 control-label">常驻地：</label>
                  <div class="col-sm-9" id="selectRegion">
                      
                  </div>
              </div>
              <div class="form-group" id="selectNativeplaceContainer">
                  <label class="col-sm-2 control-label">家乡：</label>
                  <div class="col-sm-9" id="selectNativeplace">
                      
                  </div>
              </div>
              <div class="form-group" id="selectIndustryContainer">
                  <label class="col-sm-2 control-label">行业：</label>
                  <div class="col-sm-9">
                      <a class="btn btn-primary" id="selectIndustry">选择行业</a>
                      <span class="m-l-xs" id="selectIndustryList"></span>
                  </div>
              </div>
              <div class="form-group hidden" id="selectIndustryPrompt">
                  <label class="col-sm-2 control-label"></label>
                  <div class="col-sm-9" style="color:#a94442">行业不能为空</div>
              </div>
              <div class="form-group" id="selectAreaContainer">
                  <label class="col-sm-2 control-label">单位地址：</label>
                  <div class="col-sm-9" id="selectArea">
                      
                  </div>
              </div>
              <div class="form-group" style="display:none" id="street">
                  <div class="col-sm-9 col-sm-offset-2">
                      <textarea id="streetText" class="form-control" rows="3" placeholder="请输入单位街道地址"></textarea>
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">单位简介：</label>
                  <div class="col-sm-9">
                      <textarea name="companyintroduction" id="companyintroduction" class="form-control" rows="3" placeholder="请输入单位简介"></textarea>
                  </div>
              </div>
              <div class="form-group">
                  <label class="col-sm-2 control-label">单位网址：</label>
                  <div class="col-sm-9">
                      <input name="companyweb" id="companyweb" class="form-control" placeholder="请输入以http|ftp|https开头完整的单位网址"></input>
                  </div>
              </div>
              <div class="row m-t-lg text-center" id="divAction">
                  <div class="col-md-offset-3 col-md-3"><button id="preservation_user" type="button" disabled="disabled" class="btn btn-primary btn-block btn-lg"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;确定新增</button></div>
                  <div class="col-md-3"><button type="button" id="btnCancel" disabled="disabled" class="btn btn-default btn-block btn-lg"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button></div>
              </div>
          </form>
      </div>
    
    <!-- 上传图片  -->
	<script src="<%=basePath%>static/page/user/add_user.js?v=<%=StaticVersion%>"></script>
  </body>
</html>