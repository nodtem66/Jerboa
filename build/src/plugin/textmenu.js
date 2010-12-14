/*
 * Jerboa Plugin
 */
Jerboa.register("TextMenu",function(sandbox){
	var lib = sandbox.lib
	,instance
	,node
	;
	this.enable = true;
	this.execute = function(command){
		var haveArgCommand = {"forecolor":true,"backcolor":true}
		,  cssCommand = {"justifyleft":true,"justifycenter":true,"justifyright":true,"justifyfull":true}
		,  clearColorCommand = {"clear":true,"transparent":true,"remove":true,"clearcolor":true,"removecolor":true}
		,  args = null
			;
		if(cssCommand[command] == true)
		{
			if(!document.execCommand(command,false,args))
				lib.addStyle(Jerboa.currentEditElement,{"text-align":command.replace(/justify/ig,"").replace(/full/ig,"justify")});
			return false;
		}
		if(haveArgCommand[command] == true)
		{
			args = prompt("Insert RGB color","000000");
			if(clearColorCommand[args] == true || (args.length != 3 && args.length != 6))
			{
				args = "transparent";
			}
			else if(lib.env.firefox || lib.env.webkit)
				args = "#"+args;
		}   
		document.execCommand(command,false,args);

	}
	this.init = function(){
		var tempNode = null;
		instance = sandbox.addPanel("textmenu");
		node = instance.getElement();
		
		tempNode = lib.setNode();
		tempNode.appendChild(lib.setNode({tag:"button",html:"<span></span>",event:{add:"click",fn:lib.curry(this.execute,this,0,"outdent")}}));
		tempNode.appendChild(lib.setNode({tag:"button",html:"<span></span>",event:{add:"click",fn:lib.curry(this.execute,this,0,"indent")}}));
		tempNode.appendChild(lib.setNode({tag:"button",html:"<span></span>",event:{add:"click",fn:lib.curry(this.execute,this,0,"insertunorderedlist")}}));
		tempNode.appendChild(lib.setNode({tag:"button",html:"<span></span>",event:{add:"click",fn:lib.curry(this.execute,this,0,"insertorderedlist")}}));
		node.appendChild(tempNode);

		tempNode = lib.setNode();
		tempNode.appendChild(lib.setNode({tag:"button",html:"<span></span>",event:{add:"click",fn:lib.curry(this.execute,this,0,"forecolor")}}));
		tempNode.appendChild(lib.setNode({tag:"button",html:"<span></span>",event:{add:"click",fn:lib.curry(this.execute,this,0,"backcolor")}}));
		tempNode.appendChild(lib.setNode({tag:"button",html:"<b>B</b>",event:{add:"click",fn:lib.curry(this.execute,this,0,"bold")}}));
		tempNode.appendChild(lib.setNode({tag:"button",html:"<i>I</i>",event:{add:"click",fn:lib.curry(this.execute,this,0,"italic")}}));
		tempNode.appendChild(lib.setNode({tag:"button",html:"<u>U</u>",event:{add:"click",fn:lib.curry(this.execute,this,0,"underline")}}));
		tempNode.appendChild(lib.setNode({tag:"button",html:"<span></span>",event:{add:"click",fn:lib.curry(this.execute,this,0,"justifyleft")}}));
		tempNode.appendChild(lib.setNode({tag:"button",html:"<span></span>",event:{add:"click",fn:lib.curry(this.execute,this,0,"justifycenter")}}));
		tempNode.appendChild(lib.setNode({tag:"button",html:"<span></span>",event:{add:"click",fn:lib.curry(this.execute,this,0,"justifyright")}}));
		tempNode.appendChild(lib.setNode({tag:"button",html:"<span></span>",event:{add:"click",fn:lib.curry(this.execute,this,0,"justifyfull")}}));
		node.appendChild(tempNode);
		sandbox.listen("textedit",function(){
			if(this.enable) instance.show();
		},this);
		sandbox.listen("restorestate",function(){
			instance.hide();
		},this);
		sandbox.listen("click-flipswitch-TextMenu",function(value){
			this.enable = value.data;
		},this);
	}
	this.destroy = function(){}
});