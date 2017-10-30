var page = {};

//页面所用到AJAX请求的URL page.ajaxUrl.GET_LIST
page.ajaxUrl = {
    GET_LIST: helper.url.getUrlByMapping("admin/jdw/jdw_list.shtml"),                      //获取焦点位列表
    GET_URL: helper.url.getUrlByMapping("admin/backcommon/find_articlelists.shtml"),       //外部链接列表
    INSERT: helper.url.getUrlByMapping("admin/jdw/insert_update_jdw.shtml"),               //新增焦点位
    DELETE: helper.url.getUrlByMapping("admin/jdw/delete_jdw.shtml"),                      //删除焦点位
    MOVEUP: helper.url.getUrlByMapping("admin/jdw/update_move.shtml"),                     //上移焦点位
    UPLOAD_BUCKET: "image"  //存储图片的目录
}

//组件实例
page.fileUpload = {
		one: null,
		two: null,
		three: null,
		four: null,
		five: null
}
page.focusArticle = {
		one: null,
		two: null,
		three: null,
		four: null,
		five: null
}

//$scope.upRecord
var $scope = {
 swapItems: function(arr, index1, index2) {
     arr[index1] = arr.splice(index2, 1, arr[index1])[0];
     return arr;
 },
 upRecord: function(arr, $index) {
     if($index == 0) {
         return;
     }
     this.swapItems(arr, $index, $index - 1);
 },
 downRecord: function(arr, $index) {
     if($index == arr.length -1) {
         return;
     }
     this.swapItems(arr, $index, $index + 1);
 }
};

//焦点位信息
page.info = [{isLink: 0},{isLink: 0},{isLink: 0},{isLink: 0},{isLink: 0}];

//常用节点
page.$focusTitleOne = $('#focusTitleOne');
page.$outLinkOne = $('#outLinkOne');

page.$focusTitleTwo = $('#focusTitleTwo');
page.$outLinkTwo = $('#outLinkTwo');

page.$focusTitleThree = $('#focusTitleThree');
page.$outLinkThree = $('#outLinkThree');

page.$focusTitleFour = $('#focusTitleFour');
page.$outLinkFour = $('#outLinkFour');

page.$focusTitleFive = $('#focusTitleFive');
page.$outLinkFive = $('#outLinkFive');

