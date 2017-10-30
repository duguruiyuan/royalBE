//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastrPlus', 'datetimepicker', 'table', 'tableEditable'], function (bs, $, helper, swal, layer, toastr) {
	
	//页面级的帮助对象集合
	page.derive = {
	    //获取表单参数用于搜索
	    getParams: function (params) {
	        params.start_time = helper.convert.formatTimestamp($("#start_time").val());
	        params.end_time = helper.convert.formatTimestamp($("#end_time").val(), {day: 1});
	        params.keyword = $("#keyword").val();
	        return params;
	    },
	    subStr: function (html, n = 100) {
	    	var str = html;
	    	if (str.length > n) str = str.substr(0, n) + '...';
	    	return str;
	    }
	}

	//页面所用到AJAX请求的URL
	page.ajaxUrl = {
	    GET_LIST: helper.url.getUrlByMapping("admin/common/find_comment.shtml?status=2"),                   //查询所有评论接口
	    UPDATE: helper.url.getUrlByMapping("admin/common/update_comment.shtml"),                            //修改评论管理
	    DELETETRANSLATE: helper.url.getUrlByMapping("admin/common/delete_comment_content.shtml"),            //删除翻译
	    USER_INFO: helper.url.getUrlByMapping("admin/userinfo.shtml")          //查看用户信息
	}

	//存储页面table对象
	page.$tool = $('#tableTools');
	page.$table = $('#tableList');

	/**
	 * 提供给引用页面刷新用，如果未声明该方法，则引用页面调用将使用浏览器重载重新刷新本页面
	 */
	page.refresh = function () {
	    $("#btnSearch").click();
	};

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
		//恢复评论
		recoveryComment: function (id) {
			var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
			swal({
	            title: "您确定要恢复选中的评论吗？",
	            text: rowDate.content,
	            type: "warning",
	            showCancelButton: true,
	            confirmButtonColor: "#DD6B55",
	            confirmButtonText: "恢复",
	            cancelButtonText:'取消',
	            closeOnConfirm: false
	        }, function () {
	            swal({title: "恢复中，请稍候", type: "info", showConfirmButton: false});
	            $.ajax({
	                url: page.ajaxUrl.UPDATE,
	                type : 'POST',
	                data: {
	                    id: id,
	                    status: 1
	                },
	                dataType : 'json',
	                success : function(ret) {
	                    if(ret.code == 0){
	                        swal({title:"恢复成功", text: "1s后自动消失...", type: "success", timer: 1000});
	                        page.$table.bootstrapTable('remove', {
	                            field: "id",
	                            values: id
	                        });
	                        page.$table.bootstrapTable('removeByUniqueId', id);
	                        page.$table.bootstrapTable('refresh');
	                    }else{
	                        swal("恢复失败", ret.errMsg, "error");
	                    }
	                },
	                error:function(ret) {
	                    swal("删除失败", "error");
	                }
	            });
	        });
		},
			
	    //查看翻译
	    showTranslate: function (id) {
	    	var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
	    	page.translateId = id;
	    	$("#content-warpper").val(rowDate.content);
	    	$('#see_translate').modal('toggle');
	    },
	    
	    //编辑翻译
	    editTranslate: function () {
	    	$.ajax({
	            url: page.ajaxUrl.UPDATE,
	            type : 'POST',
	            data: {
	                id: page.translateId,
	                content: $("#content-warpper").val()
	            },
	            dataType : 'json',
	            success : function(ret) {
	                if(ret.code == 0){
	                    //swal({title:"修改翻译信息成功", text: "1s后自动消失...", type: "success", timer: 1000});
	                	toastr.success('修改翻译信息成功！');
	                	$('#see_translate').modal('hide')
	                    page.$table.bootstrapTable('refresh');
	                }else{
	                    swal("修改翻译信息失败", ret.errMsg, "error");
	                }
	            },
	            error:function(ret) {
	                swal("修改翻译信息失败", "请稍候再重试或联系管理员", "error");
	            }
	        });
	    },
	    //修改翻译
	    deleteTranslate: function (id) {
	    	var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
	    	swal({
	            title: "您确定要删除这条翻译信息吗？",
	            text: rowDate.content,
	            type: "warning",
	            showCancelButton: true,
	            confirmButtonColor: "#DD6B55",
	            confirmButtonText: "删除",
	            cancelButtonText:'取消',
	            closeOnConfirm: false
	        }, function () {
	            swal({title: "删除中，请稍候", type: "info", showConfirmButton: false});
	            $.ajax({
	                url: page.ajaxUrl.DELETETRANSLATE,
	                type : 'POST',
	                data: {
	                    id: id
	                },
	                dataType : 'json',
	                success : function(ret) {console.log(ret);
	                    if(ret.code == 0){
	                        swal({title:"删除翻译成功", text: "1s后自动消失...", type: "success", timer: 1000});
	                        $('#see_translate').modal('hide')
	                        page.$table.bootstrapTable('refresh');
	                    }else{
	                        swal("删除翻译失败", ret.errMsg, "error");
	                    }
	                },
	                error:function(ret) {
	                    swal("删除翻译失败", "error");
	                }
	            });
	        });
	    },

	    //获取提供给表格位置的自适应浏览器的高度，最小高度500
	    getAdaptTableHeight: function () {
	        var height = $(window).height() - page.$tool.offset().top - page.$tool.outerHeight() - 30;
	        return height >= 500 ? height : 500;
	    }
	}


	//初始化日期控件
	$('.form_date').datetimepicker({
	    format: 'yyyy-mm-dd',
	    weekStart: 1,
	    todayBtn:  1,
	    autoclose: 1,
	    todayHighlight: 1,
	    startView: 2,
	    minView: 2,
	    forceParse: 0
	}).on("click", function (e) {
	        //设置日期控件前后日期的依赖
	        var jq = $(e.target);
	        switch (jq.attr("id")){
	            case "startTime":
	                jq.datetimepicker("setEndDate", $("#endTime").val());
	                break;
	            case "endTime":
	                jq.datetimepicker("setStartDate", $("#startTime").val());
	                break;
	        }
	    }
	);
	$.ajax({
		url: page.ajaxUrl.GET_LIST,
		data: {
			x: 0,
			y: 20
		},
		type: 'post',
		dataType: 'json',
		success: function (ret) {console.log(ret)}
	});
	//表格初始化
	page.$table.bootstrapTable({
	    //请求相关
	    url: page.ajaxUrl.GET_LIST,  //AJAX读取列表数据的URL
	    method: "post",                  //请求方式
	    contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
	    dataType: "json",               //服务器返回数据类型
	    cache: false,                   //不缓存数据
	    queryParamsType: "limit",       //查询参数组织方式
	    queryParams: function (params) {
			params.x = params.offset;
			params.y = params.limit;
	        return page.derive.getParams(params);
	    },

	    //分页相关
	    pagination: true,            //是否分页
	    pageNumber:1,                //初始化加载第一页，默认第一页
	    pageSize: 20,                //每页的记录行数（*）
	    pageList: [10, 50, 100],     //允许选择的每页的数量切换
	    sidePagination: "server",    //分页方式：client客户端分页，server服务端分页（*）

	    //表格总体外观相关
	    height: page.eventHandler.getAdaptTableHeight(),            //整个表格的高度
	    detailView: false,      //是否显示父子表
	    cardView: false,        //是否显示详细图
	    undefinedText: "—",     //当数据为空的填充字符
	    showColumns: true,      //是否显示筛选列按钮
	    showRefresh: true,      //是否显示刷新按钮
	    clickToSelect: true,    //是否开启点击选中行,自动选择rediobox 和 checkbox
	    toolbar:'#tableTools',  //工具按钮的容器

	    //表格内容相关设置
	    idField:"id",       //当前行主键的id值
	    uniqueId:'id',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
	    dataField: "data",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
	    columns: [{
	    	field: ' ',
	    	title: '评论内容',
	    	formatter: function (value, row){
	    		switch(row.is_voice){
	    		    case 0: return row.content;
	    		    case 1: 
	    		    	var str = '';
	    		    	if (/.+(\.mp3)$/i.test(row.voice)) {
	    		    		str += '<audio controls><source src="'+ row.voice +'" type="audio/mp3"></audio>'
	    		    	} else {
	    		    		str += '<audio controls><source src="'+ row.voice +'?avthumb/mp3" type="audio/mp3"></audio>'
	    		    	}
	    		    	//str += '<audio controls><source src="'+row.voice+'" type="audio/mp3"></audio>'
	    		    	if(row.content) str += '<div class="commentContent" title="'+ row.content +'" style="margin:10px 0;word-break: break-all; word-wrap:break-word;"><a href="javascript:;">翻译内容：</a>'+ page.derive.subStr(row.content) +'</div>';
	    		    	str += '<div>';
	    		    	str += '<a href="javascript:;" class="see-btn btn btn-sm btn-info" onclick="page.eventHandler.showTranslate(' + row.id + ')">编辑翻译</a>';
	    		    	if(row.content) str += '&nbsp;&nbsp;<a href="javascript:;" class="delete-btn btn btn-sm btn-danger" data-id="'+row.id+'" onclick="page.eventHandler.deleteTranslate(' + row.id + ')">删除翻译</a>';
	    		    	str += '</div>';
	    		    	return str;
	    		    default: return;
	    		}
	    	},
	    	align: 'left'
	    },{
	    	field: 'title',
	    	title: '标题',
	    	formatter: function (value, row) {
	    		var _title = value ? value : '';
	    		return '【'+ helper.obj.getObjLabel(row.obj_type) +'】' + _title;
	    	},
	    	align: 'left'
	    },{
	    	field: 'reply_user_name',
	    	title: '回复对象',
	    	width: "100px",
	    	formatter: function(value, row){
	    		if (!value || value.trim() == '') return '—';
	    		return '<a href="javascript:;" onclick="page.eventHandler.showUser('+ row.user_id +')">'+ value +'</a>';
	    	},
	    	align: 'center'
	    },{
	    	field: 'user_name',
	    	title: '评论人',
	    	width: "100px",
	    	formatter: function(value, row){
	    		return '<a href="javascript:;" onclick="page.eventHandler.showUser('+ row.user_id +')">'+ value +'</a>';
	    	},
	    	align: 'center'
	    },{
	    	field: 'agent_name',
	    	title: '代发人',
	    	width: "80px",
	    	align: 'center'
	    },{
	    	field: 'create_time',
	    	title: '评论时间',
	    	width: "150px",
	    	formatter: function(value){
	    		return helper.Convert.formatDate(value);
	    	},
	    	align: 'center'
	    },{
	        field: 'zan_count_all',
	        title: '点赞',
	        width: '40px',
	        align: 'center',
	        editable: {
	            type: 'text',
	            title: '修改点赞数',
	            emptytext: '0',
	            params: function(params) {
	                var rowDate = page.$table.bootstrapTable('getRowByUniqueId', params.pk);
	                var data = page.$table.bootstrapTable('getData');
	                var index = $(this).parents('tr').data('index');
	                params.status = 2;
	                params.old_zan_count_all = $(this).data('value');
	                params.zan_count_all = params.value;
	                params.id = rowDate.id;
	                params.extra = page.getCommentInfo(rowDate);
	                params.obj_id = rowDate.obj_id;
	                params.obj_type = rowDate.obj_type;
	                params.user_id = rowDate.user_id;
	                params.summary = rowDate.is_voice == 1 ? rowDate.voice : rowDate.content;
	                params.title = rowDate.title;
	                return params;
	            },
	            url: page.ajaxUrl.UPDATE, //修改后发送的地址
	            mode: 'popup',
	            method: "post",
	            success: function(res, newValue) {
		            var res = $.parseJSON(res);console.log(res);
		            if(res.code == 0) {
		                toastr.success('修改成功');
		                return;
		            }
		            toastr.error('修改失败', res.errMsg);
	            },
	            validate: function (value) {
	                value = $.trim(value);
	                var pattern = /^\d*$/;
	                if(value && !pattern.test(value)){
	                    return '请输入数字！';
	                }
	            }
	        }
	    },{
	    	field: 'zan_count',
	    	title: '点赞真实',
	    	visible: false,
	    	width: "60px",
	    	align: 'center'
	    },{
	    	field: 'is_good',
	    	title: '是否精华',
	    	width: "80px",
	    	formatter: function(value){
	    		switch(value){
	    		    case 0: return '否';
	    		    case 1: return '是';
	    		    default: return '—';
	    		}
	    	},
	    	align: 'center'
	    },{
	        field: ' ',
	        title: '操作',
	        align: 'center',
	        width: "100px",
	        formatter:function(value, row){
	            return '<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.recoveryComment(' + row.id + ')">恢复</button>';
	        }
	    }]
	});

	//拼接extra
	page.getCommentInfo =function (data) {
		var area = {
			user: [{
				id: data.user_id,
				avatar: data.user_avatar,
				name: data.user_name,
				v: data.user_v,
				identity: data.user_identity
			}],
			obj_id: data.obj_id,
			obj_type: data.obj_type,
			title: data.title,
			is_voice: data.is_voice,
			voice: data.voice ? data.voice : "",
			voice_size: data.voice_size ? data.voice_size : '',
			content: data.content ? data.content : ""
		}
		return JSON.stringify(area);
	}

	//回车搜索事件
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

	//修改翻译
	$('#upload_translate').on('click',function(){
		page.eventHandler.editTranslate();
	});

	$(window).resize(function () {
	    page.$table.bootstrapTable("resetView", {height: page.eventHandler.getAdaptTableHeight() + 10});
	});
});