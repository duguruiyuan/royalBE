<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <title>商会管理</title>
    <meta charset="utf-8">
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/amdInclude.jsp"%>
    <style type="text/css">
        .bootstrap-table{width: 95%;margin:0 auto}
    </style>
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
			            <h3>商会管理&nbsp;&nbsp;&nbsp;<small>商会管理</small></h3>
			        </div>
					<div class="ibox-content">
						<div id="tableTools">
							<form class="form-inline bars" id="" onsubmit="return false">
								<a id="add_sh_btn" type="button" class="btn btn-primary">新增商会</a>
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
	  <!-- 新增商会-->
	  <div class="modal inmodal fade" id="add_sh" role="dialog"  aria-hidden="true">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                      <h4 class="modal-title" id="sh_title">新增商会</h4>
                  </div>
                  <div class="modal-body">
                      <form id="frmAddsh" class="form-horizontal">
                          <div class="form-group">
                              <label class="col-sm-2 control-label">商会名称：</label>
                              <div class="col-sm-9">
                                  <input id="shName" name="shName" class="form-control" placeholder="请输入商会名称" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">会长姓名：</label>
                              <div class="col-sm-9">
                                  <input id="shUser" name="shUser" class="form-control" placeholder="请输入会长姓名" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">商会电话：</label>
                              <div class="col-sm-9">
                                  <input id="shTell" name="shTell" class="form-control" placeholder="请输入商会电话" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">商会地址：</label>
                              <div class="col-sm-9">
                                  <input id="shAddress" name="shAddress" class="form-control" placeholder="请输入商会地址" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">所属分类：</label>
                              <div class="col-sm-9">
                                  <a id="shClassify" name="shClassify" class="btn btn-primary">选择分类</a>
                                  <span id="selectClassify"></span>
                                  <small id="shClassifyPrompt" class="help-block" style="display: none;">分类不能为空</small>
                              </div>
                          </div>
                      </form>
                  </div>

                  <div class="modal-footer" id="divActionSh">
                      <button type="button" disabled="disabled" class="btn btn-white" data-dismiss="modal">关闭</button>
                      <button id="confirm_addsh" disabled="disabled" type="button" class="btn btn-primary">确定</button>
                  </div>
              </div>
          </div>
      </div>
      <!-- 新增商会用户 -->
	  <div class="modal inmodal fade" id="add_shyh" tabindex="-1" role="dialog"  aria-hidden="true">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                      <h4 class="modal-title" id="shyh_title">新增工商联用户</h4>
                  </div>
                  <div class="modal-body">
                      <form id="frmAddshyh" class="form-horizontal">
                          <div class="form-group">
                              <label class="col-sm-2 control-label">账号：</label>
                              <div class="col-sm-9">
                                  <input id="shyhCode" name="shyhCode" class="form-control" placeholder="请输入账号" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">密码：</label>
                              <div class="col-sm-9">
                                  <input id="shyhPwd" type="password" name="shyhPwd" class="form-control" placeholder="请输入密码" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">姓名：</label>
                              <div class="col-sm-9">
                                  <input id="shyhName" name="shyhName" class="form-control" placeholder="请输入姓名" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">职务：</label>
                              <div class="col-sm-9">
                                  <input id="shyhPost" name="shyhPost" class="form-control" placeholder="请输入职务" />
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
                      </form>
                  </div>

                  <div class="modal-footer" id="divActionYh">
                      <button type="button" disabled="disabled" class="btn btn-white" data-dismiss="modal">关闭</button>
                      <button id="confirm_addshyh" type="button" disabled="disabled" class="btn btn-primary">确定</button>
                  </div>
              </div>
          </div>
      </div>
      <!-- 编辑短信配置 -->
	  <div class="modal inmodal fade" id="add_dxpz" tabindex="-1" role="dialog"  aria-hidden="true">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                      <h4 class="modal-title">商会短信配置</h4>
                  </div>
                  <div class="modal-body">
                      <form id="frmAdddxpz" class="form-horizontal">
                          <div class="form-group">
                              <label class="col-sm-2 control-label">客户账号：</label>
                              <div class="col-sm-9">
                                  <input id="dxCode" name="dxCode" class="form-control" placeholder="请输入客户账号" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">客户密码：</label>
                              <div class="col-sm-9">
                                  <input id="dxPwd" type="password" name="dxPwd" class="form-control" placeholder="请输入客户密码" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">对接IP：</label>
                              <div class="col-sm-9">
                                  <input id="dxIp" name="dxIp" class="form-control" placeholder="请输入IP" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">端口：</label>
                              <div class="col-sm-9">
                                  <input id="dxPort" name="dxPort" class="form-control" placeholder="请输入端口" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">移动接入号：</label>
                              <div class="col-sm-9">
                                  <input id="dxYd" name="dxYd" class="form-control" placeholder="请输入移动接入号" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">联通接入号：</label>
                              <div class="col-sm-9">
                                  <input id="dxLt" name="dxLt" class="form-control" placeholder="请输入联通接入号" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">电信接入号：</label>
                              <div class="col-sm-9">
                                  <input id="dxDx" name="dxDx" class="form-control" placeholder="请输入电信接入号" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">短信签名：</label>
                              <div class="col-sm-9">
                                  <input id="dxAutograph" name="dxAutograph" class="form-control" placeholder="请输入短信签名" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">短信总数：</label>
                              <div class="col-sm-9">
                                  <input id="dxCount" name="dxCount" class="form-control" readonly="readonly" placeholder="短信总数" />
                              </div>
                          </div> 
                          <div class="form-group">
                              <label class="col-sm-2 control-label">已使用数：</label>
                              <div class="col-sm-9">
                                  <input id="dxUse" name="dxUse" class="form-control" readonly="readonly" placeholder="已使用数" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">剩余数量：</label>
                              <div class="col-sm-9">
                                  <input id="dxNumber" name="dxNumber" class="form-control" readonly="readonly" placeholder="剩余数量" />
                              </div>
                          </div>
                          <div class="form-group">
                              <label class="col-sm-2 control-label">配置总数：</label>
                              <div class="col-sm-9">
                                  <input id="dxTotal" name="dxTotal" class="form-control" placeholder="请输入配置总数" />
                              </div>
                          </div>
                      </form>
                  </div>

                  <div class="modal-footer" id="divActionPz">
                      <button type="button" disabled="disabled" class="btn btn-white" data-dismiss="modal">关闭</button>
                      <button id="confirm_adddxpz" type="button" disabled="disabled" class="btn btn-primary">确定</button>
                  </div>
              </div>
          </div>
      </div>
  </body>
  <%--页面css及js文件--%>
  <script src="<%=basePath%>static/page/sh/shIndex.js?v=<%=StaticVersion%>"></script>
</html>
