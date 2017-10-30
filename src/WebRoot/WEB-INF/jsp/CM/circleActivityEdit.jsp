<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>圈子内容管理-商帮帮后台</title>
    <meta charset="utf-8">
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/staticInclude.jsp"%>
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
                 <!-- <div class="ibox float-e-margins"> -->
                <div class="float-e-margins">
                    <div class="ibox-title">
                        <h3>内容管理 > 圈子活动 > 修改</h3>
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
                                    <input id="circlesList" onclick="page.circlesSelector.openSelector()" type="text" readonly placeholder="点击选择圈子" class="form-control">
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
                                    <table id="guestList"></table>
                                     <button class="btn btn-primary m-t-sm pull-right" type="button" onclick="page.eventHandler.openGuestAdd()">添加嘉宾</button>
                                      <button class="btn btn-success m-t-sm m-r-xs pull-right" type="button" onclick="page.eventHandler.openGuestSelector()">选择用户</button>                  
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
                                    <button class="btn btn-primary m-t-sm pull-right" type="button" onclick="openArtAdd()">添加站外文章</button>

                                    <button class="btn btn-success m-t-sm m-r-xs pull-right" type="button" onclick="openArtSelector()">添加站内文章</button>
                               </div>
                            </div>
                         		<div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">精彩内容</label>
                 				<div class="col-xs-10 col-md-8"> 
                                    <table id="goodArtList"></table>
                                    <button class="btn btn-primary m-t-sm pull-right" type="button" onclick="openAddGoodModal()">添加精彩内容</button>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <div class="col-sm-4 col-sm-offset-2">
                                    <button class="btn btn-primary" type="button" onclick="postForm(this)">保存</button>
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
	          <button type="button" class="btn btn-primary button button-rounded" onclick="page.eventHandler.sendGuestAdd(this)">确定</button>
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
    <link href="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
    <%--弹窗控件--%>
    <link href="<%=basePath%>static/lib/sweetalert/sweetalert.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/sweetalert/sweetalert.min.js"></script>
    <%--toastr提示控件--%>
    <link href="<%=basePath%>static/lib/toastr/css/toastr.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/toastr/js/toastr.min.js"></script>
    <script src="<%=basePath%>static/lib/toastr/customOptions.js"></script>
  	<%--上传对接七牛--%>
    <script src="<%=basePath%>static/common/helper.qiniu.js"></script>
    <%--富文本编辑器组件summernote--%>
    <link href="<%=basePath%>static/lib/summernote/summernote.css" rel="stylesheet">
    <link href="<%=basePath%>static/lib/summernote/summernote-bs3.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/summernote/summernote.min.js"></script>
    <script src="<%=basePath%>static/lib/summernote/summernote-zh-CN.js"></script>
    <%--富文本编辑器对接七牛--%>
    <script src="<%=basePath%>static/lib/summernote/summernote-qiniu.js"></script>
	    <%--日期选择控件--%>
    <script src="<%=basePath%>static/lib/layer/laydate/laydate.js"></script>
     <%--时间转换控件--%>
	<script src="<%=basePath%>static/lib/moment/moment.min.js"></script>
        <%--表单验证控件--%>
    <script src="<%=basePath%>static/lib/bootstrapValidator/bootstrapValidator.min.js"></script>
    <%--页面css及js文件--%>	
    
    <script>var pageId = ${paramMap.page_id}</script>
    <script src="<%=basePath%>static/common/tSelector.js"></script>
    <script src="<%=basePath%>static/common/articleSelector.js"></script>
	<script src="<%=basePath%>static/page/CM/circleActivityEdit.js"></script>
</html>
