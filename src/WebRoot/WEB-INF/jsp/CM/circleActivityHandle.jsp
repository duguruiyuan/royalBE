<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>圈子新增-商帮帮后台</title>
      <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
      <%@ include file="../include/amdInclude.jsp"%>
  </head>
  <body class="gray-bg">
     <div class="wrapper wrapper-content animated">
	 <div class="row">
            <div class="col-sm-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h3>活动管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle"></small></h3>
                    </div>
                    <div class="ibox-content">

                        <form id="pageForm" class="form-horizontal">
                            <div class="row text-center m-b">
                                <h2>基本信息</h2>
                            </div>

                            <div class="form-group">
                                <label class="col-sm-2 control-label">标题：</label>
                                <div class="col-sm-9">
                                    <input id="title" name="title" type="text" class="form-control" placeholder="请输入标题，50字以内"/>
                                </div>
                            </div>
                            <div class="form-group" id="circlesContainer">
                                <label class="col-sm-2 control-label">圈子：</label>
                                <div class="col-sm-9 cursor">
                                    <div id="circles" onclick="page.eventHandler.circles.openSelector()" class="form-control label-box"></div>
                                </div>
                            </div>
                            <div class="form-group has-error hidden" id="circlesPrompt">
		                        <label class="col-sm-2 control-label"></label>
		                        <div class="col-sm-9">
		                            <small class="help-block" data-bv-validator="notEmpty" data-bv-for="startTime" data-bv-result="INVALID" style="">圈子不能为空</small>
		                        </div>
		                    </div>
                            <!--<div class="form-group" >
                                <label class="col-sm-2 control-label">开始时间：</label>
                                <div class="col-sm-4">
                                    <input id="startTime" name="startTime" data-end="#endTime" value=""  class="form-control form_date" type="datetime" placeholder="开始日期" />
                                </div>
                            </div>
                            <div class="form-group" >
                                <label class="col-sm-2 control-label">结束时间：</label>
                                <div class="col-sm-4">
                                    <input id="endTime" name="endTime" data-start="#startTime" value=""  class="form-control form_date" type="datetime" placeholder="结束日期" />
                                </div>
                            </div>  -->
                            <div class="form-group" id="startTimeContainer">
		                        <label class="col-sm-2 control-label">开始时间：</label>
		                        <div class="col-sm-3">
		                            <div class="input-group date form_date1 " data-date="" data-date-format="yyyy-mm-dd hh:ii" data-link-format="yyyy-mm-dd hh:ii">
		                                <input id="startTime" name="startTime" class="form-control form_date" size="10" type="text" data-end="#endTime" value="" placeholder="开始时间" readonly />
		                                <label for="startTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
		                            </div>
		                        </div>
		                    </div>
		                    <div class="form-group has-error hidden" id="startTimePrompt">
		                        <label class="col-sm-2 control-label"></label>
		                        <div class="col-sm-9">
		                            <small class="help-block" data-bv-validator="notEmpty" data-bv-for="startTime" data-bv-result="INVALID" style="">开始时间不能为空</small>
		                        </div>
		                    </div>
		                    <div class="form-group" id="endTimeContainer">
		                        <label class="col-sm-2 control-label">结束时间：</label>
		                        <div class="col-sm-3">
		                            <div class="input-group date form_date1 " data-date="" data-date-format="yyyy-mm-dd hh:ii" data-link-format="yyyy-mm-dd hh:ii">
		                                <input id="endTime" name="endTime" class="form-control form_date" size="10" type="text" data-end="#endTime" value="" placeholder="结束时间" readonly />
		                                <label for="endTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
		                            </div>
		                        </div>
		                    </div>
		                    <div class="form-group has-error hidden" id="endTimePrompt">
		                        <label class="col-sm-2 control-label"></label>
		                        <div class="col-sm-9">
		                            <small class="help-block" data-bv-validator="notEmpty" data-bv-for="startTime" data-bv-result="INVALID" style="">结束时间不能为空</small>
		                        </div>
		                    </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">地点：</label>
                                <div class="col-sm-9" id="placeSelect">
                                    <!-- <input id="place" name="place" type="text" class="form-control"> -->
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">详细地址：</label>
                                <div class="col-sm-9">
                                    <textarea id="address" name="address" class="form-control" rows="3" placeholder="请输入详细地址"></textarea>
                                </div>
                            </div>

                            <div class="form-group" id="guestTableContainer">
                                <label class="col-sm-2 control-label">分享嘉宾：</label>
                                <div class="col-xs-10 col-md-9">
                                    <table id="guestTable"></table>
                                    <button class="btn btn-primary m-t-sm pull-right" type="button" onclick="page.eventHandler.guest.openAdd()">添加嘉宾</button>
                                    <button class="btn btn-success m-t-sm m-r-xs pull-right" type="button" onclick="page.eventHandler.guest.openSelect()">选择用户</button>
                                </div>
                            </div>
                            <div class="form-group has-error hidden" id="guestTablePrompt">
		                        <label class="col-sm-2 control-label"></label>
		                        <div class="col-sm-9">
		                            <small class="help-block" data-bv-validator="notEmpty" data-bv-for="startTime" data-bv-result="INVALID" style="">分享嘉宾不能为空</small>
		                        </div>
		                    </div>
	                         <div class="form-group has-error hidden" id="guestTablePrompt1">
		                         <label class="col-sm-2 control-label"></label>
		                         <div class="col-sm-9">
		                             <small class="help-block" data-bv-validator="notEmpty" data-bv-for="startTime" data-bv-result="INVALID" style="">存在嘉宾身份信息不完整</small>
		                         </div>
		                     </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">活动介绍：</label>
                                <div class="col-xs-10 col-md-9">
                                    <div id="briefEditor">
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-sm-2 control-label">视频直播地址：</label>
                                <div class="col-xs-10 col-md-9">
                                    <input id="vedioLink" type="text" class="form-control">
                                </div>
                            </div>

                            <div class="row">
                                <label class="col-sm-2 control-label">相关报导：</label>
                                <div class="col-xs-10 col-md-9" id="relatedArtice">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">精彩内容：</label>
                                <div class="col-xs-10 col-md-9">
                                    <table id="goodArtTable"></table>
                                    <button class="btn btn-primary m-t-sm pull-right" type="button" onclick="page.eventHandler.goodArts.openAdd()">添加精彩内容</button>
                                </div>
                            </div>

                            <div class="hr-line-dashed"></div>
                            <div class="row text-center m-b">
                                <h2>信息流推送</h2>
                            </div>
                            <div id="objFeedPush" class="form-horizontal"></div>
                            <div class="hr-line-dashed"></div>
                            <div class="row text-center m-b">
                                <h2>手机设备推送</h2>
                            </div>
                            <div id="objMobilePush"></div>
                            <div class="hr-line-dashed"></div>
		                    <%--操作区--%>
		                    <div id="divAction" class="row m-t-lg text-center">
		                        <button id="btnPass" type="button" data-action="audit" disabled="disabled" class="btn btn-lg btn-primary dim m-l"><i class="glyphicon glyphicon-floppy-saved"></i>&nbsp;&nbsp;保存并审核通过</button>
		                        <button id="btnUpdatePass" type="button" data-action="release" disabled="disabled" class="btn btn-lg btn-primary dim m-l"><i class="glyphicon glyphicon-floppy-saved"></i>&nbsp;&nbsp;保存并审核通过</button>
		                        <button id="btnAudit" type="button" data-action="audit,add,edit" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;提交审核</button>
		                        <button id="btnSave" type="button" data-action="audit,add,edit" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="glyphicon glyphicon-floppy-save"></i>&nbsp;&nbsp;保存草稿</button>
		                        <button id="btnCancel" type="button" data-action="audit,release,add,edit" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
		                    </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
     </div>
  </body>
