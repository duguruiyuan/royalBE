//初始化页面对象
var page = {};

//页面静态变量
page.CONST = {
    GET_LIST: helper.url.getUrlByMapping("admin/circle_share/find_share_list.shtml"),      //获取全部帮助接  
    UPDATE: helper.url.getUrlByMapping("admin/circle/update_circle_related.shtml"),  //设置文章状态接口(置顶，精华，删除) 
}
//页面变量
page.VALUE = {
}


//存储页面table对象
page.$table = $('#tableList');
	page.$circleKeyword = $('#circleKeyword');//圈子关键字
	page.$titleKeyword = $('#titleKeyword');//标题关键字
	page.$createStartTime = $('#creatStartTime');//圈子关键字
	page.$createEndTime = $('#createEndTime');//标题关键字
	page.$delStartTime = $('#delStartTime');//圈子关键字
	page.$delEndTime = $('#delEndTime');//标题关键字
	
//页面级的帮助对象集合
page.derive = {
    //获取表单参数包含搜索
    getParams: function (params) {
        params.status = 2;
        params.state = 1;
        params.x = params.offset;//根据后台接口需要替换分页参数
        params.y = params.limit;//根据后台接口需要替换分页参数
        if(page.$creatStartTime.val()!=="")params.create_Start_time =page.$creatStartTime.val();//搜索值
        if(page.$createEndTime.val()!=="")params.create_end_time =page.$createEndTime.val();//搜索值
        if(page.$delStartTime.val()!=="")params.delete_Start_time =page.$creatStartTime.val();//搜索值
        if(page.$delEndTime.val()!=="")params.elete_end_time =page.$delEndTime.val();//搜索值
        if(page.$titleKeyword.val()!=="")params.title =page.$titleKeyword.val();//标题搜索值
        if(page.$circleKeyword.val()!=="")params.circle_title =page.$circleKeyword.val();//标题搜索值
        return params;
    },
}

//日期选择
laydate({
    elem: '#createStartTime',
    format: 'YYYY/MM/DD hh:mm:ss',
    min: '1990-06-16 23:59:59', //设定最小日期为当前日期
    max: '2099-06-16 23:59:59', //最大日期
    istime: true,
    istoday: false,
    choose: function (data) {
       //end.min = datas; //开始日选好后，重置结束日的最小日期
        //end.start = datas //将结束日的初始值设定为开始日
    }
});
//日期选择
laydate({
    elem: '#createEndTime',
    format: 'YYYY/MM/DD hh:mm:ss',
    min: '1990-06-16 23:59:59', //设定最小日期为当前日期
    max: '2099-06-16 23:59:59', //最大日期
    istime: true,
    istoday: false,
    choose: function (data) {
       //end.min = datas; //开始日选好后，重置结束日的最小日期
        //end.start = datas //将结束日的初始值设定为开始日
    }
});
//日期选择
laydate({
    elem: '#delStartTime',
    format: 'YYYY/MM/DD hh:mm:ss',
    min: '1990-06-16 23:59:59', //设定最小日期为当前日期
    max: '2099-06-16 23:59:59', //最大日期
    istime: true,
    istoday: false,
    choose: function (data) {
       //end.min = datas; //开始日选好后，重置结束日的最小日期
        //end.start = datas //将结束日的初始值设定为开始日
    }
});
//日期选择
laydate({
    elem: '#delEndTime',
    format: 'YYYY/MM/DD hh:mm:ss',
    min: '1990-06-16 23:59:59', //设定最小日期为当前日期
    max: '2099-06-16 23:59:59', //最大日期
    istime: true,
    istoday: false,
    choose: function (data) {
       //end.min = datas; //开始日选好后，重置结束日的最小日期
        //end.start = datas //将结束日的初始值设定为开始日
    }
});

//页面事件
page.eventHandler = {
	//搜索
    search: function () {
    	page.$table.bootstrapTable('refresh');
    },	
    //搜索重置
    reset: function(){
    	page.$createStartTime.val("");
    	page.$createEndTime.val("");
    	page.$delStartTime.val("");
    	page.$delEndTime.val("");
    	page.$titleKeyword.val("");
      	page.$circleKeyword.val("");
    	page.$table.bootstrapTable('refresh');
    },
    recover: function (elem, value, row, index) {    //恢复圈子文章
        swal({
            title: "您确定要删除选中的信息吗？",
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
                url: page.CONST.UPDATE,
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
                        swal("恢复失败", ret.errMsg, "error");
                    }
                },
                error:function(ret) {
                    swal("恢复失败", "error");
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
        align: 'center',
    }, {
        field: 'circle_title',
        title: '圈子',
        align: 'center'
    }, {
        field: 'author_name',
        title: '创建人',
        align: 'center'
    },  {
        field: 'create_time',
        title: '创建时间',
        align: 'center',
        formatter: function(value, row, index){
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
        },
    }, {
        field: 'audit_user_name',
        title: '删除人',
        align: 'center'
    }, {
        title: '操作',
        align: 'center',
        formatter:function(value, row, index){	
            var strHtml = ' <button type="button" class="reco btn btn-sm btn-primary">恢复</button>';
                return strHtml;
        },
        events: {
            //回复
            'click .reco': function (e, value, row, index) {
            	page.eventHandler.recover(this, value, row, index)     
            }
        }
    }]
});