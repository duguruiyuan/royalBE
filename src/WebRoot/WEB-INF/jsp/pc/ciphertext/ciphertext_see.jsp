<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>查看密文</title>
    <link href="<%=basePath%>css/bootstrap.min.css" rel="stylesheet">
  </head>
  
  <body class="gray-bg">
    <div id="ciphertext-info-con">
      <table class="table table-bordered">
        <tr>
          <td>类型</td>
          <td id="islength"></td>
        </tr>
        <tr>
          <td>标题/内容</td>
          <td id="title"></td>
        </tr>
        <tr>
          <td>创建人</td>
          <td id="author_name"></td>
        </tr>
        <tr>
          <td>创建时间</td>
          <td id="create_time"></td>
        </tr>
        <tr>
          <td>是否证实</td>
          <td id=""></td>
        </tr>
        <tr>
          <td>匿名主题</td>
          <td id=""></td>
        </tr>
        <tr>
          <td>摘要</td>
          <td id="summary"></td>
        </tr>
      </table>
    </div>
    <div class="form-group" style="clear: both;height:auto;overflow:hidden">
      				<label class="col-xs-2 control-label ">信息流推送</label>
      				<div class="col-xs-9">
          				<div class="row">
				        <div class="col-md-9">
				          <div class="row" id="reminderObject" >
				            <div id="all" class="col-md-3 text-align"  style="display: none">
				              	 全部用户
					        </div>
				          </div>
				          <div class="row" style="display: none" id ="part">
				            <div class="row" style="display: none" id ="sh" >
				              <div class="col-md-3 text-align">商会：</div>
				              <div class="col-md-6">
				                <span id="shanghui"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="hy">
				             <div class="col-md-3 text-align">行业：</div>
				             <div class="col-md-6">
				                 <span id="industry"></span>
				             </div>
				            </div>
				            <div class="row" style="display: none" id ="dq">
				              <div class="col-md-3 text-align">地区：</div>
				              <div class="col-md-6">
				                 <span id="region"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="jg">
				              <div class="col-md-3 text-align">籍贯：</div>
				              <div class="col-md-6">
				                  <span id="nativeplace"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="yhz">
				              <div class="col-md-3 text-align">用户组：</div>
				              <div class="col-md-6">
				                  <span id="usergroup"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="yh">
				              <div class="col-md-3 text-align">用户：</div>
				              <div class="col-md-5">
				                  <span id="user"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="qz">
				              <div class="col-md-3 text-align">圈子：</div>
				              <div class="col-md-6">
				                  <span id="circle"></span>
				              </div>
				            </div>
				          </div>
				        </div>
				      </div>
      				</div>
  				</div>
  	<div class="form-group">
      				<label class="col-xs-2 control-label ">设备推送</label>
      				<div class="col-xs-9">
          				<div class="row">
				        <div class="col-md-9">
				          <div class="row" style="display: none" id ="sb_title" >
				              <div class="col-md-3 text-align">手机通知栏内容：</div>
				              <div class="col-md-6">
				                <span class="info-con"></span>
				              </div>
				          </div>
				          <div class="row" style="display: none" id ="sb_content" >
				              <div class="col-md-3 text-align">消息内容：</div>
				              <div class="col-md-6">
				                <span class="info-con"></span>
				              </div>
				          </div>
				          <div class="row" id="sb_reminderObject" >
				            <div id="sb_all" class="col-md-3 text-align"  style="display: none">
				              	 
					        </div>
				          </div>
				          <div class="row" style="display: none" id ="sb_part">
				            <div class="row" style="display: none" id ="sb_sh" >
				              <div class="col-md-3 text-align">商会：</div>
				              <div class="col-md-6">
				                <span class="info-con"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="sb_hy">
				             <div class="col-md-3 text-align">行业：</div>
				             <div class="col-md-6">
				                 <span class="info-con"></span>
				             </div>
				            </div>
				            <div class="row" style="display: none" id ="sb_dq">
				              <div class="col-md-3 text-align">地区：</div>
				              <div class="col-md-6">
				                 <span class="info-con"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="sb_jg">
				              <div class="col-md-3 text-align">籍贯：</div>
				              <div class="col-md-6">
				                  <span class="info-con"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="sb_yhz">
				              <div class="col-md-3 text-align">用户组：</div>
				              <div class="col-md-6">
				                  <span class="info-con"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="sb_yh">
				              <div class="col-md-3 text-align">用户：</div>
				              <div class="col-md-5">
				                  <span class="info-con"></span>
				              </div>
				            </div>
				            <div class="row" style="display: none" id ="sb_qz">
				              <div class="col-md-3 text-align">圈子：</div>
				              <div class="col-md-6">
				                  <span class="info-con"></span>
				              </div>
				            </div>
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
      		url: '<%=basePath%>admin/secretNews/find_secretinfo.shtml',
      		data: {
      			id: _id
      		},
      		type: 'post',
      		dataType: 'json',
      		success: function(res){
      			if(res.code == 0){
      				var result = res.secretMap;console.log(res);
      				if(result.is_length == 0){
      					$('#islength').html('短文');
          				$('#title').html(result.content);
      				}else{
      					$('#islength').html('长文');
          				$('#title').html(result.title);
      				}
      				$('#author_name').html(result.author_name);
      				$('#create_time').html(formatDate(result.create_time));
      				$('#summary').html(result.summary);
      				//初始化推送信息
      				var pushdevice = res.pushdevice;
      				for(var i = 0; i < pushdevice.length; i++){
      					if(pushdevice[i].is_push_type == 1) setInfoPush(pushdevice[i]);
      					if(pushdevice[i].is_push_type == 2) setEquipmentPush(pushdevice[i]);
      				}
      			}else{
      				$('#ciphertext-info-con').html('不存在该密文');
      			}
      		},
      		error: function(xhr){
      			console.log(xhr);
      		}
      	});
      }else{
      	//alert('非法操作');
      	history.back();
      }
    </script>
  </body>
</html>