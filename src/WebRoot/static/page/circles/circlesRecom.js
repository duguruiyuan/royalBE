//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastrPlus', 'module.inputSelector', 'datetimepicker', 'table', 'tableEditable'], function (bs, $, helper, swal, layer, toastr) {
    var module = {
    	inputSelector: require('module.inputSelector')
    };
//存储页面form对象
page.$form = $('form');
	page.$circleBox1 = $('#circleBox1'); //圈子容器
	page.$circleBox2 = $('#circleBox2'); //圈子容器
	page.$circleBox3 = $('#circleBox3'); //圈子容器
//页面级的帮助对象集合
page.derive = {
    //获取表单参数包含搜索
}

page.oldcircle1 = {key:"",value:""};
page.oldcircle2 = {key:"",value:""};
page.oldcircle3 = {key:"",value:""};

page.masterSelect1 = null;
page.masterSelect2 = null;
page.masterSelect3 = null;

//页面所用到AJAX请求的URL
page.ajaxUrl = {
	GET_LIST: helper.url.getUrlByMapping("admin/circle/find_tj_circle_list.shtml"),     		  //获取推荐圈子文章接口
    UPDATE: helper.url.getUrlByMapping("admin/circle/update_tj_circle.shtml"),                   //设置推荐圈子     
    DELETE: helper.url.getUrlByMapping("admin/circle/update_tj_circle.shtml"),                   //删除推荐圈子     
    GET_CIRCLES_LIST: helper.url.getUrlByMapping("admin/circle/find_circle_list.shtml?status=1")  //圈子选择接口
}
//页面事件
page.eventHandler = {
    get: function (){	//获取推荐圈子列表
        $.ajax({
            url : page.ajaxUrl.GET_LIST,
            type : 'POST',
            async :false,
            dataType : 'json',
            success : function(res) {
                if(res.code==='0'){
                	if(res.data.length!==0){
                		for(var i=0;i<res.data.length;i++){
                			var rm = res.data[i].is_rm;
                			if(rm==1){
                				page.oldcircle1.key=res.data[i].id;
                				page.oldcircle1.value=res.data[i].title;
                			}else if(rm==2){
                				page.oldcircle2.key=res.data[i].id;
                				page.oldcircle2.value=res.data[i].title;
                			}else if(rm==3){
                				page.oldcircle3.key=res.data[i].id;
                				page.oldcircle3.value=res.data[i].title;
                			}
                			var description = res.data[i].description ?res.data[i].description:"";
                			var strHtml = '<div class="ibox-content animated bounceIn">'+
					             		  	'<div class="col-sm-12">'+
					                            '<div class="flex-col-center">'+
					                               '<img alt="image" style="width:180px;height:180px;margin-bottom:20px" class="img-circle m-t-xs img-responsive" src="'+res.data[i].logo+'">'+                            
					                           	   '<h2><strong>'+res.data[i].title+'</strong></h2>'+
					                            '</div>'+
					                        '</div>'+
					                        '<div class="clearfix"></div>'+
					                        '<h4>简介</h4>'+
					                        '<p>'+description+'</p>'+
					                    '</div>';   
                		//	var j = i+1;
                			$('#circleContent'+rm).attr('data-id',res.data[i].id);
                			$('#circleContent'+rm).html(strHtml);
                			$('#circleBtn'+rm).show();
                		}
                	}    	
                }else{
                	toastr.error(res.errMsg);           
                }
            },
            error : function(res) {
            	toastr.error("请检查网络！");
            }
        }); 
    },	
    update: function (id,update_id,index) {    //升级圈子推荐
    	$.ajax({
            url: page.ajaxUrl.UPDATE,
            type: 'POST',
            data: {
            	id: id,
            	update_id: update_id,
            	is_rm:index
            },
            dataType : 'json',
            success : function(res) {
                if(res.code == 0){
                	toastr.success("修改推荐成功！");
                	if(index==1){
        	    		page.oldcircle1.key=res.data.id;
          	    		page.oldcircle1.value=res.data.title;
                	}else if(index==2){
        	    		page.oldcircle2.key=res.data.id;
          	    		page.oldcircle2.value=res.data.title;
                	}else if(index==3){
        	    		page.oldcircle3.key=res.data.id;
          	    		page.oldcircle3.value=res.data.title;
                	}
                	var description = res.data.description ? res.data.description :"";
	      			var strHtml = '<div class="ibox-content animated bounceIn">'+
				             		  	'<div class="col-sm-12">'+
				                            '<div class="flex-col-center">'+
				                               '<img alt="image" style="width:180px;height:180px;margin-bottom:20px" class="img-circle m-t-xs img-responsive" src="'+res.data.logo+'">'+                            
				                           	   '<h2><strong>'+res.data.title+'</strong></h2>'+
				                            '</div>'+
				                        '</div>'+
				                        '<div class="clearfix"></div>'+
				                        '<h4>简介</h4>'+
				                        '<p>'+description+'</p>'+
				                    '</div>';   
	      			$('#circleContent'+index).attr('data-id',res.data.id);
	      			$('#circleContent'+index).empty().html(strHtml);
	      			$('#circleBtn'+index).show();
                }else{
                 	toastr.error(res.errMsg);
                 	
                }
            },
            error:function(ret) {
             	toastr.error("操作失败！");
             	
            }
        }); 
    },
    delete: function (index) {    //删除圈子推荐
	    swal({
            title: "您确定要取消该推荐圈子吗？",
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText:'取消',
            closeOnConfirm: true
        }, function () {
        	$.ajax({
                url: page.ajaxUrl.DELETE,
                type: 'POST',
                data: {
                	is_rm:index
                },
                dataType : 'json',
                success : function(res) {
                    if(res.code == 0){
                    	toastr.success("取消推荐成功！");
    	      			$('#circleContent'+index).empty().html("");
    	      			$('#circleBtn'+index).hide();
                    }else{
                     	toastr.error(res.errMsg);
                     	
                    }
                },
                error:function(ret) {
                 	toastr.error("操作失败！");
                 	
                }
            });
        }); 
    }
};
//页面辅助类/方法/属性
page.assist = {
	initDataBind: function () {
		page.masterSelect1= new module.inputSelector({
	      	  container: "#circleselect1",
              validatorContainer: "",
	    	  readonly: false,
	    	  type: "circle",
	    	  data:page.oldcircle1.key ? page.oldcircle1 : '',
	    	  callback: function(json){
	    		    swal({
	    	            title: "您确定要修改推荐圈子一吗？",
	    	            text: "新圈子:"+json.value,
	    	            type: "warning",
	    	            showCancelButton: true,
	    	            confirmButtonColor: "#DD6B55",
	    	            confirmButtonText: "确定",
	    	            cancelButtonText:'取消',
	    	            closeOnConfirm: true
	    	        }, function () {
	  	    		  	page.eventHandler.update(json.key, page.oldcircle1.key,1);
	    	        });
	    	  }
	    });
		page.masterSelect2= new module.inputSelector({
	      	  container: "#circleselect2",
              validatorContainer: "",
	    	  readonly: false,
	    	  data:page.oldcircle2.key ? page.oldcircle2 : '',
	    	  type: "circle",
	    	  callback: function(json){
	    		    swal({
	    	            title: "您确定要修改推荐圈子二吗？",
	    	            text: "新圈子:"+json.value,
	    	            type: "warning",
	    	            showCancelButton: true,
	    	            confirmButtonColor: "#DD6B55",
	    	            confirmButtonText: "确定",
	    	            cancelButtonText:'取消',
	    	            closeOnConfirm: true
	    	        }, function () {
	  	    		  	page.eventHandler.update(json.key, page.oldcircle2.key,2);
	    	        });
	    	  }
	        });
		page.masterSelect3= new module.inputSelector({
	      	  container: "#circleselect3",
              validatorContainer: "",
	    	  readonly: false,
	    	  type: "circle",
	    	  data:page.oldcircle3.key ? page.oldcircle3 : '',
	    	  callback: function(json){
	    		    swal({
	    	            title: "您确定要修改推荐圈子三吗？",
	    	            text: "新圈子:"+json.value,
	    	            type: "warning",
	    	            showCancelButton: true,
	    	            confirmButtonColor: "#DD6B55",
	    	            confirmButtonText: "确定",
	    	            cancelButtonText:'取消',
	    	            closeOnConfirm: true
	    	        }, function () {
	  	    		  	page.eventHandler.update(json.key, page.oldcircle3.key,3);
	    	        });
	    	  }
	        });
	}
};

//页面初始化方法
page.eventHandler.get();
page.assist.initDataBind();
});

    
