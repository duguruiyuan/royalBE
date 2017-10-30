//初始化页面对象
var page = {};

//存储页面table对象
page.$tool = $('#tableTools');
page.$table = $('#tableList');
	page.$titleKeyword = $('#titleKeyword');
	page.$circleKeyword = $('#circleKeyword');
	page.$startTime = $('#startTime');
	page.$endTime = $('#endTime');
//页面级的帮助对象集合
page.assist = {
    //获取表单参数包含搜索
    getParams: function (params) {
        params.status = 1;
        params.state = 2;
        params.x = params.offset;//根据后台接口需要替换分页参数
        params.y = params.limit;//根据后台接口需要替换分页参数
        
        if(page.$titleKeyword.val()!=="")params.title = page.$titleKeyword.val(); //搜索值
        if(page.$circleKeyword.val()!=="")params.circle_title = page.$circleKeyword.val(); //搜索值
        if(page.$startTime.val()!=="")params.create_start_time = page.$titleKeyword.val(); //搜索值
        if(page.$endTime.val()!=="")params.create_end_time = page.$endTime.val(); //搜索值
        
        return params;
    },
    //获取提供给表格位置的自适应浏览器的高度，最小高度500
    getAdaptTableHeight: function () {
        var height = $(window).height() - page.$tool.offset().top - page.$tool.outerHeight() - 30;
        return height >= 500 ? height : 500;
    }
};

//页面所用到AJAX请求的URL
page.CONST = {
    GET_LIST: helper.url.getUrlByMapping("admin/activity/find_activity.shtml"),           //获取全部活动接口
    UPDATE: helper.url.getUrlByMapping("admin/circle/update_circle_related.shtml"),      //设文章状态接口(置顶，精华，删除)                            
};

//页面事件
page.eventHandler = {
	//搜索
    search: function () {
    	page.$table.bootstrapTable('refresh');
    },
    //搜索重置
    reset: function(){
    	page.$titleKeyword.val("");
    	page.$circleKeyword.val("");
    	page.$startTime.val("");
    	page.$endTime.val("");
    	page.$table.bootstrapTable('refresh');
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
        url: page.CONST.GET_LIST,  //AJAX读取列表数据的URL
        method: "get",                  //请求方式
        contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
        dataType: "json",               //服务器返回数据类型
        cache: false,                   //不缓存数据
        queryParamsType: "limit",       //查询参数组织方式
        queryParams: function (params) {
            return page.assist.getParams(params);
        },

        //分页相关
        pagination: true,            //是否分页
        pageNumber:1,                //初始化加载第一页，默认第一页
        pageSize: 20,                //每页的记录行数（*）
        pageList: [10, 50, 100],     //允许选择的每页的数量切换
        sidePagination: "server",    //分页方式：client客户端分页，server服务端分页（*）

        //表格总体外观相关
        height: page.assist.getAdaptTableHeight(),            //整个表格的高度
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
                field: 'id',
                title: 'ID',
                align: 'center',
                visible: false
            }, {
                field: 'title',
                title: '标题',
                align: 'center'
            },{
                field: 'circle_title',
                title: '圈子',
                width: "150px",
                align: 'center'
            },{
                field: 'start_time',
                title: '开始时间',
                width: "150px",
                align: 'center',
                formatter: function(value, row, index){
                    return helper.convert.formatDate(value);
                },
            },{
                field: 'end_time',
                title: '结束时间',
                width: "150px",
                align: 'center',
                formatter: function(value, row, index){
                    return helper.convert.formatDate(value);
                },
            },{
                field: 'author_name',
                title: '创建人',
                width: "100px",
                align: 'center',
            },{
                field: 'create_time',
                title: '创建时间',
                width: "150px",
                align: 'center',
                formatter: function(value, row, index){
                    return helper.convert.formatDate(value);
                },
            },{
                field: 'is_start',
                title: '最后修改人',
                width: "100px",
                align: 'center'
            },{
                field: 'update_time',
                title: '修改时间',
                width: "150px",
                align: 'center',
                formatter: function(value, row, index){
                    return helper.convert.formatDate(value);
                }
            },{
                title: '操作',
                align: 'center',
                width: "200px",
                formatter: function(value, row, index){

                    var strHtml =  ' <a class="edit btn btn-sm btn-primary">编辑</a>';
                    strHtml += ' <a class="audit btn btn-sm btn-info">审核</a>';
                    strHtml += ' <button type="button" class="del btn btn-sm btn-danger">删除</button>';

                    return strHtml;
                },
                events: {
                    //编辑
                    'click .edit':function(e, value, row, index){
                        helper.win.open({
                            name: row.title+"-活动",
                            url: "circleActivityHandle.shtml?id="+row.id+"&action=edit"
                        })
                    },
                    //审核
                    'click .audit':function(e, value, row, index){
                        helper.win.open({
                            name: row.title+"-活动",
                            url: "circleActivityHandle.shtml?id="+row.id+"&action=audit"
                        })
                    },
                    //删除
                    'click .del': function(e, value, row, index){
                        page.eventHandler.delete(this, value, row, index)
                    }
                }
            }]
    });



    //绑定回车查询
    page.$titleKeyword .keyup(function (event) {
        if (event.keyCode == 13)
            page.eventHandler.search();
    });
    page.$circleKeyword .keyup(function (event) {
        if (event.keyCode == 13)
            page.eventHandler.search();
    });

    $(window).resize(function () {
        page.$table.bootstrapTable("resetView", {height: page.assist.getAdaptTableHeight() + 10});
    })
});


