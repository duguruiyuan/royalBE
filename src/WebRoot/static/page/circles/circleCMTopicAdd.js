//初始化页面对象
var page = {};

//存储页面参数
page.tableUniId = 0;//记录本地新闻表格row的id,负数递减
//存储页面$对象
page.$form = $('#pageForm');
page.$title = $('#title');
page.$relatedLink = $('#relatedLink');
	page.$addRelatedLinkModal = $('#addRelatedLinkModal');
		page.$addRelatedLinkForm =  $('#addRelatedLinkForm');
			page.$inLink = $('#inLink');
			page.$inTitle = $('#inTitle');
			page.$outLink = $('#outLink');
			page.$outTitle = $('#outTitle');
	
page.$circles = $('#circles');
page.$briefEditor = $('#briefEditor');
page.$guestTable = $('#guestTable');//邀请嘉宾表格
	page.$addGuestModal = $('#addGuestModal');//邀请嘉宾模态
		page.$guestName = $('#guestName');//嘉宾名字字段
		page.$guestCompany = $('#guestCompany');//嘉宾公司字段
		page.$guestPosition = $('#guestPosition');//嘉宾职务字段
page.$relatedNewsTable = $('#relatedNewsTable');//相关新闻表格
	page.$addOutArtModal = $('#addOutArtModal');//相关新闻选择器模态框
		page.$addOutArtForm = $('#addOutArtForm');//相关新闻选择器表单
			page.$outArtTitle = $('#outArtTitle');//外链新闻标题
			page.$outArtLink = $('#outArtLink');//外链新闻链接

//页面所用到AJAX请求的URL
page.CONST = {
    GET_CIRCLES_LIST: helper.url.getUrlByMapping("admin/circle/find_circle_list.shtml?status=1&state=1"),     			//圈子选择接口
    INSERT_GUEST: helper.url.getUrlByMapping("admin/common/insert_guest.shtml"),                 //新增嘉宾接口   
    FIND_UERLISTS: helper.url.getUrlByMapping("admin/backcommon/find_userlists.shtml"),    //用户列表接口
    INSERT_TOPIC: helper.url.getUrlByMapping("admin/topic/insert_topic.shtml")  //新增话题
}
//页面本地变量数据
page.MOCK = {
    relatedLink:{	//后台数据映射-相关链接
				    	article_id:'',
				    	article_type:'',
				    	article_title:'',
				    	url:''
				    }
}
//表单验证
page.$form.bootstrapValidator({
    excluded: [':disabled'],
    fields: {
        title: {
            validators: {
                notEmpty: {
                    message: '标题不能为空！'
                }
            }
        },
        circles: {
            validators: {
                notEmpty: {
                    message: '圈子不能为空！'
                }
            }
        },
        relatedLink: {
            validators: {
                notEmpty: {
                    message: '选相关链接不能为空！'
                }
            }
        },

    }
});
//相关链接表单验证
page.$addRelatedLinkForm.bootstrapValidator({
    excluded: [':disabled'],
    fields: {
    	inLink: {
            validators: {
                notEmpty: {
                    message: '不能为空！'
                }
            }
        },inTitle: {
            validators: {
                notEmpty: {
                    message: '不能为空！'
                }
            }
        },outLink: {
            validators: {
                notEmpty: {
                    message: '不能为空！'
                }
            }
        },outTitle: {
            validators: {
                notEmpty: {
                    message: '不能为空！'
                }
            }
        }
    }
});

//初始化富文本编辑器
page.$briefEditor.summernote({
    height: 300
});


//表单选项框radio、check等初始化样式
$(".i-checks")
    .iCheck({checkboxClass:"icheckbox_square-green", radioClass:"iradio_square-green"})
    .on("ifChecked", function (evt) {
        var $this = $(this);
        var radName = $this.attr("name");
        var radId = $this.attr("id");
        $("[name=" + radName + "]:not(#" + radId + ")").removeAttr("checked");
        $this.attr("checked", "checked");
        if(radName == "radType"){
            $("#inArtContainer").slideToggle("fast");
            $("#outArtContainer").slideToggle("fast");
        }
});

//初始化长短文的面板隐藏切换
$("[name=radType]:checked").attr("id") == "radType1" ? $("#inArtContainer").hide() : $("#outArtContainer").hide();

//存储页面表单服务
/*page.formData = {
	update: function(){
		return {
			title: $('#title').val(),
			circles:{
				views: $('#title').val(),
				ids: $('#title').data('ids'),
			},
			relativeLink: $('#relativeLink').val(),
			brief: {}
		}
	},
	post: function(){
		
	}
}*/
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

/*page.outArtSelector = new ArticleSelector({
    headText: '文章选择',
    onConfirm:function(data){  	
    	page.$relatedNewsTable.bootstrapTable('append',data); 
        console.log(data)
    }
});	
//初始化相关链接文章选择器
page.relatedSelector = new ArticleSelector({
    headText: '文章选择',
    onConfirm:function(data){  
    	page.$inLink.val(data.title);
    	page.$inLink.attr('data-id', data.id);
    }
});*/

