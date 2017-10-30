<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>审核榜样</title>
    <link href="<%=basePath%>css/bootstrap.min.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/sweetalert/sweetalert.css" rel="stylesheet">
  </head>
  
  <body>
    <div>
      <table class="table table-bordered">
        <tr>
          <td>封面</td>
          <td>
            <img id="image" src="" style="display:none" width="150" height="150">
          </td>
        </tr>
        <tr>
          <td>标题</td>
          <td id="title"></td>
        </tr>
        <tr>
          <td>创建人</td>
          <td id="audit_user_name"></td>
        </tr>
        <tr>
          <td>创建时间</td>
          <td id="create_time"></td>
        </tr>
        <tr>
          <td>榜样人物</td>
          <td id="user_name"></td>
        </tr>
        <tr>
          <td>摘要</td>
          <td id="summary"></td>
        </tr>
        <tr>
          <td>正文</td>
          <td id="content"></td>
        </tr>
      </table>
    </div>
    <div class="form-group" style="height:auto;overflow:hidden">
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
  	  <button class="btn btn-success" id="success_example">审核通过</button>
  	  <button class="btn btn-success" style="margin-left:50px" id="fail_example">审核不通过</button>
  	  <button class="btn btn-default" style="margin-left:50px" id="cancel_example">取消</button>
  	</div>
    <script src="<%=basePath%>js/jquery.min.js"></script>
    <script src="<%=basePath%>js/bootstrap.min.js"></script>
    <script src="<%=basePath%>js/public.js"></script>
    <script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>
    <script src="<%=basePath%>vendor/layer/layer.js"></script>
    <script src="<%=basePath%>js/push/see_push.js"></script>
    <script src="<%=basePath%>js/push/set_push.js"></script>
    <script>
      var page = {};
      page.id = GetQueryString('id');
      if(!!page.id){
      	$.ajax({
      		url: '<%=basePath%>admin/example/get_example_id.shtml',
      		data: {
      			id: page.id
      		},
      		type: 'post',
      		dataType: 'json',
      		success: function(res){console.log(res);
      			if(res.code == 0){
      				var result = res.date;
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
     					if(pushdevice[i] && pushdevice[i].is_push_type == 1){
     						setInfoPush(pushdevice[i]);
     						setInformation(pushdevice[i]);
     					}
     					if(pushdevice[i] && pushdevice[i].is_push_type == 2){
     						setEquipmentPush(pushdevice[i]);
     						setEquipment(res.pushdevice[i]);
     					} 
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
      //审核通过
      $('#success_example').on('click',function(){
      	//$('#examine-modal').modal('hide');
      	$.ajax({
      		url: '<%=basePath%>admin/example/audit_example.shtml',
      		data: {
      			id: page.id,
      			obj_id: page.id,
      			obj_type: 8,
      			state: 1,
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
   			    big_end_time: getValueTime(Information.bigTop.endTime)
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
      				});
      			}else{
      				if(res.errMsg == '大置顶冲突!'){
    					swal({
    						title: res.errMsg,
    			            type: "warning",
    			            showCancelButton: true,
    			            confirmButtonColor: "#DD6B55",
    			            confirmButtonText: "去修改",
    			            cancelButtonText:'取消',
    			            closeOnConfirm: false
    					},function(){
    						//parent.layer.close(parent.layer.index);
    						layer.open({
        			            type: 2,
        			            title: '查看或修改冲突大置顶时间',
        			            shadeClose: true,
        			            content: '<%=basePath%>admin/feedtopconflict.shtml?obj_id='+page.id+'&obj_type=8&start_time='+getValueTime(Information.bigTop.startTime)+'&end_time='+getValueTime(Information.bigTop.endTime),
        			            area: [ '900px', '700px' ],
        			            success: function(layero, index){
        			            	swal({
                						title: '修改完成？',
                			            type: "warning",
                			            showCancelButton: true,
                			            confirmButtonColor: "#DD6B55",
                			            confirmButtonText: "是",
                			            cancelButtonText:'否',
                			            closeOnConfirm: false
                					});
        			            }
        			        });
    					});
    				}else{
    					swal('审核失败',res.errMsg,'error');
    				}
      			}
      		},
      		error: function(xhr){
      			alert(xhr)
      		}
      	});
      });
      //审核不通过
      $('#fail_example').on('click',function(){
      	//$('#examine-modal').modal('hide');
      	$.ajax({
      		url: '<%=basePath%>admin/example/audit_example.shtml',
      		data: {
      			id: page.id,
      			obj_id: page.id,
      			obj_type: 8,
      			state: 3,
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
   			    big_end_time: getValueTime(Information.bigTop.endTime)
      		},
      		type: 'post',
      		dataType: 'json',
      		success: function(res){
      			if(res.code == 0){
      				$('#examine-ciphertext').modal('hide');
      				swal({
      					title: '操作成功',
      					type: 'success'
      				},function(){
      					parent.layer.close(parent.layer.index);
      				});
      			}else{
      				swal('操作失败',res.errMsg,'error');
      			}
      		},
      		error: function(xhr){
      			alert(xhr)
      		}
      	});
      });
      //取消
      $('#cancel_example').on('click',function(){
    	  parent.layer.close(parent.layer.index);
      });
    </script>
  </body>
</html>