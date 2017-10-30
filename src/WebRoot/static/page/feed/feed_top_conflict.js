//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastrPlus', 'module.push', 'datetimepicker', 'table', 'tableEditable'], function (bs, $, helper, swal, layer, toastr) {
    var module = {
        push: require('module.push')
    };
  //页面所用到配置page.CONFIG.SUBMIT_AUDIT_API
    page.CONFIG = {
        GET_FEED_LIST: helper.url.getUrlByMapping(""),                                  //查询文章类型
    	GET_LIST_API: helper.url.getUrlByMapping("admin/association/find_bigtop_list.shtml"),                    //查询大小置顶列表接口
    	GET_FEED: helper.url.getUrlByMapping("admin/feed/find_feed_detail.shtml"),                     //查询信息流详情接口
        SUBMIT_AUDIT_API: helper.url.getUrlByMapping("admin/feed/update_feed_tmp.shtml"),              //停止推送接口
        DELETE_API: helper.url.getUrlByMapping("admin/feed/update_feed.shtml"),                              //删除信息流接口
        SHOW_PUSH_USER: helper.url.getUrlByMapping("admin/feeduserlist.shtml"),                        //查看推送用户
        HANDLE_URL: helper.url.getUrlByMapping("admin/feedhandle.shtml"),                              //新增/审核/修改信息流url
        SHOW_URL: helper.url.getUrlByMapping("admin/feedinfo.shtml"),                                   //查看/审核信息流url
        AUDIT_STATE: 2,          //提交审核状态值
        DELETE_STATUS: 2,       //删除的状态码
        REPLY_STATUS: 1,        //恢复的状态码
        NOPASS_STATE: 4,        //未通过的状态码feed/find_feed_tmp.shtml?type=1
        STATE_LIST: {"1": "已发布", "2": "待审核", "3": "草稿", "4": "审核未通过"},
        TYPE_LIST: {"small": {type: "small", param: "status=1&type=1", title: "小置顶", action: ""},
            "big": {type: "big", param: "status=1&type=2", title: "大置顶", action: ""}
        }      //页面全部状态
    };

    page.type = helper.url.queryString("type") || page.CONFIG.TYPE_LIST.wait.type;
    page.instart_time = helper.url.queryString('start_time');
    page.inend_time = helper.url.queryString('end_time');
    page.inobj_id= helper.url.queryString('obj_id');
    page.inobj_type= helper.url.queryString('obj_type');
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

    //组件实例
    page.feedPush = new Object();
    //修改ID
    page.editId = '';
    /**
     * 提供给引用页面刷新用，如果未声明该方法，则引用页面调用将使用浏览器重载重新刷新本页面
     */
    page.refresh = function () {
        $("#btnSearch").click();
    };

    //页面级的帮助对象集合page.derive.delTop
    page.derive = {
        //获取表单参数用于搜索
        getParams: function (params) {
            params.obj_type = page.$feedType.val();
            params.create_start_time = helper.convert.formatTimestamp($("#startTime").val());
            params.create_end_time = helper.convert.formatTimestamp($("#endTime").val(), {day: 1});
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
        	var data = {
        		id: id,
                obj_id: page.obj.obj_id,
                obj_type: page.obj.obj_type,
                state: 1
            };
            page.feedPush.getFormData(data);

            //page.feedPush.$container.find("button").attr("disabled", "disabled");
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
        
        //删除
        delTop: function (data) {
        	
        },
            
        //取消
        cancelPush: function () {
        	layer.closeAll();
        }
    };

    //页面事件
    page.eventHandler = {

        //打开审核
        showAudit: function (id) {
        	page.obj.obj_id = '';
        	page.obj.obj_type = '';
            var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);console.log(rowDate);
            page.obj.obj_id = rowDate.obj_id;
        	page.obj.obj_type = rowDate.obj_type;
            var template = '<div class="wrapper wrapper-content animated full-height">'
            	+ '<div class="form-horizontal">'
            	//+ '<div class="form-group">'
            	//+ '<label class="col-sm-2 control-label">信息源：</label>'
            	//+ '<div class="col-sm-9">'
            	+ '<div class="form-group"><label class="col-sm-2 control-label">选择信息源：</label><div class="col-sm-10" style="line-height:34px"><span>'+rowDate.title+'</span></div></div>'
            	+ '<div class="form-group"><label class="col-sm-2 control-label">类型：</label><div class="col-sm-10" style="line-height:34px"><span>'+helper.obj.getObjLabel(rowDate.obj_type)+'</span></div></div>'
            	//+ '</div></div>'
            	+ '</div>'
                + '<div id="divPushAgain"></div>'
                + '<div class="row m-t-lg">'
                //+ '<div class="col-md-offset-2 col-md-3"><button class="btn btn-primary btn-block btn-lg" onclick="page.derive.successPush({id})"><i class="glyphicon glyphicon-ok"></i>&nbsp;&nbsp;审核通过</button></div>'
                + '<div class="col-md-offset-3 col-md-3"><button class="btn btn-danger btn-block btn-lg" onclick="page.eventHandler.delete('+id+')"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;删除</button></div>'
                + '<div class="col-md-3"><button class="btn btn-default btn-block btn-lg" onclick="page.derive.cancelPush()"><i class="glyphicon glyphicon-remove"></i>&nbsp;&nbsp;取消</button></div>'
                + '</div></div>';

            layer.open({
                type: 1,
                //title: '<span class="label label-warning">【信息流】{0}</span>&nbsp;&nbsp;的再次推送'.Format(rowDate.title),
                title: '信息流审核',
                skin: 'layui-layer-rim', //加上边框
                area: ['95%', '95%'],   //宽高
                scrollbar: false,
                content: template.Format({id: id})
            });
            $.ajax({
            	url: page.CONFIG.GET_FEED,
            	data: {
            		id: rowDate.feed_id,
            		state: rowDate.state
            	},
            	dataType: 'json',
            	success: function (ret) {console.log(ret);
    	        	var pushType = module.push.pushEnum.none;
    	    	    var type = ret.data.obj_type;
    	    	    if (type == 1) {
    	    	    	pushType = module.push.pushEnum.all;
    	    	    } else if (type == 11 || type == 4 || type == 5 || type == 19 || type == 18) {
    	    		    pushType = module.push.pushEnum.circle;
    	    	    }
            		page.feedPush = new module.push.feed({
                    	readonly: true,
                        container: '#divPushAgain',
                        defaultPush: {selected: 1, value: pushType},
                        formData: ret.pushdevice
                    });
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

        //删除/恢复大小置顶
        doHandler: function (id, data, api, label) {
            var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
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
                swal({title: label + "中，请稍候", type: "info", showConfirmButton: false});
                $.ajax({
                    url: api,
                    type : 'POST',
                    data: data,
                    dataType : 'json',
                    success : function(ret) {
                        if(ret.code == 0){
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
        
        //修改大小置顶
        updateHandler: function (id, data, api, label) {
            var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
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
                swal({title: label + "中，请稍候", type: "info", showConfirmButton: false});
                $.ajax({
                    url: api,
                    type : 'POST',
                    data: data,
                    dataType : 'json',
                    success : function(ret) {
                        if(ret.code == 0){
                            swal({title: label+ "成功", text: "1s后自动消失...", type: "success", timer: 1000});
                            page.$table.bootstrapTable('remove', {
                                field: "id",
                                values: id
                            });
                            $('#editTime').modal('hide');
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

        //删除大小置顶
        delete: function (id, feed_id) {
        	var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        	var data = {
                "id": rowDate.feed_id,
                "state": 1,
                "status": page.CONFIG.DELETE_STATUS
            };
            page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "删除");
        },
        //停止推送
        stopPush: function (id) {
        	var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        	var data = {
                "id": rowDate.feed_id,
                'type': 1,
                'start_time': rowDate.start_time,
                "end_time": new Date().getTime(),
                'push_id': rowDate.push_id 
            };
            page.eventHandler.doHandler(id, data, page.CONFIG.SUBMIT_AUDIT_API, "停止");
        },
        //打开修改时间
        editTime: function(id){
        	var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        	page.editId = id;
        	$('#editStartTime').val(helper.convert.formatDate(rowDate.start_time));
        	$('#editEndTime').val(helper.convert.formatDate(rowDate.end_time));
        	$("#editTime").modal('show');
        },
        //修改时间
        sendEditTime: function () {
        	var rowDate = page.$table.bootstrapTable('getRowByUniqueId', page.editId);
        	var data = {
                "id": rowDate.feed_id,
                "start_time": helper.convert.formatTimestamp($('#editStartTime').val()),
                "end_time": helper.convert.formatTimestamp($('#editEndTime').val()),
                'push_id': rowDate.push_id,
                'type': page.type == page.CONFIG.TYPE_LIST.small.type ? 1 : 2
            };
        	$.ajax({
                url: page.CONFIG.SUBMIT_AUDIT_API,
                type : 'POST',
                data: data,
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                        swal({title: "修改成功", text: "1s后自动消失...", type: "success", timer: 1000});
                        $('#editTime').modal('hide');
                        page.$table.bootstrapTable('refresh');
                    }else{
                        swal("修改失败", ret.errMsg, "error");
                    }
                },
                error:function(ret) {
                    swal("修改失败", "请稍候再重试或联系管理员", "error");
                }
            });
            //page.eventHandler.updateHandler(page.editId, data, page.CONFIG.SUBMIT_AUDIT_API, "修改");
        }
    };


    $(document).ready(function () {
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
        
        //初始化日期控件
        $('.form_date_all').datetimepicker({
            format: "yyyy-mm-dd hh:ii:ss",
            weekStart: 1,
            todayBtn:  true,    //是否显示今天按钮
            autoclose: true,    //选择后自动关闭
            todayHighlight: true,   //高亮显示今天日期
            startView: 2,           //从月视图开始显示
            minView: 0,             //最小显示到视图，0：小时视图，1：日视图，2：月视图
            minuteStep: 15,         //小时视图的分钟步长
            forceParse: true        //选择日期不符合要求时尽可能自动转换成符合的
        });

        //表格初始化
        page.$table.bootstrapTable({
            //请求相关
            url: page.CONFIG.GET_LIST_API+'?obj_id='+page.inobj_id+'&obj_type='+page.inobj_type+'&start_time='+page.instart_time+'&end_time='+page.inend_time',  //AJAX读取列表数据的URL
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
                title: '标题/内容',
                align: 'left',
                formatter: function (value, row) {
                	if (!value) return '—';
                    return '<a href="javascript:;" onclick="page.eventHandler.showAudit(' + row.id + ')">' + value + '</a>';
                }
            },{
                field: 'obj_type',
                title: '类型',
                //width: '40px',
                formatter: function (value) {
                	return helper.obj.getObjLabel(value);
                },
                align: 'center'
            },{
                field: 'author_name',
                title: '审核人',
                width: '100px',
                align: 'center'
            },{
                field: 'create_time',
                title: '推送时间',
                width: '120px',
                align: 'center',
                formatter:function(value, row){ 
                	return helper.convert.formatDate(value); 
                },
            },{
                field: 'start_time',
                title: '开始时间',
                width: '120px',
                align: 'center',
                formatter:function(value, row){ 
                	return helper.convert.formatDate(value); 
                },
            },{
                field: 'end_time',
                title: '结束时间',
                align: 'center',
                width: '120px',
                formatter:function(value, row){ 
                	return helper.convert.formatDate(value); 
                },
            },{
            	field: ' ',
            	title: '操作',
            	align: 'center',
            	width: '200px',
            	formatter:function(value, row){
                    var strHtml= '';
                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.editTime('+row.id+','+row.start_time+','+row.end_time+')">修改时间</button>';
                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete(' + row.id + ',' + row.feed_id + ')">删除</button>';
                    return strHtml;
                }
            }]
        });
        
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

        $(window).resize(function () {
            page.$table.bootstrapTable("resetView", {height: page.derive.getAdaptTableHeight() + 10});
        })
    });
});
