//初始化页面对象
var page = {};

//存储页面table对象
page.$title = $('#title');
page.$circles = $('#circles');
page.$startTime = $('#startTime');
page.$endTime = $('#endTime');
page.$place = $('#place');

page.$guestTable = $('#guestTable');
page.$description = $('#description');

page.$auditOpinion = $('#auditOpinion');

page.$auditPass = $('#auditPass');
page.$auditReject = $('#auditReject');
//页面级的帮助对象集合
page.derive = {
    //获取表单参数包含搜索

}

//页面所用到AJAX请求的URL
page.CONST = {
	GET_DETAIL:	helper.url.getUrlByMapping("admin/activity/find_activity_detail.shtml"),  //获取详情接口
    AUDIT: helper.url.getUrlByMapping("admin/circle/audit_circle.shtml"),                 //审核接口     
}
page.MOCK = {
		pushdevice:	[]   
	}


//页面事件
page.eventHandler = {
    initPage: function () {  //圈子内容管理
    	  $.ajax({
              url: page.CONST.GET_DETAIL,
              type: 'GET',
              data: {
              	id: pageId
              },
              dataType : 'json',
              success : function(res) {
            	  console.log(res)
                  if(res.code == 0){
                	  page.$title.text(res.data.title);
                	  console.log(res.data.title)
                	  var index = 1;
                	  for(var i=0;i <res.data.circleList.length;i++){
                		  if(index === 1){
                			  index++;
                			  page.$circles.append('<span class="label label-primary" style="margin-top:5px;margin-right:5px">'+res.data.circleList[i].title+'</span>');	    
                		  }else if(index === 2){
                			  index++;
                			  page.$circles.append('<span class="label label-warning" style="margin-top:5px;margin-right:5px">'+res.data.circleList[i].title+'</span>');
                		  }else if(index === 3){
                			  index++;
                			  page.$circles.append('<span class="label label-info" style="margin-top:5px;margin-right:5px">'+res.data.circleList[i].title+'</span>');
                		  }else if(index === 4){
                			  index++;
                			  page.$circles.append('<span class="label label-danger" style="margin-top:5px;margin-right:5px">'+res.data.circleList[i].title+'</span>');
                		  }else if(index === 5){
                			  index=1;
                			  page.$circles.append('<span class="label label-success" style="margin-top:5px;margin-right:5px">'+res.data.circleList[i].title+'</span>');
                		  }
                	  }
                	
                	  page.pushdevice = res.data.pushdevice;
                	  page.$startTime.text(moment(res.data.start_time).format('YYYY-MM-DD HH:mm:ss'));
                   	  page.$endTime.text(moment(res.data.end_time).format('YYYY-MM-DD HH:mm:ss'));
                	  page.$place.text(res.data.place);
                	  
                
                	  
                	  page.$guestTable.bootstrapTable('load',res.data.guestList)
  
                	  page.$description.text(res.data.description);
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
              url: page.CONST.AUDIT,
              type: 'POST',
              data: {
              		id: pageId,
              		state: status===0 ? 1:4,
              		audit_opinion: audit_opinion,
      				status: 1,
      				
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

    },
};



page.$guestTable.bootstrapTable({	
    detailView: false,
   // classes: 'table table-hover table-no-bordered',
    data: [],
   // silent: true,
   // height: 300,//高度
    pagination: true,//是否分页
    pageSize: 10,//单页记录数
    pageList: [10,60,100],//分页步进值
    sidePagination: "client",//服务端分页
    undefinedText: "—",//为空的填充字符
    uniqueId: 'id',
    columns: [{
        field: 'user_name',
        title: '姓名',
        align: 'center'
    }, {
        field: 'user_identity',
        title: '单位',
        align: 'center'
    },{
        field: 'companywork',
        title: '职务',
        align: 'center'
    }]
});

page.eventHandler.initPage();
