//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'datetimepicker', 'table'], function (bs, $, helper, swal, layer) {
//页面所用到AJAX请求的URL
page.CONFIG = {
    GET_LIST: helper.url.getUrlByMapping("admin/manager/find_userinfolists.shtml"),     //查询用户列表
    DELETE: helper.url.getUrlByMapping("admin/manager/delete_userinfo.shtml"),          //删除用户接口
    UPDATE: helper.url.getUrlByMapping("admin/manager/editmanager.shtml")               //修改用户url
};

//存储页面table对象
page.$tool = $('#tableTools');
page.$table = $('#tableList');

/**
 * 提供给引用页面刷新用，如果未声明该方法，则引用页面调用将使用浏览器重载重新刷新本页面
 */
page.refresh = function () {
    $("#btnSearch").click();
};
var i=0;
//页面级的帮助对象集合
page.derive = {
    //获取表单参数用于搜索
    getParams: function (params) {
        params.status = $("#statusserch").val();
        params.username = $("#nameserch").val();
        params.x = params.offset;   //服务端分页，过滤掉前xxx条记录
        params.y = params.limit;    //服务端分页，每页记录数

        return params;
    },

    //获取提供给表格位置的自适应浏览器的高度，最小高度500
    getAdaptTableHeight: function () {
        var height = $(window).height() - page.$tool.offset().top - page.$tool.outerHeight() - 30;
        return height >= 500 ? height : 500;
    }
};

//页面事件
page.eventHandler = {
    //新增用户
    showAdd: function () {
        helper.win.open({name: "新增用户",url: "manager/addmanager.shtml"});
    },

    //打开编辑
    showEdit: function (id) {
        helper.win.open({name: "编辑用户", url: page.CONFIG.UPDATE + "?id=" + id});
    },

    //删除用户
    delete: function (id) {
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        swal({
            title: "您确定要删除选中的信息吗？",
            text: rowDate.title,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "删除",
            cancelButtonText:'取消',
            closeOnConfirm: false,
            showLoaderOnConfirm :true
        }, function () {
            swal({title: "删除中，请稍候", type: "info", showConfirmButton: false});
            $.ajax({
                url: page.CONFIG.DELETE,
                type : 'POST',
                data: {
                    id: id,
                    status: 2
                },
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                        swal({title:"删除成功", text: "1s后自动消失...", type: "success", timer: 1000});
                        page.$table.bootstrapTable('remove', {
                            field: "id",
                            values: id
                        });
                        page.$table.bootstrapTable('removeByUniqueId', id);
                        page.$table.bootstrapTable('refresh');
                    }else{
                        toastr.error('删除失败', res.errMsg);
                    }
                },
                error:function(ret) {
                    toastr.error('删除失败', "error");
                }
            });
        });
    },
    stopData: function (id){
    	swal({
    		title: "您确定要停用此用户吗",
         text: "",
         type: "warning",
         showCancelButton: true,
         confirmButtonColor: "#DD6B55",
         confirmButtonText: "停用",
         cancelButtonText: "取消",
         closeOnConfirm: false,
         closeOnCancel: false,
         showLoaderOnConfirm :true
        }, function (isConfirm) {
        	if (isConfirm) {
        		$.ajax({
    	    		url: 'stop_userinfo.shtml',
    	    		data: {
    	    			id: id,
    	    			status:2
    	    		},
    	    		type: 'post',
    	    		success: function(res){
        				swal({
        					title: '停用成功',
        					type: 'success'
        				},function(){
        					location.reload();
        				});
    	    		},
    	    		error: function(error){
                        toastr.error('操作失败！', "error");
    	    		}
    	    	});
         } else {
             swal("已取消", "您取消了停用操作！", "error");
         }
        });
    },
    startData: function (id){
    	swal({
    	  title: "您确定要启用此用户吗",
    	  text: "",
    	  type: "warning",
    	  showCancelButton: true,
    	  confirmButtonColor: "#DD6B55",
    	  confirmButtonText: "启用",
    	  cancelButtonText: "取消",
    	  closeOnConfirm: false,
    	  closeOnCancel: false,
          showLoaderOnConfirm: true
    	    }, function (isConfirm) {
    	    	if (isConfirm) {
    	    		$.ajax({
    		    		url: 'stop_userinfo.shtml',
    		    		data: {
    		    			id: id,
    		    			status:1
    		    		},
    		    		type: 'post',
    		    		success: function(res){
    	    				swal({
    	    					title: '启用成功',
    	    					type: 'success'
    	    				},function(){
    	    					location.reload();
    	    				});
    		    		//	swal("启用成功！", "您已经重新启用了这个账号。", "success");
    		    		},
    		    		error: function(error){
                            toastr.error('操作失败！', "error");
    		    		}
    		    	});
    	  } else {
    	      swal("已取消", "您取消了启用操作！", "error");
    	  }
    	 });	
    	},
    	viewData: function (id){
    		  $.ajax({
    			  url: 'get_userinfo.shtml',
    			  data: {id: id},
    			  type: 'post',
    			  dataType: 'json',
    			  success: function(res){
    				  var result = res.userInfo;
    			  var arr = [];
    			  arr.push('<tr><td>id</td><td>'+result.id+'</td></tr>');
    			  arr.push('<tr><td>账号</td><td>'+result.username+'</td></tr>');
    			  arr.push('<tr><td>姓名</td><td>'+result.realname+'</td></tr>');
    			  arr.push('<tr><td>角色</td><td>'+result.rolename+'</td></tr>');
    			  if(result.status=='1')
    			  	  arr.push('<tr><td>账号状态</td><td>正常</td></tr>');
    			  else
    				  arr.push('<tr><td>账号状态</td><td>停用</td></tr>'); 
    			  $('#user_info_content').empty().append(arr.join(''));
    			  },
    			  error: function(xhr){
    				  console.log(xhr);
    			  }
    		  });
    	}
};

