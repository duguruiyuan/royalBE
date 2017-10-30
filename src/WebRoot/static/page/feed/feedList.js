//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastrPlus', 'module.push', 'datetimepicker', 'table', 'tableEditable', 'validator'], function (bs, $, helper, swal, layer, toastr) {
    var module = {
        push: require('module.push')
    };
    
	//页面所用到配置page.CONFIG.SHOW_PUSH_USER
	page.CONFIG = {
	    GET_FEED_LIST: helper.url.getUrlByMapping(""),                                              //查询文章类型
		GET_LIST_API: helper.url.getUrlByMapping("admin/feed/find_feed.shtml"),                     //查询信息流列表接口
		GET_FEED: helper.url.getUrlByMapping("admin/feed/find_feed_detail.shtml"),                     //查询信息流详情接口
	    SUBMIT_AUDIT_API: helper.url.getUrlByMapping("admin/common/commont_audit.shtml"),                //提交审核接口
	    DELETE_API: helper.url.getUrlByMapping("admin/feed/update_feed.shtml"),                        //删除信息流接口
	    SHOW_PUSH_USER: helper.url.getUrlByMapping("admin/feeduserlist.shtml"),                       //查看推送用户
	    HANDLE_URL: helper.url.getUrlByMapping("admin/feedhandle.shtml"),                                 //新增/审核/修改信息流url
	    SHOW_URL: helper.url.getUrlByMapping("admin/feedinfo.shtml"),                                     //查看/审核信息流url
	    AUDIT_STATE: 2,          //提交审核状态值
	    DELETE_STATUS: 2,       //删除的状态码
	    REPLY_STATUS: 1,        //恢复的状态码
	    NOPASS_STATE: 4,        //未通过的状态码feed/find_feed_tmp.shtml?type=1
	    STATE_LIST: {"1": "已发布", "2": "待审核", "3": "草稿", "4": "审核未通过"},
	    TYPE_LIST: {"wait": {type: "wait", param: "status=1&state=2", title: "待审信息流", action: "audit"},
	        "complete": {type: "complete", param: "status=1&state=1", title: "已推送信息流", action: ""},
	        "trash": {type: "trash", param: "status=2", title: "信息流垃圾箱", action: ""}
	    }      //页面全部状态
	};

	page.type = helper.url.queryString("type") || page.CONFIG.TYPE_LIST.wait.type;
	page.typeInfo = page.CONFIG.TYPE_LIST[page.type];
	page.obj = {
			obj_id: '',
			obj_type: ''
	};

	//存储页面table对象
	page.$tool = $('#tableTools');
	page.$table = $('#tableList');

	//搜索对象
	page.$feedType = $("#feedType");
	//date对象
	page.$form_date = $('.form_date');

	//组件实例
	page.feedPush = new Object();

	/**
	 * 提供给引用页面刷新用，如果未声明该方法，则引用页面调用将使用浏览器重载重新刷新本页面
	 */
	page.refresh = function () {
	    $("#btnSearch").click();
	};

	//页面级的帮助对象集合page.derive.submitStatus
	page.derive = {
	    //获取表单参数用于搜索
	    getParams: function (params) {
	        params.obj_type = page.$feedType.val();
	        params.author_type = $('#authorType').val();
	        params.start_time = helper.convert.formatTimestamp($("#startTime").val());
	        params.end_time = helper.convert.formatTimestamp($("#endTime").val(), {day: 1});
	        params.title = $("#keyword").val();
	        params.x = params.offset;   //服务端分页，过滤掉前xxx条记录
	        params.y = params.limit;    //服务端分页，每页记录数

	        return params;
	    },

	    //获取提供给表格位置的自适应浏览器的高度，最小高度500
	    getAdaptTableHeight: function () {
	        var height = $(window).height() - page.$tool.offset().top - page.$tool.outerHeight() - 30;
	        return height >= 500 ? height : 500;
	    },
	    
	    //审核通过
	    successPush: function (id) {
	        //page.feedPush.$container.find("button").attr("disabled", "disabled");
	        
	        var bv = $('#divPushAgain').data('bootstrapValidator');
            bv.validate();
	        if (bv.isValid()) {
	        	var data = {
    	    		id: id,
    	            obj_id: page.obj.obj_id,
    	            obj_type: page.obj.obj_type,
    	            state: 1
    	        };
    	        page.feedPush.getFormData(data);
    	        page.derive.submitStatus(true);
	        	$.ajax({
		            url: page.CONFIG.SUBMIT_AUDIT_API,
		            type : 'POST',
		            data: data,
		            dataType : 'json',
		            success : function(ret) {
		                if(ret.code == 0){
		                    layer.closeAll();
		                    toastr.success('审核成功！');
		                    page.$table.bootstrapTable('removeByUniqueId', id);
		                    page.$table.bootstrapTable('refresh');
		                    //page.derive.submitStatus(false);
		                    return;
		                }

		                swal("审核失败", ret.errMsg, "error");
		                page.feedPush.$container.find("button").removeAttr("disabled");
		            },
		            error:function(ret) {
		                swal("审核失败", "请稍候再重试或联系管理员", "error");
		                page.feedPush.$container.find("button").removeAttr("disabled");
		            },
		            complete: function () {
		            	page.derive.submitStatus(false);
		            }
		        });
	        }
	        
	        
	    },
	    //删除
	    delete: function (id, state) {
	    	var data = {
	            "id": id,
	            "state": state,
	            "status": page.CONFIG.DELETE_STATUS
	        };
	        $.ajax({
	            url: page.CONFIG.DELETE_API,
	            type : 'POST',
	            data: data,
	            dataType : 'json',
	            success : function(ret) {
	                if(ret.code == 0){
	                    layer.closeAll();
	                    toastr.success('删除成功！');
	                    page.$table.bootstrapTable('removeByUniqueId', id);
	                    page.$table.bootstrapTable('refresh');
	                    return;
	                }

	                swal("删除失败", ret.errMsg, "error");
	            },
	            error:function(ret) {
	                swal("删除失败", "请稍候再重试或联系管理员", "error");
	            }
	        });
	    },
	    reply: function (id, state) {
	        var data = {
	            "id": id,
	            "state": state,
	            "status": page.CONFIG.REPLY_STATUS
	        };
	        page.derive.submitStatus(true);
	        $.ajax({
	            url: page.CONFIG.DELETE_API,
	            type : 'POST',
	            data: data,
	            dataType : 'json',
	            success : function(ret) {
	                if(ret.code == 0){
	                    layer.closeAll();
	                    toastr.success('恢复成功！');
	                    page.$table.bootstrapTable('removeByUniqueId', id);
	                    page.$table.bootstrapTable('refresh');
	                    return;
	                }

	                swal("恢复失败", ret.errMsg, "error");
	            },
	            error:function(ret) {
	                swal("恢复失败", "请稍候再重试或联系管理员", "error");
	            },
	            complate: function () {
	            	page.derive.submitStatus(false);
	            }
	        });
	    },
	    //取消
	    cancelPush: function () {
	    	layer.closeAll();
	    	swal.close();
	    	page.derive.submitStatus(false);
	    },
	    
	    //修改表单提示
	    setDatePlaceholder: function (type) {
	    	switch (type) {
	    	    case page.CONFIG.TYPE_LIST.wait.type:
	    	    	var dateStr = '提交日期';
	    	    	page.$form_date.eq(0).attr('placeholder', dateStr+'-起');
	    	    	page.$form_date.eq(1).attr('placeholder', dateStr+'-止');
	    	    	break;
	    	    case page.CONFIG.TYPE_LIST.complete.type:
	    	    	var dateStr = '推送日期';
	    	    	page.$form_date.eq(0).attr('placeholder', dateStr+'-起');
	    	    	page.$form_date.eq(1).attr('placeholder', dateStr+'-止');
	    	    	break;
	    	    case page.CONFIG.TYPE_LIST.trash.type:
	    	    	var dateStr = '删除日期';
	    	    	page.$form_date.eq(0).attr('placeholder', dateStr+'-起');
	    	    	page.$form_date.eq(1).attr('placeholder', dateStr+'-止');
	    	    	break;
	    	}
	    },
	    
	    getFeedType: function (data) {
	    	var _html = '<option value="">信息流类型</option>';
	    	for (var i = 0 in data) {
	    		if (data[i].objLabel == '用户动态' || data[i].objLabel == '商会通知') continue;
	    		_html += '<option value="'+ data[i].objType +'">'+ data[i].objLabel +'</option>';
	    	}
	    	return _html;
	    },
	    
	    //变更各个操作按钮操作状态
        submitStatus: function (type) {
            if(type){
                //提交
                page.$button.attr("disabled", "disabled");
                toastr.info("提交中，请稍候...");
                return;
            }

            //提交完成/失败
            page.$button.removeAttr("disabled");
        }
	};

	//页面事件
	page.eventHandler = {

	    //打开审核
	    showAudit: function (id, flag) {
	    	page.obj.obj_id = '';
	    	page.obj.obj_type = '';
	        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);console.log(rowDate);
	        page.obj.obj_id = rowDate.obj_id;
	    	page.obj.obj_type = rowDate.obj_type;
	    	var btnHtml = ''
	    	switch (page.type) {
		        case page.CONFIG.TYPE_LIST.wait.type:
		        	btnHtml += '<div class="col-md-offset-2 col-md-3"><button class="btn btn-primary btn-block btn-lg" disabled="disabled" onclick="page.derive.successPush({id})"><i class="glyphicon glyphicon-ok"></i>&nbsp;&nbsp;审核通过</button></div>';
		        	btnHtml += '<div class="col-md-3"><button class="btn btn-danger btn-block btn-lg" disabled="disabled" onclick="page.derive.delete('+id+', 2)"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;删除</button></div>';
		        	btnHtml += '<div class="col-md-3"><button class="btn btn-default btn-block btn-lg" disabled="disabled" onclick="page.derive.cancelPush()"><i class="glyphicon glyphicon-remove"></i>&nbsp;&nbsp;取消</button></div>';
		        	break;
		        case page.CONFIG.TYPE_LIST.complete.type:
		        	btnHtml += '<div class="col-md-offset-3 col-md-3"><button class="btn btn-danger btn-block btn-lg" disabled="disabled" onclick="page.derive.delete('+id+', 1)"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;删除</button></div>';
		        	btnHtml += '<div class="col-md-3"><button class="btn btn-default btn-block btn-lg" disabled="disabled" onclick="page.derive.cancelPush()"><i class="glyphicon glyphicon-remove"></i>&nbsp;&nbsp;取消</button></div>';
		        	break;
		        case page.CONFIG.TYPE_LIST.trash.type:
		        	btnHtml += '<div class="col-md-offset-3 col-md-3"><button disabled="disabled" class="btn btn-primary btn-block btn-lg" onclick="page.derive.reply({id},'+ rowDate.state +')"><i class="fa fa-reply"></i>&nbsp;&nbsp;恢复</button></div>';
		        	btnHtml += '<div class="col-md-3"><button disabled="disabled" class="btn btn-default btn-block btn-lg" onclick="page.derive.cancelPush()"><i class="glyphicon glyphicon-remove"></i>&nbsp;&nbsp;取消</button></div>';
		        	break;
		    }
	    	var extra = rowDate.extra ? JSON.parse(rowDate.extra) : {};
	    	var extra = {};
        	if (rowDate.extra && /^\{(.+)\}$/.test(rowDate.extra)) {
        		extra = JSON.parse(rowDate.extra);
        	}
	    	var extraHtml = '';
	    	if (extra.is_voice) {
	    		if (extra.is_voice == 0) {
	        		extraHtml += '<div class="form-group"><label class="col-sm-2 control-label">选择信息源：</label><div class="col-sm-10" style="line-height:34px"><span>'+extra.content+'</span></div></div>';
	        	} else if (extra.is_voice == 1) {
	        		var voiceContent = extra.content ? extra.content : '暂无翻译';
	        		extraHtml += '<div class="form-group"><label class="col-sm-2 control-label">选择信息源：</label><div class="col-sm-10" style="line-height:34px"><audio controls><source src="'+extra.voice+'" type="audio/mp3"></audio></div></div>';
	        		extraHtml += '<div class="form-group"><label class="col-sm-2 control-label">翻译内容：</label><div class="col-sm-10" style="line-height:34px"><span>'+ voiceContent +'</span></div></div>';
	        	}
	    	} else {
	    		if (rowDate.title) {
	    			extraHtml += '<div class="form-group"><label class="col-sm-2 control-label">选择信息源：</label><div class="col-sm-10" style="line-height:34px"><span>'+ rowDate.title +'</span></div></div>';
	    		} else {
	    			extraHtml += '<div class="form-group"><label class="col-sm-2 control-label">选择信息源：</label><div class="col-sm-10" style="line-height:34px"><span>'+ rowDate.summary +'</span></div></div>';
	    		}
	    	}
	        var template = '<div class="wrapper wrapper-content animated full-height">'
	        	+ '<div class="form-horizontal">'
	        	//+ '<div class="form-group"><label class="col-sm-2 control-label">选择信息源：</label><div class="col-sm-10" style="line-height:34px"><span>'+rowDate.title+'</span></div></div>'
	        	+ extraHtml
	        	+ '<div class="form-group"><label class="col-sm-2 control-label">类型：</label><div class="col-sm-10" style="line-height:34px"><span>'+helper.obj.getObjLabel(rowDate.obj_type)+'</span></div></div>'
	        	+ '</div>'
	            + '<form id="divPushAgain"></form>'
	            + '<div class="row m-t-lg m-b" id="divAction">'
	            + btnHtml
	            + '</div></div>';
	        
	        layer.open({
	            type: 1,
	            title: '信息流审核',
	            skin: 'layui-layer-rim', //加上边框
	            area: ['95%', '95%'],   //宽高
	            zIndex: 10,
	            //scrollbar: false,
	            content: template.Format({id: id})
	        });
	        
	        //验证初始化
	        $('#divPushAgain').bootstrapValidator({
	            //指定不验证的情况
	            excluded: [':disabled', ':hidden', ':not(:visible)'],
	            message: '验证未通过',
	            feedbackIcons: {/*输入框不同状态，显示图片的样式*/
	                valid: 'glyphicon glyphicon-ok',
	                invalid: 'glyphicon glyphicon-remove',
	                validating: 'glyphicon glyphicon-refresh'
	            },
	            fields: {}
	        });
	        
	        page.$button = $("#divAction button");
	        
	        $.ajax({
	        	url: page.CONFIG.GET_FEED,
	        	data: {
	        		id: rowDate.id,
	        		state: rowDate.state
	        	},
	        	dataType: 'json',
	        	success: function (ret) {
	        	    var pushType = module.push.pushEnum.none;
	        	    var type = ret.data.obj_type;
	        	    if (type == 1) {
	        	    	pushType = module.push.pushEnum.all;
	        	    } else if (type == 11 || type == 4 || type == 5 || type == 19 || type == 18) {
	        		    pushType = module.push.pushEnum.circle;
	        	    }
	        		page.feedPush = new module.push.feed({
	                	readonly: flag ? true : false,
	                    container: '#divPushAgain',
	                    validatorContainer: '#divPushAgain',
	                    defaultPush: {selected: 1, value: pushType},
	                    formData: ret.pushdevice
	                });
	        		page.derive.submitStatus(false);
	        	}
	        });
	    },
	    
	    //查看推送用户
	    showPushUser: function (id) {
	    	layer.open({
	            type: 2,
	            title: '查看推送用户',
	            shadeClose: true,
	            content: page.CONFIG.SHOW_PUSH_USER + '?pid=' + id,
	            area: [ '1000px', '800px' ]
	        });
	    },
	    //打开编辑
	    showEdit: function (id) {
	        var action = page.typeInfo.action ? page.typeInfo.action : "edit";
	        helper.win.open({name: "编辑信息流", url: page.CONFIG.HANDLE_URL + "?action=" + action + "&id=" + id});
	    },

	    //提交审核/删除/恢复信息流
	    doHandler: function (id, data, api, label) {
	        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);console.log(rowDate);
	        //if (rowDate.state) data.state = rowDate.state;
	        swal({
	            title: "您确定要{0}选中的信息吗？".Format(label),
	            text: rowDate.title,
	            type: "warning",
	            showCancelButton: true,
	            confirmButtonColor: "#DD6B55",
	            confirmButtonText: label,
	            cancelButtonText:'取消',
	            closeOnConfirm: false
	        }, function () {
	            //swal({title: label + "中，请稍候", type: "info", showConfirmButton: false});
	            //page.derive.submitStatus(true);
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

	    //删除信息流
	    delete: function (id, state) {
	        var data = {
	            "id": id,
	            "state": state,
	            "status": page.CONFIG.DELETE_STATUS
	        };
	        page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "删除");
	    },

	    //恢复信息流
	    reply: function (id, state) {
	        var data = {
	            "id": id,
	            "state": state,
	            "status": page.CONFIG.REPLY_STATUS
	        };
	        page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "恢复");
	    }
	};


	$(document).ready(function () {
		
		page.$feedType.append(page.derive.getFeedType(helper.obj.getObjList()));
		
	    //初始化页面状态
	    if(!page.CONFIG.TYPE_LIST[page.type]){
	        page.typeInfo = page.CONFIG.TYPE_LIST.wait;
	        page.type = page.typeInfo.type;
	    }
	    document.title = page.typeInfo.title;
	    $("#pageSubTitle").html(page.typeInfo.title);

	    //按照不同模块切换显示/隐藏
	    $("[data-type]").each(function () {
	        $(this).data("type") == page.type ? $(this).show() : $(this).hide();
	    });

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
	    $.ajax({
	    	url: "{0}?{1}".Format(page.CONFIG.GET_LIST_API, page.typeInfo.param),
	    	type: 'post',
	    	dataType: 'json',
	    	success: function (ret) {
	    		console.log(ret);
	    	}
	    });
	    //表格初始化
	    page.$table.bootstrapTable({
	        //请求相关
	        url: "{0}?{1}".Format(page.CONFIG.GET_LIST_API, page.typeInfo.param),  //AJAX读取列表数据的URL
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
	            field: 'extra',
	            title: '内容\标题',
	            align: 'left',
	            formatter: function (value, row) {
	            	row.summary = row.summary + '';
	            	row.title = row.title + '';
	            	if (!value) return '—';
	            	var extra = {};
	            	if (/^\{(.+)\}$/.test(value)) {
	            		extra = JSON.parse(value);
	            	}
	            	var htmlStr = '';
	            	var flag = true;
	            	if (page.type == page.CONFIG.TYPE_LIST.wait.type) flag = false;
	            	if (extra.is_voice) {
		            	if (extra.is_voice == 0) {
		            		htmlStr += '<a href="javascript:;" onclick="page.eventHandler.showAudit(' + row.id + ', '+ flag +')">'+ row.summary.substr(0, 50) +'</a>';
		            	} else if (extra.is_voice == 1) {
		            	    htmlStr += '<audio controls><source src="'+extra.voice+'" type="audio/mp3"></audio>';
		            	    if(extra.content) htmlStr += '<div class="commentContent" style="margin:10px 0;word-break: break-all; word-wrap:break-word;"><span class="text-info">翻译内容：</span>' + extra.content + '</div>';
		            	    htmlStr += '<div><a href="javascript:;" onclick="page.eventHandler.showAudit(' + row.id + ', '+ flag +')">查看详细</a></div>';
		            	} else {
		            		htmlStr += '—';
		            	}
	            	} else {
	            		if (row.title) {
	            			htmlStr += '<a href="javascript:;" onclick="page.eventHandler.showAudit(' + row.id + ', '+ flag +')">'+ row.title.substr(0, 50) +'</a>';
	            		} else {
	            			htmlStr += '<a href="javascript:;" onclick="page.eventHandler.showAudit(' + row.id + ', '+ flag +')">'+ row.summary.substr(0, 50) +'</a>';
	            		}
	            	}
	            	return htmlStr;
	            	//if (page.type == page.CONFIG.TYPE_LIST.wait.type) return '<a href="javascript:;" onclick="page.eventHandler.showAudit(' + row.id + ', false)">' + subStr(HTMLDecode(value)) + '</a>';
	            	//return '<a href="javascript:;" onclick="page.eventHandler.showAudit(' + row.id + ', true)">' + subStr(HTMLDecode(value)) + '</a>';
	            }
	        },{
	            field: 'obj_type',
	            title: '类型',
	            width: '100px',
	            formatter: function (value) {
	            	return helper.obj.getObjLabel(value);
	            },
	            align: 'center'
	        },{
	        	field: 'author_type',
	        	title: '来源',
	        	formatter: function (value) {
	        		switch (value) {
	        		    case 0: return '普通用户';
	        		    case 1: return '招商单位';
	        		    case 2: return '运营';
	        		    case 3: return '系统';
	        		    case 4: return '商会';
	        		    default: return '—';
	        		}
	        	},
	        	visible: page.type == page.CONFIG.TYPE_LIST.complete.type ? true : false,
	        	align: 'center'
	        },{
	            field: ' ',
	            width: '100px',
	            title: page.type == page.CONFIG.TYPE_LIST.wait.type ? '提交人' : page.type == page.CONFIG.TYPE_LIST.complete.type ? '审核人' : '删除人',
	            align: 'center',
	            formatter:function(value, row){
	                switch (page.type){
	                    case page.CONFIG.TYPE_LIST.wait.type: return row.author_name;   //提交人
	                    case page.CONFIG.TYPE_LIST.complete.type: return row.audit_user_name;   //审核人
	                    case page.CONFIG.TYPE_LIST.trash.type: return row.audit_user_name;         //删除人
	                    default: return '—';
	                }
	            }
	        },{
	            field: ' ',
	            width: '150px',
	            title: page.type == page.CONFIG.TYPE_LIST.wait.type ? '提交时间' : page.type == page.CONFIG.TYPE_LIST.complete.type ? '推送时间' : '删除时间',
	            align: 'center',
	            formatter:function(value, row){
	                switch (page.type){
	                    case page.CONFIG.TYPE_LIST.wait.type: return helper.convert.formatDate(row.create_time);   //提交时间
	                    case page.CONFIG.TYPE_LIST.complete.type: return row.audit_time ? helper.convert.formatDate(row.audit_time) : helper.convert.formatDate(row.create_time);   //推送时间
	                    case page.CONFIG.TYPE_LIST.trash.type: return helper.convert.formatDate(row.audit_time);         //删除时间
	                    default: return '—';
	                }
	            }
	        },{
	        	field: ' ',
	        	title: '操作',
	        	align: 'center',
	        	width: '200px',
	        	formatter:function(value, row){
	                var strHtml= '';
	                switch (page.type){
	                    case page.CONFIG.TYPE_LIST.wait.type:
	                    default:
	                        //待审核列表
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.showAudit(' + row.id + ')">审核</button>';
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete(' + row.id + ', 2)">删除</button>';
	                        break;
	                    case page.CONFIG.TYPE_LIST.complete.type:
	                        //已推送列表
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.showPushUser(' + row.id + ')">查看推送用户</button>';
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete(' + row.id + ', 1)">删除</button>';
	                        break;
	                    case page.CONFIG.TYPE_LIST.trash.type:
	                        //垃圾箱列表
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.reply(' + row.id + ', ' + row.state + ')">恢复</button>';
	                        break;
	                }

	                return strHtml;
	            }
	        }]
	    });
	    
	    if (page.type == page.CONFIG.TYPE_LIST.complete.type) {
	    	$('#authorTypeContainer').show();
	    }
	    
	    //初始化表单提示
	    page.derive.setDatePlaceholder(page.type);
	    
	    //回车搜索事件
	    $("#keyword").keyup(function (event) {
	        if(event.keyCode == 13)
	            $("#btnSearch").click();
	    });

	    //新增信息流操作
	    $("#btnAdd").click(page.eventHandler.showAdd);

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