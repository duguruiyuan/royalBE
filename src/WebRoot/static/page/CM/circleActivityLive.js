//初始化页面对象
var page = {};

//存储页面$对象
page.$liveContainer = $('#liveContainer');
page.$liveLoader = $('#liveLoader');
page.$liveControl = $('#liveControl');//直播开启关闭按钮
//输入面板
page.$inputContainer = $('#inputContainer'); //aria-expanded表示打开关闭状态标志
	page.$citeBox = $('#citeBox');//引用bar
		page.$citeContent = $('#citeContent');//引用content容器
//	page.$inputEditor = $('#inputEditor');
	page.editor = null;

//直播置顶模态框
page.$setTopModal = $('#setTopModal');
    page.$setTopForm = $('#setTopForm');
    page.$topStartTime = $('#topStartTime');
    page.$topEndTime = $('#topEndTime');
    page.$setDoneBox = $('#setDoneBox');

//日期选择
laydate({
    elem: '#topStartTime',
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
    elem: '#topEndTime',
    format: 'YYYY/MM/DD hh:mm:ss',
    min: '1990-06-16 23:59:59', //设定最小日期为当前日期
    max: '2099-06-16 23:59:59',
    istime: true,
    istoday: false,
    choose: function (data) {
        //start.max = datas; //结束日选好后，重置开始日的最大日期
    }
});





