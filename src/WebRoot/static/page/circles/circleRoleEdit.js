//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'toastr', 'layer', 'datetimepicker', 'table', 'helper.qiniu', 'module.fileUpload', 'validator', 'module.multSelector', 'module.inputSelector'], function (bs, $, helper, iCheck, toastr) {
    var module = {
        fileUpload: require('module.fileUpload'),
        multSelector: require('module.multSelector'),
        inputSelector: require('module.inputSelector')
    };
//存储页面table对象
page.$rolesTable = $('#roleTable'); //角色表格
page.$managerTable = $('#managerTable'); //管理员表格

page.$roleModal = $('#roleModal'); //管理员表格
	page.$roleForm = $('#roleForm'); //管理员表格
		page.$roleName = $('#roleName'); //角色名称
		page.$roleType = $('#roleType'); //角色类型
		page.$roleMan = $('#roleMan'); //角色人员
	page.$panelSure = $('#panelSure'); //管理员确定按钮
	
/*console.log(pageList)
for(var i=0;i<pageList.length;i++){
	page.$roleType.append('<option value="'+i+'">pageList[i].name</option>');
}*/
//存储页面临时参数或者数据，//选择器选中的数据，即是新成员列表
page.userList = [];

//页面级的帮助对象集合
page.derive = {
    //获取表单参数包含搜索
    getParams: function (params) {
        params.circle_id = pageId;
        return params;
    },
    userRenderList: function(value){
    	var strHtml = '';
    	if(value===undefined)return false;
    	for(var i=0;i<value.length;i++){
    		strHtml += value[i].user_name;
    		if(i<value.length-1)strHtml+="、";
    	}
        return strHtml;
    },
    userRoleType: function(value){
    	switch(value){
			case 1: return "圈主";break;
			case 2: return "管理员";break;
			case 3: return "成员";break;
			default: return '';
		}
    },
    processUserList: function(data){
    	for(var i=0;i<data.length;i++){
    		data[i].sort = 1;
		}
    }
}

//页面所用到AJAX请求的URL
page.CONST = {
    GET_ROLELIST: helper.url.getUrlByMapping("admin/circle/circle_role_user.shtml"),   //获取角色接口   
   // GET_MANAGERLIST: helper.url.getUrlByMapping("admin/circle/circle_role_user.shtml?dictionaries_id=2"),   //获取管理员接口   
    UPDATE: helper.url.getUrlByMapping("admin/circle/update_circle_role_user.shtml"),
    MOVEUP: helper.url.getUrlByMapping("admin/circle/update_circle_role_sort.shtml"),    //角色顺序修改
    GET_USERLIST:  helper.url.getUrlByMapping("admin/backcommon/find_userlists.shtml?x=0&y=50"),   //获人员接口   
    DELETE:  helper.url.getUrlByMapping("admin/circle/delete_circle_role.shtml"),   //获人员接口       
}
page.userSelector=null;
page.selectedList=[];
//页面所用到AJAX请求的URL
page.MOCK = {
	_rolesTable:{ //角色表格数据
		rowData: {
			
		},
		selectedList:[]
	}     
}

