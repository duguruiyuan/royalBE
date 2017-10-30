//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'iCheckPlus', 'toastrPlus', 'module.push', 'datetimepicker', 'table', 'tableEditable'], function (bs, $, helper, swal, layer, iCheck, toastr) {

	var module = {
	        push: require('module.push')
	    };
	
	//页面所用到配置page.CONFIG.SHOW_PUSH_USER
page.CONFIG = {
    GET_FEED_LIST: helper.url.getUrlByMapping(""),                                  // 查询文章类型
	GET_LIST_API: helper.url.getUrlByMapping("admin/pushDevice/find_pushdevicelist.shtml"),// 查询设备推送列表接口
	GET_FEED: helper.url.getUrlByMapping("admin/pushDevice/find_deviceinfo.shtml"),// 查询设备推送详情接口
    SUBMIT_AUDIT_API: helper.url.getUrlByMapping("admin/pushDevice/check_pushdeviceinfo.shtml"),    // 提交审核接口
    DELETE_API: helper.url.getUrlByMapping("admin/pushDevice/update_pushdevicestatus.shtml"),  // 删除设备推送接口
    SHOW_PUSH_USER: helper.url.getUrlByMapping("admin/pushmemberindex.shtml"),                       // 查看推送用户
    HANDLE_URL: helper.url.getUrlByMapping("admin/pushdevicehandle.shtml"),  // 新增/审核/修改设备推送url
    SHOW_URL: helper.url.getUrlByMapping("admin/feedinfo.shtml"),                                     // 查看/审核信息流url
    AUDIT_STATE: 2,          // 提交审核状态值
    DELETE_STATUS: 2,       // 删除的状态码
    REPLY_STATUS: 1,        // 恢复的状态码
    NOPASS_STATE: 4,        // 未通过的状态码feed/find_feed_tmp.shtml?type=1
    STATE_LIST: {"1": "已发布", "2": "待审核", "3": "草稿", "4": "审核未通过"},
    TYPE_LIST: {"wait": {type: "wait", param: "status=1&state=2", title: "待审核设备推送", action: "audit"},
        "complete": {type: "complete", param: "status=1&state=1", title: "已推送设备推送", action: ""},
        "trash": {type: "trash", param: "status=2", title: "设备推送垃圾箱", action: ""}
    }      // 页面全部状态
};

page.type = helper.url.queryString("type") || page.CONFIG.TYPE_LIST.wait.type;
page.typeInfo = page.CONFIG.TYPE_LIST[page.type];
page.obj = {
		obj_id: '',
		obj_type: '',
		display_position:''
};

// 存储页面table对象
page.$tool = $('#tableTools');
page.$table = $('#tableList');

// 搜索对象
// page.$feedType = $("#feedType");

// 组件实例
page.mobilePush = new Object();

/**
 * 提供给引用页面刷新用，如果未声明该方法，则引用页面调用将使用浏览器重载重新刷新本页面
 */
page.refresh = function () {
    $("#btnSearch").click();
};

// 页面级的帮助对象集合
page.derive = {
    // 获取表单参数用于搜索
    getParams: function (params) {
// params.obj_type = page.$feedType.val();
        params.create_start_time = helper.convert.formatTimestamp($("#startTime").val());
        params.create_end_time = helper.convert.formatTimestamp($("#endTime").val(), {day: 1});
        params.title = $("#keyword").val();
        params.x = params.offset;   // 服务端分页，过滤掉前xxx条记录
        params.y = params.limit;    // 服务端分页，每页记录数

        return params;
    },

    // 获取提供给表格位置的自适应浏览器的高度，最小高度500
    getAdaptTableHeight: function () {
        var height = $(window).height() - page.$tool.offset().top - page.$tool.outerHeight() - 30;
        return height >= 500 ? height : 500;
    },
    
    // 审核通过
    successPush: function (id) {
    	var data = {
    		id: id,
            obj_id: page.obj.obj_id,
            obj_type: page.obj.obj_type,
            display_position:page.obj.display_position,
            state: 1
        };
        page.mobilePush.getFormData(data);

// page.mobilePush.$container.find("button").attr("disabled", "disabled");
        $('#checkPush1').attr("disabled", "disabled");
        $.ajax({
            url: page.CONFIG.SUBMIT_AUDIT_API,
            type : 'POST',
            data: data,
            dataType : 'json',
            success : function(ret) {
            	console.info("code",ret.code);
                if(ret.code == 0){
                	
                    layer.closeAll();
                    toastr.success('审核成功！');
                    page.$table.bootstrapTable('removeByUniqueId', id);
                    page.$table.bootstrapTable('refresh');
                    return;
                }

                swal("审核失败", ret.errMsg, "error");
// page.mobilePush.$container.find("button").removeAttr("disabled");
                $('#checkPush1').removeAttr("disabled");
            },
            error:function(ret) {
                swal("审核失败", "请稍候再重试或联系管理员", "error");
// page.mobilePush.$container.find("button").removeAttr("disabled");
                $('#checkPush1').removeAttr("disabled");
            }
        });
    },
    
    // 删除
    delPush: function () {},
    
    // 取消
    cancelPush: function () {
    	layer.closeAll();
    }
};

