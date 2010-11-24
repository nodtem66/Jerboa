/*
* Jerboa Tool Kit
* @author Jirawat Iamsam-ang
* @version 1.00
*/
(function(){
/* 
* Javascript Library (Additional Edition) {{{
* @original author Den Odell
* @from Pro JavaScript RIA Techniques Best Practices, Performance, and Presentation
*/
DEBUG_MODE = 1;
var $ = {};

$.env = {
			ie: /MSIE/i.test(navigator.userAgent),
			ie6: /MSIE 6/i.test(navigator.userAgent),
			ie7: /MSIE 7/i.test(navigator.userAgent),
			ie8: /MSIE 8/i.test(navigator.userAgent),
			firefox: /Firefox/i.test(navigator.userAgent),
			opera: /Opera/i.test(navigator.userAgent),
			webkit: /Webkit/i.test(navigator.userAgent),
			camino: /Camino/i.test(navigator.userAgent)
		};

$.onDomReady = function(callback)
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
};
// Add a new namespace to the $ library to hold all event-related code,
// using an object literal notation to add multiple methods at once
$.Events = {
	// The add method allows us to assign a function to execute when an
	// event of a specified type occurs on a specific element
	add: function (element, eventType, callback) {
		// Store the current value of this to use within subfunctions
		var self = this;
		eventType = eventType.toLowerCase();
		if (element.addEventListener) {
		// If the W3C event listener method is available, use that
			
			element.addEventListener(eventType, callback, false);
		} else if (element.attachEvent) {
			// Otherwise use the Internet Explorer-proprietary event handler
			element.attachEvent("on" + eventType, callback);
		}
},
	// The remove method allows us to remove previously assigned code
	// from an event
	remove: function (element, eventType, callback) {
		eventType = eventType.toLowerCase();
		if (element.removeEventListener) {
			// If the W3C-specified	method is available, use that
			element.removeEventListener(eventType,callback,false);
		} else if (element.detachEvent) {
			// Otherwise, use the Internet Explorer-specific method
			element.detachEvent("on" + eventType, callback);
		}
		
},
	// The standardize method produces a unified set of event
	// properties, regardless of the browser
	standardize: function(event) {
	// These two methods, defined later, return the current position of the
	// mouse pointer, relative to the document as a whole, and relative to the
	// element the event occurred within
	var page = this.getMousePositionRelativeToDocument(event);
	//var offset = this.getMousePositionOffset(event);
	
	// Let"s stop events from firing on element nodes above the current
	if (event.stopPropagation) {
		event.stopPropagation();
	} else {
		event.cancelBubble = true;
	}
	// We return an object literal containing seven properties and one method
	return {
		
		// The target is the element the event occurred on
		target: this.getTarget(event),
		
		// The relatedTarget is the element the event was listening for,
		// which can be different from the target if the event occurred on an
		// element located within the relatedTarget element in the DOM
		//relatedTarget: this.getRelatedTarget(event),
		
		// If the event was a keyboard-related one, key returns the character
		//event: event,
		
		// Return the x and y coordinates of the mouse pointer,
		// relative to the document
		pageX: page.x,
		pageY: page.y,
		
		// Return the x and y coordinates of the mouse pointer,
		// relative to the element the current event occurred on
		//offsetX: offset.x,
		//offsetY: offset.y,
		
		// The preventDefault method stops the default event of the element
		// we"re acting upon from occurring. If we were listening for click
		// events on a hyperlink, for example, this method would stop the
		// link from being followed
		preventDefault: function() {
			if (event.preventDefault) {
			event.preventDefault(); // W3C method
			} else {
			event.returnValue = false; // Internet Explorer method
			}
		}
	};
},
	// The getTarget method locates the element the event occurred on
	getTarget: function(event) {
		// Internet Explorer value is srcElement, W3C value is target
		var target = event.srcElement || event.target;
		// Fix legacy Safari bug which reports events occurring on a text
		// node instead of an element node
		if (target.nodeType == 3) { // 3 denotes a text node
			target = target.parentNode; // Get parent node of text node
		}
		// Return the element node the event occurred on
		return target;
},
	// The getMousePositionRelativeToDocument method returns the current
	// mouse pointer position relative to the top left edge of the current page
	getMousePositionRelativeToDocument: function(event) {
		var x = 0, y = 0;
		if (event.pageX) {
			// pageX gets coordinates of pointer from left of entire document
			x = event.pageX;
			y = event.pageY;
		} else if (event.clientX) {
			// clientX gets coordinates from left of current viewable area
			// so we have to add the distance the page has scrolled onto this value
			x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		// Return an object literal containing the x and y mouse coordinates
		return {
			x: x,
			y: y
		};
},
	// The getMousePositionOffset method returns the distance of the mouse
	// pointer from the top left of the element the event occurred on
	getMousePositionOffset: function(event) {
		var x = 0, y = 0;
		if (event.layerX) {
			x = event.layerX;
			y = event.layerY;
		} else if (event.offsetX) {
			// Internet Explorer-proprietary
			x = event.offsetX;
			y = event.offsetY;
		}
		// Returns an object literal containing the x and y coordinates of the
		// mouse relative to the element the event fired on
		return {
			x: x,
			y: y
		};
},
	// The getRelatedTarget method returns the element node the event was set up to
	// fire on, which can be different from the element the event actually fired on
	getRelatedTarget: function(event) {
		var relatedTarget = event.relatedTarget;
		if (event.type == "mouseover") {
			// With mouseover events, relatedTarget is not set by default
			relatedTarget = event.fromElement;
		} else if (event.type == "mouseout") {
			// With mouseout events, relatedTarget is not set by default
			relatedTarget = event.toElement;
		}
		return relatedTarget;
}
};

$.CSS = {
	
	// The getArrayOfClassNames method is a utility method which returns an
	// array of all the CSS class names assigned to a particular element.
	// Multiple class names are separated by a space character
	getArrayOfClassNames: function(element) {
		var classNames = [];
		if (element.className) {
			// If the element has a CSS class specified, create an array
			classNames = element.className.split(" ");
		}
		return classNames;
},
		// The addClass method adds a new CSS class of a given name to a
		// particular element
	addClass: function(element, className) {
		// Get a list of the current CSS class names applied to the element
		var classNames = this.getArrayOfClassNames(element);
		// Add the new class name to the list
		classNames.push(className);
		// Convert the list in space-separated string and assign to the element
		element.className = classNames.join(" ");
},
	// The removeClass method removes a given CSS class name from
	// a given element
	removeClass: function(element, className) {
		var classNames = this.getArrayOfClassNames(element);
		// Create a new array for storing all the final CSS class names in
		var resultingClassNames = [];
		for (var index = 0; index < classNames.length; index++) {
			// Loop through every class name in the list
			if (className != classNames[index]) {
				// Add the class name to the new list if it isn"t the one specified
				resultingClassNames.push(classNames[index]);
			}
		}
		
		// Convert the new list into a space-separated string and assign it
		element.className = resultingClassNames.join(" ");
},
	// The hasClass method returns true if a given class name exists on a
	// specific element, false otherwise
	hasClass: function(element, className) {
		// Assume by default that the class name is not applied to the element
		var isClassNamePresent = false;
		var classNames = this.getArrayOfClassNames(element);
		for (var index = 0; index < classNames.length; index++) {
			// Loop through each CSS class name applied to this element
			if (className == classNames[index]) {
				// If the specific class name is found, set the return value to true
				isClassNamePresent = true;
			}
		}
		// Return true or false, depending on if the specified class name was found
		return isClassNamePresent;
},
	// The getPosition method returns the x and y coordinates of the top-left
	// position of a page element within the current page, along with the
	// current width and height of that element
	getPosition: function(element) {
		var x = 0, y = 0;
		var elementBackup = element;
		
			// The offsetLeft and offsetTop properties get the position of the
			// element with respect to its parent node. To get the position with
			// respect to the page itself, we need to go up the tree, adding the
			// offsets together each time until we reach the node at the top of
			// the document, by which point, we"ll have coordinates for the
			// position of the element in the page
			
				x += element.offsetLeft;
				y += element.offsetTop;
				// Deliberately using = to force the loop to execute on the next
				// parent node in the page hierarchy
			
		
		// Return an object literal with the x and y coordinates of the element,
		// along with the actual width and height of the element
		return {
			x: x,
			y: y,
			height: elementBackup.offsetHeight,
			width: elementBackup.offsetWidth
		};
},
	getObjectOfStyle: function(element) {
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
},
	setObjectOfStyle: function(element,objectStyle) {
		var listStyle=""
		,item
		;
		for(item in objectStyle)
		{
			listStyle = listStyle.concat(item+":"+objectStyle[item]+";");
		}
		element.setAttribute("style",listStyle);
},
	addStyle: function(element,List) {
	var objStyle = this.getObjectOfStyle(element),item;
	for(item in List)
	{
		objStyle[item] = List[item];
	}
	this.setObjectOfStyle(element,objStyle);
},
	removeStyle: function(element,List) {
	var objStyle = this.getObjectOfStyle(element),i,len;
	for(i=0,len=List.length;i<len;i++)
	{
		if(objStyle[List[i]])
		{
			delete objStyle[List[i]];
		}
	}
	this.setObjectOfStyle(element,objStyle);
}	
};
$.Utils = {
	// The toCamelCase method takes a hyphenated value and converts it into
	// a camel case equivalent, e.g., margin-left becomes marginLeft. Hyphens
	// are removed, and each word after the first begins with a capital letter
	toCamelCase: function(hyphenatedValue) {
		var result = hyphenatedValue.replace(/-\D/g, function(character) {
			return character.charAt(1).toUpperCase();
		});
		return result;
},
	// The toHyphens method performs the opposite conversion, taking a camel
	// case string and converting it into a hyphenated one.
	// e.g., marginLeft becomes margin-left 
	toHyphens: function(camelCaseValue) {
		var result;
		result = camelCaseValue.replace(/[A-Z]/g, function(character) {
			return ("-"+ character.charAt(0).toLowerCase());
		});
		return result;
}
};
$.Element = {
	cache: {}
	,set: function(element,List)
	{
		if(arguments.length == 1)
		{
			List = arguments[0];
			element = this.create(List.tag || List.Tag || "div");
		}
		var listAttr = List.Attr || List.attr || {}  
		, listEvent = List.event || List.Event || {} 
		;
		//example attr: {id: xxx,class: yyy}
		//example event: {add: click,fn: function1}
		
		//Add event <tag onclick="function1"></tag>
		if(listEvent.add)
		{
			$.Events.add(element,listEvent.add,listEvent.fn);
		}
		else if(listEvent.remove)
		{
			$.Events.remove(element,listEvent.remove,listEvent.fn);
		}
		//Add attribute <tag attr1="value"></tag>
		for(var key in listAttr)
		{
			element.setAttribute(key,listAttr[key]);
		}
		//Add innerHTML <tag>innerHTML</tag>
		if(List.html) element.innerHTML = List.html;
		
		return element;
	}
	,create: function(nameElement)
	{
		if(!this.cache[nameElement])
			this.cache[nameElement] = document.createElement(nameElement);
		return this.cache[nameElement].cloneNode(0);
		
	}
};
$.UI = {
	cache: {}
	,button: function(value) {
		var _value = value || "";
		if(!this.cache["button"+_value])
			this.cache["button"+_value] = $.Element.set({tag:"div",attr: {"class":"jerboa-button jerboa-ignore"}} ).appendChild( $.Element.set({tag:"span",attr: {"class":"jerboa-ignore"},html: _value}) ).parentNode;
		return  this.cache["button"+_value].cloneNode(1);
	}
	,textfield: function(name,value) {
		var _value = value || ""
		, _name = name || ""
		;
		if(!this.cache["textfield"+_name+_value])
			this.cache["textfield"+_name+_value] = $.Element.set({tag:"input",attr: {"id":_name,"name":_name,"class":"jerboa-ignore","type":"text","value": _value}} );
		return this.cache["textfield"+_name+_value].cloneNode(1);
	}

	,layerPanel: function(index) {
		var isFirst = index ? "" : "jerboa-lactive"
		,element = $.Element.set({tag: "li",attr: {"class":isFirst,"index":index},event: {add:"click",fn: Jerboa.ui["layer_panel"].selectLayer}});
		element.appendChild($.Element.set({tag:"span",event: {add:"click",fn: Jerboa.ui["layer_panel"].hideLayer }}));
		element.appendChild($.Element.set({tag: "p",event: {add:"click",fn: $.bind(Jerboa.ui["layer_panel"].editNameLayer,Jerboa,0) }}));
		
		return element;
	}
};
/*
	Bind function
	@author Nodtem66
	@param 
		callback 	- [Function] function to call
		scope	 	- [Object] value of "this" variable when call function
		useThrottle - [Number] delay to run function
	@return
		Anomymous function 
		
	How to use :
	1. Change scope of variables
	2. Setting Static arguments
	3. Limit speed to repeat the function :Prevent to Old Browser (such as IE) crash.
	
	Example :
	1.1 Change scope to "Jerboa" Object
		$.bind(function,Jerboa,false) 
	1.2 Change scope to "window" Object
		$.bind(function,window,false)
	1.3 use default scope
		$.bind(function,null,false)
	2. function foo(a,b,c) { alert(a+b-c); }
	2.1 bar = $.bind(foo,null,false,5)
		bar(6,1) => 10 (from 5+6-1)
	2.2 bar = $.bind(foo,null,false,5,8)
		bar(9) 	 =>	4  (from 5+8-9)
	3.1 Limit in 100 msec can run function in 1 time.
		$.bind(function,null,100)
	3.2 Limit in 1000 msec can run function in 1 time.
		$.bind(function,null,1000)
	3.3 No limit
		$.bind(function,null,0) OR $.bind(function,null,false)
*/
$.bind = function(callback,scope,useThrottle) {
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
};
$.getByClass = function(root,nameClass)
{
	var _element = [],i,len;
	if($.env.ie)
	{
		for(i=0,len=root.children.length;i<len;i++)
		{
			if(root.children[i].className == nameClass)
				_element.push(root.children[i]);
			
		}
	}
	else
		_element = root.getElementsByClassName(nameClass);
	return _element;
};/*}}}*/

Jerboa = function(_config)
{
	
	var _window = window
	,_document = document
	,lib = $
	;
	// Jerboa properties {{{	
	Jerboa = {
		verstion: "0.001"
		,$: lib
		,editElement: _config && _config.id || "edit"
		,currentPath: _config && _config.path || ""
		,currentPanel: null
		,currentLayer: 0
		,currentState: "" 
		,currentEditElement: null
		,history: []
		,ui: {}
		,cache: {
			indexLayer: 0
		} /// }}}
		,init: function() { /// {{{
			//Start Jerboa {{{1
			var _fragment = document.createDocumentFragment() //build a root of DOM tree
			,J = Jerboa	,i,len,cssLoaded=false,$ = J.$
			,addDocumentEvent = $.bind($.Events.add,null,0,document)
			,old_content = "",temp
			;//}}}
			// find path {{{1 
			for(i=0,len=document.scripts.length;i<len;i++){
				if(/jerboa\.js/.test(document.scripts[i].src)) {
					J.currentPath = document.scripts[i].src.replace("jerboa.js","");
					break;
				}
			}
			// }}}
			//init CSS {{{1
			for(i=0,len=document.styleSheets.length;i<len;i++) {
				if(/jerboa\.css/i.test(document.styleSheets[i].href)) {
				   cssLoaded=true;
				  break;
				}
			}
			if(!cssLoaded)
			{
				
				document.getElementsByTagName("head")[0].appendChild(
					$.Element.set({tag:"link",attr:{rel:"stylesheet",type:"text/css",href:J.currentPath+"jerboa.css"}})
				);
			
			}
         	// }}}
			//init UI {{{1
			J.ui["screen"] = document.getElementById(J.editElement);
			if(!J.ui["screen"]) {alert("Jerboa: NOT FOUND #"+J.editElement);return false;}

			$.CSS.addStyle(J.ui["screen"],{"padding":"0"});
			// }}}
			//Detect Save file {{{1
			if(J.ui["screen"].children[0] && J.ui["screen"].children[0].className == "jerboa-ignore")
			{
				J.ui["screen"].element = J.ui["screen"].children[0];
				old_content = J.ui["screen"].element.innerHTML;
			} else {
				J.ui["screen"].element = $.Element.set({tag: "div",attr: {"class":"jerboa-ignore","style":"position:relative;top:0;left:0;width:100%;height:auto;overflow:hidden;"}});
				old_content = J.ui["screen"].innerHTML;
				J.ui["screen"].innerHTML = "";
				J.ui["screen"].appendChild(J.ui["screen"].element);
			}// }}}
			//Normalization Dom Tree {{{1
			if(DEBUG_MODE)
			{console.log("Normalization DOM Tree");}
			J.normalizeTree(J.ui.layer[0]);
			//}}}
			//Build Layer panel {{{1
			J.ui["layer"] = [];
			if(J.ui["screen"].element.children[0] && $.CSS.hasClass(J.ui["screen"].element.children[0],"jerboa-layer"))
			{
				J.ui["layer"][0] = J.ui["screen"].element.children[0];
			} else {
				J.ui["layer"][0] = $.Element.set({tag:"div",attr: {"index":0,"class":"jerboa-layer jerboa-ignore","style":"z-index:2000;"},html: old_content});
				J.ui["screen"].element.appendChild(J.ui["layer"][0]);
			}
			
			J.ui["main"] = $.Element.set({tag: "div",attr: {id: "jerboa"}});
			J.ui["main_menu"] = $.Element.set({tag: "div",attr: {id: "jerboa-wrapper"}});
			J.ui["main"].appendChild(J.ui["main_menu"]);
			// }}}
			//Build menu bar {{{1
			//TODO: add function for add plugin menu
			J.ui["menu"] = {}; J.cache.menu_number = 0;
			J.ui["menu"].main = $.Element.set({tag:"div",attr: {id:"jerboa-menu","class":"jerboa-panel jerboa-ignore"}});
			J.ui["main_menu"].appendChild(J.ui["menu"]["main"]);
			// }}}
			//init temp Function {{{1
			//J.cache.tempFn8 = $.bind(J.text.save,J,0);
			//J.cache.tempFn9 = $.bind(J.text.edit,J,0);
			//J.cache.tempFn10 = $.bind(J.text.move,J,0);

			
			/*

			J.ui["layer_panel"] = {
				layout: $.Element.set({tag:"div",attr: {"class":"jerboa-window jerboa-hide",style:"top:30px;left:0px;"},html: "<p>Layout Panel</p>",event: {add: "mousedown",fn: (J.cache.tempFn5 = $.bind(J.event.drag,J,0,"init","layer_panel")) }})
				,element: $.Element.set({tag:"div",html: "<ul></ul>",event:{remove: "mousedown",fn: Jerboa.cache.tempFn5}})
				,addLayer: function(nameLayer) {
					var _root = this.element.children[0]
					,index = J.cache.indexLayer
					,_element = _root.appendChild($.UI.layerPanel(index))
					,nameLayer = nameLayer || "Layer "+ index 
					,baseZIndex = 2000
					;
					J.cache.indexLayer++;
					$.Element.set(_element.children[1],{html: nameLayer});
					J.ui["layer"][index] = $.Element.set({tag:"div",attr: {"index":index,"class":"jerboa-layer jerboa-ignore","style":"z-index:"+parseInt(baseZIndex+index)+";"}});
					J.ui["screen"].element.appendChild(J.ui["layer"][index]);
				}
				,removeLayer: function() {
					
					var _root = this.element.children[0]
					,_element = null
					;
					_element = $.getByClass(_root,"jerboa-lactive")[0];
					
					if(_element)
					{
						var index = _element.getAttribute("index"),i,len
						;
						_root.removeChild(_element);
						//console.log(J.ui["layer"][index]);
						delete J.ui["layer"][index];
						
					}
					
				}
				
				,moveupLayer: function() {
					var _root = this.element.children[0]
					,_element = null
					;
					_element = $.getByClass(_root,"jerboa-lactive")[0];
					
					if(_element)
					{
						if(_element.previousSibling)
						{
							var backIndex = _element.previousSibling.getAttribute("index")
							,frontIndex = _element.getAttribute("index")
							,frontElement = J.ui["layer"][frontIndex]
							,backElement = J.ui["layer"][backIndex]
							,frontProp = $.CSS.getObjectOfStyle(frontElement)
							,backProp = $.CSS.getObjectOfStyle(backElement)
							,baseZINDEX = 2000
							;
							
							frontProp["z-index"] = parseInt(frontProp["z-index"])+parseInt(backProp["z-index"]);
							backProp["z-index"] = parseInt(frontProp["z-index"]) - parseInt(backProp["z-index"]);
							frontProp["z-index"] = parseInt(frontProp["z-index"]) - parseInt(backProp["z-index"]);
							
							$.CSS.setObjectOfStyle(frontElement,frontProp);
							$.CSS.setObjectOfStyle(backElement,backProp);
							_root.insertBefore(_element,_element.previousSibling);
							
						}
					}
				}
				,movedownLayer: function() {
					var _root = this.element.children[0]
					,_element = null
					;
					_element = $.getByClass(_root,"jerboa-lactive")[0];
					
					if(_element)
					{
						if(_element.nextSibling)
						{
							var backIndex = _element.getAttribute("index")
							,backElement = J.ui["layer"][backIndex]
							,backProp = $.CSS.getObjectOfStyle(backElement)
							,frontIndex
							,frontProp
							,frontElement
							,baseZINDEX = 2000
							;
							if(_element.nextSibling.nextSibling) 
								frontIndex = _element.nextSibling.getAttribute("index");
							else
								frontIndex = _root.lastChild.getAttribute("index");
								
							frontElement = J.ui["layer"][frontIndex];
							frontProp = $.CSS.getObjectOfStyle(frontElement);
							
							frontProp["z-index"] = parseInt(frontProp["z-index"])+parseInt(backProp["z-index"]);
							backProp["z-index"] = parseInt(frontProp["z-index"]) - parseInt(backProp["z-index"]);
							frontProp["z-index"] = parseInt(frontProp["z-index"]) - parseInt(backProp["z-index"]);
							
							$.CSS.setObjectOfStyle(frontElement,frontProp);
							$.CSS.setObjectOfStyle(backElement,backProp);
						
							_root.insertBefore(_element,_element.nextSibling.nextSibling);
							
						}
					}
				}
				,selectLayer: function(e) {
					var event = $.Events.standardize(e)
					,_target = event.target
					;
					event.preventDefault();
					
					if(!$.CSS.hasClass(_target,"jerboa-lactive"))
					{
						var _element = $.getByClass(_target.parentNode,"jerboa-lactive");
						
						for(i=0,len = _element.length;i<len;i++)
						{
							$.CSS.removeClass(_element[i],"jerboa-lactive");
						}
						$.CSS.addClass(_target,"jerboa-lactive");
					}
					J.currentLayer = parseInt(_target.getAttribute("index"));
				}
				,editNameLayer: function(e) {
					var event = $.Events.standardize(e)
					,_target = event.target
					,oldName = _target.innerHTML
					;
					event.preventDefault();
					
					if(! this.cache.tempFn6) 
						this.cache.tempFn6 = $.bind(this.ui["layer_panel"].renameLayer,this,0,true);
					
					if(_target.tagName.toLowerCase() == "p")
					{
						if(this.cache.layer)
						{
							this.ui["layer_panel"].renameLayer.call(this,false);
						}
							
						this.cache.layer = _target;
						_target.innerHTML = "<input type="text" value=""+ oldName +"" />";
						$.Element.set(this.ui["layer_panel"].layout,{event: {remove: "mousedown",fn: this.cache.tempFn5}});
						$.Element.set(this.ui["layer_panel"].layout,{event: {add: "click",fn: this.cache.tempFn6}});
					}					
				}
				,renameLayer: function(removeEvents) {
					var element = this.cache.layer;
					element.innerHTML = element.children[0].value;
					delete this.cache.layer;
					if(removeEvents)
					{
						$.Element.set(this.ui["layer_panel"].layout,{event: {add: "mousedown",fn: this.cache.tempFn5}});
						$.Element.set(this.ui["layer_panel"].layout,{event: {remove: "click",fn: this.cache.tempFn6}})
					}
				}
				,hideLayer: function(e) {
					var event = $.Events.standardize(e)
					,_target = event.target.parentNode
					;
					event.preventDefault();
					if(!$.CSS.hasClass(_target,"jerboa-lhide"))
						$.CSS.addClass(_target,"jerboa-lhide");
					else	
						$.CSS.removeClass(_target,"jerboa-lhide");
					
					//console.log("hide");
				}
				
			};
			J.ui["layer_panel"].layout.appendChild($.Element.set({tag:"p",event: {add:"click",fn: $.bind(J.event.hide,J,0,"layer_panel") }}));
			J.ui["layer_panel"].layout.appendChild($.Element.create("span"));
			J.ui["layer_panel"].layout.appendChild($.Element.set({tag:"span",event: {add:"click",fn: $.bind(J.ui["layer_panel"].addLayer,J.ui["layer_panel"],0,null) }}));
			J.ui["layer_panel"].layout.appendChild($.Element.set({tag:"span",event: {add:"click",fn: $.bind(J.ui["layer_panel"].removeLayer,J.ui["layer_panel"],0) }}));
			J.ui["layer_panel"].layout.appendChild($.Element.set({tag:"span",event: {add:"click",fn: $.bind(J.ui["layer_panel"].moveupLayer,J.ui["layer_panel"],0) }}));
			J.ui["layer_panel"].layout.appendChild($.Element.set({tag:"span",event: {add:"click",fn: $.bind(J.ui["layer_panel"].movedownLayer,J.ui["layer_panel"],0) }}));
			J.ui["layer_panel"].layout.appendChild(J.ui["layer_panel"].element);
			J.ui["layer_panel"].layout.appendChild($.Element.set({tag: "p",event: {add:"mousedown",fn: $.bind(J.event.resize,J,0,"init","layer_panel","se") }}));	
			J.ui["main"].appendChild(J.ui["layer_panel"].layout);
			J.ui["layer_panel"].addLayer();
			}}} */
			//light screen {{{1
			J.ui["light_screen_top"] = $.Element.set({tag:"div",attr: {"class":"jerboa-lightbox jerboa-ignore",style: ""}});
			J.ui["light_screen_left"] = $.Element.set({tag:"div",attr: {"class":"jerboa-lightbox jerboa-ignore",style: ""}});
			J.ui["light_screen_right"] = $.Element.set({tag:"div",attr: {"class":"jerboa-lightbox jerboa-ignore",style: ""}});
			J.ui["light_screen_bottom"] = $.Element.set({tag:"div",attr: {"class":"jerboa-lightbox jerboa-ignore",style: ""}});
			J.ui["main"].appendChild(J.ui["light_screen_top"]);
			J.ui["main"].appendChild(J.ui["light_screen_left"]);
			J.ui["main"].appendChild(J.ui["light_screen_right"]);
			J.ui["main"].appendChild(J.ui["light_screen_bottom"]);
			// }}}
			//Build main menu bar {{{1
			J.addMenu("page");
			J.addMenu("insert");
			J.addPanel("text");
			//J.ui["menu"][0].appendChild( $.Element.set({tag:"div",html:"Layer",event: {add:"click",fn: $.bind(J.showUI,J,0,J.ui["layer_panel"].layout) }}) );
			temp = $.Element.set({tag: "div"});
			temp.appendChild($.Element.set({tag:"div",html:"save",attr:{"class":"jerboa-ignore"},event: {add: "click",fn: J.end}}));
			temp.appendChild($.Element.set({tag:"div",html:"save&quit",attr:{"class":"jerboa-ignore"},event: {add: "click",fn: J.end}}));
			temp.appendChild($.Element.set({tag:"div",html:"cancle",attr:{"class":"jerboa-ignore"},event: {add: "click",fn: J.end}}));
			J.ui["menu"]["main"].appendChild(temp);
			delete temp;
			//}}}
			//Build insert menu {{{1
			J.ui["menu"]["insert"].appendChild( $.Element.set({tag:"div",html: "Text",attr: {"class":"jerboa-ignore"},event: {add:"click",fn: $.bind(J.insert.text,J,0)}}) );
			J.ui["menu"]["insert"].appendChild( $.Element.set({tag:"div",html: "Image",attr:{"class":"jerboa-ignore"}}) );
			// }}}
			//Build text menu {{{1
			var _temp_element = $.Element.set({tag:"div"});
			_temp_element.appendChild($.Element.set({tag:"button",html:"<span></span>",event:{add:"click",fn:$.bind(J.text.format,null,0,"outdent")}}));
			_temp_element.appendChild($.Element.set({tag:"button",html:"<span></span>",event:{add:"click",fn:$.bind(J.text.format,null,0,"indent")}}));
			_temp_element.appendChild($.Element.set({tag:"button",html:"<span></span>",event:{add:"click",fn:$.bind(J.text.format,null,0,"insertunorderedlist")}}));
			_temp_element.appendChild($.Element.set({tag:"button",html:"<span></span>",event:{add:"click",fn:$.bind(J.text.format,null,0,"insertorderedlist")}}));
			J.ui["menu"]["text"].appendChild(_temp_element);
			_temp_element = $.Element.set({tag:"div"});
			_temp_element.appendChild($.Element.set({tag:"button",html:"<span></span>",event:{add:"click",fn:$.bind(J.text.format,null,0,"forecolor")}}));
			_temp_element.appendChild($.Element.set({tag:"button",html:"<span></span>",event:{add:"click",fn:$.bind(J.text.format,null,0,"backcolor")}}));
			_temp_element.appendChild($.Element.set({tag:"button",html:"<b>B</b>",event:{add:"click",fn:$.bind(J.text.format,null,0,"bold")}}));
			_temp_element.appendChild($.Element.set({tag:"button",html:"<i>I</i>",event:{add:"click",fn:$.bind(J.text.format,null,0,"italic")}}));
			_temp_element.appendChild($.Element.set({tag:"button",html:"<u>U</u>",event:{add:"click",fn:$.bind(J.text.format,null,0,"underline")}}));
			_temp_element.appendChild($.Element.set({tag:"button",html:"<span></span>",event:{add:"click",fn:$.bind(J.text.format,null,0,"justifyleft")}}));
			_temp_element.appendChild($.Element.set({tag:"button",html:"<span></span>",event:{add:"click",fn:$.bind(J.text.format,null,0,"justifycenter")}}));
			_temp_element.appendChild($.Element.set({tag:"button",html:"<span></span>",event:{add:"click",fn:$.bind(J.text.format,null,0,"justifyright")}}));
			_temp_element.appendChild($.Element.set({tag:"button",html:"<span></span>",event:{add:"click",fn:$.bind(J.text.format,null,0,"justifyfull")}}));
			J.ui["menu"]["text"].appendChild(_temp_element);
			delete _temp_element;
			delete J.cache.menu_number;
			// }}}
			_fragment.appendChild(J.ui["main"]); //insert all ui to root of DOM tree
			document.body.appendChild(_fragment); //insert a root of DOM tree to document.body

			//Add Global event {{{1
			addDocumentEvent("click",J.click);
			addDocumentEvent("dblclick",J.dbclick);//}}}
			//Detect Page Height {{{1
			temp = J.ui["screen"].offsetHeight;
			if(DEBUG_MODE) console.log("Detect Height: ",temp);			
			J.setPageHeight((temp>0)? temp : 100);
			// }}}			
			J.refreshScreen.call(J);
		} /// }}}
		,addPanel: function(_name_panel) {/*{{{*/
			_name_panel = _name_panel.toLowerCase();
			this.ui.menu[_name_panel] = this.$.Element.set({tag:"div",attr: {id:"jerboa-"+_name_panel,"class":"jerboa-panel jerboa-ignore jerboa-hide"}});
			this.ui.menu[_name_panel].mid = this.cache.menu_number++;
			this.ui["main_menu"].appendChild(this.ui.menu[_name_panel]);
			return this.ui.menu[_name_panel];
		}		/*}}}*/
		,addMenu: function(_name_panel) {/*{{{*/
			_name_panel = _name_panel.toLowerCase();
			this.addPanel(_name_panel);
			var Capitalize = _name_panel.substr(0,1).toUpperCase().concat(_name_panel.substr(1));
			this.ui["menu"]["main"].appendChild( this.$.Element.set({tag:"div",html: Capitalize,attr: {"class":"jerboa-ignore"},event: {add:"click",fn: this.$.bind(this.show.menu,this,0,_name_panel) }}) );
			return this.ui.menu[_name_panel];
		}/*}}}*/
		,insert: {/*{{{*/
			text: function()
			{
				var $ = this.$
				,_layer = this.ui["layer"][this.currentLayer]
				,_element = _layer.appendChild($.Element.set({tag:"div",html:"<p>Insert Text Here</p>"}))
				;
				this.show.menu.call(this,this.ui["menu"][0]);
			}
		}/*}}}*/
		,text: {/*{{{*/
		   format: function(command)
			{
			   
			   var haveArgCommand = {"forecolor":true,"backcolor":true}
			   ,  cssCommand = {"justifyleft":true,"justifycenter":true,"justifyright":true,"justifyfull":true}
			   ,  clearColorCommand = {"clear":true,"transparent":true,"remove":true,"clearcolor":true,"removecolor":true}
			   ,  args = null
			   ;
			   if(cssCommand[command] == true)
			   {
			      if(!document.execCommand(command,false,args))
			         Jerboa.$.CSS.addStyle(Jerboa.currentEditElement,{"text-align":command.replace(/justify/ig,"")});
			      return false;
			   }
			   if(haveArgCommand[command] == true)
			   {
			      args = prompt("Insert RGB color","000000");
			      if(clearColorCommand[args] == true || (args.length != 3 && args.length != 6))
			      {
			         args = "transparent";
			      }
			      else if(Jerboa.$.env.firefox || Jerboa.$.env.webkit)
			         args = "#"+args;
			   }   
			   document.execCommand(command,false,args);
            
			}
		}/*}}}*/
		,refreshScreen: function()/*{{{*/
		{
				var $ = this.$
				,propElement = $.CSS.getPosition(this.ui["screen"])
				,propDoc = {width: Math.max(document.body.offsetWidth,document.documentElement.offsetWidth),height: Math.max(document.body.offsetHeight,document.documentElement.offsetHeight)}
				;
				
				$.CSS.addStyle(this.ui["light_screen_left"],{top:"0px",left:"0px",width:propElement.x+"px",height:propDoc.height+"px"});
				$.CSS.addStyle(this.ui["light_screen_top"],{top:"0px",left:propElement.x+"px",width:propElement.width+"px",height:propElement.y+"px"});
				$.CSS.addStyle(this.ui["light_screen_right"],{top:"0px",left:parseInt(propElement.x+propElement.width)+"px",width:parseInt(propDoc.width - propElement.x - propElement.width)+"px",height:propDoc.height+"px"});
				$.CSS.addStyle(this.ui["light_screen_bottom"],{top:parseInt(propElement.y+propElement.height)+"px",left:propElement.x+"px",width:propElement.width+"px",height:parseInt(propDoc.height - propElement.y - propElement.height)+"px"});
		}/*}}}*/
		,setPageHeight: function(_height)/*{{{*/
		{
			var $=this.$
			;
			$.CSS.addStyle(this.ui["screen"].element,{"height":_height+"px"});
			this.refreshScreen.call(this);
		}/*}}}*/
		,setParagraph: function()/*{{{*/
		{
		   var $ = this.$
		   ,_root = this.ui["setting_box"]["paragraph"].children[0].children[0]
		   ,_word_spacing = _root.children[1].children[3].children[0].value
		   ,_letter_spacing = _root.children[3].children[3].children[0].value
		   ;
         
         $.CSS.addStyle(this.currentEditElement,{"word-spacing":_word_spacing+"px","letter-spacing":_letter_spacing+"px"});
         $.CSS.addClass(this.ui["setting_box"],"jerboa-hide");
			$.CSS.addClass(this.ui["setting_box"]["paragraph"],"jerboa-hide");
			$.CSS.addClass(this.ui["dark_screen"],"jerboa-hide");
			

  		}/*}}}*/
		,show: {/*{{{*/
		   menu: function(_panel)
		   {
			   if(DEBUG_MODE) console.log("show.menu: args=",arguments);
			   if(this.currentPanel){ 
				   this.$.CSS.addClass(this.ui["menu"][this.currentPanel],"jerboa-hide");
				   this.$.CSS.removeClass(this.ui["menu"]["main"].children(this.ui["menu"][this.currentPanel].mid),"jerboa-panel-active");
			   }
			   if(this.currentPanel == _panel){
				   this.currentPanel = null;
				   return true;
			   }
			   this.$.CSS.removeClass(this.ui["menu"][_panel],"jerboa-hide");
			   this.$.CSS.addClass(this.ui["menu"]["main"].children(this.ui["menu"][_panel].mid),"jerboa-panel-active");
			   this.currentPanel = _panel;	   
		   }
		   ,setting_box: function(element)
		   {
		      if(element.length)
			   {
				   for(var i=0,len=element.length;i<len;i++)
				   {
					   this.$.CSS.removeClass(element[i],"jerboa-hide");
				   }
			   }
			   else 
				   this.$.CSS.removeClass(element,"jerboa-hide");
		      
		   }
		}/*}}}*/
		,hide: function(element) {/*{{{*/
				if(element.length)
			   {
				   for(var i=0,len=element.length;i<len;i++)
				   {
					   this.$.CSS.addClass(element[i],"jerboa-hide");
				   }
			   }
			   else 
				   this.$.CSS.addClass(element,"jerboa-hide");
		}/*}}}*/
		,touch: function(e) {/*{{{*/
   	   //Controller of resize and drag element
	      var $ = Jerboa.$
	      ,data = Jerboa.cache
	      ,event = $.Events.standardize(e)
	      ,sizeBorder = 1 //px
	      ;
	      if(Jerboa.currentState != "textedit") event.preventDefault();
	      if(e.type == "mousedown")
	      {
	         data.x = event.pageX;
            data.y = event.pageY;
            $.Events.add(document,"mousemove",Jerboa.touch);
            $.Events.add(document,"mouseup",Jerboa.touch);
  
        } else if(e.type == "mousemove")
        {
            if(e.shiftKey)
            {
               data.root_w += event.pageX - data.x;
               data.root_h += event.pageY - data.y;
            } else if(/move$/i.test(Jerboa.currentState)) {
               data.root_left += event.pageX - data.x;
               data.root_top += event.pageY - data.y;
            }
            if(data.root_top + data.root_h + 2*sizeBorder > data.screen_h) data[e.shiftKey? "root_h":"root_top"] -= event.pageY - data.y;
            else if(data.root_top < 0) data.root_top -= event.pageY - data.y;
            if(data.root_left + data.root_w + 2*sizeBorder > data.screen_w) data[e.shiftKey? "root_w":"root_left"] -= event.pageX - data.x;
            else if(data.root_left < 0) data.root_left -= event.pageX - data.x;
            
            if(e.shiftKey)
               $.CSS.addStyle(Jerboa.currentEditElement,{width:data.root_w+"px",height: data.root_h+"px"});
            else if(/move$/i.test(Jerboa.currentState))
               $.CSS.addStyle(Jerboa.currentEditElement,{top:data.root_top+"px",left: data.root_left+"px"});
            data.x = event.pageX;
            data.y = event.pageY;
	            
        } else if(e.type == "mouseup")
	     {
	         delete data.x;
	         delete data.y;
	         $.Events.remove(document,"mousemove",Jerboa.touch);
	         $.Events.remove(document,"mouseup",Jerboa.touch);
	     }
		   
		}/*}}}*/
		,click: function(e) {/*{{{*/
			var $ = Jerboa.$
				,event = $.Events.standardize(e)
				,data = Jerboa.cache
				;
			if(Jerboa.currentState == "textedit"){
				if($.CSS.hasClass(event.target,"jerboa-ignore"))
					Jerboa.restoreNormalState();
				return false;
			}
			event.preventDefault();
			if(!$.CSS.hasClass(event.target,"jerboa-ignore"))
			{
				//TODO: Detect another kind of media
				switch(Jerboa.detectMedia(event.target))
				{
					case "text":
						var _root = event.target;
					while(!$.CSS.hasClass(_root.parentNode,"jerboa-ignore"))
					{
						_root = _root.parentNode;
					}
					if(Jerboa.currentEditElement == _root && Jerboa.currentState == "textmove") return false;
					if(Jerboa.currentEditElement != null) Jerboa.restoreNormalState();
					//console.log(_root);
					Jerboa.currentEditElement = _root;
					$.CSS.addClass(_root,"jerboa-touch");
					$.Events.add(_root,"mousedown",Jerboa.touch);
					Jerboa.currentState = "textmove";

					data.screen_top = Jerboa.ui["screen"].offsetTop;
					data.screen_left = Jerboa.ui["screen"].offsetLeft;
					data.screen_w = Jerboa.ui["screen"].offsetWidth ;
					data.screen_h = Jerboa.ui["screen"].offsetHeight ;
					data.root_top = _root.offsetTop;
					data.root_left = _root.offsetLeft;
					data.root_w = _root.offsetWidth;
					data.root_h = _root.offsetHeight;
					return false;
					break;
					case "image":
						break;
					default: break;
				}
			}
			Jerboa.restoreNormalState();
		}/*}}}*/
		,dbclick: function(e) {/*{{{*/
		   var $ = Jerboa.$
	      ,event = $.Events.standardize(e)
	      ,data = Jerboa.cache;
	      event.preventDefault();

         if(!$.CSS.hasClass(event.target,"jerboa-ignore"))
         {
            switch(Jerboa.detectMedia(event.target))
            {
            case "text":
               //Find the Root to start edit mode
               var _root = event.target;
               while(!$.CSS.hasClass(_root.parentNode,"jerboa-ignore"))
               {
                  _root = _root.parentNode;
               }
               if(Jerboa.currentEditElement == _root && Jerboa.currentState == "textedit") return false;
               if(Jerboa.currentEditElement != null) Jerboa.restoreNormalState();
               Jerboa.currentEditElement = _root;
               $.CSS.addClass(_root,"jerboa-touch");
               $.Events.add(_root,"mousedown",Jerboa.touch);
               //$.Events.add(_root,"blur",Jerboa.restoreNormalState);

               Jerboa.show.menu.call(Jerboa,Jerboa.ui["menu"][2]);
               _root.setAttribute("contenteditable","true");
               _root.focus();
               Jerboa.currentState = "textedit";
               
               return false;
               break;
            case "image":
               break;
               
            default: break;
            }
         }
         
		
		}/*}}}*/
		,detectMedia: function(element)/*{{{*/
		{
		   //TODO: Detect another kind of media
		   if(element.tagName.toLowerCase() == "img")
		   {
		      return "image";
		   } else
		   {
		      return "text";
		   
		   }
		}/*}}}*/
		,restoreNormalState: function(e)/*{{{*/
		{
		   switch(Jerboa.currentState)
		   {
		   case "textmove":
		      $.CSS.removeClass(Jerboa.currentEditElement,"jerboa-touch");
            $.Events.remove(Jerboa.currentEditElement,"mousedown",Jerboa.touch);
            Jerboa.currentEditElement = null;
            Jerboa.currentState = "";
            break;
         case "textedit":            
            $.CSS.removeClass(Jerboa.currentEditElement,"jerboa-touch");
            Jerboa.currentEditElement.setAttribute("contenteditable","false");
            $.Events.remove(Jerboa.currentEditElement,"mousedown",Jerboa.touch);
            //$.Events.remove(Jerboa.currentEditElement,"blur",Jerboa.restoreNormalState);
            Jerboa.show.menu.call(Jerboa,Jerboa.ui["menu"][0]);
            Jerboa.currentEditElement = null;
            Jerboa.currentState = "";
            break;
		   default: break;
		   }
		}/*}}}*/
		,send: function(objSetting)/*{{{*/
		{
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

		}/*}}}*/
		,save: function(){}
		,end: function(){/*{{{*/
			Jerboa.save.call(Jerboa);

		   //end of program
		   document.body.removeChild(Jerboa.ui["main"]);
		   for(i=0,len=document.styleSheets.length;i<len;i++) {
			   if(/jerboa\.css/i.test(document.styleSheets[i].href)) {
				   document.getElementsByTagName("head")[0].removeChild(document.styleSheets[i].ownerNode);
				   break;
			   }
		   }

		   Jerboa.restoreNormalState();
		   Jerboa.$.Events.remove(document,"click",Jerboa.click);
		   Jerboa.$.Events.remove(document,"dblclick",Jerboa.dbclick);
		}/*}}}*/
		,setId: function(id) {//{{{1
			if(id) this.editElement = id;
		}//}}}
		,normalizeTree: function(_root){ // {{{1
			
		}//}}}
	};
	if(document.body)
		Jerboa.init();
	else
	{
		if(DEBUG_MODE) console.log("Loaded with $.onDomReady");
		lib.onDomReady(Jerboa.init);
	}
	return Jerboa;
};

})();

