//初始化页面对象
var page = {};

//页面静态变量
page.CONST = {
	GET_DETAIL:	helper.url.getUrlByMapping("admin/circle_share/find_share_detail.shtml"),  //获取详情接口
    AUDIT: helper.url.getUrlByMapping("admin/circle_share/audit_share.shtml"),  //审核
    
}
//页面变量
page.MOCK = {
		
	pushdevice:[]//推送的数据
}

//存储页面table对象
	page.$title = $('h1');
	page.$circleNames = $('#circleNames');//容器
	page.$createTime = $('#createTime');
	page.$content = $('#articleContent');
	page.$auditOpinion = $('#auditOpinion');
   	page.$auditPass = $('#auditPass');
	page.$auditReject = $('#auditReject');
	//page.$image = $('');
	
	
//页面级的帮助对象集合
page.derive = {

}

//页面事件
page.eventHandler = {
	initPage: function(){
	
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
                	 for(var i=0;i<res.data.circleList.length;i++){
                		 
                		 page.$circleNames.append('<span class="label label-primary" style="margin:5px">'+res.data.circleList[i].title+'</span>')
                	 }
                	
                	 page.$createTime.text(moment(res.data.create_time).format('YYYY-MM-DD HH:mm:ss'));
                	 page.MOCK.pushdevice = res.pushdevice;
                 }else{
                     swal("获取内容失败", res.errMsg, "error");
                 }
             },
             error:function(ret) {
                 swal("获取内容失败", "error");
             }
         });
	},
    //审核圈子文章
    audit: function (status) {    //删除圈子文章
    	//status:0通过审核，1不通过
    	var audit_opinion = $.trim(page.$auditOpinion.val());
    	if(status===1&&audit_opinion===""){
    		toastr.warning('审核不通过必须填写审核意见说明不通过原因');  
    		return false;
    	}
    	page.$auditPass.attr('disabled',true);
    	page.$auditReject.attr('disabled',true);
    	
    	  $.ajax({
              url: page.CONST.AUDIT,
              type: 'POST',
              data: {
              		id: pageId,
              		state: status===0 ? 1:4,
              		audit_opinion: audit_opinion,
      				status: 1,
      				//推送字段
      				feed_id: page.MOCK.pushdevice[0].feed_id,
      				feed_info_id: page.MOCK.pushdevice[0].id
              },
              dataType : 'json',
              success : function(ret) {
                  if(ret.code == 0){
                		toastr.success('操作成功');   
                  }else{
                	  toastr.error('操作失败');  
                  }
                  page.$auditPass.attr('disabled',false);
                  page.$auditReject.attr('disabled',false);
              },
              error:function(ret) {
            	  toastr.error('操作失败'); 
            	  page.$auditPass.attr('disabled',false);
            	  page.$auditReject.attr('disabled',false);
              }
          });
	} 
}
page.eventHandler.initPage();