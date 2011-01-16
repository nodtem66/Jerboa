 /*
	* Jerboa Loader
	* @describe:  parallell loading file
	*/
var Jerboa = (function(my){
	// find path {{{1 
	var _scripts = document.getElementsByTagName("script"),path="";
	for(var i=0,len=_scripts.length;i<len;i++){
		if(/loader\.js/.test(_scripts[i].src)) {
			my.path = _scripts[i].src.replace("loader.js","");
			my.path = my.path.replace(/\/$/i,"");
			path = my.path;
			break;
		}
	}
	// }}}	
	my.load = function(_name){//{{{
		var _src = path+"/"+_name.replace(/^\//i,"")+".js",
		_script = document.createElement("script");
		_script.setAttribute("src",_src);
		_script.setAttribute("type","text/javascript");
		if(_name) {
			document.getElementsByTagName("head")[0].appendChild(_script);
		}
		return my;
	};//}}}
	my.loadStyle = function(_name){//{{{
		var _src = path+"/"+_name.replace(/^\//i,"")+".css",
				_script = document.createElement("link");
		_script.setAttribute("href",_src);
		_script.setAttribute("type","text/css");
		_script.setAttribute("rel","stylesheet");
		if(_name) {
			document.getElementsByTagName("head")[0].appendChild(_script);
		}
		return my;		
	};//}}}
	my.tempRegister = [];
	my.tempApply = "";
	my.register = function(){
		my.tempRegister.push(arguments);
	};
	my.apply = function(nameId,config){
		my.tempApply = [nameId,config];
	};
	return my;
}(Jerboa || {}));
Jerboa.loadStyle("css/core").load("core").load("plugins/fancyinsert").load("plugins/textmenu");