//页面所用到AJAX请求的URL
page.CONST = {
    /* GET_CIRCLES_LIST: helper.url.getUrlByMapping("admin/circle/find_circle_list.shtml?status=1&state=1"),     			//圈子选择接口
     INSERT_GUEST: helper.url.getUrlByMapping("admin/common/insert_guest.shtml"),                 //新增嘉宾接口   
     FIND_UERLISTS: helper.url.getUrlByMapping("admin/backcommon/find_userlists.shtml"),    //用户列表接口*/
    GET_DETAIL:helper.url.getUrlByMapping("admin/activity/find_activity_feed_tmp.shtml"),  //查询活动直播信息流置顶等状态
    READ: helper.url.getUrlByMapping("admin/activity/find_activity_live.shtml"),  //查询活动直播内容
    INSERT: helper.url.getUrlByMapping("admin/activity/insert_activity_live.shtml"),  //添加，引用直播内容
    UPDATE: helper.url.getUrlByMapping("admin/activity/update_activity_live_adopt.shtml"),  //修改采纳、删除直播内容
    TOGGLE_LIVE: helper.url.getUrlByMapping("admin/activity/update_activity_live.shtml"),  //开启关闭直播
    //SET_S_TOP: helper.url.getUrlByMapping("admin/activity/insert_activity_live_feed.shtml"),  //设置信息流大置顶
    //SET_FEED_TOP: helper.url.getUrlByMapping("admin/activity/insert_activity_feed_tmp.shtml")  //设置直播信息流置顶
    SET_FEED_TOP: helper.url.getUrlByMapping("admin/common/commont_push.shtml")  //设置直播信息流置顶
};
//页面本地变量数据
page.MOCK = {
    isLive: false,   //直播开启关闭标志位
    size:0, //记录当前加载的最后一条数据
    step: 5,	//步进量
    Data:[],//存储直播数据
    //inputStatus: false,//记录当前输入面板切换状态，false表示关闭，true表示打开
    inputType: 0,//记录当前输入面板状态，0表示新增，1表示引用
    citeData: {
        reply_id: '',//被恢复人ID
        reply_name: '',//被恢复人ID
        reply_content:''//被引用的内容//记录最后一次被引用人的数据	
    },
    topStatus: 0,   //是否推送信息流置顶，0表示没有，1表示有正在审核，2表示审核已经通过
    topData: {//置顶需要传输的数据映射
        title: '',//被恢复人ID
        summary: '',//被恢复人ID
        image:'',//被引用的内容//记录最后一次被引用人的数据
        extra1:{
            start_time:"",
            end_time:"",
            place:"",
            address:"",
            guest:[],
            circle:[],
            is_live:1,
            is_start: 1
        },
        extra:"",
        circle_nr_ids:"",
        circle_nr_names:"",
        obj_type:4,
        obj_id: pageId,
        big_top: 1,
        big_start_time:'',
        big_end_time:'',
        status:1,
        state:1
    }
};
//初始化富文本编辑器
//page.$inputEditor.summernote({
//    height: 300
//});
page.editor = new module.editor({
    container: "#inputEditor"
});
//页面事件
page.eventHandler = {
   initPage: function(){
        var $defer = $.ajax({
            url : page.CONST.GET_DETAIL,
            type : 'GET',
            dataType : 'json',
            data:{
                'id':pageId
            },
            success: function(res) {
                if(res.code==='0'){
                    if(res.data.detailMap.is_start===1){
                        page.MOCK.isLive = true;
                        page.$liveControl.text('关闭直播').addClass('btn-danger').removeClass('btn-primary');
                    }
                    //填充嘉宾
                    if(res.data.guestList.length!==0){
                        for(var i=0;i<res.data.guestList.length; i++){
                            var tempGuest = {
                                id: res.data.guestList[i].user_id,
                                avatar: res.data.guestList[i].user_avatar,
                                v: res.data.guestList[i].user_v,
                                identity: res.data.guestList[i].user_identity,
                                name: res.data.guestList[i].user_name
                            };
                            page.MOCK.topData.extra1.guest.push(tempGuest);
                        }
                    }
                    var circle_nr_ids="";
                    var circle_nr_names="";
                    //填充圈子
                    if(res.data.circleList.length!==0){
                    	for(var i=0;i<res.data.circleList.length; i++){
	                        var tempCircle = {
	                            id: res.data.circleList[i].id,
	                            name: res.data.circleList[i].title
	                        };
	                        if(i==0){
	                        	circle_nr_ids = res.data.circleList[i].id;
	                        	circle_nr_names = res.data.circleList[i].title;
	                        }else{
	                        	circle_nr_ids = circle_nr_ids+","+res.data.circleList[i].id;
	                        	circle_nr_names = circle_nr_names+","+res.data.circleList[i].title;
	                        }
	                        page.MOCK.topData.extra1.circle.push(tempCircle);
                    	}
                    }
                    page.MOCK.topData.circle_nr_ids=circle_nr_ids;
                    page.MOCK.topData.circle_nr_names=circle_nr_names;
                    page.MOCK.topStatus = res.data.state;

                    page.MOCK.topData.title = res.data.detailMap.title;
                    page.MOCK.topData.summary = res.data.detailMap.title;
                    page.MOCK.topData.image = res.data.detailMap.image;
                    page.MOCK.topData.extra1.place = res.data.detailMap.place+res.data.detailMap.address;
//                    page.MOCK.topData.extra1.address = res.data.detailMap.address;
                }else{

                    toastr.error(res.errMsg);
                }

            },
            error: function(res) {
                toastr.error("请检查网络！");

            }
        });
        return $defer;
    },
    //初始化步进加载数据
    readStep:function(){
        page.$liveLoader.text('加载中').attr('disabled',true);
        $.ajax({
            url : page.CONST.READ,
            type : 'GET',
            dataType : 'json',
            data:{
                'activity_id':pageId,
                'x':page.MOCK.size,
                'y':page.MOCK.step
            },
            success: function(res) {
                if(res.code==='0'){
                    if(res.data.length < page.MOCK.step){
                        page.eventHandler.renderData(res.data);
                        page.$liveLoader.text('已无更多直播内容').attr('disabled',true);
                    }else{
                        page.eventHandler.renderData(res.data);
                        page.$liveLoader.text('点击加载更多').attr('disabled',false);
                    }
                    page.MOCK.size = page.MOCK.size +res.data.length;
                }else{
                    page.$liveLoader.attr('disabled',false);
                    toastr.error(res.errMsg);
                }

            },
            error: function(res) {
                toastr.error("新增失败！");
                page.$liveLoader.text('点击加载更多').attr('disabled',false);
            }
        });
    },
    //初始化步进加载数据
    refresh:function(){
        page.$liveLoader.text('加载中').attr('disabled',true);
        page.$liveContainer.empty();
        page.MOCK.size=0;
        page.MOCK.step=5;
        $.ajax({
            url : page.CONST.READ,
            type : 'GET',
            dataType : 'json',
            data:{
                'activity_id':pageId,
                'x':page.MOCK.size,
                'y':page.MOCK.step
            },
            success: function(res) {
                if(res.code==='0'){
                    if(res.data.length < page.MOCK.step){
                        page.eventHandler.renderData(res.data);
                        page.$liveLoader.text('已无更多直播内容').attr('disabled',true);
                    }else{
                        page.eventHandler.renderData(res.data);
                        page.$liveLoader.text('点击加载更多').attr('disabled',false);
                    }
                    page.MOCK.size = page.MOCK.size +res.data.length;
                }else{
                    page.$liveLoader.attr('disabled',false);
                    toastr.error(res.errMsg);
                }

            },
            error: function(res) {
                toastr.error("刷新失败！");
                page.$liveLoader.text('点击加载更多').attr('disabled',false);
            }
        });
    },
    renderData: function(data){
        for(var i=0;i<data.length;i++){
            var container = '<div class="item vertical-timeline-block item">'+
                '<div class="vertical-timeline-content">'+
                '<h2>'+data[i].user_name+'</h2>'+
                '<div class="content-box">'+data[i].content+'</div>'+
                '<button class="btn btn-sm btn-danger m-l-sm" data-id="'+data[i].id+'"  onclick="page.eventHandler.delContent(this)">删除</button>'+
                '<button class="btn btn-sm btn-warning m-l-sm" data-username="'+data[i].user_name+'" data-userid='+data[i].user_id+' onclick="page.eventHandler.actionCite(this,0)">引用</button>';
            container += data[i].is_adopt==0?
                '<button class="btn btn-sm btn-primary btn-outline m-l-sm" data-id="'+data[i].id+'" data-adopt="'+data[i].is_adopt+'" onclick="page.eventHandler.actionAdopt(this)">采纳</button>':
                '<button class="btn btn-sm btn-primary m-l-sm" data-id="'+data[i].id+'" data-adopt="'+data[i].is_adopt+'" onclick="page.eventHandler.actionAdopt(this)">取消采纳</button>';
            container += '<span class="vertical-date">'+
                '<small>'+moment(data[i].create_time).format('YYYY-MM-DD HH:mm:ss')+'</small>'+
                '</span>'+
                '</div>'+
                '</div>';
            page.$liveContainer.append(container);
        }

    },
    toggleLive: function(elem){
        var $this= $(elem);
        $this.attr('disabled',true);
        $.ajax({
            url : page.CONST.TOGGLE_LIVE,
            type : 'GET',
            dataType : 'json',
            data:{
                'id':pageId,
                'is_start': page.MOCK.isLive? 0:1,
                'is_live': page.MOCK.isLive? 0:1
            },
            success: function(res) {
                if(res.code==='0'){
                    if(page.MOCK.isLive){
                        $this.text('开启直播').addClass('btn-primary').removeClass('btn-danger');
                        page.$inputContainer.collapse('hide');
                    }else{
                        $this.text('关闭直播').addClass('btn-danger').removeClass('btn-primary');
                        page.$inputContainer.collapse('show');
                    }
                    page.MOCK.isLive = !page.MOCK.isLive;
                }else{
                    toastr.error(res.errMsg);
                }
                $this.attr('disabled',false);
            },
            error: function(res) {
                toastr.error("网络错误！");
                $this.attr('disabled',false);
            }
        });
    },
    openFeedTopModal: function(){
        if(page.MOCK.topStatus===0){
            page.$setTopForm.show();
            page.$setDoneBox.hide();
        }else{
            page.$setDoneBox.show();
            page.$setTopForm.hide();
            var strHtml = "";
            if(page.MOCK.topStatus===1){
                strHtml +='直播置顶正在审核中';
                strHtml +='<a onclick="window.parent.openFrm(this)" data-index="CMcircleActivityReview.shtml?page_id='+ pageId +'" data-title="圈子活动-待审核">点击前往查看</a>';
                page.$setDoneBox.html(strHtml);
            }else{
                strHtml +='直播置顶已审核通过';
                strHtml +='<a onclick="window.parent.openFrm(this)" data-index="CMcircleActivityReview.shtml?page_id='+ pageId +'" data-title="圈子活动-待审核">点击前往查看</a>';
                page.$setDoneBox.html(strHtml);
            }
        };
        page.$setTopModal.modal('show');
    },
    setFeedTop: function(elem){
        if(page.MOCK.topStatus===0){
            var $this = $(elem);
            $this.attr('disabled',true);
            page.MOCK.topData.big_start_time = moment(page.$topStartTime).format('X')*1000;
            page.MOCK.topData.big_end_time = moment(page.$topEndTime).format('X')*1000;
            page.MOCK.topData.extra1.start_time = moment(page.$topStartTime).format('X')*1000;
            page.MOCK.topData.extra1.end_time = moment(page.$topEndTime).format('X')*1000;
            page.MOCK.topData.is_extra_push = 1;
            page.MOCK.topData.all_user = 1;
            page.MOCK.topData.extra = JSON.stringify(page.MOCK.topData.extra1);
            $.ajax({
                url : page.CONST.SET_FEED_TOP,
                type : 'GET',
                dataType : 'json',
                data: page.MOCK.topData,
                success: function(res) {
                    if(res.code==='0'){
                        toastr.success('操作成功');
                        page.$setTopModal.modal('hide');
                    }else{

                        toastr.error(res.errMsg);
                    }
                },
                error: function(res) {
                    toastr.error("操作失败！");
                }
            });
        }else{
            page.$setTopModal.modal('hide');
        }

    },
    actionCite: function(elem,type){ //引用动作 type:0,引用，1取消引用
       var $this = $(elem);
        if(type===0){ //引用
            page.MOCK.inputType = 1;
            page.MOCK.citeData.reply_id = $this.data('userid');
            page.MOCK.citeData.reply_name = $this.data('username');
            page.MOCK.citeData.reply_content = $this.siblings('.content-box').text();
        	page.$citeBox.collapse('show');
        	page.$citeContent.text(page.MOCK.citeData.reply_name+': '+page.MOCK.citeData.reply_content);
            if(page.$inputContainer.hasClass('in')===false)
                page.$inputContainer.collapse('show');
        }else{//取消引用	
        	page.$citeBox.collapse('hide');
            page.MOCK.inputType = 0;
        }
   
    },
    addContent: function(elem){   		//添加内容page.MOCK.inputType: 0表示增加，1表示引用
        var $this = $(elem);
            $this.attr('disabled',true).text('发送中');
        var data = page.MOCK.inputType===0? {
            'activity_id': pageId,
//            'content': page.$inputEditor.code(),
            'content': page.editor.getValue(),
            'content_type': 0//0普通内容，1精彩内容
        }:{
            'activity_id': pageId,
//            'content': page.$inputEditor.code(),
            'content': page.editor.getValue(),
            'content_type': 0,//0普通内容，1精彩内容
            'reply_id': page.MOCK.citeData.reply_id,//被恢复人ID
            'reply_content':page.MOCK.citeData.reply_content//被引用的内容
        };
        $.ajax({
            url : page.CONST.INSERT,
            type : 'GET',
            dataType : 'json',
            data:data,
            success: function(res) {
                if(res.code==='0'){
                    res.data.is_adopt = 0;
                    var temp = [];
                    temp.push(res.data);

                    page.eventHandler.renderData(temp);
                    toastr.success("新增内容成功！");
                    page.editor.setValue("");
                }else{
                    toastr.error("新增内容失败！");
                }
                $this.attr('disabled',false).text('发送');
            },
            error: function(res) {
                toastr.error("新增失败！");
                $this.attr('disabled',false).text('发送');
            }
        });
    },
    delContent:function(elem){ //删除内容
        var $this = $(elem);
        $this.attr('disabled',true);
        $.ajax({
            url : page.CONST.UPDATE,
            type : 'GET',
            dataType : 'json',
            data:{
                id: $this.data('id'),//活动直播内容的ID
                status: 2 //表示删除
            },
            success: function(res) {
                if(res.code == 0){
                    toastr.success("删除成功！");
                    console.info($this.parent());
                    $this.parent().fadeOut('500',function(){
                        $this.parent().remove();
                    })
                }else{
                    toastr.error("删除失败！");
                    $this.attr('disabled',false);
                }

            },
            error: function(res) {
                $this.attr('disabled',false);
                toastr.error("删除失败！");
            }
        });
    },
    actionAdopt: function(elem){ //采纳动作
        var $this = $(elem);

        var id = $this.data('id');
        var isAdopt = $this.data('adopt');
        $this.attr('disabled',true);
        if(isAdopt===0){
            $.ajax({
                url : page.CONST.UPDATE,
                type : 'POST',
                dataType : 'json',
                data:{
                    id: id,//活动直播内容的ID
                    is_adopt: 1 //表示采纳
             },
                success: function(res) {
                    if(res.code==='0'){
                        $this.data('adopt',1).text('取消采纳').removeClass('btn-outline');
                        toastr.success("操作成功！");
                    }else{
                        toastr.error("操作失败！");
                    }
                    $this.attr('disabled',false);
                },
                error: function(res) {
                    $this.attr('disabled',false);
                    toastr.error("操作失败！");
                }
            });
        }else{
            $.ajax({
                url : page.CONST.UPDATE,
                type : 'POST',
                dataType : 'json',
                data:{
                    id: id, //活动直播内容的ID
                    is_adopt: 0 //表示不采纳
                },
            success: function(res) {
                if(res.code==='0'){
                    $this.data('adopt',0).text('采纳').addClass('btn-outline');
                    toastr.success("操作成功！");
                }else{
                    $this.attr('disabled',false);
                    toastr.error("操作失败！");
                }
                $this.attr('disabled',false);
            },
            error: function(res) {
                $this.attr('disabled',false);
                toastr.error("操作失败！");
            }
        });
        }
    }
};
page.eventHandler.initPage();
page.eventHandler.readStep();






 
    
    
  