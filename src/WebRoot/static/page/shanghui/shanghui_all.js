//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastrPlus', 'module.push', 'datetimepicker', 'table', 'tableEditable'], function (bs, $, helper, swal, layer, toastr) {
//页面所用到AJAX请求的URL
page.CONFIG = {
    GET_LIST: helper.url.getUrlByMapping("admin/shanghui/find_information.shtml?SAVETYPE=1"),     //查询待审核设备推送接口
    DELETE: helper.url.getUrlByMapping("admin/shanghui/update_information.shtml"),           //删除设备推送接口
    COMMENT_URL: helper.url.getUrlByMapping("admin/commentindex.shtml"),                    //查看推送用户
    UPDATE: helper.url.getUrlByMapping("admin/shanghuidetail.shtml"),                      //查看编辑设备推送
    PUSH_URL: helper.url.getUrlByMapping("admin/shanghuidetailpush.shtml"),                      //查看编辑设备推送
    REWRITE_API: helper.url.getUrlByMapping("admin/shanghui/update_shanghuinews_common.shtml"),    
    AUDIT: helper.url.getUrlByMapping("admin/pushDevice/check_pushdeviceinfo.shtml")                        //审核url
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
    	params.SHNAME = $("#SHNAME").val();
        params.RELEASESTARTTIME = helper.convert.formatTimestamp($("#startTime").val());
        params.RELEASEENDTIME = helper.convert.formatTimestamp($("#endTime").val(), {day: 1});
        params.TITLE = $("#TITLE").val();
        params.x = params.offset;   //服务端分页，过滤掉前xxx条记录
        params.y = params.limit;    //服务端分页，每页记录数
        console.log(params);
        return params;
    },

    //获取表格参数修改数量
    getNumParams: function (params,elem,newKey) {
        var id = $(elem).parents('tr').data('uniqueid');
        var row = page.$table.bootstrapTable('getRowByUniqueId',id);
        params.id = row.INID;
        params[newKey] = params.value;
        return params;
    },

    //获取表格修改的选项
    getEditable: function (title, field) {
        var editable = {
            type: 'text',
            title: title,
            emptytext: '0',
            params: function (params) {
                return page.derive.getNumParams(params, this, field);
            },
            url: page.CONFIG.REWRITE_API,   //修改的AJAX请求地址
            mode: 'popup',
            success: function (res, newValue) {
                page.derive.successBack(this, res);
            },
            validate: function (value) {
                return page.derive.validateNum(value);
            }
        };

        return editable;
    },
    
    //获取提供给表格位置的自适应浏览器的高度，最小高度500
    getAdaptTableHeight: function () {
        var height = $(window).height() - page.$tool.offset().top - page.$tool.outerHeight() - 30;
        return height >= 500 ? height : 500;
    },
    
  //验证修改表格的数字类型
    validateNum: function (value) {
        value = $.trim(value);
        var pattern = /^\d+$/;
        if(value && !pattern.test(value)){
            return '请输入数字！';
        }
    },
    //表格修改成功后回调
    successBack:function(elem,res){
        res = $.parseJSON(res);
        if(res.code == 0) {
            toastr.success('修改成功');
            return;
        }

        toastr.error('修改失败', res.errMsg);
        var id = $(elem).parents('tr').data('uniqueid');
        page.$table.bootstrapTable('updateByUniqueId',id);
    }
    
};

//页面事件
page.eventHandler = {
    //打开审核
    showAudit: function (id) {
    	var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
    	//alert(rowDate.title);
        swal({
            title: "您确定要审核选中的信息吗？",
            text: rowDate.title,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "审核",
            cancelButtonText:'取消',
            closeOnConfirm: false
        }, function () {
            $.ajax({
                url:page.CONFIG.AUDIT,
                type : 'POST',
                data: {
//                	INIDS: id,
//                    SAVETYPE: 2
                    id: id,
        			state : 1,
        			title:rowDate.title_imei,
        			objtype:rowDate.obj_type
                },
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                        swal({title:"审核成功", text: "1s后自动消失...", type: "success", timer: 1000});
                        page.$table.bootstrapTable('remove', {
                            field: "id",
                            values: id
                        });
                        page.$table.bootstrapTable('removeByUniqueId', id);
                        page.$table.bootstrapTable('refresh');
                    }else{
                        swal("审核失败", ret.errMsg, "error");
                    }
                },
                error:function(ret) {
                    swal("审核失败", "error");
                }
            });
        });
    },

    //打开编辑
    showEdit: function (id) {
        helper.win.open({name: "查看商会动态详情", url: page.CONFIG.UPDATE + "?action=audit&id=" + id});
    },
    
    //打开编辑
    pushEdit: function (id) {
        helper.win.open({name: "推送商会动态", url: page.CONFIG.PUSH_URL + "?action=audit&id=" + id});
    },
    
    //打开编辑
