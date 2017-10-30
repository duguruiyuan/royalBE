//初始化页面对象
var page = {};

//存储页面table对象
page.$tool = $('#tableTools');
page.$table = $('#tableList');
    page.$keyword = $('#keyword');
//页面级的帮助对象集合
page.derive = {
    //获取表单参数包含搜索
    getParams: function (params) {
        params.status = 1;
        params.x = params.offset;//根据后台接口需要替换分页参数
        params.y = params.limit;//根据后台接口需要替换分页参数
        if(page.$keyword.val()!=="")params.title = page.$keyword.val();//搜索值
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
    GET_LIST: helper.url.getUrlByMapping("admin/circle/find_circle_list.shtml"),     						    //获取全部圈子接口
    UPDATE: helper.url.getUrlByMapping("admin/circle/update_circle_related.shtml"),                //设置圈子状态接口(置顶，精华，删除)
    PUSH_URL: helper.url.getUrlByMapping("admin/common/commont_push.shtml")
};

//页面事件
page.eventHandler = {
    search: function () {	//搜索
    	page.$table.bootstrapTable('refresh');
    },	
    reset: function(){    //搜索重置
        page.$keyword.val("");
    	page.$table.bootstrapTable('refresh');
    },
    delete: function (elem, value, row, index) {    //删除圈子文章
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
                	obj_type: 11,
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
    push:function (row) {   //推送
        //初始化信息流推送组件
        var push = new module.push.modal({
            //窗口参数
            modal: {
                objId: row.id,
                objType: 11,
                template: 'circles',
                title: row.title,
                image: row.logo,
                brief: row.brief
            }
            //推送参数
            // readonly:params.readonly,
            // defaultPush: params.defaultPush,
            // range: params.range,
            // smallTop:params.smallTop,
            // bigTop: params.bigTop
        });
    }
};


//页面初始化
$(document).ready(function(){
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
            field: 'id',
            title: 'ID',
            visible: false,
            align: 'center'
        }, {
            field: 'title',
            title: '名称',
            align: 'left'
        }, {
            field: 'circle_zhu_name',
            title: '圈主',
            width: "100px",
            align: 'center'
        }, {
            field: 'circle_member',
            title: '成员',
            width: "200px",
            align: 'center'
        },{
            field: 'master_name',
            title: '创建人',
            width: "100px",
            align: 'center'
        },{
            field: 'create_time',
            title: '创建时间',
            width: "150px",
            formatter: function(value, row, index){
                return helper.convert.formatDate(value);
            },
            align: 'center'
        },{
            title: '操作',
            align: 'center',
            width: '380px',
            formatter: function(value, row, index){
                var strHtml =
                    ' <a class="btn btn-sm btn-outline btn-default" onclick="window.parent.openFrm(this);" data-index="circleCMAll.shtml?circle_id='+ row.id +'" data-title="'+row.title+'-内容管理">内容管理</a>'+
                    ' <a class="btn btn-sm btn-outline btn-default" onclick="window.parent.openFrm(this);" data-index="circleFollowers.shtml?circle_id='+ row.id +'" data-title="'+row.title+'-关注的人">关注的人</a>'+
                    ' <a class="btn btn-sm btn-outline btn-default" onclick="window.parent.openFrm(this);" data-index="circleRoleEdit.shtml?circle_id='+ row.id +'" data-title="'+row.title+'-编辑角色">编辑角色</a>'+
                    ' <a class="push btn btn-sm btn-primary">推送</a>'+
                    ' <button type="button" class="del btn btn-sm btn-danger">删除</button>';
                return strHtml;
            },
            events: {
                //删除
                'click .del':function (e, value, row, index) {
                    page.eventHandler.delete(this, value, row, index);
                },
                //推送
                'click .push':function (e, value, row, index) {
                    page.eventHandler.push(row);
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
