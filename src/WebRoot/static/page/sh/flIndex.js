//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'treeview', 'toastrPlus', 'datetimepicker', 'module.inputSelector', 'table', 'validator'], function (bs, $, helper, swal, layer, treeview, toastr) {
    
	var module = {
		inputSelector: require('module.inputSelector')
    };
	//页面所用到配置page.CONFIG.USER_LIST_PAGE
    page.CONFIG = {
    	CLASSIFY_LIST_API: helper.url.getUrlByMapping("admin/gslmanager/find_gsl.shtml"),  //工商联列表
    	GET_MENU_LIST: helper.url.getUrlByMapping("admin/shmanager/find_classification_data.shtml"),      //查询所有分类菜单列表
    	GET_LIST_API: helper.url.getUrlByMapping("admin/shmanager/find_classification.shtml"),             //查询分类列表接口
        ADD_FL_API: helper.url.getUrlByMapping("admin/shmanager/insert_classification.shtml"),    //新增分类接口
        EDIT_API: helper.url.getUrlByMapping("admin/shmanager/update_classification.shtml"),    //修改分类接口
        DELETE_API: helper.url.getUrlByMapping("admin/shmanager/delete_classification.shtml"),         //删除分类接口
        POWER_API: helper.url.getUrlByMapping("admin/gslmanager/get_gslrole.shtml"),         //工商联权限列表
        DELETE_STATUS: 2,       //删除的状态码
        page_URL: helper.url.getUrlByMapping('admin/gslglindex.shtml'),
        USER_LIST_PAGE: helper.url.getUrlByMapping('admin/gslgluserlist.shtml')             //查看用户列表页
    };

    page.id = helper.url.queryString("parent_id") || '';
    page.editId = '';
    page.gslfl = '';
    page.modifyids = [];
    page.arr = [{
		text: '分类管理',
		id: 0,
		nodes: [],
		nodeid: 0,
		pId: 0,
		level: 0,
		parentId: 0,
		state: {
			selected: true
		}
	}];
    page.gsl = null;
    page.selectedMenu = []

    //存储页面table对象
    page.$tool = $('#tableTools');
    page.$table = $('#tableList');
    page.$button = $('#divAction button');
    page.$add_fl_btn = $('#add_fl_btn');
    page.$from = $('#frmAddfl');
    page.$fl_title = $('#fl_title');
    page.$flName = $('#flName');
    page.$flgsl = $('#flgsl');
    
    page.$selectGsl = $('#selectGsl');
    page.$selectFl = $('#selectFl');
    
    page.$txtUnSelected = $('#txtUnSelected');
    page.$btnUnSelected = $('#btnUnSelected');

    /**
     * 提供给引用页面刷新用，如果未声明该方法，则引用页面调用将使用浏览器重载重新刷新本页面
     */
    page.refresh = function () {
        $("#btnSearch").click();
    };

    //页面级的帮助对象集合page.derive.getMenu
    page.derive = {
        //获取表单参数用于搜索
        getParams: function (params) {
            params.start_time = $("#startTime").val();
            params.end_time = $("#endTime").val();
            params.title = $("#keyword").val();
            params.fatherid = page.id;
            params.x = params.offset;   //服务端分页，过滤掉前xxx条记录
            params.y = params.limit;    //服务端分页，每页记录数

            return params;
        },

        //获取提供给表格位置的自适应浏览器的高度，最小高度500
        getAdaptTableHeight: function () {
            var height = $(window).height() - page.$tool.offset().top - page.$tool.outerHeight() - 30;
            return height >= 500 ? height : 500;
        },
        
        //获取菜单列表
        getMenu: function (selectedId) {
        	$.ajax({
        		url: page.CONFIG.GET_MENU_LIST,
        		type: 'POST',
                dataType: 'json',
                success: function (res) {
                	var data = res.data;
                	if (selectedId) {
                		page.arr = [{
                    		text: '分类管理',
                    		id: 0,
                    		nodes: [],
                    		nodeid: 0,
                    		pId: 0,
                    		level: 0,
                    		parentId: 0
                    	}];
                	} else {
                		page.arr = [{
                    		text: '分类管理',
                    		id: 0,
                    		nodes: [],
                    		nodeid: 0,
                    		pId: 0,
                    		level: 0,
                    		parentId: 0,
                    		state: {
                    			selected: true
                    		}
                    	}];
                	}
                	var list = [];
                	for (var i = 0 ; i < data.length; i ++) {
                		if (!list[data[i].level - 1]) list[data[i].level - 1] = [];
                		list[data[i].level - 1].push(data[i]);
                	}
                	//console.log(selectedId);
                	for (var k = 0 ; k < list.length; k ++) {
                		for (var j = 0; j < list[k].length; j ++) {
                		    page.derive.unFor(page.arr, list[k][j], selectedId);	
                		}
                	}
                	page.eventHandler.setTreeview(page.arr);
                	//page.derive.openTree();
                	//console.log($('#gslgl_treeview').treeview('getSelected')[0]);
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
                			text: obj.name + '(' + obj.cname + ')',
                		    id: obj.id,
                		    pId: obj.pId,
                		    level: obj.level,
                		    nodeid: obj.nodeid,
                		    state: {
                    			selected: true,
                    			expanded: true
                    		}
                		});
        			} else {
        				arr[i].nodes.push({
                			text: obj.name + '(' + obj.cname + ')',
                		    id: obj.id,
                		    pId: obj.pId,
                		    level: obj.level,
                		    nodeid: obj.nodeid
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

        //变更各个操作按钮操作状态
        submitStatus: function (type, oButton) {
            if(type){
                //提交
            	oButton.attr("disabled", "disabled");
                return;
            }

            //提交完成/失败
            oButton.removeAttr("disabled");
        },
        
        openTree: function () {
        	
        }
    };

    //页面事件page.eventHandler.initGsl
    page.eventHandler = {
    	
    	//
		initGsl: function (gslData) {
			//初始化工商联选择器
		    page.gsl = new module.inputSelector({
		      container: "#selectGsl",
		      validatorContainer: "#frmAddfl",
		      readonly: false,
		      type: "gongshanglian",
		      data: gslData ? gslData : '',
		      callback: function (data) {
		    	  page.gslfl = data.key;
		      },
		      unSelectCallback: function () {
		    	  page.gslfl = '';
		      }
		    });
		},
		
		//
		initFl: function (id, nodeid, thisId, level) {
		    $.ajax({
		    	url: helper.url.getUrlByMapping("admin/shmanager/categoryallmm.shtml"),
		    	data: {nodeid: nodeid},
		    	type: 'post',
		    	dataType: 'json',
		    	success: function (res) {
		    		var data = res.userList;
		    		page.modifyids = [];
		    		var arr = ['<option value="">请选择分类</option>'];
		    		for (var i = 0; i < data.length; i++) {
		    			if (data[i].level <= level && data[i].id != thisId){
		    				if (data[i].id == id) {
			    				arr.push('<option value="' + data[i].id + '" selected="selected">' + data[i].name + '</option>');
			    			} else {
			    				arr.push('<option value="' + data[i].id + '">' + data[i].name + '</option>');
			    			}
		    			} else {
		    				page.modifyids.push(data[i].id);
		    			}
		    		}
		    		page.$selectFl.html(arr.join(''));
		    	},
		    	error: function () {
		    		swal("查询分类失败", "请稍候再重试或联系管理员", "error");
		    	}
		    });
		},
		
        //新增分类
        AddFl: function (type, str) {
        	var bv = page.$from.data('bootstrapValidator');
        	//手动触发验证
            bv.validate();
            if(bv.isValid()){
            	var parentObj,url,cafatherid,level,nodeid;
            	if (type == 'add') {
            		parentObj = $('#gslgl_treeview').treeview('getSelected')[0];
            		url = page.CONFIG.ADD_FL_API;
            		cafatherid = parentObj.id;
            		level = parentObj.level + 1;
            		nodeid = parentObj.nodeid;
            	} else if (type == 'edit') {
            		parentObj = page.$table.bootstrapTable('getRowByUniqueId', page.editId);
            		url = page.CONFIG.EDIT_API;
            		//cafatherid = parentObj.fatherid;
            		cafatherid = page.$selectFl.val() ? page.$selectFl.val() : 0;
            		level = parentObj.level;
            		nodeid = page.$selectFl.val() ? page.$selectFl.val() : ''
            	}
            	//console.log(parentObj);
            	$('#add_fl').modal('hide');
            	page.derive.submitStatus(true, page.$button);
            	$.ajax({
            		url: url,
            		data: {
            			id: page.editId,
            			name: page.$flName.val(),
            			fatherid: cafatherid,
            			level: level,
            			caid: page.gslfl,
            			nodeid: nodeid,
            			modifyids: page.modifyids.join(',')
            		},
            		type: 'post',
            		dataType: 'json',
            		success: function (res) {
            			if (res.code == 0) {
            				page.gslfl == '';
            				toastr.success(str + '分类成功！');
            				page.$table.bootstrapTable('refresh');
            				//$('#gslgl_treeview').treeview({data: []}); 
            				page.derive.getMenu(cafatherid);
            				//$('#gslgl_treeview').treeview('expandNode', [ 1, { levels: 5, silent: true } ]);
            				//$('#gslgl_treeview').treeview('selectNode', [ cafatherid, { silent: true } ]);
            				return;
            			}
            			swal(str + "分类失败", res.errMsg, "error");
            		},
            		error: function (err) {
            			swal(str + "分类失败", "请稍候再重试或联系管理员", "error");
            		}
            	});
            }
        },
        
        //编辑工商联
        showEdit: function (id, level) {
        	var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);console.log(rowDate);
        	$('#add_fl').modal('show');
        	page.$fl_title.html('修改分类');
        	$('#confirm_addfl').attr('data-type', 'edit');
        	if (level == 1) {
        		page.$selectGsl.parents('.form-group').show();
        		page.$selectFl.parents('.form-group').hide();
        		page.eventHandler.initGsl({key: rowDate.nodeid,value: rowDate.cname});
        	} else {
        		page.$selectGsl.parents('.form-group').hide();
        		page.$selectFl.parents('.form-group').show();
        		page.eventHandler.initFl(rowDate.fatherid, rowDate.nodeid, id, level);
        	}
        	page.$flName.val(rowDate.name ? rowDate.name : '');
            page.editId = rowDate.id;
            page.gslfl = rowDate.caid;
            page.derive.submitStatus(false, page.$button);
        },
        
        //工商联权限
        getPowrt: function (id) {
        	$.ajax({
        		url: page.CONFIG.POWER_API,
        		data: {id: id},
        		type: 'post',
        		dataType: 'json',
        		success: function (res) {
        			var result = res.data;
        			var arr = ['<option value="">请选择</option>'];
        			for(var i = 0; i < result.length; i++){
                        //var selected = page.assist.actionIsAdd() ? (random == i) : (result[i].code == page.info.data["anonymous_type"]);
                        //selected = selected ? ' selected="selected"' : '';
                        arr.push('<option value="' + result[i].roid + '">' + result[i].rolename + '</option>');
                    }
        			page.$gslyhPower.html(arr.join(''));
        		},
        		error: function () {
        			toastr.error("OMG!", "获取用户权限列表错误，请稍候再重试！");
        		}
        	});
        },
        //新增工商联
        addGslyh: function (id, url, str) {
        	var bv = page.$frmAddgslyh.data('bootstrapValidator');
        	//手动触发验证
            bv.validate();
            if (bv.isValid()) {
                var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
            	$.ajax({
            		url: url,
            		data: {
            			username: page.$gslyhCode.val(),
            			realname: page.$gslyhName.val(),
            			password: page.$gslyhPwd.val(),
            			sex: $("[name=radType]:checked").val(),
            			departmentid: '',
            			positionid: '',
            			positionname: page.$gslyhPost.val(),
            			shanghuiid: '',
            			role: page.$gslyhPower.val(),
            			headurl: '',
            			caid: rowDate.caid,
            			logintype: 2
            		},
            		type: 'post',
            		dataType: 'json',
            		success: function (res) {
            			if (res.code == 0) {
            				$('#add_gslyh').modal('hide');
            				page.$table.bootstrapTable('refresh');
            				toastr.success(str + '工商联成功！');
            				return;
            			}
            			swal(str + "工商联失败", res.errMsg, "error");
            		},
            		error: function (err) {
            			swal(str + "工商联失败", "请稍候再重试或联系管理员", "error");
            		}
            	});
            }
        },
        //添加用户
        addUser: function (id, type) {
        	page.eventHandler.getPowrt(id);
        	page.$gslyhCode.val('');
            page.$gslyhPwd.val('');
            page.$gslyhName.val('');
            page.$gslyhPost.val('');
            page.$gslyhPower.val('');
        	page.$frmAddgslyh.data('bootstrapValidator').destroy();
        	page.$frmAddgslyh.data('bootstrapValidator', null);
        	page.eventHandler.gslyhValidator();
        	$('#add_gslyh').modal('show');
        	page.$gslyh_title.html('新增工商联用户');
        	$('#confirm_addGslyh').attr('data-type', type);
        	page.gslyhId = id;
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
        //提交审核/删除/恢复工商联管理
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
                            page.derive.getMenu(rowDate.fatherid);
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

        //删除工商联管理
        delete: function (id) {
            var data = {
                "id": id,
                "state": 2
            };
            page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "删除");
        },
        
        //新增分类验证
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
                fields: {/*验证*/
                	flName: {/*键名和input name值对应*/
                        message: '分类名称验证不通过',
                        validators: {
                            notEmpty: {/*非空提示*/
                                message: '分类名称不能为空'
                            },stringLength:{
                                max: 30,
                                message: "分类名称不能超过30个字"
                            }
                        }
                    },
                    selectFl:{
                        message:'所属分类验证不通过',
                        validators: {
                        	notEmpty: {
                                message: '所属分类不能为空'
                            }
                        }
                    }
                }
            });
        },
        
        //树节点
        setTreeview: function (data) {console.log(data);
        	//初始化树节点
            $('#gslgl_treeview').treeview({
            	data: data,
            	collapseIcon: 'fa fa-chevron-down',
            	expandIcon: 'fa fa-chevron-right',
            	selectedBackColor: '#1ab394',
            	searchResultColor: '#ec4758',
            	levels: 2,
            	onsearchComplete: function (event, results) {
                	console.log(results);
                }
            });
            $('#gslgl_treeview').on('nodeSelected', function(event, data) {
        	    page.id = data.id;
        	    page.refresh();
        	}); 
        },
        
        //搜索树
        searchTree: function (val) {
        	page.selectedMenu = $('#gslgl_treeview').treeview('search', [ val, {
    		    ignoreCase: true,
    		    exactMatch: false,
    		    revealResults: true
    		}]);
        }
    };


    $(document).ready(function () {
        
    	$('#gslgl_treeview').css('height', page.derive.getAdaptTableHeight());
        //
        page.derive.getMenu(0);
        
        //新增分类验证初始化
        page.eventHandler.formValidator();
        
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
            url: page.CONFIG.GET_LIST_API + '?parent_id=' + page.id,  //AJAX读取列表数据的URL
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
                field: 'name',
                title: '名称',
                align: 'left'
            },{
                field: 'createdate',
                title: '创建时间',
                width: "180px",
                align: 'center'
            },{
                field: 'cname',
                title: '所属工商联',
                width: "180px",
                align: 'center'
            },{
                field: ' ',
                title: '操作',
                align: 'center',
                width: "200px",
                formatter:function(value, row){
                    var strHtml= '';
                    strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.showEdit(' + row.id + ', ' + row.level + ')">编辑</button>';
                    strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete(' + row.id + ')">删除</button>';
                    return strHtml;
                }
            }]
        });
        
        //
          
        //回车搜索事件
        $("#keyword").keyup(function (event) {
            if(event.keyCode == 13)
                $("#btnSearch").click();
        });

        //新增工商联操作
        page.$add_fl_btn.click(function () {
        	page.editId = '';
        	$('#add_fl').modal('show');
        	page.$fl_title.html('新增分类');
        	$('#confirm_addfl').attr('data-type', 'add');
        	var parentObj = $('#gslgl_treeview').treeview('getSelected')[0];
        	if (parentObj.level == 0) {
        		page.$selectGsl.parents('.form-group').show();
        		page.$selectFl.parents('.form-group').hide();
        		page.eventHandler.initGsl();
        	} else {
        		page.$selectGsl.parents('.form-group').hide();
        		page.$selectFl.parents('.form-group').hide();
        	}
        	page.derive.submitStatus(false, page.$button);
        });
        
        $("#confirm_addfl").click(function () {
        	var type = $(this).attr('data-type');
        	if (type == 'add') {
        		page.eventHandler.AddFl(type, '新增');
        	} else if (type == 'edit') {
        		page.eventHandler.AddFl(type, '修改');
        	}
        });
        
        $('#add_fl').on('hidden.bs.modal', function () {
        	page.$flName.val('');
        	page.$from.data('bootstrapValidator').destroy();
        	page.$from.data('bootstrapValidator', null);
        	page.eventHandler.formValidator();
        });

        //搜索
        $("#btnSearch").click(function(){
            var params = page.$table.bootstrapTable('getOptions');
            params = page.derive.getParams(params);

            page.$table.bootstrapTable('refresh',params);
        });
        //搜索商会列表
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