//页面事件
page.eventHandler = {
	update: function(elem){		
		var type = page.$panelSure.attr('data-type');	//0表示新增，1表示修改
		var roleType = page.$roleType.attr('data-type');//3表示成员，2表示管理员	,1圈主
		for(var i=0;i<page.selectedList.length;i++){
			if(page.selectedList[i].user_id==undefined){
				page.selectedList[i].user_id=page.selectedList[i].key;
				page.selectedList[i].user_name=page.selectedList[i].value;
			}
		}
		var $table = (roleType==2)?page.$managerTable:page.$rolesTable;
		var temp = $table.bootstrapTable('getData');
	    if(type==1)page.derive.processUserList(page.MOCK._rolesTable.rowData.roleUserList);
	    var row = page.MOCK._rolesTable.rowData;
		if(type==0){ //新增操作
			temp = temp[temp.length-1];
		     $.ajax({
	             url: page.CONST.UPDATE,
	             type: 'POST',
	             data: {
	            	sort: temp.sort + 1,
	            	circle_id: pageId,
	             	name: page.$roleName.val(),
	             	insertCircleUserList: JSON.stringify(page.selectedList),
	             	dictionaries_id: roleType
	             },
	             dataType : 'json',
	             success : function(res) {
	                 if(res.code == 0){
	                     swal({title:"添加成功", text: "1s后自动消失...", type: "success", timer: 1000});
	                     $table.bootstrapTable('refresh');  
	                   //  $table.bootstrapTable('append', res.data); 
	                     page.$roleModal.modal('hide');       
	                 }else{
	                     swal("添加失败", res.errMsg, "error");
	                 }
	             },
	             error:function(res) {
	                 swal("添加失败", "error");
	             }
	         });
		}else{//修改操作
			//var temp = page.$rolesTable.bootstrapTable('getData');
			 $.ajax({
	             url: page.CONST.UPDATE,
	             type: 'POST',
	             data: {
	            	id:row.id,
	            	circle_id: pageId,
	             	name: page.$roleName.val(),
	             	deleteCircleUserList: JSON.stringify(row.roleUserList),
	             	insertCircleUserList: JSON.stringify(page.selectedList),
	             	dictionaries_id: roleType
	             },
	             dataType : 'json',
	             success : function(res) {
	                 if(res.code == 0){
	                     swal({title:"修改成功", text: "1s后自动消失...", type: "success", timer: 1000});
	                     $table.bootstrapTable('refresh');  
	                     //$table.bootstrapTable('updateByUniqueId', row.id, res.data);
	                     page.$roleModal.modal('hide');    
	                 }else{
	                     swal("修改失败", res.errMsg, "error");
	                 }
	             },
	             error:function(res) {
	                 swal("修改失败", "error");
	             }
	         });
			
		}
	},
	moveUp: function($table,value, row, index){	//上移操作

		  $('button').attr('disabled',true);
		  var data = $table.bootstrapTable('getData'); 
		  $.ajax({
              url: page.CONST.MOVEUP,
              type: 'POST',
              data: {
              		id: row.id,
              		sort: row.sort,
              		update_id: data[index-1].id,
      				update_sort: data[index-1].sort
              },
              dataType : 'json',
              success : function(ret) {
                  if(ret.code == 0){
                	  toastr.success('操作成功');  
	          	    	data[index] = data.splice(index-1,1,data[index])[0];
	        	    	$table.bootstrapTable('load',data); 
                  }else{
                	  toastr.error('操作失败');  
                  }
                  $('button').attr('disabled',false);
              },
              error:function(ret) {
            	  toastr.error('操作失败'); 
            	  $('button').attr('disabled',false);
              }
          });
	},
	delete: function(elem,$table,value, row, index){	//删除操作
		
		 swal({
	            title: "您确定要删除选中的信息吗？",
	            text: row.title,
	            type: "warning",
	            showCancelButton: true,
	            confirmButtonColor: "#18a689",
	            confirmButtonText: "删除",
	            cancelButtonText:'取消',
	            closeOnConfirm: false
	        }, function () {
	            swal({title: "删除中，请稍候", type: "info", showConfirmButton: false});
	            $.ajax({
	                url: page.CONST.DELETE,
	                type: 'POST',
	                data: {
	                		id: row.id,
	                		cirlce_id:pageId
	                },
	                dataType : 'json',
	                success : function(ret) {
	                    if(ret.code == 0){
	                    	swal({title:"删除成功", text: "1s后自动消失...", type: "success", timer: 1000});
	    	        	    $table.bootstrapTable('removeByUniqueId', row.id); 
	                    }else{
	                    	swal("删除失败", ret.errMsg, "error"); 
	                    }
	        
	                },
	                error:function(ret) {
	                	swal("删除失败", ret.errMsg, "error");
	            
	                }
	            });
	        });   
		 
	
		
	},
	openAddPanel: function(type,roleType,editParams){
		page.$panelSure.attr('data-type',type);//表示是修改打开的
		//type:0表示打开新增； 1表示打开修改
		//roleType:2管理员，3成员
	
		if(type==0){
			page.$roleName.val(''); //管理员表格
			page.$roleMan.val(''); //管理员表格
			page.MOCK._rolesTable.selectedList = [];
			page.selectedList = [];
		}else{
			page.$roleName.val(page.MOCK._rolesTable.rowData.name); //管理员表格   
			page.$roleMan.val(page.derive.userRenderList(page.MOCK._rolesTable.rowData.roleUserList));
			page.selectedList = page.MOCK._rolesTable.rowData.roleUserList;
			for(var i=0;i<page.selectedList.length;i++){
				page.selectedList[i].key=page.selectedList[i].user_id;
				page.selectedList[i].value=page.selectedList[i].user_name;
			}
		}
		page.$roleType.attr('data-type',roleType);//3表示成员，2表示管理员	,1圈主
		page.$roleType.val(page.derive.userRoleType(roleType));
		page.$roleModal.modal('show');
	},
	openUserSelect:function(){
		//初始化人员选择器
		page.userSelector = new module.multSelector({
			  url: page.CONST.GET_USERLIST+'&circleids='+pageId,
			  searchType: 1,
			  keyword: "",
			  method: "GET",
			  dataC: "data",
			  keywordC: "name",
			  keyC: "id",
			  valueC: "name",
			  tagsC: "user_identity",
			  pkeyC: "",
			  title: "人员列表",
			  selectedData:page.selectedList,
			  callback: function(data){
				  var usernames="";
				  page.selectedList=data;
				  for(var i=0;i<data.length;i++){
					  if(i==0)
						  usernames=data[i].value;
					  else
						  usernames=usernames+","+data[i].value;
				  }
				  page.$roleMan.val(usernames);
			  }
			});
	}
}

