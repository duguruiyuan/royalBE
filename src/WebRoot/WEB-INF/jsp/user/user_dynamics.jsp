<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>用户动态</title>
    <%@ include file="../include/amdInclude.jsp"%>
    <style type="text/css">
      .vertical-date-time{font-weight:700;font-size:18px}
      .vertical-timeline-content p.fx{background:#ddd;padding:8px;width:80%}
      .vertical-timeline-content p.gz{padding:8px;width:80%}
      .vertical-timeline-content .btn{position:absolute;bottom:20px;right:20px}
    </style>
  </head>
  <body class="gray-bg">
    <div class="row">
        <div class="col-sm-12">
            <div class="wrapper wrapper-content">
                <div class="row animated fadeInRight">
                    <div class="col-sm-12">
                        <div class="ibox float-e-margins">
                            <div class="" id="ibox-content">
                                <div id="vertical-timeline" class="vertical-container light-timeline">
                                  <!--<div class="vertical-timeline-block">
                                    <div class="vertical-timeline-icon navy-bg">
                                      <i class="fa fa-file-text"></i>
                                    </div>
                                    <div class="vertical-timeline-content">
                                      <div class="vertical-date-time"><small>2017年4月7日</small></div>
                                      <h2>参加了一个分享会</h2>
                                      <p class="fx">XXXX线下沙龙，吴晓波倾力分享</p>
                                      <a href="#" class="btn btn-sm btn-primary"> 点击前往</a>
                                    </div>
                                  </div>
                                  <div class="vertical-timeline-block">
                                    <div class="vertical-timeline-icon navy-bg">
                                      <i class="fa fa-file-text"></i>
                                    </div>
                                    <div class="vertical-timeline-content">
                                      <div class="vertical-date-time"><small>2017年4月7日</small></div>
                                      <h2>参加了一个分享会</h2>
                                      <p class="fx">XXXX线下沙龙，吴晓波倾力分享</p>
                                      <a href="#" class="btn btn-sm btn-primary"> 点击前往</a>
                                    </div>
                                  </div>
                                  <div class="vertical-timeline-block">
                                    <div class="vertical-timeline-icon navy-bg">
                                      <i class="fa fa-file-text"></i>
                                    </div>
                                    <div class="vertical-timeline-content">
                                      <div class="vertical-date-time"><small>2017年4月7日</small></div>
                                      <p class="gz">关注了<a href="javascript:;">福州互联网圈</a></p>
                                      <a href="#" class="btn btn-sm btn-primary"> 点击前往</a>
                                    </div>
                                  </div>-->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script src="<%=basePath%>static/page/user/user_dynamics.js?v=<%=StaticVersion%>"></script>
  </body>
</html>