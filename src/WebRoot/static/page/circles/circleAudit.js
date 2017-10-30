//初始化页面对象
var page = {};

//存储页面table对象
page.$circleLogo = $('#circleLogo');
page.$circleName = $('#circleName');
page.$master = $('#master');
page.$members = $('#members');
page.$circleRules = $('#circleRules');
page.$circleBrief = $('#circleBrief');
page.$circleDes = $('#circleDes');

page.$auditOpinion = $('#auditOpinion');

page.$auditPass = $('#auditPass');
page.$auditReject = $('#auditReject');
//页面级的帮助对象集合
page.derive = {
    //获取表单参数包含搜索

}

//页面所用到AJAX请求的URL
page.ajaxUrl = {
    GET_DETAIL: helper.url.getUrlByMapping("admin/circle/find_circle_detail.shtml"),        //获取圈子详情接口
    AUDIT: helper.url.getUrlByMapping("admin/circle/audit_circle.shtml"),                 //审核接口     
}

//页面事件
page.eventHandler = {
    initPage: function () {  //圈子内容管理
    	  $.ajax({
              url: page.ajaxUrl.GET_DETAIL,
              type: 'GET',
              data: {
              	id: pageId
              },
              dataType : 'json',
              success : function(res) {
            	  console.log(res)
                  if(res.code == 0){
                	  page.$circleLogo.attr('src',res.data.logo);
                	  page.$circleName.text(res.data.title);
                	  page.$master.text(res.data.circle_zhu_name);
                	  var index = 1;
                	  for(var i=0;i <res.data.circleMemberList.length;i++){
                		  if(index === 1){
                			  index++;
                			  page.$members.append('<span class="label label-primary" style="margin-top:5px;margin-right:5px">'+res.data.circleMemberList[i].user_name+'</span>');	    
                		  }else if(index === 2){
                			  index++;
                			  page.$members.append('<span class="label label-warning" style="margin-top:5px;margin-right:5px">'+res.data.circleMemberList[i].user_name+'</span>');
                		  }else if(index === 3){
                			  index++;
                			  page.$members.append('<span class="label label-info" style="margin-top:5px;margin-right:5px">'+res.data.circleMemberList[i].user_name+'</span>');
                		  }else if(index === 4){
                			  index++;
                			  page.$members.append('<span class="label label-danger" style="margin-top:5px;margin-right:5px">'+res.data.circleMemberList[i].user_name+'</span>');
                		  }else if(index === 5){
                			  index=1;
                			  page.$members.append('<span class="label label-success" style="margin-top:5px;margin-right:5px">'+res.data.circleMemberList[i].user_name+'</span>');
                		  }
                	  }
                	
                	  page.$circleRules.text(res.data.rule);
                	  page.$circleBrief.text(res.data.brief);
                	  page.$circleDes.text(res.data.description);
                  }else{
                      swal("删除失败", ret.errMsg, "error");
                  }
              },
              error:function(ret) {
                  swal("删除失败", "error");
              }
          });
    },
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
              url: page.ajaxUrl.AUDIT,
              type: 'POST',
              data: {
              		id: pageId,
              		state: status===0 ? 1:4,
              		audit_opinion: audit_opinion,
      				status: 1
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
    	
    	
        /*swal({
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
                url: page.ajaxUrl.UPDATE,
                type: 'POST',
                data: {
                	id: pageId,
                	state: status===0 ? 1:4,
                    status: 1
                },
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                        swal({title:"操作成功", text: "1s后自动消失...", type: "success", timer: 1000});
                        page.$table.bootstrapTable('removeByUniqueId', row.id);    
                    }else{
                        swal("操作失败", ret.errMsg, "error");
                    }
                },
                error:function(ret) {
                    swal("操作失败", "error");
                }
            });
        });  */ 
    },
};
page.eventHandler.initPage();
