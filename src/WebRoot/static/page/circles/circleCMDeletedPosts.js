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
        params.status = 2;
        params.circle_id = pageId;//页面传入时的id
        params.x = params.offset;//根据后台接口需要替换分页参数
        params.y = params.limit;//根据后台接口需要替换分页参数
        if(page.$keyword.val()!=="")params.title =page.$keyword.val();//搜索值
        return params;
    }
}

//页面所用到AJAX请求的URL
page.ajaxUrl = {
    GET_LIST: helper.url.getUrlByMapping("admin/circle/circle_all.shtml"),     		//获取已删除的帖子列表
    UPDATE: helper.url.getUrlByMapping("admin/circle/update_circle_related.shtml"),                 //设置圈子文章状态接口(置顶，精华，删除)                                             //修改密文接口
}

//页面事件
page.eventHandler = {
	//搜索
    search: function () {
    	page.$table.bootstrapTable('refresh');
    },	
    //搜索重置
    reset: function(){
    	page.$keyword.val("");
    	page.$table.bootstrapTable('refresh');
    },
    //恢复删除的文章
    recovery: function (elem, value, row, index) {
        swal({
            title: "您确定要恢复选中的信息吗？",
            text: row.title,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#18a689",
            confirmButtonText: "恢复",
            cancelButtonText:'取消',
            closeOnConfirm: false
        }, function () {
            swal({title: "恢复中，请稍候", type: "info", showConfirmButton: false});
            $.ajax({
                url: page.ajaxUrl.UPDATE,
                type: 'POST',
                data: {
                	obj_id: row.id,
                	obj_type: row.obj_type,
                    status: 1
                },
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                        swal({title:"恢复成功", text: "1s后自动消失...", type: "success", timer: 1000});
                        page.$table.bootstrapTable('removeByUniqueId', row.id);    
                    }else{
                        swal("恢复成功", ret.errMsg, "error");
                    }
                },
                error:function(ret) {
                    swal("恢复成功", "error");
                }
            });
        });   
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
        align: 'center'
    }, {
        field: 'obj_type',
        title: '类型',
        width: "100px",
        align: 'center',
    	formatter: function(value, row, index){
    		switch(value){
    			case 4: return "活动";break;
    			case 5: return "话题";break;
    			case 18: return "帮助";break;
    			case 19: return "帖子";break;
    			default: return "";
    		}
    	}
    }, {
        field: 'author_name',
        title: '创建人',
        width: "100px",
        align: 'center'
    },{
        field: 'state',
        title: '审核状态',
        width: "100px",
        align: 'center',
        formatter: function(value, row, index){
        	switch(value){    	
    			case 1: return '<span class="label label-success">审核</span>';break;
    			case 2: return '<span class="label label-primary">待审核</span>';break;
    			case 3: return '<span class="label label-warning">草稿</span>';break;
    			case 4: return '<span class="label label-danger">审核失败</span>';break;
    			default: return "";
        	}
        }
    },{
        field: 'update_user_name',
        title: '删除人',
        width: "100px",
        align: 'center'
    },{
        field: 'update_time',
        title: '删除时间',
        width: "150px",
        align: 'center',
        formatter: function(value, row, index){
            return helper.convert.formatDate(value);
        },
    },{
        title: '操作',
        align: 'center',
        width: "100px",
        formatter:function(value, row, index){
                return '<button type="button" class="reco btn btn-sm btn-primary">恢复</button>';
        },
        events: {
            'click .reco': function (e, value, row, index) {     //恢复
            	page.eventHandler.recovery(this, value, row, index)     
            }
        }
    }]
});

//绑定回车查询
page.$keyword.keyup(function (event) {
    if (event.keyCode == 13)
        page.eventHandler.search();
});
});












