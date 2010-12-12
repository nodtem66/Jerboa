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
		if(arguments.length < 2)
			throw new Error("hasImplement Error: Please use hasImplement(Object, Interface1 [, Interface2, ...])");
		for(var i=1,arglen=arguments.length,j,intflen;i<arglen;i++){
			var _interface = arguments[i];
			for(j=0,inflen=_interface.methods.length;j<inflen;j++){
				var _method = _interface.methods[j];
				if(!_object[_method] || (typeof _object[_method]) !== "function"){
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
		var node,childs = {};
		node = lib.setNode({attr:{id: "jerboa-"+panelName.toLowerCase(),"class":"jerboa-panel jerboa-ignore hide"}});
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
				lib.removeClass(node,"hide");
		}
	};//}}}
	var MenuBar = function(){//{{{2
		Panel.call(this,"menu");
		lib.setNode(this.getElement(),{attr:{"class":"jerboa-panel jerboa-ignore"}});
	};
	extend(MenuBar,Panel);
	//}}}
	var Menu = function(nameMenu){//{{{2 
		var capitalizedName = nameMenu.substr(0,1).toUpperCase().concat(nameMenu.substr(1))
		,node = lib.setNode({attr:{"class":"jerboa-ignore"},html: capitalizedName})
		,item = lib.setNode({});

		this.onClick = function(e){
			var event = lib.getEvent(e);
			event.preventDefault();
			this.toggleMenu();
		}
		this.toggleMenu = function(){
			if(lib.hasClass(node,"jerboa-panel-active")) lib.removeClass(node,"jerboa-panel-active");
			else lib.addClass(node,"jerboa-panel-active");
		}
		this.name = nameMenu.toLowerCase();
		this.add = "";
		this.remove = "";
		this.getChild = function(childId){if(childId >= 0)return node.children[childId];return node.children;}
		this.getElement = function(){return node;}
		this.showItem = function() {if(lib.hasClass(item,"hide")) lib.removeClass(item,"hide");}
		this.hideItem = function() {if(!lib.hasClass(item,"hide")) lib.addClass(item,"hide");}
		this.show = function() {if(lib.hasClass(node,"hide")) lib.removeClass(node,"hide");}
		this.hide = function() {if(!lib.hasClass(node,"hide")) lib.addClass(node,"hide");}
		lib.addEvent(node,"click",lib.curry(this.onClick,this));
	}//}}}
	var Stage = function(elementStage,ui){ //{{{2
		var stage = elementStage,layer=[],node,screen={},old_content;
		// Detect Save file
		if(stage.children[0] && stage.children[0].className == "jerboa-ignore")
		{
			node = stage.children[0];
			old_content = node.innerHTML;
		} else {
			node = lib.setNode({tag: "div",attr: {"class":"jerboa-ignore","style":"position:relative;top:0;left:0;width:100%;height:auto;overflow:hidden;"}});
			old_content = stage.innerHTML;
			stage.innerHTML = "";
			stage.appendChild(node);
		}

		//construct Layer
		if(node.children[0] && lib.hasClass(node.children[0],"jerboa-layer"))
		{
			layer.push(node.children[0]);
		} else {
			layer.push(lib.setNode({attr: {"index":0,"class":"jerboa-ignore","style":"z-index:2000;"},html: old_content}));
			node.appendChild(layer[0]);
		}
		//construct Lightscreen
		screen.top = lib.setNode({attr: {"class":"jerboa-lightbox jerboa-ignore",style: ""}});
		screen.left = lib.setNode({attr: {"class":"jerboa-lightbox jerboa-ignore",style: ""}});
		screen.right = lib.setNode({attr: {"class":"jerboa-lightbox jerboa-ignore",style: ""}});
		screen.bottom = lib.setNode({attr: {"class":"jerboa-lightbox jerboa-ignore",style: ""}});
		ui.core.appendChild(screen.top);
		ui.core.appendChild(screen.right);
		ui.core.appendChild(screen.left);
		ui.core.appendChild(screen.bottom);
		
		//Public method
		this.getElement = function(){return node;}
		this.refreshStage = function(){
			var propElement = {x:stage.offsetLeft,y:stage.offsetTop,width:stage.offsetWidth,height:stage.offsetHeight}
				,propDoc = {width: Math.max(document.body.offsetWidth,document.documentElement.offsetWidth),height: Math.max(document.body.offsetHeight,document.documentElement.offsetHeight)}
			;
			lib.addStyle(screen.top,{top:"0px",left:"0px",width:propElement.x+"px",height:propDoc.height+"px"});
			lib.addStyle(screen.left,{top:"0px",left:propElement.x+"px",width:propElement.width+"px",height:propElement.y+"px"});
			lib.addStyle(screen.right,{top:"0px",left:parseInt(propElement.x+propElement.width)+"px",width:parseInt(propDoc.width - propElement.x - propElement.width)+"px",height:propDoc.height+"px"});
			lib.addStyle(screen.bottom,{top:parseInt(propElement.y+propElement.height)+"px",left:propElement.x+"px",width:propElement.width+"px",height:parseInt(propDoc.height - propElement.y - propElement.height)+"px"});
		}
		this.setHeight = function(height){
			lib.addStyle(node,{"height":height+"px"});
			this.refreshStage();
		}
		this.autoHeight = function(){
			var height = 0,i;
			for(i=0,len=layer[0].children.length;i<len;i++){
				height += layer[0].children[i].offsetHeight;
			}
			console.log("Page height: "+height);
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
								while(tempNode.children.length == 1 && !lib.hasClass(tempNode.parentNode,"jerboa-ignore")){
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
								while(tempNode.children.length == 1 && !lib.hasClass(tempNode.parentNode,"jerboa-ignore")){
									tempNode = tempNode.parentNode;
								}
								tempNode.setAttribute("role","media");
								tempNode.appendChild(lib.setNode({tag:"div",attr:{"class":"jerboa-media-touch"},html:"\&\#160\;"}));
								tempNode.appendChild(currentNode.children[i].cloneNode(true));
								tempNode.removeChild(tempNode.firstChild);
								if(tempNode.children[1].tagName.toLowerCase() == "object"){
									tempNode.children[1].insertBefore(lib.setNode({tag:"param",attr:{"name":"wmode","value":"opaque"}}),tempNode.children[1].children[0]);
									tempNode.children[1].lastChild.setAttribute("wmode","opaque");
								}
								continue;
							}
							else {
								//move this element to root Element
								tempNode = currentNode.children[i].cloneNode(true);
								tempNode = lib.setNode({tag:"div",attr:{"role":"media","style":"position:absolute;"},html: "<div class=\"jerboa-media-touch\">\&\#160\;</div>"}).appendChild(tempNode).parentNode;
								if(tempNode.children[1].tagName.toLowerCase() == "object"){
									tempNode.children[1].insertBefore(lib.setNode({tag:"param",attr:{"name":"wmode","value":"opaque"}}),tempNode.children[1].children[0]);
									tempNode.children[1].lastChild.setAttribute("wmode","opaque");
								}
								newTree.appendChild(tempNode);
								currentNode.removeChild(currentNode.children[i]);
								delete tempNode;
							}
							break;

						case "text":
							if(currentNode.children[i].innerHTML=="" && currentNode.children[i].tagName.toLowerCase() != "div"){
								currentNode.removeChild(currentNode.children[i]);
								i--;len--;
								continue;
							}
							if(flagFloor1 && currentNode.children[i].tagName.toLowerCase() != "div"){
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
		this.autoHeight();
		this.normalizeTree(layer[0]);
	} //}}}
	var Button = function(name) {
		var node = lib.setNode({attr: {"class":"jerboa-button jerboa-ignore"},html: name,event: {add: "click",fn: function(){sandbox.notify("button-"+name+"-click")}}});
		this.getElement = function(){
			return node;
		}
		
	}
	var FlipSwitch = function(label){

	}
	var TextField = function(label){

	}
	var TextArea = function(label){

	}
	//}}}
	//{{{ Private members
	var Library= new Interface("Library",["onDomReady","addEvent","removeEvent","getEvent","addClass","removeClass","hasClass","addStyle","removeStyle","setNode","curry","request"])
	,Module= new Interface("Module",["init","destroy"])
	; 
	hasImplements(my.lib,Library);
	var lib = my.lib;delete my.lib;
	var path = my.path;delete my.path;
	var ui = {
		menubar: new MenuBar()
	};
	var modules = {};
	var stage = null;
	var sandbox = {
		addPanel: function(namePanel){
			var panelObject = new Panel(namePanel);
			ui.wrapper.appendChild(panelObject.getElement());
			return panelObject;
		}
		,addMenu: function(nameMenu){
			var menuObject = new Menu(nameMenu);
			ui.menubar.add(menuObject);
			return menuObject;
		}
		,notify: function(eventName,eventData){
			console.log(eventName,eventData);
		}
	};

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
	};//}}}
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
		var _stage;
		if(!(_stage = document.getElementById(domId))) return false;
		if(stage){
			destroy();
		}
		stage = _stage;
		init();
	};//}}}
	var init = function(){//{{{
		var documentFragment = document.createDocumentFragment(),tempNode;
		//construct UI
		ui.core = lib.setNode({attr:{id: "jerboa"}});
		ui.wrapper = lib.setNode({attr: {id: "jerboa-wrapper"}});
		ui.core.appendChild(ui.wrapper);

		//construct MenuBar
		ui.wrapper.appendChild(ui.menubar.getElement());
		sandbox.addMenu("Page");
		
		//constrcut Stage
		stage = new Stage(stage,ui);		

		//construct save, save&close, close button
		tempNode = ui.menubar.getElement().appendChild(lib.setNode());
		tempNode.appendChild(new Button("save").getElement());
		tempNode.appendChild(new Button("save&close").getElement());
		tempNode.appendChild(new Button("close").getElement());
		documentFragment.appendChild(ui.core);
		document.body.appendChild(documentFragment);
	};//}}}
	var destroy = function(){//{{{
		stage = null;
	};//}}}
	return my;
}(Jerboa || {}));
Jerboa.apply("test_edit");
