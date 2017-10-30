//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'datetimepicker', 'table'], function (bs, $, helper, swal, layer) {
//存储页面table对象
page.$table = $('#tableList');
	page.$keyword = $('#keyword'); //搜索框

var pageId = helper.url.queryString("circle_id");
//页面级的帮助对象集合
page.derive = {
    //获取表单参数包含搜索
    getParams: function (params) {
        params.status = 1;
        params.obj_type = 11;
        params.obj_id = pageId;
        params.x = params.offset;//根据后台接口需要替换分页参数
        params.y = params.limit;//根据后台接口需要替换分页参数
        if(page.$keyword.val()!=="")params.user_name =page.$keyword.val();//搜索值
        return params;
    }
}

//页面所用到AJAX请求的URL
page.ajaxUrl = {
    GET_LIST: helper.url.getUrlByMapping("admin/circle/circle_follow.shtml"),   //获取查看关注圈子的人接口    
    USER_INFO: helper.url.getUrlByMapping("admin/userinfo.shtml"),               //查看用户信息
    ADD_MEMBER: helper.url.getUrlByMapping("admin/circle/circle_addmember.shtml")     //吧关注人加入圈子  
}

//页面事件
page.eventHandler = {
	//查看用户信息
	showUser: function (id) {
		layer.open({
	        type: 2,
	        title: '查看用户信息',
	        skin: 'layui-layer-rim',
	        shadeClose: true,
	        scrollbar: false,
	        content: page.ajaxUrl.USER_INFO + '?id=' + id,
	        area: ['80%', '80%']
	    });
    },
    search: function () {	//搜索
    	page.$table.bootstrapTable('refresh');
    },	
    reset: function(){    //搜索重置
    	page.$keyword.val("")
    	page.$table.bootstrapTable('refresh');
    },
    addMember : function(elem, value, row, index){
    	console.log(row);
        swal({
            title: "您确定要该关注成员加入到圈子吗？",
            text: row.user_name,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "加入",
            cancelButtonText:'取消',
            closeOnConfirm: false
        }, function () {
            swal({title: "操作中，请稍候", type: "info", showConfirmButton: false});
            $.ajax({
                url: page.ajaxUrl.ADD_MEMBER,
                type: 'POST',
                data: {
                	user_id: row.user_id,
                	user_name: row.user_name,
                    circle_id: pageId
                },
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                        swal({title:"加入成功", text: "1s后自动消失...", type: "success", timer: 1000});
                        page.$table.bootstrapTable('refresh');
                    }else{
                        swal("加入失败", ret.errMsg, "error");
                    }
                },
                error:function(ret) {
                    swal("操作失败", "error");
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
    url: page.ajaxUrl.GET_LIST,//传入的URL
    dataField: "data",//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
    height: 660,//高度
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
    undefinedText: "—",//为空的填充字符
    uniqueId: 'id',
    queryParamsType: "limit",//查询参数组织方式
    queryParams: function (params) {
        return page.derive.getParams(params);
    },
    columns: [{
        field: 'id',
        title: 'ID',
        width: '80px',
        align: 'center'
    }, {
        field: 'user_name',
        title: '姓名',
        width: '150px',
        align: 'center',
        formatter: function(value, row, index){
        	return '<a href="javascript:;" onclick="page.eventHandler.showUser('+ row.user_id +')">'+ value +'</a>';
        }
    }, {
        field: 'company',
        title: '单位',
        align: 'center'
    }, {
        field: 'companywork',
        title: '职务',
        align: 'center'
    },{
        field: 'create_time',
        title: '关注时间',
        width: '150px',
        formatter: function(value, row, index){
            return helper.convert.formatDate(value);
        },
        align: 'center'
    },{
        title: '操作',
        align: 'center',
        width: '100px',
        formatter: function(value, row, index){
            var strHtml = '';
            if(row.is_member==0)
            	strHtml += '<button type="button" class="addMember btn btn-sm btn-info">加入圈子</button>';
            else
            	strHtml += '<button type="button" disabled class="btn btn-sm btn-warning">已加入圈子</button>';
            return strHtml;
        },
        events: {
            //加入成员
            'click .addMember': function(e, value, row, index){
                page.eventHandler.addMember(this, value, row, index)
            }
        }
    }]
});
//回车搜索事件
$("#keyword").keyup(function (event) {
    if(event.keyCode == 13)
    	page.eventHandler.search();
});
});

    