//初始化角色表格
page.$rolesTable.bootstrapTable({	
    detailView: false,
   // classes: 'table table-hover table-no-bordered',
    buttonsClass: 'default btn-outline',
    url: page.CONST.GET_ROLELIST,//传入的URL
    dataField: "data",//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
    //height: 400,//高度
    toolbar:'#roleTableTools',
    showColumns: true,
    showRefresh: true,
    pagination: true,//是否分页
    pageSize: 10,//单页记录数
    pageList: [20,60,100],//分页步进值
    sidePagination: "server",//服务端分页	
    contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
    dataType: "json",//期待返回数据类型
    method: "get",//请求方式
    undefinedText: "—",//为空的填充字符
    uniqueId: 'id',
    queryParamsType: "limit",//查询参数组织方式
    queryParams: function (params) {
        return page.derive.getParams(params);
    },
    columns: [{
        field: 'dictionaries_id',
        title: '角色类型',
        align: 'center',
        formatter: function(value, row, index){
        	return page.derive.userRoleType(value);
        }
    }, {
        field: 'name',
        title: '角色名',
        align: 'center'
    }, {
        field: 'roleUserList',
        title: '成员',
        align: 'center',
        formatter:function(value, row, index){
        	return page.derive.userRenderList(value);    
	    },
    },{
        title: '操作',
        align: 'center',
        width: '200px',
        formatter:function(value, row, index){
        	var strHtml = ' <button type="button" class="edit btn btn-sm btn-info">修改</button>';
        		strHtml += (index===0||index===1)?'': ' <button type="button" class="moveUp btn btn-sm btn-outline btn-default">上移</button>';
        		strHtml += index===0?'': ' <button type="button" class="del btn btn-sm btn-danger">删除</button>';
            return strHtml;
	    },
	    events: {
	        'click .edit': function (e, value, row, index) {     //修改
	        	page.$panelSure.attr('data-value',value).attr('data-index',index);    
	        	page.MOCK._rolesTable.rowData = row;
	        	
	        	page.MOCK._rolesTable.selectedList = row.roleUserList;
	    		//page.userList = row.roleUserList;
//	    		page.eventHandler.update(page.userList);
	        	page.eventHandler.openAddPanel(1,row.dictionaries_id);
	        	
	       	 	page.$roleType.attr('data-type',row.dictionaries_id);//3表示成员，2表示管理员	,1圈主
	        	//	console.log(e, value, row, index)
	        	//page.eventHandler.edit(this, value, row, index)     
	        },
	        'click .moveUp': function (e, value, row, index) {     //上移
	        	page.eventHandler.moveUp(page.$rolesTable, value, row, index);  
	        },
	        'click .del': function (e, value, row, index) {     //恢复
	        	page.eventHandler.delete(this, page.$rolesTable,value, row, index)     
	        }
	    }
    }]
});

//初始化管理员表格
page.$managerTable.bootstrapTable({	
    detailView: false,
   // classes: 'table table-hover table-no-bordered',
    buttonsClass: 'default btn-outline',
    url: page.CONST.GET_ROLELIST+'?dictionaries_id=2',//传入的URL
    dataField: "data",//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
   // height: 400,//高度
    //toolbar:'#tableTools',
    showColumns: true,
    showRefresh: true,
    pagination: true,//是否分页
    pageSize: 20,//单页记录数
    pageList: [20,60,100],//分页步进值
    sidePagination: "server",//服务端分页	
    contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
    dataType: "json",//期待返回数据类型
    method: "get",//请求方式
    undefinedText: "—",//为空的填充字符
    uniqueId: 'id',
    queryParamsType: "limit",//查询参数组织方式
    queryParams: function (params) {
        return page.derive.getParams(params);
    },
    columns: [{
        field: 'dictionaries_id',
        title: '管理员',
        align: 'center',
        formatter: function(value, row, index){
        	return page.derive.userRoleType(value);
        }
    }, {
        field: 'roleUserList',
        title: '成员',
        align: 'center',
        formatter:function(value, row, index){
        	return page.derive.userRenderList(value);    
	    },
    },{
        title: '操作',
        align: 'center',
        formatter:function(value, row, index){
            	var strHtml = ' <button type="button" class="edit btn btn-sm btn-info">修改</button>';
                return strHtml;
    	},	    
    	events: {
    		'click .edit': function (e, value, row, index) {     //修改
	        page.$panelSure.attr('data-value',value).attr('data-index',index);    
	        page.MOCK._rolesTable.rowData = row;
	        page.MOCK._rolesTable.selectedList = row.roleUserList;
	        page.eventHandler.openAddPanel(1,row.dictionaries_id);
	       	page.$roleType.attr('data-type',row.dictionaries_id);//3表示成员，2表示管理员	,1圈主 
	    }
	    }
    }]
}); 
}); 




