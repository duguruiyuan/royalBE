//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastrPlus', 'module.push', 'datetimepicker', 'table', 'tableEditable', 'validator'], function (bs, $, helper, swal, layer, toastr) {
	var module = {
        push: require('module.push')
    };
    //存储页面table对象
    page.$tool = $('#tableTools');
    page.$table = $('#tableList');
    //是否认证下拉
    page.$isAuth = $("#isAuth");
    //认证方式下拉
    page.$userv = $("#userv");
    //用户权重下拉
    page.$weight = $("#weight");
    //注册方式下拉
    page.$logintype = $("#logintype");

    /**
     * 提供给引用页面刷新用，如果未声明该方法，则引用页面调用将使用浏览器重载重新刷新本页面
     */
    page.refresh = function () {
        $("#btnSearch").click();
    };

    //页面级的帮助对象集合page.derive.toastr
    page.derive = {
        //获取表单参数用于搜索
        getParams: function (params) {
            params.isAuth = page.$isAuth.val();
            params.auth_type = page.$userv.val();
            params.weight = page.$weight.val();
            params.logintype = page.$logintype.val();
            params.realname = $('#realname').val();
            params.mobile = $('#mobile').val();
            params.x = params.offset;
            params.y = params.limit;
            return params;
        },
        //取消再次推送
        cancelPush: function () {
            layer.closeAll();
        },
        //插入节点
        setOptions: function (dom,data,keyName){
        	var key = keyName || 'name';
        	var arr = [];
        	for(var i = 0; i < data.length; i++){
        		arr.push('<option value="'+data[i].id+'">'+data[i][key]+'</option>');
        	}
        	dom.append(arr.join(''));
        },
        //再次推送
        doPush: function (id) {
        	var bv = $('#divPushAgain').data('bootstrapValidator');
            bv.validate();
	        if (bv.isValid()) {
	        	var data = {
                	id: id,
                    obj_id: id,
                    obj_type: page.ajaxUrl.OBJ_TYPE
                };
                page.feedPush.getFormData(data);

                page.feedPush.$container.find("button").attr("disabled", "disabled");
                $.ajax({
                    url: page.ajaxUrl.ALL_PUSH_API,
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
	        }
        },
        toastr: function (text) {
        	toastr.success(text);
        }
    }

    //页面所用到AJAX请求的URL page.ajaxUrl.ADD_USER
    page.ajaxUrl = {
        GET_LIST: helper.url.getUrlByMapping("admin/userManager/find_userinfolists.shtml"),                    //用户列表接口
        DELETE: helper.url.getUrlByMapping("admin/userManager/delete_userinfo.shtml"),                         //删除用户接口
        USERWEIGHT: helper.url.getUrlByMapping("admin/weights/find_weightslists.shtml"),                     //用户权重接口
        LOGINTYPE: helper.url.getUrlByMapping("admin/legalize/find_legalizelists.shtml"),                      //认证方式接口
        PUSH_API: helper.url.getUrlByMapping("admin/userManager/push_userinfo.shtml"),                     //推送
        ALL_PUSH_API: helper.url.getUrlByMapping("admin/common/commont_push.shtml"),                           //推送接口(公用)
        INDUSTRY: helper.url.getUrlByMapping("admin/common/find_industry.shtml"),                               //行业接口
        USER_DYNAMICS: helper.url.getUrlByMapping("admin/userdynamics.shtml"),           //用户动态详细页
        ADD_USER: helper.url.getUrlByMapping("admin/adduser.shtml"),              //新增用户
        USER_INFO: helper.url.getUrlByMapping("admin/userinfo.shtml"),                   //查看用户信息
        USER_LOG_INFO: helper.url.getUrlByMapping("admin/showuserlog.shtml"),                   //查看用户日志信息
        OBJ_TYPE: 3
    }

    //页面事件
    page.eventHandler = {
        //删除用户
        delete: function (id) {
            var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
            swal({
                title: "",
                //text: rowDate.realname,
                text: '<div style="font-size:18px;margin-bottom:15px">删除【'+ rowDate.realname +'】，请填写原因</div><textarea id="delete_reason" class="form-control" rows="5" style="width:80%;margin:0 auto;font-size:18px" placeholder="请输入删除原因"></textarea>',
                //type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "删除",
                cancelButtonText:'取消',
                //inputPlaceholder: "请输入删除原因",
                closeOnConfirm: false,
                html: true
            }, function () {
                var data = {usid: id, delete_reason: $('#delete_reason').val()};
                $.ajax({
                    url: page.ajaxUrl.DELETE,
                    type : 'POST',
                    data: data,
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
        
        //用户推送
        pushUser: function(id){
        	var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);console.log(rowDate);
            var template = '<div class="wrapper wrapper-content animated full-height">'
            	+ '<div class="form-group" style="height:auto;overflow:hidden">'
            	+ '<div class="col-sm-6 control-label text-right" style="height:100px"><img height="100px" src="'+ rowDate.image +'" /></div>'
            	+ '<div class="col-sm-6" style="line-height:30px">'
            	+ '<div class="form-group"><label class="col-sm-10 control-label">'+ rowDate.realname +'</label></div>'
            	+ '<div class="form-group"><label class="col-sm-10 control-label">'+ rowDate.company +'</label></div>'
            	+ '<div class="form-group"><label class="col-sm-10 control-label">'+ rowDate.companywork +'</label></div>'
            	+ '</div>'
            	+ '</div>'
            	+ '<hr/>'
                + '<div id="divPushAgain"></div>'
                + '<div class="row m-t-lg m-b">'
                + '<div class="col-md-offset-3 col-md-3"><button class="btn btn-primary btn-block btn-lg" onclick="page.derive.doPush({id})"><i class="glyphicon glyphicon-ok"></i>&nbsp;&nbsp;确认推送</button></div>'
                + '<div class="col-md-3"><button class="btn btn-default btn-block btn-lg" onclick="page.derive.cancelPush()"><i class="glyphicon glyphicon-remove"></i>&nbsp;&nbsp;取消推送</button></div>'
                + '</div></div>';

            layer.open({
                type: 1,
                title: '<span class="label label-warning">用户推送',
                skin: 'layui-layer-rim', //加上边框
                area: ['95%', '95%'],   //宽高
                shadeClose: true,
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
                defaultPush: {selected: 1, value: module.push.pushEnum.none}
            });
        },
        
        //查看用户动态
        userDynamics: function(id){
        	layer.open({
                type: 2,
                title: '查看用户动态',
                skin: 'layui-layer-rim', //加上边框
                shadeClose: true,
                scrollbar: false,
                content: helper.CONST.BASE_PATH+'admin/userdynamics.shtml?usid='+id,
                area: [ '95%', '95%' ]
            });
        },
        
        //新增用户
        insertUser: function(){
        	layer.open({
                type: 2,
                title: '新增用户',
                skin: 'layui-layer-rim', //加上边框
                shadeClose: true,
                scrollbar: false,
                content: page.ajaxUrl.ADD_USER,
                area: ['95%', '95%']
            });
        },
        
        //查看或编辑用户
        updateUser: function(id){
        	layer.open({
                type: 2,
                title: '查看或编辑用户信息',
                skin: 'layui-layer-rim', //加上边框
                shadeClose: true,
                scrollbar: false,
                content: helper.CONST.BASE_PATH+'admin/edituser.shtml?id='+id,
                area: [ '95%', '95%' ]
            });
        },

        //获取提供给表格位置的自适应浏览器的高度，最小高度500
        getAdaptTableHeight: function () {
            var height = $(window).height() - page.$tool.offset().top - page.$tool.outerHeight() - 30;
            return height >= 500 ? height : 500;
        },
        
        showUser: function (id) {
	    	layer.open({
		        type: 2,
		        title: '查看用户信息',
		        skin: 'layui-layer-rim',
		        shadeClose: true,
		        scrollbar: false,
		        content: page.ajaxUrl.USER_INFO + '?id=' + id,
		        area: ['95%', '95%']
		    });
	    },
	    
	    showUserLog:function (id) {
	    	layer.open({
		        type: 2,
		        title: '查看用户日志',
		        skin: 'layui-layer-rim',
		        shadeClose: true,
		        scrollbar: false,
		        content: page.ajaxUrl.USER_LOG_INFO + '?id=' + id,
		        area: ['95%', '95%']
		    });
	    }
    }

    /*$.ajax({
    	url: page.ajaxUrl.GET_LIST,
    	type: 'post',
    	dataType: 'json',
    	data: {
    		x: 0,
    		y: 20
    	},
    	success: function(res){
    		console.log(res);
    	},
    	error: function(xhr){
    		xonsole.log(xhr);
    	}
    });*/
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
            field: 'realname',
            title: '姓名',
            width: "120px",
            formatter: function (value, row) {
            	if (row.isAuth == 3 || row.isAuth == 4) return '<a href="javascript:;" class="user-info-demo" onclick="page.eventHandler.showUser(' + row.usid + ')">'+ value +'</a>';
            	return '<a href="javascript:;" class="user-info-demo" onclick="page.eventHandler.updateUser(' + row.id + ')">'+ value +'</a>';
            },
            align: 'center'
        },{
            field: 'mobile',
            title: '手机号',
            width: "80px",
            align: 'center'
        },{
            field: 'company',
            title: '单位',
            align: 'center'
        },{
            field: 'companywork',
            title: '职务',
            formatter: function(value){
            	if(!value) return '—';
            	return value;
            },
            align: 'center'
        },/*{
            field: 'lastlogintime',
            title: '最后登录时间',
            width: "130px",
            visible: false,
            formatter: function(value){
            	return helper.Convert.formatDate(value);
            },
            align: 'center'
        },*/{
            field: 'createdate',
            title: '注册时间',
            width: "130px",
            formatter: function(value){
            	return helper.Convert.formatDate(value.time);
            },
            align: 'center'
        },{
            field: 'logintype',
            title: '注册方式',
            width: "80px",
            formatter: function(value){
            	switch(value){
            	    case 0: return '后台新增';
            	    case 1: return '在线注册';
            	    case 2: return '商会导入';
            	}
            },
            align: 'center'
        },{
            field: 'isAuth',
            title: '是否认证',
            width: "60px",
            formatter: function(value){
            	var type = parseInt(value);
            	switch(type){
            	    case 1: return '是';
            	    default: return '否';
            	}
            },
            align: 'center'
        },{
            field: 'auth_type',
            title: '认证方式',
            width: "80px",
            align: 'center'
        },{
            field: 'weight',
            title: '用户权重',
            width: "80px",
            align: 'center'
        },{
            field: ' ',
            title: '操作',
            width: "340px",
            /*formatter: function(value){
            	return '<a class="J_menuItem_other btn btn-primary" href_url="userdynamics.shtml?usid='+value+'" data-view="win" data-index="userdynamics-'+value+'">查看用户动态</a>&nbsp&nbsp<a class="J_menuItem_other btn btn-primary" href_url="userpush.shtml?usid='+value+'" data-view="win" data-index="userpush-'+value+'">推送</a>&nbsp&nbsp<a class="J_menuItem_other demo3 btn btn-primary" user-id="'+value+'">删除</a>';
            },*/
            formatter:function(value, row){
            	var strHtml=' <button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.userDynamics(' + row.id + ')">查看用户动态</button>';
            	strHtml+=' <button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.showUserLog(' + row.id + ')">查看用户日志</button>'
                strHtml+=' <button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.pushUser(' + row.id + ')">推送</button>';
                strHtml+=' <button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete(' + row.id + ')">删除</button>';
                return strHtml;
            },
            align: 'center'
        }]
    });

    //初始化认证方式
    $.ajax({
    	url: page.ajaxUrl.LOGINTYPE,
    	type: 'post',
    	dataType: 'json',
    	success: function(res){
    		page.derive.setOptions(page.$userv,res.data)
    	},
    	error: function(xhr){
    		console.log(xhr);
    	}
    });

    //初始化用户权重
    $.ajax({
    	url: page.ajaxUrl.USERWEIGHT,
    	type: 'post',
    	dataType: 'json',
    	success: function(res){
    		page.derive.setOptions(page.$weight,res.data,'weightsname')
    	},
    	error: function(xhr){
    		console.log(xhr);
    	}
    });

    $("#realname").keyup(function (event) {
        if(event.keyCode == 13) $("#btnSearch").click();
    });

    $("#mobile").keyup(function (event) {
        if(event.keyCode == 13) $("#btnSearch").click();
    });

    //搜索
    $("#btnSearch").click(function(){
        var params = page.$table.bootstrapTable('getOptions');
        params = page.derive.getParams(params);
        page.$table.bootstrapTable('refresh',params);
    });

    $(window).resize(function () {
        page.$table.bootstrapTable("resetView", {height: page.eventHandler.getAdaptTableHeight() + 10});
    });
});