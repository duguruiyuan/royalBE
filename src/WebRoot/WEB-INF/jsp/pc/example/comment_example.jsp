<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>评论管理</title>
    <link rel="<%=basePath%>shortcut icon" href="favicon.ico"> 
    <link href="<%=basePath%>css/public.min.css" rel="stylesheet">
    <link href="<%=basePath%>css/bootstrap.min.css" rel="stylesheet">
    <!-- Sweet Alert -->
    <link href="<%=basePath%>css/plugins/sweetalert/sweetalert.css" rel="stylesheet">
</head>
<body>
    <div class="row top-warpper">
      <form action="" method="get">

        <div class="col-md-5 col-md-offset-2">
          <div class="select-title">评论日期：</div>
          <div class="select-warpper">
            <input placeholder="开始日期" name="start_time" class="form-control layer-date" id="start">
            <input placeholder="结束日期" name="end_time" class="form-control layer-date" id="end">
          </div>
        </div>
        
        <div class="col-md-2">
          <div class="select-title">标题：</div>
          <div class="select-warpper">
            <input type="text" class="form-control" name="title" placeholder="请输入标题" />
          </div>
        </div>
        
        <div class="col-md-2">
          <div class="select-title">评论内容：</div>
          <div class="select-warpper">
            <input type="text" class="form-control" name="title" placeholder="请输入评论内容" />
          </div>
        </div>
        
        <div class="col-md-1">
          <button class="btn btn-white" type="submit">搜索</button>
        </div>
      </form>
    </div>
    <div>
      <table id="table"></table>
    </div>
    <div class="modal inmodal fade" id="see-moda" tabindex="-1" role="dialog"  aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title">查看评论</h4>
                </div>
                <div class="modal-body">
                    <div class="" id="content-warpper"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal inmodal fade" id="upload-moda" tabindex="-1" role="dialog"  aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title">修改评论</h4>
                </div>
                <div class="modal-body">
                    <textarea id="upload-content-warpper" class="form-control" rows="3"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
                    <button type="button" class="btn btn-primary" id="upload_comment">保存</button>
                </div>
            </div>
        </div>
    </div>
