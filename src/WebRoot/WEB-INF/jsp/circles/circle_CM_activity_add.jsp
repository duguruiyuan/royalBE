<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>圈子新增-商帮帮后台</title>
    <meta charset="utf-8">
    <%@ include file="../head-meta.jsp"%>
    <%@ include file="../head-link.jsp"%>
    
    <%--CSS库--%>
    <link href="<%=basePath%>css/bootstrap.min.css" rel="stylesheet">
    <%--JS库--%>
    <script src="<%=basePath%>vendor/jQuery/jquery.min.js"></script>
    <script src="<%=basePath%>vendor/bootstrap/js/bootstrap.js"></script>

    <%--公用CSS/js--%>
    <link href="<%=basePath%>css/style.css" rel="stylesheet">
    <script src="<%=basePath%>js/public.js"></script>
    
  
    <link href="<%=basePath%>static/common/extend.css" rel="stylesheet">
    <link href="<%=basePath%>css/cropBox.css" rel="stylesheet">
    <link href="<%=basePath%>vendor/toastr/css/toastr.min.css" rel="stylesheet">
    <link href="<%=basePath%>vendor/froala/css/froala_editor.min.css" rel="stylesheet">
     <link href="<%=basePath%>vendor/froala/css/froala_style.min.css" rel="stylesheet">
    <link href="<%=basePath%>vendor/froala/css/froala_plugins.min.css" rel="stylesheet">
 
    <style>
    	.pagination-detail {
    		display:none;
    	}
    </style>
  </head>
  <body class="gray-bg">
     <div class="wrapper wrapper-content animated fadeInRight">
	 <div class="row">
            <div class="col-sm-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h3>圈子管理 > 全部 > 内容管理 > 活动 > 新增</h3>
                    </div>
                    <div class="ibox-content">
                        <form id="activityForm" class="form-horizontal">
            
                            <div class="form-group">
                                <label class="col-sm-2 control-label">标题</label>
                             <div class="col-xs-10 col-md-8">  
                                    <input id="title" name="title" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">圈子</label>
                                  <div class="col-xs-10 col-md-8"> 
                                    <input id="circlesList" onclick="circlesSelect()" type="text" readonly placeholder="点击选择圈子" class="form-control">
                                </div>
                            </div>
                 
                            <div class="hr-line-dashed"></div>
                            <div class="form-group" >
                                 <label class="col-sm-2 control-label">开始时间</label>
                                 <div class="col-xs-4 col-md-3">  
                                 	<input placeholder="开始日期" style="max-width:none !important" readonly class="form-control layer-date" id="startTime" name="startTime">
                                 </div>
                                 <label class="col-sm-2 control-label">结束时间</label>
                                 <div class="col-xs-4 col-md-3"> 
                                     <input placeholder="结束日期" style="max-width:none !important" readonly class="form-control layer-date" id="endTime" name="endTime">
                                 </div>
                           	</div>
                            <div class="hr-line-dashed"></div>
                               <div class="form-group">
                                <label class="col-sm-2 control-label">地点</label>
                                <div class="col-xs-10 col-md-8"> 
                                    <input id="place"name="place" type="text" class="form-control">
                                </div>
                            </div>
                       		<div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">分享嘉宾</label>
                                <div class="col-xs-10 col-md-8"> 
                                    <table id="circlesGuestList"></table>
                                     <button class="btn btn-primary mg-t-10" style="float:right" type="button" onclick="openGuestAdd()">添加嘉宾</button>
                                      <button class="btn btn-success mg-t-10 mg-r-20" style="float:right" type="button" onclick="openGuestSelector()">选择用户</button>                  
                                </div>
                            </div>
           
              				<div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">活动介绍</label>
                                <div class="col-xs-10 col-md-8">      
                                    <div id="editorContainer">
							    	</div>                   
                                </div>
                            </div>
       						<div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">视频直播地址</label>
                                <div class="col-xs-10 col-md-8"> 
                                    <input id="vedioLink" type="text" class="form-control">
                                </div>
                            </div>
                         		<div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">相关报导</label>
                         	   <div class="col-xs-10 col-md-8"> 
                                    <table id="relationArtList"></table>  
                                    <button class="btn btn-primary mg-t-10" style="float:right" type="button" onclick="openArtAdd()">添加站外文章</button>

                                    <button class="btn btn-success mg-t-10 mg-r-20" style="float:right" type="button" onclick="openArtSelector()">添加站内文章</button>
                               </div>
                            </div>
                         		<div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">精彩内容</label>
                 				<div class="col-xs-10 col-md-8"> 
                                    <table id="goodArtList"></table>
                                    <button class="btn btn-primary mg-t-10" style="float:right" type="button" onclick="openAddGoodModal()">添加精彩内容</button>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <div class="col-sm-4 col-sm-offset-2">
                                    <button class="btn btn-primary" type="button" onclick="postForm(this,2)">提交审核</button>
                                    <button class="btn btn-warning" type="button" onclick="postForm(this,3)">保存草稿</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
	    </div>
	    
	     
	    <div id="addGuestModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
          <div class="modal-dialog">
          <div class="modal-content">
	          <div class="modal-header center">
	          <h4 class="modal-title" style="text-align: center">添加嘉宾</h4>
	          </div>
	          <div class="modal-body table-modal-body">
	               <form id="addGuestForm" class="form-horizontal">
			    		<div class="form-group">
			                 <label class="col-sm-2 control-label">姓名</label>
			                 <div class="col-sm-10">
			                     <input id="guestName" name="guestName" type="text" class="form-control">
			                 </div>
			             </div>
			           	<div class="form-group">
			                 <label class="col-sm-2 control-label">单位</label>
			                 <div class="col-sm-10">
			                     <input id="guestCompany" name="guestCompany" type="text" class="form-control">
			                 </div>
			             </div>
			             	<div class="form-group">
			                 <label class="col-sm-2 control-label">职务</label>
			                 <div class="col-sm-10">
			                     <input id="guestPosition" name="guestPosition"  type="text" class="form-control">
			                 </div>
			             </div>
	                </form>
	          </div>
	          <div class="modal-footer">
	          <button type="button" class="btn button button-rounded" data-dismiss="modal">关闭</button>
	          <button type="button" class="btn btn-primary button button-rounded" onclick="sendGuestAdd(this)">确定</button>
	          </div>
          </div>
          </div>
                   </div> 
          
          <div id="addOutArtModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
         	 <div class="modal-dialog">
          		<div class="modal-content">
			          <div class="modal-header center">
			          <h4 class="modal-title" style="text-align: center">添加文章</h4>
			          </div>
			          <div class="modal-body table-modal-body">
			               <form id="addOutArtForm" class="form-horizontal">   
					           	<div class="form-group">
					                 <label class="col-sm-2 control-label">标题</label>
					                 <div class="col-sm-10">
					                     <input id="outArtTitle" name="outArtTitle" type="text" class="form-control">
					                 </div>
					             </div>
					             	<div class="form-group">
					                 <label class="col-sm-2 control-label">链接</label>
					                 <div class="col-sm-10">
					                     <input id="outArtLink" name="outArtLink"  type="text" class="form-control">
					                 </div>
					             </div>
			                </form>
			          </div>
			          <div class="modal-footer">
			          <button type="button" class="btn button button-rounded" data-dismiss="modal">关闭</button>
			          <button type="button" class="btn btn-primary button button-rounded" onclick="insertArtAdd()">确定</button>
			          </div>
        					
          </div>	
          </div>
          </div>
          
          
          
          <div id="addGoodModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
          <div class="modal-dialog modal-lg">
          <div class="modal-content">
          <div class="modal-header center">
          <h4 class="modal-title" style="text-align: center">添加精彩内容</h4>
          </div>
          <div class="modal-body table-modal-body">
              <div id="editorGoodContainer">
	    	</div>
          </div>
          <div class="modal-footer">
          <button type="button" class="btn button button-rounded" data-dismiss="modal">关闭</button>
          <button type="button" class="btn btn-primary button button-rounded" onclick="insertAddGood()">确定</button>
          </div>
          </div>
          </div>
	    </div>
  </body>  
    <%--表单控件--%>
    <link href="<%=basePath%>css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table-mobile.min.js"></script>
    <script src="<%=basePath%>js/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
    <%--弹窗控件--%>
    <link href="<%=basePath%>css/plugins/sweetalert/sweetalert.css" rel="stylesheet">
    <script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>

    <%--页面js文件--%>
    
    <!-- 自定义js -->
    <script src="<%=basePath%>js/global.js"></script>
	<script src="<%=basePath%>js/moduelMenu.js" type="text/javascript"></script>
    <script src="<%=basePath%>vendor/metisMenu/jquery.metisMenu.js"></script>
    <script src="<%=basePath%>vendor/slimscroll/jquery.slimscroll.min.js"></script>
    <script src="<%=basePath%>js/main.js"></script>
    <script src="<%=basePath%>js/contabs.js" type="text/javascript"></script>
	<script src="<%=basePath%>vendor/pace/pace.min.js"></script>
    <script src="<%=basePath%>vendor/toastr/js/toastr.min.js"></script>
    
     <script src="<%=basePath%>vendor/froala/froala_editor.min.js"></script>
     <script src="<%=basePath%>vendor/froala/froala_plugins.min.js"></script>
     <script src="<%=basePath%>vendor/froala/froala_zh_cn.js"></script>                      
    <script src="<%=basePath%>vendor/layer/laydate/laydate.js"></script>
    <script src="<%=basePath%>vendor/validate/jquery.validate.min.js"></script>
    <script src="<%=basePath%>vendor/validate/messages_zh.min.js"></script>
        <%--时间转换控件--%>
	<script src="<%=basePath%>static/lib/moment/moment.min.js"></script>
    <script src="<%=basePath%>js/updateValidate.js"></script>
	<script src="<%=basePath%>js/common.js"></script>
    <script src="<%=basePath%>static/common/tSelector.js"></script>
     <script src="<%=basePath%>js/ArticleSelector.js"></script>
	<script src="<%=basePath%>js/circles/circleCMActivityAdd.js"></script>
</html>
