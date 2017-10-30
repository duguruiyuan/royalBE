//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastr', 'datetimepicker', 'table'], function (bs, $, helper, swal, layer, toastr) {
//存储页面table对象
page.$tool = $('#tableTools');
page.$table = $('#tableList');
page.$keyword = $('#keyword');

//页面级的帮助对象集合
page.derive = {
    //获取表单参数包含搜索
    getParams: function (params) {
        params.status = 1;
        params.circle_id = pageId;//页面传入时的id
        params.x = params.offset;//根据后台接口需要替换分页参数
        params.y = params.limit;//根据后台接口需要替换分页参数
        params.start_time = helper.convert.formatTimestamp($("#startTime").val());
        params.end_time = helper.convert.formatTimestamp($("#endTime").val(), {day: 1});
        params.title = $("#keyword").val();
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
    GET_LIST: helper.url.getUrlByMapping("admin/circle/circle_all.shtml"),     						    //获取全部圈子文章接口
    UPDATE: helper.url.getUrlByMapping("admin/circle/update_circle_related.shtml"),                 	//设置圈子文章状态接口(置顶，精华，删除)
    COMMENT_URL: helper.url.getUrlByMapping("admin/commentindex.shtml")                                 //评论管理
};

//页面事件
page.eventHandler = {
	//评论管理
	showComment: function (id,obj_type) {
	    var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
	    var title = rowDate.title.substr(0, 5) + "..评论";
	    helper.win.open({name: title, url: page.CONST.COMMENT_URL + "?obj_id=" + id + "&obj_type=" + obj_type});
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
    //查询详情
    showAudit:function(id){
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        var state = rowDate.state;
        var action = "audit";
        if(state=="1")
        	action = "release";
        helper.win.openInfoByObj({obj_id: id, obj_type: rowDate.obj_type, article_title: rowDate.title, params: {action: action,circle_id:pageId}});
    },    
    //打开编辑
    showEdit: function (id) {
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        var state = rowDate.state;
        var action = "audit";
        if(state=="1")
        	action = "release";
        	helper.win.openEditByObj({obj_id: id, obj_type: rowDate.obj_type, article_title: rowDate.title, params: {action: action,circle_id:pageId}});
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
    },
    //设置置顶
    setTop: function (elem, value, row, index) {
    	$(elem).attr('disabled', true); //防止按钮抖动
    	if(row.is_top ===0){
    		$.ajax({
                url: page.CONST.UPDATE,
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
                url: page.CONST.UPDATE,
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
                url: page.CONST.UPDATE,
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
                url: page.CONST.UPDATE,
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
};
//页面初始化
$(document).ready(function(){
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
    
    //toastr.info("初始化加载中，请稍候...");
    //初始化表格
    page.$table.bootstrapTable({
        //请求相关
        url: page.CONST.GET_LIST,  //AJAX读取列表数据的URL
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
        pageSize: 20,                //每页的记录行数（*）
        pageList: [10, 20,50, 100],     //允许选择的每页的数量切换
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
        buttonsClass: 'default btn-outline',

        //表格内容相关设置
        idField:"id",       //当前行主键的id值
        uniqueId:'id',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
        dataField: "data",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
        columns: [{
            field: 'title',
            title: '标题',
            align: 'left',
            formatter: function (value, row) {
                return '<a href="javascript:;" onclick="page.eventHandler.showAudit(' + row.id + ')">' + value + '</a>';
            }
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
            field: 'create_time',
            title: '创建时间',
            width: "150px",
            align: 'center',
            formatter: function(value, row, index){
                return helper.convert.formatDate(value);
            }
        },{
            field: 'state',
            title: '审核状态',
            width: "100px",
            align: 'center',
            formatter: function(value, row, index){
                switch(value){
	                case 1: return '<span class="label label-success">已审核</span>';break;
	                case 2: return '<span class="label label-primary">待审核</span>';break;
	                case 3: return '<span class="label label-warning">草稿</span>';break;
	                case 4: return '<span class="label label-danger">审核失败</span>';break;
                    default: return "";
                }
            }
        },{
            field: 'comment_user_name',
            title: '最后评论人',
            width: "100px",
            align: 'center'
        },{
            field: 'comment_create_time',
            title: '最后评论时间',
            width: "150px",
            align: 'center',
            formatter: function(value, row, index){
                return helper.convert.formatDate(value);
            }
        },{
            title: '操作',
            align: 'center',
            width: '350px',
            formatter:function(value, row, index){
                var strHtml = '<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.showComment('+row.id+','+row.obj_type+')">评论管理</button>';

                    strHtml += row.is_top===0?' <button type="button" class="setTop btn btn-sm btn-outline btn-warning">设为置顶</button>':
                                             ' <button type="button" class="setTop btn btn-sm btn-warning">取消置顶</button>';
                    strHtml += row.is_good===0?' <button type="button" class="setGood btn btn-sm btn-outline btn-warning">设为精华</button>':
                                               ' <button type="button" class="setGood btn btn-sm btn-warning">取消精华</button>';
                    strHtml+= ' <button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.showEdit('+row.id+')">编辑</button>';
                    strHtml+= ' <button type="button" class="del btn btn-sm btn-danger">删除</button>';
                    return strHtml;
            },
            events: {
                  //置顶
                  'click .setTop': function(e, value, row, index){
                      page.eventHandler.setTop(this, value, row, index)
                  },
                  //精华
                  'click .setGood': function(e, value, row, index){
                      page.eventHandler.setGood(this, value, row, index)
                  },
                  //删除
                  'click .del': function(e, value, row, index){
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
});
});