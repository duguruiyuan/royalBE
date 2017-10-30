/**
 * Created by lianhy on 2017/4/23.
 * 插件自定义设置，全局统一样式设置
 *
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD规范
        define(['toastr'], factory);
    } else {
        if (typeof module === 'object' && module.exports) {
            // Node/CommonJS
            module.exports = factory(require('toastr'));
        } else {
            //未引入requirejs、commonjs等
            window.toastr = factory(window.toastr);
        }
    }
}(function (toastr) {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "400",
        "hideDuration": "1000",
        "timeOut": "3000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    return toastr;
}));