// 页面事件
page.eventHandler = {
	// 文章类型
	getFeedType: function () {
		
	},
    // 打开新增秘闻
    showAdd: function () {
        helper.win.open({name: "新增设备推送", url: page.CONFIG.HANDLE_URL});
    },

    // 打开审核
    showAudit: function (id) {
    	page.obj.obj_id = '';
    	page.obj.obj_type = '';
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        console.info(rowDate);
        console.info("page.type",page.type);
        page.obj.obj_id = rowDate.obj_id;
    	page.obj.obj_type = rowDate.obj_type;
    	page.obj.display_position = rowDate.display_position;
    	var btnHtml = ''
        	switch (page.type) {
    	        case page.CONFIG.TYPE_LIST.wait.type:
    	        	btnHtml += '<div class="col-md-offset-2 col-md-3"><button id="checkPush1" class="btn btn-primary btn-block btn-lg" onclick="page.derive.successPush({id})"><i class="glyphicon glyphicon-ok"></i>&nbsp;&nbsp;审核通过</button></div>';
    	        	btnHtml += '<div class="col-md-3"><button class="btn btn-danger btn-block btn-lg" onclick="page.eventHandler.delete('+id+')"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;删除</button></div>';
    	        	btnHtml += '<div class="col-md-3"><button class="btn btn-default btn-block btn-lg" onclick="page.derive.cancelPush()"><i class="glyphicon glyphicon-remove"></i>&nbsp;&nbsp;取消</button></div>';
    	        	break;
    	        case page.CONFIG.TYPE_LIST.complete.type:
    	        	btnHtml += '<div class="col-md-offset-3 col-md-3"><button class="btn btn-danger btn-block btn-lg" onclick="page.eventHandler.delete('+id+')"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;删除</button></div>';
    	        	btnHtml += '<div class="col-md-3"><button class="btn btn-default btn-block btn-lg" onclick="page.derive.cancelPush()"><i class="glyphicon glyphicon-remove"></i>&nbsp;&nbsp;取消</button></div>';
    	        	break;
    	        case page.CONFIG.TYPE_LIST.trash.type:
    	        	btnHtml += '<div class="col-md-offset-3 col-md-3"><button class="btn btn-primary btn-block btn-lg" onclick="page.eventHandler.reply('+id+')"><i class="fa fa-reply"></i>&nbsp;&nbsp;恢复</button></div>';
    	        	btnHtml += '<div class="col-md-3"><button class="btn btn-default btn-block btn-lg" onclick="page.derive.cancelPush()"><i class="glyphicon glyphicon-remove"></i>&nbsp;&nbsp;取消</button></div>';
    	        	break;
    	    }
    	function checkedVal(displayVal,val){
    		console.info(displayVal)
    		if(displayVal == val)
    			return 'checked="checked"';
    			return '';
    	}
    	function checkedPagetype(type){
    		console.info(type)
    		if(type == "complete" || type == "trash" )
    			return 'none';
    			return '';

    	}
    	function checkedPagetype1(type){
    		console.info(type)
    		if(type == "trash")
    			return 'none';
    			return '';

    	}
    	function checkedPagetype2(type){
    		console.info(type)
    		if(type != "trash")
    			return 'none';
    			return '';

    	}
    	
        var template = '<div class="wrapper wrapper-content animated full-height" id="modlPushDevicel" style="padding-bottom:25px">'
        	+'<div class="form-group" style="height:auto;overflow:hidden">'
        	+'<label class="col-sm-2 control-label" style="text-align:right">点击行为：</label>'
        	+'<div class="col-sm-9" id="typeSelect">'
        	+'<label for="radType1" class="radio i-checks radio-inline">'
        	+'<input id="radType1" class="typeSelections" name="radType" type="radio" value="1"'+ checkedVal(rowDate.display_position,1) +' disabled="disabled" data-reverse data-toggle="#typeToggle" />查看信息源'
        	+'</label><label for="radType2" class="radio i-checks radio-inline">'
        	+'<input id="radType2" class="typeSelections" name="radType" type="radio" value="2"'+ checkedVal(rowDate.display_position,2) +'  disabled="disabled" />查看我的消息'
        	+'</label><label for="radType3" class="radio i-checks radio-inline">'
        	+'<input id="radType3" class="typeSelections" name="radType" type="radio" value="3"'+ checkedVal(rowDate.display_position,3) +' disabled="disabled" />打开首页'
        	+'</label><label for="radType4" class="radio i-checks radio-inline">'
        	+'<input id="radType4" class="typeSelections" name="radType" type="radio" value="4"'+ checkedVal(rowDate.display_position,4) +' disabled="disabled" />打开发现'
        	+'</label><label for="radType5" class="radio i-checks radio-inline">'
        	+'<input id="radType5" class="typeSelections" name="radType" type="radio" value="5"'+ checkedVal(rowDate.display_position,5) +' disabled="disabled" />打开商会'
        	+'</label></div></div>'
        	+ '<div class="form-horizontal" id="typeToggle">'
        	+'<div class="form-group">'
        	+ '<label class="col-sm-2 control-label">信息源：</label>'
        	+ '<div class="col-sm-9">'
        	+ '<div class="form-group"><label class="col-sm-2 control-label">选择信息源：</label><div class="col-sm-10"><span>'+rowDate.article_title+'</span></div></div>'
        	+ '<div class="form-group"><label class="col-sm-2 control-label">类型：</label><div class="col-sm-10"><span>'+helper.obj.getObjLabel(rowDate.obj_type)+'</span></div></div>'
        	+ '</div>'
        	+ '</div></div>'
            + '<div id="divPushAgain"></div>'
            + '<div class="row m-t-lg" style="padding-bottom:25px" >'
// + '<div class="col-md-offset-2 col-md-3" style = "
// display:'+checkedPagetype(page.type)+'"><button class="btn btn-primary
// btn-block btn-lg" id="checkPush1" onclick="page.derive.successPush({id})"><i
// class="glyphicon glyphicon-ok"></i>&nbsp;&nbsp;审核通过</button></div>'
// + '<div class="col-md-3" style = "
// display:'+checkedPagetype1(page.type)+'"><button class="btn btn-danger
// btn-block btn-lg" onclick="page.eventHandler.delete('+id+')"><i
// class="glyphicon glyphicon-remove"></i>&nbsp;&nbsp;删除</button></div>'
// + '<div class="col-md-3" style = "
// display:'+checkedPagetype2(page.type)+'"><button class="btn btn-danger
// btn-block btn-lg" onclick="page.eventHandler.reply('+id+')"><i
// class="glyphicon glyphicon-remove"></i>&nbsp;&nbsp;恢复</button></div>'
// + '<div class="col-md-3"><button class="btn btn-default btn-block btn-lg"
// onclick="page.derive.cancelPush()"><i class="glyphicon
// glyphicon-remove"></i>&nbsp;&nbsp;取消</button></div>'
            + btnHtml
            + '</div><div class="col-sm-9" ></div></div>';
        layer.open({
            type: 1,
            // title: '<span class="label
			// label-warning">【信息流】{0}</span>&nbsp;&nbsp;的再次推送'.Format(rowDate.title),
            title: '设备推送审核',
            skin: 'layui-layer-rim', // 加上边框
            area: ['95%', '95%'],   // 宽高
            scrollbar: false,
            content: template.Format({id: id})
        });
        $.ajax({
        	url: page.CONFIG.GET_FEED,
        	data: {
        		id: rowDate.id,
        		state: rowDate.state
        	},
        	dataType: 'json',
        	success: function (ret) {console.log(ret.data);
	        	// 初始化设备推送组件
	            page.mobilePush = new module.push.mobile({
	                readonly: true,
	                container: "#divPushAgain",
	                range: {alluser: 2},
	                formData: ret.data
	            });
	            iCheck.toggle.init("#modlPushDevicel");
        	}
        });
    },
    
    // 查看推送用户
    showPushUser: function (id) {
// layer.open({
// type: 2,
// title: '',
// shadeClose: true,
// content: page.CONFIG.SHOW_PUSH_USER + '?id=' + id,
// area: [ '1000px', '800px' ]
// });
    	 helper.win.open({name: "查看推送用户", url: page.CONFIG.SHOW_PUSH_USER + "?id=" + id});
    },
    // 打开编辑
    showEdit: function (id) {
        var action = page.typeInfo.action ? page.typeInfo.action : "edit";
        helper.win.open({name: "编辑秘闻", url: page.CONFIG.HANDLE_URL + "?action=" + action + "&id=" + id});
    },

    // 提交审核/删除/恢复秘闻
    doHandler: function (id, data, api, label) {
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        swal({
            title: "您确定要{0}选中的信息吗？".Format(label),
            text: rowDate.title_imei,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: label,
            cancelButtonText:'取消',
            closeOnConfirm: false
        }, function () {
            swal({title: label + "中，请稍候", type: "info", showConfirmButton: false});
            $.ajax({
                url: api,
                type : 'POST',
                data: data,
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                    	layer.closeAll();
                        swal({title: label+ "成功", text: "1s后自动消失...", type: "success", timer: 1000});
                        page.$table.bootstrapTable('remove', {
                            field: "id",
                            values: id
                        });
                        page.$table.bootstrapTable('removeByUniqueId', id);
                        page.$table.bootstrapTable('refresh');
                    }else{
                        swal(label + "失败", ret.errMsg, "error");
                    }
                },
                error:function(ret) {
                    swal(label + "失败", "请稍候再重试或联系管理员", "error");
                }
            });
        });
    },

    // 提交审核秘闻
    submitAudit: function (id) {
        var data = {
            "id": id,
            "state": page.CONFIG.AUDIT_STATE
        };
        page.eventHandler.doHandler(id, data, page.CONFIG.SUBMIT_AUDIT_API, "提交审核");
    },

    // 删除秘闻
    delete: function (id) {
        var data = {
            "id": id,
            "status": page.CONFIG.DELETE_STATUS
        };
        page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "删除");
    },

    // 恢复秘闻
    reply: function (id) {
        var data = {
            "id": id,
            "status": page.CONFIG.REPLY_STATUS
        };
        page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "恢复");
    },

    // 秘闻状态为审核拒绝时刻显示拒绝原因
    showTip: function (el) {
        layer.tips($(el).data("tip"), el, {tips: 3});
    }
};


