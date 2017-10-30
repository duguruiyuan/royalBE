<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增圈子角色</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../../include/amdInclude.jsp"%>
</head>
  <body>
    <div class="wrapper wrapper-content animated">
    <div class="ibox float-e-margins">
        <div class="ibox-title">
             <h3>圈子角色管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">新增圈子角色</small></h3>
        </div>
        <div class="ibox-content">
	        <form id="frmAddCiphertext" class="form-horizontal">
                <div class="row text-center m-b">
                    <h2>基本信息</h2>
                </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">角色名称</label>
                    <div class="col-sm-5">
                        <input class="form-control" id="name" type="text" name="name">
                    </div>
                 </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">角色类型</label>
                    <div class="col-sm-5">
				        <select id="roletype" name="roletype" class="form-control"></select>
                    </div>
                 </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label">角色排序</label>
                    <div class="col-sm-5">
				        <input id="sort" name="sort" type="number" class="form-control">
                    </div>
                 </div>
			      <div id="divAction" class="row m-t-lg text-center">
				      <button id="preservation_user" type="button" class="btn btn-lg btn-info dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;保存圈子角色</button>
				      <button id="btnCancel" type="button" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
			      </div>
	        </form>
        </div>
      </div>
    </div>
<%--     表单选择框组件
    <link href="<%=basePath%>static/lib/iCheck/custom.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/iCheck/icheck.min.js"></script>
    上传组件
    <link href="<%=basePath%>static/lib/bootstrap-fileinput/css/fileinput.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-fileinput/js/fileinput.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-fileinput/js/locales/zh.js"></script>
    通知组件
    <link href="<%=basePath%>static/lib/toastr/css/toastr.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/toastr/js/toastr.min.js"></script>
    表单验证组件
    <script src="<%=basePath%>static/lib/bootstrapValidator/bootstrapValidator.min.js"></script>
    layer弹窗控件
    <link href="<%=basePath%>static/lib/layer/layer.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/layer/layer.js"></script> --%>
    <script type="text/javascript">
        var addressData = [];
        require(['base', 'jquery', 'helper', 'toastr', 'validator'], function (bs, $, helper, toastr) {
        //圈角色类型
        $.ajax({
        	url: '<%=basePath%>admin/circlerole/get_circletyperole.shtml',
        	type: 'post',
    		dataType: 'json',
    		success: function(res){
    			if(res.code == 0){
    				var result = res.data;
    				var arr = ['<option value="">请选择</option>'];
    				for(var i = 0; i < result.length; i++){
    					arr.push('<option value="'+result[i].code+'">'+result[i].name+'</option>');
    				}
    				$('#roletype').empty().append(arr.join(''));
    			}else{
    				alert('错误');
    			}
    		},
    		error: function(xhr){
    			console.log(xhr);
    		}
        });
        $(document).ready(function(){
        	//保存
        	$("#preservation_user").on('click',function(){
            	if(!checkdata())
            		return;
        		$.ajax({
        			url: '<%=basePath%>admin/circlerole/insert_circlerole.shtml',
        			data: {
        				name: $("#name").val(),
        				roletype: $("#roletype").val(),
        				usertype: 2,
        				sort :$("#sort").val()
        			},
        			type: 'post',
        			dataType: 'json',
        			success: function(res){
        				console.log(res);
        				if(res.code == 0){
        					helper.win.changeQuoto({msg: "操作成功!", relation: "circlerole/index.shtml"});
        				}else{
        					toastr.error("添加失败!", res.errMsg);
        				}
        			},
        			error: function(xhr){
        				console.log(xhr);
        			}
        		});
        	});

            //取消
            $("#btnCancel").click(helper.win.close);
        });
        });
        function checkdata(){
        	var name = $('#name').val();
        	var roletype = $('#roletype').val();
        	var sort = $('#sort').val();
        	if(name==""){
        		$('#name').focus();
				toastr.error("添加失败!", '圈角色名称不能为空');
        		return false;
        	}
        	if(roletype==""){
				toastr.error("添加失败!", '请选择圈角色类型');
        		return false;
        	}
        	if(sort==""||sort<0){
            		$('#sort').focus();
					toastr.error("添加失败!", '请输入圈角色排序');
            		return false;
            }
        	return true;
        }
    </script>
  </body>
</html>