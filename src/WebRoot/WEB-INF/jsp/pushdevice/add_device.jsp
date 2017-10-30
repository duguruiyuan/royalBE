<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>设备推送</title>
    <link rel="shortcut icon" href="favicon.ico">
    <link href="<%=basePath%>css/font-awesome.css" rel="stylesheet">
    <link href="<%=basePath%>css/animate.css" rel="stylesheet">
    <link href="<%=basePath%>css/style.css" rel="stylesheet">
    <link href="<%=basePath%>css/bootstrap.min.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/iCheck/custom.css" rel="stylesheet">
    <link href="<%=basePath%>vendor/tree-multi-select/jquery.tree-multiselect.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/sweetalert/sweetalert.css" rel="stylesheet">
    
    <style type="text/css">
      .user_push{width:700px;height:auto;overflow:hidden;}
      .row{margin-bottom:15px}
      .chamber-info{margin-bottom:0}
      .text-align{text-align:right}
    </style>
  </head>
  <body>
    <div class="user_push" id="user_push_con">
      
      <div class="row">
        <div class="col-md-3 text-align">点击行为</div>
        <div class="col-md-9">
          <div class="row" id="reminderObject1">
            <div class="radio i-checks" data-value="1" data-name="reminderObject1">
              <label><input type="radio" value="option1" name="b1"> <i></i> 查看信息源</label>
	        </div>
            <div class="radio i-checks" data-value="2" data-name="reminderObject1">
              <label><input type="radio" value="option1" name="b1"> <i></i> 查看我的消息</label>
	        </div>
	        <div class="radio i-checks" data-value="3" data-name="reminderObject1">
	          <label><input type="radio" value="option2" name="b1"> <i></i> 打开首页</label>
	        </div>
	        <div class="radio i-checks" data-value="4" data-name="reminderObject1">
	          <label><input type="radio" value="option3" name="b1"> <i></i> 打开发现</label>
	        </div>
	        <div class="radio i-checks" data-value="5" data-name="reminderObject1">
	          <label><input type="radio" value="option4" name="b1"> <i></i> 打开商会</label>
	        </div>
          </div>
        </div>
      </div>
      <div class="row" style="display:none;" id = "selectObj">
        <div class="col-md-3 text-align">信息源</div>
        <div class="col-md-9">
          <div class="row">
		      <div class="col-md-3 text-right type-line">选择信息源：</div>
		      <div class="col-md-6">
		      	   <input type="hidden" id="obj_id">
		      	   <input type="hidden" id="obj_type">
		           <ul id="article_info" class="chamber-info"></ul>
		           <span id="sourceTitle"></span><button type="button" class="btn btn-w-m btn-success"  id="select_info">点击选择</button>
		      </div>
		  </div>
		  <div class="row">
		      <div class="col-md-3 text-right type-line">信息源类型：</div>
		      <div class="col-md-6" id="sourceType">
		          <span id="sourceType"></span>
		      </div>
		 </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3 text-align">手机通知栏内容</div>
        <div class="col-md-9">
          <textarea rows="3" class="form-control" id="mobileContent"></textarea>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3 text-align">消息内容</div>
        <div class="col-md-9">
          <textarea rows="3" class="form-control" id="newsContent"></textarea>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3 text-align">提醒对象</div>
        <div class="col-md-9">
          <div class="row" id="reminderObject">
            <div class="radio i-checks" data-value="2" data-name="reminderObject">
              <label><input type="radio" value="option1" name="b"> <i></i> 不提醒</label>
	        </div>
            <div class="radio i-checks" data-value="0" data-name="reminderObject">
              <label><input type="radio" value="option1" name="b"> <i></i> 全部用户</label>
	        </div>
	        <div class="radio i-checks" data-value="1" data-name="reminderObject">
	          <label><input type="radio" value="option2" name="b"> <i></i> 部分用户</label>
	        </div>
          </div>
          <div class="row">
            <div class="row">
              <div class="col-md-3 text-align">商会：</div>
              <div class="col-md-9">
                <ul id="chamber_info" class="chamber-info"></ul>
                <button type="button" class="btn btn-w-m btn-success" id="select_chamber">选择商会</button>
              </div>
            </div>
            <div class="row">
             <div class="col-md-3 text-align">行业：</div>
             <div class="col-md-9">
                 <ul id="position_info" class="chamber-info"></ul>
                 <button type="button" class="btn btn-w-m btn-success" id="select_position">选择行业</button>
             </div>
            </div>
            <div class="row">
              <div class="col-md-3 text-align">地区：</div>
              <div class="col-md-9">
                  <ul id="region_info" class="chamber-info"></ul>
                  <button type="button" class="btn btn-w-m btn-success" id="select_region">选择地区</button>
              </div>
            </div>
            <div class="row">
              <div class="col-md-3 text-align">籍贯：</div>
              <div class="col-md-9">
                  <ul id="native_info" class="chamber-info"></ul>
                  <button type="button" class="btn btn-w-m btn-success" id="select_native">选择籍贯</button>
              </div>
            </div>
            <div class="row">
              <div class="col-md-3 text-align">用户组：</div>
              <div class="col-md-9">
                  <ul id="users_info" class="chamber-info"></ul>
                  <button type="button" class="btn btn-w-m btn-success" id="select_users">选择用户组</button>
              </div>
            </div>
            <div class="row">
              <div class="col-md-3 text-align">用户：</div>
              <div class="col-md-9">
                  <ul id="user_info" class="chamber-info"></ul>
                  <button type="button" class="btn btn-w-m btn-success" id="select_user">选择用户</button>
              </div>
            </div>
            <div class="row">
              <div class="col-md-3 text-align">圈子：</div>
              <div class="col-md-9">
                  <ul id="circle_info" class="chamber-info"></ul>
                  <button type="button" class="btn btn-w-m btn-success" id="select_circle">选择圈子</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-1 col-md-offset-4">
          <button type="button" class="btn btn-info" id="submit_examine">保存</button>
        </div>
        <div class="col-md-1">
          <button type="button" class="btn btn-default">取消</button>
        </div>
      </div>
    </div>
    <script src="<%=basePath%>js/jquery.min.js"></script>
    <script src="<%=basePath%>js/bootstrap.min.js"></script>
    <script src="<%=basePath%>js/public.js"></script>
    <script src="<%=basePath%>vendor/tree-multi-select/jquery.tree-multiselect.js"></script>
    <script src="<%=basePath%>js/CitySelector.js"></script>
    <script src="<%=basePath%>js/TSelector.js"></script>
    <script src="<%=basePath%>js/plugins/iCheck/icheck.min.js"></script>
    <!-- Bootstrap table -->
	<script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table.min.js"></script>
	<script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table-mobile.min.js"></script>
	<script src="<%=basePath%>js/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
	<script src="<%=basePath%>static/common/tSelector.js"></script>
    <script src="<%=basePath%>static/common/articleSelector.js"></script>
	<script src="<%=basePath%>js/device_push.js"></script>
	 <%--弹窗控件--%>
    <link href="<%=basePath%>css/plugins/sweetalert/sweetalert.css" rel="stylesheet">
    <script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>
	<script type="text/javascript">
	//设备推送
    var equipment = {
    		mobileContent: '' ,//手机通知栏内容
    		newsContent: '',//消息内容
    		reminderObject: '',//提醒对象
    		openposition:'',//点击行为
    		shangHui: [],//商会
    		hangYe: [],//行业
    		diQu: [],////地区
    		jiGuan: [],//籍贯
    		yongHuZu: [],//用户组
    		yongHu: [],//用户
    		quanZi: []//圈子
    };
    
    var outArtSelector = new ArticleSelector({
	        headText: '文章选择',
	        onConfirm:function(data){
// 	            console.log(data)
// 	            alert(data.obj_id);
	            $('#obj_id').val(data.obj_id);
	            $('#obj_type').val(data.obj_type);
	            $('#sourceTitle').html(data.title);
	            if(data.obj_type == 1){
// 	            	$('#sourceType').html(data.obj_type);
					$('#sourceType').html('早报');
	            }else if(data.obj_type == 2){
	            	$('#sourceType').html('秘闻');
	            }else if(data.obj_type == 3){
	            	$('#sourceType').html('大咖');
	            }else if(data.obj_type == 4){
	            	$('#sourceType').html('活动');
	            }else if(data.obj_type == 5){
	            	$('#sourceType').html('话题');
	            }else if(data.obj_type == 6){
	            	$('#sourceType').html('专题');
	            }else if(data.obj_type == 7){
	            	$('#sourceType').html('江湖事');
	            }else if(data.obj_type == 8){
	            	$('#sourceType').html('榜样');
	            }else if(data.obj_type == 9){
	            	$('#sourceType').html('工商联新闻');
	            }else if(data.obj_type == 10){
	            	$('#sourceType').html('招商项目');
	            }else if(data.obj_type == 11){
	            	$('#sourceType').html('圈子');
	            }else if(data.obj_type == 12){
	            	$('#sourceType').html('用户动态');
	            }else if(data.obj_type == 13){
	            	$('#sourceType').html('商会资讯');
	            }else if(data.obj_type == 14){
	            	$('#sourceType').html('商会通知');
	            }else if(data.obj_type == 15){
	            	$('#sourceType').html('评论');
	            }else if(data.obj_type == 16){
	            	$('#sourceType').html('关注');
	            }else if(data.obj_type == 17){
	            	$('#sourceType').html('招商单位');
	            }else if(data.obj_type == 18){
	            	$('#sourceType').html('圈子问答');
	            }else if(data.obj_type == 19){
	            	$('#sourceType').html('圈子资讯');
	            }else if(data.obj_type == 20){
	            	$('#sourceType').html('外链');
	            }else if(data.obj_type == 21){
	            	$('#sourceType').html('大咖观点');
	            }else{
	            	$('#sourceType').html('其他');
	            }
	            
	            
	        }
	    });
   
   $('#select_info').on('click',function(){
   		$('#obj_id').val("");
	    $('#obj_type').val("");
    	outArtSelector.openSelector();	
    });
    
    //提交审核
    $('#submit_examine').on('click',function(){
    	if(equipment.openposition == ''){
//     		swal({title:"请选择点击行为", text: "2s后自动消失...",type: "success", timer: 2000});
    		swal('提示','请选择点击行为','error');
    		return ;
    	}
    	if(!equipment.mobileContent){
//     		swal({title:"请输入手机通知栏内容", text: "2s后自动消失...", type: "success", timer: 2000});
    		swal('提示','请输入手机通知栏内容','error');
    		return ;
    	}
//     	alert(equipment.reminderObject);
    	if(equipment.reminderObject < 0){
    		swal('提示','请选择提醒对象','error');
    		return ;
    	}
    	$.ajax({
    		url: '<%=basePath%>admin/pushDevice/add_pushdeviceinfo.shtml',
    		data: {
    			state: 2,
    			objtype: $('#obj_type').val(),
    			objid: $('#obj_id').val(),
  			    //设备
  			    title: equipment.mobileContent,
  			    content: equipment.newsContent,
  			    alluser: equipment.reminderObject,
  			    openposition: equipment.openposition,
  			    shanghui: getIds(equipment.shangHui),
  			    shanghuinames: getNames(equipment.shangHui),
  			    industry: getIds(equipment.hangYe),
			    industrynames: getNames(equipment.hangYe,'NAME'),
			    region: '',
			    regionnames: equipment.diQu.join(','),
			    nativeplace: '',
			    nativeplacenames: equipment.jiGuan.join(','),
			    usergroup: getIds(equipment.yongHuZu),
			    usergroupnames: getNames(equipment.yongHuZu),
			    user: getIds(equipment.yongHu),
			    usernames: getNames(equipment.yongHu),
			    circle: getIds(equipment.quanZi),
			    circlenames: getNames(equipment.quanZi)
    		},
    		type: 'post',
    		dataType: 'json',
    		success: function(res){
    			if(res.code == 0){
        			swal({
                        title: "新增成功",
                        type: "success"
                    },function(){
                    	location.reload();
                    	$('#mobileContent').val('');
                    	$('#newsContent').val('');
                    	
                    });
                    
        		}else{
        			swal('新增失败',res.errMsg,'error');
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