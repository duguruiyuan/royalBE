<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>信息流推送</title>
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
      .user_push .top_warpper{width:100%;heigth:60px}
      .user_push .top_warpper .img{display:inline-block;vertical-align: top;}
      .user_push .top_warpper .info{display:inline-block;line-height:20px}
      .content-warpper{margin-top:15px;height:auto;overflow:hidden}
      .content-warpper .line{height:30px;line-height:30px;margin-top:10px}
      .content-warpper .line.date-line{height:34px}
      .content-warpper .other{padding-left:20px}
      .date-line .layer-date{vertical-align: top}
      .content-warpper .other .other-line{height:30px;;line-height:30px}
      .content-warpper .other .other-select{padding-left:20px}
      .padding-five{padding:0 5px}
      .hidden{display:none}
      .chamber-info{display:inline-block;padding:0}
      .chamber-info li{display:inline-block;list-style-type: none;margin-left:10px;background:#ccc}
      .chamber-info li:first{padding-left:0}
      .rowa{margin-top:20px;position: relative;min-height:34px;overflow:hidden}
      .rowa .col-md-3{width:60px;padding:0;float:left;height:34px;line-height:34px;position:absolute;left:0;top:0;text-align:right}
      .rowa .col-md-9{margin-left:60px;padding:0 10px 0 0}
      .checkbox.i-checks{display:inline-block}
      .top-number{width:50px;text-align:center}
    </style>
  </head>
  <body>
    <div class="user_push" id="user_push_con">
      <div class="content-warpper">
        <div class="checkbox i-checks" style="display:block" data-name="isDefault" id="isDefault" data-value="0">
          <label class="place-top">
             <input type="checkbox" value=""> <i></i> 默认推送：
          </label>无
        </div>
        <div class="checkbox i-checks" style="display:block" data-name="isAdditional" id="isAdditional" data-value="0">
          <label class="place-top">
           <input type="checkbox" value=""> <i></i> 额外推送
          </label>
        </div>
        <div class="other">
          <div class="radio i-checks" data-value="0" data-name="isAllUser" id="isAllUser">
            <label><input type="radio" value="option1" name="b"> <i></i> 全部用户</label>
	      </div>
	      <div class="radio i-checks" data-value="1" data-name="isPartUser" id="isPartUser">
	        <label><input type="radio" value="option2" name="b"> <i></i> 部分用户</label>
	      </div>
          <div class="other-select">
            <div class="rowa">
              <div class="col-md-3">商会：</div>
              <div class="col-md-9">
                <ul id="chamber_info" class="chamber-info"></ul>
                <button type="button" class="btn btn-w-m btn-success" id="select_chamber">选择商会</button>
              </div>
            </div>

            <div class="rowa">
             <div class="col-md-3">行业：</div>
             <div class="col-md-9">
                 <ul id="position_info" class="chamber-info"></ul>
                 <button type="button" class="btn btn-w-m btn-success" id="select_position">选择行业</button>
             </div>
            </div>

            <div class="other-select-line">
              <div class="rowa">
	              <div class="col-md-3">地区：</div>
	              <div class="col-md-9">
	                  <ul id="region_info" class="chamber-info"></ul>
	                  <button type="button" class="btn btn-w-m btn-success" id="select_region">选择地区</button>
	              </div>
	          </div>
            </div>
            <div class="other-select-line">
              <div class="rowa">
	              <div class="col-md-3">籍贯：</div>
	              <div class="col-md-9">
	                  <ul id="native_info" class="chamber-info"></ul>
	                  <button type="button" class="btn btn-w-m btn-success" id="select_native">选择籍贯</button>
	              </div>
	          </div>
            </div>
            <div class="other-select-line">
              <div class="rowa">
	              <div class="col-md-3">用户组：</div>
	              <div class="col-md-9">
	                  <ul id="users_info" class="chamber-info"></ul>
	                  <button type="button" class="btn btn-w-m btn-success" id="select_users">选择用户组</button>
	              </div>
	          </div>
            </div>
            <div class="other-select-line">
              <div class="rowa">
	              <div class="col-md-3">用户：</div>
	              <div class="col-md-9">
	                  <ul id="user_info" class="chamber-info"></ul>
	                  <button type="button" class="btn btn-w-m btn-success" id="select_user">选择用户</button>
	              </div>
	          </div>
            </div>
            <div class="other-select-line">
              <div class="rowa">
	              <div class="col-md-3">圈子：</div>
	              <div class="col-md-9">
	                  <ul id="circle_info" class="chamber-info"></ul>
	                  <button type="button" class="btn btn-w-m btn-success" id="select_circle">选择圈子</button>
	              </div>
	          </div>
            </div>
          </div>
        </div>
        <div id="move_top" style="display:none">
	        <div class="line date-line">
	          <div class="checkbox i-checks" style="margin:2px 0" data-name="smallTop" id="smallTop" data-value="0">
	            <label class="place-top">
	               <input type="checkbox" value=""> <i></i> 小置顶
	            </label>
	          </div>
	          <input type="text" value="" class="top-number" id="top_number">
	          <span>时间</span>
	          <input placeholder="开始日期" class="form-control layer-date" id="start1">
	          <span class="padding-five">到</span>
	          <input placeholder="结束日期" class="form-control layer-date" id="end1">
	        </div>
	        <div class="line date-line">
	          <div class="checkbox i-checks" style="margin:2px 0" data-name="bigTop" id="bigTop" data-value="0">
	            <label class="place-top">
	             <input type="checkbox" value=""> <i></i> 大置顶
	            </label>
	          </div>
	          <span>时间</span>
	          <input placeholder="开始日期" class="form-control layer-date" id="start2">
	          <span class="padding-five">到</span>
	          <input placeholder="结束日期" class="form-control layer-date" id="end2">
	        </div>
	     </div>
      </div>
      <div class="row" style="display:none;text-align:center;margin:30px 0" id="submit_push_btn">
        <button class="btn btn-info" id="again_info_push">确定推送</button>
      </div>
      <div class="row" style="display:none;text-align:center;margin:30px 0" id="submit_btn_con">
        <button class="btn btn-info" id="submit_btn">确定</button>
      </div>
    </div>
    <script src="<%=basePath%>js/jquery.min.js?v=2.1.4"></script>
    <script src="<%=basePath%>js/bootstrap.min.js?v=3.3.6"></script>
    <script src="<%=basePath%>js/plugins/layer/laydate/laydate.js"></script>
    <script src="<%=basePath%>js/public.js"></script>
    <script src="<%=basePath%>vendor/tree-multi-select/jquery.tree-multiselect.js"></script>
    <script src="<%=basePath%>js/CitySelector.js"></script>
    <script src="<%=basePath%>js/TSelector.js"></script>
    <script src="<%=basePath%>js/plugins/iCheck/icheck.min.js"></script>
    <!-- Bootstrap table -->
	<script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table.min.js"></script>
	<script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table-mobile.min.js"></script>
	<script src="<%=basePath%>js/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
	
	<script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>
	<script src="<%=basePath%>vendor/layer/layer.js"></script>
	<script src="<%=basePath%>js/info_push.js"></script>
  </body>
</html>