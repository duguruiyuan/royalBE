<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>圈子新增-商帮帮后台</title>
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
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h3>圈子管理 > 内容管理 > 话题 > 编辑</h3>
                    </div>
                    <div class="ibox-content">
                        <form id="pageForm" class="form-horizontal bars">
            
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
                                    <input id="circles" name="circles" onclick="page.circlesSelector.openSelector()" type="text" readonly placeholder="点击选择" class="form-control">
                                </div>
                            </div>   
                             <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">相关链接</label>
                                  <div class="col-xs-10 col-md-8"> 
                                    <input id="relatedLink" name="relatedLink" data-toggle="modal" data-target="#addRelatedLinkModal" type="text" readonly placeholder="点击添加" class="form-control">
                                </div>
                            </div>  
                          	<div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">话题简述</label>
                                <div class="col-xs-10 col-md-8">      
                                    <div id="briefEditor">
							    	</div>                   
                                </div>
                            </div>
                           	<div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">受邀人</label>
                                <div class="col-xs-10 col-md-8"> 
                                    <table id="guestTable"></table>
                                    <button class="btn btn-primary" style="float:right;margin-top:5px" type="button" onclick="page.eventHandler._guest.openAdd()">添加嘉宾</button>
                                    <button class="btn btn-success" style="float:right;margin-right:5px;margin-top:5px" type="button" onclick="page.eventHandler._guest.openSelect()">选择用户</button>                  
                                </div>
                            </div>   
                           <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">相关新闻</label>
                         	   <div class="col-xs-10 col-md-8"> 
                                    <table id="relatedNewsTable"></table>  
                                    <button class="btn btn-primary" style="float:right;margin-top:5px" type="button" onclick="page.eventHandler._relatedNews.openAdd()">添加站外文章</button>
                                    <button class="btn btn-success" style="float:right;margin-right:5px;margin-top:5px" type="button" onclick="page.articleSelector.openSelector(1)">添加站内文章</button>
                               </div>
                            </div>          
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <div class="col-sm-4 col-sm-offset-2">
                                    <button class="btn btn-primary" type="button" onclick="page.eventHandler.post(this)">保存</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
	    </div>
	    
	    <div id="addRelatedLinkModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
          <div class="modal-dialog modal-lg">
          <div class="modal-content">
	          <div class="modal-header center">
	          <h4 class="modal-title" style="text-align: center">相关链接</h4>
	          </div>
	          <div class="modal-body table-modal-body">
	               <form id="addRelatedLinkForm" class="form-horizontal">
			    		<!--<div class="form-group">
			      			<button type="button" class="btn button button-rounded" onclick="page.eventHandler._relatedLink.checkType(this,0)">站内文章</button>
			      			<button type="button" class="btn button button-rounded" onclick="page.eventHandler._relatedLink.checkType(this,1)">站外文章</button>
			             </div>  -->
	                  <div class="form-group">
                     
                        <div class="col-sm-8 col-offset-4">
                            <label for="radType1" class="radio i-checks radio-inline">
                                <input id="radType1" name="radType" type="radio" value="1" checked="checked" />站内文章
                            </label>
                            <label for="radType2" class="radio i-checks radio-inline">
                                <input id="radType2" name="radType" type="radio" value="0" />站外文章
                            </label>
                        </div>
                    </div>
			             <div id="inArtContainer">
				           	<div class="form-group">
				                 <label class="col-sm-2 control-label">选择文章</label>
				                 <div class="col-sm-10">
				                     <input id="inLink" name="inLink" readonly type="text" class="form-control" onclick="page.articleSelector.openSelector(0)">
				                 </div>
				             </div>
			             	<div class="form-group">
				                 <label class="col-sm-2 control-label">显示标题</label>
				                 <div class="col-sm-10">
				                     <input id="inTitle" name="inTitle" type="text" class="form-control">
				                 </div>
				             </div>
			             </div>
              
			             <div  id="outArtContainer">
				           	<div class="form-group">
				                 <label class="col-sm-2 control-label">标题</label>
				                 <div class="col-sm-10">
				                     <input id="outTitle" name="outTitle" type="text" class="form-control">
				                 </div>
				             </div>
			             	<div class="form-group">
				                 <label class="col-sm-2 control-label">链接</label>
				                 <div class="col-sm-10">
				                     <input id="outLink" name="outLink"  type="text" class="form-control">
				                 </div>
				             </div>
			             </div>
	                </form>
	          </div>
	          <div class="modal-footer">
	          <button type="button" class="btn button button-rounded" data-dismiss="modal">关闭</button>
	          <button type="button" id="releatedLinkConfirm" class="btn btn-primary button button-rounded" onclick="page.eventHandler._relatedLink.add()" data-dismiss="modal">确定</button>
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
	          <button type="button" class="btn btn-primary button button-rounded" onclick="page.eventHandler._guest.create(this)">确定</button>
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
	          <button type="button" class="btn btn-primary button button-rounded" onclick="page.eventHandler._relatedNews.insert()">确定</button>
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
    <%--上传对接七牛--%>
    <script src="<%=basePath%>static/common/helper.qiniu.js"></script>
    <%--富文本编辑器组件summernote--%>
    <link href="<%=basePath%>static/lib/summernote/summernote.css" rel="stylesheet">
    <link href="<%=basePath%>static/lib/summernote/summernote-bs3.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/summernote/summernote.min.js"></script>
    <script src="<%=basePath%>static/lib/summernote/summernote-zh-CN.js"></script>
    <%--富文本编辑器对接七牛--%>
    <script src="<%=basePath%>static/lib/summernote/summernote-qiniu.js"></script>
    <%--表单选择框组件--%>
    <link href="<%=basePath%>static/lib/iCheck/custom.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/iCheck/icheck.min.js"></script>
    <%--上传组件--%>
    <link href="<%=basePath%>static/lib/dropzone/dropzone.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/dropzone/dropzone.js"></script>
    <script src="<%=basePath%>static/lib/dropzone/dropzone-zh-CN.js"></script>
    <%--上传组件对接七牛--%>
    <script src="<%=basePath%>static/lib/dropzone/dropzone-qiniu.js"></script>
    <%--弹窗控件--%>
    <link href="<%=basePath%>static/lib/sweetalert/sweetalert.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/sweetalert/sweetalert.min.js"></script>
    <%--表单验证组件--%>
    <script src="<%=basePath%>static/lib/bootstrapValidator/bootstrapValidator.min.js"></script>
    <!--日期控件-->
    <link href="<%=basePath%>static/lib/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/datetimepicker/datetimepicker.min.js"></script>

    <%--推送组件--%>
    <script src="<%=basePath%>static/common/module/module.push.js"></script>

    <%--toastr提示控件--%>
    <link href="<%=basePath%>static/lib/toastr/css/toastr.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/toastr/js/toastr.min.js"></script>
    <script src="<%=basePath%>static/lib/toastr/customOptions.js"></script>
    <%--时间转换控件--%>
	<script src="<%=basePath%>static/lib/moment/moment.min.js"></script>

    <%--表单验证控件--%>
    <script src="<%=basePath%>static/lib/bootstrapValidator/bootstrapValidator.min.js"></script>
    <%--页面css及js文件--%>	
  <script>var pageId = ${paramMap.page_id}</script>
    <script src="<%=basePath%>static/common/tSelector.js"></script>
    <script src="<%=basePath%>static/common/articleSelector.js"></script>
	<script src="<%=basePath%>static/page/CM/circleTopicEdit.js"></script>
</html>
