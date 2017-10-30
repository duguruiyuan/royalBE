//表格初始化
var page={};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'datetimepicker', 'table'], function (bs, $, helper, swal, layer) {
page.type=helper.url.queryString("type");
var $table = $('#tableList');
$table.bootstrapTable({
    //请求相关
    url: helper.url.getUrlByMapping('admin/anonymous/find_anonymouslistsbytype.shtml'),  //AJAX读取列表数据的URL
    method: "get",                  //请求方式
    contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
    dataType: "json",               //服务器返回数据类型
    cache: false,                   //不缓存数据
    queryParamsType: "limit",       //查询参数组织方式
    queryParams: function (params) {
        return _getParams(params);
    },

    //分页相关
    pagination: true,            //是否分页
    pageNumber:1,                //初始化加载第一页，默认第一页
    pageSize: 20,                //每页的记录行数（*）
    pageList: [10, 50, 100],     //允许选择的每页的数量切换
    sidePagination: "server",    //分页方式：client客户端分页，server服务端分页（*）

    //表格总体外观相关
    height: 650,            //整个表格的高度
    detailView: false,      //是否显示父子表
    cardView: false,        //是否显示详细图
    undefinedText: "—",     //当数据为空的填充字符
    showColumns: true,      //是否显示筛选列按钮
    showRefresh: true,      //是否显示刷新按钮
    clickToSelect: true,    //是否开启点击选中行,自动选择rediobox 和 checkbox
    toolbar:'#tableTools',  //工具按钮的容器
    //classes: 'table table-hover table-no-bordered',
    //buttonsClass: 'default btn-outline',

    //表格内容相关设置
    idField:"id",       //当前行主键的id值
    uniqueId:'id',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
    dataField: "data",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
    columns: [{
        field: 'name',
        title: '词典名称',
        align: 'left'
    },{
        field: 'anonymousname',
        title: '匿名主题',
        width: "350px",
        align: 'center'
    }]
});

//绑定回车查询
$('#keyword').keyup(function (event) {
  if (event.keyCode == 13)
  	$("#btnSearch").click();
});
//搜索
$("#btnSearch").click(function(){
  var params = $table.bootstrapTable('getOptions');
  params = _getParams(params);

  $table.bootstrapTable('refresh',params);
});
});

//获取表单参数用于搜索
function _getParams(params) {
	params.x = params.offset;
	params.y = params.limit;
	params.type = page.type;
    params.name = $("#keyword").val();

    return params;
}
