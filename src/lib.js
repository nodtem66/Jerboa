 /* 
	* Javascript library (Additional Edition) {{{
	* @original author Den Odell
	* @from Pro JavaScript RIA Techniques Best Practices, Performance, and Presentation
	*/	
var Jerboa = (function(my) {
	my.lib = {};
	my.lib.env = {//{{{1
	ie: /MSIE/i.test(navigator.userAgent),
	ie6: /MSIE 6/i.test(navigator.userAgent),
	ie7: /MSIE 7/i.test(navigator.userAgent),
	ie8: /MSIE 8/i.test(navigator.userAgent),
	firefox: /Firefox/i.test(navigator.userAgent),
	opera: /Opera/i.test(navigator.userAgent),
	webkit: /Webkit/i.test(navigator.userAgent),
	camino: /Camino/i.test(navigator.userAgent)
	};//}}}

 	my.lib.onDomReady = function(callback)//{{{1
	{
		if(document.addEventListener)
		{
			//If Browser supports the DOMContentLoaded event
			document.addEventListener("DOMContentLoaded",callback,false);
		} else {
			//For IE
			if(document.body && document.body.lastChild)
			{
				callback();
			} else {
				//IE Hack
				var nameFunction = arguments.callee;
				setTimeout(function(){
						nameFunction(callback);
						},50);
			}

		}
	};//}}}
	my.lib.addEvent = function (element, eventType, callback) { ///{{{1
		eventType = eventType.toLowerCase();
		if (element.addEventListener) {
			element.addEventListener(eventType, callback, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + eventType, callback);
		}
	}; // }}}
	my.lib.removeEvent = function (element, eventType, callback) { //{{{1
		eventType = eventType.toLowerCase();
		if (element.removeEventListener) {
			element.removeEventListener(eventType,callback,false);
		} else if (element.detachEvent) {
			element.detachEvent("on" + eventType, callback);
		}
	}; //}}}
	my.lib.getEvent = function(event) { //{{{1
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}

		return {
				target: this.getTargetFromEvent(event),
				preventDefault: function() {
					if (event.preventDefault) {
						event.preventDefault(); // W3C method
					} else {
						event.returnValue = false; // Internet Explorer method
					}
				}
		};
	}; //}}}
			
	my.lib.getTargetFromEvent = function(event) { //{{{1
			var target = event.srcElement || event.target;
			if (target.nodeType == 3) { 
				target = target.parentNode; 
			}
			return target;
		}; //}}}
	

	my.lib.getArrayOfClassNames = function(element) { //{{{1
		var classNames = [];
		if (element.className) {
			classNames = element.className.split(" ");
		}
		return classNames;
	}; // }}}
	my.lib.addClass = function(element, className) { //{{{1
		var classNames = this.getArrayOfClassNames(element);
		classNames.push(className);
		element.className = classNames.join(" ");
	}; //}}}
	my.lib.removeClass = function(element, className) { //{{{1
		var classNames = this.getArrayOfClassNames(element);
		var resultingClassNames = [];
		for (var index = 0; index < classNames.length; index++) {
			if (className != classNames[index]) {
				resultingClassNames.push(classNames[index]);
			}
		}
		element.className = resultingClassNames.join(" ");
	}; //}}}
	my.lib.hasClass = function(element, className) { //{{{1
		var isClassNamePresent = false;
		var classNames = this.getArrayOfClassNames(element);
		for (var index = 0; index < classNames.length; index++) {
			if (className == classNames[index]) {
				isClassNamePresent = true;
			}
		}
		return isClassNamePresent;
	}; //}}}
	my.lib.getObjectOfStyle = function(element) { //{{{1
			var listStyle = element.getAttribute("style")
				,i=0
				,len=0
				,objectStyle={}
			,cssValue=""
				;

			if(listStyle)
			{
				listStyle = listStyle.split(";");
				// example ["top:45px","left:67px",...]
				for(i=0,len=listStyle.length;i<len;i++) 
				{
					//each item = "top:45px"
					if(listStyle[i])
					{
						cssValue = listStyle[i].split(":");
						//Trim 
						cssValue[0] = cssValue[0].replace(/^[\s]+/g,"");
						cssValue[1] = cssValue[1].replace(/^[\s]+/g,"");
						cssValue[0] = cssValue[0].replace(/[\s]+$/g,"");
						cssValue[1] = cssValue[1].replace(/[\s]+$/g,"");

						objectStyle[cssValue[0]] = cssValue[1];
					}
				}	

			}
			return objectStyle;
		}; //}}}
	my.lib.setObjectOfStyle = function(element,objectStyle) { //{{{1
		var listStyle=""
			,item
			;
		for(item in objectStyle)
		{
			listStyle = listStyle.concat(item+":"+objectStyle[item]+";");
		}
		element.setAttribute("style",listStyle);
	}; //}}}
	my.lib.addStyle = function(element,List) { //{{{1
		var objStyle = this.getObjectOfStyle(element),item;
		for(item in List)
			{
				objStyle[item] = List[item];
			}
		this.setObjectOfStyle(element,objStyle);
	}; //}}}
	my.lib.removeStyle = function(element,List) { //{{{1
			var objStyle = this.getObjectOfStyle(element),i,len;
			for(i=0,len=List.length;i<len;i++)
			{
				if(objStyle[List[i]])
				{
					delete objStyle[List[i]];
				}
			}
			this.setObjectOfStyle(element,objStyle);
	}; //}}}
	my.lib.setNode = function(element,List){ //{{{1
		if(arguments.length == 0)
		{
			return document.createElement("div");
		}
		if(arguments.length == 1)
		{
			List = arguments[0];
			element = document.createElement(List.tag || List.Tag || "div");
		}
		var listAttr = List.Attr || List.attr || {}  
		, listEvent = List.event || List.Event || {} 
		;
		//example attr: {id: xxx,class: yyy}
		//example event: {add: click,fn: function1}

		//Add event <tag onclick="function1"></tag>
		if(listEvent.add)
		{
			this.addEvent(element,listEvent.add,listEvent.fn);
		}
		else if(listEvent.remove)
		{
			this.removeEvent(element,listEvent.remove,listEvent.fn);
		}
		//Add attribute <tag attr1="value"></tag>
		for(var key in listAttr)
		{
			element.setAttribute(key,listAttr[key]);
		}
		//Add innerHTML <tag>innerHTML</tag>
		if(List.html) element.innerHTML = List.html;

		return element;
	}; //}}}
	my.lib.request = function(objSetting){/*{{{*/
	/* 
	 * Usage:
	 * request({
	 * url: "http://somewhere.com/somepage.php?key1=value",
	 * method: "post",
	 * somekey2: "somevalue2",
	 * somekey3: "somevalue3",
	 * lastkey: "lastvalue"
	 * });
	 */
					
	//Build xhr objectStyle
	var xmlhttp =null
		,method = objSetting.method.toUpperCase() || "GET"
		,url = objSetting.url
		,dataKey = ""
		,dataToSend=""
		;
	delete objSetting.method;
	delete objSetting.url;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	for(dataKey in objSetting)
	{
		dataToSend += dataKey+"="+objSetting[dataKey]+"&";
	}
	dataToSend = dataToSend.substr(0,dataToSend.length-1);
	if(method == "GET") 
	{
		if(/\?/.test(url))
			url = url+"&"+dataToSend;
		else
			url = url+"?"+dataToSend;
	}
	xmlhttp.open(method,encodeURI(url),true);
	xmlhttp.onreadystatechange = function()
	{
		if(xmlhttp.readyState == 4)
		{
			if(xmlhttp.status == 200)
				console.log("Jerboa send complete");
			else  
				console.log("Jerboa send fail");
		}

	};
	if(method == "POST")
	{
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.setRequestHeader("Content-length",dataToSend.split("&").length);
		xmlhttp.setRequestHeader("Connection","close");
		xmlhttp.send(encodeURI(dataToSend));
	}
	else xmlhttp.send();

};/*}}}*/
	my.lib.detectMedia = function(element)//{{{1
	{
		//TODO: Detect another kind of media
		var listTextTag = {"p":1,"span":1,"div":1}
		, listMediaTag = {"object":1,"embed":1,"video":1}
		;
		if(element.tagName.toLowerCase() == "img")
		{
			return "image";
		} else if(listMediaTag[element.tagName.toLowerCase()] || element.getAttribute("class") == "jerboa-media-touch"){
			return "media";
		} else {
			return "text";
		}
	}//}}}
	
	/*Bind function {{{1
		@author Nodtem66
		@param 
		callback 	- [Function] function to call
		scope	 	- [Object] value of "_my.lib" variable when call function
		useThrottle - [Number] delay to run function
		@return
		Anomymous function 

		How to use :
		1. Change scope of variables
		2. Setting Static arguments
		3. Limit speed to repeat the function :Prevent to Old Browser (such as IE) crash.

	Example :
	1.1 Change scope to "Jerboa" Object
	_my.lib.curry(function,Jerboa,false) 
	1.2 Change scope to "window" Object
	_my.lib.curry(function,window,false)
	1.3 use default scope
	_my.lib.curry(function,null,false)
	2. function foo(a,b,c) { alert(a+b-c); }
	2.1 bar = _my.lib.curry(foo,null,false,5)
	bar(6,1) => 10 (from 5+6-1)
	2.2 bar = _my.lib.curry(foo,null,false,5,8)
	bar(9) 	 =>	4  (from 5+8-9)
	3.1 Limit in 100 msec can run function in 1 time.
	_my.lib.curry(function,null,100)
	3.2 Limit in 1000 msec can run function in 1 time.
	_my.lib.curry(function,null,1000)
	3.3 No limit
	_my.lib.curry(function,null,0) OR _my.lib.curry(function,null,false)
	*/
	my.lib.curry = function(callback,scope,useThrottle) {
		var scope = scope || window
			,argsStatic = Array.prototype.slice.call(arguments,3)
			;
		if(useThrottle)
		{
			return function() {
				var argsDynamic = arguments;
				clearTimeout(callback.tId);
				callback.tId = setTimeout(function(){
						callback.apply(scope,argsStatic.concat(Array.prototype.slice.call(argsDynamic,0)));
						},useThrottle);
			};
		}
		else	
			return function () {
				callback.apply(scope,argsStatic.concat(Array.prototype.slice.call(arguments,0)));
			};
	};//}}}

	return my;
}(Jerboa || {}));
	/*}}}*/

