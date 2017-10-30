<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>编辑江湖事</title>
    <link rel="<%=basePath%>shortcut icon" href="favicon.ico"> 
    <link href="<%=basePath%>css/bootstrap.min.css" rel="stylesheet">
    <link href="<%=basePath%>css/font-awesome.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/summernote/summernote.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/summernote/summernote-bs3.css" rel="stylesheet">
    <link href="<%=basePath%>css/style.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/iCheck/custom.css" rel="stylesheet">
    <link href="<%=basePath%>css/public.min.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/sweetalert/sweetalert.css" rel="stylesheet">
    <style type="text/css">
      .J_iframe_push{width:100%;height:510px;border:none}
      .type-line{height:42px;line-height:42px}
      .select-line{height:34px;line-height:34px}
      .radio label.no-left{padding-left:0}
      .note-editor p{height:100px}
      .col-md-2.w100{width:120px;padding:0}
      .col-md-2.w60{width:60px;padding:0;text-align:right}
      .col-md-10.pl0{padding-left:0}
      .row{margin-bottom:5px}
      .row.bottom10{margin-bottom:15px}
      .row.not-left{margin-left:0}
      .h-auto.mb25{margin-bottom:25px}
      .address-row{width:100%;height:30px;padding:2px}
      .address-row select{display:inline-block;width:150px;height:30px}
      .hidden{display:none}
      .image_url{display:inline-block}
      .i-checks{display:inline-block}
      .radio label{padding: 0 15px 0 0}
    </style>
  </head>
  
  <body>
    <div class="h-auto mb25">
      <div class="h-auto">
        <div class="row">
          <div class="col-md-3 text-right type-line">封面：</div>
          <div class="col-md-9" id="upload_example">
            <div class="image_url">
              <img id="image" src="" width="100" height="100" style="display:none" />
            </div>
            <button class="btn btn-success " type="button" id="pickfiles">
              <i class="fa fa-upload"></i>&nbsp;&nbsp;<span class="bold">上传</span>
            </button>
            <input id="image_address" type="hidden" class='image_address' />
          </div>
        </div>
        <div class="row">
          <div class="col-md-3 text-right type-line">类型：</div>
          <div class="col-md-9" id="is_short">
            <input type="hidden" id="short_type" value="0">
            <div class="radio i-checks" data-value="0" data-name="is_short">
              <label><input type="radio" checked="" value="option1" name="isShort"> <i></i> 长文章</label>
            </div>
            <div class="radio i-checks" data-value="1" data-name="is_short">
              <label><input type="radio" value="option2" name="isShort"> <i></i> 短文章</label>
            </div>
          </div>
        </div>
        <div class="row" id="jhs_title">
          <div class="col-md-3 text-right type-line">标题：</div>
          <div class="col-md-9">
            <input type="text" class="form-control" placeholder="请输入标题" id="title">
          </div>
        </div>
        <div class="row">
          <div class="col-md-3 text-right">导语：</div>
          <div class="col-md-9">
            <textarea class="form-control" rows="3" id="summary"></textarea>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3 text-right">正文：</div>
          <div class="col-md-9">
            <div class="ibox float-e-margins">
              <div id="content" class="ibox-content no-padding">
                <div class="summernote"></div>
              </div>
            </div>
          </div>
        </div>
	  </div>
      <div class="row">
        <div class="col-md-3 text-right">信息流推送：</div>
        <div class="col-md-9">
          <button class="btn btn-info" id="push_btn">信息流推送</button>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3 text-right">设备推送：</div>
        <div class="col-md-9">
          <button class="btn btn-info" id="equipment_btn">设备推送</button>
        </div>
      </div>
      <div class="row">
        <div class="col-md-1 col-md-offset-4">
          <button id="add_example" type="button" class="btn btn-info">保存修改</button>
        </div>
        <div class="col-md-1">
          <button id="submit_example" type="button" class="btn btn-info">提交审核</button>
        </div>
        <div class="col-md-1">
          <button type="button" class="btn btn-default">取消</button>
        </div>
      </div>
    </div>

    <script src="<%=basePath%>js/jquery.min.js"></script>
    <script src="<%=basePath%>js/bootstrap.min.js"></script>
    <script src="<%=basePath%>js/plugins/iCheck/icheck.min.js"></script>
    <!-- SUMMERNOTE -->
    <script src="<%=basePath%>js/plugins/summernote/summernote.min.js"></script>
    <script src="<%=basePath%>js/plugins/summernote/summernote-zh-CN.js"></script>
    <!-- 上传图片  -->
    <script src="<%=basePath%>js/public.js"></script>
    <script src="<%=basePath%>js/upload_img/plupload.full.min.js"></script>
	<script src="<%=basePath%>js/upload_img/qiniu.js"></script>
	<script src="<%=basePath%>js/upload_img/jhs.js"></script>
	<script src="<%=basePath%>vendor/layer/layer.js"></script>
    <script src="<%=basePath%>js/common.js"></script>
	<script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>
	<script src="<%=basePath%>js/push/set_push.js"></script>
    <script type="text/javascript">
    var page = {};
    page.id = GetQueryString('id');
    $('#push_btn').on('click',function(){
    	openLayerWin('<%=basePath%>admin/infopush.shtml?button=true','信息流推送','700px','700px');
    });
    $('#equipment_btn').on('click',function(){
    	openLayerWin('<%=basePath%>admin/equipmentpush.shtml','设备推送','800px','700px');
    });
    if(!!page.id){
    	$.ajax({
    		url: '<%=basePath%>admin/article/get_article_id.shtml',
    		data: {
    			id: page.id
    		},
    		type: 'post',
    		dataType: 'json',
    		success: function(res){console.log(res);
    			if(res.code == 0){
    				var result = res.data;
    				page.state = result.state;
    				if(!!result.image){
    					$('#upload_example').find('.image_url img').show().attr('src',result.image);
        				$('#image_address').val(result.image);
    				}
    				page.is_short = result.is_short;
    				setRadio('#is_short',result.is_short);
    				if (result.is_short == 0) {
    					$('#jhs_title').show();
    					$('#title').val(result.title);
    				} else if (result.is_short == 1) {
    					$('#jhs_title').hide();
    					$('#title').val('');
    				}
    				setRadio('#is_real',result.type);  //是否证实
    				
    				$('#summary').val(result.summary);
    				$('#content .note-editable p').html(result.content);
    				page.state = result.state;
    				var pushdevice = res.pushdevice;
    				for(var i = 0; i < pushdevice.length ;i++){
    					if(pushdevice[i].is_push_type == 1) setInformation(pushdevice[i]);
    					if(pushdevice[i].is_push_type == 2) setEquipment(pushdevice[i]);
    				}
    			}else{
    				alert('错误');
    			}
    		},
    		error: function(xhr){
    			console.log(xhr);
    		}
    	});
    }
    //保存修改
    $('#add_example').on('click',function(){
    	$.ajax({
        	url: '<%=basePath%>admin/article/update_article_id.shtml',
        	data: {
        		id: page.id,
        		state: page.state,
    			obj_id: page.id,
    			obj_type: 7,
        		image: $('#image_address').val(),
        		is_short: page.is_short,
        		title: page.is_short == 0 ? $('#title').val() : '',
        		summary: $('#summary').val(),
        		content: $('.note-editable p').html(),
        		state: page.state,
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
  			    small_id: Information.smallTop.id,
  			    display_position: Information.smallTop.sortNum,
  			    small_start_time: getValueTime(Information.smallTop.startTime),
  			    small_end_time: getValueTime(Information.smallTop.endTime),
  			    //大置顶
  			    big_top: Information.bigTop.select ? 1 : 0,
  			    big_id: Information.bigTop.id,
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
        			swal({
                        title: "修改成功",
                        type: "success"
                    },function(){
                    	location.reload();
                    });
        		}else{
        			swal('修改失败',res.errMsg,'error');
        		}
        	},
        	error: function(xhr){
        		console.log(xhr);
        	}
        });
    });
    //提交审核
    $('#submit_example').on('click',function(){
    	$.ajax({
        	url: '<%=basePath%>admin/article/audit_article.shtml',
        	data: {
        		id: page.id,
        		state: page.state,
    			obj_id: page.state,
    			obj_type: 7,
        		image: $('#image_address').val(),
        		is_short: page.is_short,
        		title: page.is_short == 0 ? $('#title').val() : '',
        		summary: $('#summary').val(),
        		content: $('.note-editable p').html(),
        		state: 2,
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
        			swal({
                        title: "提交审核成功",
                        type: "success"
                    },function(){
                    	location.reload();
                    });
        		}else{
        			swal('提交审核失败',res.errMsg,'error');
        		}
        	},
        	error: function(xhr){
        		console.log(xhr);
        	}
        });
    });
    var edit = function () {
        $("#eg").addClass("no-padding");
        $('.click2edit').summernote({
            lang: 'zh-CN',
            focus: true
        });
    };
    var save = function () {
        $("#eg").removeClass("no-padding");
        var aHTML = $('.click2edit').code(); //save HTML If you need(aHTML: array).
        $('.click2edit').destroy();
    };
    var radioBtns = $('.i-checks');
    radioBtns.iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    });
    
    //
    $('.summernote').summernote({
        lang: 'zh-CN'
    });
    
    //绑定单选按钮事件
    radioBtns.on('ifChecked',function(event){
    	if($(this).attr('data-name') == 'is_short'){
    		var _val = $(this).attr('data-value');
    		page.is_short = _val;
    		_val == 1 ? $('#jhs_title').hide() : $('#jhs_title').show();
    	}
    });
    $('#abc').on('click',function(){
    	console.log(Information);
    	console.log(equipment);
    });
    </script>
  </body>
</html>