//    showPushUser: function (id) {
//        helper.win.open({name: "评论管理", url: page.CONFIG.PUSH_USER + "?obj_id=" + id+"&obj_type=13"});
//    },
    
    showPushUser: function (id) {
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        var title = rowDate.TITLE.substr(0, 5) + "..评论";
        helper.win.open({name: title, url: page.CONFIG.COMMENT_URL + "?obj_id=" + id + "&obj_type="+13});
    },

    //删除待审核秘闻
    delete: function (id) {
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        swal({
            title: "您确定要删除选中的信息吗？",
            text: rowDate.TITLE,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "删除",
            cancelButtonText:'取消',
            closeOnConfirm: false
        }, function () {
            swal({title: "删除中，请稍候", type: "info", showConfirmButton: false});
            $.ajax({
                url: page.CONFIG.DELETE,
                type : 'POST',
                data: {
                	INIDS: id,
                    SAVETYPE: 2
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
        url: page.CONFIG.GET_LIST,  //AJAX读取列表数据的URL
        method: "post",                  //请求方式
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
        pageList: [10,20, 50, 100],     //允许选择的每页的数量切换
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
        idField:"INID",       //当前行主键的id值
        uniqueId:'INID',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
        dataField: "data",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
        columns: [{
            field: 'TITLE',
            title: '标题',
            align: 'left',
            formatter: function(value, row){
            	var title = '<a href="#" class="paperDetail" onclick = "page.eventHandler.showEdit('+row.INID+')">' + value + '</a>';
            	return title;
            }
        }, {
            field: 'SHNAME',
            title: '商会',
//            width: "150px",
            align: 'center'
        },{
            field: 'AUTHOR',
            title: '发布人',
            width: "100px",
            align: 'center'
        },{
            field: 'RELEASETIME',
            title: '发布时间',
            width: "150px",
            formatter: function(value){
                return formatDate(value);
            },
            align: 'center'
        },{
            field: 'comment_count_all',
            title: '评论',
            width: '40px',
            align: 'center',
            editable: page.derive.getEditable('修改评论数', 'comment_count_all')
        },{
            field: 'share_count_all',
            title: '分享',
            width: '40px',
            align: 'center',
            editable: page.derive.getEditable('修改分享数', 'share_count_all')
        },{
            field: 'zan_count_all',
            title: '点赞',
            width: '40px',
            align: 'center',
            editable: page.derive.getEditable('修改点赞数', 'zan_count_all')
        }, {
            field: 'favorite_count_all',
            title: '收藏',
            width: '40px',
            align: 'center',
            editable: page.derive.getEditable('修改收藏数', 'favorite_count_all')
        },{
            field: 'view_times_count_all',
            title: 'PV',
            width: '40px',
            align: 'center',
            editable: page.derive.getEditable('修改PV数', 'view_times_count_all')
        },{
            field: 'view_people_count_all',
            title: 'UV',
            width: '40px',
            align: 'center',
            editable: page.derive.getEditable('修改UV数', 'view_people_count_all')
        },{
            field: 'wx_visit_times_count',
            title: '点击数<br/><small>(微信)</small>',
            width: '40px',
            align: 'center'
        },{
            field: 'wx_visit_people_count',
            title: '点击人<br/><small>(微信)</small>',
            width: '40px',
            align: 'center'
        },{
            field: 'comment_count',
            title: '评论数<br/><small>(真实)</small>',
            width: '40px',
            visible: false,
            align: 'center'
        },{
            field: 'share_count',
            title: '分享数<br/><small>(真实)</small>',
            width: '40px',
            visible: false,
            align: 'center'
        },{
            field: 'zan_count',
            title: '点赞数<br/><small>(真实)</small>',
            width: '40px',
            visible: false,
            align: 'center'
        },{
            field: 'favorite_count',
            title: '收藏数<br/><small>(真实)</small>',
            width: '40px',
            visible: false,
            align: 'center'
        },
        {
            field: ' ',
            title: '操作',
            align: 'center',
            width: "250px",
            formatter:function(value, row){
            	var strHtml = ' <button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.pushEdit(' + row.INID + ')">推送</button>';
                strHtml +=' <button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.showPushUser(' + row.INID + ')">评论管理</button>';
                strHtml+=' <button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete(' + row.INID + ')">删除</button>';
                return strHtml;
            }
        }]
    });

    $("#keyword").keyup(function (event) {
        if(event.keyCode == 13)
            $("#btnSearch").click();
    });

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
function openDeviceDetail (id) { 
//    openLayerWin(window.top.basePath + '/admin/deviceDetail.shtml?id='+ id,'查看','550px','400px'); 
    layer.open({
        type: 2,
        title: '查看设备推送详情',
        shadeClose: true,
        content: helper.CONST.BASE_PATH+'admin/deviceDetail.shtml?id='+ id,
        area: [ '550px', '400px' ]
    });
 }