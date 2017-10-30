//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'treeview', 'iCheckPlus', 'toastrPlus', 'module.multSelector', 'datetimepicker', 'table', 'validator'], function (bs, $, helper, swal, layer, treeview, iCheck, toastr) {
    
	var module = {
		multSelector: require('module.multSelector')
    };
	//页面所用到配置page.CONFIG.SH_USER_INFO
    page.CONFIG = {
    	GET_SH_LIST: helper.url.getUrlByMapping("admin/gslmanager/get_gsl_data.shtml"),      //查询商会管理树
        GET_MENU_LIST: helper.url.getUrlByMapping("admin/shmanager/find_shanghui.shtml"),      //查询所有商会管理菜单列表
    	//GET_LIST_API: helper.url.getUrlByMapping("admin/gslmanager/find_gsl.shtml?state=1"),         //查询商会管理管理列表接口
        ADD_GSL_API: helper.url.getUrlByMapping("admin/shmanager/insert_shanghui.shtml"),    //新增商会管理接口
        EDIT_API: helper.url.getUrlByMapping("admin/shmanager/update_shanghui.shtml"),    //修改商会管理接口
        DELETE_API: helper.url.getUrlByMapping("admin/shmanager/delete_shanghui.shtml"),        //删除商会管理接口
        DELETE_USER_API: helper.url.getUrlByMapping("admin/gslmanager/delete_gsluser.shtml"),         //删除工商联用户接口
        GET_SH_INFO: helper.url.getUrlByMapping("admin/shmanager/find_shanghui_detail.shtml"),        //查询商会详情接口
        POWER_API: helper.url.getUrlByMapping(""),         //商会管理权限列表
        ADD_GSLYH_API: helper.url.getUrlByMapping("admin/gslmanager/insert_gsluser.shtml"),        //新增商会用户
        CLASSIFY_LIST_API: helper.url.getUrlByMapping("admin/shmanager/find_classification.shtml"),   //分类列表
        GET_SH_USER: helper.url.getUrlByMapping("admin/gslmanager/find_gsluser.shtml"),        //商会用户列表
        SH_USER_INFO: helper.url.getUrlByMapping("admin/gslmanager/find_gsluser_detail.shtml"),        //查看商会用户详情
        SUBMIT_AUDIT_API: helper.url.getUrlByMapping("admin/gslmanager/update_gsluser.shtml"),    //编辑用户接口
        RESET_PWD: helper.url.getUrlByMapping("admin/gslmanager/reset_password.shtml"),        //重置密码
        NEWS_API: helper.url.getUrlByMapping("admin/shmanager/insertupdate_sms.shtml"),        //新增/修改短信配置
        GET_NEWS_API: helper.url.getUrlByMapping("admin/shmanager/get_sms.shtml"),        //获取短信配置
        DELETE_STATUS: 0,       //删除的状态码
        page_URL: helper.url.getUrlByMapping('admin/gslglindex.shtml'),
        USER_LIST_PAGE: helper.url.getUrlByMapping('admin/gslgluserlist.shtml')             //查看用户列表页
    };

    /*page.id = helper.url.queryString("parent_id") || '';
    
    page.gslyhId = '';*/
    page.editId = '';
    page.editYhId = '';
    page.shyhId = '';
    page.typeIds = '';
    page.dxpzId = '';
    page.dxpz = '';
    page.arr = [{
		text: '工商联管理',
		id: 0,
		nodes: [],
		pId: '',
		level: 0,
		state: {
			selected: true
		}
	}];

    //存储页面table对象
    page.$tool = $('#tableTools');
    page.$table = $('#tableList');
    page.$buttonSh = $('#divActionSh button');
    page.$buttonYh = $('#divActionYh button')
    page.$buttonPz = $('#divActionPz button');
    //商会
    page.$from = $('#frmAddsh');
    page.$add_sh = $('#add_sh');
    page.$shName = $('#shName');
    page.$shUser = $('#shUser');
    page.$shTell = $('#shTell');
    page.$shAddress = $('#shAddress');
    page.$shClassify = $('#shClassify')
    page.$sh_title = $('#sh_title');
    page.$add_sh_btn = $("#add_sh_btn");
    //用户
    page.$fromyh = $('#frmAddshyh');
    page.$shyh_title = $('#shyh_title');
    page.confirm_addshyh = $('#confirm_addshyh')
    page.$shyhCode = $('#shyhCode');
    page.$shyhPwd = $('#shyhPwd');
    page.$shyhName = $('#shyhName');
    page.$shyhPost = $('#shyhPost');
    //短信配置
    page.$fromdx = $('#frmAdddxpz');
    page.$dxCode = $('#dxCode');
    page.$dxPwd = $('#dxPwd');
    page.$dxIp = $('#dxIp');
    page.$dxPort = $('#dxPort');
    page.$dxYd = $('#dxYd');
    page.$dxLt = $('#dxLt');
    page.$dxDx = $('#dxDx');
    page.$dxAutograph = $('#dxAutograph');
    page.$dxCount = $('#dxCount');
    page.$dxUse = $('#dxUse');
    page.$dxNumber = $('#dxNumber');
    page.$dxTotal = $('#dxTotal');
    
    page.$shClassify = $('#shClassify');
    page.$selectClassify = $('#selectClassify');
    page.$shClassifyPrompt = $('#shClassifyPrompt');
    
    page.$txtUnSelected = $('#txtUnSelected');
    page.$btnUnSelected = $('#btnUnSelected');
    
    page.selector = null;
    page.selectedObj = [];

    /**
     * 提供给引用页面刷新用，如果未声明该方法，则引用页面调用将使用浏览器重载重新刷新本页面
     */
    page.refresh = function () {
        $("#btnSearch").click();
    };

    //页面级的帮助对象集合page.derive.submitStatus
    page.derive = {
		//获取菜单列表
        getMenu: function (selectedId) {
        	$.ajax({
        		url: page.CONFIG.GET_SH_LIST,
        		type: 'POST',
                dataType: 'json',
                success: function (res) {
                	console.log(res);
                	var data = res.data;
                	
                	if (selectedId) {
                		page.arr = [{
                    		text: '工商联管理',
                    		id: 0,
                    		nodes: [],
                    		nodeid: 0,
                    		pId: 0,
                    		level: 0
                    	}];
                	} else {
                		page.arr = [{
                    		text: '工商联管理',
                    		id: 0,
                    		nodes: [],
                    		nodeid: 0,
                    		pId: 0,
                    		level: 0,
                    		state: {
                    			selected: true
                    		}
                    	}];
                	}
                	
                	var list = [];
                	for (var i = 0 ; i < data.length; i ++) {
                		if (!list[data[i].LEVEL - 1]) list[data[i].LEVEL - 1] = [];
                		list[data[i].LEVEL - 1].push(data[i]);
                	}
                	for (var k = 0 ; k < list.length; k ++) {
                		for (var j = 0; j < list[k].length; j ++) {
                		    page.derive.unFor(page.arr, list[k][j], selectedId);	
                		}
                	}
                	page.eventHandler.setTreeview(page.arr);
                	var selectedObj = $('#gslgl_treeview').treeview('getSelected')[0];
                	if (selectedObj.nodeId != 0 && selectedObj.parentId != 0) $('#gslgl_treeview').treeview('expandNode', [ selectedObj.parentId, { levels: 2, silent: true } ]);
                }
        	});
        },
        unFor: function (arr, obj, selectedId) {
        	var flag = true
        	for (var i = 0; i < arr.length; i++) {
        		if (arr[i].id == obj.pId) {
        			if (!arr[i].nodes) arr[i].nodes = [];
        			if (selectedId == obj.id) {
        				arr[i].nodes.push({
                			text: obj.caname,
                		    id: obj.id,
                		    pId: obj.pId,
                		    level: obj.LEVEL,
                		    state: {
                    			selected: true,
                    			expanded: true
                    		}
                		});
        			} else {
        				arr[i].nodes.push({
                			text: obj.caname,
                		    id: obj.id,
                		    pId: obj.pId,
                		    level: obj.LEVEL
                		});
        			}
            		flag = false;
            		break;
            	}
        	}
        	if (flag) {
        		for (var k = 0; k < arr.length; k++) {
            		if (arr[k].nodes) {
            			page.derive.unFor(arr[k].nodes, obj, selectedId);
            		}
            	}
        	}
        },
        //获取表单参数用于搜索
        getParams: function (params) {
            params.start_time = $("#startTime").val();
            params.end_time = $("#endTime").val();
            params.title = $("#keyword").val();
            params.parent_id = page.id;
            params.caid = page.caid;
            params.x = params.offset;   //服务端分页，过滤掉前xxx条记录
            params.y = params.limit;    //服务端分页，每页记录数

            return params;
        },
        
        //获取已选行业
        getPosition: function (obj) {
        	var arr = [];
        	for (var i = 0; i < obj.length ; i++) {
        		arr.push(obj[i].name);
        	}
        	return arr.join('，');
        },
        
        //获取已选行业Id
        getPositionId: function (obj) {
        	var arr = [];
        	for (var i = 0; i < obj.length ; i++) {
        		arr.push(obj[i].id);
        	}
        	return arr.join(',');
        },
        
        //获取提供给表格位置的自适应浏览器的高度，最小高度500
        getAdaptTableHeight: function () {
            var height = $(window).height() - page.$tool.offset().top - page.$tool.outerHeight() - 30;
            return height >= 500 ? height : 500;
        },
        
        //获取菜单列表
        unFor: function (arr, obj) {
        	var flag = true
        	for (var i = 0; i < arr.length; i++) {
        		if (arr[i].id == obj.pId) {
        			if (!arr[i].nodes) arr[i].nodes = [];
            		arr[i].nodes.push({
            			text: obj.caname,
            		    id: obj.id,
            		    pId: obj.pId,
            		    level: obj.LEVEL
            		});
            		flag = false;
            		break;
            	}
        	}
        	if (flag) {
        		for (var k = 0; k < arr.length; k++) {
            		if (arr[k].nodes) {
            			page.derive.unFor(arr[k].nodes, obj);
            		}
            	}
        	}
        },
        
        //变更各个操作按钮操作状态
        submitStatus: function (type, oButton) {
            if(type){
                //提交
            	oButton.attr("disabled", "disabled");
                return;
            }

            //提交完成/失败
            oButton.removeAttr("disabled");
        }
    };

    //页面事件page.eventHandler.setTreeview
    page.eventHandler = {
		//搜索树
        searchTree: function (val) {
        	page.selectedMenu = $('#gslgl_treeview').treeview('search', [ val, {
    		    ignoreCase: true,
    		    exactMatch: false,
    		    revealResults: true
    		}]);
        },
    	//短信配置
    	adddxpz: function (id) {
    		var bv = page.$fromdx.data('bootstrapValidator');
        	//手动触发验证
            bv.validate();
            if(bv.isValid()){
            	page.derive.submitStatus(true, page.$buttonPz);
            	$.ajax({
            		url: page.CONFIG.NEWS_API,
            		data: {
            			id: page.dxpz, 
            			shid: page.dxpzId,
            			custcode: page.$dxCode.val(),
	        		    password: page.$dxPwd.val(),
	        		    url: page.$dxIp.val(),
	            		port: page.$dxPort.val(),
	            		ydaccess: page.$dxYd.val(),
	            		ltaccess: page.$dxLt.val(),
	            		dcaccess: page.$dxDx.val(),
	            		smsname: page.$dxAutograph.val(),
	            		smsusedcounts: page.$dxUse.val(),
            	        smsremaincounts: page.$dxNumber.val(),
	            		smsallcounts: page.$dxTotal.val()
            		},
            		type: 'post',
            		dataType: 'json',
            		success: function (res) {
            			console.log(res);
            			if (res.code == 0) {
            				toastr.success('短信配置成功！');
            				$('#add_dxpz').modal('hide');
            				return;
            			}
            			swal("短信配置失败", res.errMsg, "error");
            		},
            		error: function (err) {
            			swal("短信配置失败", "请稍候再重试或联系管理员", "error");
            		}
            	});
            }
    	},
    	
        //新增商会管理
        Addsh: function (type, str) {
        	var bv = page.$from.data('bootstrapValidator'), flag = true;
        	//手动触发验证
            bv.validate();
            if (page.typeIds.length === 0) {
            	page.$shClassify.parents('.form-group').removeClass('has-success').addClass('has-error');
            	page.$shClassifyPrompt.show();
            	flag =false;
            }
            if(bv.isValid() && flag){
            	var parentObj,url,cafatherid;
            	if (type == 'add') {
            		url = page.CONFIG.ADD_GSL_API;;
            	} else if (type == 'edit') {
            		url = page.CONFIG.EDIT_API;
            	}
            	page.derive.submitStatus(true, page.$buttonSh);
            	$.ajax({
            		url: url,
            		data: {
            			id: page.editId,
            			shname: page.$shName.val(),
            			chairmanname: page.$shUser.val(),
            			website: '',
            			introduction: '',
            			logourl: '',
            			shmobile: page.$shTell.val(),
            			address: page.$shAddress.val(),
            			typeids: page.typeIds
            		},
            		type: 'post',
            		dataType: 'json',
            		success: function (res) {
            			if (res.code == 0) {
            				$('#add_sh').modal('hide');
            				page.$table.bootstrapTable('refresh'); 
            				toastr.success(str + '商会成功！');
            				return;
            			}
            			swal(str + "商会失败", res.errMsg, "error");
            		},
            		error: function (err) {
            			swal(str + "商会失败", "请稍候再重试或联系管理员", "error");
            		}
            	});
            }
        },
        
        //编辑商会管理
        editsh: function (id) {
        	$('#add_sh').modal('show');
        	page.$sh_title.html('修改商会');
        	$('#confirm_addsh').attr('data-type', 'edit');
        	
        	$.ajax({
        		url: page.CONFIG.GET_SH_INFO,
        		data: {
        			id: id
        		},
        		type: 'post',
        		dataType: 'json',
        		success: function (res) {
        			if (res.code == 0) {
        				var rowDate = res.data;console.log(rowDate);
            			page.$shName.val(rowDate.shname ? rowDate.shname : '');
                    	page.$shUser.val(rowDate.chairmanname ? rowDate.chairmanname : '');
                    	page.$shTell.val(rowDate.shmobile ? rowDate.shmobile : '');
                    	page.$shAddress.val(rowDate.address ? rowDate.address : '');
                    	page.$selectClassify.html(page.derive.getPosition(res.category));
                    	page.editId = rowDate.shid;
                    	page.derive.submitStatus(false, page.$buttonSh);
                    	page.typeIds = page.derive.getPositionId(res.category)
                    	return;
        			}
        			toastr.error("获取商会信息失败!", ret.errMsg);
        		},
        		error: function (err) {
        			toastr.error("操作失败!", "请稍候再重试");
        		}
        	});
        	//var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        	
        },

        //新增商会用户
        addshyh: function (type, str) {
        	var bv = page.$fromyh.data('bootstrapValidator');
        	//手动触发验证
            bv.validate();
            if (bv.isValid()) {
                var url = type == 'add' ? page.CONFIG.ADD_GSLYH_API : page.CONFIG.SUBMIT_AUDIT_API;
                page.derive.submitStatus(true, page.$buttonYh);
            	$.ajax({
            		url: url,
            		data: {
            			id: page.editYhId,
            			username: page.$shyhCode.val(),
            			realname: page.$shyhName.val(),
            			password: page.$shyhPwd.val(),
            			sex: $("[name=radType]:checked").val(),
            			departmentid: '',
            			positionid: '',
            			positionname: page.$shyhPost.val(),
            			shanghuiid: page.shyhId,
            			role: '',
            			headurl: '',
            			caid: '',
            			logintype: 1
            		},
            		type: 'post',
            		dataType: 'json',
            		success: function (res) {
            			if (res.code == 0) {
            				$('#add_shyh').modal('hide');
            				page.$table.bootstrapTable('refresh');
            				toastr.success(str + '商会管理成功！');
            				return;
            			}
            			swal(str + "商会管理失败", res.errMsg, "error");
            			page.derive.submitStatus(false, page.$buttonYh);
            		},
            		error: function (err) {
            			swal(str + "商会管理失败", "请稍候再重试或联系管理员", "error");
            			page.derive.submitStatus(false, page.$buttonYh);
            		}
            	});
            }
        },
        //添加用户
        addUser: function (id, type) {
        	page.$shyhPwd.parents('.form-group').show();
        	page.$shyhCode.val('').removeAttr('readonly');
            page.$shyhPwd.val('');
            page.$shyhName.val('');
            page.$shyhPost.val('');
        	page.$fromyh.data('bootstrapValidator').destroy();
        	page.$fromyh.data('bootstrapValidator', null);
        	page.eventHandler.gslyhValidator();
        	page.$shyh_title.html('新增商会用户');
        	page.confirm_addshyh.attr('data-type', 'add');
        	$('#add_shyh').modal('show');
        	page.shyhId = id;
        	page.editYhId = '';
        	page.derive.submitStatus(false, page.$buttonYh);
        },
        
        showInfo: function (id) {
        	$('#add_dxpz').modal('show');
        	$.ajax({
        		url: page.CONFIG.GET_NEWS_API,
        		data: {id: id},
        		type: 'post',
        		dataType: 'json',
        		success: function (res) {
        			if (res.code == 0) {
        				var data = res.data || {};console.log(data);
        				page.dxpz = data.cfid ? data.cfid : '';
        				page.dxpzId = id;
        			    page.$dxCode.val(data.custcode ? data.custcode : '');
        			    page.$dxPwd.val(data.password ? data.password : '');
        			    page.$dxIp.val(data.url ? data.url : '');
        			    page.$dxPort.val(data.port ? data.port : '');
        			    page.$dxYd.val(data.ydaccess ? data.ydaccess : '');
        			    page.$dxLt.val(data.ltaccess ? data.ltaccess : '');
        			    page.$dxDx.val(data.dcaccess ? data.dcaccess : '');
        			    page.$dxAutograph.val(data.smsname ? data.smsname : '');
        			    page.$dxCount.val(data.smsallcounts ? data.smsallcounts : 0);
        			    page.$dxUse.val(data.smsusedcounts ? data.smsusedcounts : 0);
        			    page.$dxNumber.val(data.smsremaincounts ? data.smsremaincounts : 0);
        			    page.$dxTotal.val(data.smsallcounts ? data.smsallcounts : 0);
        			    page.derive.submitStatus(false, page.$buttonPz);
        			    return;
        			}
        			toastr.error("获取短信配置失败!", ret.errMsg);
        		},
        		error: function () {
        			toastr.error("操作失败!", "请稍候再重试");
        		}
        	});
        },
        
        //修改商会用户
        editUser: function (shid, id, type) {
        	page.$shyhPwd.parents('.form-group').hide();
        	page.$shyh_title.html('修改商会用户');
        	page.confirm_addshyh.attr('data-type', 'edit');
        	$('#add_shyh').modal('show');
        	page.shyhId = shid;
        	$.ajax({
        		url: page.CONFIG.SH_USER_INFO,
        		data: {id: id},
        		type: 'post',
        		dataType: 'json',
        		success: function (res) {
        			if (res.code == 0) {
        				var data = res.data;
            			page.editYhId = data.sid;
            			page.$shyhCode.val(data.username ? data.username : '').attr('readonly', 'readonly');
                        page.$shyhName.val(data.realname ? data.realname : '');
                        page.$shyhPost.val(data.positionname ? data.positionname : '');
                        if($("[name=radType]:checked").val() != data.sex){
                            $("[name=radType]:checked").removeAttr("checked");
                            $("[name=radType][value=" + data.sex + "]").attr("checked", "checked");
                        }
                        page.$fromyh.data('bootstrapValidator').destroy();
                    	page.$fromyh.data('bootstrapValidator', null);
                    	page.eventHandler.gslyhValidator();
                    	iCheck.toggle.init("#add_shyh");
                    	$("[name=radType][value=" + data.sex + "]").parent().addClass('checked');
                    	page.derive.submitStatus(false, page.$buttonYh);
                    	return;
        			}
        			toastr.error("获取用户信息失败!", ret.errMsg);
        		},
        		error: function () {
        			toastr.error("操作失败!", "请稍候再重试");
        		}
        	});
        },
        
        //重置密码
        resetPwd: function (id, name) {
            var data = {
                    "id": id
                };
            page.eventHandler.doUserHandler(id, data, page.CONFIG.RESET_PWD, "重置密码", name);
        },
        
        //删除用户
        deleteUser: function (id, name) {
        	var data = {
                "id": id,
                "status": page.CONFIG.DELETE_STATUS
            };
            page.eventHandler.doUserHandler(id, data, page.CONFIG.DELETE_USER_API, "删除", name);
        },
        
        //查看用户
        showUser: function (id) {
        	layer.open({
                type: 2,
                title: '查看用户列表',
                skin: 'layui-layer-rim', //加上边框
                shadeClose: true,
                scrollbar: false,
                content: page.CONFIG.USER_LIST_PAGE + '?id=' + id + '&logintype=2',
                area: [ '95%', '95%' ]
            });
        },
        
        //重置密码/删除商会用户
        doUserHandler: function (id, data, api, label, name) {
            //var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
            swal({
                title: "您确定要{0}选中的信息吗？".Format(label),
                text: name,
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
        
        //提交审核/删除/恢复商会管理管理
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

        //删除商会管理管理
        delete: function (id) {
            var data = {
                "id": id,
                "status": page.CONFIG.DELETE_STATUS
            };
            page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "删除");
        },

        //恢复商会管理管理
        reply: function (id) {
            var data = {
                "id": id,
                "status": page.CONFIG.REPLY_STATUS
            };
            page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "恢复");
        },
        
        //新增商会管理验证
        formValidator: function () {
        	page.$from.bootstrapValidator({
                //指定不验证的情况
                excluded: [':disabled', ':hidden', ':not(:visible)'],
                message: '验证未通过',
                feedbackIcons: {/*输入框不同状态，显示图片的样式*/
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                	shName: {
                        message: '商会名称验证不通过',
                        validators: {
                            notEmpty: {
                                message: '商会名称不能为空'
                            },stringLength:{
                                max: 30,
                                message: "商会名称不能超过30个字"
                            }
                        }
                    },
                    shUser:{
                        message:'会长姓名验证不通过',
                        validators: {
                        	notEmpty: {
                                message: '会长姓名不能为空'
                            },stringLength:{
                                max: 30,
                                message: "会长姓名不能超过30个字"
                            }
                        }
                    },
                    shTell: {
                        message:'商会电话验证不通过',
                        validators: {
                            notEmpty: {
                                message: '商会电话不能为空'
                            },
                            regexp: {
                                regexp: /(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/,
                                message: '请输入正确的手机号码'
                            }
                        }
                    },
                    shAddress: {
                        message:'商会地址验证不通过',
                        validators: {
                            notEmpty: {
                                message: '商会地址不能为空'
                            },stringLength:{
                                max: 30,
                                message: "商会地址不能超过30个字"
                            }
                        }
                    }
                }
            });
        },
        
        //新增商会管理用户验证
        gslyhValidator: function () {
        	page.$fromyh.bootstrapValidator({
                //指定不验证的情况
                excluded: [':disabled', ':hidden', ':not(:visible)'],
                message: '验证未通过',
                feedbackIcons: {/*输入框不同状态，显示图片的样式*/
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                	shyhCode: {
                        message: '账号验证不通过',
                        validators: {
                            notEmpty: {
                                message: '账号不能为空'
                            },stringLength:{
                                max: 30,
                                message: "账号不能超过30个字"
                            }
                        }
                    },
                    shyhPwd:{
                        message:'密码验证不通过',
                        validators: {
                        	notEmpty: {
                                message: '密码不能为空'
                            },stringLength:{
                                max: 20,
                                message: "密码页不能超过20个字"
                            }
                        }
                    },
                    shyhName: {
                        message:'姓名验证不通过',
                        validators: {
                            notEmpty: {
                                message: '姓名不能为空'
                            },stringLength:{
                                max: 20,
                                message: "姓名不能超过20个字"
                            }
                        }
                    }
                }
            });
        },
        
        //短信配置验证
        dxpzValidator: function () {
        	page.$fromdx.bootstrapValidator({
                //指定不验证的情况
                excluded: [':disabled', ':hidden', ':not(:visible)'],
                message: '验证未通过',
                feedbackIcons: {/*输入框不同状态，显示图片的样式*/
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                	dxCode: {
                        message: '客户账号验证不通过',
                        validators: {
                            notEmpty: {
                                message: '客户账号不能为空'
                            },stringLength:{
                                max: 30,
                                message: "客户账号不能超过30个字"
                            }
                        }
                    },
                    dxPwd:{
                        message:'客户密码验证不通过',
                        validators: {
                        	notEmpty: {
                                message: '客户密码不能为空'
                            },stringLength:{
                                max: 20,
                                message: "客户密码不能超过20个字"
                            }
                        }
                    },
                    dxIp: {
                        message:'Ip验证不通过',
                        validators: {
                            notEmpty: {
                                message: 'Ip不能为空'
                            }
                        }
                    },
                    dxPort: {
                        message:'端口验证不通过',
                        validators: {
                            notEmpty: {
                                message: '端口不能为空'
                            }
                        }
                    },
                    dxYd: {
                        message:'移动接入号验证不通过',
                        validators: {
                            notEmpty: {
                                message: '移动接入号不能为空'
                            }
                        }
                    },
                    dxLt: {
                        message:'联通接入号验证不通过',
                        validators: {
                            notEmpty: {
                                message: '联通接入号不能为空'
                            }
                        }
                    },
                    dxDx: {
                        message:'电信接入号验证不通过',
                        validators: {
                            notEmpty: {
                                message: '电信接入号不能为空'
                            }
                        }
                    },
                    dxAutograph: {
                        message:'短信签名验证不通过',
                        validators: {
                            notEmpty: {
                                message: '短信签名不能为空'
                            }
                        }
                    },
                    dxTotal: {
                        message:'配置总数验证不通过',
                        validators: {
                            notEmpty: {
                                message: '配置总数不能为空'
                            }
                        }
                    }
                }
            });
        },
        
        setTreeview: function (data) {console.log(data);
        	//初始化树节点
            $('#gslgl_treeview').treeview({
            	data: data,
            	collapseIcon: 'fa fa-chevron-down',
            	expandIcon: 'fa fa-chevron-right',
            	selectedBackColor: '#1ab394'
            });
            $('#gslgl_treeview').on('nodeSelected', function(event, data) {
            	page.caid = data.id;
        	    page.id = data.id;
        	    page.refresh();
        	}); 
        },
        group: function (index, row, $detail) {console.log($detail);
        	var parentid = row.shid;
        	var group_com = $detail.html('<h3 class="text-center">商会（' + row.shname + '）用户列表</h3><table></table>').find('table');
        	$(group_com).bootstrapTable({
        		url: page.CONFIG.GET_SH_USER,  //AJAX读取列表数据的URL
                method: "get",                  //请求方式
                contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
                dataType: "json",               //服务器返回数据类型
                cache: false,                   //不缓存数据
                queryParamsType: "limit",       //查询参数组织方式
                queryParams: function (params) {
                    params.shid = parentid;
                    params.logintype = 1;
                    params.x = params.offset;
                    params.y = params.limit;
                    return params;
                },

                //分页相关
                pagination: true,            //是否分页
                pageNumber:1,                //初始化加载第一页，默认第一页
                pageSize: 20,                //每页的记录行数（*）
                pageList: [10, 20, 50, 100],     //允许选择的每页的数量切换
                sidePagination: "server",
                undefinedText: "—",     //当数据为空的填充字符
                
                //表格内容相关设置
                idField:"sid",       //当前行主键的id值
                uniqueId:'sid',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
                dataField: "data",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
                columns: [
                    {
		                field: 'username',
		                title: '账号',
		                align: 'left'
		            },
		            {
		                field: 'realname',
		                title: '姓名',
		                width: '150px',
		                align: 'center'
		            },
		            {
		                field: 'sex',
		                title: '性别',
		                width: '100px',
		                align: 'center',
		                formatter: function (value) {
		                	switch (value) {
		                	    case 1: return '男';
		                	    case 2: return '女';
		                	    default: return '—';
		                	}
		                }
		            },
		            {
		                field: 'positionname',
		                title: '职务',
		                width: '150px',
		                align: 'center'
		            },
		            {
		                field: '',
		                title: '操作',
		                align: 'center',
		                width: '250px',
		                formatter:function(value, row){
		                    var strHtml= '';
		                    strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.editUser('+ parentid +', ' + row.sid + ', \'edit\')">编辑</button>';
		                    strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.resetPwd(' + row.sid + ', \''+ row.username +'\')">重置密码</button>';
		                    strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.deleteUser(' + row.sid + ', \''+ row.username +'\')">删除</button>';

		                    return strHtml;
		                }
		            }
                ]
        	});
        }
    };


    $(document).ready(function () {
        
    	//初始化页面状态
        iCheck.toggle.init("#add_shyh");
        page.derive.getMenu(0);
        //新增商会管理验证初始化
        page.eventHandler.formValidator();
        page.eventHandler.gslyhValidator();
        page.eventHandler.dxpzValidator();
        
        //选择分类
        page.$shClassify.click(function () {//console.log(page.selectedObj);
        	page.selector = new module.multSelector({
        		  url: page.CONFIG.CLASSIFY_LIST_API,
        		  dataC: "data",
                  keyC: "id",
                  valueC: "name",
                  pkeyC: "",
                  keywordC: "title",
                  tagsC: "cname",
                  searchType: 1,
        		  title: "请选择所属分类",
        		  data: page.selectedObj,
        		  selectedData: [],
        		  callback: function (data) {
        			  var arr = [],type = [];
        			  for (var i = 0 ;i < data.length; i++) {
        				  arr.push(data[i].value);
        				  type.push(data[i].key);
        			  }
        			  page.$selectClassify.html(arr.join('，'));
        			  page.typeIds = type.join(',');
        			  page.selectedObj = data;
        			  if (data.length != 0) {
        				  page.$shClassify.parents('.form-group').removeClass('has-error').addClass('has-success');
                      	  page.$shClassifyPrompt.hide();
        			  } else {
        				  page.$shClassify.parents('.form-group').removeClass('has-success').addClass('has-error');
                      	  page.$shClassifyPrompt.show();
        			  }
        		  }
        		})
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
            url: page.CONFIG.GET_MENU_LIST,  //AJAX读取列表数据的URL
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
            detailView: true,      //是否显示父子表
            cardView: false,        //是否显示详细图
            undefinedText: "—",     //当数据为空的填充字符
            showColumns: true,      //是否显示筛选列按钮
            showRefresh: true,      //是否显示刷新按钮
            clickToSelect: true,    //是否开启点击选中行,自动选择rediobox 和 checkbox
            toolbar:'#tableTools',  //工具按钮的容器
            //classes: 'table table-hover table-no-bordered',
            //buttonsClass: 'default btn-outline',

            //表格内容相关设置
            idField:"shid",       //当前行主键的id值
            uniqueId:'shid',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
            dataField: "data",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
            columns: [{
                field: 'shname',
                title: '名称',
                align: 'left',
                formatter: function (value, row) {
                	return '<a href="javascript:;" onclick="page.eventHandler.editsh(' + row.shid + ', \'add\')">' + value + '</a>';
                }
            },{
                field: 'createdate',
                title: '创建时间',
                width: "180px",
                align: 'center'
            },{
                field: ' ',
                title: '操作',
                align: 'center',
                width: "300px",
                formatter:function(value, row){
                    var strHtml= '';
                    strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.editsh(' + row.shid + ', \'add\')">编辑</button>';
                    strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.addUser(' + row.shid + ')">添加用户</button>';
                    strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.showInfo(' + row.shid + ')">短信配置</button>';
                    strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete(' + row.shid + ')">删除</button>';

                    return strHtml;
                }
            }],
            onExpandRow: function (index, row, $detail) {
            	page.eventHandler.group(index, row, $detail);
            }
        });
        
        //
          
        //回车搜索事件
        $("#keyword").keyup(function (event) {
            if(event.keyCode == 13)
                $("#btnSearch").click();
        });

        //新增商会管理操作
        page.$add_sh_btn.click(function () {
        	$('#add_sh').modal('show');
        	page.$sh_title.html('新增商会');
        	$('#confirm_addsh').attr('data-type', 'add');
        	page.editId = '';
        	page.derive.submitStatus(false, page.$buttonSh);
        });
        
        $("#confirm_addsh").click(function () {
        	var type = $(this).attr('data-type');
        	if (type == 'add') {
        		page.eventHandler.Addsh(type, '新增');
        	} else if (type == 'edit') {
        		page.eventHandler.Addsh(type, '修改');
        	}
        });
        
        page.$add_sh.on('hidden.bs.modal', function () {
        	page.$shName.val('');
            page.$shUser.val('');
            page.$shTell.val('');
            page.$shAddress.val('');
            page.$selectClassify.html('');
        	page.$from.data('bootstrapValidator').destroy();
        	page.$from.data('bootstrapValidator', null);
        	page.eventHandler.formValidator();
        });
        
        /*page.$add_sh.on('shown.bs.modal', function () {
        	page.derive.submitStatus(false, page.$buttonSh);
        });*/
        
        //新增商会用户
        page.confirm_addshyh.click(function () {
        	var type = $(this).attr('data-type');
        	if (type == 'add') {
        		page.eventHandler.addshyh(type, '新增');
        	} else if (type == 'edit') {
        		page.eventHandler.addshyh(type, '修改');
        	}
        });
        /*$('#add_shyh').on('shown.bs.modal', function () {
        	page.derive.submitStatus(false, page.$buttonYh);
        });*/
        
        //短信配置
        $('#confirm_adddxpz').click(function () {
        	page.eventHandler.adddxpz();
        });
        
        $('#add_dxpz').on('hidden.bs.modal', function () {
        	page.$dxCode.val('');
		    page.$dxPwd.val('');
		    page.$dxIp.val('');
		    page.$dxPort.val('');
		    page.$dxYd.val('');
		    page.$dxLt.val('');
		    page.$dxDx.val('');
		    page.$dxAutograph.val('');
		    page.$dxCount.val(0);
		    page.$dxUse.val(0);
		    page.$dxNumber.val(0);
		    page.$dxTotal.val(0);
        	page.$fromdx.data('bootstrapValidator').destroy();
        	page.$fromdx.data('bootstrapValidator', null);
        	page.eventHandler.dxpzValidator();
        });
        
        //搜索
        $("#btnSearch").click(function(){
            var params = page.$table.bootstrapTable('getOptions');
            params = page.derive.getParams(params);

            page.$table.bootstrapTable('refresh',params);
        });
        
        //搜索工商联列表
        page.$txtUnSelected.keyup(function (event) {
        	if(event.keyCode == 13 && $(this).val().trim() != '') {
        		var newarr = [];
        		for(var i=0;i<page.selectedMenu.length;i++){
        			var pId = page.selectedMenu[i].pId;
        			var id = page.selectedMenu[i].id;
        			if(id==0){
        				newarr.push(page.selectedMenu[i]);
        			}else{
    					var flag = true;
        				for(var j=0;j<page.selectedMenu.length;j++){
        					var ppid = page.selectedMenu[j].id;
        					if(pId==ppid){
        						flag=false;
        						break;
        					}	
        				}
        				if(flag)
        					newarr.push(page.selectedMenu[i]);
        			}
        			
        		}
        		page.eventHandler.setTreeview(newarr);
//        		page.eventHandler.setTreeview(page.selectedMenu);
        		return;
        	}
        	if ($(this).val().trim() == '') {
        		page.derive.getMenu(0);
        		return;
        	}
        	page.eventHandler.searchTree($(this).val());
//        	$('#gslgl_treeview').on('searchComplete',function (event, results) {
//        		page.selectedMenu = results;
//            });
        });
        
        page.$btnUnSelected.click(function () {
        	if (page.$txtUnSelected.val().trim() == '') {
        		page.derive.getMenu(0);
        		return;
        	}
    		var newarr = [];
    		for(var i=0;i<page.selectedMenu.length;i++){
    			var pId = page.selectedMenu[i].pId;
    			var id = page.selectedMenu[i].id;
    			if(id==0){
    				newarr.push(page.selectedMenu[i]);
    			}else{
					var flag = true;
    				for(var j=0;j<page.selectedMenu.length;j++){
    					var ppid = page.selectedMenu[j].id;
    					if(pId==ppid){
    						flag=false;
    						break;
    					}	
    				}
    				if(flag)
    					newarr.push(page.selectedMenu[i]);
    			}
    			
    		}
    		page.eventHandler.setTreeview(newarr);
//        	page.eventHandler.setTreeview(page.selectedMenu);
        });

        $(window).resize(function () {
            page.$table.bootstrapTable("resetView", {height: page.derive.getAdaptTableHeight() + 10});
        })
    });
});