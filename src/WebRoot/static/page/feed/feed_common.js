function getTypeName(type){
	switch(type){
		case 1: return '早报';
		case 2: return '秘闻';
		case 3: return '大咖';
		case 4: return '活动 ';
		case 5: return '话题';
		case 6: return '专题';
		case 7: return '江湖事';
		case 8: return '榜样';
		case 9: return '工商联新闻';
		case 10: return '招商项目';
		case 11: return '圈子';
		case 12: return '用户动态';
		case 13: return '商会资讯';
		case 14: return '商会通知';
		case 15: return '评论';
		case 16: return '关注';
		case 17: return '招商单位';
		case 18: return '圈子问答';
		case 19: return '圈子资讯';
		case 20: return '外链';
		case 21: return '大咖观点';
	}
}

function del(pid,state){
	swal({
 	       title: "您确定要删除这条记录吗？",
 	       type: "warning",
 	       showCancelButton: true,
 	       confirmButtonColor: "#18a689",
 	       confirmButtonText: "确定",
 	       cancelButtonText:'取消',
 	       closeOnConfirm: false
	 	}, function () {
	 	    $.ajax({
	 	           url : 'feed/update_feed.shtml',
	 	           type : 'POST',
	 	           data:{
	 	        	 id:pid,
	 	        	 status:2,
	 	        	 state:state
	 	           },
	 	           dataType : 'json',
	 	           success : function(ret) {
	 	        	   if(ret.code == 0){
	 	        		  swal("删除成功！", "success");
	 	            		$('#feedTable').bootstrapTable('remove', {
	 	                        field: 'id',
	 	                        values: pid
	 	            		});
	 	 	               $('#feedTable').bootstrapTable('refresh');
	 	            	}else{
	 	                    swal("删除失败", ret.errMsg, "error");
	 	            	}
	 	          },
	 	           error:function(ret) {
	 	               swal("删除失败", "error");
	 	           }
	         });
	     });
}

function delAndClose(pid){
	swal({
 	       title: "您确定要删除这条记录吗？",
 	       type: "warning",
 	       showCancelButton: true,
 	       confirmButtonColor: "#18a689",
 	       confirmButtonText: "确定",
 	       cancelButtonText:'取消',
 	       closeOnConfirm: false
	 	}, function () {
	 	    $.ajax({
	 	           url : 'feed/update_feed.shtml',
	 	           type : 'POST',
	 	           data:{
	 	        	 id:pid,
	 	        	 status:2
	 	           },
	 	           dataType : 'json',
	 	           success : function(ret) {
	 	        	   if(ret.code == 0){
	 	        		  swal("删除成功！", "success");
	 	        		  var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
	 	          	  		parent.layer.close(index);
	 	          	  		window.parent.$('#feedTable').bootstrapTable('remove', {
	 	                        field: 'id',
	 	                        values: pid
	 	            		});
	 	          	  		window.parent.$('#feedTable').bootstrapTable('refresh');
	 	            	}else{
	 	                    swal("删除失败", ret.errMsg, "error");
	 	            	}
	 	          },
	 	           error:function(ret) {
	 	               swal("删除失败", "error");
	 	           }
	         });
	     });
}