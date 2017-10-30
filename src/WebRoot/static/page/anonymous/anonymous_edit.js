var page = {};
var addressData = [];
require(['base', 'jquery', 'helper', 'iCheckPlus', 'toastr', 'validator', 'module.fileUpload'], function (bs, $, helper, iCheck, toastr) {
    var module = {
    		fileUpload: require('module.fileUpload')
        };
//页面所用到配置
page.CONFIG = {
	ADD_API: helper.url.getUrlByMapping("admin/anonymous/update_anonymous.shtml"),                     //新增匿名主题接口
	DETAIL_API: helper.url.getUrlByMapping("admin/anonymous/get_anonymous.shtml"),                     //匿名主题详情接口
	RELATION: "anonymousview.shtml",                                        //关联的打开窗口
    UPLOAD_BUCKET: "debug"  //存储图片的目录
};
page.id = helper.url.queryString("id");
page.fileUpload = null;

page.$form = $('#frmAddCiphertext');
page.$button = $('#divAction button');

//页面事件
page.eventHandler = {
	//初始化编辑模式下获取页面内容
	initPageInfo: function () {
		page.assist.initDataBind();
	},
	
	doSubmit: function () {
		var bv = page.$form.data('bootstrapValidator');
        //手动触发验证
        bv.validate();
        if(bv.isValid()){
    		var files=page.fileUpload.getFiles();
    		var data ={};
    		data.id=page.id;
    		data.name=$('#name1').val();;
    		data.url="";
    		if(files.length>0)
    			data.url=files[0];
    		page.assist.submitStatus(true);
    	     $.ajax({  
    	          url: page.CONFIG.ADD_API,  
    	            type : 'POST',
    	            data: data,
    	            dataType : 'json',
    	          success: function (data) {  
    				if(data.code == 0){
    					helper.win.changeQuoto({msg: "修改成功!", relation:page.CONFIG.RELATION});
    				}else{
    		    		toastr.error("修改失败!", data.errMsg);
    				} 
    	          },  
    	          error: function (returndata) {  
    		    		toastr.error("操作失败!", "操作失败，请联系管理员");
    	          },
    	          complate: function () {
    	        	  page.assist.submitStatus(false);
    	          }
    	     }); 
        }
      	//验证未通过
        bv.getInvalidFields().focus();
//		var name = $('#name1').val();
//		if(name==''){
//    		$('#name1').focus();
//    		toastr.error("操作失败!", '匿名主题不能为空');
//    		return;
//		}
	}
};

//页面辅助类/方法/属性
page.assist = {
	//初始化数据绑定
	initDataBind: function () {

		//获取修改记录信息
		 $.ajax({
	         url:page.CONFIG.DETAIL_API,
	         dataType: 'json',
	         type: 'post',
	         data:{
	             "id":page.id
	         },
	         success:function(res){
	       	  	if(res.code == 0){
		       	  	$('#id').val(res.data.id);
		            $('#name').val(res.data.name);
		            $('#name1').val(res.data.name);
	           	}
	         },
	         error: function(res){
	        	 console.log(res.data.id);
	         }
	     });
		 
		page.assist.initUpload();
		page.assist.submitStatus(false);
	},
	
    //初始化七牛完成，编辑模式下加载数据完成，以上两者都完成后才初始化上传组件
    initUpload: function () {
        if(page.assist.initFlag.QINIU == 1){
            //上传（图片）组件初始化
            page.fileUpload = new module.fileUpload({
                container: "#fileSelector",
                isUnique:true,
                fileType:"doc",
                existFiles: [],
                completeCallback:function(data){
                	console.log("file",data);
                }
            });
        }
    },
    initFlag: {QINIU: 0},
    
	//变更各个操作按钮操作状态
    submitStatus: function (type) {
        if(type){
            //提交
            page.$button.attr("disabled", "disabled");
            toastr.info("提交中，请稍候...");
            return;
        }

        //提交完成/失败
        page.$button.removeAttr("disabled");
    }
};

$(document).ready(function(){
    //初始化获取七牛存储token
    var qiniu = new helper.qiniu.token(page.CONFIG.UPLOAD_BUCKET, function () {
    	page.assist.initFlag.QINIU = 1;
        page.assist.initUpload();
    });
    //当页面打开时每半个小时重新获取一次七牛token
    setInterval(function(){
        qiniu.getToken();
    }, 30*60*1000);

    //初始化页面渲染内容
    page.eventHandler.initPageInfo();

    //表单验证初始化
    page.$form.bootstrapValidator({
        //指定不验证的情况
        excluded: [':disabled', ':hidden', ':not(:visible)'],
        message: '验证未通过',
        feedbackIcons: {/*输入框不同状态，显示图片的样式*/
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {/*验证*/
        	name1: {/*键名username和input name值对应*/
                message: '主题名称验证不通过',
                validators: {
                    notEmpty: {/*非空提示*/
                        message: '主题名称不能为空'
                    },stringLength:{
                        max: 200,
                        message: "主题名称不能超过200个字"
                    }
                }
            }
        }
    });
    
   //取消
   $("#btnCancel").click(helper.win.close);
   
//   $("#add_dict").click(page.eventHandler.doSubmit());
});
});
function selectfile(){
    $("#selectname").empty().html($("#upload_btn").val());
}

function exportxls(){
     location.href = '<%=basePath%>admin/anonymous/download_anonymous.shtml';
}
        