//初始化页面对象
var page = {};

//存储页面参数
page.tableUniId = 0;//记录本地新闻表格row的id,负数递减
//存储页面$对象
page.$form = $('#pageForm');
	page.$title = $('#title');
	page.$circles = $('#circles');
	page.$summary = $('#summary');
	page.$contentEditor = $('#contentEditor');

//页面所用到AJAX请求的URL
page.CONST = {
	GET_DETAIL:	helper.url.getUrlByMapping("admin/circle_share/find_share_detail.shtml"),  //获取详情接口
    INSERT_SHARE: helper.url.getUrlByMapping("admin/circle_share/insert_share.shtml"),  //新增话题
    GET_CIRCLES_LIST: helper.url.getUrlByMapping("admin/circle/find_circle_list.shtml?status=1&state=1"),  
}
page.MOCK = {
	SeletedCircles:[],  //已选圈子数据
}
//表单验证
page.$form.bootstrapValidator({
    excluded: [':disabled'],
    fields: {
        title: {
            validators: {
                notEmpty: {
                    message: '不能为空！'
                }
            }
        },
        circles: {
            validators: {
                notEmpty: {
                    message: '不能为空！'
                }
            }
        },
        summary: {
            validators: {
                notEmpty: {
                    message: '不能为空！'
                }
            }
        },

    }
});

//初始化富文本编辑器
page.$contentEditor.summernote({
  height: 300
});

//初始化圈子选择器
page.circlesSelector = new TSelector({
    headText: '圈子选择',
    url: page.CONST.GET_CIRCLES_LIST,
    uniKey: 'id',
    titleSelectedName:'已选圈子',
    titleUnSelectName:'圈子列表',
    titleKey:'title',
    onConfirm:function(data){	
        console.log(data)
        var temp= "";
        var ids = "";
        for(var i=0; i <data.length; i++){
        	temp += data[i].title;
        	ids += data[i].id;
        	if(i<data.length-1){
        		temp+="、";
        		ids +=",";
        	}
        }
        page.$circles.val(temp).attr('data-circlesids',ids);
    }
});

//页面事件
page.eventHandler = {
	initPage: function(){

		$.ajax({
            url: page.CONST.GET_DETAIL,
            type: 'GET',
            dataType: 'json',
            data: {
             	id: pageId
            },
            success: function(res) {
                if(res.code==0){
                	page.$title.val(res.data.title);
 
                	if(res.data.summary)page.$summary.val(res.data.summary);
                	page.$contentEditor.code(res.data.content);
                	var tempStr='';
                	for(var i =0;i<res.data.circleList.length;i++){
                		tempStr+=res.data.circleList[i].title;
                	}
                  	page.$circles.val(tempStr);
                	page.MOCK.SeletedCircles = res.data.circleList;
                }else{
                	toastr.error(res.errMsg);           
                }
            },
            error: function(res) {
            	toastr.error("检查网络！");
            }
        });  
	},
	post: function(elem){	//提交表单
		var $this = $(elem);
		$this.attr('disabled',true);
		var title = page.$title.val();
		var circle_ids = page.$circles.data('circlesids'); 
		var summary =  page.$summary.val();
		var content = page.$contentEditor.code();
	
        $.ajax({
            url: page.CONST.INSERT_SHARE,
            type: 'POST',
            dataType: 'json',
            data: {
            	'state':2,
                'title': title,
                'circle_ids': circle_ids,
              	'content': content,
              	'summary':summary
            },
            success: function(res) {
                if(res.code==='0'){
                	toastr.success('新增成功'); 
                }else{
                	toastr.error(res.errMsg);           
                }
        		$this.attr('disabled',false);
            },
            error: function(res) {
            	toastr.error("新增失败！");
            	$this.attr('disabled',false);
            }
        });   
	}
};
page.eventHandler.initPage();
    