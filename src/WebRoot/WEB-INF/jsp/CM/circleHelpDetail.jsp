<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>圈子内容管理-商帮帮后台</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/staticInclude.jsp"%>
  </head>
  <body class="gray-bg">
  <div class="wrapper wrapper-content  animated fadeInRight article">
        <div class="row">
            <div class="col-lg-10 col-lg-offset-1">
                <div class="ibox">
                    <div class="ibox-content">
                       <!--<div class="pull-right">
                            <span class="label label-primary">福州互联网圈</span>
                        </div>  --> 
                        <div class="text-center article-title">
                            <h1>
                            </h1>
                        </div>
                        <div class="center">
                            <span class="label label-primary" id="circleName"></span>
                            <span class="label label-primary" id="createTime"></span>
                        </div>
                        <div id-"articleContent">
                             <p>
                        	</p>
                        </div>
                    	<button style="display:none" class="pull-right btn btn-primary" onclick="page.eventHandler.recover();">恢复</button> 
                        <hr>
                        <div class="row">
                            <div class="col-lg-12">
                                <h2>评论：</h2>
                                <div class="social-feed-box">
                                    <div class="social-avatar">
                                        <a href="" class="pull-left">
                                            <img alt="image" src="img/a1.jpg">
                                        </a>
                                        <div class="media-body">
                                            <a href="#">
                                                    逆光狂胜蔡舞娘
                                                </a>
                                            <small class="text-muted">17 小时前</small>
                                        </div>
                                    </div>
                                    <div class="social-body">
                                        <p>
                                            好东西，我朝淘宝准备跟进，1折开卖
                                        </p>
                                    </div>
                                </div>
                                <div class="social-feed-box">
                                    <div class="social-avatar">
                                        <a href="" class="pull-left">
                                            <img alt="image" src="img/a2.jpg">
                                        </a>
                                        <div class="media-body">
                                            <a href="#">
                                                    避雷范儿
                                                </a>
                                            <small class="text-muted"> 16 小时前</small>
                                        </div>
                                    </div>
                                    <div class="social-body">
                                        <p>
                                            第一个真的好美 就是噪音太大了 挺唯美的意境瞬间变成工厂了
                                        </p>
                                    </div>
                                </div>
                                <div class="social-feed-box">
                                    <div class="social-avatar">
                                        <a href="" class="pull-left">
                                            <img alt="image" src="img/a3.jpg">
                                        </a>
                                        <div class="media-body">
                                            <a href="#">
                                                    kamppi
                                                </a>
                                            <small class="text-muted"> 6 小时前</small>
                                        </div>
                                    </div>
                                    <div class="social-body">
                                        <p>
                                            好美的装置艺术，第二个让我想起了海中缓缓游动的鲸鱼。
                                        </p>
                                    </div>
                                </div>
                                <div class="social-feed-box">
                                    <div class="social-avatar">
                                        <a href="" class="pull-left">
                                            <img alt="image" src="img/a5.jpg">
                                        </a>
                                        <div class="media-body">
                                            <a href="#">
                                                    kamppi
                                                </a>
                                            <small class="text-muted">6 小时前</small>
                                        </div>
                                    </div>
                                    <div class="social-body">
                                        <p>
                                            “Flylight 的灯管并不固定，由一套软件控制：每一个灯管都根据与其它灯管的互动进行移动，就像一群真正的鸟群一样。” 好像介绍的描述不对，灯管是固定的，控制的只是点亮和熄灭的时间，模拟成一团亮点移动
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </body>
   	<%--表单控件--%>
    <link href="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
    <link href="<%=basePath%>static/lib/bootstrap3-editable/css/bootstrap-editable.css" rel="stylesheet">
	<script src="<%=basePath%>static/lib/bootstrap3-editable/js/bootstrap-editable.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table-editable.min.js"></script>
    <%--弹窗控件--%>
    <link href="<%=basePath%>static/lib/sweetalert/sweetalert.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/sweetalert/sweetalert.min.js"></script>
    <%--toastr提示控件--%>
    <link href="<%=basePath%>static/lib/toastr/css/toastr.min.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/toastr/js/toastr.min.js"></script>
    <script src="<%=basePath%>static/lib/toastr/customOptions.js"></script>
    <%--时间转换控件--%>
	<script src="<%=basePath%>static/lib/moment/moment.min.js"></script>
	
	<script>var pageId = ${paramMap.page_id};
			var pageType = ${paramMap.page_type};//0表示正常，1表示草稿</script>
    <%--页面css及js文件--%>	
	<script src="<%=basePath%>static/page/CM/circleHelpDetail.js"></script>
</html>
