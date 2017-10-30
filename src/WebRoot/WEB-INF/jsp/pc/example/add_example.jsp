<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>新增榜样</title>
    <link rel="<%=basePath%>shortcut icon" href="favicon.ico"> 
    <link href="<%=basePath%>css/bootstrap.min.css" rel="stylesheet">
    <link href="<%=basePath%>css/font-awesome.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/summernote/summernote.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/summernote/summernote-bs3.css" rel="stylesheet">
    <link href="<%=basePath%>css/style.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/iCheck/custom.css" rel="stylesheet">
    <link href="<%=basePath%>css/public.min.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/sweetalert/sweetalert.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <link href="<%=basePath%>vendor/tree-multi-select/jquery.tree-multiselect.css" rel="stylesheet">
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
      #user_info{display:inline-block;padding:0}
      #user_info li{display:inline-block;list-style-type: none;margin-left:10px;background:#f63375;color:#fff;border-radius:4px}
      #user_info li:first{padding-left:0}
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
          <div class="col-md-3 text-right type-line">标题：</div>
          <div class="col-md-9">
            <input type="text" class="form-control" placeholder="请输入标题" id="title">
          </div>
        </div>
        <div class="row">
          <div class="col-md-3 text-right type-line">榜样人物：</div>
          <div class="col-md-9">
            <ul id="user_info"></ul>
            <button class="btn btn-info" type="button" id="select_user"><i class="fa fa-paste"></i> 选择</button>
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
              <div id="summernote_warrep" class="ibox-content no-padding">
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
          <button id="add_example" type="button" class="btn btn-info">提交审核</button>
        </div>
        <div class="col-md-1">
          <button id="draft_example" type="button" class="btn btn-warning">保存草稿</button>
        </div>
        <div class="col-md-1">
          <button type="button" class="btn btn-default">取消</button>
        </div>
      </div>
    </div>
    <script src="<%=basePath%>js/jquery.min.js"></script>
    <script src="<%=basePath%>js/bootstrap.min.js"></script>
    <script src="<%=basePath%>js/plugins/iCheck/icheck.min.js"></script>
    <script src="<%=basePath%>vendor/layer/layer.js"></script>
    <!-- SUMMERNOTE -->
    <script src="<%=basePath%>js/plugins/summernote/summernote.min.js"></script>
    <script src="<%=basePath%>js/plugins/summernote/summernote-zh-CN.js"></script>
    <!-- 选择用户 -->
    <script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table-mobile.min.js"></script>
    <script src="<%=basePath%>js/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
    <script src="<%=basePath%>js/TSelector.js"></script>
    <!-- 上传图片  -->
    <script src="<%=basePath%>js/public.js"></script>
    <script src="<%=basePath%>js/upload_img/plupload.full.min.js"></script>
	<script src="<%=basePath%>js/upload_img/qiniu.js"></script>
	<script src="<%=basePath%>js/upload_img/jhs.js"></script>
	
	<script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>
	<script src="<%=basePath%>js/common.js"></script>
    <script type="text/javascript">
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
    	openLayerWin('<%=basePath%>admin/equipmentpush.shtml','设备推送','1000px','800px');
    });
    //用户
    function setSelectInfo (Dom, data, key) {
	  var key = key || 'name';
	  var arr = [];
      for(var i = 0; i < data.length ; i++){console.log(data[i].type);
    	  arr.push('<li data-id="'+data[i].id+'" data-avatar="'+getCommentStr(data[i].avatar)+'" data-name="'+getCommentStr(data[i].name)+'" data-identity="'+getCommentStr(data[i].identity)+'" data-v="'+getCommentStr(data[i].user_v)+'" data-image="'+getCommentStr(data[i].image)+'" data-type="'+data[i].type+'" data-weight="'+getCommentStr(data[i].weight)+'">'+data[i][key]+'</li>');
      }
      Dom.empty().append(arr.join(''));
    }
    var userSelect = new TSelector({
        headText: '用户选择',
        url: '<%=basePath%>admin/backcommon/find_userlists.shtml',
        uniKey: 'id',
        titleSelectedName:'已选用户',
        titleUnSelectName:'用户列表',
        titleKey:'name',
        headText:'用户选择',
        onConfirm:function(data){
      	  console.log(data);
      	  setSelectInfo($('#user_info'), data);
        }
    });
    $('#select_user').on('click',function(){
  	  userSelect.openSelector();
    });
    //拼接ids
    function getIds(data){
    	var arr = [];
    	for(var i = 0;i < data.length;i++){
    		arr.push(data[i].id);
    	}
    	return arr.join(',');
    }
    //拼接names
    function getNames(data,keyName){
    	var key = keyName || 'name';
    	var arr = [];
    	for(var i = 0;i < data.length;i++){
    		arr.push(data[i][key]);
    	}
    	return arr.join(',');
    }
    
    //新增
    $('#add_example').on('click',function(){
    	var _user = $('#user_info li:first-child');
    	$.ajax({
        	url: '<%=basePath%>admin/example/insert_example.shtml',
        	data: {
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
        		summary: $('#summary').val(),
        		content: $('.note-editable p').html(),
        		//推送
        		obj_type: 8,
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
  			    sb_content: equipment.newsContent,
  			    sb_title: equipment.mobileContent,
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
                    });
        		}else{
        			swal({
                        title: "新增失败",
                        text: res.errMsg,
                        type: "error"
                    });
        		}
        	},
        	error: function(xhr){
        		console.log(xhr);
        	}
        });
    });
    //草稿
    $('#draft_example').on('click',function(){
    	var _user = $('#user_info li:first-child');
    	$.ajax({
        	url: '<%=basePath%>admin/example/insert_example.shtml',
        	data: {
        		image: $('#image_address').val(),
        		title: $('#title').val(),
        		user_id: _user.attr('data-id'),
        		user_type: _user.attr('data-type'),
        		user_image: _user.attr('data-image'),
        		user_avatar: _user.attr('data-avatar'),
        		user_name: _user.attr('data-name'),
        		user_identity: _user.attr('data-identity'),
        		user_v: _user.attr('data-v'),
        		state: 3,
        		summary: $('#summary').val(),
        		content: $('.note-editable p').html(),
        		//推送
        		obj_type: 8,
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
  			    sb_content: equipment.newsContent,
  			    sb_title: equipment.mobileContent,
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
                    });
        		}else{
        			swal({
                        title: "保存草稿失败",
                        text: res.errMsg,
                        type: "error"
                    });
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
    
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    });
    
    //
    $('.summernote').summernote({
        lang: 'zh-CN'
    });
    
    </script>
  </body>
</html>
