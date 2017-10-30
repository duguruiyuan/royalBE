/**
 * Created by xiegy on 2017/4/27.
 * 扩展iCheck的自动初始化，及选中与面板切换显示功能
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD规范
        define(['base','jquery','iCheck'], factory);
    } else {
        if (typeof module === 'object' && module.exports) {
            // Node/CommonJS
            module.exports = factory(require('base'), require('jquery'), require('iCheck'));
        } else {
            //未引入requirejs、commonjs等
            window.iCheck = factory(null, window.jQuery, {});
        }
    }
}(function (bs, $, iCheck) {
    iCheck = iCheck || {};
    iCheck.toggle = {};

    //切换面板控制
    function _toggle($this, _toggleContainer, _flag, _showType) {
        if(!_toggleContainer) return;

        var $toggle = $(_toggleContainer);
        var reverse = $this.attr("data-reverse");
        if(reverse)
            _flag = !_flag;

        switch(_showType){
            case "disabled":
                var $ipt = $toggle.find(":input");
                if(_flag && !$this.attr("disabled")){
                    $ipt.iCheck("enable");
                    $ipt.removeAttr("disabled");
                    $toggle.find("[hasEdit]").attr("contenteditable", true);
                    break;
                }

                $toggle.find("[contenteditable]").attr("contenteditable", false).attr("hasEdit", true);
                $ipt.iCheck("disable");
                $ipt.attr("disabled", "disabled");
                break;
            case "fade":
                _flag ? $toggle.fadeIn("fast") : $toggle.fadeOut("fast");
                break;
            case "slide":
            default:
                _flag ? $toggle.slideDown("fast") : $toggle.slideUp("fast");
                break;
        }
    }

    iCheck.toggle.init = function (container) {
        //初始化icheck
        if(!container) return;

        var $container = $(container);
        $container.find(".i-checks")
            .iCheck({checkboxClass:"icheckbox_square-green", radioClass:"iradio_square-green"})
            .on("ifChecked", function (evt) {
                //选中
                var $this = $(this);
                $this.attr("checked", "checked");
                // 绑定相关面板隐藏/打开关系
                _toggle($this, $this.attr("data-toggle"), true, $this.attr("data-showType"));
            })
            .on("ifUnchecked", function (evt) {
                //未选中
                var $this = $(this);
                $this.removeAttr("checked");
                _toggle($this, $this.attr("data-toggle"), false, $this.attr("data-showType"));
            });

        //初始化选项默认打开隐藏
        $container.find(":radio,:checkbox").each(function() {
            var $this = $(this);
            _toggle($this, $this.attr("data-toggle"), $this.attr("checked"), $this.attr("data-showType"));
        });
    };

    return iCheck;
}));