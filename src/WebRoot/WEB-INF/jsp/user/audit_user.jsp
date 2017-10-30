<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>认证用户</title>
    <style type="text/css">
      .audit-user{width:700px;height:auto;overflow:hidden;margin:25px auto}
      .audit-user .head-line{height:50px}
      .audit-user .material-line{height:100px}
      .audit-user .material-line .title{display:inline-block;vertical-align: bottom;width:80px;text-align:right;margin-right:10px}
      .audit-user .line{height:25px;line-height:25px;padding:5px 0}
      .audit-user .head-line .title{display:inline-block;vertical-align: bottom;width:80px;text-align:right;margin-right:10px}
      .audit-user .head-line .img{display:inline-block;width:50px;height:50px;background:url(img/add_user/u10.png) no-repeat;vertical-align: bottom;}
      .audit-user .line .title{display:inline-block;width:80px;text-align:right;margin-right:10px}
      .audit-user .line select{height:25px;width:300px}
      .btn-line{height:30px;margin-top:15px}
      .btn-line .btn-info,.btn-line .btn-white{display:inline-block;width:80px;height:28px;border-radius:3px;cursor:pointer}
      .btn-line .btn-info{background-color:#23c6c8;color:#fff;margin-left:100px;border:1px solid transparent;}
      .btn-line .btn-white{border:1px solid #ccc;background-color:#fff;margin-left:30px}
    </style>
  </head>
  <body>
    <div class="audit-user">
      <div class="head-line">
        <span class="title">头像</span>
        <span class="img"></span>
      </div>
      <div class="line">
        <span class="title">姓名</span>
        <span class="text" id="realname">xxx</span>
      </div>
      <div class="line">
        <span class="title">手机</span>
        <span class="text" id="mobile">12345678910</span>
      </div>
      <div class="line">
        <span class="title">单位</span>
        <span class="text" id="company">xxxxx</span>
      </div>
      <div class="line">
        <span class="title">职务</span>
        <span class="text" id="companywork">xxxxxxxxxxxx</span>
      </div>
      <div class="material-line">
        <span class="title">认证材料</span>
        <span></span>
      </div>
      <div class="line">
        <span class="title">认证方式</span>
        <select id="userv">
          <option value="">请选择</option>
          <option value="0">全部</option>
          <option value="0">营业执照</option>
          <option value="0">工作牌</option>
          <option value="0">名片</option>
          <option value="0">商会导入</option>
          <option value="0">身份证</option>
        </select>
      </div>
      <div class="btn-line">
        <button class="btn-info">通过认证</button>
        <button class="btn-white">拒绝认证</button>
      </div>
    </div>
    <script src="<%=basePath%>js/jquery.min.js"></script>
    <script src="<%=basePath%>js/public.js"></script>
    <script>
    var _usid = GetQueryString("usid");
    //用户信息
    $.ajax({
  	  url: '<%=basePath%>userManager/get_userinfo.shtml',
  	  data: {
  		  usid: _usid
  	  },
  	  type: 'post',
  	  dataType: 'json',
  	  success: function(res){
  		  var result = res.userInfo;
  		  $("#realname").html(result.realname);
  		  $("#mobile").html(result.mobile);
  		  $("#company").html(result.company);
  		  $("#companywork").html(result.companywork);
  	  },
  	  error: function(xhr,status,errorYhrown){
  		  console.log(xhr,status,errorYhrown);
  	  }
    });
    //通过认证
    $('button.btn-info').on('click',function(){
    	$.ajax({
    		url: '<%=basePath%>userManager/check_userinfo.shtml',
    		data: {
    			usid: _usid,
    			userv: $("#userv").val(),
    			status: 1
    		},
    		type: 'post',
    		success: function(res){
    			alert('认证通过');
    		},
    		error: function(xhr,status,errorYhrown){
    			alert('错误');
    		}
    	});
    });
    //拒绝认证
    $('button.btn-white').on('click',function(){
    	$.ajax({
    		url: '<%=basePath%>userManager/check_userinfo.shtml',
    		data: {
    			usid: _usid,
    			userv: $("#userv").val(),
    			status: 2
    		},
    		type: 'post',
    		success: function(res){
    			alert('拒绝认证');
    		},
    		error: function(){
    			alert('错误');
    		}
    	});
    });
    </script>
  </body>
</html>