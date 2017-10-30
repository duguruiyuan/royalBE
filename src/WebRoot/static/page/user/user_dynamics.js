//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'toastr'], function (bs, $, helper, toastr) {
	//页面所用到配置page.CONFIG.GET_USER_API  
	page.CONFIG = {
	    GET_USER_API: helper.url.getUrlByMapping("admin/userManager/get_userdynamic.shtml")    //获取用户动态接口
	};

	//页面参数
	page.id = helper.url.queryString("usid")

	page.$content = $("#vertical-timeline");

	//页面事件page.eventHandler.openInfo
	page.eventHandler = {
		
		initialize: function (result) {
			var arr = [];
			if (!result || result.length == 0){
				page.$content.append('<h2 class="text-center">该用户暂无动态</h2>');
				toastr.clear();
				return;
			}
			
			var data = page.eventHandler.dynamicList(result);
			console.log(data);
			
			for(var i = 0; i < data.length; i++){
				var url = helper.url.getInfoUrlByObj(data[i].sourceId, data[i].sourceType, "");
				var isHidden = url === "" ? ' hidden': '';
				var content = data[i].content ? data[i].content : '';
				var showDiv = '<div class="vertical-timeline-block"><div class="vertical-timeline-icon navy-bg"><i class="fa fa-file-text"></i></div><div class="vertical-timeline-content"><div class="vertical-date-time"><small>'+helper.convert.formatDate(result[i].create_time)+'</small></div><h2>'+ content +'</h2>';
				if( data[i].source != ''&& data[i].source != undefined){
					showDiv = showDiv+'<p class="fx">【'+ helper.obj.getObjLabel(data[i].sourceType) +'】'+data[i].source+'</p>';
				}
				showDiv += '<a class="btn btn-sm btn-primary goto-info'+ isHidden +'" data-id="'+ data[i].sourceId +'" data-type="'+ data[i].sourceType +'" data-title="'+ data[i].source +'" data-url=""> 点击前往</a></div></div>';
//				arr.push('<div class="vertical-timeline-block"><div class="vertical-timeline-icon navy-bg"><i class="fa fa-file-text"></i></div><div class="vertical-timeline-content"><div class="vertical-date-time"><small>'+helper.convert.formatDate(result[i].create_time)+'</small></div><h2>'+data[i].content+'</h2><p class="fx">'+data[i].source+'</p><a class="btn btn-sm btn-primary goto-info'+ isHidden +'" data-id="'+ data[i].sourceId +'" data-type="'+ data[i].sourceType +'" data-title="'+ data[i].source +'" data-url=""> 点击前往</a></div></div>');
				arr.push(showDiv);
			}
			page.$content.append(arr.join(''));
			toastr.clear();
		},
		dynamicList:function(Data) {
            var templateData = [];
            for(var i=0; i<Data.length; i++){
                var artType = Data[i].obj_type;
                var extra =  JSON.parse(Data[i].extra);
                var temp = {};
                switch(artType!==undefined){
                    //点赞
                    case artType==26:
                        switch(extra.obj_type!==undefined){
                            case extra.obj_type==1: temp.content = '点赞了早报';break;
                            case extra.obj_type==2: temp.content = '点赞了秘闻';break;
                            case extra.obj_type==4: temp.content = '点赞了活动';break;
                            case extra.obj_type==5: temp.content = '点赞了话题';break;
                            case extra.obj_type==6: temp.content = '点赞了专题';break;
                            case extra.obj_type==7: temp.content = '点赞了江湖事';break;
                            case extra.obj_type==8: temp.content = '点赞了榜样';break;
                            case extra.obj_type==9: temp.content = '点赞了工商联要闻';break;
                            case extra.obj_type==10: temp.content = '点赞了商机';break;
                            case extra.obj_type==12||(extra.obj_type>=26&&extra.obj_type<=36): temp.content = '点赞了用户动态';break;
                            case extra.obj_type==13: temp.content = '点赞了商会资讯';break;
                            case extra.obj_type==18: temp.content = '点赞了圈子帮助';break;
                            case extra.obj_type==19: temp.content = '点赞了圈子帖子';break;
                            //default: return false;
                        }
                        break;
                    //关注
                    case artType==27:
                        switch(extra.obj_type!==undefined){
                            case extra.obj_type==3||extra.obj_type==11||extra.obj_type==17: temp.content = '关注了'+extra.title;break;
                            case extra.obj_type==4: temp.content = '关注了这场活动';break;
                            case extra.obj_type==5: temp.content = '关注了这个话题';break;
                            //default: return false;
                        }
                        break;
                    //评论
                    case artType==28:
                        if(extra.is_voice==0) temp.content = Data[i].summary;
                        if(extra.is_voice==1) temp.content = '发表了语音评论';
                        break;
                    case artType==29 || artType==30:  //参与
                        if(extra.is_voice==0) temp.content = Data[i].summary;
                        if(extra.is_voice==1) temp.content = '发表了语音评论';
                        break;
                    //发布
                    case artType==31:
                        temp.content = '在'+extra.circle[0].name+'中“求帮帮”';
                        break;
                    case artType==32:
                        temp.content = '在'+extra.circle[0].name+'中“发活动”';
                        break;
                    case artType==33:
                        temp.content = '在'+extra.circle[0].name+'中“发话题”';
                        break;
                    case artType==34:
                        temp.content = '在'+extra.circle[0].name+'中“分享了”';
                        break;
                    case artType==35:
                        temp.content = '参与了活动分享';
                        break;
                    case artType==36:
                        temp.content = '参与了话题讨论';
                        break;
                        //关注
                    case artType==38: temp.content = extra.title
                        break;
                }
                temp.pageId = Data[i].id;
                temp.pageType = Data[i].obj_type;
                temp.create_time = Data[i].create_time;
                if(extra.obj_type !==3&&extra.obj_type!==11&&extra.obj_type!==17&&artType!==38){
                    temp.source = extra.title;
                    temp.sourceId = extra.obj_id;
                    temp.sourceType = extra.obj_type;
                }
                templateData.push(temp);
            }
            return templateData;
        },
		load: function () {
			$.ajax({
				url: page.CONFIG.GET_USER_API,
				data: {usid: page.id},
				type: 'post',
				dataType: 'json',
				success: function(res) {console.log(res);
					if(res.code == 0) {
						page.eventHandler.initialize(res.data);
						return;
					}
					toastr.error("您查看的用户动态不存在或发生错误!", "请稍候再重试或联系管理员！");
				},
				error: function (ret){
					toastr.error("您查看的用户动态不存在或发生错误!", "请稍候再重试或联系管理员！");
				}
			});
		},
		//查看详情
		openInfo: function (el) {
			var options = {obj_id: el.data('id'), obj_type: el.data('type'), article_title: el.data('title'), url: el.data('url')};
			helper.win.openInfoByObj(options);
		}
	};
	//页面初始化
	toastr.info("初始化加载中，请稍候...");
	page.eventHandler.load();
	$('body').on('click', '.goto-info', function () {
		page.eventHandler.openInfo($(this));
	});
});