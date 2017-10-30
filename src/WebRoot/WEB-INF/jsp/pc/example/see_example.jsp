<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>查看榜样</title>
    <link href="<%=basePath%>css/bootstrap.min.css" rel="stylesheet">
    <style type="text/css">
      .form-group{height:auto;overflow:hidden}
    </style>
  </head>
  
  <body>
    <div class="form-group">
      <label class="col-xs-2 control-label ">基本信息</label>
      <div class="col-xs-9">
        <div class="form-group">
          <div class="col-md-3">封面：</div>
          <div class="col-md-9">
              <img id="image" src="" style="display:none" width="150" height="150">
          </div>
        </div>
        <div class="form-group">
          <div class="col-md-3 text-align">标题</div>
          <div class="col-md-9" id="title"></div>
        </div>
        <div class="form-group">
          <div class="col-md-3 text-align">创建人</div>
          <div class="col-md-9" id="audit_user_name"></div>
        </div>
        <div class="form-group">
          <div class="col-md-3 text-align">创建时间</div>
          <div class="col-md-9" id="create_time"></div>
        </div>
        <div class="form-group">
          <div class="col-md-3 text-align">榜样人物</div>
          <div class="col-md-9" id="user_name"></div>
        </div>
        <div class="form-group">
          <div class="col-md-3 text-align">摘要</div>
          <div class="col-md-9" id="summary"></div>
        </div>
        <div class="form-group">
          <div class="col-md-3 text-align">正文</div>
          <div class="col-md-9" id="content"></div>
        </div>
      </div>
    </div>
    <div class="form-group" style="clear: both;height:auto;overflow:hidden">
        <label class="col-xs-2 control-label ">信息流推送</label>
      	<div class="col-xs-9">
      	    <div class="form-group" id="default" style="display: none">
                <div class="col-xs-3 text-align">默认推送范围：</div>
	            <div class="col-xs-9">
	                <span class="info-con"></span>
	            </div>
            </div>
            <div class="form-group">
                <div class="col-xs-3 text-align">额外推送：</div>
	            <div class="col-xs-9">
	                <span class="info-con" id="all"></span>
	            </div>
            </div>
		    <div class="form-group" style="display: none" id ="part">
	            <div class="form-group" style="display: none" id ="sh" >
	                <div class="col-xs-3 text-align">商会：</div>
	                <div class="col-xs-9">
	                    <span id="shanghui"></span>
	                </div>
	            </div>
	            <div class="form-group" style="display: none" id ="hy">
	               <div class="col-xs-3 text-align">行业：</div>
	               <div class="col-xs-9">
	                   <span id="industry"></span>
	               </div>
	            </div>
	            <div class="form-group" style="display: none" id ="dq">
	                <div class="col-xs-3 text-align">地区：</div>
	                <div class="col-xs-9">
	                   <span id="region"></span>
	                </div>
	            </div>
	            <div class="form-group" style="display: none" id ="jg">
	                <div class="col-xs-3 text-align">籍贯：</div>
	                <div class="col-xs-6">
	                    <span id="nativeplace"></span>
	                </div>
	            </div>
	            <div class="form-group" style="display: none" id ="yhz">
	                <div class="col-xs-3 text-align">用户组：</div>
	                <div class="col-xs-6">
	                    <span id="usergroup"></span>
	                </div>
	            </div>
	            <div class="form-group" style="display: none" id ="yh">
	                <div class="col-xs-3 text-align">用户：</div>
	                <div class="col-xs-5">
	                    <span id="user"></span>
	                </div>
	            </div>
	            <div class="form-group" style="display: none" id ="qz">
	                <div class="col-xs-3 text-align">圈子：</div>
	                <div class="col-xs-6">
	                    <span id="circle"></span>
	                </div>
	            </div>
		    </div>
		    
        </div>
  	</div>
  	<div class="form-group">
        <label class="col-xs-2 control-label ">设备推送</label>
      	<div class="col-xs-9">
            <div class="form-group" style="display: none" id ="sb_title" >
                <div class="col-xs-3 text-align">手机通知栏内容：</div>
                <div class="col-xs-9">
                    <span class="info-con"></span>
                </div>
            </div>
	        <div class="form-group" style="display: none" id ="sb_content" >
	            <div class="col-xs-3 text-align">消息内容：</div>
	            <div class="col-xs-9">
	                <span class="info-con"></span>
	            </div>
	        </div>
	        <div class="form-group">
	            <div class="col-xs-3 text-align">提醒对象：</div>
	            <div class="col-xs-9">
	                <span class="info-con" id="sb_all"></span>
	            </div>
	        </div>
			<div class="form-group" style="display: none" id ="sb_part">
	            <div class="form-group" style="display: none" id ="sb_sh" >
	                <div class="col-xs-3 text-align">商会：</div>
	                <div class="col-xs-9">
	                    <span class="info-con"></span>
	                </div>
	            </div>
	            <div class="form-group" style="display: none" id ="sb_hy">
	               <div class="col-xs-3 text-align">行业：</div>
	               <div class="col-xs-6">
	                   <span class="info-con"></span>
	               </div>
	            </div>
	            <div class="form-group" style="display: none" id ="sb_dq">
	                <div class="col-xs-3 text-align">地区：</div>
	                <div class="col-xs-6">
	                    <span class="info-con"></span>
	                </div>
	            </div>
	            <div class="form-group" style="display: none" id ="sb_jg">
	                <div class="col-xs-3 text-align">籍贯：</div>
	                <div class="col-xs-9">
	                    <span class="info-con"></span>
	                </div>
	            </div>
	            <div class="form-group" style="display: none" id ="sb_yhz">
	                <div class="col-xs-3 text-align">用户组：</div>
	                <div class="col-xs-6">
	                    <span class="info-con"></span>
	                </div>
	            </div>
	            <div class="form-group" style="display: none" id ="sb_yh">
	                <div class="col-xs-3 text-align">用户：</div>
	                <div class="col-xs-5">
	                    <span class="info-con"></span>
	                </div>
	            </div>
	            <div class="form-group" style="display: none" id ="sb_qz">
	                <div class="col-xs-3 text-align">圈子：</div>
	                <div class="col-xs-6">
	                    <span class="info-con"></span>
	                </div>
	            </div>
		    </div>
        </div>
  	</div>
    <script src="<%=basePath%>js/jquery.min.js"></script>
    <script src="<%=basePath%>js/bootstrap.min.js"></script>
    <script src="<%=basePath%>js/public.js"></script>
    <script src="<%=basePath%>js/push/see_push.js"></script>
    
    <script>
      var _id = GetQueryString('id');
      if(!!_id){
      	$.ajax({
      		url: '<%=basePath%>admin/example/get_example_id.shtml',
      		data: {
      			id: _id
      		},
      		type: 'post',
      		dataType: 'json',
      		success: function(res){
      			if(res.code == 0){
      				var result = res.data;
      				if(!!result.image) $("#image").show().attr('src',result.image);
      				$("#title").html(result.title);
      				$("#audit_user_name").html(result.author_name);
      				$("#create_time").html(formatDate(result.create_time));
      				$("#user_name").html(result.user_name);
      				$("#summary").html(result.summary);
      				$("#content").html(result.content);
      			    //初始化推送信息
      				var pushdevice = res.pushdevice;console.log(pushdevice);
      				for(var i = 0; i < pushdevice.length; i++){
      					if(pushdevice[i] && pushdevice[i].is_push_type == 1) setInfoPush(pushdevice[i]);
      					if(pushdevice[i] && pushdevice[i].is_push_type == 2) setEquipmentPush(pushdevice[i]);
      				}
      			}else{
      				alert('错误');
      			}
      		},
      		error: function(xhr){
      			console.log(xhr);
      		}
      	});
      }else{
    	  $('body').html('操作错误！');
      }
    </script>
  </body>
</html>