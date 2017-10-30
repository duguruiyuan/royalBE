<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>查看商会入驻信息</title>
    <%@ include file="../include/amdInclude.jsp"%>
    <style type="text/css">
        .form-group{height:auto;overflow:hidden}
    </style>
  </head>
  <body>
    <div class="wrapper wrapper-content animated">
      <div class="form-group">
        <label class="col-sm-3 control-label">联系人：</label>
        <div class="col-sm-8" id="user_name">
        </div>
      </div>
      <div class="form-group" style="display:none">
        <label class="col-sm-3 control-label">联系人电话：</label>
        <div class="col-sm-8" id="mobile">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">联系人地址：</label>
        <div class="col-sm-8" id="user_address">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">留言：</label>
        <div class="col-sm-8" id="user_message">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">入驻材料：</label>
        <div class="col-sm-8" id="image"> 
                
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">商会名称：</label>
        <div class="col-sm-8" id="shanghui">
        </div>
      </div>
      <div class="form-group" style="display:none">
        <label class="col-sm-3 control-label">处理人：</label>
        <div class="col-sm-8" id="user_id">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">商会入驻申请时间：</label>
        <div class="col-sm-8" id="create_time">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">处理时间：</label>
        <div class="col-sm-8" id="update_time">
        </div>
      </div>
    </div>
    
    <script src="<%=basePath%>static/page/enter/enter_info.js?v=<%=StaticVersion%>"></script>
  </body>
</html>