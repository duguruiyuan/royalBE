<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <title>工商联管理</title>
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
                  <div id="gslgl_treeview" style="border-top-left-radius: 4px; border-top-right-radius: 4px; border: 1px solid rgb(231, 234, 236); overflow-y: auto"></div>
              </div>
	       
			<div class="col-sm-9">
				<div class="ibox float-e-margins">
				        <div class="ibox-title">
				            <h3>工商联管理&nbsp;&nbsp;&nbsp;<small>工商联管理</small></h3>
				        </div>
					<div class="ibox-content">
						<div id="tableTools">
							<form class="form-inline bars" onsubmit="return false">
								<a id="add_gsl_btn" type="button" class="btn btn-primary">新增工商联</a>
								<div class="input-group date m-b-xs">
			                        <input id="startTime" class="form-control form_date" size="10" type="text" data-end="#releaseEndTime" value="" placeholder="创建日期-起" readonly />
			                        <label for="startTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
			                    </div>
			                    <div class="input-group date m-b-xs">
			                        <input id="endTime" class="form-control form_date" size="10" type="text" data-start="#releaseStartTime" value="" placeholder="创建日期-止" readonly />
			                        <label for="endTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
			                    </div>
								<div class="input-group m-b-xs">
									<input id="keyword" name="keyword" type="text" class="form-control" placeholder="请输入搜索关键字">
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
	  <div class="modal inmodal fade" id="add_gsl" tabindex="-1" role="dialog"  aria-hidden="true">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                      <h4 class="modal-title" id="gsl_title">新增工商联</h4>
                  </div>
                  <div class="modal-body">
                      <form id="frmAddgsl" class="form-horizontal">
                          <div class="form-group">
                              <label class="col-sm-2 control-label">工商联名称：</label>
                              <div class="col-sm-9">
                                  <input id="gslName" name="gslName" class="form-control" placeholder="请输入工商联名称" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">工商联主页：</label>
                              <div class="col-sm-9">
                                  <input id="gslUrl" name="gslUrl" class="form-control" placeholder="请输入工商联主页" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">工商联地址：</label>
                              <div class="col-sm-9">
                                  <input id="gslAddress" name="gslAddress" class="form-control" placeholder="请输入工商联地址" />
                              </div>
                          </div>
                      </form>
                  </div>

                  <div class="modal-footer" id="divActionGsl">
                      <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
                      <button id="confirm_addGsl" type="button" class="btn btn-primary">确定</button>
                  </div>
              </div>
          </div>
      </div>
      <!-- 新增工商联用户 -->
	  <div class="modal inmodal fade" id="add_gslyh" tabindex="-1" role="dialog"  aria-hidden="true">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                      <h4 class="modal-title" id="gslyh_title">新增工商联用户</h4>
                  </div>
                  <div class="modal-body">
                      <form id="frmAddgslyh" class="form-horizontal">
                          <div class="form-group">
                              <label class="col-sm-2 control-label">账号：</label>
                              <div class="col-sm-9">
                                  <input id="gslyhCode" name="gslyhCode" class="form-control" placeholder="请输入账号" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">密码：</label>
                              <div class="col-sm-9">
                                  <input id="gslyhPwd" type="password" name="gslyhPwd" class="form-control" placeholder="请输入密码" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">姓名：</label>
                              <div class="col-sm-9">
                                  <input id="gslyhName" name="gslyhName" class="form-control" placeholder="请输入姓名" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">职务：</label>
                              <div class="col-sm-9">
                                  <input id="gslyhPost" name="gslyhPost" class="form-control" placeholder="请输入职务" />
                              </div>
                          </div>
                          <div class="form-group">
	                          <label class="col-sm-2 control-label">性别：</label>
	                          <div class="col-sm-9">
	                              <label for="radType1" class="radio i-checks radio-inline">
	                                  <input id="radType1" name="radType" type="radio" value="1" checked="checked" />男
	                              </label>
	                              <label for="radType2" class="radio i-checks radio-inline">
	                                  <input id="radType2" name="radType" type="radio" value="2" />女
	                              </label>
	                          </div>
	                      </div>
	                      <div class="form-group">
                              <label class="col-sm-2 control-label">权限：</label>
                              <div class="col-sm-9">
                                  <select id="gslyhPower" name="gslyhPower" class="form-control"></select>
                              </div>
                          </div>
                      </form>
                  </div>

                  <div class="modal-footer" id="divActionGslYh">
                      <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
                      <button id="confirm_addGslyh" type="button" class="btn btn-primary">确定</button>
                  </div>
              </div>
          </div>
      </div>
  </body>
  <%--页面css及js文件--%>
  <script src="<%=basePath%>static/page/gslgl/gslglIndex.js?v=<%=StaticVersion%>"></script>
</html>
