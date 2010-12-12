/*
 * Jerboa Tool Kit
 * @author Jirawat Iamsam-ang
 * @version 1.00
 */
var Jerboa = (function(_this){
 var _DEBUG_MODE = 1;
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
addDocumentEvent("dblclick",J.dbclick);
addDocumentEvent("keydown",J.keyboard);
//}}}
//Detect Page Height {{{1
temp = J.ui["screen"].offsetHeight;
if(DEBUG_MODE) console.log("Detect Height: ",temp);
J.setPageHeight((temp>100)? temp : 100);
// }}}			
//Normalization Dom Tree {{{1
if(DEBUG_MODE){
	console.log("Normalization DOM Tree");
	//J.ui["layer"][0].innerHTML = "";
}
J.normalizeTree(J.ui.layer[0]);
/*for(var i=0,len=J.ui.layer[0].children.length;i<len;i++){
	temp = J.ui.layer[0].children[i].cloneNode(true);
	$.CSS.addStyle(J.ui.layer[0].children[i],{"position":"absolute"});
	console.log(temp.offsetTop);
	}*/
//}}}

J.refreshScreen.call(J);
} /// }}}
,addPanel: function(_name_panel) {/*{{{*/
	_name_panel = _name_panel.toLowerCase();
	this.ui.menu[_name_panel] = this.$.Element.set({tag:"div",attr: {id:"jerboa-"+_name_panel,"class":"jerboa-panel jerboa-ignore jerboa-hide"}});
	this.ui["main_menu"].appendChild(this.ui.menu[_name_panel]);
	return this.ui.menu[_name_panel];
}		/*}}}*/
,addMenu: function(_name_panel) {/*{{{*/
	_name_panel = _name_panel.toLowerCase();
	this.addPanel(_name_panel);
	this.ui.menu[_name_panel].pid = this.cache.menu_number++;
	var Capitalize = _name_panel.substr(0,1).toUpperCase().concat(_name_panel.substr(1));
	this.ui["menu"]["main"].appendChild( this.$.Element.set({tag:"div",html: Capitalize,attr: {"class":"jerboa-ignore"},event: {add:"click",fn: this.$.bind(this.toggle.menu,this,0,_name_panel) }}) );
	return this.ui.menu[_name_panel];
}/*}}}*/
	,insert: {/*{{{*/
text: function()
			{
				var $ = this.$
					,_layer = this.ui["layer"][this.currentLayer]
					,_element = _layer.appendChild($.Element.set({tag:"div",html:"<p>Insert Text Here</p>"}))
					;
				this.toggle.menu.call(this,this.ui["menu"][0]);
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
	,toggle: {/*{{{*/
menu: function(_panel)
			{
				if(DEBUG_MODE) console.log("toggle.menu: args=",arguments);
				if(this.currentPanel){ 
					this.$.CSS.addClass(this.ui["menu"][this.currentPanel],"jerboa-hide");
					if(this.ui["menu"][this.currentPanel].mid)
						this.$.CSS.removeClass(this.ui["menu"]["main"].children(this.ui["menu"][this.currentPanel].mid),"jerboa-panel-active");
				}
				if(this.currentPanel == _panel){
					this.currentPanel = null;
					return true;
				}
				this.$.CSS.removeClass(this.ui["menu"][_panel],"jerboa-hide");
				if(this.ui["menu"][_panel].mid)
					this.$.CSS.addClass(this.ui["menu"]["main"].children(this.ui["menu"][_panel].mid),"jerboa-panel-active");
				this.currentPanel = _panel;	   
			}
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
		if(data.root_top + data.root_h + 2*sizeBorder > data.screen_h){
			if(e.shiftKey) data.root_h = data.screen_h - data.root_top -(2*sizeBorder);
			else data.root_top -= event.pageY - data.y;
		} else if(data.root_top < 0) data.root_top -= event.pageY - data.y;
		if(data.root_left + data.root_w + 2*sizeBorder > data.screen_w){
			if(e.shiftKey) data.root_w = data.screen_w - data.root_left - (2*sizeBorder); 
			else data.root_left -= event.pageX - data.x;             
		} else if(data.root_left < 0) data.root_left -= event.pageX - data.x;

		if(e.shiftKey){
			$.CSS.addStyle(Jerboa.currentEditElement,{width:data.root_w+"px",height: data.root_h+"px"});
			if(/^image/i.test(Jerboa.currentState))$.CSS.addStyle(Jerboa.currentEditElement.children[0],{width:data.root_w+"px",height: data.root_h+"px"});
			else if(Jerboa.currentEditElement.children.length == 2) {
				$.CSS.addStyle(Jerboa.currentEditElement.children[1],{width:data.root_w+"px",height: data.root_h+"px"});
				$.CSS.addStyle(Jerboa.currentEditElement.children[1].getElementsByTagName("embed")[0],{width:data.root_w+"px",height: data.root_h+"px"});					
			}
		}else if(/move$/i.test(Jerboa.currentState))
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
		,mediaType=""
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
		mediaType = Jerboa.detectMedia(event.target);
		var _root = event.target;
		while(!$.CSS.hasClass(_root.parentNode,"jerboa-ignore")){_root = _root.parentNode;}
		if(Jerboa.currentEditElement == _root && /move$/i.test(Jerboa.currentState)) return false;
		if(Jerboa.currentEditElement != null) Jerboa.restoreNormalState();
		//console.log(_root);
		Jerboa.currentEditElement = _root;
		$.CSS.addClass(_root,"jerboa-touch");
		$.Events.add(_root,"mousedown",Jerboa.touch);
		Jerboa.currentState = mediaType + "move";

		data.screen_top = Jerboa.ui["screen"].offsetTop;
		data.screen_left = Jerboa.ui["screen"].offsetLeft;
		data.screen_w = Jerboa.ui["screen"].offsetWidth ;
		data.screen_h = Jerboa.ui["screen"].offsetHeight ;
		data.root_top = _root.offsetTop;
		data.root_left = _root.offsetLeft;
		data.root_w = _root.offsetWidth;
		data.root_h = _root.offsetHeight;
		return false;
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

			Jerboa.toggle.menu.call(Jerboa,"text");
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
,keyboard: function(e) {//{{{
	console.log(e);
	document.forms[0].s.value = "";
	document.forms[0].s.focus();
	return true;
}//}}}
,detectMedia: function(element)/*{{{*/
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
}/*}}}*/
,restoreNormalState: function()/*{{{*/
{
	if(!Jerboa.currentState) return false;
	$.CSS.removeClass(Jerboa.currentEditElement,"jerboa-touch");
	$.Events.remove(Jerboa.currentEditElement,"mousedown",Jerboa.touch);
	switch(Jerboa.currentState)
	{
		case "textmove":
			break;
		case "textedit":            
			Jerboa.currentEditElement.setAttribute("contenteditable","false");
		Jerboa.toggle.menu.call(Jerboa,"text");
		break;
		case "imagemove":
			break;
		case "imageedit":
			break;
		default: break;
	}
	Jerboa.currentEditElement = null;
	Jerboa.currentState = "";			
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
	if(!_root) return '';
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
			switch(this.detectMedia(currentNode.children[i])){
				case 'image':
					if(!flagFloor1 && currentNode.children.length == 1) {
						tempNode = currentNode;
						while(tempNode.children.length == 1 && !$.CSS.hasClass(tempNode.parentNode,"jerboa-ignore")){
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
						tempNode = $.Element.set({tag:"div",attr:{"role":"image","style":"position:absolute;"}}).appendChild(tempNode).parentNode;
						newTree.appendChild(tempNode);
						currentNode.removeChild(currentNode.children[i]);
						delete tempNode;
					}
					break;
				case 'media':
					if(!flagFloor1 && currentNode.children.length == 1) {
						tempNode = currentNode;
						while(tempNode.children.length == 1 && !$.CSS.hasClass(tempNode.parentNode,"jerboa-ignore")){
							tempNode = tempNode.parentNode;
						}
						tempNode.setAttribute("role","media");
						tempNode.appendChild($.Element.set({tag:"div",attr:{"class":"jerboa-media-touch"},html:"\&\#160\;"}));
						tempNode.appendChild(currentNode.children[i].cloneNode(true));
						tempNode.removeChild(tempNode.firstChild);
						if(tempNode.children[1].tagName.toLowerCase() == "object"){
							tempNode.children[1].insertBefore($.Element.set({tag:"param",attr:{"name":"wmode","value":"opaque"}}),tempNode.children[1].children[0]);
							tempNode.children[1].lastChild.setAttribute("wmode","opaque");
						}
						continue;
					}
					else {
						//move this element to root Element
						tempNode = currentNode.children[i].cloneNode(true);
						tempNode = $.Element.set({tag:"div",attr:{"role":"media","style":"position:absolute;"},html: "<div class=\"jerboa-media-touch\">\&\#160\;</div>"}).appendChild(tempNode).parentNode;
						if(tempNode.children[1].tagName.toLowerCase() == "object"){
							tempNode.children[1].insertBefore($.Element.set({tag:"param",attr:{"name":"wmode","value":"opaque"}}),tempNode.children[1].children[0]);
							tempNode.children[1].lastChild.setAttribute("wmode","opaque");
						}
						newTree.appendChild(tempNode);
						currentNode.removeChild(currentNode.children[i]);
						delete tempNode;
					}
					break;

				case 'text':
					if(currentNode.children[i].innerHTML=="" && currentNode.children[i].tagName.toLowerCase() != "div"){
						currentNode.removeChild(currentNode.children[i]);
						i--;len--;
						continue;
					}
					if(flagFloor1 && currentNode.children[i].tagName.toLowerCase() != "div"){
						tempNode = currentNode.children[i].cloneNode(true);
						tempNode = $.Element.set({tag:"div",attr:{"role":"text","style":"position:absolute;top:"+currentNode2.children[i].offsetTop+"px;left:"+currentNode2.children[i].offsetLeft+"px;"}}).appendChild(tempNode).parentNode;
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
};
if(document.body)
	Jerboa.init();
	else
{
	if(DEBUG_MODE) console.log("Loaded with $.onDomReady");
	lib.onDomReady(Jerboa.init);
}
return _this;

})(Jerboa || {});

