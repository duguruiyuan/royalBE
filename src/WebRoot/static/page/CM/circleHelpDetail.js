//初始化页面对象
var page = {};

//页面静态变量
page.CONST = {
	GET_DETAIL:	helper.url.getUrlByMapping("admin/circle/find_question_detail.shtml"),  //获取详情接口
    UPDATE: helper.url.getUrlByMapping("admin/circle/update_circle_related.shtml"),  //设置文章状态接口(置顶，精华，删除) 
    REWRITE: helper.url.getUrlByMapping("admin/circle/update_circle_common.shtml"),  //修改文章活动数据(点赞等数量) 
    
}
//页面变量
page.VALUE = {
}

//存储页面table对象
	page.$title = $('h1');
	page.$circleName = $('#circleName');
	page.$createTime = $('#createTime');
	page.$content = $('#articleContent');
	//page.$image = $('');
	page.$recover = $('#recover'); //草稿箱操作按钮
	
//页面级的帮助对象集合
page.derive = {

}

//页面事件
page.eventHandler = {
	initPage: function(){
		 console.log(pageId)
		 console.log(pageType)
		 if(pageType === 1)page.$recover.show();
		 console.log(1)
		 $.ajax({
             url: page.CONST.GET_DETAIL,
             type: 'GET',
             data: {
            	 	id: pageId
             },
             dataType : 'json',
             success : function(res) {
                 if(res.code == 0){
                	 page.$title.text(res.data.title);
                	 page.$content.html(res.data.content);
                	 page.$circleName.text(res.data.content);
                	 page.$createTime.text(moment(res.data.create_time).format('YYYY-MM-DD HH:mm:ss'));
                 }else{
                     swal("获取内容失败", res.errMsg, "error");
                 }
             },
             error:function(ret) {
                 swal("获取内容失败", "error");
             }
         });
	},
    //恢复圈子文章
	   recover: function () {    //删除圈子文章
	        swal({
	            title: "您确定要删除选中的信息吗？",
	            text: row.title,
	            type: "warning",
	            showCancelButton: true,
	            confirmButtonColor: "#18a689",
	            confirmButtonText: "恢复",
	            cancelButtonText:'取消',
	            closeOnConfirm: false
	        }, function () {
	            swal({title: "恢复中，请稍候", type: "info", showConfirmButton: false});
	            $.ajax({
	                url: page.ajaxUrl.UPDATE,
	                type: 'POST',
	                data: {
	                	obj_id: pageId,
	                	obj_type: 18,
	                    status: 1
	                },
	                dataType : 'json',
	                success : function(ret) {
	                    if(ret.code == 0){
	                        swal({title:"恢复成功", text: "1s后自动消失...", type: "success", timer: 1000});
	                    }else{
	                        swal("恢复失败", ret.errMsg, "error");
	                    }
	                },
	                error:function(ret) {
	                    swal("恢复失败", "error");
	                }
	            });
	        });   
	    }
	} 

page.eventHandler.initPage();