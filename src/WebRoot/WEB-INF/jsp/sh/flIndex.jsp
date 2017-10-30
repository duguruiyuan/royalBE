<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <title>商会管理</title>
    <meta charset="utf-8">
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/amdInclude.jsp"%>
    
  </head>
  <body class="gray-bg">
     <div class="wrapper wrapper-content animated fadeInRight">
	  	 <div class="row">
      		 <div class="col-sm-3" style="padding-right: 0;padding-top: 15px;border-top:solid 4px #e7eaec">
      		    <div class="input-group m-b">
      		        <input id="txtUnSelected" type="text" class="form-control" placeholder="输入关键字搜索待选择项，按回车键搜索">
      		        <span class="input-group-btn">
      		            <button id="btnUnSelected" class="btn btn-primary">
      		                <i class="glyphicon glyphicon-search"></i>
      		            </button>
      		        </span>
      		    </div>
                <div id="gslgl_treeview" style="border-top-left-radius: 4px; border-top-right-radius: 4px; border: 1px solid rgb(231, 234, 236); overflow-y: auto;border-top:solid 4px #e7eaec"></div>
            </div>
	       
			<div class="col-sm-9">
				<div class="ibox float-e-margins">
				        <div class="ibox-title">
				            <h3>商会管理&nbsp;&nbsp;&nbsp;<small>分类管理</small></h3>
				        </div>
					<div class="ibox-content">
						<div id="tableTools">
							<form class="form-inline bars" onsubmit="return false">
								<a id="add_fl_btn" type="button" class="btn btn-primary">新增分类</a>
								<div class="input-group date m-b-xs">
			                        <input id="startTime" class="form-control form_date" size="10" type="text" data-end="#releaseEndTime" value="" placeholder="创建日期-起" readonly />
			                        <label for="startTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
			                    </div>
			                    <div class="input-group date m-b-xs">
			                        <input id="endTime" class="form-control form_date" size="10" type="text" data-start="#releaseStartTime" value="" placeholder="创建日期-止" readonly />
			                        <label for="endTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
			                    </div>
								<div class="input-group m-b-xs">
									<input id="keyword" name="keyword" type="text" class="form-control" placeholder="请输入所属工商联">
								</div>
								<button id="btnSearch" type="button" class="btn btn-primary">搜索</button>
                                <button type="reset" class="btn btn-default">重置</button>
							</form>
						</div>
					    <div class="m-l-sm m-r-sm">
					        <table id="tableList">
					        </table>
					    </div>
					</div>
				</div>
			</div>
		 </div>
	  </div>
	  <!-- 新增工商联 -->
	  <div class="modal inmodal fade" id="add_fl" role="dialog"  aria-hidden="true">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                      <h4 class="modal-title" id="fl_title">新增分类</h4>
                  </div>
                  <div class="modal-body">
                      <form id="frmAddfl" class="form-horizontal">
                          <div class="form-group">
                              <label class="col-sm-2 control-label">分类名称：</label>
                              <div class="col-sm-9">
                                  <input id="flName" name="flName" class="form-control" placeholder="请输入分类名称" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">所属工商联：</label>
                              <div class="col-sm-9" id="selectGsl">
                                  
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">所属分类：</label>
                              <div class="col-sm-9">
                                  <select class="form-control" id="selectFl" name="selectFl"></select>
                              </div>
                          </div>
                      </form>
                  </div>

                  <div class="modal-footer" id="divAction">
                      <button type="button" disabled="disabled" class="btn btn-white" data-dismiss="modal">关闭</button>
                      <button id="confirm_addfl" type="button" disabled="disabled" class="btn btn-primary">确定</button>
                  </div>
              </div>
          </div>
      </div>
  </body>
  <%--页面css及js文件--%>
  <script src="<%=basePath%>static/page/sh/flIndex.js?v=<%=StaticVersion%>"></script>
</html>
