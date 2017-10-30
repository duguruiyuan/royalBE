<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>编辑角色权限</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../../include/amdInclude.jsp"%>
</head>
  <body>
    <div class="wrapper wrapper-content animated">
    <div class="ibox float-e-margins">
        <div class="ibox-title">
             <h3>角色管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">编辑角色权限</small></h3>
        </div>
        <div class="ibox-content">
	        <form id="frmAddCiphertext" class="form-horizontal" action="javascript:;">
                <div class="row text-center m-b">
                    <h2>菜单列表</h2>
                </div>
                <div class="form-group">
                    <label class="col-sm-4 control-label"></label>
                    <div class="col-sm-5">
				      	<input type="hidden" id="roleid" name="roleid" value="${data.roleid}">
				      	<input type="hidden" id="menuids" name="menuids" value="${data.menuids}">
				      	<div id="menuview"></div>
                    </div>
                 </div>
			      <div id="divAction" class="row m-t-lg text-center">
				      <button id="save_btns" onclick="getselectmenus()" type="button" class="btn btn-lg btn-info dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;保存</button>
				      <button id="btnCancel" type="button" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
			      </div>
	        </form>
        </div>
      </div>
    </div>
<%--     <script src="<%=basePath%>js/jquery.min.js?v=2.1.4"></script>
    <script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>
	<script src="<%=basePath%>static/common/helper.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.js"></script> --%>
    <script type="text/javascript">
        var addressData = [];
        var menulist = ${allmenu};
        require(['base', 'jquery', 'helper', 'toastr', 'validator','treeview'], function (bs, $, helper, toastr,treeview) {
        $(document).ready(function(){
            $('#menuview').treeview({data: menulist,showCheckbox:true,levels:1}); 
        // 	docheck();
            //取消
            $("#btnCancel").click(helper.win.close);
            
            //选择事件
            $('#menuview').on('nodeChecked', function(event, data) {
            	//选中父节点
            	var nodeId = data.nodeId;
            	var parentnode = $('#menuview').treeview('getParent', nodeId);
            	if(parentnode.nodeId!=undefined){
            	  	nodeId = parentnode.nodeId;
              	    $('#menuview').treeview('checkNode', [ nodeId, { silent: true } ]);
              	    parentnode = $('#menuview').treeview('getParent', nodeId);
	              	if(parentnode.nodeId!=undefined){
	              		nodeId = parentnode.nodeId;
	              	  	$('#menuview').treeview('checkNode', [ nodeId, { silent: true } ]);
	            	}
            	}
            	//选中子节点
            	var nodes=data.nodes;
            	if(nodes!=undefined){
            		for(var i=0;i<nodes.length;i++){
            			$('#menuview').treeview('checkNode', [ nodes[i].nodeId, { silent: true } ]);
            			var nodes1=nodes[i].nodes;
                    	if(nodes1!=undefined){
                    		for(var j=0;j<nodes1.length;j++){
                    			$('#menuview').treeview('checkNode', [ nodes1[j].nodeId, { silent: true } ]);
                    		}
                    	}
            		}
            	}
            });
            
            //取消选择事件
            $('#menuview').on('nodeUnchecked', function(event, data) {
            	//取消选中子节点
            	var nodes=data.nodes;
            	if(nodes!=undefined){
            		for(var i=0;i<nodes.length;i++){
            			$('#menuview').treeview('uncheckNode', [ nodes[i].nodeId, { silent: true } ]);
            			var nodes1=nodes[i].nodes;
                    	if(nodes1!=undefined){
                    		for(var j=0;j<nodes1.length;j++){
                    			$('#menuview').treeview('uncheckNode', [ nodes1[j].nodeId, { silent: true } ]);
                    		}
                    	}
            		}
            	}
            	
            	//判断是否全部取消
            	var isuncheckall = true;
            	var nodeId = data.nodeId;
            	var parentnode = $('#menuview').treeview('getParent', nodeId);
            	if(parentnode.nodeId!=undefined){
            		for(var i=0;i<parentnode.nodes.length;i++){
            			var checked = parentnode.nodes[i].state.checked;
            			if(checked){
            				isuncheckall = false;
            				break;
            			}
            		}
            		if(isuncheckall){
            			$('#menuview').treeview('uncheckNode', [ parentnode.nodeId, { silent: true } ]);
            			//继续查询上一级
            			nodeId = parentnode.nodeId;
            			parentnode = $('#menuview').treeview('getParent', nodeId);
            			if(parentnode.nodeId!=undefined){
                    		for(i=0;i<parentnode.nodes.length;i++){
                    			var checked = parentnode.nodes[i].state.checked;
                    			if(checked){
                    				isuncheckall = false;
                    				break;
                    			}
                    		}
                    		if(isuncheckall){
                    			$('#menuview').treeview('uncheckNode', [ parentnode.nodeId, { silent: true } ]);
                    		}else{
                    			return;
                    		}
            			}
            		}else{
            			return;
            		}
            	}
            	
          	   console.log(data);
          });
        });
        });
        function getselectmenus(){
        	var aa=""; 
        	var nodes = $('#menuview').treeview(true).getChecked();
        	for(var i=0;i<nodes.length;i++){
        		var node = nodes[i];
        		var id = node.id;
        		if(aa=="")
        			aa=id;
        		else
        			aa = aa+','+id;
        	}
    		$.ajax({
    			url: '<%=basePath%>admin/role/update_rolemenuinfo.shtml',
    			data: {
    				roleid: $("#roleid").val(),
    				menuids: aa
    			},
    			type: 'post',
    			dataType: 'json',
    			success: function(res){
    				if(res.code == 0){
    					helper.win.changeQuoto({msg: "操作成功!", relation: "role/index.shtml"});
    				}else if(res.code == 1){
    					swal('操作失败',res.errMsg,'error');
    				}
    			},
    			error: function(xhr){
    				console.log(xhr);
    			}
    		});
        }
        function docheck(){
        	var menuids = $("#menuids").val();
        //	$('#treeview').treeview('checkAll', { silent: true });
        //	return;
        	if(menuids!=""){
        		var arrmenu = menuids.split(',');
        		var i=0;
        		for(i=0;i<arrmenu.length;i++){
        			var id = arrmenu[i];
        			$('#treeview').treeview('checkNode', [ id, { silent: true } ]);
        			var node = $('#treeview').treeview('getNode', id);
        			console.log(node);
        		}
        	}
        }
    </script>
  </body>
</html>