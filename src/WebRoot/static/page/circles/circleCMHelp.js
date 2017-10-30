//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastr', 'datetimepicker', 'table'], function (bs, $, helper, swal, layer, toastr) {
//存储页面table对象
page.$table = $('#tableList');
	page.$keyword = $('#keyword');//搜索框

//页面级的帮助对象集合
page.derive = {
    //获取表单参数包含搜索
    getParams: function (params) {
        params.status = 1;
        params.circle_id = pageId;//页面传入时的id
        params.x = params.offset;//根据后台接口需要替换分页参数
        params.y = params.limit;//根据后台接口需要替换分页参数
        if(page.$keyword.val()!=="")params.title =page.$keyword.val();//搜索值
        return params;
    }
};

//页面所用到AJAX请求的URL
page.ajaxUrl = {
    GET_LIST: helper.url.getUrlByMapping("admin/circle/circle_question.shtml"),      //获取全部圈子帮助接口
    HANDLE_URL: helper.url.getUrlByMapping("admin/circlesharehandle.shtml"),                                 //新增/修改帮助url
    COMMENT_URL: helper.url.getUrlByMapping("admin/commentindex.shtml"),                                		//评论管理
    UPDATE: helper.url.getUrlByMapping("admin/circle/update_circle_related.shtml")  //设置圈子文章状态接口(置顶，精华，删除)
};

//页面事件
page.eventHandler = {
		//打开新增帖子
		showAdd: function () {
			helper.win.open({name: "新增帮助", url: page.ajaxUrl.HANDLE_URL});
		},
		//评论管理
		showComment: function (id){
			var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
			var title = rowDate.title.substr(0, 5) + "..评论";
			helper.win.open({name: title, url: page.ajaxUrl.COMMENT_URL + "?obj_id=" + id + "&obj_type=18"});
		},
	//搜索
    search: function () {
    	page.$table.bootstrapTable('refresh');
    },	
    //搜索重置
    reset: function(){
    	page.$keyword.val("");
    	page.$table.bootstrapTable('refresh');
    },
    create: function(elem){
    	window.parent.openFrm(elem);
    },
    //查询详情
    showAudit:function(id){
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        helper.win.openAuditByObj({obj_id: id, obj_type: rowDate.obj_type, article_title: rowDate.title});
    },    
    //打开编辑
    showEdit: function (id) {
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        helper.win.openEditByObj({obj_id: id, obj_type: rowDate.obj_type, article_title: rowDate.title, params: {action: "audit"}});
    },
    //删除圈子文章
    delete: function (elem, value, row, index) {
        swal({
            title: "您确定要删除选中的信息吗？",
            text: row.title,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "删除",
            cancelButtonText:'取消',
            closeOnConfirm: false
        }, function () {
            swal({title: "删除中，请稍候", type: "info", showConfirmButton: false});
            $.ajax({
                url: page.ajaxUrl.UPDATE,
                type: 'POST',
                data: {
                	obj_id: row.id,
                	obj_type: row.obj_type,
                    status: 2
                },
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                        swal({title:"删除成功", text: "1s后自动消失...", type: "success", timer: 1000});
                        page.$table.bootstrapTable('removeByUniqueId', row.id);    
                    }else{
                        swal("删除失败", ret.errMsg, "error");
                    }
                },
                error:function(ret) {
                    swal("删除失败", "error");
                }
            });
        });   
    },
    //设置置顶
    setTop: function (elem, value, row, index) {
    	$(elem).attr('disabled', true); //防止按钮抖动
    	if(row.is_top ===0){
    		$.ajax({
                url: page.ajaxUrl.UPDATE,
                type: 'POST',
                data: {
           	 		obj_id: row.id,
           	 		obj_type: row.obj_type,
                    is_top: 1
                },
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                    	row.is_top = 1;
                    	page.$table.bootstrapTable('updateRow', {index: index, row: row});
                    	$(elem).text('取消置顶').removeClass('btn-outline');
                    	toastr.success('置顶成功');
                    }else{
                    	toastr.error(ret.errMsg);
                    }
                    $(elem).attr('disabled', false);
                },
                error:function(ret) {
                	toastr.error('置顶失败');
                    $(elem).attr('disabled', false);
                }
            });
    	}else{
    		$.ajax({
                url: page.ajaxUrl.UPDATE,
                type : 'POST',
                data: {
           	 		obj_id: row.id,
           	 		obj_type: row.obj_type,
                    is_top: 0
                },
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                    	row.is_top = 0;
                    	page.$table.bootstrapTable('updateRow', {index: index, row: row});
                    	$(elem).text('设为置顶').addClass('btn-outline');
                    	toastr.success('取消置顶成功');
                    }else{
                    	toastr.error(ret.errMsg);
                    }
                    $(elem).attr('disabled', false);
                },
                error:function(ret) {
                	toastr.error('取消置顶失败');
                    $(elem).attr('disabled', false);
                }
            });
    	}   	
    },
    //设置精华
    setGood: function (elem, value, row, index) {
    	$(elem).attr('disabled', true);
    	if(row.is_good ===0){
    		$.ajax({
                url: page.ajaxUrl.UPDATE,
                type : 'POST',
                data: {
           	 		obj_id: row.id,
           	 		obj_type: row.obj_type,
           	 		is_good: 1
                },
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                    	row.is_good = 1;
                    	page.$table.bootstrapTable('updateRow', {index: index, row: row});
                      	$(elem).text('取消精华').removeClass('btn-outline');
                    	toastr.success('设置精华成功');
                    }else{
                    	toastr.error(ret.errMsg);
                    }
                    $(elem).attr('disabled', false);
                },
                error:function(ret) {
                	toastr.error('设置精华失败');
                    $(elem).attr('disabled', false);
                }
            });
    	}else{
    		$.ajax({
                url: page.ajaxUrl.UPDATE,
                type : 'POST',
                data: {
           	 		obj_id: row.id,
           	 		obj_type: row.obj_type,
           	 		is_good: 0
                },
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                    	row.is_good = 0;
                    	page.$table.bootstrapTable('updateRow', {index: index, row: row});
                    	$(elem).text('设为精华').addClass('btn-outline');
                    	toastr.success('取消精华成功');
                    }else{
                    	toastr.error(ret.errMsg);
                    }
                    $(elem).attr('disabled', false);
                },
                error:function(ret) {
                	toastr.error('取消精华失败');
                    $(elem).attr('disabled', false);
                }
            });
    	} 
    }
}


