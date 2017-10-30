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
    <link href="<%=basePath%>css/style.css" rel="stylesheet">
    <link href="<%=basePath%>css/bootstrap.min.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/iCheck/custom.css" rel="stylesheet">
    <link href="<%=basePath%>vendor/tree-multi-select/jquery.tree-multiselect.css" rel="stylesheet">
    <style type="text/css">
      .row{margin-top:15px}
      .chamber-info{margin-bottom:0}
      .text-align{text-align:right}
      .chamber-info{display:inline-block;padding:0}
      .chamber-info li{display:inline-block;list-style-type: none;margin-left:10px;background:#ccc;border-radius:4px}
      .chamber-info li:first{padding-left:0}
    </style>
  </head>
  <body>
    <div class="user_push" id="user_push_con">
      <div class="row">
        <div class="col-xs-3 text-align">手机通知栏内容</div>
        <div class="col-xs-9">
          <textarea rows="3" class="form-control" id="mobileContent"></textarea>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3 text-align">消息内容</div>
        <div class="col-xs-9">
          <textarea rows="3" class="form-control" id="newsContent"></textarea>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3 text-align">提醒对象</div>
        <div class="col-xs-9">
          <div class="row" id="reminderObject">
            <div class="radio i-checks" data-value="2" data-name="reminderObject">
              <label><input type="radio" value="option1" name="b"> <i></i> 不提醒</label>
	        </div>
            <div class="radio i-checks" data-value="1" data-name="reminderObject">
              <label><input type="radio" value="option1" name="b"> <i></i> 全部用户</label>
	        </div>
	        <div class="radio i-checks" data-value="0" data-name="reminderObject">
	          <label><input type="radio" value="option2" name="b"> <i></i> 部分用户</label>
	        </div>
          </div>
          <div class="row">
            <div class="row">
              <div class="col-xs-3 text-align">商会：</div>
              <div class="col-xs-9">
                <ul id="chamber_info" class="chamber-info"></ul>
                <button type="button" class="btn btn-w-m btn-success" id="select_chamber">选择商会</button>
              </div>
            </div>
            <div class="row">
             <div class="col-xs-3 text-align">行业：</div>
             <div class="col-xs-9">
                 <ul id="position_info" class="chamber-info"></ul>
                 <button type="button" class="btn btn-w-m btn-success" id="select_position">选择行业</button>
             </div>
            </div>
            <div class="row">
              <div class="col-xs-3 text-align">地区：</div>
              <div class="col-xs-9">
                  <ul id="region_info" class="chamber-info"></ul>
                  <button type="button" class="btn btn-w-m btn-success" id="select_region">选择地区</button>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-3 text-align">籍贯：</div>
              <div class="col-xs-9">
                  <ul id="native_info" class="chamber-info"></ul>
                  <button type="button" class="btn btn-w-m btn-success" id="select_native">选择籍贯</button>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-3 text-align">用户组：</div>
              <div class="col-xs-9">
                  <ul id="users_info" class="chamber-info"></ul>
                  <button type="button" class="btn btn-w-m btn-success" id="select_users">选择用户组</button>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-3 text-align">用户：</div>
              <div class="col-xs-9">
                  <ul id="user_info" class="chamber-info"></ul>
                  <button type="button" class="btn btn-w-m btn-success" id="select_user">选择用户</button>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-3 text-align">圈子：</div>
              <div class="col-xs-9">
                  <ul id="circle_info" class="chamber-info"></ul>
                  <button type="button" class="btn btn-w-m btn-success" id="select_circle">选择圈子</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row" style="text-align:center;margin:30px 0">
        <button class="btn btn-info" id="submit_btn">确定</button>
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
    
	<script src="<%=basePath%>js/equipment_push.js"></script>
  </body>
</html>