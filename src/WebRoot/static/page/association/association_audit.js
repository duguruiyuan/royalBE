//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastrPlus', 'module.push', 'datetimepicker', 'table', 'tableEditable'], function (bs, $, helper, swal, layer, toastr) {
    var module = {
        push: require('module.push')
    };

//页面所用到AJAX请求的URL
page.CONFIG = {
    GET_LIST: helper.url.getUrlByMapping("admin/association/find_article_association.shtml?status=1&state=1"),      //查询待审核内容接口
    COMMENT_URL: helper.url.getUrlByMapping("admin/commentindex.shtml"),                                      //评论管理
    PUSH_API: helper.url.getUrlByMapping("admin/common/commont_push.shtml"),                                //再次推送的接口
    DELETE: helper.url.getUrlByMapping("admin/association/delete_article_association.shtml"),               //删除内容接口
    WAIT_AUDIT_STATE: 2   //待审核状态码（取消发布回到待审核）
 //   UPDATE: helper.url.getUrlByMapping("admin/gsladd.shtml?action=edit"),                   //修改内容url
  //  AUDIT: helper.url.getUrlByMapping("admin/gsladd.shtml?action=audit"),                   //审核内容url
  //  VIEW:helper.url.getUrlByMapping("admin/gslview.shtml")									//查看详情
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
        params.astart_time = helper.convert.formatTimestamp($("#startTime").val());
        params.aend_time = helper.convert.formatTimestamp($("#endTime").val(), {day: 1});
        params.title = $("#keyword").val();
        params.obj_type = $("#obj_type").val();
        params.x = params.offset;   //服务端分页，过滤掉前xxx条记录
        params.y = params.limit;    //服务端分页，每页记录数

        return params;
    },
    //再次推送
    doPush: function (id,obj_type) {
        var data = {
            obj_id: id,
            obj_type: obj_type
        };
        page.feedPush.getFormData(data);

        page.feedPush.$container.find("button").attr("disabled", "disabled");
        $.ajax({
            url: page.CONFIG.PUSH_API,
            type : 'POST',
            data: data,
            dataType : 'json',
            success : function(ret) {
                if(ret.code == 0){
                    layer.closeAll();
                    toastr.success('再次推送提交成功，请等待审核！');
                    return;
                }

                swal("再次推送失败", ret.errMsg, "error");
                page.feedPush.$container.find("button").removeAttr("disabled");
            },
            error:function(ret) {
                swal("再次推送失败", "请稍候再重试或联系管理员", "error");
                page.feedPush.$container.find("button").removeAttr("disabled");
            }
        });
    },
    //取消再次推送
    cancelPush: function () {
        layer.closeAll();
    },
    //获取提供给表格位置的自适应浏览器的高度，最小高度500
    getAdaptTableHeight: function () {
        var height = $(window).height() - page.$tool.offset().top - page.$tool.outerHeight() - 30;
        return height >= 500 ? height : 500;
    }
};