page.articleSelector = new ArticleSelector({
    headText: '文章选择',
    onConfirm:function(data,type){  
    	//type:,0相关链接；1相关新闻;
    	console.log(type)
    	if(type==1){
    		page.$relatedNewsTable.bootstrapTable('append',data); 
            console.log(data)
    	}else{
    		page.MOCK.relatedLink.article_title = data.title;
    		page.MOCK.relatedLink.article_id = data.obj_id;
    		page.MOCK.relatedLink.article_type = data.obj_type;
        	page.$inLink.val(data.title);
        	page.$inLink.attr('data-id', data.id);
    	}

    }
});
//页面事件
page.eventHandler = {
	_table: {    //表格事件
		moveUp: function($table,value, row, index){	//表格row上移
		 	var data = $table.bootstrapTable('getData'); 
		    	data[index] = data.splice(index-1,1,data[index])[0];
		    	$table.bootstrapTable('load',data); 
		},
		delete: function($table,value, row, index){	//表格row删除
			$table.bootstrapTable('removeByUniqueId', row.id);  
		},
		detail: function(){
			
		}
	},
	_relatedLink: {	//相关链接模块
		add: function(){ //确认选择
			console.log($("[name=radType]:checked").val())
			var selectType = $("[name=radType]:checked").val();
			if(selectType==1){
			
				console.log(page.$inTitle.val())
	    		page.MOCK.relatedLink.article_title = page.$outTitle.val();
	    		page.MOCK.relatedLink.url = page.$outLink.val();
				page.$relatedLink.val(page.$outTitle.val());
			}else{	
				console.log(page.$inTitle.val())
				page.$relatedLink.val(page.$inTitle.val());
	
			}
				
		}
	},
	_guest: {	//嘉宾模块
		openAdd: function(){		//打开新增嘉宾填写面板
			page.$guestName.val('');
			page.$guestCompany.val('');
			page.$guestPosition.val('');
			page.$addGuestModal.modal('show');
		},
		openSelect: function(){  //打开嘉宾选择面板
			if(page.$circles.val()===""){
				toastr.warning('请先选择圈子再选择嘉宾');
			}else{
				//var circleids = JSON.stringify(page.$guestTable.attr('data-circlesids'));
				var circleids = page.$circles.data('circlesids');
			
				page.guestSelector.openSelector({
					circleids:circleids
				});	
			}		
		},
		create: function(elem){	//向后添加嘉宾并返回嘉宾数据
		    	var user_name = page.$guestName.val();
		    	var user_company = page.$guestCompany.val();
		    	var user_identity = page.$guestPosition.val();
		    	$(elem).attr('disabled',true);
		        $.ajax({
		            url : page.CONST.INSERT_GUEST,
		            type : 'POST',
		            dataType : 'json',
		            data:{
		                'user_name': user_name,
		                'user_company': user_company,
		              	'user_identity': user_identity,
		            },
		            success : function(res) {
		                if(res.code==='0'){
		                		var temp = {};
		                		temp.id = res.data.id;
		                		temp.name = res.data.user_name;
		                		temp.companywork = res.data.user_identity;
		                		temp.company = res.data.user_company; 
		                		temp.user_type = 1;  
		                	    page.$guestTable.bootstrapTable('append', temp);
		                	    page.$addGuestModal.modal('hide');
		                }else{
		                	toastr.error(res.errMsg);
		               
		                }
		                $(elem).attr('disabled',false);
		            },
		            error : function(res) {
		            	toastr.error("添加嘉宾失败！");
		            	$(elem).attr('disabled',false);
		            }
		        });   
		}
	},
	_relatedNews: {	//相关新闻
		openAdd: function() {
			page.$outArtTitle.val('');
	    	page.$outArtLink.val('');
	    	page.$addOutArtModal.modal('show');
	    },
	    insert: function(){  		    //插入新增外链文章
	    	page.tableUniId--;
			var temp = {
				id: page.tableUniId,
				title:	page.$outArtTitle.val(),
				url: page.$outArtLink.val()
			};
			page.$relatedNewsTable.bootstrapTable('append', temp);       	
			page.$addOutArtModal.modal('hide');
		}
	},
	post: function(elem, type){	//提交表单
		//type:2保存，3保存草稿
		var $this = $(elem);
		$this.attr('disabled',true);
		var temp = [];
			temp.push(page.MOCK.relatedLink);
		var title = page.$title.val();
		var circle_ids = page.$circles.data('circlesids');
		var content = page.$briefEditor.code();
		console.log(temp);
		var relatedUrl = temp;
		console.log(temp);
		var guest = page.$guestTable.bootstrapTable('getData');
		var related = page.$relatedNewsTable.bootstrapTable('getData');	
        $.ajax({
            url : page.CONST.INSERT_TOPIC,
            type : 'POST',
            dataType : 'json',
            data:{
            	'state':type,
                'title': title,
                'circle_ids': circle_ids,
              	'content': content,
              	'relatedUrl':JSON.stringify(relatedUrl),
              	'guest':JSON.stringify(guest),
              	'related':JSON.stringify(related)
            },
            success : function(res) {
                if(res.code==='0'){
                	toastr.success('新增成功'); 
                }else{
                	toastr.error(res.errMsg);           
                }
        		$this.attr('disabled',false);
            },
            error : function(res) {
            	toastr.error("新增失败！");
            	$this.attr('disabled',false);
            }
        });   
	}
}
/*
 * 邀请嘉宾表格初始化
 *
 */
