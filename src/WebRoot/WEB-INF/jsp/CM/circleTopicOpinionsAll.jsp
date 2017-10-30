<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>观点管理</title>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
  <body class="gray-bg">
     <div class="wrapper wrapper-content animated fadeInRight">
	  	 <div class="row">
 			 <div class="col-sm-2">
                <div class="ibox float-e-margins">
               		<div class="ibox-title">
                       <h3>观点管理</h3>
                    </div>
             		<div class="ibox-content">
						<a class="btn btn-block btn-primary">全部</a>
						<a class="btn btn-block btn-white" href="CMcircleTopicOpinionsTrash.shtml?page_id=${paramMap.page_id}">垃圾箱</a>	
					</div>
                </div>
            </div>
	  	 
	       
	            <div class="col-sm-10">
	                <div class="ibox float-e-margins">
	                    <div class="ibox-title">
                			<h3>观点管理 &nbsp;&nbsp;&nbsp;<span id="commentTitle" style="display:none"><span class="label-warning"></span>&nbsp;&nbsp;&nbsp;</span><small id="pageSubTitle">全部观点</small></h3>
	                       <!--  <h3>内容管理 > 圈子话题 > 观点管理 > 全部</h3> -->
	                    </div>
			            <div class="ibox-content ">
			                <div id="tableTools">
			                    <%--搜索条件bar  start--%>
			                    <form class="form-inline bars">
									<button id="addBtn" type="button" class="btn btn-primary">代发观点</button>
			                        <div class="input-group date m-b-xs">
			                            <input id="start_time" class="form-control form_date" size="10" type="text" value="" placeholder="发表日期-起" readonly />
			                            <label for="startTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
			                        </div>
			                        <div class="input-group date m-b-xs">
			                            <input id="end_time" class="form-control form_date" size="10" type="text" value="" placeholder="发表日期-止" readonly />
			                            <label for="endTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
			                        </div>
			                        <div class="input-group m-b-xs" style="width:340px">
			                            <input id="keyword" type="text" class="form-control" placeholder="请输入要搜索的内容（观点内容/话题标题）" />
			                        </div>
			                        <button id="btnSearch" type="button" class="btn btn-primary">搜索</button>
			                        <button type="reset" class="btn btn-default">重置</button>
			                    </form>
			                    <%--搜索条件bar  end--%>
			                </div>
			                <div class="m-l-sm m-r-sm">
			                    <%--表格容器--%>
			                    <table id="tableList"></table>
			                </div>
			            </div>
	           <%--   		<div class="ibox-content">
						    <div id="tableTools">
						         <form class="form-inline bars">
									<button onclick="window.parent.openFrm(this)" data-index="CMcircleTopicOpinionsAdd.shtml?page_id=${paramMap.page_id}" data-title="代发观点" type="button" class="btn btn-primary">代发观点</button>
                                    <div class="input-group m-b-xs">
			                       		<input placeholder="发布日期始" readonly class="form-control layer-date" id="startTime" name="startTime">
			                        </div>
	                               <div class="input-group m-b-xs">
			                       		<input placeholder="发布日期末" readonly class="form-control layer-date" id="endTime" name="endTime">
			                        </div> 
             					         	<div class="input-group m-b-xs">
			                        	<input id="keyword" name="keyword" type="text" class="form-control" placeholder="搜索观点内容或者翻译内容">
			                        </div>
			                        <button onclick="page.eventHandler.search()" type="button" class="btn btn-success">搜索</button>
									<button onclick="page.eventHandler.reset()" type="reset" class="btn btn-white">重置</button>
			                    </form>			
							</div>
						   <div class="m-l-sm m-r-sm">
							   	<table id="tableList">
								</table>
							</div>
						</div> --%>
			    	</div>
		 	</div>
 		</div>
	</div>
    <div class="modal inmodal fade" id="see_translate" tabindex="-1" role="dialog"  aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title">编辑翻译</h4>
                </div>
                <div class="modal-body">
                    <textarea class="form-control" rows="10" cols="15" id="content-warpper"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-info" id="upload_translate">确定</button>
                    <button type="button" class="btn btn-sm btn-white" data-dismiss="modal">取消</button>
                </div>
            </div>
        </div>
    </div>
<!-- 	<div id="translateModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
       	 <div class="modal-dialog">
        	  <div class="modal-content">
	          <div class="modal-header center">
	          <h4 class="modal-title" style="text-align: center">评论翻译</h4>
	          </div>
	          <div class="modal-body table-modal-body">
               <form id="translateForm" class="form-horizontal">   
                   	<div class="form-group">
                 <div class="col-sm-12">
                        <audio controls>
        			 	 <source id="translateAudio" src="" type="audio/mp3">
    			  	</audio>
                 </div>
             </div>
           
               
		           	<div class="form-group">
		                 <div class="col-sm-12">
		                     <textarea id="translation" rows="5" style="resize:none" name="translation" type="text" class="form-control"></textarea>
		                 </div>
		             </div>
                </form>
	          </div>
	          <div class="modal-footer">
	          <button type="button" class="btn button button-rounded" data-dismiss="modal">取消</button>
	          <button type="button" class="btn btn-primary button button-rounded" onclick="page.eventHandler.updateContent()">保存</button>
	          </div>
      					
        		</div>	
        	</div>
      </div> -->
  </body>

	<script src="<%=basePath%>static/page/CM/circleTopicOpinionsAll.js?v=<%=StaticVersion%>"></script>
</html>
