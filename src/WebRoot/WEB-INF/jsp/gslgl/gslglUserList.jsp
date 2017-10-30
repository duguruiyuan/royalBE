<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>工商联用户列表</title>
    <%@ include file="../include/amdInclude.jsp"%>
    <script src="<%=basePath%>static/page/gslgl/gslglUserList.js?v=<%=StaticVersion%>"></script>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight dashboard-header">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>工商联管理&nbsp;&nbsp;&nbsp;<small>工商联用户列表</small></h3>
            </div>
            <div class="ibox-content ">
                <div id="tableTools">
                    <%--搜索条件bar  start--%>
                    <form class="form-inline bars" onsubmit="return false;">
                        <div class="input-group m-b-xs">
                            <input id="keyword" type="text" class="form-control" placeholder="请输入搜索关键字" />
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
        </div>
    </div>
    <!-- 新增工商联用户 -->
	  <div class="modal inmodal fade" id="add_gslyh" tabindex="-1" role="dialog"  aria-hidden="true">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                      <h4 class="modal-title" id="gslyh_title">修改工商联用户</h4>
                  </div>
                  <div class="modal-body">
                      <form id="frmAddgslyh" class="form-horizontal">
                          <div class="form-group">
                              <label class="col-sm-2 control-label">账号：</label>
                              <div class="col-sm-9">
                                  <input id="gslyhCode" name="gslyhCode" readonly="readonly" class="form-control" placeholder="请输入账号"  />
                              </div>
                          </div>
                          <!--<div class="form-group">
                              <label class="col-sm-2 control-label">密码：</label>
                              <div class="col-sm-9">
                                  <input id="gslyhPwd" type="password" name="gslyhPwd" class="form-control" placeholder="请输入密码" />
                              </div>
                          </div>  -->
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

                  <div class="modal-footer">
                      <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
                      <button id="confirm_addGslyh" type="button" class="btn btn-primary">确定</button>
                  </div>
              </div>
          </div>
      </div>
</body>
</html>
