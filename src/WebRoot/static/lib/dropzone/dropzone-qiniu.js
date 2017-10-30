/**
 * Created by xiegy on 2017/4/25.
 * 变更dropzone-qiniu上传到七牛的配置
 * 依赖于helper.qiniu.js文件（即，必须在引入本文件前引入helper.qiniu.js文件），并在引入前初始化new helper.qiniu.token()
 */
if(!Dropzone) {
    var Dropzone = {};
}
(function ($) {
    Dropzone.uploadImages = [];
    $.extend(Dropzone.prototype.defaultOptions, {
        url: helper.qiniu.UploadUrl,            //上传文件接收地址
        previewsContainer: ".dz-preview",       //文件接收容器
        addRemoveLinks: true,                   //显示删除按钮
        maxFiles: 10,                           //一次性上传的文件数量上限
        maxFilesize: 5,                         //上传的文件大小限制，单位MB
        acceptedFiles: ".jpeg,.jpg,.png,.gif",        //接收文件格式
        sending: function (file, xhr, formData) {
            //接入七牛授权，在此之前要先初始化七牛
            var filename = false;
            try{
                filename = file["name"];
            } catch(e){filename = false;}

            //以上防止在图片在编辑器内拖拽引发第二次上传导致的提示错误
            var ext = filename.substr(filename.lastIndexOf("."));
            var name = new Date().getTime() + ext.toUpperCase();
            formData.append("token", helper.qiniu.instance.tokenString);
            formData.append("key", name);
        },
        success: function (file, response, e) {
            //上传成功，保存图片
            var url = helper.qiniu.getUploadVisitUrlByKey(response.key);
            $(file).attr("url", url);
            Dropzone.uploadImages.push(url);
        },
        removedfile: function(file){
            //TODO 七牛删除文件
            var _ref;
            if ((_ref = file.previewElement) != null) {
                _ref.parentNode.removeChild(file.previewElement);
            }

            var url = $(file).attr("url");
            Dropzone.uploadImages = $.grep(Dropzone.uploadImages, function(n, i){
                return n != url;
            })
        }
    });

})(jQuery);