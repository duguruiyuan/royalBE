<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>修改榜样</title>
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
              <img id="image_url_dom" src="" width="100" height="100" style="display:none" />
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
            <input id="title" type="text" class="form-control" placeholder="请输入标题">
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
            <textarea id="summary" class="form-control" rows="3"></textarea>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3 text-right">正文：</div>
          <div class="col-md-9">
            <div class="ibox float-e-margins">
              <div class="ibox-content no-padding">
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
          <button id="edit_example" type="button" class="btn btn-info">确定修改</button>
        </div>
        <div class="col-md-1">
          <button id="submit_example" type="button" class="btn btn-info">提交审核</button>
        </div>
        <div class="col-md-1">
          <button type="button" class="btn btn-default">取消</button>
        </div>
      </div>
    </div>
    
    
    <div class="modal inmodal fade" id="myModal5" tabindex="-1" role="dialog"  aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title">选择用户</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                      <div class="col-md-12 input-group">
                        <input class="form-control" type="text"> 
                        <span class="input-group-btn"> 
                          <button type="button" class="btn btn-primary">搜索</button> 
                        </span>
                      </div>
                    </div>
                    <div class="row"></div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
                    <button type="button" class="btn btn-primary">保存</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal inmodal fade" id="selece_example" tabindex="-1" role="dialog"  aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title">榜样人物</h4>
                    <div class="input-group">
                        <input class="form-control" type="text">
                        <span class="input-group-btn">
                          <button type="button" class="btn btn-primary">搜索</button>
                        </span>
                    </div>
                </div>
                <div class="modal-body">
                    
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
                  <button type="button" class="btn btn-primary">确定</button>
                </div>
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
	<script src="<%=basePath%>js/push/set_push.js"></script>
    <script type="text/javascript">
    //信息流推送
    var Information = {
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
    var userInfo = {state: ''};
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
    $('#push_btn').on('click',function(){
    	openLayerWin('<%=basePath%>admin/infopush.shtml?button=true','信息流推送','800px','800px');
    });
    $('#equipment_btn').on('click',function(){
    	openLayerWin('<%=basePath%>admin/equipmentpush.shtml?button=true','设备推送','1000px','800px');
    });
    //alert(GetQueryString('id'));
    var _id = GetQueryString('id');
    $.ajax({
    	url: '<%=basePath%>admin/example/get_example_id.shtml',
    	data: {
    		id: _id,
    	},
    	dataType: 'json',
    	type: 'post',
    	success: function(res){console.log(res);
    		var result = res.date;
    		userInfo.state = result.state;
    		$('#image_url_dom').show().attr('src',result.image);
    		$('#image_address').val(result.image);
    		$('#title').val(result.title);console.log(result.user_name);
    		$('#user_info').html('<li data-v="'+getCommentEscape(result.user_v)+'" data-identity="'+getCommentEscape(result.user_identity)+'" data-avatar="'+getCommentEscape(result.user_avatar)+'" data-type="'+getCommentEscape(result.user_type)+'" data-image="'+getCommentEscape(result.user_image)+'">'+result.user_name+'</li>');
    		$('#summary').val(result.summary);
    		$('.note-editable p').html(result.content);
    		for(var i = 0; i < res.pushdevice.length ;i++){
				if(res.pushdevice[i].is_push_type == 1) setInformation(res.pushdevice[i]);
				if(res.pushdevice[i].is_push_type == 2) setEquipment(res.pushdevice[i]);
			}
    	},
    	error: function(xhr){
    		console.log(xhr);
    	}
    });
    //确定修改
    $('#edit_example').on('click',function(){
    	var _user = $('#user_info li:first-child');
    	$.ajax({
    		url: '<%=basePath%>admin/example/update_example.shtml',
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
        		state: userInfo.state,
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
        		console.log(res);
        		if(res.code == 0){
        			swal({
                        title: "修改成功",
                        type: "success"
                    },function(){
                    	location.reload();
                    });
        		}else{
        			swal({
                        title: "修改失败",
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
    //提交审核
    $('#submit_example').on('click',function(){
    	var _user = $('#user_info li:first-child');
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
        		console.log(res);
        		if(res.code == 0){
        			swal({
                        title: "提交审核成功",
                        type: "success"
                    },function(){
                    	location.reload();
                    });
        		}else{
        			swal({
                        title: "提交审核失败",
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
    //文本编辑器
    $('.summernote').summernote({
        lang: 'zh-CN'
    });
    </script>
  </body>
</html>