<%--     表单控件
    <link href="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
    富文本编辑器组件summernote
    <link href="<%=basePath%>static/lib/summernote/summernote.css" rel="stylesheet" />
    <link href="<%=basePath%>static/lib/summernote/summernote-bs3.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/summernote/summernote.min.js"></script>
    <script src="<%=basePath%>static/lib/summernote/summernote-zh-CN.js"></script>
    表单选择框组件
    <link href="<%=basePath%>static/lib/iCheck/custom.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/iCheck/icheck.min.js"></script>
    <link href="<%=basePath%>static/lib/bootstrap-fileinput/css/fileinput.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-fileinput/js/fileinput.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-fileinput/js/locales/zh.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-suggest/bootstrap-suggest.js"></script>
    通知组件
    <link href="<%=basePath%>static/lib/toastr/css/toastr.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/toastr/js/toastr.min.js"></script>
    表单验证组件
    <script src="<%=basePath%>static/lib/bootstrapValidator/bootstrapValidator.min.js"></script>
    <!--日期控件-->
    <link href="<%=basePath%>static/lib/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/datetimepicker/datetimepicker.min.js"></script>
    layer弹窗控件
    <link href="<%=basePath%>static/lib/layer/layer.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/layer/layer.js"></script>
    树组件
    <link href="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.js"></script>
    <script src="<%=basePath%>static/common/module/module.inputSelector.js?v=<%=StaticVersion%>"></script>
    对第三方组件的自定义插件扩展
    上传对接七牛
    <script src="<%=basePath%>static/common/helper.qiniu.js"></script>
    富文本编辑器对接七牛
    <script src="<%=basePath%>static/lib/toastr/customOptions.js"></script>
    扩展表单选择框组件的自动替换及切换功能面板插件
    <script src="<%=basePath%>static/lib/iCheck/icheck-toggle.js"></script>

    自定义组件
    推送组件
    <script src="<%=basePath%>static/common/module/module.push.js"></script>
    <script src="<%=basePath%>static/common/module/module.multSelector.js"></script>
    <script src="<%=basePath%>static/common/module/module.multSelector.returnOrig.js"></script>
    文件上传组件
    <script src="<%=basePath%>static/common/module/module.fileUpload.js"></script>
    富文本编辑器组件
    <script src="<%=basePath%>static/common/module/module.editor.js?v=<%=StaticVersion%>"></script>
    文章选择组件
    <script src="<%=basePath%>static/common/module/module.articleSelector.js"></script> --%>
    <%--页面css及js文件--%>

    <script src="<%=basePath%>static/page/CM/circleActivityHandle.js?v=<%=StaticVersion%>"></script>


</html>
