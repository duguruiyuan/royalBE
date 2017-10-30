//初始化页面对象
var page = {};

//存储页面table对象
page.$table = $('#tableList');
	page.$titleKeyword = $('#titleKeyword');
	page.$circleKeyword = $('#circleKeyword');
	page.$startTime = $('#startTime');
	page.$endTime = $('#endTime');
//页面级的帮助对象集合
page.derive = {
    //获取表单参数包含搜索
    getParams: function (params) {
        params.status = 1;
        params.state = 3;
        params.x = params.offset;//根据后台接口需要替换分页参数
        params.y = params.limit;//根据后台接口需要替换分页参数
        
        if(page.$titleKeyword.val()!=="")params.title = page.$titleKeyword.val(); //搜索值
        if(page.$circleKeyword.val()!=="")params.circle_title = page.$circleKeyword.val(); //搜索值
        if(page.$startTime.val()!=="")params.create_start_time = page.$titleKeyword.val(); //搜索值
        if(page.$endTime.val()!=="")params.create_end_time = page.$endTime.val(); //搜索值
        
        return params;
    }
}

//页面所用到AJAX请求的URL
page.CONST = {
    GET_LIST: helper.url.getUrlByMapping("admin/activity/find_activity.shtml"),           //获取全部活动接口
    UPDATE: helper.url.getUrlByMapping("admin/circle/update_circle_related.shtml"),      //设文章状态接口(置顶，精华，删除)                                             //修改密文接口
    AUDIT: helper.url.getUrlByMapping("")                                                //审查接口
}

//页面事件
page.eventHandler = {
    search: function () {	//搜索
    	page.$table.bootstrapTable('refresh');
    },	
    reset: function(){    //搜索重置
    	$titleKeyword.val("");
    	$circleKeyword.val("");
    	$startTime.val("");
    	$endTime.val("");
    	page.$table.bootstrapTable('refresh');
    },
    gotoFrm: function (elem) {    //圈子内容管理
    	window.parent.openFrm(elem);
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
                url: page.CONST.UPDATE,
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
    }
}
page.$table.bootstrapTable({	
    detailView: false,
   // classes: 'table table-hover table-no-bordered',
    buttonsClass: 'default btn-outline',
    url: page.CONST.GET_LIST,  //AJAX读取列表数据的URL
    dataField: "data",//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
    height: 600,//高度
    toolbar:'#tableTools',
    showColumns: true,
    showRefresh: true,
    pagination: true,//是否分页
    pageSize: 20,//单页记录数
    pageList: [20,60,100],//分页步进值
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
	    field: 'id',
	    title: 'ID',
	    align: 'center'
	}, {
	    field: 'title',
	    title: '标题',
        width: '300px',
	    align: 'center'
	},{
	    field: 'circle_title',
	    title: '圈子',
        width: '200px',
	    align: 'center'
	},{
	    field: 'start_time',
	    title: '开始时间',
        width: '200px',
	    align: 'center',
	    formatter: function(value, row, index){
	        return moment(value).format('YYYY-MM-DD HH:mm:ss');
	    },
	},{
	    field: 'end_time',
	    title: '结束时间',
	     width: '200px',
	    align: 'center',
	    formatter: function(value, row, index){
	        return moment(value).format('YYYY-MM-DD HH:mm:ss');
	    },
	},{
	    field: 'author_name',
	    title: '创建人',
	     width: '100px',
	    align: 'center',
	},{
	    field: 'create_time',
	    title: '创建时间',
	     width: '200px',
	    align: 'center',
	    formatter: function(value, row, index){
	        return moment(value).format('YYYY-MM-DD HH:mm:ss');
	    },
	},{
	    field: 'update_name',
	    title: '最后修改人',
	     width: '100px',
	    align: 'center',
	},{
	    field: 'update_time',
	    title: '修改时间',
	     width: '200px',
	    align: 'center',
	    formatter: function(value, row, index){
	        return moment(value).format('YYYY-MM-DD HH:mm:ss');
	    }
	},{
        title: '操作',
        align: 'center',
        width:'300px',
        formatter: function(value, row, index){	
        	var strHtml;
        	strHtml = ' <a class="btn btn-sm btn-primary" onclick="window.parent.openFrm(this)" data-index="CMcircleActivityEdit.shtml?page_id='+row.id+'" data-title="qweqweqwe-活动">编辑</a>'+
		    		  ' <button type="button" class="del btn btn-sm btn-danger">删除</button>';
		    return strHtml;
        },
        events: {
        	  //审核
        	  'click .audit': function(e, value, row, index){
	        	  page.eventHandler.audit(this, value, row, index)
	          },
	          //编辑
	          'click .edit': function(e, value, row, index){
	        	  page.eventHandler.edit(this, value, row, index)
	          },
	          //删除
	          'click .del': function(e, value, row, index){
	        	  page.eventHandler.delete(this, value, row, index)
	          }
	      }
    }]
});