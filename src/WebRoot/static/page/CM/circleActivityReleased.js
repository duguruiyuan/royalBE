//初始化页面对象
var page = {};

//存储页面table对象
page.$table = $('#tableList');
	page.$titleKeyword = $('#titleKeyword');
	page.$circleKeyword = $('#circleKeyword');
	page.$startTime = $('#startTime');
	page.$endTime = $('#endTime');
	
	
	//日期选择
	laydate({
	    elem: '#startTime',
	    format: 'YYYY/MM/DD hh:mm:ss',
	    min: '1990-06-16 23:59:59', //设定最小日期为当前日期
	    max: '2099-06-16 23:59:59', //最大日期
	    istime: true,
	    istoday: false,
	    choose: function (data) {
	       //end.min = datas; //开始日选好后，重置结束日的最小日期
	        //end.start = datas //将结束日的初始值设定为开始日
	    }
	});
	laydate({
	    elem: '#endTime',
	    format: 'YYYY/MM/DD hh:mm:ss',
	    min: '1990-06-16 23:59:59', //设定最小日期为当前日期
	    max: '2099-06-16 23:59:59',
	    istime: true,
	    istoday: false,
	    choose: function (data) {
	        //start.max = datas; //结束日选好后，重置开始日的最大日期
	    }
	});
	//日期选择
	/*laydate({
	    elem: '#createStartTime',
	    format: 'YYYY/MM/DD hh:mm:ss',
	    min: '1990-06-16 23:59:59', //设定最小日期为当前日期
	    max: '2099-06-16 23:59:59', //最大日期
	    istime: true,
	    istoday: false,
	    choose: function (data) {
	       //end.min = datas; //开始日选好后，重置结束日的最小日期
	        //end.start = datas //将结束日的初始值设定为开始日
	    }
	});
	laydate({
	    elem: '#createEndTime',
	    format: 'YYYY/MM/DD hh:mm:ss',
	    min: '1990-06-16 23:59:59', //设定最小日期为当前日期
	    max: '2099-06-16 23:59:59',
	    istime: true,
	    istoday: false,
	    choose: function (data) {
	        //start.max = datas; //结束日选好后，重置开始日的最大日期
	    }
	});*/
	
//页面级的帮助对象集合
page.derive = {
    //获取表单参数包含搜索
    getParams: function (params) {
        params.status = 1;
        params.state = 1;
        params.x = params.offset;//根据后台接口需要替换分页参数
        params.y = params.limit;//根据后台接口需要替换分页参数
        
        if(page.$titleKeyword.val()!=="")params.title = page.$titleKeyword.val(); //搜索值
        if(page.$circleKeyword.val()!=="")params.circle_title = page.$circleKeyword.val(); //搜索值
        if(page.$startTime.val()!=="")params.create_start_time = page.$titleKeyword.val(); //搜索值
        if(page.$endTime.val()!=="")params.create_end_time = page.$endTime.val(); //搜索值
        
        return params;
    },
    //获取表格参数修改数量
    getNumParams: function (params,elem,newKey) {
       	var id = $(elem).parents('tr').data('uniqueid');
        var row = page.$table.bootstrapTable('getRowByUniqueId',id);
        params.obj_id = row.id;
        params.obj_type = row.obj_type;
        params[newKey] = params.value;
        return params;
    },
    validateNum: function (value) {
        value = $.trim(value);
        var pattern = /^[0-9]*[0-9][0-9]*$/;
        if(value && !pattern.test(value)){
            return '请输入数字！';
        }
    },
    successBack:function(elem,res){	
     	res = $.parseJSON(res);
    	if(res.code == 0){
    		toastr.success('修改成功');
    	}else{
        	toastr.error('修改失败');
    	 	var id = $(elem).parents('tr').data('uniqueid');
    		page.$table.bootstrapTable('updateByUniqueId',id);
    	}
    	
    }
}

//页面所用到AJAX请求的URL
page.CONST = {
    GET_LIST: helper.url.getUrlByMapping("admin/activity/find_activity.shtml"),           //获取全部活动接口
    UPDATE: helper.url.getUrlByMapping("admin/circle/update_circle_related.shtml"),      //设文章状态接口(置顶，精华，删除)                                             //修改密文接口
    REWRITE: helper.url.getUrlByMapping("admin/circle/update_circle_common.shtml"),  //修改文章活动数据(点赞等数量) 
}


