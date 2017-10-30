<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String id = request.getParameter("id");
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="zh_cn">
	<head>
    	<meta charset="utf-8">
    	<title>商会资讯明细</title>
    	<%@ include file="../head-meta.jsp"%>
    	<%@ include file="../head-link.jsp"%>
    	<style>
    	.help-block {
		    margin-top: 0;
		}
		.modal-body {
		    padding: 20px 30px;
		}
    	</style>
	</head>
  
	<body class="gray-bg" style="background:#fff;padding-top:20px">
       <form id="addprojectForm" class="form-horizontal" novalidate="novalidate">
        	<div class="modal-body" id="projectForm">
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">手机提醒</label>
        				<div class="col-xs-9">
            				<span id="TITLE"></span>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">消息主体</label>
        				<div class="col-xs-9">
            				<span id="content"></span>
        				</div>
    				</div>
    				<div class="form-group">
        				<label class="col-xs-2 control-label ">推送对象</label>
        				<div class="col-xs-9">
            				<div class="row">
						        <div class="col-md-9">
						          <div class="row" id="reminderObject" >
						            <div id="all" class="col-md-3 text-align"  style="display: none">
						              	 全部用户
							        </div>
						          </div>
						          <div class="row" style="display: none" id ="part">
						            <div class="row" style="display: none" id ="sh" >
						              <div class="col-md-3 text-align">商会：</div>
						              <div class="col-md-6">
						                <span id="shanghui"></span>
						              </div>
						            </div>
						            <div class="row" style="display: none" id ="hy">
						             <div class="col-md-3 text-align">行业：</div>
						             <div class="col-md-6">
						                 <span id="industry"></span>
						             </div>
						            </div>
						            <div class="row" style="display: none" id ="dq">
						              <div class="col-md-3 text-align">地区：</div>
						              <div class="col-md-6">
						                 <span id="region"></span>
						              </div>
						            </div>
						            <div class="row" style="display: none" id ="jg">
						              <div class="col-md-3 text-align">籍贯：</div>
						              <div class="col-md-6">
						                  <span id="nativeplace"></span>
						              </div>
						            </div>
						            <div class="row" style="display: none" id ="yhz">
						              <div class="col-md-3 text-align">用户组：</div>
						              <div class="col-md-6">
						                  <span id="usergroup"></span>
						              </div>
						            </div>
						            <div class="row" style="display: none" id ="yh">
						              <div class="col-md-3 text-align">用户：</div>
						              <div class="col-md-5">
						                  <span id="user"></span>
						              </div>
						            </div>
						            <div class="row" style="display: none" id ="qz">
						              <div class="col-md-3 text-align">圈子：</div>
						              <div class="col-md-6">
						                  <span id="circle"></span>
						              </div>
						            </div>
						          </div>
						        </div>
						      </div>
        				</div>
    				</div>
        		</div>
			</form>
        	
    	<!-- 全局js -->
    	<%@ include file="../script.jsp"%>
    	<script>
    		var id = <%=id%>;
    	</script>
    	<script src="<%=basePath%>js/global.js"></script>
		<script >
			$(function () {
				//获取修改记录信息
				 $.ajax({
			         url:'<%=basePath%>admin/pushDevice/find_deviceinfo.shtml',
			         dataType: 'json',
			         type: 'post',
			         data:{
			             "id":id
			         },
			         success:function(res){
			       	  	if(res.code == 0){
			       	  		$('#TITLE').html(res.data.title_imei);
					        $('#content').html(res.data.content_imei);
			       	  		if(res.data.all_user == '1'){
			       	  			$('#all').css('display','');
			       	  		}
			       	  		if(res.data.all_user == '0'){
			       	  			
			       	  			$('#part').css('display','');
			       	  			if(res.data.sh_names){
			       	  				$('#sh').css('display','');
			       	  				$('#shanghui').html(res.data.sh_names);
			       	  			}
			       	  			if(res.data.industry_names){
			       	  				$('#hy').css('display','');
			       	  				$('#industry').html(res.data.industry_names);
			       	  			}
			       	  			if(res.data.region_names){
			       	  				$('#dq').css('display','');
			       	  				$('#region').html(res.data.region_names);
			       	  			}
			       	  			if(res.data.nativeplace_names){
			       	  				$('#jg').css('display','');
			       	  				$('#nativeplace').html(res.data.nativeplace_names);
			       	  			}
			       	  			if(res.data.usergroup_names){
			       	  				$('#yhz').css('display','');
			       	  				$('#usergroup').html(res.data.usergroup_names);
			       	  			}
			       	  			if(res.data.user_names){
			       	  				$('#yh').css('display','');
			       	  				$('#user').html(res.data.user_names);
			       	  			}
			       	  			if(res.data.circle_names){
			       	  				$('#qz').css('display','');
			       	  				$('#circle').html(res.data.circle_names);
			       	  			}
					            
					            
			       	  		}
				       	  	
				            
			           	}
			         },
			         error: function(res){
			              
			         }
			     });
			})
		</script>
  	</body>
</html>
