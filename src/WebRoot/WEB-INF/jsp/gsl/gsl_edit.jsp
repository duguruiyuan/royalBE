<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>修改密文</title>
    <link rel="shortcut icon" href="favicon.ico"> 
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
      .i-checks{display:inline-block}
      .radio label{padding: 0 15px 0 0}
    </style>
  </head>
  
  <body>
    <div class="h-auto mb25">
      <div class="h-auto">
        <div class="row">
          <div class="col-md-3 text-right type-line">标题：</div>
          <div class="col-md-9">
            <input type="hidden" id="state">
            <input type="text" id="title" class="form-control" placeholder="请输入标题">
          </div>
        </div>
        <div class="row">
          <div class="col-md-3 text-right">导语：</div>
          <div class="col-md-9">
            <textarea id="summary" class="form-control" rows="3"></textarea>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3 text-right">正文：</div>
          <div class="col-md-9">
            <div class="ibox float-e-margins">
              <div class="ibox-content no-padding" id="content">
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
          <button type="button" class="btn btn-info" id="submit_examine">确定提交</button>
        </div>
        <div class="col-md-1">
          <button type="button" class="btn btn-default">取消</button>
        </div>
      </div>
    </div>
   
    <script src="<%=basePath%>js/public.js"></script>
    <script src="<%=basePath%>js/jquery.min.js"></script>
    <script src="<%=basePath%>js/bootstrap.min.js"></script>
    <script src="<%=basePath%>js/plugins/iCheck/icheck.min.js"></script>
    <!-- SUMMERNOTE -->
    <script src="<%=basePath%>js/plugins/summernote/summernote.min.js"></script>
    <script src="<%=basePath%>js/plugins/summernote/summernote-zh-CN.js"></script>
    
    
    <script src="<%=basePath%>js/public.js"></script>
	<script src="<%=basePath%>vendor/layer/layer.js"></script>
    <script src="<%=basePath%>js/common.js"></script>
    <script src="<%=basePath%>js/address.js"></script>
    <script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>
    <script type="text/javascript">
    //信息流推送
    var Information = {
    		feed_id: '',//大置顶id
        	feed_info_id: '',//小置顶id
    		isDefault: false ,//是否默认推送
    		isAdditional: false,//是否额外推送
    		isAllUser: true,//true全部用户，false部分用户
    		shangHui: [],//商会
    		hangYe: [],//行业
    		diQu: [],////地区
    		jiGuan: [],//籍贯
    		yongHuZu: [],//用户组
    		yongHu: [],//用户
    		quanZi: [],//圈子
    		smallTop: {//小置顶
    			id: '',
    			select: false,
    			sortNum: '',
    			startTime: '',
    			endTime: ''
    		},
    		bigTop: {//大置顶
    			id: '',
    			select: false,
    			startTime: '',
    			endTime: ''
    		}
    };
    //设备推送
    var equipment = {
    		id: '',//设备ID
    		mobileContent: '' ,//手机通知栏内容
    		newsContent: '',//消息内容
    		reminderObject: 2,//提醒对象
    		shangHui: [],//商会
    		hangYe: [],//行业
    		diQu: [],////地区
    		jiGuan: [],//籍贯
    		yongHuZu: [],//用户组
    		yongHu: [],//用户
    		quanZi: []//圈子
    };
    $('#push_btn').on('click',function(){
    	openLayerWin('<%=basePath%>admin/infopush.shtml?button=true','信息流推送','800px','800px');
    });
    $('#equipment_btn').on('click',function(){
    	openLayerWin('<%=basePath%>admin/equipmentpush.shtml?button=true','设备推送','1000px','800px');
    });
    var _id = GetQueryString('id');
    //编辑
    if(!!_id){
    	$.ajax({
    		url: '<%=basePath%>admin/gsl/find_gsl_detail.shtml',
    		data: {
    			id: _id
    		},
    		type: 'post',
    		dataType: 'json',
    		success: function(res){
    			if(res.code == 0){
    				var result = res.data;
    				$('#title').val(result.title);
    				$('#summary').val(result.summary);
    				$('#state').val(result.state);
    				$('#content .note-editable p').html(result.content);
    				var pushdriver = res.pushdevice;
    				console.log(pushdriver);
    				$('#feed_id').val(pushdriver[0].feed_id);
    				$('#feed_info_id').val(pushdriver[0].id);
    				for(var i = 0; i < res.pushdevice.length ;i++){
    					if(res.pushdevice[i].is_push_type == 1) setInformation(res.pushdevice[i]);
    					if(res.pushdevice[i].is_push_type == 2) setEquipment(res.pushdevice[i]);
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
    	alert('非法操作');
    	history.back();
    }
    //提交修改
    $('#submit_examine').on('click',function(){
    	if(!checkdata())
    		return;
    	$.ajax({
    		url: '<%=basePath%>admin/gsl/update_gsl.shtml',
    		data: {
    			id: _id,
    			obj_id: _id,
    			title: $('#title').val(),
    			summary: $('#summary').val(),
    			state :$('#state').val(),
    			content: $('#content .note-editable p').text(),
    			//推送
    			feed_id: Information.feed_id,
    			feed_info_id: Information.feed_info_id,
        		obj_type: 9,
        		is_default: Information.isDefault ? 0 : 1,
        		is_extra_push: Information.isAdditional ? 0 : 1,
  			    all_user: Information.isAllUser ? 0 : 1,
  			    sh_ids: getIds(Information.shangHui),
  			    sh_names: getNames(Information.shangHui),
  			    industry_ids: getIds(Information.hangYe),
  			    industry_names: getNames(Information.hangYe,'NAME'),
  			    region_ids: '',
  			    region_names: Information.diQu.join(','),
  			    nativeplace_ids: '',
  			    nativeplace_names: Information.jiGuan.join(','),
  			    usergroup_ids: getIds(Information.yongHuZu),
  			    usergroup_names: getNames(Information.yongHuZu),
  			    user_ids: getIds(Information.yongHu),
  			    user_names: getNames(Information.yongHu),
  			    circle_ids: getIds(Information.quanZi),
  			    circle_names: getNames(Information.quanZi),
  			    //小置顶
  			    small_id: Information.smallTop.id,
          		small_top: Information.smallTop.select ? 1 : 0,
  			    display_position: Information.smallTop.sortNum,
  			    small_start_time: getValueTime(Information.smallTop.startTime),
  			    small_end_time: getValueTime(Information.smallTop.endTime),
  			    //大置顶
  			    big_id: Information.bigTop.id,
          		big_top: Information.bigTop.select ? 1 : 0,
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
			    sb_region_names: equipment.diQu.join(','),
			    sb_nativeplace_ids: '',
			    sb_nativeplace_names: equipment.jiGuan.join(','),
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
                    	//location.reload();
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
    //单选按钮
    radioBtns.iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    });
    //编辑器
    $('.summernote').summernote({
        lang: 'zh-CN'
    });
    //绑定单选按钮事件
    var is_length = $('#length_type');
    var real_type = $('#real_type');
    radioBtns.on('ifChecked',function(event){
    	if($(this).attr('data-name') == 'is_length'){
    		is_length.val($(this).attr('data-value'));
    	}
    	if($(this).attr('data-name') == 'is_type'){
    		real_type.val($(this).attr('data-value'));
    	}
    });
    //信息流
    function setInformation(data){
    	Information.feed_id = data.feed_id;
    	Information.feed_info_id = data.id;
    	Information.isDefault = data.is_default == 1 ? true : false;
    	Information.isAdditional = data.is_extra_push == 1 ? true : false;
        Information.isAllUser = data.all_user == 1 ? true : false;
        setSelectObj(Information.shangHui,data.sh_names,data.sh_ids,0);
        setSelectObj(Information.hangYe,data.industry_names,data.industry_ids,1);
        if(data.region_names!=undefined)
        	Information.diQu = data.region_names.split(',');
        if(data.nativeplace_names!=undefined)
        Information.jiGuan = data.nativeplace_names.split(',');
        setSelectObj(Information.yongHuZu,data.usergroup_names,data.usergroup_ids,0);
        setSelectObj(Information.yongHu,data.user_names,data.user_ids,0);
        setSelectObj(Information.quanZi,data.circle_names,data.circle_ids,0);
        
        Information.smallTop.select = data.small_top == 1 ? true : false;
        Information.bigTop.select = data.big_top == 1 ? true : false;
        //小置顶
        if(data.small_top == 1){
            Information.smallTop.id = data.feedTmpList[1].id;
    		Information.smallTop.sortNum = getCommentStr(data.feedTmpList[1].display_position);
    		Information.smallTop.startTime = getCommentStr(formatDate(data.feedTmpList[1].start_time));
    		Information.smallTop.endTime = getCommentStr(formatDate(data.feedTmpList[1].end_time));
        }
		//大置顶
		if(data.big_top == 1){
			Information.bigTop.id = data.feedTmpList[0].id;
			Information.bigTop.startTime = getCommentStr(formatDate(data.feedTmpList[0].start_time));
			Information.bigTop.endTime = getCommentStr(formatDate(data.feedTmpList[0].end_time));
		}
    }
    //设备
    function setEquipment (data) {
    	equipment.id = data.id;
    	equipment.mobileContent = data.content;
    	equipment.newsContent = data.title;
    	equipment.reminderObject = data.all_user;
    	setSelectObj(equipment.shangHui,data.sh_names,data.sh_ids,0);
        setSelectObj(equipment.hangYe,data.industry_names,data.industry_ids,1);
        if(data.region_names!=undefined)
        equipment.diQu = data.region_names.split(',');
        if(data.nativeplace_names!=undefined)
        equipment.jiGuan = data.nativeplace_names.split(',');
        setSelectObj(equipment.yongHuZu,data.usergroup_names,data.usergroup_ids,0);
        setSelectObj(equipment.yongHu,data.user_names,data.user_ids,0);
        setSelectObj(equipment.quanZi,data.circle_names,data.circle_ids,0);
    }
    //
    function setSelectObj (obj,dataName,dataId,type) {
    	if(!dataName) return;
    	switch(type){
    	    case 0:
    	    	var _ids = dataId.split(','),_names = dataName.split(','); 
    	    	for(var i = 0; i < _ids.length; i++){
    	    		obj.push({
    	    			id: _ids[i],
    	    			name: _names[i]
    	    		});
    	    	}
    	        break;
    	    case 1:
    	    	var _ids = dataId.split(','),_names = dataName.split(',');
    	    	for(var i = 0; i < _ids.length; i++){
    	    		obj.push({
    	    			id: _ids[i],
    	    			NAME: _names[i]
    	    		});
    	    	}
    	        break;
    	    default: return '';
    	}
    	
    }    
    //验证
    function checkdata(){
    	var title =$('#title').val();
    	var summary =$('#summary').val();
    	var big_top=Information.bigTop.select ? 1 : 0;
    	var small_top=Information.smallTop.select ? 1 : 0;
    	if(title==""){
    		$('#title').focus();
    		swal('保存失败','标题不能为空','error');
    		return false;
    	}
    	if(summary==""){
    		$('#summary').focus();
    		swal('保存失败','导语不能为空','error');
    		return false;
    	}
    	if(big_top==1){
      		var big_start_time= getValueTime(Information.bigTop.startTime);
      		var big_end_time=getValueTime(Information.bigTop.endTime);
      		if(big_start_time==''||big_end_time==''){
    			swal('保存失败','请输入大置顶时间','error');
        		return false;
      		}
    	}
    	if(small_top==1){
    		var display_position=Information.smallTop.sortNum;
      		var small_start_time=getValueTime(Information.smallTop.startTime);
      		var small_end_time=getValueTime(Information.smallTop.endTime);
      		if(display_position==''||small_start_time==''||small_end_time==''){
    			swal('保存失败','请填写完整小置顶信息','error');
        		return false;
      		}
    	}
    	return true;
    }
    </script>
  </body>
</html>
