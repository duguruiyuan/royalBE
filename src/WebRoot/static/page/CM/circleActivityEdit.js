//初始化页面对象
var page = {};

//存储页面dom对象

page.$activityForm = $('#activityForm');
	page.$title = $('#title');
	page.$circlesList =  $('#circlesList');
	page.$startTime =  $('#startTime');
	page.$endTime =  $('#endTime');
	page.$place =  $('#place');
	page.$guestList = $('#guestList');//嘉宾表格
	page.$addGuestModal = $('#addGuestModal');//邀请嘉宾
		page.$addGuestForm =  $("#addGuestForm");//邀请嘉宾表格
			page.$guestName = $('#guestName');
			page.$guestCompany = $('#guestCompany');
			page.$guestPosition = $('#guestPosition');
			
	page.$addOutArtModal = $('#addOutArtModal');//站外文章模态框
		page.$addOutArtForm = $('#addOutArtForm');//站外文章表格
			page.$outArtTitle = $('#outArtTitle');
			page.$outArtLink = $('#outArtLink');	
		
	page.$editorContainer = $('#editorContainer');//内容编辑器
	page.$relationArtList = $('#relationArtList');//关联文章表格
	page.$goodArtList = $('#goodArtList');//精彩内容表格


	page.$addGoodModal = $('#addGoodModal');//精彩内容模态框
		page.$editorGoodContainer = $('#editorGoodContainer');//精彩内容编辑器   

	
//页面静态变量CONST设置
page.CONST = {
	GET_DETAIL:	helper.url.getUrlByMapping("admin/activity/find_activity_detail.shtml"),  //获取详情接口
    GET_CIRCLES_LIST: helper.url.getUrlByMapping("admin/circle/find_circle_list.shtml?status=1&state=1"),     			//圈子选择接口
    INSERT_GUEST: helper.url.getUrlByMapping("admin/common/insert_guest.shtml"),                 //新增嘉宾接口   
    FIND_UERLISTS: helper.url.getUrlByMapping("admin/backcommon/find_userlists.shtml"),    //用户列表接口
    INSERT_ARTICLE:	helper.url.getUrlByMapping("activity/insert_activity.shtml"),  //编辑后提接口
    
    UPLOAD_BUCKET: "miwen"  //存储密文图片的目录
}
//页面数据
page.MOCK = {
	tableUniId: 0, //用于删除本地数据用;
	
	title: '',
	content:'',
	place:'',
	GuestList:[],
	_Circles:{
		Selected: [],//保存选中的圈子数据
		ids: "",//选中圈子的id字符串
	},
	_Date:{
		startTime:"",
		endTime:''
	},
};
//页面级的帮助对象集合
page.derive = {
    //获取表单参数包含搜索
	//新增嘉宾表单重置
	resetGuestAdd: function(){
	   	page.$guestName.val('');
    	page.$guestCompany.val('');
    	page.$guestPosition.val('');
	}	
};
//日期选择
laydate({
    elem: '#startTime',
    format: 'YYYY/MM/DD hh:mm:ss',
    min: '1990-06-16 23:59:59', //设定最小日期为当前日期
    max: '2099-06-16 23:59:59', //最大日期
    istime: true,
    istoday: false,
    choose: function (data) {
       //end.min = datas; //开始日选好后，重置结束日的最小日期
        //end.start = datas //将结束日的初始值设定为开始日
    }
});
laydate({
    elem: '#endTime',
    format: 'YYYY/MM/DD hh:mm:ss',
    min: '1990-06-16 23:59:59', //设定最小日期为当前日期
    max: '2099-06-16 23:59:59',
    istime: true,
    istoday: false,
    choose: function (data) {
        //start.max = datas; //结束日选好后，重置开始日的最大日期
    }
});

