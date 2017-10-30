var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastrPlus', 'fancybox'], function (bs, $, helper, swal, layer, toastr) {
	//页面所用到AJAX请求的URL page.ajaxUrl.MOVEUP
	page.ajaxUrl = {
	    GET_LIST: helper.url.getUrlByMapping("admin/jdw/jdw_list.shtml"),                      //获取焦点位列表
	    DELETE: helper.url.getUrlByMapping("admin/jdw/delete_jdw.shtml"),                      //删除焦点位
	    MOVEUP: helper.url.getUrlByMapping("admin/jdw/update_move.shtml"),                     //上移焦点位
	    ADD_JDW: helper.url.getUrlByMapping("admin/focalpositionedit.shtml")                     //新增、编辑焦点位页面
	}

	page.focusArticle = {
			one: null,
			two: null,
			three: null,
			four: null,
			five: null
	}

	//数组操作对象$scope.upRecord
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
	page.info = [{id: 0, isLink: 0},{id: 0, isLink: 0},{id: 0, isLink: 0},{id: 0, isLink: 0},{id: 0, isLink: 0}];

	//常用节点
	page.$focalContent = $('.focus-warrper-container');    //焦点位信息
	page.$editFocal = $('.edit-focal');  //编辑
	page.$movePre = $('.move-pre');      //上移

	//辅助方法page.assist.toastrModal
	page.assist = {
		setJdw: function (data) {
			for (var i = 0; i < data.length; i++) {
				var index = parseInt(data[i].position);
				switch (index) {
				    case 1:
				    	page.info[0] = data[i];
				    	break;
				    case 2:
				    	page.info[1] = data[i];
				    	break;
				    case 3:
				    	page.info[2] = data[i];
				    	break;
				    case 4:
				    	page.info[3] = data[i];
				    	break;
				    case 5:
				    	page.info[4] = data[i];
				    	break;
				}
			}
		},
		openJdw: function (id, position) {
			var str = '';
			page.info[position-1].id == 0 ? str = '新增' : str = '编辑';
			layer.open({
	            type: 2,
	            title: str + '焦点位',
	            skin: 'layui-layer-rim', //加上边框
	            area: ['95%', '95%'],   //宽高
	            scrollbar: false,
	            content: page.ajaxUrl.ADD_JDW + '?id=' + page.info[position-1].id + '&position=' +position
	        });
		},
		initialize: function () {
			for (var i =0 ;i < page.info.length; i++) {
				page.$focalContent.eq(i).attr('data-id', page.info[i].id);
				page.assist.initjdw(i+1);
			}
			toastr.clear();
		},
		initjdw: function (index) {
			var rows = page.$focalContent.eq(index-1).find('.col-md-9');
			if (page.info[index-1].image_url) {
	    		var template = '<a class="fancybox imgbox" rel="group" href="{0}" title=""><img alt="" style="width:100%;height:100%" src="{0}" /></a>';
	            var html = template.Format(page.info[index-1].image_url);
	            rows.eq(0).html(html).find(".fancybox").fancybox();
	    	} else {
	    		rows.eq(0).html('无');
	    	}
			rows.eq(1).html(page.info[index-1].title ? page.info[index-1].title : '无');
	    	if (!!page.info[index-1].type) {
	    		if (page.info[index-1].type == 20) {
	    			rows.eq(2).html('外部链接');
	    			rows.eq(3).html('【外部链接】<a class="jump-link" data-id="0" data-type="20" data-title="" data-url="'+ page.info[index-1].title_id +'">' + page.info[index-1].title_id + '</a>');
		    	} else {
		    		rows.eq(2).html('内部链接');
		    		rows.eq(3).html('【'+ helper.obj.getObjLabel(page.info[index-1].type) +'】<a class="jump-link" data-id="'+ page.info[index-1].title_id +'" data-type="'+ page.info[index-1].type +'" data-url="" data-title="'+ page.info[index-1].obj_title +'">' + page.info[index-1].obj_title + '</a>');
		    	}
	    	} else {
	    		rows.eq(2).html('无');
	    		rows.eq(3).html('无');
	    	}
		},
		openInfo: function (el) {
			var options = {obj_id: el.data('id'), obj_type: el.data('type'),article_title: el.data('title'), url: el.data('url')};
			helper.win.openInfoByObj(options);
		},
		toastrModal: function (text) {
			toastr.success(text);
		}
	}

	//页面事件page.eventHandler.initialize
	page.eventHandler = {
			
			initialize: function () {
				$.ajax({
					url: page.ajaxUrl.GET_LIST,
					dataType: 'json',
					success: function (ret) {
						if (ret.code == 0){console.log(ret);
							page.assist.setJdw(ret.data);
							page.assist.initialize();
							return;
						}
						toastr.error("焦点位初始化失败或发生错误!", "请稍候再重试或联系管理员！");
					},
					error: function () {
						toastr.error("焦点位初始化失败或发生错误!", "请稍候再重试或联系管理员！");
					}
				});
			},
			move: function (id, position) {
				if (page.info[position-1].id == 0) {
					swal({title: "选中焦点位不存在", text: "1s后自动消失...", type: "error", timer: 1000});
					return;
				}
				swal({
					title: '您确定要上移该焦点位吗？',
			        type: "warning",
			        showCancelButton: true,
			        confirmButtonColor: "#DD6B55",
			        confirmButtonText: "确定",
			        cancelButtonText:'取消',
			        closeOnConfirm: false
				}, function () {
					$.ajax({
						url: page.ajaxUrl.MOVEUP,
						data: {
							id: page.info[position-1].id,
							position: position-1
						},
						type: 'post',
						dataType: 'json',
						success: function (ret) {
							if (ret.code == 0){
								//swal({title: "焦点位上移成功", text: "1s后自动消失...", type: "success", timer: 500});
								swal.close();
								toastr.success("焦点位上移成功");
								var jdw = $('.focal-content');
								var _this = $('.focal-content').eq(position-1);
								var _prev = $('.focal-content').eq(position-2);
								page.$focalContent.eq(position-2).attr('data-id', page.info[position-1].id).append(_this);
								page.$focalContent.eq(position-1).attr('data-id', page.info[position-2].id).append(_prev);
								$scope.upRecord(page.info, position-1);
								console.log(page.info);
							} else {
								swal({title: "焦点位上移失败", text: ret.errMsg, type: "error"});
							}
						}
					});
				});
			},
			delete: function (id, position) {
				if (page.info[position-1].id == 0) {
					swal({title: "选中焦点位不存在", text: "1s后自动消失...", type: "error", timer: 1000});
					return;
				}
				swal({
					title: '您确定要删除该焦点位吗？',
			        type: "warning",
			        showCancelButton: true,
			        confirmButtonColor: "#DD6B55",
			        confirmButtonText: "删除",
			        cancelButtonText:'取消',
			        closeOnConfirm: false
				}, function () {
					$.ajax({
						url: page.ajaxUrl.DELETE,
						data: {id: page.info[position-1].id},
						type: 'post',
						dataType: 'json',
						success: function (ret) {
							if (ret.code == 0){
								swal({title: "焦点位删除成功", text: "1s后自动消失...", type: "success", timer: 500});
								var jdw = $('.focal-content').eq(position-1);
								page.$focalContent.eq(position-1).attr('data-id', '0');
								jdw.find('.col-md-9').html('无');
								page.info[position-1] = {id: 0, isLink: 0};
								console.log(page.info);
							} else {
								swal({title: "焦点位删除失败", text: ret.errMsg, type: "error"});
							}
						}
					});
				});
			}
	}

	/**
	 * 提供给引用页面刷新用，如果未声明该方法，则引用页面调用将使用浏览器重载重新刷新本页面
	 */
	page.refresh = function (id, position) {
		page.$focalContent.eq(position-1).attr('data-id', id);
		var jdw = $('.focal-content').eq(position-1);
		var index = parseInt(position);
		page.assist.initjdw(index);
		console.log(index, page.info);
	};

	//初始化
	toastr.info("初始化加载中，请稍候...");
	page.eventHandler.initialize();

	//编辑
	page.$editFocal.click(function () {
		var _parent = $(this).parents('.focus-warrper-container');
		var position = _parent.data('position');
		page.assist.openJdw(page.info[position-1].id, position);
	});

	//上移
	$(".move-pre").click(function () {
		var _parent = $(this).parents('.focus-warrper-container');
		var position = _parent.data('position');
		page.eventHandler.move(page.info[position-1].id, position);
	});

	//删除
	$('.demo3').click(function () {
		var _parent = $(this).parents('.focus-warrper-container');
		var position = _parent.data('position');
		page.eventHandler.delete(page.info[position-1].id, position);
	});

	//跳转链接
	$('body').on('click', '.jump-link', function () {
		page.assist.openInfo($(this));
	});
});