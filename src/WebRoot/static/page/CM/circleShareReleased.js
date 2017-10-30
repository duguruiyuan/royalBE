//初始化页面对象
var page = {};

//页面静态变量
page.CONST = {
    GET_LIST: helper.url.getUrlByMapping("admin/circle_share/find_share_list.shtml"),      //获取全部帮助接口
    UPDATE: helper.url.getUrlByMapping("admin/circle/update_circle_related.shtml"),  //设置文章状态接口(置顶，精华，删除) 
    REWRITE: helper.url.getUrlByMapping("admin/circle/update_circle_common.shtml"),  //修改文章活动数据(点赞等数量) 
    
}
//页面变量
page.VALUE = {
}

//拼接extra
page.getCommentInfo =function (data) {
	var arr = [],userArr = [];
	userArr.push('"id":"'+data.user_id+'"');
	userArr.push('"avatar":"'+data.user_avatar+'"');
	userArr.push('"name":"'+data.user_name+'"');
	userArr.push('"v":"'+data.user_v+'"');
	userArr.push('"identity":"'+data.user_identity+'"');
	arr.push('"obj_id":"'+data.obj_id+'"');
	arr.push('"title":"'+data.title+'"');
	arr.push('"obj_type":"'+data.obj_type+'"');
	arr.push('"user":[{'+userArr.join(",")+'}]');
	return '{'+arr.join(",")+'}';
}

//存储页面table对象
page.$table = $('#tableList');
	page.$circleKeyword = $('#circleKeyword');//圈子关键字
	page.$titleKeyword = $('#titleKeyword');//标题关键字
	page.$creatStartTime = $('#startTime');//圈子关键字
	page.$createEndTime = $('#endTime');//标题关键字
	
//页面级的帮助对象集合
page.derive = {
    //获取表单参数包含搜索
    getParams: function (params) {
        params.status = 1;
        params.state = 1;
        params.x = params.offset;//根据后台接口需要替换分页参数
        params.y = params.limit;//根据后台接口需要替换分页参数
        if(page.$creatStartTime.val()!=="")params.create_Start_time =page.$creatStartTime.val();//搜索值
        if(page.$createEndTime.val()!=="")params.create_end_time =page.$createEndTime.val();//搜索值
        if(page.$titleKeyword.val()!=="")params.title =page.$titleKeyword.val();//标题搜索值
        if(page.$circleKeyword.val()!=="")params.circle_title =page.$circleKeyword.val();//标题搜索值
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



//页面事件
page.eventHandler = {
	//搜索
    search: function () {
    	page.$table.bootstrapTable('refresh');
    },	
    //搜索重置
    reset: function(){
    	page.$creatStartTime.val("");
    	page.$creatEndTime.val("");
    	page.$titleKeyword.val("");
      	page.$circleKeyword.val("");
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
	           	 		obj_id: row.obj_id,
	           	 		obj_type: row.obj_type,
	           	 		id: row.id,
	           	 		is_good: 1,
	                    extra: page.getCommentInfo(row),
	           	 		user_id: row.user_id,
	       			    title: row.title,
	       			    summary: row.content
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
    },
    setCount: function(){    //修改数量
    	$.ajax({
            url: page.CONST.REWRITE,
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
//初始化表格
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
        title: '标题/内容',
        align: 'center',
    }, {
        field: 'circle_title',
        title: '圈子',
        align: 'center'
    }, {
        field: 'author_name',
        title: '发布人',
        align: 'center'
    },  {
        field: 'create_time',
        title: '发布时间',
        align: 'center',
        formatter: function(value, row, index){
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
        },
    }, {
        field: 'comment_count',
        title: '评论数',
        align: 'center'
    }, {
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
    }, {
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
        field: 'share_count_all',
        title: '显示分享数',
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
            title: '修改显示点击数',
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
            title: '修改显示点击用户数',
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
        formatter:function(value, row, index){	
            var strHtml =  ' <a class="btn btn-sm btn-primary" onclick="window.parent.openFrm(this)" data-index="CMcircleHelpDetail.shtml?page_type=0&page_id='+ row.id +'" data-title="'+row.title+'-帮助">查看</a>';
                strHtml += ' <button type="button" class="btn btn-sm btn-outline btn-default" onclick="window.parent.openFrm(this)" data-title="'+row.title+'-评论管理" data-index="commentindex.shtml?obj_id='+row.id+'&obj_type='+row.obj_type+'">评论管理</button>';
           		strHtml += ' <button class="btn btn-sm btn-primary">推送</button>';
                strHtml += row.is_good===0?' <button type="button" class="setGood btn btn-sm btn-outline btn-warning">设为精华</button>':
                						   ' <button type="button" class="setGood btn btn-sm btn-warning">取消精华</button>';
                strHtml+= ' <button type="button" class="del btn btn-sm btn-danger">删除</button>';
                return strHtml;
        },
        events: {
    		//精华
            'click .setGood':function (e, value, row, index) { 
            	page.eventHandler.setGood(this, value, row, index)
            },
            //删除
            'click .del': function (e, value, row, index) {
            	page.eventHandler.delete(this, value, row, index)     
            }
        }
    }]
});