<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>评论推送</title>
    <link href="<%=basePath%>css/bootstrap.min.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/sweetalert/sweetalert.css" rel="stylesheet">
    <style type="text/css">
      .user_push{width:1000px;height:auto;overflow:hidden;margin: 50px auto 0 auto;padding:20px}
      .user_push .top_warpper{width:100%;heigth:60px}
      .user_push .top_warpper .img{display:inline-block;vertical-align: top;}
      .user_push .top_warpper .info{display:inline-block;line-height:20px}
      .content-warpper{margin-top:15px;height:auto;overflow:hidden;}
      .padding-five{padding:0 5px}
      .hidden{display:none}
      .btn-success{margin-left:100px}
    </style>
  </head>
  <body>
    <div class="user_push">
      <iframe id="user_push" src='informationflowpush.shtml' name="user-push" style="width:100%;min-height:640px;border:none;overflow:hidden"></iframe>
      <div class="content-warpper">
        <button id="user_push_btn" type="button" class="btn btn-w-m btn-success">确定推送</button>
      </div>
    </div>
    <script src="<%=basePath%>js/jquery.min.js"></script>
    <script src="<%=basePath%>js/bootstrap.min.js"></script>
    <script src="<%=basePath%>js/public.js"></script>
    <script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>
    <script>
      var _obj_id = GetQueryString("obj_id"),
          _obj_type = GetQueryString("obj_type"),
          _title = GetQueryString("title"),
          _summary = GetQueryString("summary"),
          _image = GetQueryString("image"),
          _extra = GetQueryString("extra");
          _id = GetQueryString("id");
      function getNodeId(dom) {
    	  var arr = [];
    	  for(var i = 0; i < dom.length; i++){
    		  arr.push(dom.eq(i).attr('data-id'));
    	  }
    	  return arr.join(',');
      }
      function getNodeText(dom) {
    	  var arr = [];
    	  for(var i = 0; i < dom.length; i++){
    		  arr.push(dom.eq(i).text());
    	  }
    	  return arr.join(',');
      }
      function getValueTime(val){
    	  if(!!val) return '';
    	  return new Date(val).getTime();
      }
      $('#user_push_btn').click(function(){
    	  var iframeCon = $(window.frames["user-push"].document);
    	  var placeTop = iframeCon.find('label.place-top');
    	  var _type = '',_smalltop = '',_bigtop = '';
    	  if(placeTop.eq(0).find('.icheckbox_square-green').hasClass('checked')){
    		  _type = 1;
    		  _smalltop = 0;
    	  }else{
    		  _smalltop = 1;
    	  }
    	  if(placeTop.eq(1).find('.icheckbox_square-green').hasClass('checked')){
    		  _type = 2;
    		  _bigtop = 0;
    	  }else{
    		  _bigtop = 1;
    	  }
    	  //var _type = iframeCon.find('#push_val').val();
    	  $.ajax({
    		  url: '<%=basePath%>admin/common/commont_push.shtml',
    		  data: {
    		  	  id: _id,
    			  obj_id: _obj_id,
    			  obj_type: 28,
    			  title: _title,
    			  summary: _summary,
    			  image: _image,
    			  extra: _extra,
    			  is_default: iframeCon.find('#push_val').val(),
    			  
    			  all_user: iframeCon.find('#push_user_val').val(),
    			  sh_ids: getNodeId(iframeCon.find('#chamber_info li')),
    			  sh_names: getNodeText(iframeCon.find('#chamber_info li')),
    			  industry_ids: getNodeId(iframeCon.find('#position_info li')),
    			  industry_names: getNodeText(iframeCon.find('#position_info li')),
    			  region_ids: '',
    			  region_names: getNodeText(iframeCon.find('#region_info li')),
    			  nativeplace_ids: '',
    			  nativeplace_names: getNodeText(iframeCon.find('#native_info li')),
    			  usergroup_ids: getNodeId(iframeCon.find('#users_info li')),
    			  usergroup_names: getNodeText(iframeCon.find('#users_info li')),
    			  user_ids: getNodeId(iframeCon.find('#user_info li')),
    			  user_names: getNodeId(iframeCon.find('#user_info li')),
    			  circle_ids: getNodeId(iframeCon.find('#circle_info li')),
    			  circle_names: getNodeText(iframeCon.find('#circle_info li')),
    			  
    			  small_top: _smalltop,
    			  display_position: iframeCon.find('#top_number').val(),
    			  smallstarttime: getValueTime(iframeCon.find('#start1').val()),
    			  smallendtime: getValueTime(iframeCon.find('#end1').val()),
    			  big_top: _bigtop,
    			  bigstarttime: getValueTime(iframeCon.find('#start2').val()),
    			  bigendtime: getValueTime(iframeCon.find('#end2').val())
    		  },
    		  type: 'post',
    		  dataType: 'json',
    		  success: function(res){console.log(res);
    			  if(res.code == 0){
    				  swal({
    					  title: '推送成功',
    					  type: 'success'
    				  });
    			  }else if(res.code == 1){
    				  swal('推送失败',errMsg,'error');
    			  }
    		  },
    		  error: function(xhr){
    			  console.log(xhr);
    		  }
    	  });
      });
    </script>
  </body>
</html>