page.$guestTable.bootstrapTable({	
    detailView: false,
   // classes: 'table table-hover table-no-bordered',
    data:[],
   // height: 300,//高度
    pagination: true,//是否分页
    pageSize: 10,//单页记录数
    pageList: [10,60,100],//分页步进值
    sidePagination: "client",//服务端分页
    undefinedText: "—",//为空的填充字符
    uniqueId: 'id',
    columns: [{
        field: 'name',
        title: '姓名',
        align: 'center'
    }, {
        field: 'company',
        title: '单位',
        align: 'center'
    },{
        field: 'companywork',
        title: '职务',
        align: 'center'
    },{
        field: '操作',
        title: '删除',
        align: 'center',
        width: '134px',
        formatter:function(value, row, index){	        	  	
            var strHtml=' <button type="button" class="del btn btn-sm btn-danger">删除</button>'; 
                strHtml+= (index === 0)? "":' <button type="button" class="moveUp btn btn-sm btn-info">上移</button>';
            return strHtml;
        },
        events: {
    		//上移
            'click .moveUp':function (e, value, row, index) { 
            	page.eventHandler._table.moveUp(page.$guestTable, value, row, index)
            },
            //删除
            'click .del': function (e, value, row, index) {
            	page.eventHandler._table.delete(page.$guestTable, value, row, index)     
            }
        }
    }]
});
 /*
 * 嘉宾选择器初始化
 *
 */
page.guestSelector = new TSelector({
    headText: '嘉宾选择',
    url: page.CONST.FIND_UERLISTS,
    uniKey: 'id',
    titleSelectedName:'已选嘉宾',
    titleUnSelectName:'嘉宾列表',
    titleKey:'name',
    onConfirm:function(data){
       	for(var i=0;i<data.length;i++){
    		data[i].user_type = 0;//普通用户
    	}
    	page.$guestTable.bootstrapTable('append', data);           
    }
});
 
 /*
 * 关联新闻表格初始化
 *
 */

page.$relatedNewsTable.bootstrapTable({	
    detailView: false,
   // classes: 'table table-hover table-no-bordered',
    data:[],
    //dataField: "data",//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
    pagination: true,//是否分页
    pageSize: 10,//单页记录数
    pageList: [10,60,100],//分页步进值
    sidePagination: "client",//服务端分页
    undefinedText: "—",//为空的填充字符
    uniqueId: 'id',
    columns: [{
        field: 'title',
        title: '显示标题',
        align: 'center'
    }, {
        field: 'title',
        title: '原标题',
        align: 'center'
    },{
        field: 'state',
        title: '状态',
        align: 'center',
        formatter: function(value, row, index){
        	switch(value){    	
    			case 1: return '<span class="label label-success">审核</span>';break;
    			case 2: return '<span class="label label-primary">待审核</span>';break;
    			case 3: return '<span class="label label-warning">草稿</span>';break;
    			case 4: return '<span class="label label-danger">审核失败</span>';break;
    			default: return '';
        	}
        }
    },{
        field: 'url',
        title: '来源',
        align: 'center',
        formatter: function(value, row, index){
        	if(value===undefined||value===""){
        		return '站内文章';
        	}else{
        		return '站外文章';
        	}
        }
    },{
        title: '操作',
        align: 'center',           
        width: '150px',
        formatter:function(value, row, index){
            var strHtml=' <button type="button" class="detail J_menuItem btn btn-sm btn-primary" data-title="我是标题" data-index="'+row.url+'">查看</a>';
            strHtml += ' <button type="button" class="del btn btn-sm btn-danger">删除</button>';
            strHtml+= (index === 0)? '':' <button type="button" class="moveUp btn btn-sm btn-info">上移</button>';
            return strHtml;
        },
        events: {
            'click .detail': function (e, value, row, index) {            	//查看
            			
            },
            'click .moveUp': function (e, value, row, index) {       		//上移
             	page.eventHandler._table.moveUp(page.$relatedNewsTable, value, row, index)
            },
            'click .del': function (e, value, row, index) {                //删除
             	page.eventHandler._table.delete(page.$relatedNewsTable, value, row, index)      
            }
        }
    }]
});

 
    
    
  