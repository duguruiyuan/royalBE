//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'datetimepicker', 'table'], function (bs, $, helper, swal, layer) {
	//页面所用到配置page.CONFIG.DELETE_API
	page.CONFIG = {
	    GET_LIST_API: helper.url.getUrlByMapping("admin/sliderManager/find_powersliderlists.shtml"),                     //查询开机滑屏列表接口
	    SUBMIT_AUDIT_API: helper.url.getUrlByMapping(""),    //停止投放接口
	    DELETE_API: helper.url.getUrlByMapping("admin/sliderManager/stopordel_powersliderinfo.shtml"),              //删除开机滑屏接口
	    DELETE_STATUS: 2,       //删除的状态码
	    REPLY_STATUS: 1,        //恢复的状态码
	    INFO_HTML: helper.url.getUrlByMapping("admin/huapinginfo.shtml"),                        //查看开机滑屏页面
	    EDIT_HTML: helper.url.getUrlByMapping("admin/huapinghandle.shtml"),
	    TYPE_LIST: {"complete": {type: "complete", param: "status=1", title: "开机滑屏列表", action: ""},
	        "trash": {type: "trash", param: "status=2", title: "开机滑屏垃圾箱", action: ""}
	    }      //页面全部状态
	};

	page.type = helper.url.queryString("type") || page.CONFIG.TYPE_LIST.wait.type;
	page.typeInfo = page.CONFIG.TYPE_LIST[page.type];

	//存储页面table对象
	page.$tool = $('#tableTools');
	page.$table = $('#tableList');

	/**
	 * 提供给引用页面刷新用，如果未声明该方法，则引用页面调用将使用浏览器重载重新刷新本页面
	 */
	page.refresh = function () {
	    $("#btnSearch").click();
	};

	//页面级的帮助对象集合
	page.derive = {
	    //获取表单参数用于搜索
	    getParams: function (params) {
	        params.slider_start_time = helper.convert.formatTimestamp($("#startTime").val());
	        params.slider_end_time = helper.convert.formatTimestamp($("#endTime").val(), {day: 1});
	        params.slider_name = $("#keyword").val();
	        params.x = params.offset;   //服务端分页，过滤掉前xxx条记录
	        params.y = params.limit;    //服务端分页，每页记录数

	        return params;
	    },

	    //获取提供给表格位置的自适应浏览器的高度，最小高度500
	    getAdaptTableHeight: function () {
	        var height = $(window).height() - page.$tool.offset().top - page.$tool.outerHeight() - 30;
	        return height >= 500 ? height : 500;
	    }
	};

	//页面事件
	page.eventHandler = {
	    //打开查看
	    showAudit: function (id) {
	        
	    },

	    //打开编辑
	    showEdit: function (id) {
	    	helper.win.open({name: '修改开机滑屏', url: page.CONFIG.EDIT_HTML + '?action=edit&id=' + id});
	    },

	    //删除开机滑屏
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

	    //删除开机滑屏
	    delete: function (id) {
	        var data = {
	            "slider_id": id,
	            "status": page.CONFIG.DELETE_STATUS
	        };
	        page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "删除");
	    },

	    //恢复开机滑屏
	    reply: function (id) {
	        var data = {
	            "slider_id": id,
	            "status": page.CONFIG.REPLY_STATUS
	        };
	        page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "恢复");
	    },
	    
	    //中止投放
	    stop: function (id) {
	    	var data = {
	            "slider_id": id
	        };
	        page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "中止");
	    },
	    showInfo: function (id) {
	        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);console.log(rowDate);
	        /*var template = '<div class="wrapper wrapper-content animated full-height">'
	        	+ '<div class="form-horizontal">'
	        	+ '<div class="form-group"><label class="col-sm-2 control-label">名称：</label><div class="col-sm-10" style="line-height:34px"><span>'+ rowDate.slider_name +'</span></div></div>'
	        	+ '<div class="form-group"><label class="col-sm-2 control-label">投放开始时间：</label><div class="col-sm-10" style="line-height:34px"><span>'+ helper.convert.formatDate(rowDate.slider_start_time) +'</span></div></div>'
	        	+ '<div class="form-group"><label class="col-sm-2 control-label">投放结束时间：</label><div class="col-sm-10" style="line-height:34px"><span>'+ helper.convert.formatDate(rowDate.slider_end_time) +'</span></div></div>'
	        	+ '<div class="form-group"><label class="col-sm-2 control-label">图片：</label><div class="col-sm-10 text-left" id="huaPingImages"></div></div>'
	        	//+ '<div id="huaPingImages" class="m-t-lg text-left"></div>'
	        	+ '</div>'
	            + '<div class="row m-t-lg">'
	            + '<div class="col-md-offset-2 col-md-2"><button class="btn btn-primary btn-block btn-lg" onclick="page.derive.doPush({id})"><i class="glyphicon glyphicon-floppy-save"></i>&nbsp;&nbsp;中止投放</button></div>'
	            + '<div class="col-md-2"><button class="btn btn-warning btn-block btn-lg" onclick="page.derive.doPush({id})"><i class="glyphicon glyphicon-edit"></i>&nbsp;&nbsp;编辑</button></div>'
	            + '<div class="col-md-2"><button class="btn btn-warning btn-block btn-lg" onclick="page.derive.doPush({id})"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;删除</button></div>'
	            + '<div class="col-md-2"><button class="btn btn-default btn-block btn-lg" onclick="page.derive.cancelPush()"><i class="glyphicon glyphicon-remove"></i>&nbsp;&nbsp;关闭</button></div>'
	            + '</div></div>';*/

	        /*layer.open({
	            type: 2,
	            title: '<span class="label label-warning">{0}</span>'.Format(rowDate.slider_name),
	            skin: 'layui-layer-rim', //加上边框
	            area: ['95%', '95%'],   //宽高
	            shadeClose: true,
	            scrollbar: false,
	            content: 
	        });*/
	        //var action = page.type == 'complete' ? '';
	        layer.open({
	            type: 2,
	            title: '查看开机滑屏',
	            skin: 'layui-layer-rim', //加上边框
	            shadeClose: true,
	            scrollbar: false,
	            content: page.CONFIG.INFO_HTML + '?action='+ page.type +'&id=' + rowDate.slider_id,
	            area: [ '95%', '95%' ]
	        });
	        /*var images = [];
			if (rowDate.slider_pic_images){
				var imageData = JSON.parse(rowDate.slider_pic_images);
				for (var i =0 ;i < imageData.length; i++) {
					images.push(imageData[i].url);
				}
			}
	        if(images.length > 0){
	            template = '<a class="fancybox" rel="group" href="{0}" title=""><img alt="" style="height: 240px" src="{0}" /></a>';
	            html = '';
	            for(var i = 0; i < images.length; i++){
	                html += template.Format(images[i]);
	            }
	            $("#huaPingImages").html(html).find(".fancybox").fancybox();
	        }*/
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
	        idField:"slider_id",       //当前行主键的id值
	        uniqueId:'slider_id',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
	        dataField: "data",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
	        columns: [{
	            field: 'slider_name',
	            title: '名称',
	            align: 'left',
	            formatter: function (value, row) {
	            	return '<a href="javascript:;" onclick="page.eventHandler.showInfo(' + row.slider_id + ')">' + value + '</a>';
	            	//return '<a href="javascript:;" onclick="page.eventHandler.showEdit(' + row.slider_id + ')">' + value + '</a>';
	            }
	        },{
	            field: 'slider_start_time',
	            title: '投放开始时间',
	            width: "120px",
	            formatter: function(value){
	            	return helper.convert.formatDate(value);
	            },
	            align: 'center'
	        },{
	            field: 'slider_end_time',
	            title: '投放结束时间',
	            width: "120px",
	            formatter: function(value){
	            	return helper.convert.formatDate(value);
	            },
	            align: 'center'
	        },{
	            field: 'author_name',
	            title: '创建人',
	            width: "100px",
	            align: 'center'
	        },{
	            field: 'create_time',
	            title: '创建时间',
	            width: "120px",
	            formatter: function(value){
	                return helper.convert.formatDate(value);
	            },
	            align: 'center'
	        },{
	            field: 'update_user_name',
	            title: '修改人',
	            width: "100px",
	            align: 'center'
	        },{
	            field: 'update_time',
	            title: '修改时间',
	            width: "120px",
	            formatter: function(value){
	                return helper.convert.formatDate(value);
	            },
	            align: 'center'
	        },{
	            field: ' ',
	            title: '操作',
	            align: 'center',
	            width: "200px",
	            formatter:function(value, row){
	                var strHtml= '';
	                switch (page.type){
	                    case page.CONFIG.TYPE_LIST.complete.type:
	                    default:
	                        //待审核列表
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.stop(' + row.slider_id + ')">中止投放</button>';
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.showEdit(' + row.slider_id + ')">修改</button>';
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete(' + row.slider_id + ')">删除</button>';
	                        break;
	                    case page.CONFIG.TYPE_LIST.trash.type:
	                        //垃圾箱列表
	                        strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.reply(' + row.slider_id + ')">恢复</button>';
	                        break;
	                }

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
	    });
	});
});