page.eventHandler = {
	getData: function(){
		$.ajax({
            url: page.CONST.GET_DETAIL,
            type: 'GET',
            dataType: 'json',
            data: {
             	id: pageId
            },
            success: function(res) {
                if(res.code==0){
                	console.log(res.data)
                	page.MOCK._Circles.Selected = res.data.circleList;
                   	page.MOCK._Date.startTime = res.data.start_time;
                	page.MOCK.title = res.data.title;
                	page.MOCK.content = res.data.content;
                   	page.MOCK.place = res.data.place;
                 	page.MOCK.GuestList = res.data.guestList;

                	page.eventHandler.renderPage();
                 	
                	/*page.$title.val(res.data.title);
 
                	if(res.data.summary)page.$summary.val(res.data.summary);
                	page.$contentEditor.code(res.data.content);
                	var tempStr='';
                	for(var i =0;i<res.data.circleList.length;i++){
                		tempStr+=res.data.circleList[i].title;
                	}
                  	page.$circles.val(tempStr);
                	page.MOCK.SeletedCircles = res.data.circleList;*/
                }else{
                	toastr.error(res.errMsg);           
                }
            },
            error: function(res) {
            	toastr.error("检查网络！");
            }
        });  
	},
	renderPage: function(){
		page.$title.val(page.MOCK.title);
		var temp="";
		for(var i=0;i<page.MOCK._Circles.Selected.length;i++){
			temp += page.MOCK._Circles.Selected[i].title;
			page.MOCK._Circles.ids += page.MOCK._Circles.Selected[i].id;
        	if(i<page.MOCK._Circles.Selected.length-1){
        		temp+="、";
        		page.MOCK._Circles.ids +=",";
        	}
		}
		page.$circlesList.val(temp);

	
		page.$startTime.val(moment(page.MOCK._Date.startTime).format('YYYY-MM-DD HH:mm:ss'));
		page.$endTime.val(moment(page.MOCK._Date.endTime).format('YYYY-MM-DD HH:mm:ss'));
		page.$place.val(page.MOCK.place);
		page.$guestList.bootstrapTable('load',page.MOCK.GuestList);

		page.$editorContainer.code(page.MOCK.content);
	///	page.$editorGoodContainer
		//page.$relationArtList = $('#relationArtList');//关联文章表格
		//page.$goodArtList = $('#goodArtList');//精彩内容表格
		
		//page.$outArtTitle = $('#outArtTitle');//站外文章标题，站外文章
		//page.$outArtLink = $('#outArtLink');	
		

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
	},
	postOld:function(){
		var $this = $(dom);
		$this.attr('disabled',true);
		var title = $title.val();
		var start_time = moment($startTime.val()).format('X');
		var end_time = moment($endTime.val()).format('X');
		var place = $place.val();
		var circle_ids = $circlesList.data('circlesids');
		var content = $editorContainer.froalaEditor('html.get', true);
		var guest = $guestList.bootstrapTable('getData');
		var summary = $goodArtList.bootstrapTable('getData');
		var related = $relationArtList.bootstrapTable('getData');	
        $.ajax({
            url : "activity/insert_activity.shtml",
            type : 'POST',
            dataType : 'json',
            data:{
            	'state':2,
                'title': title,
                'circle_ids': circle_ids,
                'start_time': start_time,
              	'end_time': end_time,
              	'place':place,
              	'content': content,
              	'guest':JSON.stringify(guest),
              	'summary':JSON.stringify(summary),
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
	},
    //打开嘉宾选择面板
	openGuestSelector: function(){  	
    	if(page.MOCK._Circles.ids ===""){
    		toastr.warning('请先选择圈子再选择嘉宾');
    	}else{
    		page.circlesSelector.update(page.MOCK._Circles.Selected);
    
    		page.guestSelector.openSelector({
    			circleids:page.MOCK._Circles.ids
    		});	
    	}
    },
    //打开新增嘉宾选择面板
	openGuestAdd:function(){
		page.derive.resetGuestAdd();
    	page.$addGuestModal.modal('show');
    },
    //向后添加嘉宾并返回嘉宾数据
    sendGuestAdd:function (elem){
    	var $this = $(elem);
    	$this.attr('disabled',true);
        $.ajax({
            url : "common/insert_guest.shtml",
            type : 'POST',
            dataType : 'json',
            data:{
                'user_name': page.$guestName.val(),
                'user_company': page.$guestCompany.val(),
              	'user_identity': page.$guestPosition.val(),
            },
            success : function(res) {
                if(res.code==='0'){
            		res.data.user_type = 1;  
            	    page.MOCK.GuestList.push(res.data);
              	    page.$guestList.bootstrapTable('append', res.data);
            	    page.$addGuestModal.modal('hide');
                }else{
                	toastr.error(res.errMsg);  
                }
                $this.attr('disabled',false);
            },
            error : function(res) {
            	toastr.error("添加嘉宾失败！");
                $this.attr('disabled',false);
            }
        });   
    }
}   
page.circlesSelector = new TSelector({
    headText: '圈子选择',
    url: page.CONST.GET_CIRCLES_LIST,
    uniKey: 'id',
    titleSelectedName:'已选圈子',
    titleUnSelectName:'圈子列表',
    titleKey:'title',
    onConfirm:function(data){
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
        page.$circlesList.val(temp);
    	page.MOCK._Circles.Selected = data;
       	page.MOCK._Circles.ids = ids;
       // page.$circlesList.attr('data-circlesids',ids);
    }
});
    
//初始化富文本编辑器
page.$editorContainer.summernote({
    height: 300
});
//初始化富文本编辑器
page.$editorGoodContainer.summernote({
    height: 300
});
//初始化文章选择器
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

/*
 * 邀请嘉宾表格初始化
 *
 */
page.$guestList.bootstrapTable({	
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
    },{
        field: '操作',
        title: '删除',
        align: 'center',
        width: '134px',
        formatter:function(value, row, index){	        	
        	//   $table.bootstrapTable('removeByUniqueId', id);      	
            var strHtml=' <div class="bars flex-row-start"> <button type="button" class="del btn btn-sm btn-danger">删除</button>'; 
                strHtml+= (index === 0)? '</div>':' <button type="button" class="moveUp btn btn-sm btn-info">上移</button></div>';
            return strHtml;
        },
        events: {
    		//上移
            'click .moveUp': function (e, value, row, index) {
    		 	var data = page.$guestList.bootstrapTable('getData'); 
       	    	data[index] = data.splice(index-1,1,data[index])[0];
       	    	page.$guestList.bootstrapTable('load',data); 
            },
            //删除
            'click .del': function (e, value, row, index) {
            	page.$guestList.bootstrapTable('removeByUniqueId', row.id); 
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
       	page.MOCK.GuestList = page.MOCK.GuestList.concat(data);
    	//page.$guestList.bootstrapTable('refresh'); 
    	page.$guestList.bootstrapTable('append', data);           
    }
});

    //上移嘉宾
 
//嘉宾添加表单验证
page.$addGuestForm.bootstrapValidator({
    excluded: [':disabled'],
    fields: {
    	guestName: {
            validators: {
                notEmpty: {
                    message: '请输入姓名！'
                }
            }
        },
        guestCompany: {
            validators: {
                notEmpty: {
                    message: '请输入单位地址！'
                }
            }
        },
        guestPosition: {
            validators: {
                notEmpty: {
                    message: '请输入单位职务！'
                }
            }
        },

    }
});
 /*
 * 关联表格初始化
 *
 */

page.$relationArtList.bootstrapTable({	
    detailView: false,
   // classes: 'table table-hover table-no-bordered',
    data:[],
    dataField: "data",//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
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
        width: '134px',
        formatter:function(value, row, index){	      
            var strHtml='<div class="flex-row-start"> <a class="J_menuItem_other btn btn-sm btn-primary" href_url="'+ row.url +'"  data-view="win" data-index="'+row.url+'">查看</a>';
            strHtml += ' <button type="button" class="del btn btn-sm btn-danger">删除</button>';
            strHtml+= (index === 0)? '</div>':' <button type="button" class="moveUp btn btn-sm btn-info">上移</button></div>';
            return strHtml;
        },
        events: {
    		//上移
            'click .moveUp': function (e, value, row, index) {
    		 	var data = $relationArtList.bootstrapTable('getData'); 
       	    	data[index] = data.splice(index-1,1,data[index])[0];
       	    	$relationArtList.bootstrapTable('load',data); 
            },
            //删除
            'click .del': function (e, value, row, index) {
            	swal({
          	        title: "您确定要删除选中的信息吗？",
          	        text: rowDate.title,
          	        type: "warning",
          	        showCancelButton: true,
          	        confirmButtonColor: "#DD6B55",
          	        confirmButtonText: "删除",
          	        cancelButtonText:'取消',
          	        closeOnConfirm: false
          	    }, function () {
          	    	 swal({title:"删除成功", text: "1s后自动消失...", type: "success", timer: 1000});  
          	      	$relationArtList.bootstrapTable('removeByUniqueId', row.id); 
          	    });  
         
            }
        }
    }]
});
	
   //外链文章表单验证
page.$addOutArtForm.bootstrapValidator({
    excluded: [':disabled'],
    fields: {
    	outArtTitle: {
            validators: {
                notEmpty: {
                    message: '不能为空！'
                }
            }
        },
        outArtLink: {
            validators: {
                notEmpty: {
                    message: '不能为空！'
                }
            }
        }
    }
});

    //打开新增外链文章
    function openArtAdd(){
    	$outArtTitle.val('');
    	$outArtLink.val('');
    	outArtFormValidator.resetForm();
    	$addOutArtModal.modal('show');
    }
    
    //插入新增外链文章
    function insertArtAdd(){
    	tableUniId--;
		var temp = {
			id: tableUniId,
			title: $outArtTitle.val(),
			url: $outArtLink.val()
		};
	   $relationArtList.bootstrapTable('append', temp);       	
 	   $addOutArtModal.modal('hide');
    }
    
page.outArtSelector = new ArticleSelector({
    headText: '文章选择',
    onConfirm:function(data){  	
    	$relationArtList.bootstrapTable('append',data); 
        console.log(data)
    }
});
    
    //打开文章选择面板
    function openArtSelector(){
    	outArtSelector.openSelector();	
    }
 /*
 * 精彩内容表格初始化
 *
 */
page.$goodArtList.bootstrapTable({	
    detailView: false,
   // classes: 'table table-hover table-no-bordered',
    data:[],
    pagination: true,//是否分页
    pageSize: 10,//单页记录数
    pageList: [10,60,100],//分页步进值
    sidePagination: "client",//服务端分页
    undefinedText: "—",//为空的填充字符
    uniqueId: 'id',
    columns: [{
        field: 'content',
        title: '内容',
        align: 'center'
    }, {
        field: 'company',
        title: '发布人',
        align: 'center'
    },{
        field: 'create_time',
        title: '发布时间',
        align: 'center',
        formatter: function(value, row, index){
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
        },
    },{
        title: '操作',
        align: 'center',
        width: '134px',
        formatter:function(value, row, index){	      
            var strHtml='<div class="flex-row-start"> <a class="J_menuItem_other btn btn-sm btn-primary" href_url="'+ row.url +'"  data-view="win" data-index="'+row.url+'">查看</a>';
            strHtml += ' <button type="button" class="del btn btn-sm btn-danger">删除</button>';
            return strHtml;
        },
        events: {
        //删除
        'click .del': function (e, value, row, index) {
         	swal({
      	        title: "您确定要删除选中的信息吗？",
      	        text: rowDate.title,
      	        type: "warning",
      	        showCancelButton: true,
      	        confirmButtonColor: "#DD6B55",
      	        confirmButtonText: "删除",
      	        cancelButtonText:'取消',
      	        closeOnConfirm: false
      	    }, function () {
      	    	 swal({title:"删除成功", text: "1s后自动消失...", type: "success", timer: 1000});  
      	     	$goodArtList.bootstrapTable('removeByUniqueId', row.id); 
              	    });  
 
                }
            }
        }]
    });
	 
	
//打开精彩内容编辑器
function openAddGoodModal(){
    $addGoodModal.modal('show');
    }
    
  
    //插入精彩内容
function insertAddGood(){
	var content = $editorGoodContainer.froalaEditor('html.get', true);
	console.log(content)
	tableUniId--;
	var temp = {
		id: tableUniId,
		create_time: new Date().getTime(),
		content: content
	}
	$goodArtList.bootstrapTable('append',temp); 
	$addGoodModal.modal('hide'); 
}
     
page.eventHandler.getData();
    
    
    
    
    

    