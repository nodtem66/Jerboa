/*
* Jerboa Tool Kit
* @author Jirawat Iamsam-ang
* @version 1.00
*/
(function(){
/*
* Javascript Library
* @author Den Odell
* @from Pro JavaScript RIA Techniques Best Practices, Performance, and Presentation
*/
DEBUG_MODE = 1;
$ = {};
//var $ = {};

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
			setTimeout(arguments.callee.caller,50);
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
		//Set Button Class in <div></div>
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
	,layerPanel: function() {
		var element = $.Element.set({tag: 'li',event: {add:'click',fn: Jerboa.ui['layer_panel'].selectLayer }});
		element.appendChild($.Element.set({tag:'span',event: {add:'click',fn: Jerboa.ui['layer_panel'].hideLayer }}));
		element.appendChild($.Element.create('p'));
		
		return element;
	}
};
$.bind = function(callback,scope,useThrottle) {
	var scope = scope || window
	,args = Array.prototype.slice.call(arguments,3)
	;
	if(useThrottle)
	{
		return function() {
			clearTimeout(callback.tId);
			callback.tId = setTimeout(function(){
				callback.apply(scope,args.concat(Array.prototype.slice.call(arguments,0)))
			},useThrottle);
		}
	}
	else	
		return function () {
			callback.apply(scope,args.concat(Array.prototype.slice.call(arguments,0)))
		};
};


Jerboa = function(element)
{
	
	var _window = window
	,_document = document
	,lib = $
	;
	Jerboa = {
		verstion: "0.001"
		,env: {
			ie: /MSIE/i.test(navigator.userAgent),
			ie6: /MSIE 6/i.test(navigator.userAgent),
			ie7: /MSIE 7/i.test(navigator.userAgent),
			ie8: /MSIE 8/i.test(navigator.userAgent),
			firefox: /Firefox/i.test(navigator.userAgent),
			opera: /Opera/i.test(navigator.userAgent),
			webkit: /Webkit/i.test(navigator.userAgent),
			camino: /Camino/i.test(navigator.userAgent)
		  }
		,$: lib
		,editElement: element || ""
		,pathCss: "../../jerboa.css"
		,currentPanel: ""
		,currentToolbox: []
		,showJerboa: true 
		,history: []
		,ui: {}
		,cache: {}
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
				layout: $.Element.set({tag:'div',attr: {'class':'jerboa-window',style:'top:30px;left:0px;'},html: '<p>Layout Panel</p>'})
				,element: $.Element.set({tag:'div',html: '<ul></ul>'})
				,addLayer: function() {
					var _root = this.element.children[0]
					,_element = _root.appendChild($.UI.layerPanel())
					;
					//console.log('add'); 
				}
				,removeLayer: function() {
					//console.log('remove');
					var _root = this.element.children[0]
					,_element = null
					;
					if(J.env.ie)
					{
						for(i=0,len=_root.children.length;i<len;i++)
						{
							if(_root.children[i].className == 'jerboa-lactive')
								_element = _root.children[i];				
						}
					}
					else
						_element = _root.getElementsByClassName('jerboa-lactive')[0];
					
					if(_element) _root.removeChild(_element);
				}
				,selectLayer: function(e) {
					var event = $.Events.standardize(e)
					,_target = event.target
					;
					event.preventDefault();
					;
					if(!$.CSS.hasClass(_target,'jerboa-lactive'))
					{
						var _element;
						if(J.env.ie)
							_element = _target.parentNode.children;
						else 
							_element = _target.parentNode.getElementsByClassName('jerboa-lactive');
						for(i=0,len = _element.length;i<len;i++)
						{
							$.CSS.removeClass(_element[i],'jerboa-lactive');
						}
						$.CSS.addClass(_target,'jerboa-lactive');
					}
					
				}
				,renameLayer: function() {
				
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
			};
			J.ui['layer_panel'].layout.appendChild($.Element.set({tag:'p',event: {add:'click',fn: $.bind(J.event.hide,J,false,'layer_panel') }}));
			J.ui['layer_panel'].layout.appendChild($.Element.create('span'));
			J.ui['layer_panel'].layout.appendChild($.Element.set({tag:'span',event: {add:'click',fn: $.bind(J.ui['layer_panel'].addLayer,J.ui['layer_panel']) }}));
			J.ui['layer_panel'].layout.appendChild($.Element.set({tag:'span',event: {add:'click',fn: $.bind(J.ui['layer_panel'].removeLayer,J.ui['layer_panel']) }}));
			J.ui['layer_panel'].layout.appendChild(J.ui['layer_panel'].element);
			J.ui['layer_panel'].layout.appendChild($.Element.set({tag: 'p',event: {add:'mousedown',fn: $.bind(J.event.resize,J,false,'init','layer_panel') }}));	
			J.ui['main'].appendChild(J.ui['layer_panel'].layout);
			J.ui['layer_panel'].addLayer();
			
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
					this.cache.tempFn1 = $.bind(this.event.resize,this,false,'run',nameUI); 
					this.cache.tempFn2 = $.bind(this.event.resize,this,false,'finish',nameUI);
					
					$.Events.add(_document,'mousemove',this.cache.tempFn1);
					$.Events.add(_document,'mouseup',this.cache.tempFn2);
					this.cache.resizeX = event.pageX;				
					this.cache.resizeY = event.pageY;				
				}
				else if(type=='run')
				{
					var diffX = event.pageX - this.cache.resizeX
					,diffY = event.pageY - this.cache.resizeY
					,element = this.ui[nameUI].element || this.ui[nameUI]
					,propElement = this.$.CSS.getPosition(element)
					; 
					//console.log('resize run');
					//console.log(diffX+" "+diffY);
					this.$.CSS.addStyle(element,{width:parseInt(propElement.width+diffX)+"px",height:parseInt(propElement.height+diffY)+"px"});
					this.cache.resizeX = event.pageX;
					this.cache.resizeY = event.pageY;
				}
				else if(type=='finish')
				{
					//console.log('resize finish');
					$.Events.remove(_document,'mousemove',this.cache.tempFn1);
					$.Events.remove(_document,'mouseup',this.cache.tempFn2);
					delete this.cache.tempFn1;
					delete this.cache.tempFn2;
					delete this.cache.resizeX;
					delete this.cache.resizeY;
				}
			}
			
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