page.$jdwContainer = $('.focus-warrper-container');
page.$focalWarrper = $('.focal-warrper');
//辅助方法
page.assist = {
		setJdw: function (data) {
			for (var i = 0; i < data.length; i++) {
				var _index = parseInt(data[i].position);
				switch (_index) {
				    case 1:
				    	page.$focusTitleOne.val(data[i].title);
				    	if (data[i].type == 20) page.$outLinkOne.val(data[i].title_id);
				    	page.assist.setOneJdw(data[i],_index);
				    	break;
				    case 2:
				    	page.$focusTitleTwo.val(data[i].title);
				    	if (data[i].type == 20) page.$outLinkTwo.val(data[i].title_id);
				    	page.assist.setOneJdw(data[i],_index);
				    	break;
				    case 3:
				    	page.$focusTitleThree.val(data[i].title);
				    	if (data[i].type == 20) page.$outLinkThree.val(data[i].title_id);
				    	page.assist.setOneJdw(data[i],_index);
				    	break;
				    case 4:
				    	page.$focusTitleFour.val(data[i].title);
				    	if (data[i].type == 20) page.$outLinkFour.val(data[i].title_id);
				    	page.assist.setOneJdw(data[i],_index);
				    	break;
				    case 5:
				    	page.$focusTitleFive.val(data[i].title);
				    	if (data[i].type == 20) page.$outLinkFive.val(data[i].title_id);
				    	page.assist.setOneJdw(data[i],_index);
				    	break;
				}
			}
			console.log(page.info);
		},
		setOneJdw: function (data, index) {
			page.info[index-1].id = data.id || 0;
			page.info[index-1].image_url = data.image_url || "";
			page.info[index-1].obj_title = data.obj_title || "";
			page.info[index-1].title = data.title || "";
			page.info[index-1].title_id = data.title_id || "";
			page.info[index-1].type = data.type || "";
			page.info[index-1].isLink = data.type == 20 ? 1 : 0;
		},
		deleteOneJdw: function (index) {
			var jdwData = page.info[index];
			var _index = index + 1;
			switch (_index) {
			    case 1:
			    	//if (jdwData.image_url && jdwData.image_url != ''){
			    		page.fileUpload.one = new module.fileUpload({
				    		container: "#fileSelector" + index,
    					    existFiles: [],
    					    isUnique: true,
    					    completeCallback: function (data) {console.log(data);
    					    	page.info[0].image_url = data.url;
    					    }
    					});
			    	//}
			    	page.$focusTitleOne.val('');
			    	if (jdwData.type && jdwData.type != 20) {
			    		page.focusArticle.one = new module.articleSelector({
	      		    		  container: "#focusLinkOne",
	      		    		  readonly: false,
	      		    		  isUnique: true,
	      		    		  hasExternal: false,
	      		    		  articleList: [],
	      		    		  callback: function (data) {console.log(data);
	      		    			  page.info[0].type = data.obj_type;
	      		    			  page.info[0].title_id = data.obj_id;
	      		    			  page.info[0].obj_title = data.show_title;
	      		    		  }
	      		    	});
			    	} else {
			    		page.$outLinkOne.val('');
			    	}
			    	if($("[name=radTypeOne]:checked").val() == 1){
		                $("[name=radTypeOne]:checked").removeAttr("checked");
		                $("[name=radTypeOne][value=0]").attr("checked", "checked");
		                iCheck.toggle.init("body");
				    	$("[name=radTypeOne][value=0]").parent().addClass("checked");
		            }
			    	break;
			}
			page.info[index] = {};
			
		},
		setArticleJson: function (data) {
			var articleArr = [];
			if (!!data.type && data.type != 20) {
				articleArr.push({
    				obj_id: data.title_id, 
    				obj_type: data.type, 
    				show_title: data.obj_title, 
    				article_title: data.obj_title
    			});
    		}
			return articleArr;
		},
		uploadFocus: function (url, data, index, titleStr) {
			swal({
				title: '您确定要' + titleStr + '该焦点位吗？',
		        type: "warning",
		        showCancelButton: true,
		        confirmButtonColor: "#DD6B55",
		        confirmButtonText: "确定",
		        cancelButtonText:'取消',
		        closeOnConfirm: false
			}, function () {
				$.ajax({
					url: url,
					data: data,
					type: 'post',
					dataType: 'json',
					success: function (ret) {
						if (ret.code == 0){
							if (!page.info[index].id) page.info[index].id = ret.data.id;console.log(page.info);
							swal({title: titleStr + "成功", text: "1s后自动消失...", type: "success", timer: 1000});
							return;
						}
						swal({title: titleStr + "失败", text: ret.errMsg, type: "error"});
					}
				});
			});
		},
		deleteFocus: function (url, data, index, titleStr) {
			swal({
				title: '您确定要' + titleStr + '该焦点位吗？',
		        type: "warning",
		        showCancelButton: true,
		        confirmButtonColor: "#DD6B55",
		        confirmButtonText: "确定",
		        cancelButtonText:'取消',
		        closeOnConfirm: false
			}, function () {
				$.ajax({
					url: url,
					data: data,
					type: 'post',
					dataType: 'json',
					success: function (ret) {
						if (ret.code == 0){
							page.assist.deleteOneJdw(parseInt(index));
							//swal({title: titleStr + "成功", text: "1s后自动消失...", type: "success", timer: 1000});
							swal({
								title: titleStr + "成功",
								type: "success"
							}, function () {
								location.reload();
							});
							return;
						}
						swal({title: titleStr + "失败", text: ret.errMsg, type: "error"});
					}
				});
			});
		},
		moveFocus: function (url, data, index, titleStr) {
			swal({
				title: '您确定要' + titleStr + '该焦点位吗？',
		        type: "warning",
		        showCancelButton: true,
		        confirmButtonColor: "#DD6B55",
		        confirmButtonText: "确定",
		        cancelButtonText:'取消',
		        closeOnConfirm: false
			}, function () {
				$.ajax({
					url: url,
					data: data,
					type: 'post',
					dataType: 'json',
					success: function (ret) {
						if (ret.code == 0){
							swal({
								title: titleStr + "成功",
								type: "success"
							}, function () {
								location.reload();
							});
							return;
						}
						swal({title: titleStr + "失败", text: ret.errMsg, type: "error"});
					}
				});
			});
		}/*,
		move: function (index) {
			
			var _this = page.$jdwContainer.eq(index).clone(true);    //当前焦点位
			page.$jdwContainer.eq(index).remove();
			var _prev = page.$jdwContainer.eq(index-1).clone(true);  //上一个焦点位
			page.$jdwContainer.eq(index-1).remove();
			
			page.$focalWarrper.eq(index-1).append(_this);
			page.$focalWarrper.eq(index).append(_prev);
			
		}*/
}

