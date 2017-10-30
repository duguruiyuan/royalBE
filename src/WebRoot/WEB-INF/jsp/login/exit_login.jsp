<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html lang="zh_cn">
<head>
    <meta charset="utf-8">
    <title>退出-商帮帮后台</title>
</head>
<body>
退出
</body>
<script src="<%=basePath%>js/jquery.min.js"></script>
<script type="text/javascript">
  $.ajax({
    url: '<%=basePath%>admin/exit_login.shtml',
    type: 'post',
    dataType: 'json',
    success: function (res) {
      if(res.code == 0){
    	  location.href = '<%=basePath%>';
      }else{
    	  alert('退出失败')
      }
    },
    error: function(xhr){
      console.log(xhr);
    }
  });
</script>
</html>