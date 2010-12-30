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
		var tester = new RegExp(className);
		return element.className && tester.test(element.className);
	}; //}}}
	my.lib.getObjectOfStyle = function(element) { //{{{1
			var listStyle = element.getAttribute("style") || ""
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
						if(cssValue.length == 2){
						//Trim 
						cssValue[0] = cssValue[0].replace(/^[\s]+/g,"");
						cssValue[1] = cssValue[1].replace(/^[\s]+/g,"");
						cssValue[0] = cssValue[0].replace(/[\s]+$/g,"");
						cssValue[1] = cssValue[1].replace(/[\s]+$/g,"");

						objectStyle[cssValue[0]] = cssValue[1];
						}
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
	my.lib.request = function(objSetting){//{{{
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
		,method = (objSetting.method)? objSetting.method.toUpperCase() : "GET"
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
				if(DEBUG) console.log("Jerboa send complete");
			else  
				if(DEBUG) console.log("Jerboa send fail");
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

};//}}}
	my.lib.detectMedia = function(element)//{{{1
	{
		//TODO: Detect another kind of media
		var listTextTag = {"p":1,"span":1,"div":1}
		, listMediaTag = {"object":1,"embed":1,"video":1}
		;
		if(typeof element === "object")
		{
			if(element.nodeName.toLowerCase() == "img")
			{
				return "image";
			} else if(listMediaTag[element.nodeName.toLowerCase()] || element.getAttribute("class") == "jb-media-touch"){
				return "media";
			} else {
				return "text";
			}
		} else if(typeof element === "string") {
			if(/^\<img/i.test(element)) return "image";
			else{
				for(var i in listMediaTag){
					if((new RegExp("^\<"+i)).test(element)) return "media";
				}
			}
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
}(Jerboa || {})); //}}}

/*
 * Jerboa Core
 * version: 0.01
 * @Author Jirawat Iamsam-ang
 */
var Jerboa = (function(my){
	var Interface = function(_name,_array) {//{{{ Interface function
		this.name = _name;
		this.methods = [];
		for(var i=0,len=_array.length;i<len;i++){
			if(typeof _array[i] !== "string"){
				throw new Error("Interface Error: Method names should be string.");
			}
			this.methods.push(_array[i]);
		}
	};
	function hasImplements(_object) {
		//var _interface,i,j,arglen;
		if(arguments.length < 2)
			throw new Error("hasImplement Error: Please use hasImplement(Object, Interface1 [, Interface2, ...])");
		for(var i=1,arglen=arguments.length,j,intflen;i<arglen;i++){
			 var _interface = arguments[i];
			for(j=0,intflen=_interface.methods.length;j<intflen;j++){
				var _method = _interface.methods[j];
				if(!_object[_method]){
					throw new Error("hasImplement Error: object did not implement "+_interface.name+" interface. Method "+_method+" was not found.");
				}
			}
		}
	}
	function extend(subclass,superclass) {
		var F = function(){};
		F.prototype = superclass.prototype;
		subclass.prototype = new F();
		subclass.prototype.constructor = subclass;
	}
	//}}}
	//{{{ Define Class
	var Panel = function(panelName){//{{{2
		var node,childs = {},panelName = panelName.toLowerCase();
		if(usedModule[panelName]){
			throw new Error("Module "+panelName+" have been used");
		}
		node = lib.setNode({attr:{id: "jb-"+panelName.toLowerCase(),"class":"jb-panel jb-ignore hide"}});
		usedModule[panelName.toLowerCase()] = true;
		this.getElement = function(){
			return node;
		}
		this.add = function(menuObject){
			node.appendChild(menuObject.getElement());
			childs[menuObject.name] = menuObject;
			return node.children.length-1;
		}
		this.remove = function(childId){
			node.removeChild(this.getChild(childId));
		}
		this.getChild = function(childName){
			if(childName)
				return childs[childName];
		}
		this.show = function(){
			if(lib.hasClass(node,"hide"))
				lib.removeClass(node,"hide");
		}
		this.hide = function(){
			if(!lib.hasClass(node,"hide"))
				lib.addClass(node,"hide");
		}
	};//}}}
	var Stage = function(eleTextArea){ //{{{2
		var textHTML = eleTextArea.innerHTML.replace(/&lt;/ig,"<").replace(/&gt;/ig,">")
		,stage = lib.setNode({attr: {id: "jb-stage"},html: textHTML}),layer=[],node,screen={},old_content;
		// Detect Save file
		if(stage.children[0] && stage.children[0].className == "jb-ignore")
		{
			node = stage.children[0];
			old_content = node.innerHTML;
		} else {
			node = lib.setNode({tag: "div",attr: {"class":"jb-ignore","style":"position:relative;top:0;left:0;width:100%;height:auto;overflow:hidden;"}});
			old_content = stage.innerHTML;
			stage.innerHTML = "";
			stage.appendChild(node);
		}

		//construct Layer
		if(node.children[0] && lib.hasClass(node.children[0],"jb-layer"))
		{
			layer.push(node.children[0]);
		} else {
			layer.push(lib.setNode({attr: {"index":0,"class":"jb-layer jb-ignore","style":"z-index:2000;"},html: old_content}));
			node.appendChild(layer[0]);
		}
		//construct Lightscreen
		/*screen.top = lib.setNode({attr: {"class":"jerboa-lightbox jerboa-ignore",style: ""}});
		screen.left = lib.setNode({attr: {"class":"jerboa-lightbox jerboa-ignore",style: ""}});
		screen.right = lib.setNode({attr: {"class":"jerboa-lightbox jerboa-ignore",style: ""}});
		screen.bottom = lib.setNode({attr: {"class":"jerboa-lightbox jerboa-ignore",style: ""}});
		ui.core.appendChild(screen.top);
		ui.core.appendChild(screen.right);
		ui.core.appendChild(screen.left);
		ui.core.appendChild(screen.bottom);*/
		
		//Public method
		this.currentEditingNode = "";
		this.currentState = "";
		this.getElement = function(){return stage;}
		this.getLayer = function(){
			return layer[0];
		}
		/*this.refreshStage = function(){
			var propElement = {x:stage.offsetLeft,y:stage.offsetTop,width:stage.offsetWidth,height:stage.offsetHeight}
				,propDoc = {width: Math.max(document.body.offsetWidth,document.documentElement.offsetWidth),height: Math.max(document.body.offsetHeight,document.documentElement.offsetHeight)}
			;
			lib.addStyle(screen.top,{top:"0px",left:"0px",width:propElement.x+"px",height:propDoc.height+"px"});
			lib.addStyle(screen.left,{top:"0px",left:propElement.x+"px",width:propElement.width+"px",height:propElement.y+"px"});
			lib.addStyle(screen.right,{top:"0px",left:parseInt(propElement.x+propElement.width)+"px",width:parseInt(propDoc.width - propElement.x - propElement.width)+"px",height:propDoc.height+"px"});
			lib.addStyle(screen.bottom,{top:parseInt(propElement.y+propElement.height)+"px",left:propElement.x+"px",width:propElement.width+"px",height:parseInt(propDoc.height - propElement.y - propElement.height)+"px"});
		}*/
		this.setHeight = function(height){
			lib.addStyle(node,{"height":height+"px"});
			//this.refreshStage();
		}
		this.autoHeight = function(){
			var height = 0,i;
			for(i=0,len=layer[0].children.length;i<len;i++){
				height += layer[0].children[i].offsetHeight;
			}
			if(DEBUG) console.log("Page height: "+height);
			this.setHeight((height>300)? height : 300);
		}
		this.normalizeTree = function(_root){ // {{{3
			if(!_root) return "";
			var queue=[],queue2=[]
				,i
				,len
				,currentNode
				,flagFloor1=true
				,tempNode
				,newTree = _root.cloneNode(true);
			queue.push(newTree);
			queue2.push(_root);
			while(queue.length>0){
				currentNode = queue.shift();
				currentNode2 = queue2.shift();
				if(!currentNode.children) continue;
				for(i=0,len=currentNode.children.length;i<len;i++){
					switch(lib.detectMedia(currentNode.children[i])){
						case "image":
							if(!flagFloor1 && currentNode.children.length == 1) {
								tempNode = currentNode;
								while(tempNode.children.length == 1 && !lib.hasClass(tempNode.parentNode,"jb-ignore")){
									tempNode = tempNode.parentNode;
								}
								tempNode.setAttribute("role","image");
								tempNode.appendChild(currentNode.children[i].cloneNode(true));
								tempNode.removeChild(tempNode.firstChild);
								continue;
							}
							else {
								//move this element to root Element
								tempNode = currentNode.children[i].cloneNode(true);
								tempNode = lib.setNode({tag:"div",attr:{"role":"image","style":"position:absolute;"}}).appendChild(tempNode).parentNode;
								newTree.appendChild(tempNode);
								currentNode.removeChild(currentNode.children[i]);
								delete tempNode;
							}
							break;
						case "media":
							if(!flagFloor1 && currentNode.children.length == 1) {
								tempNode = currentNode;
								while(tempNode.children.length == 1 && !lib.hasClass(tempNode.parentNode,"jb-ignore")){
									tempNode = tempNode.parentNode;
								}
								tempNode.setAttribute("role","media");
								tempNode.appendChild(lib.setNode({tag:"div",attr:{"class":"jb-media-touch"},html:"\&\#160\;"}));
								tempNode.appendChild(currentNode.children[i].cloneNode(true));
								tempNode.removeChild(tempNode.firstChild);
								if(tempNode.children[1].nodeName.toLowerCase() == "object"){
									tempNode.children[1].insertBefore(lib.setNode({tag:"param",attr:{"name":"wmode","value":"opaque"}}),tempNode.children[1].children[0]);
									tempNode.children[1].lastChild.setAttribute("wmode","opaque");
								}
								continue;
							}
							else {
								//move this element to root Element
								tempNode = currentNode.children[i].cloneNode(true);
								tempNode = lib.setNode({tag:"div",attr:{"role":"media","style":"position:absolute;"},html: "<div class=\"jb-media-touch\">\&\#160\;</div>"}).appendChild(tempNode).parentNode;
								if(tempNode.children[1].nodeName.toLowerCase() == "object"){
									tempNode.children[1].insertBefore(lib.setNode({tag:"param",attr:{"name":"wmode","value":"opaque"}}),tempNode.children[1].children[0]);
									tempNode.children[1].lastChild.setAttribute("wmode","opaque");
								}
								newTree.appendChild(tempNode);
								currentNode.removeChild(currentNode.children[i]);
								delete tempNode;
							}
							break;

						case "text":
							if(currentNode.children[i].innerHTML=="" && currentNode.children[i].nodeName.toLowerCase() != "div"){
								currentNode.removeChild(currentNode.children[i]);
								i--;len--;
								continue;
							}
							if(flagFloor1 && currentNode.children[i].nodeName.toLowerCase() != "div"){
								tempNode = currentNode.children[i].cloneNode(true);
								tempNode = lib.setNode({tag:"div",attr:{"role":"text","style":"position:absolute;top:"+currentNode2.children[i].offsetTop+"px;left:"+currentNode2.children[i].offsetLeft+"px;"}}).appendChild(tempNode).parentNode;
								if(newTree.children.length == 1)newTree.appendChild(tempNode);
								else newTree.insertBefore(tempNode,newTree.children[i]);
								newTree.removeChild(newTree.children[i+1]);
								delete tempNode;
							}
							queue.push(currentNode.children[i]);
							queue2.push(currentNode2.children[i]);
						default:
							break;
					}
				}
				if(flagFloor1) flagFloor1=false;
			}
			_root.innerHTML = newTree.innerHTML;
			return true;
		}//}}}
		var self = this;
		setTimeout(function(){self.autoHeight();self.normalizeTree(layer[0]);history.save(layer[0].innerHTML);},100);
		//this.normalizeTree(layer[0]);
	} //}}}
	var History = function(size,callback){ //{{{2
		var circularList= [],self = this
		,index=-1,flen=0,blen=0,enable=true;
		size = size || 10;
		this.save = function(data){
			if(!enable) return false;
			if(blen!=size)
				blen++;
			index = (index+1) % size;
			flen = 1;
			circularList[index] = data;
			if(DEBUG) console.log("history: save");
			//if(DEBUG) console.log(circularList,blen,index,flen);
		}
		this.undo = function(){
			if(!enable) return false;
			if(blen -1 > 0){
				index = (index-1 >= 0)? index-1 : size-1;
				blen--;flen++;
				callback(circularList[index]);
				if(DEBUG) console.log("history: undo");
				//if(DEBUG) console.log("("+circularList[index]+")",blen,index,flen);
			}
		}
		this.redo = function(){
			if(!enable) return false;
			if(flen -1 > 0) {
				index = (index+1) % size;
				blen++;flen--;
				callback(circularList[index]);
				if(DEBUG) console.log("history: redo");
				//if(DEBUG) console.log("("+circularList[index]+")",blen,index,flen);
			}
		}
		this.clear = function(){
			circularList = [];
			flen = 0;
			blen = 0;
			index = -1;
		}
		this.freeze = function(msec) {
			enable = false;
		}
		this.unfreeze = function(){
			enable = true;
		}
	}; //}}}
	var Button = function(label,name,className) {//{{{2
		var node = lib.setNode({attr: {"class":"jerboa-button jerboa-ignore "+((className)?className:"")},html: label,event: {add: "click",fn: function(e){sandbox.notify("click-button-"+name,e)}}});
		this.name = name;
		this.getValue = function() {return label;};
		this.setValue = function(name){
			lib.setNode(node,{html:name});	
		};
		this.getElement = function(){
			return node;
		}
	}//}}}
	var FlipSwitch = function(label,className){//{{{2
		var wrapper = lib.setNode({attr:{"class":"flipswitch jerboa-ignore"}})
		,node = lib.setNode({attr:{"class":"jerboa-button jerboa-ignore"}})
		,switchOn = lib.setNode({attr: {"class":"hide"},html:"on"})
		,switchOff = lib.setNode({html:"off"})
		,labelnode = lib.setNode({tag:"label",attr:{"class":"jerboa-ignore"},html:label})
		,value = false;
		;
		wrapper.appendChild(labelnode);
		wrapper.appendChild(node);
		node.appendChild(switchOn);
		node.appendChild(switchOff);
		this.name = label;
		this.toggle = function(e){
			if(e){
				lib.getEvent(e).preventDefault();
			}
			if(value){
				value = false;
				lib.removeClass(switchOff,"hide");
				lib.addClass(switchOn,"hide");
			} else {
				value = true;
				lib.removeClass(switchOn,"hide");
				lib.addClass(switchOff,"hide");
			}
			sandbox.notify("click-flipswitch-"+label,value);
		}
		this.getElement = function(){
			return wrapper;
		}
		this.getValue = function(){
			return value;
		}
		this.setValue = function(_value){
			if(value != _value){
				this.toggle();
			}
		}
		lib.setNode(node,{event:{add:"mousedown",fn: lib.curry(this.toggle,this)}});
	}//}}}
	var HLine = function(className){//{{{2
		var node = lib.setNode({attr:{"class":"hline "+((className)?className:"")}});
		this.name = "hline"+Date();
		this.getElement = function(){
			return node;
		}
	}//}}}
	var TextField = function(label,text,className){//{{{2
		var wrapper = lib.setNode()
		,node = lib.setNode({tag:"input",attr:{"value":(text)?text:"","type":"text","class":(className)?className:""}})
		,labelnode = lib.setNode({tag:"label",html:label})
		;
		wrapper.appendChild(labelnode);
		wrapper.appendChild(node);
		this.name = label
		this.setClass = function(className){
			lib.setNode(node,{attr:{"class":className}});
		}
		this.getValue = function() {
			return node.value;
		}
		this.setValue = function(value){
			node.value = value;
		}
		this.getElement = function(){
			return wrapper;
		}
	}//}}}
	var TextArea = function(label,text,className){//{{{2
		var wrapper = lib.setNode()
		,node = lib.setNode({tag:"textarea",attr:{"class":(className)?className:""},html:(text)?text:""})
		,labelnode = lib.setNode({tag:"label",html:label})
		;
		wrapper.appendChild(labelnode);
		wrapper.appendChild(node);
		this.name = label
		this.setClass = function(className){
			lib.setNode(node,{attr:{"class":className}});
		}
		this.getValue = function() {
			return node.innerHTML;
		}
		this.setValue = function(value){
			node.innerHTML = value;
		}
		this.getElement = function(){
			return wrapper;
		}
		
	}//}}}
	//}}}
	//{{{ Private members
	var Library= new Interface("Library",["onDomReady","addEvent","removeEvent","getEvent","addClass","removeClass","hasClass","addStyle","removeStyle","setNode","curry","request"])
	,Module= new Interface("Module",["init","destroy"])
	,MenuItemInterface = new Interface("MenuItem",["add","remove","getValue","setValue","getElement","name"])
	,UI = new Interface("UI",["getValue","setValue","name"])
	; 
	hasImplements(my.lib,Library);
	var lib = my.lib;delete my.lib;
	var path = my.path;delete my.path;
	var DEBUG = true;
	var usedModule = {}
	,ui = {}
	,modules = {}
	,stage = null
	,textarea = null
	,cache = {}
	,history = new History(10, function(data){stage.getLayer().innerHTML = data;})
	,sandbox = new (function(){
		var events={};
		this.lib = lib;
		this.Class = function(nameClass){
			var allowClass = {"Panel":1,"Button":1,"FlipSwitch":1,"Hline":1,"TextField":1,"TextArea":1,"History":1};
			if(!allowClass[nameClass])
				throw new Error("sandbox: not found "+nameClass+" in Class");
			return eval(nameClass);
		}
		this.getHistory = function(){
			return history;
		}
		this.getStage = function(){
			return stage;
		}
		this.getUI = function(nameUI){
			if(!ui[nameUI])
				throw new Error("sandbox: not found "+nameUI+" in UI");
			return ui[nameUI];
		}
		this.addPanel = function(namePanel){
			var panelObject = new Panel(namePanel);
			ui.panelbar.appendChild(panelObject.getElement());
			return panelObject;
		}
		this.notify = function(eventName,eventData){
			var data = eventName.split("-"),i,len;
			data = {
				"event": data[0] || "",
				"subevent": data[1] || "",
				"name": data[2] || "",
				"data": eventData
			}
			if(events[eventName]){
				for(var i=0,len=events[eventName].length;i<len;i++){
					events[eventName][i](data);
				}
			}
			if(events[data.event+"-"+data.ui]){
				for(var i=0,len=events[data.event+"-"+data.ui].length;i<len;i++){
					events[data.event+"-"+data.ui][i](data);
				}				
			}
			if(events[data.event]){
				for(var i=0,len=events[data.event].length;i<len;i++){
					events[data.event][i](data);
				}				
			}
			if(DEBUG) console.log(eventName);
		}
		this.listen = function(arrayEventName,callback,scope){
			if(typeof arrayEventName === "string"){
				if(!events[arrayEventName]) events[arrayEventName] = [];
				events[arrayEventName].push(lib.curry(callback,scope));
			}
			for(var i=0,len=arrayEventName.length;i<len;i++){
				if(!events[arrayEventName[i]]){
					events[arrayEventName[i]] = [];
				}
				events[arrayEventName[i]].push(lib.curry(callback,scope));
			}
		}
		this.hasModule = function(nameModule){
			if(modules[nameModule]) return true;
			return false;
		}
	});
	
	//}}}
	//{{{ Public members
	my.version = 0.001;
	//}}}
	my.register = function(moduleName,moduleCreator){//{{{
		var moduleObject = new moduleCreator(sandbox);
		hasImplements(moduleObject,Module);
		if(modules[moduleName]){
			throw new Error("Duplicate Module: "+moduleName);
		}
		modules[moduleName] = 	moduleObject;
		if(ui.core){
			modules[moduleName].init();
		}
	};
	for(var i=0,len=my.tempRegister.length;i<len;i++){
		my.register.apply(null,my.tempRegister[i]);
	}
	delete my.tempRegister;
	//}}}
	var startModule = function(moduleName){//{{{
		if(!modules[moduleName]){
			throw new Error("Not Found "+moduleName+" Module");
		}
		modules[moduleName].init();
	};//}}}
	var stopModule = function(moduleName){//{{{
		if(!modules[moduleName]){
			throw new Error("Not found "+moduleName+" Module");
		}
		modules[moduleName].destroy();
	};//}}}
	my.apply = function(domId){//{{{
		var _;
		if(!(_ = document.getElementById(domId))) return false;
		textarea = _;
		init();
	};
	//}}}
	var touch = function(e) {//{{{
		//Controller of resize and drag element
		var data = cache
			,event = lib.getEvent(e)
			,sizeBorder = 1 //px
			;
		if(stage.currentState != "textedit") event.preventDefault();
		if(e.type == "mousedown")
		{
			if(stage.currentState != "textedit" || (e.shiftKey))
			{
				event.preventDefault();
				data.x = e.pageX;
				data.y = e.pageY;
				data.isMove = false;
				lib.addEvent(document,"mousemove",touch);
				lib.addEvent(document,"mouseup",touch);
			}
		} else if(e.type == "mousemove")
		{
			data.isMove = true;
			if(e.shiftKey)
			{
				data.root_w += e.pageX - data.x;
				data.root_h += e.pageY - data.y;
			} else if(/move$/i.test(stage.currentState)) {
				data.root_left += e.pageX - data.x;
				data.root_top += e.pageY - data.y;
			}
			if(data.root_top + data.root_h + 2*sizeBorder > data.screen_h){
				if(e.shiftKey) data.root_h = data.screen_h - data.root_top -(2*sizeBorder);
				else data.root_top -= e.pageY - data.y;
			} else if(data.root_top < 0) data.root_top -= e.pageY - data.y;
			if(data.root_left + data.root_w + 2*sizeBorder > data.screen_w){
				if(e.shiftKey) data.root_w = data.screen_w - data.root_left - (2*sizeBorder); 
				else data.root_left -= e.pageX - data.x;             
			} else if(data.root_left < 0) data.root_left -= e.pageX - data.x;

			if(e.shiftKey){
				lib.addStyle(stage.currentEditingNode,{width:data.root_w+"px",height: data.root_h+"px"});
				if(/^image/i.test(stage.currentState))lib.addStyle(stage.currentEditingNode.children[0],{width:data.root_w+"px",height: data.root_h+"px"});
				else if(/^media/i.test(stage.currentState) && stage.currentEditingNode.children.length == 2) {
					lib.addStyle(stage.currentEditingNode.children[1],{width:data.root_w+"px",height: data.root_h+"px"});
					lib.addStyle(stage.currentEditingNode.children[1].getElementsByTagName("embed")[0],{width:data.root_w+"px",height: data.root_h+"px"});					
				}
			}else if(/move$/i.test(stage.currentState))
				lib.addStyle(stage.currentEditingNode,{top:data.root_top+"px",left: data.root_left+"px"});
			data.x = e.pageX;
			data.y = e.pageY;

		} else if(e.type == "mouseup")
		{
			if(data.isMove) history.save(stage.getLayer().innerHTML);
			lib.removeEvent(document,"mousemove",touch);
			lib.removeEvent(document,"mouseup",touch);
		}

	}//}}}
	var restoreNormalState = function()//{{{
	{
		if(!stage.currentState) {
			var childNode = stage.getLayer().children;
			for(var i=0,len=childNode.length;i<len;i++){
				if(lib.hasClass(childNode[i],"jb-touch"))
					lib.removeClass(childNode[i],"jb-touch");
			}
			return false;
		}
		lib.removeClass(stage.currentEditingNode,"jb-touch");
		lib.removeEvent(stage.currentEditingNode,"mousedown",touch);
		switch(stage.currentState)
		{
			case "textmove":
				break;
			case "textedit":            
				stage.currentEditingNode.setAttribute("contenteditable","false");
				history.save(stage.getLayer().innerHTML);
			//Jerboa.toggle.menu.call(Jerboa,"text");
			break;
			case "imagemove":
				break;
			case "imageedit":
				break;
			default: break;
		}
		stage.currentEditingNode = null;
		stage.currentState = "";
		sandbox.notify("restorestate");
	}//}}}
	var click = function(e) {//{{{
		var event = lib.getEvent(e)
			,mediaType=""
			,tempStage=null
			;
		if(stage.currentState == "textedit"){
			if(lib.hasClass(event.target,"jb-ignore"))
				restoreNormalState();
			//return false;
		}
		event.preventDefault();
		if(!lib.hasClass(event.target,"jb-ignore"))
		{
			//TODO: Detect another kind of media
			mediaType = lib.detectMedia(event.target);
			var _root = event.target;
			while(!(_root.parentNode.className && lib.hasClass(_root.parentNode,"jb-ignore"))){
				if(!_root.parentNode.nodeName || _root.parentNode.nodeName.toLowerCase() == "html" || _root.parentNode.nodeName.toLowerCase() == "body") {
					restoreNormalState();
					return false;
				}
				_root = _root.parentNode;
				if(!_root.parentNode) {
					restoreNormalState();
					return false;
				}
			}
			if(!_root.parentNode.getAttribute("index")) return false;
			//if(stage.currentEditingNode == _root && /move$/i.test(stage.currentState)) return false;
			if(stage.currentEditingNode == _root) return false;
			if(stage.currentEditingNode != null) restoreNormalState();
			
			stage.currentEditingNode = _root;
			lib.addClass(_root,"jb-touch");
			lib.addEvent(_root,"mousedown",touch);
			stage.currentState = mediaType + "move";
			sandbox.notify(mediaType +"move");
			tempStage = stage.getElement();
			cache.isMove = false;
			cache.screen_top = tempStage.offsetTop;
			cache.screen_left = tempStage.offsetLeft;
			cache.screen_w = tempStage.offsetWidth ;
			cache.screen_h = tempStage.offsetHeight ;
			cache.root_top = _root.offsetTop;
			cache.root_left = _root.offsetLeft;
			cache.root_w = _root.offsetWidth;
			cache.root_h = _root.offsetHeight;
			return false;
		}
		restoreNormalState();
	}//}}}
	var dbclick = function(e) {//{{{
		var event = lib.getEvent(e)
		event.preventDefault();
		if(!lib.hasClass(event.target,"jb-ignore"))
		{
			switch(lib.detectMedia(event.target))
			{
				case "text":
					//Find the Root to start edit mode
				var _root = event.target;
				if(!_root.parentNode) return false;
				while(!(_root.parentNode.className && lib.hasClass(_root.parentNode,"jb-ignore"))){
					if(_root.parentNode.nodeName.toLowerCase() == "html" || _root.parentNode.nodeName.toLowerCase() == "body")
						return false;
					_root = _root.parentNode;
				}			
				if(!_root.parentNode.getAttribute("index")) return false;
				if(stage.currentEditingNode == _root && stage.currentState == "textedit") return false;
				if(stage.currentEditingNode != null) restoreNormalState();
				stage.currentEditingNode = _root;
				lib.addClass(_root,"jb-touch");
				lib.addEvent(_root,"mousedown",touch);
				//$.Events.add(_root,"blur",Jerboa.restoreNormalState);

				//Jerboa.toggle.menu.call(Jerboa,"text");
				_root.setAttribute("contenteditable","true");
				_root.focus();
				stage.currentState = "textedit";
				sandbox.notify("textedit");

				return false;
				break;
				case "image":
					break;

				default: break;
			}
		}
	}//}}}
	var keyboard = function(e){//{{{
		var event = lib.getEvent(e);
		//console.log(event);
		if(e.ctrlKey)
		{
			if(e.keyCode == 90){
						sandbox.notify("keydown-normal-undo");
						restoreNormalState();
			}
			else if(e.keyCode == 89){
						sandbox.notify("keydown-normal-redo");		
						restoreNormalState();
			}
			else if(e.keyCode == 86 && !(/edit$/i.test(stage.currentState))){
				sandbox.notify("keydown-noediting-paste",e);
				restoreNormalState();
			}
		}
		if(/move$/i.test(stage.currentState)){
			if(e.ctrlKey){
				if(e.keyCode == 67){
					sandbox.notify("keydown-move-copy");
					restoreNormalState();
				}
				else if(e.keyCode == 88){
					sandbox.notify("keydown-move-copy");
					stage.getLayer().removeChild(stage.currentEditingNode);
					restoreNormalState();
				}
			}
			else if((e.keyCode == 8 || e.keyCode == 46)){
				stage.getLayer().removeChild(stage.currentEditingNode);
				history.save(stage.getLayer().innerHTML);
				restoreNormalState();
			}
		}
	}//}}}
	var init = function(){//{{{
		var documentFragment = document.createDocumentFragment(),tempNode;

		//construct UI
		ui.core = lib.setNode({attr:{id: "jb-a","style":"width:"+textarea.offsetWidth+"px;"}});
		ui.panelbar = lib.setNode({attr: {id: "jb-b"}});
		stage = new Stage(textarea);		
		ui.bottom = lib.setNode({attr: {"class": "jb-hline"}});
		ui.core.appendChild(ui.panelbar);
		ui.core.appendChild(stage.getElement());
		ui.core.appendChild(ui.bottom);
		//constrcut Stage
		lib.addEvent(document,"click",click);
		lib.addEvent(document,"dblclick",dbclick);
		lib.addEvent(document,"keydown",keyboard);
		//Init Modules
		for(var plugin in modules){
			//var tempNode = new FlipSwitch(plugin);
			//tempNode.setValue(modules[plugin].enable);
			//ui.option.add(tempNode);
			modules[plugin].init();
		}
		//Save History Events
		sandbox.listen("keydown-normal-undo",function(){history.undo();});
		sandbox.listen("keydown-normal-redo",function(){history.redo();});
		//Disable textarea
		lib.addClass(textarea,"hide");		
		documentFragment.appendChild(ui.core);
		textarea.parentNode.insertBefore(documentFragment,textarea);
	};//}}}
	var destroy = function(){//{{{
		document.body.removeChild(ui.core);
		for(i=0,len=document.styleSheets.length;i<len;i++) {
			if(/jerboa\.css/i.test(document.styleSheets[i].href)) {
				document.getElementsByTagName("head")[0].removeChild(document.styleSheets[i].ownerNode);
				break;
			}
		}
		restoreNormalState();
		lib.removeEvent(document,"click",click);
		lib.removeEvent(document,"dblclick",dbclick);
		lib.removeEvent(document,"keydown",keyboard);
	};//}}}
	if(my.tempApply) my.apply(my.tempApply);
	delete my.tempApply;	

	return my;
}(Jerboa || {}));