//页面事件
page.eventHandler = {
		
		initialize: function () {
			//初始化图片上传、文章选择、单选按钮
			for (var i =0 ;i < page.info.length; i++) {
				var articleArr = page.assist.setArticleJson(page.info[i]);
				var index = i + 1;
				switch (index) {
				    case 1:
				    	page.fileUpload.one = new module.fileUpload({
				    		container: "#fileSelector" + index,
    					    existFiles: page.info[i].image_url ? [page.info[i].image_url] : [],
    					    isUnique: true,
    					    completeCallback: function (data) {console.log(data);
    					    	page.info[0].image_url = data.url;
    					    }
    					});
				    	if($("[name=radTypeOne]:checked").val() != page.info[i].isLink){
			                $("[name=radTypeOne]:checked").removeAttr("checked");
			                $("[name=radTypeOne][value=" + page.info[i].isLink + "]").attr("checked", "checked");
			            }
				    	page.focusArticle.one = new module.articleSelector({
	      		    		  container: "#focusLinkOne",
	      		    		  readonly: false,
	      		    		  isUnique: true,
	      		    		  hasExternal: false,
	      		    		  articleList: articleArr,
	      		    		  callback: function (data) {console.log(data);
	      		    			  page.info[0].type = data.obj_type;
	      		    			  page.info[0].title_id = data.obj_id;
	      		    			  page.info[0].obj_title = data.show_title;
	      		    		  }
	      		    	});
				    	break;
				    case 2:
				    	page.fileUpload.two = new module.fileUpload({
    					    container: "#fileSelector" + index,
    					    existFiles: page.info[i].image_url ? [page.info[i].image_url] : [],
    					    isUnique: true,
    					    completeCallback: function (data) {
    					    	page.info[1].image_url = data.url;
    					    }
    					});
				    	if($("[name=radTypeTwo]:checked").val() != page.info[i].isLink){
			                $("[name=radTypeTwo]:checked").removeAttr("checked");
			                $("[name=radTypeTwo][value=" + page.info[i].isLink + "]").attr("checked", "checked");
			            }
				    	page.focusArticle.two = new module.articleSelector({
	      		    		  container: "#focusLinkTwo",
	      		    		  readonly: false,
	      		    		  isUnique: true,
	      		    		  hasExternal: false,
	      		    		  articleList: articleArr,
	      		    		  callback: function (data) {
	      		    			  page.info[1].type = data.obj_type;
	      		    			  page.info[1].title_id = data.obj_id;
	      		    			  page.info[1].obj_title = data.show_title;
	      		    		  }
	      		    	});
				    	break;
				    case 3:
				    	page.fileUpload.three = new module.fileUpload({
				    		container: "#fileSelector" + index,
    					    existFiles: page.info[i].image_url ? [page.info[i].image_url] : [],
    					    isUnique: true,
    					    completeCallback: function (data) {
    					    	page.info[2].image_url = data.url;
    					    }
    					});
				    	if($("[name=radTypeThree]:checked").val() != page.info[i].isLink){
			                $("[name=radTypeThree]:checked").removeAttr("checked");
			                $("[name=radTypeThree][value=" + page.info[i].isLink + "]").attr("checked", "checked");
			            }
				    	page.focusArticle.three = new module.articleSelector({
	      		    		  container: "#focusLinkThree",
	      		    		  readonly: false,
	      		    		  isUnique: true,
	      		    		  hasExternal: false,
	      		    		  articleList: articleArr,
	      		    		  callback: function (data) {
	      		    			  page.info[2].type = data.obj_type;
	      		    			  page.info[2].title_id = data.obj_id;
	      		    			  page.info[2].obj_title = data.show_title;
	      		    		  }
	      		    	});
				    	break;
				    case 4:
				    	page.fileUpload.four = new module.fileUpload({
				    		container: "#fileSelector" + index,
    					    existFiles: page.info[i].image_url ? [page.info[i].image_url] : [],
    					    isUnique: true,
    					    completeCallback: function (data) {
    					    	page.info[3].image_url = data.url;
    					    }
    					});
				    	if($("[name=radTypeFour]:checked").val() != page.info[i].isLink){
			                $("[name=radTypeFour]:checked").removeAttr("checked");
			                $("[name=radTypeFour][value=" + page.info[i].isLink + "]").attr("checked", "checked");
			            }
				    	page.focusArticle.four = new module.articleSelector({
	      		    		  container: "#focusLinkFour",
	      		    		  readonly: false,
	      		    		  isUnique: true,
	      		    		  hasExternal: false,
	      		    		  articleList: articleArr,
	      		    		  callback: function (data) {
	      		    			  page.info[3].type = data.obj_type;
	      		    			  page.info[3].title_id = data.obj_id;
	      		    			  page.info[3].obj_title = data.show_title;
	      		    		  }
	      		    	});
				    	break;
				    case 5:
				    	page.fileUpload.five = new module.fileUpload({
				    		container: "#fileSelector" + index,
    					    existFiles: page.info[i].image_url ? [page.info[i].image_url] : [],
    					    isUnique: true,
    					    completeCallback: function (data) {
    					    	page.info[4].image_url = data.url;
    					    }
    					});
				    	if($("[name=radTypeFive]:checked").val() != page.info[i].isLink){
			                $("[name=radTypeFive]:checked").removeAttr("checked");
			                $("[name=radTypeFive][value=" + page.info[i].isLink + "]").attr("checked", "checked");
			            }
				    	page.focusArticle.five = new module.articleSelector({
	      		    		  container: "#focusLinkFive",
	      		    		  readonly: false,
	      		    		  isUnique: true,
	      		    		  hasExternal: false,
	      		    		  articleList: articleArr,
	      		    		  callback: function (data) {
	      		    			  page.info[4].type = data.obj_type;
	      		    			  page.info[4].title_id = data.obj_id;
	      		    			  page.info[4].obj_title = data.show_title;
	      		    		  }
	      		    	});
				    	break;
				}
			}
			iCheck.toggle.init("body");
		},
		//初始化
		load: function () {
			$.ajax({
				url: page.ajaxUrl.GET_LIST,
				dataType: 'json',
				success: function (ret) {
					if (ret.code == 0) {console.log(ret);
					    page.assist.setJdw(ret.data);
					    page.eventHandler.initialize();
						return;
					}
					toastr.error("焦点位初始化失败或发生错误!", "请稍候再重试或联系管理员！");
				}
			});
		},
		addFocus: function (index, title) {
			var jdwData = page.info[index];
			var data = {
					'id': jdwData.id || 0,
	    			'image_url': jdwData.image_url || '',
	    			'title': title,
	    			'type': jdwData.type || '',
	    			'obj_title': jdwData.obj_title || '',
	    			'position': parseInt(index)+1,
	    			'title_id': jdwData.title_id || ''	
				};
			page.assist.uploadFocus(page.ajaxUrl.INSERT, data, index, '修改');
		},
		delFocus: function (index) {
			var jdwData = page.info[index];
			if (!jdwData.id) {
				swal({title: "当前焦点位为空", type: "error"});
				return;
			}
			var data = {
					id: jdwData.id
			}
			page.assist.deleteFocus(page.ajaxUrl.DELETE, data, index, '删除');
		},
		moveFocus: function (index) {
			var jdwData = page.info[index];
			if (!jdwData.id) {
				swal({title: "当前焦点位为空", type: "error"});
				return;
			}
			var data = {
					id: jdwData.id,
					position: index
			}
			page.assist.moveFocus(page.ajaxUrl.MOVEUP, data, index, '上移');
		}
}

//初始化获取七牛存储token
var qiniu = new helper.qiniu.token(page.ajaxUrl.UPLOAD_BUCKET, function () {
	page.eventHandler.load();
});
//当页面打开时每半个小时重新获取一次七牛token
setInterval(function(){
    qiniu.getToken();
}, 30*60*1000);

//编辑
$('.edit-focal').click(function () {
	
});
//确定
$('.demo4').click(function () {
	var _parent = $(this).parents('.focus-warrper-container');
	var _position = _parent.attr('data-position');
	var title = _parent.find('.url-text-input').val();
	if (_parent.find("[class=radio-btn]:checked").val() == 1){
		page.info[_position].type = 20;
		page.info[_position].title_id = _parent.find('.select-url-obtain').val();
		page.info[_position].obj_title = "";
	}
	page.eventHandler.addFocus(_position, title);
});

//上移
$(".move-pre").click(function () {
	var _parent = $(this).parents('.focus-warrper-container');
	var _position = _parent.attr('data-position');
	page.eventHandler.moveFocus(_position);
});

//删除
$('.demo3').click(function () {
	var _parent = $(this).parents('.focus-warrper-container');
	var _position = _parent.attr('data-position');
	page.eventHandler.delFocus(_position);
});