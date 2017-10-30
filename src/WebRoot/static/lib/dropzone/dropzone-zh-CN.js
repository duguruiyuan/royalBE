(function ($) {
    $.extend(Dropzone.prototype.defaultOptions, {
        dictDefaultMessage: "+ 点击这里上传图片，或将图片拖拽到此框内",
        dictFallbackMessage: "您的浏览器不支持拖放上传",
        dictInvalidFileType: "不支持您选择的文件格式",
        dictFileTooBig: "上传的文件过大，最大支持{{maxFilesize}}MB.",
        dictMaxFilesExceeded: "您最多只能上传{{maxFiles}}个文件",
        dictResponseError: "文件上传失败",
        dictRemoveFile: "删除"
    });
})(jQuery);
