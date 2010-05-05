/*
* Jerboa Tool Kit
* @author Jirawat Iamsam-ang
* @version 1.00
*/
(function(){
/*
* Javascript Library (Additional Edition)
* @original author Den Odell
* @from Pro JavaScript RIA Techniques Best Practices, Performance, and Presentation
*/
DEBUG_MODE = 1;
$ = {};
//var $ = {};
$.env = {
			ie: /MSIE/i.test(navigator.userAgent),
			ie6: /MSIE 6/i.test(navigator.userAgent),
			ie7: /MSIE 7/i.test(navigator.userAgent),
			ie8: /MSIE 8/i.test(navigator.userAgent),
			firefox: /Firefox/i.test(navigator.userAgent),
			opera: /Opera/i.test(navigator.userAgent),
			webkit: /Webkit/i.test(navigator.userAgent),
			camino: /Camino/i.test(navigator.userAgent)
		}

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
}
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
	
	// Let's stop events from firing on element nodes above the current
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
		// we're acting upon from occurring. If we were listening for click
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
		}
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
		}
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
			classNames = element.className.split(' ');
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
		element.className = classNames.join(' ');
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
				// Add the class name to the new list if it isn't the one specified
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
		if (element.offsetParent) {
			// The offsetLeft and offsetTop properties get the position of the
			// element with respect to its parent node. To get the position with
			// respect to the page itself, we need to go up the tree, adding the
			// offsets together each time until we reach the node at the top of
			// the document, by which point, we'll have coordinates for the
			// position of the element in the page
			do {
				x += element.offsetLeft;
				y += element.offsetTop;
				// Deliberately using = to force the loop to execute on the next
				// parent node in the page hierarchy
			} while (element = element.offsetParent)
		}
		
		// Return an object literal with the x and y coordinates of the element,
		// along with the actual width and height of the element
		return {
			x: x,
			y: y,
			height: elementBackup.offsetHeight,
			width: elementBackup.offsetWidth
		}
},
	getObjectOfStyle: function(element) {
		var listStyle = element.getAttribute('style'),i,len,objectStyle={}
		,cssValue;
		if(listStyle)
		{
			listStyle = listStyle.split(';');
			// example ['top:45px','left:67px',...]
			for(i=0,len=listStyle.length;i<len;i++) 
			{
				//each item = 'top:45px'
				if(listStyle[i])
				{
					cssValue = listStyle[i].split(':');
					//Trim 
					cssValue[0] = cssValue[0].replace(/^[\s]+/g,'');
					cssValue[1] = cssValue[1].replace(/^[\s]+/g,'');
					cssValue[0] = cssValue[0].replace(/[\s]+$/g,'');
					cssValue[1] = cssValue[1].replace(/[\s]+$/g,'');
					
					objectStyle[cssValue[0]] = cssValue[1];
				}
			}	
			
		}
		return objectStyle
},
	setObjectOfStyle: function(element,objectStyle) {
		var listStyle="",item;
		for(item in objectStyle)
		{
			listStyle = listStyle.concat(item+':'+objectStyle[item]+';');
		}
		element.setAttribute('style',listStyle);
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
			delete objStyle[List[i]];
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
		var result = camelCaseValue.replace(/[A-Z]/g, function(character) {
			return ('-'+ character.charAt(0).toLowerCase());
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
		var listAttr = List.Attr || List.attr || {} //example attr: {id: xxx,class: yyy}
		, listEvent = List.event || List.Event || {} // example event: {add: click,fn: function1}
		;
		
		//Add event <tag onclick="function1"></tag>
		if(listEvent.add)
			$.Events.add(element,listEvent.add,listEvent.fn);
		else if(listEvent.remove)
			$.Events.remove(element,listEvent.remove,listEvent.fn);
		
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
			this.cache["button"+_value] = $.Element.set({tag:'div',attr: {'class':'jerboa-button'}} ).appendChild( $.Element.set({tag:'span',html: _value}) ).parentNode;;
		return  this.cache["button"+_value].cloneNode(1);
	}
	,textfield: function(name,value) {
		var _value = value || ""
		, _name = name || ""
		;
		if(!this.cache["textfield"+_name+_value])
			this.cache["textfield"+_name+_value] = $.Element.set({tag:'input',attr: {'name':_name,'type':'text','value': _value}} );
		return this.cache["textfield"+_name+_value].cloneNode(1);
	}
	,combobox: function() {
		//TODO add combobox
	}
	,layerPanel: function(index) {
		var isFirst = index ? '' : 'jerboa-lactive'
		,element = $.Element.set({tag: 'li',attr: {'class':isFirst,'index':index},event: {add:'click',fn: Jerboa.ui['layer_panel'].selectLayer}});
		element.appendChild($.Element.set({tag:'span',event: {add:'click',fn: Jerboa.ui['layer_panel'].hideLayer }}));
		element.appendChild($.Element.set({tag: 'p',event: {add:'click',fn: $.bind(Jerboa.ui['layer_panel'].editNameLayer,Jerboa,0) }}));
		
		return element;
	}
};
/*
	Bind function
	@author Nodtem66
	@param 
		callback 	- [Function] function to call
		scope	 	- [Object] value of 'this' variable when call function
		useThrottle - [Number] delay to run function
	@return
		Anomymous function 
		
	How to use :
	1. Change scope of variables
	2. Setting Static arguments
	3. Limit speed to repeat the function :Prevent to Old Browser (such as IE) crash.
	
	Example :
	1.1 Change scope to 'Jerboa' Object
		$.bind(function,Jerboa,false) 
	1.2 Change scope to 'window' Object
		$.bind(function,window,false)
	1.3 use default scope
		$.bind(function,null,false)
	2. function foo(a,b,c) { alert(a+b-c); }
	2.1 bar = $.bind(foo,null,false,5)
		bar(6,1) => 10 (from 5+6-1)
	2.2 bar = $.bind(foo,null,5,8)
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
				callback.apply(scope,argsStatic.concat(Array.prototype.slice.call(argsDynamic,0)))
			},useThrottle);
		}
	}
	else	
		return function () {
			callback.apply(scope,argsStatic.concat(Array.prototype.slice.call(arguments,0)))
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
}

Jerboa = function(element)
{
	
	var _window = window
	,_document = document
	,lib = $
	;
	
	Jerboa = {
		verstion: "0.001"
		,$: lib
		,editElement: element || "edit"
		,pathCss: "../../jerboa.css"
		,currentPanel: ""
		,currentToolbox: []
		,showJerboa: true 
		,history: []
		,ui: {}
		,cache: {
			indexLayer: 0
		}
		,init: function() {
			//Start Jerboa
			var _fragment = document.createDocumentFragment() //build a root of DOM tree
			,J = Jerboa	,i,len,cssLoad=false,$ = J.$
			;
			
			//debug mode
			_document.getElementById("test_edit").innerHTML = "";
			
			//init CSS
			for(i=0,len=document.styleSheets.length;i<len;i++) {
				if(/jerboa\.css/i.test(document.styleSheets[i].href)) {
				   cssLoaded=true;
				  break;
				}
			}
			if(!cssLoad)
			{
				
				document.getElementsByTagName("head")[0].appendChild(
					$.Element.set({tag:'link',attr:{rel:'stylesheet',type:'text/css',href:J.pathCss}})
				);
			
			}
			//init UI
			J.ui['screen'] = _document.getElementById(J.editElement);
			J.ui['screen'].element = $.Element.set({tag: 'div',attr: {'class':'jerboa-ignore','style':'position:relative;top:0;left:0;width:100%;height:100%;background:red;'},html: 'test'});
			J.ui['screen'].appendChild(J.ui['screen'].element);
			
			J.ui['main'] = $.Element.set({tag: 'div',attr: {id: 'jerboa'}});
			J.ui['main_menu'] = $.Element.set({tag: 'div',attr: {id: 'jerboa-wrapper'}});
			J.ui['main'].appendChild(J.ui['main_menu']);
			//Build menu bar
			J.ui['menu'] = [];
			J.ui['menu'].push( $.Element.set({tag:'div',attr: {id:'jerboa-menu'}}) );
			J.ui['menu'].push( $.Element.set({tag:'div',attr: {id:'jerboa-insert','class':'jerboa-panel jerboa-hide'}}) );
			
			for(i=0,len=J.ui['menu'].length;i<len;i++)
				J.ui['main_menu'].appendChild(J.ui['menu'][i]);
			
			//Build main menu bar
			J.ui['menu'][0].appendChild( $.Element.set({tag:'div',html: 'Insert'}) );
			//Build insert menu
			J.ui['menu'][1].appendChild( $.Element.set({tag:'span',attr: {'class': 'jerboa-backbutton'},html: '&lt;'}) );
			J.ui['menu'][1].appendChild( $.Element.set({tag:'div',html: "<span></span><p>Text</p>"}) );
			
			//Build Layer panel
			J.ui['layer_panel'] = {
				layout: $.Element.set({tag:'div',attr: {'class':'jerboa-window',style:'top:30px;left:0px;'},html: '<p>Layout Panel</p>',event: {add: 'mousedown',fn: (J.cache.tempFn5 = $.bind(J.event.drag,J,0,'init','layer_panel')) }})
				,element: $.Element.set({tag:'div',html: '<ul></ul>',event:{remove: 'mousedown',fn: Jerboa.cache.tempFn5}})
				,addLayer: function(nameLayer) {
					var _root = this.element.children[0]
					,index = J.cache.indexLayer
					,_element = _root.appendChild($.UI.layerPanel(index))
					,nameLayer = nameLayer || "Layer "+ index 
					,baseZIndex = 2000
					;
					J.cache.indexLayer++;
					$.Element.set(_element.children[1],{html: nameLayer});
					J.ui['screen'].element.appendChild($.Element.set({tag:'div',attr: {'index':index,'class':'jerboa-ignore','style':'position:absolute;top:0;left:0;width:100%;height:100%;background:yellow;opacity:0.3;z-index:'+parseInt(baseZIndex+index)+';'}}));
				}
				,removeLayer: function() {
					
					var _root = this.element.children[0]
					,_element = null
					;
					_element = $.getByClass(_root,'jerboa-lactive')[0];
					
					if(_element)
					{
						var index = _element.getAttribute('index'),i,len
						,item=J.ui['screen'].element.children
						;
						_root.removeChild(_element);
						for(i=0,len=item.length;i<len;i++)
						{
							if(item[i].getAttribute('index') == index)
							{
								J.ui['screen'].element.removeChild(item[i]);
								break;
							}
						}
						
					}
					
				}
				,moveupLayer: function() {
					var _root = this.element.children[0]
					,_element = null
					;
					_element = $.getByClass(_root,'jerboa-lactive')[0];
					
					if(_element)
					{
						if(_element.previousSibling)
						{
							var backIndex = _element.previousSibling.getAttribute('index')
							,frontIndex = _element.getAttribute('index')
							,frontProp,backProp,frontElement,backElement
							,i,len,task,baseZINDEX = 2000
							,item = J.ui['screen'].element
							;
							for(i=0,task=2,len=item.children.length;i<len && task > 0;i++)
							{
								if(item.children[i].getAttribute('index') == frontIndex)
								{
									frontElement = item.children[i];
									frontProp = $.CSS.getObjectOfStyle(frontElement);
									task--;
								}
								else if(item.children[i].getAttribute('index') == backIndex)
								{
									backElement = item.children[i];
									backProp = $.CSS.getObjectOfStyle(backElement);
									task--;
								}
							}
							frontProp['z-index'] = parseInt(frontProp['z-index'])+parseInt(backProp['z-index']);
							backProp['z-index'] = parseInt(frontProp['z-index']) - parseInt(backProp['z-index']);
							frontProp['z-index'] = parseInt(frontProp['z-index']) - parseInt(backProp['z-index']);
							
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
					_element = $.getByClass(_root,'jerboa-lactive')[0];
					
					if(_element)
					{
						if(_element.nextSibling)
						{
							var backIndex = _element.getAttribute('index')
							,frontIndex,frontProp,backProp,frontElement,backElement
							,i,len,task,baseZINDEX = 2000
							,item = J.ui['screen'].element
							;
							if(_element.nextSibling.nextSibling) 
								frontIndex = _element.nextSibling.getAttribute('index');
							else
								frontIndex = _root.lastChild.getAttribute('index');
								
							for(i=0,task=2,len=item.children.length;i<len && task > 0;i++)
							{
								if(item.children[i].getAttribute('index') == frontIndex)
								{
									frontElement = item.children[i];
									frontProp = $.CSS.getObjectOfStyle(frontElement);
									task--;
								}
								else if(item.children[i].getAttribute('index') == backIndex)
								{
									backElement = item.children[i];
									backProp = $.CSS.getObjectOfStyle(backElement);
									task--;
								}
							}
							frontProp['z-index'] = parseInt(frontProp['z-index'])+parseInt(backProp['z-index']);
							backProp['z-index'] = parseInt(frontProp['z-index']) - parseInt(backProp['z-index']);
							frontProp['z-index'] = parseInt(frontProp['z-index']) - parseInt(backProp['z-index']);
							
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
					;
					if(!$.CSS.hasClass(_target,'jerboa-lactive'))
					{
						var _element = $.getByClass(_target.parentNode,'jerboa-lactive');
						
						for(i=0,len = _element.length;i<len;i++)
						{
							$.CSS.removeClass(_element[i],'jerboa-lactive');
						}
						$.CSS.addClass(_target,'jerboa-lactive');
					}
					
				}
				,editNameLayer: function(e) {
					var event = $.Events.standardize(e)
					,_target = event.target
					,oldName = _target.innerHTML
					;
					event.preventDefault();
					
					if(! this.cache.tempFn6) 
						this.cache.tempFn6 = $.bind(this.ui['layer_panel'].renameLayer,this,0,true);
					
					if(_target.tagName.toLowerCase() == 'p')
					{
						if(this.cache.layer)
						{
							this.ui['layer_panel'].renameLayer.call(this,false);
						}
							
						this.cache.layer = _target;
						_target.innerHTML = '<input type="text" value="'+ oldName +'" />';
						$.Element.set(this.ui['layer_panel'].layout,{event: {remove: 'mousedown',fn: this.cache.tempFn5}});
						$.Element.set(this.ui['layer_panel'].layout,{event: {add: 'click',fn: this.cache.tempFn6}});
					}					
				}
				,renameLayer: function(removeEvents) {
					var element = this.cache.layer;
					element.innerHTML = element.children[0].value;
					delete this.cache.layer;
					if(removeEvents)
					{
						$.Element.set(this.ui['layer_panel'].layout,{event: {add: 'mousedown',fn: this.cache.tempFn5}});
						$.Element.set(this.ui['layer_panel'].layout,{event: {remove: 'click',fn: this.cache.tempFn6}})
					}
				}
				,hideLayer: function(e) {
					var event = $.Events.standardize(e)
					,_target = event.target.parentNode
					;
					event.preventDefault();
					if(!$.CSS.hasClass(_target,'jerboa-lhide'))
						$.CSS.addClass(_target,'jerboa-lhide');
					else	
						$.CSS.removeClass(_target,'jerboa-lhide');
					
					//console.log('hide');
				}
				,serialize: function() {
					var _element = this.element.children[0].children,i
					,len = _element.length,text = ""
					;
					for(i=0;i<len;i++)
					{
						text += _element[i].getAttribute('index');
						if(i!=len-1) text += "|";
					}
					return text;
				}
			};
			J.ui['layer_panel'].layout.appendChild($.Element.set({tag:'p',event: {add:'click',fn: $.bind(J.event.hide,J,0,'layer_panel') }}));
			J.ui['layer_panel'].layout.appendChild($.Element.create('span'));
			J.ui['layer_panel'].layout.appendChild($.Element.set({tag:'span',event: {add:'click',fn: $.bind(J.ui['layer_panel'].addLayer,J.ui['layer_panel'],0,null) }}));
			J.ui['layer_panel'].layout.appendChild($.Element.set({tag:'span',event: {add:'click',fn: $.bind(J.ui['layer_panel'].removeLayer,J.ui['layer_panel'],0) }}));
			J.ui['layer_panel'].layout.appendChild($.Element.set({tag:'span',event: {add:'click',fn: $.bind(J.ui['layer_panel'].moveupLayer,J.ui['layer_panel'],0) }}));
			J.ui['layer_panel'].layout.appendChild($.Element.set({tag:'span',event: {add:'click',fn: $.bind(J.ui['layer_panel'].movedownLayer,J.ui['layer_panel'],0) }}));
			J.ui['layer_panel'].layout.appendChild(J.ui['layer_panel'].element);
			J.ui['layer_panel'].layout.appendChild($.Element.set({tag: 'p',event: {add:'mousedown',fn: $.bind(J.event.resize,J,0,'init','layer_panel') }}));	
			J.ui['main'].appendChild(J.ui['layer_panel'].layout);
			J.ui['layer_panel'].addLayer();
			//light screen
			J.ui['light_screen_top'] = $.Element.set({tag:'div',attr: {'class':'jerboa-lightbox',style: ''}});
			J.ui['light_screen_left'] = $.Element.set({tag:'div',attr: {'class':'jerboa-lightbox',style: ''}});
			J.ui['light_screen_right'] = $.Element.set({tag:'div',attr: {'class':'jerboa-lightbox',style: ''}});
			J.ui['light_screen_bottom'] = $.Element.set({tag:'div',attr: {'class':'jerboa-lightbox',style: ''}});
			J.ui['main'].appendChild(J.ui['light_screen_top']);
			J.ui['main'].appendChild(J.ui['light_screen_left']);
			J.ui['main'].appendChild(J.ui['light_screen_right']);
			J.ui['main'].appendChild(J.ui['light_screen_bottom']);
			J.refreshScreen.call(J);
			//resize box
			J.ui['resize_box'] = $.Element.set({tag:'div',attr:{id:'jerboa-resize','class':'jerboa-hide',style: ''},html: '<div></div>'});
			J.ui['resize_box'].appendChild( $.Element.set({tag:'span',attr: {style: 'top:0;left:0;cursor:nw-resize;'}}) );
			J.ui['resize_box'].appendChild( $.Element.set({tag:'span',attr: {style: 'top:0;left:48%;cursor:n-resize;'}}) );
			J.ui['resize_box'].appendChild( $.Element.set({tag:'span',attr: {style: 'top:0;left:100%;cursor:ne-resize;'}}) );
			J.ui['resize_box'].appendChild( $.Element.set({tag:'span',attr: {style: 'top:48%;left:0;cursor:w-resize;'}}) );
			J.ui['resize_box'].appendChild( $.Element.set({tag:'span',attr: {style: 'top:48%;left:100%;cursor:e-resize;'}}) );
			J.ui['resize_box'].appendChild( $.Element.set({tag:'span',attr: {style: 'top:100%;left:0;cursor:sw-resize;'}}) );
			J.ui['resize_box'].appendChild( $.Element.set({tag:'span',attr: {style: 'top:100%;left:48%;cursor:s-resize;'}}) );
			J.ui['resize_box'].appendChild( $.Element.set({tag:'span',attr: {style: 'top:100%;left:100%;cursor:se-resize;'}}) );
			J.ui['main'].appendChild(J.ui['resize_box']);
			
			//J.showResizer.call(J,1,$.CSS.getPosition(J.ui['screen']));
			
			_fragment.appendChild(J.ui['main']); //insert all ui to root of DOM tree
			document.body.appendChild(_fragment); //insert a root of DOM tree to document.body
		}
		,event: {
			hide: function(nameUI) {
				var _element = this.ui[nameUI].layout || this.ui[nameUI];
				;
				this.$.CSS.addClass(_element,'jerboa-hide');
				
			}
			,resize: function(type,nameUI,e) {
				var $ = this.$
				,event = $.Events.standardize(e)
				;
				event.preventDefault();
				//alert(event[a]);
				if(type== 'init')
				{
					
					//console.log('resize init');
					this.cache.tempFn1 = $.bind(this.event.resize,this,0,'run',nameUI); 
					this.cache.tempFn2 = $.bind(this.event.resize,this,0,'end',nameUI);
					
					$.Events.add(_document,'mousemove',this.cache.tempFn1);
					$.Events.add(_document,'mouseup',this.cache.tempFn2);
					this.cache.x = event.pageX;				
					this.cache.y = event.pageY;				
					this.cache.element = this.ui[nameUI].element || this.ui[nameUI].layout ||this.ui[nameUI];
					this.cache.w = this.cache.element.offsetWidth;
					this.cache.h = this.cache.element.offsetHeight;
				}
				else if(type=='run')
				{
					this.cache.w += event.pageX - this.cache.x;
					this.cache.h += event.pageY - this.cache.y;
					//console.log('resize run');
					//console.log(diffX+" "+diffY);
					$.CSS.addStyle(this.cache.element,{width:this.cache.w+"px",height:this.cache.h+"px"});
					this.cache.x = event.pageX;
					this.cache.y = event.pageY;
				}
				else if(type=='end')
				{
					//console.log('resize finish');
					$.Events.remove(_document,'mousemove',this.cache.tempFn1);
					$.Events.remove(_document,'mouseup',this.cache.tempFn2);
					delete this.cache.tempFn1;
					delete this.cache.tempFn2;
					delete this.cache.x;
					delete this.cache.y;
					delete this.cache.element;
					delete this.cache.w;
					delete this.cache.h;
				}
			}
			,drag: function(type,nameUI,e)
			{
				var $ = this.$
				,event = $.Events.standardize(e)
				;
				event.preventDefault();
				
				if(type == 'init')
				{
					this.cache.tempFn3 = $.bind(this.event.drag,this,0,'run',nameUI);
					this.cache.tempFn4 = $.bind(this.event.drag,this,0,'end',nameUI);
					$.Events.add(_document,'mousemove',this.cache.tempFn3);
					$.Events.add(_document,'mouseup',this.cache.tempFn4);
					this.cache.element = this.ui[nameUI].layout || this.ui[nameUI];
					this.cache.x = event.pageX;
					this.cache.y = event.pageY;
					this.cache.top = parseInt(this.cache.element.style.top);
					this.cache.left = parseInt(this.cache.element.style.left);
					
					
				}
				else if(type == 'run')
				{
					
					this.cache.top += event.pageY - this.cache.y;
					this.cache.left += event.pageX - this.cache.x;
					
					//console.log(parseInt(event.pageX-this.cache.x)+","+parseInt(event.pageY-this.cache.y));
					//console.log("("+this.cache.top+","+this.cache.left+")");
					$.CSS.addStyle(this.cache.element,{top:this.cache.top+"px",left:this.cache.left+"px"});
					this.cache.x = event.pageX;
					this.cache.y = event.pageY;
				}
				else if(type == 'end')
				{
					$.Events.remove(_document,'mousemove',this.cache.tempFn3);
					$.Events.remove(_document,'mouseup',this.cache.tempFn4);
					delete this.cache.tempFn3;
					delete this.cache.tempFn4;
					delete this.cache.top;
					delete this.cache.left;
					delete this.cache.x;
					delete this.cache.y;
					delete this.cache.element;
				}
			}
		}
		,refreshScreen: function()
		{
				var $ = this.$
				,propElement = $.CSS.getPosition(this.ui['screen'])
				,propDoc = $.CSS.getPosition(_document.body)
				;
				
				$.CSS.addStyle(this.ui['light_screen_left'],{top:'0px',left:'0px',width:propElement.x+'px',height:propDoc.height+'px'});
				$.CSS.addStyle(this.ui['light_screen_top'],{top:'0px',left:propElement.x+'px',width:propElement.width+'px',height:propElement.y+'px'});
				$.CSS.addStyle(this.ui['light_screen_right'],{top:'0px',left:parseInt(propElement.x+propElement.width)+'px',width:parseInt(propDoc.width - propElement.x - propElement.width)+'px',height:propDoc.height+'px'});
				$.CSS.addStyle(this.ui['light_screen_bottom'],{top:parseInt(propElement.y+propElement.height)+'px',left:propElement.x+'px',width:propElement.width+'px',height:parseInt(propDoc.height - propElement.y - propElement.height)+'px'});
		}
		,showResizer: function(visibility,List)
		{
			var $=this.$
			;
			if(visibility)
			{
				$.CSS.addStyle(this.ui['resize_box'],{top:parseInt(List.y-3)+'px',left:parseInt(List.x-3)+'px',width:List.width+'px',height:List.height+'px'});
				$.CSS.removeClass(this.ui['resize_box'],'jerboa-hide');
			} 
			else $.CSS.addClass(this.ui['resize_box'],'jerboa-hide');
		}
	};
	if(DEBUG_MODE)
	{
		Jerboa.$.onDomReady(Jerboa.init);
		
	} 
	else 
	{
	if(_window.$)
		{
			//if document include Jquery
			Jerboa.init();
		} else {
			Jerboa.$.onDomReady(Jerboa.init);
		}
	}
	return Jerboa;
};

})();
//console.log(Jerboa);