//初始化表格
page.$table.bootstrapTable({	
    detailView: false,
   // classes: 'table table-hover table-no-bordered',
    buttonsClass: 'default btn-outline',
    url: page.ajaxUrl.GET_LIST,  //AJAX读取列表数据的URL
    dataField: "data",//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
    height: 600,//高度
    toolbar:'#tableTools',
    showColumns: true,
    showRefresh: true,
    pagination: true,//是否分页
    pageSize: 20,//单页记录数
    pageList: [10,20,50,100],//分页步进值
    sidePagination: "server",//服务端分页
    contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
    dataType: "json",//期待返回数据类型
    method: "get",//请求方式
    uniqueId: 'id',
    undefinedText: "—",//为空的填充字符
    queryParamsType: "limit",//查询参数组织方式
    queryParams: function (params) {
        return page.derive.getParams(params);
    },
    columns: [{
        field: 'title',
        title: '标题',
        align: 'left',
        formatter: function (value, row) {
            return '<a href="javascript:;" onclick="page.eventHandler.showAudit(' + row.id + ')">' + value + '</a>';
        }
    }, {
        field: 'author_name',
        title: '创建人',
        width: "100px",
        align: 'center'
    },{
        field: 'comment_user_name',
        title: '最后评论人',
        width: "100px",
        align: 'center'
    },{
        field: 'comment_create_time',
        title: '最后评论时间',
        align: 'center',
        width: "150px",
        formatter: function(value, row, index){
            return helper.convert.formatDate(value);
        },
    },{
        title: '操作',
        align: 'center',
        width: "300px",
        formatter:function(value, row, index){	      
        	var strHtml = '<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.showComment('+row.id+')">评论管理</button>';
            	strHtml = row.is_top===0?' <button type="button" class="setTop btn btn-sm btn-outline btn-warning">设为置顶</button>':
            							 ' <button type="button" class="setTop btn btn-sm btn-warning">取消置顶</button>';
                strHtml += row.is_good===0?' <button type="button" class="setGood btn btn-sm btn-outline btn-warning">设为精华</button>':
                						   ' <button type="button" class="setGood btn btn-sm btn-warning">取消精华</button>';
                strHtml+= ' <button type="button" class="del btn btn-sm btn-danger">删除</button>';
                return strHtml;
        },
        events: {
        	//置顶
    	    'click .setTop':function (e, value, row, index) {
             	page.eventHandler.setTop(this, value, row, index)
            },
    		//精华
            'click .setGood':function (e, value, row, index) { 
            	page.eventHandler.setGood(this, value, row, index)
            },
            //删除
            'click .del': function (e, value, row, index) {
            	page.eventHandler.delete(this, value, row, index)     
            }
        }
    }]
});

//绑定回车查询
page.$keyword.keyup(function (event) {
    if (event.keyCode == 13)
        page.eventHandler.search();
});

//新增活动操作
$("#btnAdd").click(page.eventHandler.showAdd);

});