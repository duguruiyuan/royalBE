//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'iCheckPlus', 'toastr', 'table', 'validator'], function (bs, $, helper, swal, layer, iCheck, toastr) {
    //页面所用到配置page.CONFIG.RESET_PWD
    page.CONFIG = {
        GET_LIST_API: helper.url.getUrlByMapping("admin/gslmanager/find_gsluser.shtml"),                     //查询工商联用户列表接口
        SUBMIT_AUDIT_API: helper.url.getUrlByMapping("admin/gslmanager/update_gsluser.shtml"),    //编辑接口
        DELETE_API: helper.url.getUrlByMapping("admin/gslmanager/delete_gsluser.shtml"),                        //删除工商联用户接口
        POWER_API: helper.url.getUrlByMapping("admin/gslmanager/get_gslrole.shtml"),         //工商联权限列表
        UPDATE_GSLYH_API: helper.url.getUrlByMapping("admin/gslmanager/update_gsluser.shtml"),        //新增工商联用户
        RESET_PWD: helper.url.getUrlByMapping("admin/gslmanager/reset_password.shtml"),        //重置密码
        DELETE_STATUS: 0       //删除的状态码
    };
    
    page.id = helper.url.queryString("id") || '';
    page.logintype = helper.url.queryString("logintype") || '';
    page.gslyhId = '';
    
    //存储页面table对象
    page.$tool = $('#tableTools');
    page.$table = $('#tableList');
    
    page.$frmAddgslyh = $('#add_gslyh');
    
    page.$gslyhCode = $('#gslyhCode');
    page.$gslyhName = $('#gslyhName');
    page.$gslyhPost = $('#gslyhPost');
    page.$gslyhPower = $('#gslyhPower');

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
            params.title = $("#keyword").val();
            params.caid = page.id;
            params.logintype = page.logintype;
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
    		
		//修改工商联用户
        addGslyh: function (id, url, str) {
        	var bv = page.$frmAddgslyh.data('bootstrapValidator');
        	//手动触发验证
            bv.validate();
            if (bv.isValid()) {
                var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);console.log(rowDate);
            	$.ajax({
            		url: page.CONFIG.UPDATE_GSLYH_API,
            		data: {
            			id: id,
            			//username: page.$gslyhCode.val(),
            			realname: page.$gslyhName.val(),
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
            				toastr.success('修改工商联成功！');
            				return;
            			}
            			swal("修改工商联失败", res.errMsg, "error");
            		},
            		error: function (err) {
            			swal("修改工商联失败", "请稍候再重试或联系管理员", "error");
            		}
            	});
            }
        },

        //编辑
        showEdit: function (id) {
        	var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        	page.gslyhId = rowDate.sid;
        	page.eventHandler.getPowrt(rowDate.caid, rowDate.role);
        	page.$gslyhCode.val(rowDate.username);
            page.$gslyhName.val(rowDate.realname);
            page.$gslyhPost.val(rowDate.positionname);
            if($("[name=radType]:checked").val() != rowDate.sex){
                $("[name=radType]:checked").removeAttr("checked");
                $("[name=radType][value=" + rowDate.sex + "]").attr("checked", "checked");
            }
        	$('#add_gslyh').modal('show');
        	iCheck.toggle.init("#add_gslyh");
        	$("[name=radType][value=" + rowDate.sex + "]").parent().addClass('checked');
        },
        
        //工商联权限
        getPowrt: function (id, role) {
        	$.ajax({
        		url: page.CONFIG.POWER_API,
        		data: {id: id},
        		type: 'post',
        		dataType: 'json',
        		success: function (res) {
        			var result = res.data;console.log(role, result);
        			var arr = ['<option value="">请选择</option>'];
        			var selected;
        			for(var i = 0; i < result.length; i++){
                        //var selected = page.assist.actionIsAdd() ? (random == i) : (result[i].code == page.info.data["anonymous_type"]);
                        selected = result[i].roid == role ? ' selected="selected"' : '';
                        arr.push('<option value="' + result[i].roid + '"'+ selected +'>' + result[i].rolename + '</option>');
                    }
        			page.$gslyhPower.html(arr.join(''));
        		},
        		error: function () {
        			toastr.error("OMG!", "获取用户权限列表错误，请稍候再重试！");
        		}
        	});
        },
        
        //删除工商联用户
        delete: function (id) {
            var data = {
                "id": id,
                "status": page.CONFIG.DELETE_STATUS
            };
            page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "删除");
        },
        
        //重置密码
        resetPwd: function (id) {
            var data = {
                    "id": id
                };
            page.eventHandler.doHandler(id, data, page.CONFIG.RESET_PWD, "重置密码");
        },
        
        //新增工商联用户验证
        gslyhValidator: function () {
        	page.$frmAddgslyh.bootstrapValidator({
                //指定不验证的情况
                excluded: [':disabled', ':hidden', ':not(:visible)'],
                message: '验证未通过',
                feedbackIcons: {/*输入框不同状态，显示图片的样式*/
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                	gslyhCode: {
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
                    gslyhPwd:{
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
                    gslyhName: {
                        message:'姓名验证不通过',
                        validators: {
                            notEmpty: {
                                message: '姓名不能为空'
                            },stringLength:{
                                max: 20,
                                message: "姓名不能超过20个字"
                            }
                        }
                    }/*,
                    gslyhPower: {
                    	message: '权限验证不通过',
                    	validators: {
                    		notEmpty: {
                                message: '权限不能为空'
                            }
                    	}
                    }*/
                }
            });
        },
        
        //提交审核/删除/恢复秘闻
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
        }
    };


    $(document).ready(function () {
        
    	//
    	iCheck.toggle.init("#add_gslyh");
    	
    	//
    	page.eventHandler.gslyhValidator();
    	
        //表格初始化
        page.$table.bootstrapTable({
            //请求相关
            url: page.CONFIG.GET_LIST_API,  //AJAX读取列表数据的URL
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
            idField:"sid",       //当前行主键的id值
            uniqueId:'sid',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
            dataField: "data",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
            columns: [{
                field: 'username',
                title: '账号',
                align: 'left',
            },{
                field: 'realname',
                title: '姓名',
                width: "120px",
                align: 'center'
            },{
                field: 'sex',
                title: '性别',
                width: "100px",
                formatter: function(value){
                    switch(value){
                        case 1: return '男';
                        case 2: return '女';
                        default: return '-';
                    }
                },
                align: 'center'
            },{
                field: 'positionname',
                title: '职务',
                width: "150px",
                align: 'center'
            },{
                field: 'rolename',
                title: '权限',
                width: "100px",
                align: 'center'
            },{
                field: ' ',
                title: '操作',
                align: 'center',
                width: "200px",
                formatter:function(value, row){
                    var strHtml= '';
                    strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.showEdit(' + row.sid + ')">编辑</button>';
                    strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.resetPwd(' + row.sid + ')">重置密码</button>';
                    //strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.showEdit(' + row.id + ')">权限配置</button>';
                    strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete(' + row.sid + ')">删除</button>';
                    return strHtml;
                }
            }]
        });

        //回车搜索事件
        $("#keyword").keyup(function (event) {
            if(event.keyCode == 13)
                $("#btnSearch").click();
        });

        //新增工商联用户
        $('#confirm_addGslyh').click(function () {
        	page.eventHandler.addGslyh(page.gslyhId);  	
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