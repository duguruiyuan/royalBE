
var page = {};
var memberData = [];
var masterDara = {};

var avatarCropper = new AvatarCropper({
	headText: '选择圈子头像',
	onConfirm: function(data){
		console.log(data);
		$('#circleAvatar').html('<img src="'+data+'" style="width:120px;height:120px">');
	}
});

function openAvatarSelect(){
	avatarCropper.open();
};


page.$master =  $('#master');//圈主数据
page.$members =  $('#members');//成员数据

//页面所用到AJAX请求的URL
page.CONST = {
	 GET_USER_LIST: helper.url.getUrlByMapping("admin/backcommon/find_userlists.shtml?x=0&y=50"),    //人员选择接口
	 INSERT_GUEST: helper.url.getUrlByMapping("admin/common/insert_guest.shtml"),                 //新增嘉宾接口
};
//页面本地变量数据
page.MOCK = {
	MasterData:[],//已选圈主数据
	MembersData:[]//已选成员数据
};
//页面级的帮助对象集合
page.derive = {
    //获取带label效果的文本节点组
    getLabelList: function (data,key) {
        var template = '';
        var index = 1;
        for(var i=0;i <data.length;i++){
            if(index === 1){
                index++;
                template +='<div class="label label-primary label-item">'+data[i][key]+'</div>';
            }else if(index === 2){
                index++;
                template +='<div class="label label-warning label-item">'+data[i][key]+'</div>';
            }else if(index === 3){
                index++;
                template +='<div class="label label-info label-item">'+data[i][key]+'</div>';
            }else if(index === 4){
                index++;
                template +='<div class="label label-danger label-item">'+data[i][key]+'</div>';
            }else if(index === 5){
                index=1;
                template +='<div class="label label-success label-item">'+data[i][key]+'</div>';
            }
        }
        return template;
    }
};


//页面事件
page.eventHandler = {
    openMasterSelect: function(){
        console.log(page.MOCK.MasterData);
        var selector = new module.multSelector({
            url: page.CONST.GET_USER_LIST,
            searchType: 1,//服务端搜索
            keyword: "",
            method: "GET",
            dataC: "data",
            keywordC: "name",
            keyC: "id",
            valueC: "name",
            tagsC: "",
            pkeyC: "",
            title: "请选择",
            selectedData: page.MOCK.MasterData,
            callback: function(data){
                //转换
                for(var i=0;i<data.length;i++){
                    data[i].name = data[i].value;
                    data[i].id = data[i].key;
                }
                //渲染
                page.$master.html(
                    page.derive.getLabelList(data,'value')
                );
            	//映射

                page.MOCK.MasterData = data;

            }
        });
    },
    openMembersSelect: function(){
        var selector = new module.multSelector({
            url: page.CONST.GET_USER_LIST,
            searchType: 1,//服务端搜索
            keyword: "",
            method: "GET",
            dataC: "data",
            keywordC: "name",
            keyC: "id",
            valueC: "name",
            tagsC: "",
            pkeyC: "",
            title: "请选择",
            selectedData: page.MOCK.MembersData,
            callback: function(data){
                //转换
                for(var i=0;i<data.length;i++){
                    data[i].name = data[i].value;
                    data[i].id = data[i].key;
                }
                //渲染
                page.$members.html(
                    page.derive.getLabelList(data,'value')
                );
                //映射

                page.MOCK.MembersData = data;

            }
        });
    }
};



/*var masterSelector = new TSelector({
    url:page.CONST.GET_USER_LIST,
    uniKey: 'id',
    titleSelectedName:'已选',
    titleUnSelectName:'成员列表',
    titleKey:'name',
    headText:'圈主选择',
    onConfirm:function(data){
    	masterData = data;
        var temp = '';
        for(var i=0;i<data.length;i++){
        	temp += data[i].name;
        	if(i<data.length-1)temp +='、';
        }
        $('#master').val(temp)
    }
});*/
/*function masterSelect(){
	masterSelector.openSelector();
};*/
/*var memberSelector = new TSelector({
    url:'backcommon/find_userlists.shtml',
    uniKey: 'id',
    titleSelectedName:'已选',
    titleUnSelectName:'成员列表',
    titleKey:'name',
    headText:'成员选择',
    onConfirm:function(data){
    	memberData = data;
        var temp = '';
        for(var i=0;i<data.length;i++){
        	temp += data[i].name;
        	if(i<data.length-1)temp +='、';
        }
        $('#members').val(temp)
    }
});*/







/*function memberSelect(){
	memberSelector.openSelector();
};*/
function post(dom){
	var $this = $(dom);
	var title = $('#circleName').val().trim('g');
	var description = $.trim($('#circleDes').val());
	var rule = $.trim($('#circleRules').val());
	var brief = $.trim($('#circleBrief').val());
	
	if(title===""){
		toastr.error("圈子名称不能为空！");
	}else if(description===""){
		toastr.error("圈子描述不能为空！");
	}else if(brief===""){
		toastr.error("圈子简介不能为空！");
	}else if(page.MOCK.MembersData.length === 0){
		toastr.error("圈子成员不能为空！");
	}else if(page.MOCK.MasterData.length === 0){
		toastr.error("圈主不能为空！");
	}else if(rule === ""){
		toastr.error("圈子规则不能为空！");
	}else{
		var User_list = [];
		for(var i=0;i<page.MOCK.MembersData.length;i++){
			var temp = {'user_id':page.MOCK.MembersData[i].id,'user_name':page.MOCK.MembersData[i].name};
			User_list.push(temp);
		}
		$this.attr("disabled",true); 
		$.ajax({
			url : helper.url.getUrlByMapping("admin/circle/insert_circle.shtml"),
			type : 'POST',
			dataType : 'json',
			data:{
				'title': title,
				'logo': '561',
				'description': description,
				'brief': brief,
				'rule': rule,
				'user_id': page.MOCK.MasterData[0].id,
				'user_name': page.MOCK.MasterData[0].name,
				'user_list': JSON.stringify(User_list)
			},
			success : function(ret) {
				if(ret.code==0){
					toastr.success("圈子新增成功！");
				}else{
					toastr.error("圈子新增失败！");
				}	
				$this.attr("disabled",false); 
			},
			error : function(ret) {
				toastr.error("圈子新增失败！");
				$this.attr("disabled",false); 
			}
		});
	}
};