//页面事件
page.eventHandler = {
    search: function () {	//搜索
    	page.$table.bootstrapTable('refresh');
    },	
    reset: function(){    //搜索重置
    	$titleKeyword.val("");
    	$circleKeyword.val("");
    	$startTime.val("");
    	$endTime.val("");
    	page.$table.bootstrapTable('refresh');
    },
    //删除圈子文章
    delete: function (elem, value, row, index) {
        swal({
            title: "您确定要删除选中的信息吗？",
            text: row.title,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "删除",
            cancelButtonText:'取消',
            closeOnConfirm: false
        }, function () {
            swal({title: "删除中，请稍候", type: "info", showConfirmButton: false});
            $.ajax({
                url: page.CONST.UPDATE,
                type: 'POST',
                data: {
                	obj_id: row.id,
                	obj_type: row.obj_type,
                    status: 2
                },
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                        swal({title:"删除成功", text: "1s后自动消失...", type: "success", timer: 1000});
                        page.$table.bootstrapTable('removeByUniqueId', row.id);    
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
    //设置精华
    setGood: function (elem, value, row, index) {
    	$(elem).attr('disabled', true);
    	if(row.is_good ===0){
    		$.ajax({
                url: page.CONST.UPDATE,
                type : 'POST',
                data: {
           	 		obj_id: row.id,
           	 		obj_type: row.obj_type,
           	 		is_good: 1
                },
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                    	row.is_good = 1;
                    	page.$table.bootstrapTable('updateRow', {index: index, row: row});
                      	$(elem).text('取消精华').removeClass('btn-outline');
                    	toastr.success('设置精华成功');
                    }else{
                    	toastr.error(ret.errMsg);
                    }
                    $(elem).attr('disabled', false);
                },
                error:function(ret) {
                	toastr.error('设置精华失败');
                    $(elem).attr('disabled', false);
                }
            });
    	}else{
    		$.ajax({
                url: page.CONST.UPDATE,
                type : 'POST',
                data: {
           	 		obj_id: row.id,
           	 		obj_type: row.obj_type,
           	 		is_good: 0
                },
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                    	row.is_good = 0;
                    	page.$table.bootstrapTable('updateRow', {index: index, row: row});
                    	$(elem).text('设为精华').addClass('btn-outline');
                    	toastr.success('取消精华成功');
                    }else{
                    	toastr.error(ret.errMsg);
                    }
                    $(elem).attr('disabled', false);
                },
                error:function(ret) {
                	toastr.error('取消精华失败');
                    $(elem).attr('disabled', false);
                }
            });
    	} 
    }
}
page.$table.bootstrapTable({	
    detailView: false,
   // classes: 'table table-hover table-no-bordered',
    buttonsClass: 'default btn-outline',
    url: page.CONST.GET_LIST,  //AJAX读取列表数据的URL
    dataField: "data",//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
    height: 600,//高度
    toolbar:'#tableTools',
    showColumns: true,
    showRefresh: true,
    pagination: true,//是否分页
    pageSize: 20,//单页记录数
    pageList: [20,60,100],//分页步进值
    sidePagination: "server",//服务端分页
    contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
    dataType: "json",//期待返回数据类型
    method: "get",//请求方式
    uniqueId: 'id',
    undefinedText: "—",//为空的填充字符
    queryParamsType: "limit",//查询参数组织方式
    queryParams: function (params) {
        return page.derive.getParams(params);
    },
    columns: [{
	    field: 'id',
	    title: 'ID',
	    align: 'center'
	}, {
	    field: 'title',
	    title: '标题',
        width: '300px',
	    align: 'center'
	},{
	    field: 'circle_title',
	    title: '圈子',
        width: '200px',
	    align: 'center'
	},{
	    field: 'start_time',
	    title: '开始时间',
        width: '200px',
	    align: 'center',
	    formatter: function(value, row, index){
	        return moment(value).format('YYYY-MM-DD HH:mm:ss');
	    },
	},{
	    field: 'end_time',
	    title: '结束时间',
	     width: '200px',
	    align: 'center',
	    formatter: function(value, row, index){
	        return moment(value).format('YYYY-MM-DD HH:mm:ss');
	    },
	},{
	    field: 'author_name',
	    title: '发布人',
	     width: '100px',
	    align: 'center',
	},{
	    field: 'create_time',
	    title: '发布时间',
	     width: '200px',
	    align: 'center',
	    formatter: function(value, row, index){
	        return moment(value).format('YYYY-MM-DD HH:mm:ss');
	    },
	},{
	    field: 'is_start',
	    title: '状态',
	    align: 'center',
	    formatter: function(value, row, index){
	        return moment(value).format('YYYY-MM-DD HH:mm:ss');
	    }
	},{
	    field: 'comment_count',
	    title: '评论数',
	    align: 'center'
	},{
	    field: 'share_count',
	    title: '分享数',
	    align: 'center'
	},{
	    field: 'zan_count',
	    title: '点赞数',
	    align: 'center'
	},{
	    field: 'favorite_count',
	    title: '收藏数',
	    align: 'center'
	},{
	    field: 'visit_times_count',
	    title: 'PV',
	    align: 'center'
	},{
	    field: 'visit_people_count',
	    title: 'UV',
	    align: 'center'
	},{
	    field: 'visit_people_count',
	    title: '关注数',
	    align: 'center'
	},{
	    field: 'comment_count_all',
	    title: '显示评论数',
	    align: 'center',
	    editable: {
            type: 'text',
            title: '修改评论数',
            emptytext: '0',
            params: function(params) {
                return page.derive.getNumParams(params,this,'comment_count_all');
            },
            url: page.CONST.REWRITE, //修改后发送的地址
            mode: 'popup',
           // inputclass: 'input-booksort',
            success: function(res, newValue) {
            	page.derive.successBack(this,res);
            },
            validate: function (value) {
                return page.derive.validateNum(value);
            }
        }
	},{
	    field: 'share_count_all',
	    title: '显示分享数',
	    align: 'center',
        editable: {
            type: 'text',
            title: '修改分享数',
            emptytext: '0',
            params: function(params) {
                return page.derive.getNumParams(params,this,'share_count_all');
            },
            url: page.CONST.REWRITE, //修改后发送的地址
            mode: 'popup',
            success: function(res, newValue) {
            	page.derive.successBack(this,res);
            },
            validate: function (value) {
                return page.derive.validateNum(value);
            }
        }
	},{
	    field: 'zan_count_all',
	    title: '显示点赞数',
	    align: 'center',
        editable: {
            type: 'text',
            title: '修改点赞数',
            emptytext: '0',
            params: function(params) {
                return page.derive.getNumParams(params,this,'zan_count_all');
            },
            url: page.CONST.REWRITE, //修改后发送的地址
            mode: 'popup',
            success: function(res, newValue) {
            	page.derive.successBack(this,res);
            },
            validate: function (value) {
                return page.derive.validateNum(value);
            }
        }
	},{
	    field: 'favorite_count_all',
	    title: '显示收藏数',
	    align: 'center',
        editable: {
            type: 'text',
            title: '修改收藏数',
            emptytext: '0',
            params: function(params) {
                return page.derive.getNumParams(params,this,'favorite_count_all');
            },
            url: page.CONST.REWRITE, //修改后发送的地址
            mode: 'popup',
            success: function(res, newValue) {
            	page.derive.successBack(this,res);
            },
            validate: function (value) {
                return page.derive.validateNum(value);
            }
        }
	},{
	    field: 'view_times_count_all',
	    title: '显示点击数',
	    align: 'center',
        editable: {
            type: 'text',
            title: '修改显示点击数数',
            emptytext: '0',
            params: function(params) {
                return page.derive.getNumParams(params,this,'view_times_count_all');
            },
            url: page.CONST.REWRITE, //修改后发送的地址
            mode: 'popup',
            success: function(res, newValue) {
            	page.derive.successBack(this,res);
            },
            validate: function (value) {
                return page.derive.validateNum(value);
            }
        }
	},{
	    field: 'view_people_count_all',
	    title: '显示点击用户数',
	    align: 'center',
        editable: {
            type: 'text',
            title: '修改显示UV数',
            emptytext: '0',
            params: function(params) {
                return page.derive.getNumParams(params,this,'view_people_count_all');
            },
            url: page.CONST.REWRITE, //修改后发送的地址
            mode: 'popup',
            success: function(res, newValue) {
            	page.derive.successBack(this,res);
            },
            validate: function (value) {
                return page.derive.validateNum(value);
            }
        }
	},{
        title: '操作',
        align: 'center',
        width:'300px',
        formatter: function(value, row, index){	
        	var strHtml;
            strHtml =  ' <a class="btn btn-sm btn-primary" onclick="window.parent.openFrm(this)" data-index="CMcircleActivityEdit.shtml?page_id='+ row.id +'" data-title="'+row.title+'-活动">编辑</a>'+
			            ' <button type="button" class="live btn btn-sm btn-warning" onclick="window.parent.openFrm(this)"' +
                        ' data-index="CMcircleActivityLive.shtml?page_id='+ row.id +'&page_title='+row.title+'" data-title="'+row.title+'-的直播">直播</button>'+
                        ' <button type="button" class="btn btn-sm btn-outline btn-default" onclick="window.parent.openFrm(this)" data-title="'+row.title+'-评论管理" data-index="commentindex.shtml?obj_id='+row.id+'&obj_type='+row.obj_type+'">评论管理</button>'+
			            ' <button type="button" class="push btn btn-sm btn-primary">再次推送</button>';    
		    strHtml += row.is_good===0?' <button type="button" class="setGood btn btn-sm btn-outline btn-warning">设为精华</button>':
	   			       	' <button type="button" class="setGood btn btn-sm btn-warning">取消精华</button>';
						' <button type="button" class="cancel btn btn-sm btn-warning">取消发布</button>';
		    strHtml +=  ' <button type="button" class="del btn btn-sm btn-danger">删除</button>';
		    return strHtml;
        },
        events: {
        		//浓缩就是精华
	          'click .setGood': function(e, value, row, index){
	        	  page.eventHandler.setGood(this, value, row, index)
	          },
	          //删除
	          'click .del': function(e, value, row, index){
	        	  page.eventHandler.delete(this, value, row, index)
	          }
	      }
    }]
});