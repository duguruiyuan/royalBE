<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>推送</title>
    <link href="css/bootstrap.min14ed.css?v=3.3.6" rel="stylesheet">
    <style type="text/css">
      .user_push{width:700px;height:auto;overflow:hidden;}
      .user_push .top_warpper{width:100%;heigth:60px}
      .user_push .top_warpper .img{display:inline-block;vertical-align: top;}
      .user_push .top_warpper .info{display:inline-block;line-height:20px}
      .content-warpper{margin-top:15px;height:auto;overflow:hidden;}
      .content-warpper .line{height:30px;line-height:30px;margin-top:10px}
      .content-warpper .line.date-line{height:34px}
      .content-warpper .other{padding-left:20px}
      .date-line .layer-date{vertical-align: top}
      .content-warpper .other .other-line{height:30px;;line-height:30px}
      .content-warpper .other .other-select{padding-left:20px}
      .content-warpper .other .other-select .other-select-line{height:30px;line-height:30px;margin-top:8px}
      .content-warpper .other .other-select .other-select-line .btn{background:#ccc;padding:5px;margin-left:8px;cursor: pointer;}
      .padding-five{padding:0 5px}
      .hidden{display:none}
    </style>
  </head>
  <body>
    <div class="user_push">
      <div class="content-warpper">
        <div class="line">
          <input type="checkbox" checked="checked"><span>默认推送：</span><span>无</span>
        </div>
        <div class="line">
          <input type="checkbox"><span>额外推送</span>
        </div>
        <div class="other">
          <div class="other-line">
            <input type="radio">
            <span>全部用户</span>
          </div>
          <div class="other-line">
            <input type="radio">
            <span>部分用户</span>
          </div>
          <div class="other-select">
            <div class="other-select-line"><span>商会：</span><span>福州惠安商会</span><span class="btn">点击选择</span></div>
            <div class="other-select-line">
              <span>行业：</span>
              <select id="position" name="position"></select>
            </div>
            <div class="other-select-line">
              <span>地区：</span>
              <select id="nativeinfo1" name="nativeinfo1" class="address"></select>
              <select id="city1" name="city1" class="address hidden"></select>
            </div>
            <div class="other-select-line">
              <span>籍贯：</span>
              <select id="nativeinfo" name="nativeinfo" class="address"></select>
              <select id="city" name="city" class="address hidden"></select>
              <select id="area" name="area" class="address hidden"></select>
            </div>
            <div class="other-select-line"><span>用户组：</span><span>会长</span><span class="btn">点击选择</span></div>
            <div class="other-select-line"><span>用户：</span><span>刘某、胡某</span><span class="btn">点击选择</span></div>
            <div class="other-select-line"><span>圈子：</span><span>福州互联网圈</span><span class="btn">点击选择</span></div>
          </div>
        </div>
        <div class="line date-line">
          <input type="checkbox"><span>小置顶：</span><span>时间</span>
          <input placeholder="开始日期" class="form-control layer-date" id="start1">
          <span class="padding-five">到</span>
          <input placeholder="结束日期" class="form-control layer-date" id="end1">
        </div>
        <div class="line date-line">
          <input type="checkbox"><span>大置顶：</span><span>时间</span>
          <input placeholder="开始日期" class="form-control layer-date" id="start2">
          <span class="padding-five">到</span>
          <input placeholder="结束日期" class="form-control layer-date" id="end2">
        </div>
      </div>
    </div>
    <script src="<%=basePath%>js/jquery.min.js?v=2.1.4"></script>
    <script src="<%=basePath%>js/bootstrap.min.js?v=3.3.6"></script>
    <script src="<%=basePath%>js/content.min.js?v=1.0.0"></script>
    <script src="<%=basePath%>js/plugins/layer/laydate/laydate.js"></script>
    <script src="<%=basePath%>js/public.js"></script>
    <script>
      var _usid = GetQueryString("usid");
      //行业
      $.ajax({
    		url: '<%=basePath%>common/find_industry.shtml',
    		type: 'post',
    		dataType: 'json',
    		success: function(res){
    			var result = res.data,arr =[];
    			for(var i =0; i < result.length; i++){
    				arr.push('<option value="'+result[i].NAME+'">'+result[i].NAME+'</option>');
    			}
    			$("#position").append(arr.join(''));
    		}
    	});
      //地址
      var addressData = [];
      $.ajax({
        		url: '<%=basePath%>json/district.json',
        		dataType: 'json',
        		success: function(res){
        			addressData = res;
        			var arr =['<option>请选择</option>'];
        			for(var i =0; i < res.length; i++){
        				arr.push('<option value="'+res[i].name+'">'+res[i].name+'</option>');
        			}
        			$("#nativeinfo").append(arr.join(''));
        			$("#nativeinfo1").append(arr.join(''));
        		}
        	});
      
      var prefecture_level_city = ['北京市','天津市','上海市','重庆市'];
  	//地区
  	var _city1 = $("#city1");
  	$("#nativeinfo1").on('change',function(){
  		for(var i =0; i < addressData.length; i++){
  			if($(this).val() == addressData[i].name){
  				var arr =['<option>请选择</option>'];
  				if(prefecture_level_city.indexOf(addressData[i].name) == -1){
  					for(var j = 0; j < addressData[i].sub.length; j++){
  						arr.push('<option value="'+addressData[i].sub[j].name+'">'+addressData[i].sub[j].name+'</option>');
      				}
  				}else{
  					arr.push('<option value="'+addressData[i].name+'">'+addressData[i].name+'</option>');
  				}
  				_city1.empty().show();
  				_city1.append(arr.join(''));
  			}
  		}
  	});
  	//籍贯
  	var _index = null;
  	var _city = $("#city");
  	var _area = $("#area");
  	$("#nativeinfo").on('change',function(){
  		for(var i =0; i < addressData.length; i++){
  			if($(this).val() == addressData[i].name){
  				var arr =['<option>请选择</option>'];
  				_index = i;
  				if(prefecture_level_city.indexOf(addressData[i].name) == -1){
  					for(var j = 0; j < addressData[i].sub.length; j++){
  						arr.push('<option value="'+addressData[i].sub[j].name+'">'+addressData[i].sub[j].name+'</option>');
      				}
  				}else{
  					arr.push('<option value="'+addressData[i].name+'">'+addressData[i].name+'</option>');
  				}
  				_city.empty().show();
  				_area.empty().hide();
  				_city.append(arr.join(''));
  			}
  		}
  	});
  	$("#city").on('change',function(){
  		var arr =['<option>请选择</option>'];
  		if(prefecture_level_city.indexOf($(this).val()) != -1){
  			for(var k = 0; k < addressData[_index].sub.length; k++){
					arr.push('<option value="'+addressData[_index].sub[k].name+'">'+addressData[_index].sub[k].name+'</option>');
				}
  		}else{
  			for(var i =0; i < addressData[_index].sub.length; i++){
      			if($(this).val() == addressData[_index].sub[i].name){
      				for(var j = 0; j < addressData[_index].sub[i].sub.length; j++){
      					arr.push('<option value="'+addressData[_index].sub[i].sub[j].name+'">'+addressData[_index].sub[i].sub[j].name+'</option>');
      				}
      			}
      		}
  		}
			_area.empty().show();
			_area.append(arr.join(''));
  	});
    </script>
    <script>
        var start1={
        		elem:"#start1",
        		format:"YYYY/MM/DD hh:mm:ss",
        		min:laydate.now(),
        		max:"2099-06-16 23:59:59",
        		istime:true,
        		istoday:false,
        		choose:function(datas){
        			end1.min=datas;
        			end1.start=datas
        			}
        };
        var start2={
        		elem:"#start2",
        		format:"YYYY/MM/DD hh:mm:ss",
        		min:laydate.now(),
        		max:"2099-06-16 23:59:59",
        		istime:true,
        		istoday:false,
        		choose:function(datas){
        			end2.min=datas;
        			end2.start=datas
        			}
        };
        var end1={
        		elem:"#end1",
        		format:"YYYY/MM/DD hh:mm:ss",
        		min:laydate.now(),
        		max:"2099-06-16 23:59:59",
        		istime:true,
        		istoday:false,
        		choose:function(datas){
        			start1.max=datas
        			}
        };
        var end2={
        		elem:"#end2",
        		format:"YYYY/MM/DD hh:mm:ss",
        		min:laydate.now(),
        		max:"2099-06-16 23:59:59",
        		istime:true,
        		istoday:false,
        		choose:function(datas){
        			start2.max=datas
        			}
        };
        laydate(start1);
        laydate(end1);
        laydate(start2);
        laydate(end2);
    </script>
  </body>
</html>