$(document).ready(function () {
    //初始化日期控件
    $('.form_date').datetimepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: true,
        startView: 2,
        minView: 2,
        forceParse: true
    }).on("click", function (e) {
        //设置日期控件前后日期的依赖
        var $this = $(e.target);
        if($this.attr("data-start")){
            $this.datetimepicker("setStartDate", $($this.attr("data-start")).val());
        }
        if($this.attr("data-end")){
            $this.datetimepicker("setEndDate", $($this.attr("data-end")).val());
        }
    });

    //表格初始化
    page.$table.bootstrapTable({
        //请求相关
        url: page.CONFIG.GET_LIST,  //AJAX读取列表数据的URL
        method: "get",                  //请求方式
        contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
        dataType: "json",               //服务器返回数据类型
        cache: false,                   //不缓存数据
        queryParamsType: "limit",       //查询参数组织方式
        queryParams: function (params) {
            return page.derive.getParams(params);
        },

        //分页相关
        pagination: true,            //是否分页
        pageNumber:1,                //初始化加载第一页，默认第一页
        pageSize: 10,                //每页的记录行数（*）
        pageList: [10, 50, 100],     //允许选择的每页的数量切换
        sidePagination: "server",    //分页方式：client客户端分页，server服务端分页（*）

        //表格总体外观相关
        height: page.derive.getAdaptTableHeight(),            //整个表格的高度
        detailView: false,      //是否显示父子表
        cardView: false,        //是否显示详细图
        undefinedText: "—",     //当数据为空的填充字符
        showColumns: true,      //是否显示筛选列按钮
        showRefresh: true,      //是否显示刷新按钮
        clickToSelect: true,    //是否开启点击选中行,自动选择rediobox 和 checkbox
        toolbar:'#tableTools',  //工具按钮的容器
        //classes: 'table table-hover table-no-bordered',
        //buttonsClass: 'default btn-outline',

        //表格内容相关设置
        idField:"id",       //当前行主键的id值
        uniqueId:'id',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
        dataField: "data",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
        columns: [{
            field: 'username',
            title: '登录账号',
            formatter: function (value, data) {
            	return '<a href="javascript:;" class="user-info-demo" data-toggle="modal" data-target="#user_info" onclick="viewData('+data.id+')">'+value+'</a>';
            },
            align: 'left'
        },{
            field: 'realname',
            title: '姓名',
            width: "150px",
            align: 'center'
        },{
            field: 'rolename',
            title: '角色',
            width: "150px",
            align: 'center'
        },{
            field: 'createtime',
            title: '创建时间',
            width: "250px",
            formatter: function(value, data, index){
            	return helper.convert.formatDate(value);
            },
            align: 'center'
        },{
            field: 'status',
            title: '账户状态',
            width: "150px",
            formatter: function(value){
            	switch(value){
            	    case 1: return '正常';
            	    case 2: return '停用';
            	}
            },
            align: 'center'
        },{
            field: ' ',
            title: '操作',
            align: 'center',
            width: "250px",
            formatter:function(value, row){
            	var strHtml='';
                strHtml+=' <button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.showEdit(' + row.id + ')">编辑</button>';
            	if(row.status=='1')
            		 strHtml+=' <button type="button" class="btn btn-sm btn-warning"  onclick="page.eventHandler.stopData('+row.id+')">停用账号</button>';
            	else
            		 strHtml+=' <button type="button" class="btn btn-sm btn-warning"  onclick="page.eventHandler.startData('+row.id+')">启用账号</button>';
            	if(row.id==1)
            		strHtml+=' <button type="button" disabled class="btn btn-sm btn-danger">删除</button>';
            	else
            		strHtml+=' <button type="button" class="btn btn-sm btn-danger"  onclick="page.eventHandler.delete('+row.id+')">删除</button>';
                return strHtml;
            }
        }]
    });

    $("#nameserch").keyup(function (event) {
        if(event.keyCode == 13)
            $("#btnSearch").click();
    });
    //新增用户操作
    $("#btnAdd").click(page.eventHandler.showAdd);
    
    //搜索
    $("#btnSearch").click(function(){
        var params = page.$table.bootstrapTable('getOptions');
        params = page.derive.getParams(params);

        page.$table.bootstrapTable('refresh',params);
    });

    $(window).resize(function () {
        page.$table.bootstrapTable("resetView", {height: page.derive.getAdaptTableHeight() + 10});
    })
});

});