$(document).ready(function () {
    // 初始化页面状态
    if(!page.CONFIG.TYPE_LIST[page.type]){
        page.typeInfo = page.CONFIG.TYPE_LIST.wait;
        page.type = page.typeInfo.type;
    }
    document.title = page.typeInfo.title;
    $("#pageSubTitle").html(page.typeInfo.title);

    // 按照不同模块切换显示/隐藏
    $("[data-type]").each(function () {
        $(this).data("type") == page.type ? $(this).show() : $(this).hide();
    });

    // 初始化日期控件
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
        // 设置日期控件前后日期的依赖
        var $this = $(e.target);
        if($this.attr("data-start")){
            $this.datetimepicker("setStartDate", $($this.attr("data-start")).val());
        }
        if($this.attr("data-end")){
            $this.datetimepicker("setEndDate", $($this.attr("data-end")).val());
        }
    });
    $.ajax({
    	url: "{0}?{1}".Format(page.CONFIG.GET_LIST_API, page.typeInfo.param),
    	type: 'post',
    	dataType: 'json',
    	success: function (ret) {
    		console.log(ret);
    	}
    });
    // 表格初始化
    page.$table.bootstrapTable({
        // 请求相关
        url: "{0}?{1}".Format(page.CONFIG.GET_LIST_API, page.typeInfo.param),  // AJAX读取列表数据的URL
        method: "get",                  // 请求方式
        contentType: "application/x-www-form-urlencoded",// 请求数据内容格式 默认是
															// application/json
															// 自己根据格式自行服务端处理
        dataType: "json",               // 服务器返回数据类型
        cache: false,                   // 不缓存数据
        queryParamsType: "limit",       // 查询参数组织方式
        queryParams: function (params) {
            return page.derive.getParams(params);
        },

        // 分页相关
        pagination: true,            // 是否分页
        pageNumber:1,                // 初始化加载第一页，默认第一页
        pageSize: 20,                // 每页的记录行数（*）
        pageList: [10, 20, 50, 100],     // 允许选择的每页的数量切换
        sidePagination: "server",    // 分页方式：client客户端分页，server服务端分页（*）

        // 表格总体外观相关
        height: page.derive.getAdaptTableHeight(),            // 整个表格的高度
        detailView: false,      // 是否显示父子表
        cardView: false,        // 是否显示详细图
        undefinedText: "—",     // 当数据为空的填充字符
        showColumns: true,      // 是否显示筛选列按钮
        showRefresh: true,      // 是否显示刷新按钮
        clickToSelect: true,    // 是否开启点击选中行,自动选择rediobox 和 checkbox
        toolbar:'#tableTools',  // 工具按钮的容器
        // classes: 'table table-hover table-no-bordered',
        // buttonsClass: 'default btn-outline',

        // 表格内容相关设置
        idField:"id",       // 当前行主键的id值
        uniqueId:'id',      // 获取当前行唯一的id 标示，作用于后面的 var rowData =
							// $table.bootstrapTable('getRowByUniqueId', id);
        dataField: "data",  // 服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
        columns: [{
            field: 'title_imei',
            title: '手机提醒',
            align: 'left',
            formatter: function (value, row) {
            	if (!value) return '—';
                return '<a href="javascript:;" onclick="page.eventHandler.showAudit(' + row.id + ')">' + subStr(HTMLDecode(value)) + '</a>';
            }
        },{
            field: 'content_imei',
            title: '消息主体',
            align: 'left',
            formatter: function (value, row) {
            	if (!value) return '—';
                return  subStr(HTMLDecode(value));
            }
        },{
            field: ' ',
            width: '100px',
            title: page.type == page.CONFIG.TYPE_LIST.wait.type ? '提交人' : page.type == page.CONFIG.TYPE_LIST.complete.type ? '审核人' : '删除人',
            align: 'center',
            formatter:function(value, row){
                switch (page.type){
                    case page.CONFIG.TYPE_LIST.wait.type: return row.author_name;   // 提交人
                    case page.CONFIG.TYPE_LIST.complete.type: return row.audit_user_name;   // 审核人
                    case page.CONFIG.TYPE_LIST.trash.type: return row.audit_user_name;         // 删除人
                    default: return '—';
                }
            }
        },{
            field: ' ',
            title: '提交时间',
            align: 'center',
            width: '150px',
            title: page.type == page.CONFIG.TYPE_LIST.wait.type ? '提交时间' : page.type == page.CONFIG.TYPE_LIST.complete.type ? '推送时间' : '删除时间',
            align: 'center',
            formatter:function(value, row){
                switch (page.type){
                    case page.CONFIG.TYPE_LIST.wait.type: return helper.convert.formatDate(row.create_time);   // 提交时间
                    case page.CONFIG.TYPE_LIST.complete.type: return helper.convert.formatDate(row.audit_time);   // 审核时间
                    case page.CONFIG.TYPE_LIST.trash.type: return helper.convert.formatDate(row.audit_time);         // 删除时间
                    default: return '—';
                }
            }
        },{
        	field: ' ',
        	title: '操作',
        	align: 'center',
        	width: '250px',
        	formatter:function(value, row){
                var strHtml= '';
                switch (page.type){
                    case page.CONFIG.TYPE_LIST.wait.type:
                    default:
                        // 待审核列表
                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.showAudit(' + row.id + ')">审核</button>';
                    strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.showPushUser(' + row.id + ')">查看推送用户</button>';
                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete(' + row.id + ', 2)">删除</button>';
                        break;
                    case page.CONFIG.TYPE_LIST.complete.type:
                        // 已推送列表
                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.showPushUser(' + row.id + ')">查看推送用户</button>';
                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete(' + row.id + ', 1)">删除</button>';
                        break;
                    case page.CONFIG.TYPE_LIST.trash.type:
                        // 垃圾箱列表
                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.reply(' + row.id + ', ' + row.state + ')">恢复</button>';
                        break;
                }

                return strHtml;
            }
        }]
    });
    
    // 回车搜索事件
    $("#keyword").keyup(function (event) {
        if(event.keyCode == 13)
            $("#btnSearch").click();
    });

    // 新增秘闻操作
    $("#btnAdd").click(page.eventHandler.showAdd);

    // 搜索
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