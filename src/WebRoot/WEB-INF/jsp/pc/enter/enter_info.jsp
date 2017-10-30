<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>查看/修改用户信息</title>
    <link href="<%=basePath%>css/bootstrap.min.css" rel="stylesheet">
    <link href="<%=basePath%>css/font-awesome.min.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/sweetalert/sweetalert.css" rel="stylesheet">
    <style type="text/css">
      .add-user{width:600px;height:auto;overflow:hidden;margin:25px auto}
      .row{margin:15px 0 0 0}
      .row .col-md-2{text-align:right;line-height:34px}
      .image_url{display:inline-block}
      .form-control.w150{width:150px;display:inline-block}
    </style>
  </head>
  <body>
    <div class="add-user">
      <div class="row">
        <div class="col-xs-3">联系人</div>
        <div class="col-xs-9" id="user_name">
        </div>
      </div>
      <div class="row" style="display:none">
        <div class="col-xs-3">联系人电话</div>
        <div class="col-xs-9" id="mobile">
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3">联系人地址</div>
        <div class="col-xs-9" id="user_address">
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3">留言</div>
        <div class="col-xs-9" id="user_message">
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3">入驻材料</div>
        <div class="col-xs-9" id="image"> 
            <img src="" widrh="100px" height="100px" style="display:none">       
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3">商会名称</div>
        <div class="col-xs-9" id="shanghui">
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3">处理人</div>
        <div class="col-xs-9" id="user_id">
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3">商会入驻申请时间</div>
        <div class="col-xs-9" id="create_time">
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3">处理时间</div>
        <div class="col-xs-9" id="update_time">
        </div>
      </div>
    </div>
    <script src="<%=basePath%>js/jquery.min.js"></script>
    <script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>
    <!-- 上传图片  -->
    <script src="<%=basePath%>js/public.js"></script>
    <script src="<%=basePath%>js/upload_img/plupload.full.min.js"></script>
	<script src="<%=basePath%>js/upload_img/qiniu.js"></script>
	<script src="<%=basePath%>js/upload_img/edit_user.js"></script>
    <script type="text/javascript">
        var _id = GetQueryString('id');
	    $.ajax({
	  	  url: '<%=basePath%>admin/settled/get_settled_id.shtml',
	  	  data: {id: _id},
	  	  type: 'post',
	  	  dataType: 'json',
	  	  success: function(res){
	  		  if(res.code == 0){
	  			  var result = res.data;
		  		  $('#user_name').html(result.user_name);
		  		  $('#mobile').html(result.mobile);
		  		  $('#user_address').html(result.user_address);
		  		  $('#user_message').html(result.user_message);
		  		  if(!!result.image) $('#image').find('img').show().attr('src',result.image);
		  		  $('#shanghui').html(result.shanghui);
		  		  $('#user_id').html(result.user_id);
		  		  $('#update_time').html(formatDate(result.update_time));
		  		  $('#create_time').html(formatDate(result.create_time));
	  		  }else{
	  			swal({
                    title: "不存在此入驻信息",
                    type: "error"
                },function () {
                	parent.layer.close(parent.layer.index);
                });
	  		  }
	  	  },
	  	  error: function(){}
	    });
    </script>
  </body>
</html>