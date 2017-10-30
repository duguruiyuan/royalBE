<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>圈子活动直播-商帮帮后台</title>
    <meta charset="utf-8">
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/staticInclude.jsp"%>
    <style>
        .modal-backdrop {
        display: none !important;}
    	#inputPanel {
    		position:fixed;
    		bottom: 0;
    		left: 0;
    		width: 100%;
    		height: auto;
    		/*background: #f3f3f4;*/
    			background: #fff;
		    z-index: 5;

		    box-shadow:0px -5px 0px #BFB7B7;
		    	  display:-webkit-box;
		    display:-webkit-flex;
		    display:-ms-flexbox;
		    display:flex;
		    flex-direction: column;
		    -webkit-flex-direction: column;
		    -webkit-justify-content: center;
		    justify-content: center;
		    -webkit-align-items: center;
		    align-items: center;
    	}
    	#inputContainer {
    		width:100%;
    	/*    -moz-box-shadow:0px -5px 0px #BFB7B7;
		    -webkit-box-shadow:0px -5px 0px #BFB7B7; 
    		padding: 20px 40px;*/
    	}
        .flex-row-center {
          display:-webkit-box;
        display:-webkit-flex;
        display:-ms-flexbox;
        display:flex;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-align-items: center;
        align-items: center;
        }
        .flex-row-center button{
            width:100px;
        }
        .vertical-timeline-content {
            margin:0 !important;
        }
    </style>
  </head>
  <body class="gray-bg">
     <div id="inputPanel">
         <div id="inputContainer" class="collapse">
            <div style="padding: 20px 40px">
                <div id="citeBox" class="collapse">
                    <div class="input-group">
                          <div id="citeContent" class="form-control"></div>
                          <%--<input id="citeContent" type="text" disabled class="form-control">--%>
                          <span class="input-group-btn">
                            <button type="button" class="btn btn-warning" onclick="page.eventHandler.actionCite(1)">取消引用</button>
                          </span>
                    </div>
                </div>
                <div id="inputEditor"></div>
                <div class="flex-row-center m-t-md m-b-md">
                    <button data-toggle="collapse" data-target="#inputContainer" class="btn btn-white m-r-lg">关闭</button>
                    <button class="btn btn-primary" onclick="page.eventHandler.addContent(this)" >发送</button>
                </div>
             </div>
         </div>
     </div>
  
  
  
     <div class="wrapper wrapper-content animated fadeInRight">
	  	 <div class="row">	       
            <div class="col-sm-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                			<button id=refresh onclick="page.eventHandler.refresh()" class="btn btn-sm btn-primary  m-l-sm pull-right">刷新</button>
                    		<button id="liveControl" onclick="page.eventHandler.toggleLive(this)" class="btn btn-sm btn-primary  m-l-sm pull-right">开启直播</button>
                   	    	<button class="btn btn-sm btn-white pull-right" onclick="page.eventHandler.openFeedTopModal()">信息流置顶</button>
                  		<h3>${paramMap.page_title}活动的直播</h3>
                    </div>
                    <div class="ibox-content" style="padding:0">
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="chat-discussion"  style="min-height:78vh">
                                     <div class="vertical-container light-timeline">
                                         <div id="liveContainer">
                                            <%--<div class="vertical-timeline-block">--%>
                                                <%--<div class="vertical-timeline-content">--%>
                                                    <%--<h2>会议</h2>--%>
                                                    <%--<p>上一年的销售业绩发布会。总结产品营销和销售趋势及销售的现状。--%>
                                                    <%--</p>--%>
                                                       <%--<button class="btn btn-sm btn-danger m-l-sm">删除</button>--%>
                                                              <%--<button class="btn btn-sm btn-warning m-l-sm btn-outline"  data-username="rerter" data-userid='11' data-content='werwer'  onclick="page.eventHandler.actionCite(this,0)">引用</button>--%>
                                                    <%--<button class="btn btn-sm btn-primary m-l-sm btn-outline"  data-id="11" data-adopt="0" onclick="page.eventHandler.actionAdopt(this)">采纳</button>--%>
                                                    <%--<span class="vertical-date">--%>
                                                        <%--今天 <br>--%>
                                                        <%--<small>2月3日</small>--%>
                                                    <%--</span>--%>
                                                <%--</div>--%>
                                            <%--</div>--%>
                                         </div>
                                         <button id="liveLoader" onclick="page.eventHandler.readStep()" style="background-color:#fff" type="button" class="m-t-lg btn btn-block btn-outline btn-white">点击查看更多</button>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>

		    	</div>
		 	</div>
             <div class="col-sm-12">
                 <button data-toggle="collapse" data-target="#inputContainer" type="button" class="pull-right btn btn-primary">打开输入面板</button>
             </div>
  		</div>
     </div>
     <div id="setTopModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
         <div class="modal-dialog">
            <div class="modal-content">
                  <div class="modal-header center">
                    <h4 class="modal-title" style="text-align: center">直播置顶</h4>
                  </div>
                  <div class="modal-body table-modal-body">
                       <form id="setTopForm" class="form-horizontal" style="display:none">
                            <div class="form-group">
                                 <label class="col-sm-3 control-label">置顶开始时间</label>
                                    <div class="input-group m-b-xs col-sm-9">
                                        <input placeholder="创建日期始" style="max-width:none !important;width:80%" readonly class="form-control layer-date" id="topStartTime" name="topStartTime">
                                    </div>
                             </div>
                                <div class="form-group">
                                 <label class="col-sm-3 control-label">置顶结束时间</label>
                                 <div class="input-group m-b-xs col-sm-9">
                                        <input placeholder="创建日期末" style="max-width:none !important;width:80%" readonly class="form-control layer-date" id="topEndTime" name="topEndTime">
                                    </div>
                             </div>
                        </form>
                        <div id="setDoneBox" style="display:none">
                            直播只当。。。。
                        </div>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn button button-rounded" data-dismiss="modal">取消</button>
                      <button type="button" class="btn btn-primary button button-rounded" onclick="page.eventHandler.setFeedTop()">确定</button>
                  </div>
       					
            </div>
          </div>
      </div>

  </body>		
      <%--上传对接七牛--%>
    <script src="<%=basePath%>static/common/helper.qiniu.js"></script>
    <%--富文本编辑器组件summernote--%>
    <link href="<%=basePath%>static/lib/summernote/summernote.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/summernote/summernote.min.js"></script>
    <script src="<%=basePath%>static/lib/summernote/summernote-zh-CN.js"></script>
    <%--富文本编辑器对接七牛--%>
    <%-- <script src="<%=basePath%>static/lib/summernote/summernote-qiniu.js"></script> --%>
    <%--表单选择框组件--%>
    <link href="<%=basePath%>static/lib/iCheck/custom.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/iCheck/icheck.min.js"></script>
    <%--弹窗控件--%>
    <link href="<%=basePath%>static/lib/sweetalert/sweetalert.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/sweetalert/sweetalert.min.js"></script>
    <%--toastr提示控件--%>
    <link href="<%=basePath%>static/lib/toastr/css/toastr.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/toastr/js/toastr.min.js"></script>
    <script src="<%=basePath%>static/lib/toastr/customOptions.js"></script>
    <%--日期选择控件--%>
    <script src="<%=basePath%>static/lib/layer/laydate/laydate.js"></script>
    <%--富文本编辑器组件--%>
    <script src="<%=basePath%>static/common/module/module.editor.js?v=<%=StaticVersion%>"></script>
    <%--时间转换控件--%>
	<script src="<%=basePath%>static/lib/moment/moment.min.js"></script>
	
	<script> var pageId = ${paramMap.page_id};

                </script>
      <%--pageTitle = ${paramMap.page_title};--%>
  <%--pageType = ${paramMap.page_type},--%>
  <%--pageSummary = ${paramMap.page_summary},--%>
  <%--pageImage = ${paramMap.page_image},--%>
  <%--pageExtra = ${paramMap.page_extra},--%>
  <%--pageStatus = ${paramMap.page_status},--%>
  <%--pageState = ${paramMap.page_state};--%>
    <%--页面css及js文件--%>
    <script src="<%=basePath%>static/page/CM/circleActivityLive.js"></script>
</html>