//页面事件
page.eventHandler = {
    //打开审核
    showAudit: function (id) {
        helper.win.open({name: "审核工商联要闻",url: page.CONFIG.AUDIT + "&id=" + id});
    },

    //打开编辑
    showEdit: function (id) {
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
    	helper.win.openEditByObj({obj_id: rowDate.obj_id, obj_type: rowDate.obj_type, article_title: rowDate.title, params: {action: "release"}});
    	return;
    },
    //评论管理
    showComment :function(id){
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        helper.win.openCommentByObj({obj_id: rowDate.obj_id, obj_type: rowDate.obj_type, article_title: rowDate.title});
//        var title = rowDate.title.substr(0, 5) + "..评论";
//        helper.win.open({name: title, url: page.CONFIG.COMMENT_URL + "?obj_id=" + rowDate.obj_id + "&obj_type=" + rowDate.obj_type});
    },
    //打开再次推送窗口
    showPush: function (id) {
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        var objtype="其他";
        var pushtype=0;
        if(rowDate.obj_type==1){
        	objtype="早茶";
        	pushtype=2;
        }
        else if(rowDate.obj_type==2){
        	objtype="秘闻";
        }
        else if(rowDate.obj_type==4){
        	objtype="活动";
        	pushtype=1;
        }
        else if(rowDate.obj_type==5){
        	objtype="话题";
        	pushtype=1;
        }
        else if(rowDate.obj_type==18){
        	objtype="圈子帮助";
        	pushtype=1;
        }
        else if(rowDate.obj_type==19){
        	objtype="帖子";
        	pushtype=1;
        }
        else if(rowDate.obj_type==8){
        	objtype="榜样";
        }
        else if(rowDate.obj_type==6){
        	objtype="专题";
        }
        else if(rowDate.obj_type==9){
        	objtype="工商联新闻";
        }
        else if(rowDate.obj_type==10){
        	objtype="商机";
        }
        else if(rowDate.obj_type==12){
        	objtype="用户动态";
        }
        else if(rowDate.obj_type==13){
        	objtype="商会资讯";
        }
        else if(rowDate.obj_type==14){
        	objtype="商会通知";
        }
        else if(rowDate.obj_type==7){
        	objtype="江湖事";
        }
        var template = '<div class="wrapper wrapper-content animated full-height">'
            + '<div id="divPushAgain"></div>'
            + '<div class="row m-t-lg">'
            + '<div class="col-md-offset-2 col-md-3"><button class="btn btn-primary btn-block btn-lg" onclick="page.derive.doPush('+rowDate.obj_id+','+rowDate.obj_type+')"><i class="glyphicon glyphicon-ok"></i>&nbsp;&nbsp;确认推送</button></div>'
            + '<div class="col-md-3"><button class="btn btn-default btn-block btn-lg" onclick="page.derive.cancelPush()"><i class="glyphicon glyphicon-remove"></i>&nbsp;&nbsp;取消推送</button></div>'
            + '</div></div>';

        layer.open({
            type: 1,
            title: '<span class="label label-warning">【{0}】{1}</span>&nbsp;&nbsp;的再次推送'.Format(objtype,rowDate.title),
            skin: 'layui-layer-rim', //加上边框
            area: ['95%', '95%'],   //宽高
            scrollbar: false,
            content: template.Format({id: id})
        });
        if(pushtype==1){
            page.feedPush = new module.push.feed({
                container: '#divPushAgain',
                defaultPush: {selected: 1, value: module.push.pushEnum.circle}
            });
        }else if(pushtype==2){
            page.feedPush = new module.push.feed({
                container: '#divPushAgain',
                defaultPush: {selected: 1, value: module.push.pushEnum.all}
            });
        }else{
            page.feedPush = new module.push.feed({
                container: '#divPushAgain',
                defaultPush: {selected: 1, value: module.push.pushEnum.none}
            });
        }
    },
    //删除已发布内容
    delete: function (id,obj_id,obj_type) {
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        swal({
            title: "您确定要删除选中的信息吗？",
            text: rowDate.title,
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
                    id: id,
        			obj_id: obj_id,
        			obj_type: obj_type,
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
                        swal("删除失败", ret.errMsg, "error");
                    }
                },
                error:function(ret) {
                    swal("删除失败", "error");
                }
            });
        });
    },
    //取消发布招商项目
    backout: function (id) {
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        var url="";
        if(rowDate.obj_type==1)
        	url=helper.url.getUrlByMapping("admin/morning/update_morning_id.shtml");
        else if(rowDate.obj_type==2)
        	url=helper.url.getUrlByMapping("admin/secretNews/check_pendingauditsecretnews.shtml");
        else if(rowDate.obj_type==4)
        	url=helper.url.getUrlByMapping("admin/circle/update_circle_related.shtml");
        else if(rowDate.obj_type==5)
        	url=helper.url.getUrlByMapping("admin/topic/audit_topic.shtml");
        else if(rowDate.obj_type==19)
        	url=helper.url.getUrlByMapping("admin/circle_share/audit_share.shtml");
        else if(rowDate.obj_type==8)
        	url=helper.url.getUrlByMapping("admin/example/audit_example.shtml");
        else if(rowDate.obj_type==6)
        	url=helper.url.getUrlByMapping("admin/hotspots/audit_hotspots_id.shtml");
        else if(rowDate.obj_type==9)
        	url=helper.url.getUrlByMapping("admin/gsl/audit_gsl.shtml");
        else if(rowDate.obj_type==10)
        	url=helper.url.getUrlByMapping("admin/business/update_business_id.shtml");
        else if(rowDate.obj_type==7)
        	url=helper.url.getUrlByMapping("admin/article/audit_article.shtml");
        else{
        	swal("操作失败", "该类型文章不可操作撤销！", "error");
        	return;
        }
        swal({
            title: "您确定要撤销发布选中的信息吗？",
            text: rowDate.title,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "撤销发布",
            cancelButtonText:'取消',
            closeOnConfirm: false
        }, function () {
            swal({title: "撤销操作中，请稍候", type: "info", showConfirmButton: false});
            $.ajax({
                url: url,
                type : 'POST',
                data: {
                    "id": rowDate.obj_id,
                    "state": page.CONFIG.WAIT_AUDIT_STATE,
                    "cancel_publication": 1
                },
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                        swal({title:"撤销发布成功", text: "1s后自动消失...", type: "success", timer: 1000});
                        page.$table.bootstrapTable('remove', {
                            field: "id",
                            values: id
                        });
                        page.$table.bootstrapTable('removeByUniqueId', id);
                        page.$table.bootstrapTable('refresh');
                    }else{
                        swal("操作失败", ret.errMsg, "error");
                    }
                },
                error:function(ret) {
                    swal("操作失败", "error");
                }
            });
        });
    },
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
        pageSize: 20,                //每页的记录行数（*）
        pageList: [10, 20, 50, 100],     //允许选择的每页的数量切换
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
            field: 'title',
            title: '标题',
            align: 'left',
            formatter: gslDetail,
            events: 'detailsEvents'
        },{
        	field: 'obj_type',
        	title: '类型',
            width: "150px",
        	formatter: function(value){
        		switch(value){
        		    case 1: return '早茶';
        		    case 2: return '秘闻';
        		    case 4: return '活动';
        		    case 5: return '话题';
        		    case 18: return '圈子帮助';
        		    case 19: return '帖子';
        		    case 8: return '榜样';
        		    case 6: return '专题';
        		    case 9: return '工商联新闻';
        		    case 10: return '商机(招商项目)';
        		    case 12: return '用户动态';
        		    case 13: return '商会资讯';
        		    case 14: return '商会通知';
        		    case 7: return '江湖事';
        		    default: return '-';
        		}
        	},
        	align: 'center'
        },{
        	field: 'audit_user_name',
        	title: '审核人',
            width: "100px",
        	align: 'center'
        },{
        	field: 'audit_time',
        	title: '发布时间',
            width: "150px",
        	formatter: function(value){
        		return helper.convert.formatDate(value);
        	},
        	align: 'center'
        },{
        	field: 'update_name',
        	title: '最后修改人',
            width: "100px",
        	align: 'center'
        },{
        	field: 'update_time',
        	title: '修改时间',
            width: "150px",
        	formatter: function(value){
        		return helper.convert.formatDate(value);
        	},
        	align: 'center'
        },{
            field: ' ',
            title: '操作',
            align: 'center',
            width: "350px",
            formatter:function(value, row){
            	//18,12,13,14
            	var strHtml = '';
            	var obj_type = ','+row.obj_type+',';
            	var edittype = '';
            	var commenttype = '';
            	var backouttype = '';
            	var pushtype = '';
            	if(',18,13,14,'.indexOf(obj_type) >= 0)
            		edittype = 'disabled';
            	if(',14,'.indexOf(obj_type) >= 0)
            		commenttype = 'disabled';
            	if(',18,13,14,'.indexOf(obj_type) >= 0)
            		backouttype = 'disabled';
            	if(',14,'.indexOf(obj_type) >= 0)
            		pushtype = 'disabled';
            	strHtml='<button type="button" '+ edittype +' class="btn btn-sm btn-info" onclick="page.eventHandler.showEdit(' + row.id + ')">编辑</button>';
                strHtml+='&nbsp;<button type="button" '+ commenttype +' class="btn btn-sm btn-warning" onclick="page.eventHandler.showComment('+row.id+')">评论管理</button>';
                strHtml += '&nbsp;<button type="button" '+ backouttype +' class="btn btn-sm btn-warning" onclick="page.eventHandler.backout(' + row.id + ')">取消发布</button>';
                strHtml += '&nbsp;<button type="button" '+ pushtype +' class="btn btn-sm btn-warning" onclick="page.eventHandler.showPush(' + row.id + ')">再次推送</button>';
                strHtml+=' <button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete('+row.id+',' + row.obj_id + ','+row.obj_type+')">删除</button>';
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
window.detailsEvents = {
        'click .gslDetail': function (e, value, row, index) {
        	helper.win.openAuditByObj({obj_id: row.obj_id, obj_type: row.obj_type, article_title: row.title});
        	return;
        },
    };
function gslDetail(value, row) {
	var size = value.length;
	if(size>60)
		value = value.substring(0,60);
    return '<a href="#" class="gslDetail">' + value + '</a>';
}
});