<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>观点新增-商帮帮后台</title>
    <%@ include file="../include/amdInclude.jsp"%>
  </head>
  <body class="gray-bg">
    <div class="wrapper wrapper-content animated">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>观点管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">代发观点</small></h3>
            </div>
		    <form id="frmAddComment" class="form-horizontal">
	           <!--  <div class="form-group" id="selectText">
	                <label class="col-sm-2 control-label">话题：</label>
	                <div class="col-sm-9">
				        <div class="form-control" id="topictitle">
				        
	                	</div>
	                </div>
	            </div> -->
                <div class="row">
                    <label class="col-sm-2 control-label text-right">话题：</label>
	                 <div class="col-xs-10 col-md-9 text-left" id="linkContainer">
	                     
	                 </div>
                </div>
	            <div class="form-group has-success">
                    <label class="col-sm-2 control-label">观点类型：</label>
                    <div class="col-sm-9">
                        <label for="radType1" class="radio i-checks radio-inline" data-value="0">
                            <input id="radType1" name="radType" type="radio" value="0" checked="checked" data-toggle="" />文字
                        </label>
                        <label for="radType2" class="radio i-checks radio-inline" data-value="1">
                            <input id="radType2" name="radType" type="radio" value="1" data-toggle="#typVoice" />语音
                        </label>
                    </div>
                </div>
<!-- 	            <div class="form-group">
	                <label class="col-sm-2 control-label">用户：</label>
	                <div class="col-sm-9" id="selectUser">
                        
                    </div>
	            </div> -->
	            <div class="form-group">
	                <label class="col-sm-2 control-label">用户：</label>
                        <div class="col-sm-9">
                            <select id="guestUser" name="guestUser" class="form-control">
                                <option value="0">加载中,请稍候...</option>
                            </select>
                        </div>
	            </div>
	            <div class="form-group" id="typVoice">
			        <label class="col-sm-2 control-label">语音：</label>
			        <div class="col-sm-9">
			            <input id="fileSelector" type="file" multiple name="file" />
			        </div>
			    </div>
			    <div class="form-group" id="typVoicePrompt" style="display:none">
			        <label class="col-sm-2 control-label"></label>
			        <div class="col-sm-9" style="color:#a94442">语音必须上传</div>
			    </div>
			    <div class="form-group" id="typVoicePrompt1" style="display:none">
			        <label class="col-sm-2 control-label"></label>
			        <div class="col-sm-9" style="color:#a94442">语音时长要小于60秒</div>
			    </div>
			    <div class="form-group">
			        <label class="col-sm-2 control-label" id="type-title">观点内容：</label>
			        <div class="col-sm-9">
			            <textarea class="form-control" rows="3" cols="30" id="content" name="content"></textarea>
			            <small class="help-block" data-bv-validator="notEmpty" data-bv-for="content" data-bv-result="NOT_VALIDATED" style="display: none;">观点内容不能为空</small>
			        </div>
			    </div>
			    <div class="row m-t-lg text-center" id="divAction">
	                <button id="comment-success" type="button" class="btn btn-lg btn-primary dim m-l"><i class="glyphicon glyphicon-floppy-saved"></i>&nbsp;&nbsp;确定新增</button>
	                <button id="btnCancel" type="button" data-action="audit,add,edit" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
	            </div>
		    </form>
        </div>
    </div>
<!--      <div class="wrapper wrapper-content animated fadeInRight">
	  	 <div class="row">
	            <div class="col-sm-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h3>内容管理 > 圈子话题 > 观点管理 > 代发观点</h3>
                    </div>
             		<div class="ibox-content">
             		  <form class="form-horizontal">
                            <div class="form-group">
                                <label class="col-sm-2 control-label">名称</label>
                          		<div class="col-xs-10 col-md-8"> 
                                      <div class="form-group"> 
				                        <div class="col-sm-8 col-offset-4">
				                            <label for="radType1" class="radio i-checks radio-inline">
				                                <input id="radType1" name="radType" type="radio" value="1" checked="checked" />文字
				                            </label>
				                            <label for="radType2" class="radio i-checks radio-inline">
				                                <input id="radType2" name="radType" type="radio" value="0" />语音
				                            </label>
				                        </div>
				                    </div>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">用户</label>
      						     <div class="col-xs-10 col-md-8"> 
      						       	<div class="input-group">
                                        <input id="guest" type="text" name="guest" readonly class="form-control"> <span class="input-group-btn"> 
                                        <button onclick="page.guestSelector.openSelector()"  type="button" class="btn btn-primary">点击选择用户
                                        </button> </span>
                                    </div>
                                </div>
                            </div>
                 			<div class="hr-line-dashed"></div>
                            <div id="audioContainer"  class="collapse">
	                            <div class="form-group">
	                                <label class="col-sm-2 control-label">语音</label>
	                                <div class="col-xs-10 col-md-8"> 
	                                	<div class="input-group">
	                                        <input id="audio" type="file" readonly class="form-control"> <span class="input-group-btn"> <button type="button" class="btn btn-primary">点击选择文件
	                                        </button> </span>
	                                    </div>
	                                </div>
	                            </div>
	                            <div class="hr-line-dashed"></div>
              				</div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">观点内容</label>
                                 <div class="col-xs-10 col-md-8"> 
                                    <textarea id="opinions" name="opinions" rows="6" type="text" style="resize: vertical;" class="form-control"></textarea>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <div class="col-sm-4 col-sm-offset-2">
                                    <button class="btn btn-primary" type="button" onclick="page.eventHandler.post(this)">发送</button>
                                </div>
                            </div>
                        </form>
					</div>
		    	</div>
		 	</div>
 		</div>
	</div>	 -->
  </body>

	<script src="<%=basePath%>static/page/CM/circleTopicOpinionsAdd.js?v=<%=StaticVersion%>"></script>
</html>