</body>
<script src="<%=basePath%>js/jquery.min.js"></script>
<script src="<%=basePath%>js/bootstrap.min.js"></script>
<script src="<%=basePath%>js/plugins/layer/laydate/laydate.js"></script>
<script src="<%=basePath%>js/public.js"></script>
<!-- Bootstrap table -->
<script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table.min.js"></script>
<script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table-mobile.min.js"></script>
<script src="<%=basePath%>js/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
<!-- Sweet alert -->
<script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>
<script type="text/javascript">
//设为精华
$('#table').on('click','.set-good',function(){
	 var _id = $(this).attr('data-id');
     swal({
    	 title: "您确定要这条评论设置为精彩评论吗",
         type: "warning",
         showCancelButton: true,
         confirmButtonColor: "#DD6B55",
         confirmButtonText: "确定	",
         closeOnConfirm: false
     },function(){
    	 $.ajax({
    		 url: '<%=basePath%>admin/common/update_comment.shtml',
    		 data: {
    			 id: _id,
    			 is_good: 1
    		 },
    		 type: 'post',
    		 dataType: 'json',
    		 success: function (res) {
    			 if(res.code == 0){
    				 swal({
    					 title: '设置成功',
    					 type: 'success'
    				 },function(){
    					 location.reload();
    				 });
    			 }else if(res.code == 1){
    				 swal('设置失败',res.errMsg,'error');
    			 }
    		 },
    		 error: function (xhr) {
    			 console.log(xhr);
    		 }
    	 });
     });
});
//取消精华
$('#table').on('click','.cancel-good',function(){
	 var _id = $(this).attr('data-id');
     swal({
    	 title: "您确定要将这条评论取消精华吗",
         type: "warning",
         showCancelButton: true,
         confirmButtonColor: "#DD6B55",
         confirmButtonText: "确定	",
         closeOnConfirm: false
     },function(){
    	 $.ajax({
    		 url: '<%=basePath%>admin/common/update_comment.shtml',
    		 data: {
    			 id: _id,
    			 is_good: 0
    		 },
    		 type: 'post',
    		 dataType: 'json',
    		 success: function (res) {
    			 if(res.code == 0){
    				 swal({
    					 title: '取消成功',
    					 type: 'success'
    				 },function(){
    					 location.reload();
    				 });
    			 }else if(res.code == 1){
    				 swal('取消失败',res.errMsg,'error');
    			 }
    		 },
    		 error: function (xhr) {
    			 console.log(xhr);
    		 }
    	 });
     });
});
//查看翻译
var commentDom = $('#content-warpper')
$('#table').on('click','.see-btn',function(){
	var _content = $(this).parents('tr').find('td:first').html();
	if(_content == '-') _content = '暂无翻译';
	commentDom.html(_content);
});
//修改翻译
var uploadCommentDom = $('#upload-content-warpper');
var upload_comment_btn = $('#upload_comment');
$('#table').on('click','.upload-btn',function(){
	var _content = $(this).parents('tr').find('td:first').html();
	if(_content == '-') _content = '';
	uploadCommentDom.val(_content);
	upload_comment_btn.attr('data-id',$(this).attr('data-id'));
});
$('#upload_comment').on('click',function(){
	var _id = $(this).attr('data-id');
	if(!_id){
		$('#upload-moda').modal('hide');
		return;
	}
	$.ajax({
		url: '<%=basePath%>admin/common/update_comment.shtml',
		data: {
			id: _id,
			content: uploadCommentDom.val()
		},
		type: 'post',
		dataType: 'json',
		success: function(res){
			if(res.code == 0){
				$('#upload-moda').modal('hide');
				swal({
					title: '删除成功',
					type: 'success'
				},function(){
					location.reload();
				});
			}else{
				console.log('失败');
			}
		},
		error: function(xhr){
			console.log(xhr);
		}
	})
	$('#upload-moda').modal('hide');
});
//删除
$('#table').on('click','.delete-btn',function(){
	var _id = $(this).attr('data-id');
	swal({
		title: "您确定要删除该翻译吗",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定	",
        closeOnConfirm: false
	},function(){
		$.ajax({
			url: '<%=basePath%>admin/common/delete_comment_content.shtml',
			data: {
				id: _id
			},
			type: 'post',
			dataType: 'json',
			success: function(res){
				if(res.code == 0){
					swal({
						title: '删除成功',
						type: 'success'
					},function(){
						location.reload();
					});
				}else if(res.code == 1){
					swal('删除失败',res.errMsg,'error');
				}
			},
			error: function(xhr){
				console.log(xhr);
			}
		});
	});
})
//日期范围限制
var start = {
    elem: '#start',
    format: 'YYYY/MM/DD hh:mm:ss',
    min: laydate.now(), //设定最小日期为当前日期
    max: '2099-06-16 23:59:59', //最大日期
    istime: true,
    istoday: false,
    choose: function (datas) {
        end.min = datas; //开始日选好后，重置结束日的最小日期
        end.start = datas //将结束日的初始值设定为开始日
    }
};
var end = {
    elem: '#end',
    format: 'YYYY/MM/DD hh:mm:ss',
    min: laydate.now(),
    max: '2099-06-16 23:59:59',
    istime: true,
    istoday: false,
    choose: function (datas) {
        start.max = datas; //结束日选好后，重置开始日的最大日期
    }
};
laydate(start);
laydate(end);
$('#table').bootstrapTable({
	url: '<%=basePath%>admin/common/find_comment.shtml?status=1'+getUrlDataOther(location.search),
	method: 'post',
    striped:　true,          //是否会有隔行变色效果
    pagination: true,    //是否会在表格底部显示分页条
    pageNumber:　1,
    pageSize: 10,
    sidePagination: "server",//服务端分页
    dataField: "data",//服务端返回数据键值 就是说记录放的键值是data，分页时使用总记录数的键值为total
    queryParamsType: "y",//查询参数组织方式
    contentType: "application/x-www-form-urlencoded",
    dataType: 'json',           //服务器返回的数据类型
    pageList: [10,20,50,100],
    undefinedText: '-',//为空的填充字符
    columns: [{
    	field: 'content',
    	title: '评论内容',
    	align: 'center'
    },{
    	field: 'title',
    	title: '标题',
    	align: 'center'
    },{
    	field: 'is_voice',
    	title: '翻译',
    	formatter: function (value, data) {
    		switch(value){
    		    case 1: return '<a href="javascript:;" class="see-btn" data-toggle="modal" data-target="#see-moda" data-id="'+data.id+'">查看</a> <a href="javascript:;" class="upload-btn" data-toggle="modal" data-target="#upload-moda" data-id="'+data.id+'">修改</a> <a href="javascript:;" class="delete-btn" data-id="'+data.id+'">删除</a>';
    		    //case 0: return '<a href="javascript:;" class="upload-btn" data-toggle="modal" data-target="#upload-moda" data-id="'+data.id+'">新增</a>';
    		    case 0: return '-';
    		    default: return '-';
    		}
    	},
    	align: 'center'
    },{
    	field: 'reply_user_name',
    	title: '回复对象',
    	align: 'center'
    },{
    	field: 'user_name',
    	title: '评论人',
    	align: 'center'
    },{
    	field: 'create_time',
    	title: '评论时间',
    	formatter: function(value){
    		return formatDate(value);
    	},
    	align: 'center'
    },{
    	field: 'zan_count',
    	title: '点赞数',
    	align: 'center'
    },{
    	field: 'zan_count_all',
    	title: '显示点赞数',
    	align: 'center'
    },{
    	field: 'is_good',
    	title: '是否精华',
    	formatter: function(value){
    		switch(value){
    		    case 0: return '否';
    		    case 1: return '是';
    		    default: return '-';
    		}
    	},
    	align: 'center'
    },{
    	field: 'id',
    	title: '操作',
    	formatter: function(value, data){
    		var str = '';
    		if(data.is_good == 0){
    			str += '<a href="javascript:;" class="set-good" data-id="'+value+'">设为精华</a>'
    		}else{
    			str += '<a href="javascript:;" class="cancel-good" data-id="'+value+'">取消精华</a>'
    		}
    		str += ' <a href="javascript:;" class="push-comment" data-id="'+value+'">推送</a> <a href="javascript:;" class="delete-comment" data-id="'+value+'">删除</a>'
    		return str;
    	},
    	align: 'center'
    }]
});
</script>
</html>