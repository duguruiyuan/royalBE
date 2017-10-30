<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>新增密文</title>
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
          <div class="col-md-3 text-right type-line">类型：</div>
          <div class="col-md-9" id="is_length">
            <input type="hidden" id="length_type" value="0">
            <div class="radio i-checks" data-value="0" data-name="is_length">
              <label><input type="radio" checked="" value="option1" name="a"> <i></i> 短文</label>
            </div>
            <div class="radio i-checks" data-value="1" data-name="is_length">
              <label><input type="radio" value="option2" name="a"> <i></i> 长文</label>
            </div>
          </div>
        </div>
        <div class="row" id="ciphertext_title" style="display:none">
          <div class="col-md-3 text-right type-line">标题：</div>
          <div class="col-md-9">
            <input type="text" id="title" class="form-control" placeholder="请输入标题">
          </div>
        </div>
        <div class="row">
          <div class="col-md-3 text-right type-line">是否证实：</div>
          <div class="col-md-9" id="is_real">
            <input type="hidden" id="real_type" value="0">
            <div class="radio i-checks" data-value="0" data-name="is_type">
              <label><input type="radio" checked="" value="option1" name="b"> <i></i> 否</label>
            </div>
            <div class="radio i-checks" data-value="1" data-name="is_type">
              <label><input type="radio" value="option2" name="b"> <i></i> 是</label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3 text-right select-line">匿名主题：</div>
          <div class="col-md-9">
            <select class="form-control" id="anonymous_theme"></select>
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
          <button type="button" class="btn btn-info" id="submit_examine">提交审核</button>
        </div>
        <div class="col-md-1">
          <button type="button" class="btn btn-warning" id="submit_draft">保存草稿</button>
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
    <script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>
    <script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>
    <!-- 推送 -->
    <script src="<%=basePath%>vendor/layer/layer.js"></script>
    <script src="<%=basePath%>js/common.js"></script>
    <script type="text/javascript">
    var page = {
    		type: 0,
    		is_length: 0
    };
    //信息流推送
    var Information = {
    		isDefault: true ,//是否默认推送
    		isAdditional: false,//是否额外推送
    		isAllUser: 2,//1全部用户，0部分用户,2不提示
    		shangHui: [],//商会
    		hangYe: [],//行业
    		diQu: [],////地区
    		jiGuan: [],//籍贯
    		yongHuZu: [],//用户组
    		yongHu: [],//用户
    		quanZi: [],//圈子
    		smallTop: {//小置顶
    			select: false,
    			sortNum: '',
    			startTime: '',
    			endTime: ''
    		},
    		bigTop: {//大置顶
    			select: false,
    			startTime: '',
    			endTime: ''
    		}
    };
    //设备推送
    var equipment = {
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
    //匿名主题
    $.ajax({
    	url: '<%=basePath%>admin/anonymous/find_anonymousdictlists.shtml',
    	type: 'post',
		dataType: 'json',
		success: function(res){
			if(res.code == 0){
				var result = res.data;
				var arr = ['<option>请选择</option>'];
				for(var i = 0; i < result.length; i++){
					arr.push('<option value="'+result[i].code+'">'+result[i].name+'</option>');
				}
				$('#anonymous_theme').empty().append(arr.join(''));
			}else{
				alert('错误');
			}
		},
		error: function(xhr){
			console.log(xhr);
		}
    });
    //提交审核
    $('#submit_examine').on('click',function(){
    	$.ajax({
    		url: '<%=basePath%>admin/secretNews/add_secretnews.shtml',
    		data: {
    			state: 2,
    			is_length: page.is_length,
    			title: $('#title').val(),
    			type: page.type,
    			anonymous_type: $('#anonymous_theme').val(),
    			summary: $('#summary').val(),
    			content: $('#content .note-editable p').text(),
    			//推送
        		obj_type: 2,
        		is_default: Information.isDefault ? 1 : 0,
        		is_extra_push: Information.isAdditional ? 1 : 0,
  			    all_user: Information.isAllUser ? 1 : 0,
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
  			    small_top: Information.smallTop.select ? 1 : 0,
  			    display_position: Information.smallTop.sortNum,
  			    small_start_time: getValueTime(Information.smallTop.startTime),
  			    small_end_time: getValueTime(Information.smallTop.endTime),
  			    big_top: Information.bigTop.select ? 1 : 0,
  			    big_start_time: getValueTime(Information.bigTop.startTime),
  			    big_end_time: getValueTime(Information.bigTop.endTime),
  			    //设备
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
                        title: "新增成功",
                        type: "success"
                    },function(){
                    	//location.reload();
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
    //保存草稿
    $('#submit_draft').on('click',function(){
    	$.ajax({
    		url: '<%=basePath%>admin/secretNews/add_secretnews.shtml',
    		data: {
    			state: 3,
    			is_length: page.is_length,
    			title: $('#title').val(),
    			type: page.type,
    			anonymous_type: $('#anonymous_theme').val(),
    			summary: $('#summary').val(),
    			content: $('#content .note-editable p').text(),
    			//推送
        		obj_type: 2,
        		is_default: Information.isDefault ? 1 : 0,
        		is_extra_push: Information.isAdditional ? 1 : 0,
  			    all_user: Information.isAllUser ? 1 : 0,
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
  			    //type: Information.isDefault ? 1 : 2,
  			    small_top: Information.smallTop.select ? 1 : 0,
  			    display_position: Information.smallTop.sortNum,
  			    small_start_time: getValueTime(Information.smallTop.startTime),
  			    small_end_time: getValueTime(Information.smallTop.endTime),
  			    big_top: Information.bigTop.select ? 1 : 0,
  			    big_start_time: getValueTime(Information.bigTop.startTime),
  			    big_end_time: getValueTime(Information.bigTop.endTime),
  			    //设备
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
                        title: "保存草稿成功",
                        type: "success"
                    },function(){
                    	//location.reload();
                    });
        		}else{
        			swal('保存草稿失败',res.errMsg,'error');
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
    		var _val = $(this).attr('data-value'),ciphertext_title = $('#ciphertext_title');
    		page.is_length = _val;
    		_val == 0 ? ciphertext_title.hide() :  ciphertext_title.show()
    	}
    	if($(this).attr('data-name') == 'is_type'){
    		page.type = $(this).attr('data-value');
    	}
    });
    </script>
  </body>
</html>
