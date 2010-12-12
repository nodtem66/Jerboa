 /*
	* Jerboa Loader
	* @describe:  parallell loading file
	*/
var Jerboa = (function(my){
	// find path {{{1 
	var _scripts = document.getElementsByTagName("script");
	for(i=0,len=_scripts.length;i<len;i++){
		if(/loader\.js/.test(_scripts[i].src)) {
			my.path = _scripts[i].src.replace("loader.js","");
			my.path = my.path.replace(/\/$/i,"");
			break;
		}
	}
	// }}}	
	my.load = function(_name){//{{{
		var _src = my.path+"/"+_name.replace(/^\//i,"")+".js"
				,_script = document.createElement("script");
		;
		_script.setAttribute("src",_src);
		_script.setAttribute("type","text/javascript");
		if(_name) {
			document.getElementsByTagName("head")[0].appendChild(_script);
		}
		return my;
	}//}}}
	my.loadStyle = function(_name){//{{{
		var _src = my.path+"/"+_name.replace(/^\//i,"")+".css"
				,_script = document.createElement("link");
		;
		_script.setAttribute("href",_src);
		_script.setAttribute("type","text/css");
		_script.setAttribute("rel","stylesheet");
		if(_name) {
			document.getElementsByTagName("head")[0].appendChild(_script);
		}
		return my;		
	}//}}}
	return my;
}(Jerboa || {}));
Jerboa.loadStyle("main").load("lib").load("core").load("plugin");
