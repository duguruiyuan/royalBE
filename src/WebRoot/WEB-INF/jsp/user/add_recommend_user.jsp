<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增大咖</title>
    <%@ include file="../include/amdInclude.jsp"%>
    <style>
        .input-group-addon, .input-group-btn{vertical-align: top;}
    </style>
  </head>
  <body>
      <div class="ibox-content" style="padding-top:100px">
          <form id="frmAddRecommend" class="form-horizontal">
              <div class="row">
                  <label class="col-sm-3 control-label">选择用户：</label>
                  <div class="col-sm-8" id="selectUserContainer">
                      
                  </div>
              </div>
              <div class="form-group" style="margin-top:50px">
                  <label class="col-sm-3 control-label">排序：</label>
                  <div class="col-sm-8">
                      <input type="text" id="weight" class="form-control" name="weight">
                  </div>
              </div>
              <div class="row m-t-lg text-center" id="divAction">
                  <div class="col-md-offset-3 col-md-3"><button id="success_dk" type="button" class="btn btn-primary btn-block btn-lg"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;确定新增</button></div>
                  <div class="col-md-3"><button id="cancel_btn" type="button" class="btn btn-default btn-block btn-lg"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button></div>
              </div>
              <!--<div class="row m-t-lg text-center">
                  <button id="success_dk" type="button" class="btn btn-lg btn-primary dim m-l"><i class="glyphicon glyphicon-floppy-saved"></i>&nbsp;&nbsp;确定新增</button>
                  <button id="cancel_btn" type="button" data-action="audit,add,edit" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
              </div>  -->
          </form>
      </div>
    
	<script src="<%=basePath%>static/page/user/add_recommend_user.js?v=<%=StaticVersion%>"></script>        
  </body>
</html>