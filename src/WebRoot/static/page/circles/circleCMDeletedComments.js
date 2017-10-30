//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastr', 'datetimepicker', 'table', 'tableEditable'], function (bs, $, helper, swal, layer, toastr) {
//存储页面table对象
page.$table = $('#tableList');
//页面级的帮助对象集合
page.derive = {
    //获取表单参数包含搜索
    getParams: function (params) {
        params.status = 2;
        params.circle_id = pageId;//页面传入时的id
        params.x = params.offset;//根据后台接口需要替换分页参数
        params.y = params.limit;//根据后台接口需要替换分页参数
        params.start_time = helper.convert.formatTimestamp($("#start_time").val());
        params.end_time = helper.convert.formatTimestamp($("#end_time").val(), {day: 1});
        params.keyword = $("#keyword").val();
        return params;
    }
}

//页面所用到AJAX请求的URL
page.ajaxUrl = {
    GET_LIST: helper.url.getUrlByMapping("admin/common/find_comment.shtml"),     	//获取圈子的评论列表
    UPDATE: helper.url.getUrlByMapping("admin/common/update_comment.shtml"),       //设置评论状态接口(置顶，精华，删除)                                             //修改密文接口
}

//页面事件
page.eventHandler = {
	//搜索
    search: function () {
    	page.$table.bootstrapTable('refresh');
    },	
    //搜索重置
    reset: function(){
    	$("#start_time").val("");
    	$("#end_time").val("");
    	$("#keyword").val("");
    	page.$table.bootstrapTable('refresh');
    },
    //恢复评论
    recovery: function (elem, value, row, index) {
        swal({
            title: "您确定要恢复选中的信息吗？",
            text: row.title,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#18a689",
            confirmButtonText: "恢复",
            cancelButtonText:'取消',
            closeOnConfirm: false
        }, function () {
            swal({title: "恢复中，请稍候", type: "info", showConfirmButton: false});
            $.ajax({
                url: page.ajaxUrl.UPDATE,
                type: 'POST',
                data: {
                    id: row.id,
                    status: 1
                },
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                        swal({title:"恢复成功", text: "1s后自动消失...", type: "success", timer: 1000});
                        page.$table.bootstrapTable('removeByUniqueId', row.id);    
                    }else{
                        swal("恢复成功", ret.errMsg, "error");
                    }
                },
                error:function(ret) {
                    swal("恢复成功", "error");
                }
            });
        });   
    }
}
//初始化日期控件
$('.form_date').datetimepicker({
    format: 'yyyy-mm-dd',
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0
}).on("click", function (e) {
        //设置日期控件前后日期的依赖
        var jq = $(e.target);
        switch (jq.attr("id")){
            case "startTime":
                jq.datetimepicker("setEndDate", $("#endTime").val());
                break;
            case "endTime":
                jq.datetimepicker("setStartDate", $("#startTime").val());
                break;
        }
    }
);
	//初始化日期控件
    $('.form_date').datetimepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: true,
        startView: 2,
        minView: 2,
        forceParse: true
    }).on("click", function (e) {
        //设置日期控件前后日期的依赖
        var $this = $(e.target);
        if($this.attr("data-start")){
            $this.datetimepicker("setStartDate", $($this.attr("data-start")).val());
        }
        if($this.attr("data-end")){
            $this.datetimepicker("setEndDate", $($this.attr("data-end")).val());
        }
    });
  //初始化表格
  page.$table.bootstrapTable({	
      detailView: false,
     // classes: 'table table-hover table-no-bordered',
      buttonsClass: 'default btn-outline',
      url: page.ajaxUrl.GET_LIST,  //AJAX读取列表数据的URL
      dataField: "data",//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
      height: 600,//高度
      toolbar:'#tableTools',
      showColumns: true,
      showRefresh: true,
      pagination: true,//是否分页
      pageSize: 20,//单页记录数
      pageList: [10,20,50,100],//分页步进值
      sidePagination: "server",//服务端分页
      contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
      dataType: "json",//期待返回数据类型
      method: "get",//请求方式
      uniqueId: 'id',
      undefinedText: "—",//为空的填充字符
      queryParamsType: "limit",//查询参数组织方式
      queryParams: function (params) {
          return page.derive.getParams(params);
      },
      columns: [{
          field: 'content',
          title: '评论内容',
          align: 'left',
          formatter: function(value, row, index){
          	return row.is_voice === 0? 
      			   value: 
  				   '<audio controls>'+
          			  '<source src="'+row.voice+'?avthumb/mp3" type="audio/mp3">'+
      			  '</audio>';
      	}
      }, {
          field: 'title',
          title: '标题',
          width: "100px",
          align: 'center'
      }, {
          field: 'obj_type',
          title: '类型',
          width: "100px",
          align: 'center',
      	formatter: function(value, row, index){
      		switch(value){
      			case 4: return "活动";break;
      			case 5: return "话题";break;
      			case 18: return "帮助";break;
      			case 19: return "帖子";break;
      			default: return "";
      		}
      	}
      }, {
          field: 'reply_user_name',
          title: '回复对象',
          width: "100px",
          align: 'center'
      }, {
          field: 'user_name',
          title: '评论人',
          width: "100px",
          align: 'center'
      }, {
          field: 'create_time',
          title: '评论时间',
          width: '150px',
          align: 'center',
          formatter: function(value, row, index){
              return helper.convert.formatDate(value);
          },
      }, {
          field: 'zan_count',
          title: '点赞数',
          width: "80px",
          align: 'center'
      }, {
          field: 'zan_count_all',
          title: '显示点赞数',
          width: "100px",
          align: 'center'
      }, {
          field: 'is_good',
          title: '是否精华',
          width: "100px",
          align: 'center',
          formatter: function(value, row, index){
              return value===0? '否' : '是';
          }
      }, {
          title: '操作',
          align: 'center',
          width: "100px",
          formatter:function(value, row, index){	      
              var strHtml = ' <button type="button" class="reco btn btn-sm btn-primary">恢复</button>';
  				return strHtml;
          },
          events: {
  	          //恢复
  	          'click .reco': function(e, value, row, index){
  	        	  page.eventHandler.recovery(this, value, row, index)
  	          }
  	      }
      }]
  });

  //绑定回车查询
  $("#keyword").keyup(function (event) {
    if (event.keyCode == 13)
        page.eventHandler.search();
  });
});











