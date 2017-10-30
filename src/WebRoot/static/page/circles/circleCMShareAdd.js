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
page.ajaxUrl = {
    GET_CIRCLES_LIST: helper.url.getUrlByMapping("admin/circle/find_circle_list.shtml?status=1&state=1"),     			//圈子选择接口
    INSERT_SHARE: helper.url.getUrlByMapping("admin/circle_share/insert_share.shtml")  //新增话题
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
//初始化富文本编辑器插件
page.$contentEditor.froalaEditor({
    height: 290,
    theme: 'gray',
    language: 'zh_cn',
    allowedImageTypes: ["jpeg", "jpg", "png", "gif"],
    imageUploadURL: '/admin/upload.shtml',
    imageUploadParams: {savePath:"notice"},
    imageMaxSize: 1024*1024*5,
    imageDefaultWidth : 0
}).on('froalaEditor.image.uploaded', function (e, editor, response) {

}).on('froalaEditor.image.beforeUpload', function (e, editor, images) {

}).on('froalaEditor.image.error', function (e, editor, error) {

});

//初始化圈子选择器
page.circlesSelector = new TSelector({
    headText: '圈子选择',
    url: page.ajaxUrl.GET_CIRCLES_LIST,
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
	post: function(elem, type){	//提交表单
        //type:2,提交审核，3保存草稿
		var $this = $(elem);
		$this.attr('disabled',true);
		var title = page.$title.val();
		var circle_ids = page.$circles.data('circlesids'); 
		var summary =  page.$summary.val();
		var content = page.$contentEditor.froalaEditor('html.get', true);
	
        $.ajax({
            url: page.ajaxUrl.INSERT_SHARE,
            type: 'POST',
            dataType: 'json',
            data: {
            	'state':type,
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
}
    