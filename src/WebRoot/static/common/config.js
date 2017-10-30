/**
 * Created by xiegy on 2017/5/26.
 * require.js模块加载配置，依赖于require.js
 */
var config = {
    BASE_FOLDER: '/Sbbyy',                     //实际项目部署时的基础路径，如：/sbbyy（代表根目录下的Sbbyy文件夹）
    RUN_TYPE: 'debug',                         //环境状态，"debug"、"test"、"release"，目前仅"debug"和"release"生效
    VERSION: '20170527'                        //版本号
};


if (require && typeof require.config === 'function') {
    require.config({
        baseUrl: config.BASE_FOLDER + '/static',
        urlArgs: 'v=' + config.VERSION,
        paths: {
            //通用业务库
            'helper': 'common/helper',                                          //通用帮助类
            'helper.qiniu': 'common/helper.qiniu',                              //七牛扩展
            'base': 'lib/bootstrap/js/bootstrap.min',                           //含bootstrap及各种css
            //业务模块
            'module.editor': 'common/module/module.editor',                     //富文本编辑器
            'module.fileUpload': 'common/module/module.fileUpload',             //上传组件
            'module.articleSelector': 'common/module/module.articleSelector',   //文章选择器
            'module.multSelector': 'common/module/module.multSelector',         //多选选择器
            'module.inputSelector': 'common/module/module.inputSelector',       //单选选择器
            'module.push': 'common/module/module.push',                         //推送组件
            'module.otherPush': 'common/module/module.otherPush',               //无大小置顶推送组件
            'module.messagePush': 'common/module/module.messagePush',             //短信发送对象组件
            'module.push.modal': 'common/module/module.push.modal',                //推送组件扩展弹出集成窗口
            'module.monoSelector': 'lib/module/module.monoSelector',                    //【即将作废】单选组件，尽快改掉
            'module.multSelectorPlus': 'common/module/module.multSelector.returnOrig',     //【即将作废】多选组件扩展，尽快改掉（原组件已实现功能）
            'iCheckPlus': 'lib/iCheck/icheck-toggle',                           //iCheck扩展
            'toastrPlus': 'lib/toastr/customOptions',                           //toastr扩展

            //第三方组件
            'jquery': 'lib/jQuery/jquery.min',                                  //jquery
            'layer': 'lib/layer/layer',                                         //弹出层组件
            'table': 'lib/bootstrap-table/locale/bootstrap-table-zh-CN',        //表格组件
            'validator': 'lib/bootstrapValidator/bootstrapValidator.min',       //验证器组件
            'datetimepicker': 'lib/datetimepicker/datetimepicker.min',          //日期选择器
            'fancybox': 'lib/fancyBox-2.1.5/source/jquery.fancybox',            //图片查看器
            'sweetalert': 'lib/sweetalert/sweetalert.min',                      //弹出确认框
            'editable': 'lib/bootstrap3-editable/js/bootstrap-editable',        //表格修改组件
            'tableEditable': 'lib/bootstrap-table/bootstrap-table-editable.min',//表格修改扩展
            'treeview': 'lib/bootstrap-treeview/bootstrap-treeview',            //treeview【module.multSelector用到】
            'bootstrapTable': 'lib/bootstrap-table/bootstrap-table',            //【请勿直接引用该组件，表格组件请使用table】bootstrapTable组件
            'fileinput': 'lib/bootstrap-fileinput/js/locales/zh',               //【提供给自定义组件module.fileUpload】上传组件
            'summernote': 'lib/summernote/summernote-zh-CN',                    //【提供给自定义组件module.editor】富文本编辑器
            'suggest': 'lib/bootstrap-suggest/bootstrap-suggest',               //【提供给自定义组件module.inputSelector】选择输入框
            'iCheck': 'lib/iCheck/icheck.min',                                  //【提供给扩展iCheckPlus】
            'toastr': 'lib/toastr/js/toastr.min',                               //【提供给扩展toastrPlus】
            'sortable': 'lib/sortable/sortable'                                 //拖动组件
        },
        map: {
            '*': {
                'css': 'lib/css.min'
            }
        },
        shim: {
            'base': {
                // deps: ['css!lib/bootstrap/css/bootstrap.min.css', 'css!lib/font-awesome/css/font-awesome.min.css', 'css!lib/animate/animate.css', 'css!lib/hplus/style.min', 'css!lib/hplus/style.css', 'css!common/extend.css', 'jquery']
                deps: ['jquery']
            },
            'table': {
                deps: ['bootstrapTable']
            },
            'bootstrapTable': {
                deps: ['base', 'jquery', 'css!lib/bootstrap-table/bootstrap-table.min.css']
            },
            'validator': {
                deps: ['base', 'jquery']
            },
            'treeview': {
                deps: ['base', 'jquery', 'css!lib/bootstrap-treeview/bootstrap-treeview.min.css']
            },
            'iCheck': {
                deps: ['jquery', 'css!lib/iCheck/custom.css']
            },
            'fancybox':{
                deps: ['jquery', 'css!lib/fancyBox-2.1.5/source/jquery.fancybox.css']
            },
            'editable':{
                deps: ['jquery', 'table', 'css!lib/bootstrap3-editable/css/bootstrap-editable.css']
            },
            'tableEditable':{
                deps: ['editable']
            },
            'line':　{
            	deps: ['morris']
            },
            'sweetalert':{
                //已是AMD规范
                deps: ['css!lib/sweetalert/sweetalert.css']
            },
            'layer': {
                //已是AMD规范
                deps: ['css!lib/layer/layer.css']
            },
            'fileinput': {
                //已是AMD规范
                deps: ['css!lib/bootstrap-fileinput/css/fileinput.min.css', 'lib/bootstrap-fileinput/js/fileinput']
            },
            'summernote': {
                //已是AMD规范
                deps: ['css!lib/summernote/summernote.css', 'lib/summernote/summernote.min']
            },
            'datetimepicker':{
                //已是AMD规范
                deps: ['css!lib/datetimepicker/bootstrap-datetimepicker.min.css']
            },
            'toastr':{
                //已是AMD规范
                deps: ['css!lib/toastr/css/toastr.min.css']
            }
        }
    });
}