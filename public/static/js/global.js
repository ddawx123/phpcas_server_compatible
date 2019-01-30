function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg)){
		return unescape(arr[2]);
	}
	else{
		return null;
	}
}

function setCookie(name,value){
	var Days=30;//����ʱ��30��
	var date=new Date(); 
	date.setTime(date.getTime()+Days*24*60*60*1000);
	document.cookie=name+"="+escape(value)+";expires="+date.toGMTString();
}

function isIE() {  
    if (!!window.ActiveXObject || "ActiveXObject" in window)  
        return true;  
    else  
        return false;  
} 
function isChrome() {
	return navigator.appVersion.indexOf("Chrome")>0;
}
var doWinJS = true;
if(navigator.appVersion.indexOf("MSIE 9.0")>0||navigator.appVersion.indexOf("MSIE 8.0")>0||navigator.appVersion.indexOf("MSIE 7.0")>0){
	doWinJS=false;
}else{
//	$.cachedScript("/js/winjs/js/ui.min.js");
}

(function($){
	$.getScriptS = function(url, callback, cache) {
		$.ajax({type: 'GET', url: url, success: callback, dataType: 'script', ifModified: true, cache: cache});
	};
})(jQuery);

jQuery.docReady = function(func){
	if(!(navigator.appVersion.indexOf("MSIE 9.0")>0||navigator.appVersion.indexOf("MSIE 8.0")>0||navigator.appVersion.indexOf("MSIE 7.0")>0)){
		$.getScriptS("/html/ext/js/winjs/js/base.min.js",function(){$.getScriptS("/html/ext/js/winjs/js/ui.min.js",function(){$(func);},true);},true)
	}else{
		setTimeout(function(){$(func);},200);
	}
}


