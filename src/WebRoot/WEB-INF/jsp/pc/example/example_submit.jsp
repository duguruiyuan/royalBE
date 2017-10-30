<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>榜样提交审核</title>
    <link href="<%=basePath%>css/bootstrap.min.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/sweetalert/sweetalert.css" rel="stylesheet">
  </head>
  
  <body>
    <div id="examine_table" class="form-group" style="clear: both;height:auto;overflow:hidden">
        <label class="col-xs-2 control-label ">基本信息</label>
        <div class="col-xs-9">
            <div class="row">
                <div class="col-xs-2">封面：</div>
                <div class="col-xs-10">
                    <img id="image" src="" style="display:none" width="150" height="150">
                </div>
            </div>
            <div class="row">
                <div class="col-xs-2">标题：</div>
                <div id="title" class="col-xs-10"></div>
            </div>
            <div class="row">
                <div class="col-xs-2">创建人：</div>
                <div id="audit_user_name" class="col-xs-10"></div>
            </div>
            <div class="row">
                <div class="col-xs-2">创建时间：</div>
                <div id="create_time" class="col-xs-10"></div>
            </div>
            <div class="row">
                <div class="col-xs-2">榜样人物：</div>
                <div id="user_name" class="col-xs-10"></div>
            </div>
            <div class="row">
                <div class="col-xs-2">摘要：</div>
                <div id="summary" class="col-xs-10"></div>
            </div>
            <div class="row">
                <div class="col-xs-2">正文：</div>
                <div id="content" class="col-xs-10"></div>
            </div>
        </div>
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
  	<div class="form-group" style="height:auto;overflow:hidden">
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
      <div style="text-align:center;margin:25px 0">
          <button type="button" class="btn btn-white" data-dismiss="modal" id="close_examine">关闭</button>
          <button type="button" class="btn btn-primary" id="success_examine" style="margin-left:80px">提交审核</button>
      </div>
  </body>
  <script src="<%=basePath%>js/jquery.min.js"></script>
  <script src="<%=basePath%>js/bootstrap.min.js"></script>
  <script src="<%=basePath%>js/public.js"></script>
  <script src="<%=basePath%>vendor/layer/layer.js"></script>
  <script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>
  <script src="<%=basePath%>js/push/see_push.js"></script>
  <script src="<%=basePath%>js/push/set_push.js"></script>
  <script>
    var page = {};
    page.id = GetQueryString('id');
    $.ajax({
		url: '<%=basePath%>admin/example/get_example_id.shtml',
		data: {
			id: page.id
		},
		type: 'post',
		dataType: 'json',
		success: function(res){console.log(res);
			var result = res.secretMap;
			if(!!result.image) $("#image").show().attr('src',result.image);
			$("#title").html(result.title);
			$("#audit_user_name").html(result.author_name);
			$("#create_time").html(formatDate(result.create_time));
			$("#user_name").html(result.user_name);
			$("#summary").html(result.summary);
			$("#content").html(result.content);
			//初始化推送信息
			var pushdevice = res.pushdevice;
			for(var i = 0; i < pushdevice.length; i++){
				if(pushdevice[i].is_push_type == 1){
					setInfoPush(pushdevice[i]);
					setInformation(pushdevice[i]);
					page.feed_id = pushdevice[i].feed_id;
					page.feed_info_id = pushdevice[i].id;
				}
				if(pushdevice[i].is_push_type == 2){
					setEquipmentPush(pushdevice[i]);
					setEquipment(res.pushdevice[i]);
				} 
			}
		},
		error: function(xhr){
			alert(xhr)
		}
	});
    //提交审核
    $('#success_examine').on('click',function(){
    	$.ajax({
    		url: '<%=basePath%>admin/example/audit_example.shtml',
    		data: {
    			id: _id,
        		obj_id: _id,
    			obj_type: 8,
        		image: $('#image_address').val(),
        		title: $('#title').val(),
        		user_id: _user.attr('data-id'),
        		user_type: _user.attr('data-type'),
        		user_image: _user.attr('data-image'),
        		user_avatar: _user.attr('data-avatar'),
        		user_name: _user.attr('data-name'),
        		user_identity: _user.attr('data-identity'),
        		user_v: _user.attr('data-v'),
        		state: 2,
        		status: 1,
        		summary: $('#summary').val(),
        		content: $('.note-editable p').html(),
        		//推送
    			feed_id: Information.feed_id,
    			feed_info_id: Information.feed_info_id,
        		is_default: Information.isDefault ? 1 : 0,
        		is_extra_push: Information.isAdditional ? 1 : 0,
  			    all_user: Information.isAllUser ? 1 : 0,
  			    sh_ids: getIds(Information.shangHui),
  			    sh_names: getNames(Information.shangHui),
  			    industry_ids: getIds(Information.hangYe),
  			    industry_names: getNames(Information.hangYe,'NAME'),
  			    region_ids: '',
  			    region_names: Information.diQu ? Information.diQu.join(',') : '',
  			    nativeplace_ids: '',
  			    nativeplace_names: Information.jiGuan ? Information.jiGuan.join(',') : '',
  			    usergroup_ids: getIds(Information.yongHuZu),
  			    usergroup_names: getNames(Information.yongHuZu),
  			    user_ids: getIds(Information.yongHu),
  			    user_names: getNames(Information.yongHu),
  			    circle_ids: getIds(Information.quanZi),
  			    circle_names: getNames(Information.quanZi),
  			    //小置顶
  			    small_top: Information.smallTop.select ? 1 : 0,
  			    small_id: Information.smallTop.id ? Information.smallTop.id : '',
  			    display_position: Information.smallTop.sortNum,
  			    small_start_time: getValueTime(Information.smallTop.startTime),
  			    small_end_time: getValueTime(Information.smallTop.endTime),
  			    //大置顶
  			    big_top: Information.bigTop.select ? 1 : 0,
  			    big_id: Information.bigTop.id ? Information.bigTop.id : '',
  			    big_start_time: getValueTime(Information.bigTop.startTime),
  			    big_end_time: getValueTime(Information.bigTop.endTime),
  			    //设备
  			    sb_info_id: equipment.id,
  			    sb_content: equipment.mobileContent,
  			    sb_title: equipment.newsContent,
  			    sb_all_user: equipment.reminderObject,
  			    sb_sh_ids: getIds(equipment.shangHui),
  			    sb_sh_names: getNames(equipment.shangHui),
  			    sb_industry_ids: getIds(equipment.hangYe),
			    sb_industry_names: getNames(equipment.hangYe,'NAME'),
			    sb_region_ids: '',
			    sb_region_names: equipment.diQu ? equipment.diQu.join(',') : '',
			    sb_nativeplace_ids: '',
			    sb_nativeplace_names: equipment.jiGuan ? equipment.jiGuan.join(',') : '',
			    sb_usergroup_ids: getIds(equipment.yongHuZu),
			    sb_usergroup_names: getNames(equipment.yongHuZu),
			    sb_user_ids: getIds(equipment.yongHu),
			    sb_user_names: getNames(equipment.yongHu),
			    sb_circle_ids: getIds(equipment.quanZi),
			    sb_circle_names: getNames(equipment.quanZi)
    		},
    		type: 'post',
    		dataType: 'json',
    		success: function(res){
    			if(res.code == 0){
    				$('#examine-ciphertext').modal('hide');
    				swal({
    					title: '审核通过',
    					type: 'success'
    				},function(){
    					parent.layer.close(parent.layer.index);
    					parent.location.reload();
    				});
    			}else{
    				swal('审核失败',res.errMsg,'error');
    			}
    		},
    		error: function(xhr){
    			alert(xhr)
    		}
    	});
    });
    //取消
    $('#close_examine').on('click',function(){
    	parent.layer.close(parent.layer.index);
    });
  </script>
</html>