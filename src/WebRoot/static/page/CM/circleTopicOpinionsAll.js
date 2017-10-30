//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastrPlus', 'module.push', 'datetimepicker', 'table', 'tableEditable', 'validator'], function (bs, $, helper, swal, layer, toastr) {
	var module = {
        push: require('module.push')
    };
	/**
	 * 提供给引用页面刷新用，如果未声明该方法，则引用页面调用将使用浏览器重载重新刷新本页面
	 */
	page.refresh = function () {
	    $("#btnSearch").click();
	};
	//page.url.obj_type
	page.url = {
			obj_id: helper.url.queryString('obj_id'),
	        obj_type: helper.url.queryString('obj_type')
	}
	console.log(page.url);

	page.topic_id = helper.url.queryString("page_id");
	
	page.url.flag = !(page.url.obj_id && page.url.obj_type);
	//页面级的帮助对象集合
	page.derive = {
	    //获取表单参数用于搜索
	    getParams: function (params) {
	        params.start_time = helper.convert.formatTimestamp($("#start_time").val());
	        params.end_time = helper.convert.formatTimestamp($("#end_time").val(), {day: 1});
	        params.content = $("#keyword").val();
	        params.obj_id = page.url.obj_id;
	        params.obj_type = page.url.obj_type;
	        params.x = params.offset;
			params.y = params.limit;
	        return params;
	    },
	    
	    //取消再次推送
	    cancelPush: function () {
	        layer.closeAll();
	    },
	    
	    //推送
	    doPush: function (id) {
	    	var bv = $('#divPushAgain').data('bootstrapValidator');
            bv.validate();
            if (bv.isValid()) {
            	var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);console.log(rowDate);
            	return;
    	        var data = {
    	    		id: page.topic_id,
    	            extra: page.getCommentInfo(rowDate),
    			    obj_id: page.topic_id,
    			    obj_type: 29,
    			    user_id: rowDate.user_id,
    			    title: rowDate.title,
    			    is_voice: rowDate.is_voice,
    			    voice: rowDate.voice,
    			    voice_size: rowDate.voice_size,
    			    content: rowDate.content ? rowDate.content : ''
    	        };
    	        if (rowDate.is_voice == 1) {
    	        	data.title = rowDate.voice,
    	        	data.summary = rowDate.voice
    	        } else {
    	        	data.title = rowDate.content,
    	        	data.summary = rowDate.content
    	        }
    	        page.feedPush.getFormData(data);

    	        page.feedPush.$container.find("button").attr("disabled", "disabled");
//    	        console.log(data);
//    	        return;
    	        $.ajax({
    	            url: page.ajaxUrl.PUSH,
    	            type : 'POST',
    	            data: data,
    	            dataType : 'json',
    	            success : function(ret) {
    	                if(ret.code == 0){
    	                    layer.closeAll();
    	                    toastr.success('推送提交成功，请等待审核！');
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
            }
	    },
	    subStr: function (html) {
	    	var str = html;
	    	var n = 100
	    	if (str.length > n) str = str.substr(0, n) + '...';
	    	return str;
	    }
	}
	
	//页面所用到AJAX请求的URL,page.ajaxUrl.PUSH
	page.ajaxUrl = {
	    GET_LIST: helper.url.getUrlByMapping("admin/topic/find_topic_guest_opinion.shtml?status=1"),        //获取全部话题观点接口
	    SELECT: helper.url.getUrlByMapping("admin/common/find_comment_detail.shtml"),                       //根据ID查询观点列表
	    GET_LIST_ARTICLE: helper.url.getUrlByMapping("admin/backcommon/get_articleinfo.shtml"),             //查询文章详情
	    UPDATE: helper.url.getUrlByMapping("admin/topic/update_topic_guest_opinion.shtml"),                 //设置文章状态修改大咖观点 
	    PUSH: helper.url.getUrlByMapping("admin/common/commont_push.shtml"),                                //推送
	    USER_INFO: helper.url.getUrlByMapping("admin/userinfo.shtml"),                   					//查看用户信息
	    DELETETRANSLATE: helper.url.getUrlByMapping("admin/topic/delete_topic_guest_opinion.shtml"),        //删除大咖观点语言翻译内容
	    ADD_OPINION: "CMcircleTopicOpinionsAdd.shtml",					//代发大咖观点
	    TOPIC_TYPE: 5																						//话题obj_type
	}
	
	//存储页面table对象
	page.$tool = $('#tableTools');
	page.$table = $('#tableList');
	
	//页面事件
	page.eventHandler = {
		//代发观点
		showAdd: function (){
	    	helper.win.open({name: "代发观点", url: page.ajaxUrl.ADD_OPINION + "?page_id=" + page.topic_id});
		},
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
		//设置标题
		setCommentTitle: function () {
			toastr.info("初始化加载中，请稍候...");
			$.ajax({
	            url: page.ajaxUrl.GET_LIST_ARTICLE,
	            type : 'POST',
	            data: {
	                obj_id: page.url.obj_id,
	                obj_type: page.url.obj_type
	            },
	            dataType : 'json',
	            success : function(ret) {console.log(ret);
	                if(ret.code == 0){
	                	var title = ret.data.title || ret.data.TITLE;
	                	$('#commentTitle').show().find('span').html('【' + helper.obj.getObjLabel(page.url.obj_type)+ '】' + title);
	                	toastr.clear();
	                }else{
	                	$('#commentTitle').hide();
	                	toastr.clear();
	                	toastr.error("您查看的文章不存在或发生错误!", "请稍候再重试或联系管理员！");
	                }
	            },
	            error:function(ret) {
	                swal("设为精彩观点失败", "error");
	            }
	        });
		},
	    //设为精华
	    setEssence: function (id) {
	    	var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);console.log(rowDate);
	    	swal({
	            title: "您确定要将这条观点设置为精彩观点吗？",
	            text: rowDate.content,
	            type: "warning",
	            showCancelButton: true,
	            confirmButtonColor: "#DD6B55",
	            confirmButtonText: "确定",
	            cancelButtonText:'取消',
	            closeOnConfirm: false
	        }, function () {
	            swal({title: "设为精彩观点中，请稍候", type: "info", showConfirmButton: false});
	            $.ajax({
	                url: page.ajaxUrl.UPDATE,
	                type : 'POST',
	                data: {
	                    id: id,
	                    extra: page.getCommentInfo(rowDate),
	       			    is_good: 1,
	       			    obj_id: rowDate.obj_id,
	       			    obj_type: rowDate.obj_type,
	       			    user_id: rowDate.user_id,
	       			    title: rowDate.title,
	       			    summary: rowDate.content
	                },
	                dataType : 'json',
	                success : function(ret) {
	                    if(ret.code == 0){
	                    	swal({title:"设为精彩观点成功", text: "1s后自动消失...", type: "success", timer: 1000});
	                        page.$table.bootstrapTable('removeByUniqueId', id);
	                        page.$table.bootstrapTable('refresh');
	                    }else{
	                        swal("设为精彩观点失败", ret.errMsg, "error");
	                    }
	                },
	                error:function(ret) {
	                    swal("设为精彩观点失败", "error");
	                }
	            });
	        });
	    },
	    
	    //取消精华
	    cancelEssence: function (id) {
	    	var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
	    	swal({
	            title: "您确定要将这条观点取消精华吗？",
	            text: rowDate.content,
	            type: "warning",
	            showCancelButton: true,
	            confirmButtonColor: "#DD6B55",
	            confirmButtonText: "确定",
	            cancelButtonText:'取消',
	            closeOnConfirm: false
	        }, function () {
	            swal({title: "取消精彩观点中，请稍候", type: "info", showConfirmButton: false});
	            $.ajax({
	                url: page.ajaxUrl.UPDATE,
	                type : 'POST',
	                data: {
	                	id: id,
	       			    is_good: 0
	                },
	                dataType : 'json',
	                success : function(ret) {
	                    if(ret.code == 0){
	                    	swal({title:"取消精彩观点成功", text: "1s后自动消失...", type: "success", timer: 1000});
	                        page.$table.bootstrapTable('removeByUniqueId', id);
	                        page.$table.bootstrapTable('refresh');
	                    }else{
	                        swal("取消精彩观点失败", ret.errMsg, "error");
	                    }
	                },
	                error:function(ret) {
	                    swal("取消精彩观点失败", "error");
	                }
	            });
	        });
	    },
	    
	    //推送
	    pushComment: function (id) {
	        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
	        var content = '';
	        var translate = '';
	        if (rowDate.is_voice == 1) {
	        	content = '<audio controls><source src="'+rowDate.voice+'" type="audio/mp3"></audio>';
	        	var translateContent = rowDate.content ? rowDate.content : '暂无翻译';
	        	translate = '<div class="form-group"><label class="col-sm-2 control-label">翻译内容：</label><div class="col-sm-10"><span style="line-height:34px">'+ translateContent +'</span></div></div>'
	        } else {
	        	content = rowDate.content;
	        }
	        var template = '<div class="wrapper wrapper-content animated full-height">'
	        	+ '<div class="form-horizontal">'
	        	+ '<div class="form-group"><label class="col-sm-2 control-label">标题：</label><div class="col-sm-10"><span style="line-height:34px">【'+ (helper.obj.getObjLabel(5)+ '】' + rowDate.title)+'</span></div></div>'
	        	+ '<div class="form-group"><label class="col-sm-2 control-label">观点内容：</label><div class="col-sm-10"><span style="line-height:34px">' + content + '</span></div></div>'
	            + translate
	        	+ '</div><hr/>'
	            + '<div id="divPushAgain"></div>'
	            + '<div class="row m-t-lg m-b">'
	            + '<div class="col-md-offset-3 col-md-3"><button class="btn btn-primary btn-block btn-lg" onclick="page.derive.doPush({id})"><i class="glyphicon glyphicon-ok"></i>&nbsp;&nbsp;确认推送</button></div>'
	            + '<div class="col-md-3"><button class="btn btn-default btn-block btn-lg" onclick="page.derive.cancelPush()"><i class="glyphicon glyphicon-remove"></i>&nbsp;&nbsp;取消推送</button></div>'
	            + '</div></div>';

	        layer.open({
	            type: 1,
	            title: '<span class="label label-warning">观点推送<span>'.Format(rowDate.title),
	            skin: 'layui-layer-rim', //加上边框
	            area: ['95%', '95%'],   //宽高
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
	        
	        page.feedPush = new module.push.feed({
	            container: '#divPushAgain',
	            validatorContainer: '#divPushAgain',
	            defaultPush: {selected: 1, value: module.push.pushEnum.all}
	        });
	    },

	    //删除观点
	    delete: function (id) {
	        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
	        swal({
	            title: "您确定要删除选中的信息吗？",
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
	                url: page.ajaxUrl.UPDATE,
	                type : 'POST',
	                data: {
	                    id: id,
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
	                success : function(ret) {
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

	//表格初始化
	page.$table.bootstrapTable({
	    //请求相关
	    url: page.ajaxUrl.GET_LIST+"&topic_id="+page.topic_id,  //AJAX读取列表数据的URL
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
	    pageList: [10, 20, 50, 100],     //允许选择的每页的数量切换
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
	    	title: '观点内容',
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
	    		    	if(row.content) str += '<div class="commentContent" title="'+ row.content +'" style="margin:10px 0;word-break: break-all; word-wrap:break-word;"><span class="text-info">翻译内容：</span>'+ page.derive.subStr(row.content) +'</div>';
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
	    	visible: page.url.flag,
	    	align: 'left'
	    },{
	    	field: 'user_name',
	    	title: '发表人',
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
	    	title: '发表时间',
	    	width: "120px",
	    	formatter: function(value){
	    		return helper.Convert.formatDate(value);
	    	},
	    	align: 'center'
	    },{
	        field: ' ',
	        title: '操作',
	        align: 'center',
	        width: "150px",
	        formatter:function(value, row){
	        	var strHtml = '';
	            strHtml+=' <button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.pushComment(' + row.id + ')">推送</button>';
	            strHtml+=' <button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete(' + row.id + ')">删除</button>';
	            return strHtml;
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

	//初始化观点标题
	if(!page.url.flag) page.eventHandler.setCommentTitle();

	//回车搜索事件
	$("#keyword").keyup(function (event) {
	    if(event.keyCode == 13)
	        $("#btnSearch").click();
	});
	
	//回车搜索事件
	$("#addBtn").click(function (event) {
	    page.eventHandler.showAdd();
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
});