//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastr', 'datetimepicker', 'table', 'tableEditable'], function (bs, $, helper, swal, layer, toastr) {
//存储页面table对象
page.$table = $('#tableList');
	page.$keywordTitle = $('#keywordTitle');//搜索框标题
	page.$keywordContent = $('#keywordContent');//搜索框内容
//页面级的帮助对象集合
page.derive = {
    //获取表单参数包含搜索
    getParams: function (params) {
        params.status = 1;
        params.circle_id = pageId;//页面传入时的id
        params.x = params.offset;//根据后台接口需要替换分页参数
        params.y = params.limit;//根据后台接口需要替换分页参数
        params.start_time = helper.convert.formatTimestamp($("#start_time").val());
        params.end_time = helper.convert.formatTimestamp($("#end_time").val(), {day: 1});
        params.keyword = $("#keyword").val();
        return params;
    },
    //取消再次推送
    cancelPush: function () {
        layer.closeAll();
    },
    //推送
    doPush: function (id, type) {
    	var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
    	console.log(rowDate);
        var data = {
    		id: id,
            extra: page.getCommentInfo(rowDate),
		    obj_id: id,
		    obj_type: 28,
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
        $.ajax({
            url: page.CONST.PUSH,
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
    },    
    //类型转换
    setType: function (type) {
		var iType = +type;
		var typeStr = '【'
		switch (iType) {
		    case 1: typeStr += '早茶';break;
		    case 2: typeStr +=  '秘闻';break;
		    case 3: typeStr +=  '大咖';break;
		    case 4: typeStr +=  '活动';break;
		    case 5: typeStr +=  '话题';break;
		    case 6: typeStr +=  '专题';break;
		    case 7: typeStr +=  '江湖事';break;
		    case 8: typeStr +=  '榜样';break;
		    case 9: typeStr +=  '工商联新闻';break;
		    case 10: typeStr +=  '招商项目';break;
		    case 11: typeStr +=  '圈子';break;
		    case 12: typeStr +=  '用户动态';break;
		    case 13: typeStr +=  '商会资讯';break;
		    case 14: typeStr +=  '商会通知';break;
		    case 15: typeStr +=  '评论';break;
		    case 16: typeStr +=  '关注';break;
		    case 17: typeStr +=  '招商单位';break;
		    case 18: typeStr +=  '圈子问答';break;
		    case 19: typeStr +=  '圈子资讯';break;
		    case 20: typeStr +=  '外链';break;
		    case 21: typeStr +=  '大咖观点';break;
		    case 22: typeStr +=  '信息流';break;
		    case 23: typeStr +=  '我的消息';break;
		    case 24: typeStr +=  '分享名片';break;
		    case 25: typeStr +=  '分享商帮帮';break;
		    case 26: typeStr +=  '用户动态-点赞';break;
		    case 27: typeStr +=  '用户动态-关注';break;
		    case 28: typeStr +=  '用户动态-评论';break;
		    case 29: typeStr +=  '用户动态-大咖发表观点';break;
		    case 30: typeStr +=  '用户动态-活动发表分享';break;
		    case 31: typeStr +=  '用户动态-圈子发布帮帮';break;
		    case 32: typeStr +=  '用户动态-圈子发布活动';break;
		    case 33: typeStr +=  '用户动态-圈子发布话题';break;
		    case 34: typeStr +=  '用户动态-圈子发布帖子';break;
		    case 35: typeStr +=  '参与活动分享';break;
		    case 36:typeStr +=  '参与话题讨论';break;
		    default: typeStr +=  '其他';
		}
		typeStr += '】';
		return typeStr;
}
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
//页面所用到AJAX请求的URL
page.CONST = {
    GET_LIST: helper.url.getUrlByMapping("admin/common/find_comment.shtml"),     	//获取圈子的评论列表
    HANDLE_URL: helper.url.getUrlByMapping("admin/commentwait.shtml"),        		//代发评论url
    PUSH: helper.url.getUrlByMapping("admin/common/commont_push.shtml"),                                //推送
    UPDATE: helper.url.getUrlByMapping("admin/common/update_comment.shtml"),       //设置评论状态接口(置顶，精华，删除) 

}

//页面事件
page.eventHandler = {
	//代发评论
	showAdd: function () {
		helper.win.open({name: "代发评论", url: page.CONST.HANDLE_URL});
	},
	//搜索
    search: function () {
    	page.$table.bootstrapTable('refresh');
    },	
    //搜索重置
    reset: function(){
    	page.$keyword.val("");
    	page.$table.bootstrapTable('refresh');
    },    
    //推送
    pushComment: function (id) {
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        console.log(rowDate);
        console.log(/.+(\.mp3)$/i.test(rowDate.voice));
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
        	+ '<div class="form-group"><label class="col-sm-2 control-label">标题：</label><div class="col-sm-10"><span style="line-height:34px">【'+ (helper.obj.getObjLabel(rowDate.obj_type)+ '】' + rowDate.title)+'</span></div></div>'
        	+ '<div class="form-group"><label class="col-sm-2 control-label">评论内容：</label><div class="col-sm-10"><span style="line-height:34px">' + content + '</span></div></div>'
            + translate
        	+ '</div><hr/>'
            + '<div id="divPushAgain"></div>'
            + '<div class="row m-t-lg">'
            + '<div class="col-md-offset-3 col-md-3"><button class="btn btn-primary btn-block btn-lg" onclick="page.derive.doPush({id})"><i class="glyphicon glyphicon-ok"></i>&nbsp;&nbsp;确认推送</button></div>'
            + '<div class="col-md-3"><button class="btn btn-default btn-block btn-lg" onclick="page.derive.cancelPush()"><i class="glyphicon glyphicon-remove"></i>&nbsp;&nbsp;取消推送</button></div>'
            + '</div></div>';

        layer.open({
            type: 1,
            title: '<span class="label label-warning">评论推送<span>'.Format(rowDate.title),
            skin: 'layui-layer-rim', //加上边框
            area: ['95%', '95%'],   //宽高
            scrollbar: false,
            content: template.Format({id: id})
        });
        page.feedPush = new module.push.feed({
            container: '#divPushAgain',
            defaultPush: {selected: 1, value: module.push.pushEnum.none}
        });
    },
  //删除评论
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
                    id: row.id,
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
                	id: row.id,
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

};
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
    pageList: [10,20,50,100],//分页步进值
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
    columns: [ {
        field: 'content',
        title: '评论内容',
        width: '300px',
        align: 'left',
        formatter: function(value, row, index){
        	return row.is_voice === 0? 
    			   value: 
				   '<audio controls>'+
        			  '<source src="'+row.voice+'?avthumb/mp3" type="audio/mp3">'+
    			  '</audio>';
    	}
    }, {
        field: 'title',
        title: '标题',
        width: '100px',
        align: 'center'
    }, {
        field: 'obj_type',
        title: '类型',
        width: '100px',
        align: 'center',
    	formatter: function(value){
    		switch(value){
    			case 4: return "活动";break;
    			case 5: return "话题";break;
    			case 18: return "帮助";break;
    			case 19: return "帖子";break;
    			default: return "";
    		}
    	}
    }, {
        field: 'reply_user_name',
        title: '回复对象',
        width: '100px',
        align: 'center'
    }, {
        field: 'user_name',
        title: '评论人',
        width: '100px',
        align: 'center'
    }, {
        field: 'create_time',
        title: '评论时间',
        width: '150px',
        align: 'center',
        formatter: function(value, row, index){
            return helper.convert.formatDate(value);
        },
    }, {
        field: 'zan_count',
        title: '点赞数',
        width: '80px',
        align: 'center'
    }, {
        field: 'zan_count_all',
        title: '显示点赞数',
        width: '80px',
        align: 'center',
        editable: {
            type: 'text',
            title: '修改点赞数',
            emptytext: '0',
            params: function(params) {
            	var id = $(this).parents('tr').data('uniqueid');
                var row = page.$table.bootstrapTable('getRowByUniqueId',id);
                params.id = row.id;
                params.obj_id = row.obj_id;
                params.user_id = row.user_id;
                params.obj_type = row.obj_type;
                params.old_zan_count_all = $(this).data('value');
                params.zan_count_all = params.value;
                var temp = row;
                temp.user = {};
                temp.user.id = row.user_id;
                temp.user.avatar = row.user_avatar||'';  
                temp.user_identity = row.user_identity
                temp.user.name = row.user_name;  
                temp.user.v = row.user_v;
                params.extra = JSON.stringify(temp); 
                
                
                return params;
            },
            url: page.CONST.UPDATE, //修改后发送的地址
            mode: 'popup',
           // inputclass: 'input-booksort',
            success: function(res, newValue) {
            	res = $.parseJSON(res);
            	if(res.code == 0){
            		toastr.success('修改点赞数量成功');
            	}else{
                	toastr.error('修改点赞数量失败');
            	 	var id = $(this).parents('tr').data('uniqueid');
            		page.$table.bootstrapTable('updateByUniqueId',id);
            	}
            },
            validate: function (value) {
                value = $.trim(value);
                var pattern = /^[0-9]*[0-9][0-9]*$/;
                if(value && !pattern.test(value)){
                    return '请输入数字！';
                }
            }
        }
    }, {
        title: '操作',
        align: 'center',
        width: '200px',
        formatter:function(value, row, index){	      
            var strHtml = row.is_good===0?
            		       ' <button type="button" class="setGood btn btn-sm btn-outline btn-warning">设为精华</button>':
						   ' <button type="button" class="setGood btn btn-sm btn-warning">取消精华</button>';
            	strHtml += ' <button type="button" class="btn btn-sm btn-primary" onclick="page.eventHandler.pushComment(' + row.id + ')">推送</button>'+
				           ' <button type="button" class="del btn btn-sm btn-danger">删除</button>';
				return strHtml;
        },
        events: {
	          //精华
	          'click .setGood': function(e, value, row, index){
	        	  page.eventHandler.setGood(this, value, row, index)
	          },
	          //推送
	          'click .push': function(e, value, row, index){
	        	  page.eventHandler.push(this, value, row, index)
	          },
	          //删除
	          'click .del': function(e, value, row, index){
	        	  page.eventHandler.delete(this, value, row, index)
	          }
	      }
    }]
});
//绑定回车查询
$("#keyword").keyup(function (event) {
    if (event.keyCode == 13)
        page.eventHandler.search();
});

//代发评论操作
$("#btnAdd").click(page.eventHandler.showAdd);

});











