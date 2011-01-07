/*
 * Jerboa Plugin
 */
Jerboa.register("TextMenu",function(sandbox){
	var lib = sandbox.lib,instance,node;
	this.enable = true;
	this.execute = function(command){
		var haveArgCommand = {"forecolor":true,"backcolor":true},
				cssCommand = {"justifyleft":true,"justifycenter":true,"justifyright":true,"justifyfull":true},
				clearColorCommand = {"clear":true,"transparent":true,"remove":true,"clearcolor":true,"removecolor":true},
				args = arguments[1] || null;
		if(command == "fontname") {
			document.execCommand("fontname",false,args);
			return false;
		}
		if(cssCommand[command])
		{
			if(!document.execCommand(command,false,args)){
				lib.addStyle(Jerboa.currentEditElement,{"text-align":command.replace(/justify/ig,"").replace(/full/ig,"justify")});
			}
			return false;
		}
		if(haveArgCommand[command])
		{
			args = prompt("Insert RGB color","000000");
			if(clearColorCommand[args] || (args.length != 3 && args.length != 6))
			{
				args = "transparent";
			}
			else if(lib.env.firefox || lib.env.webkit){
				args = "#"+args;
			}
		}   
		document.execCommand(command,false,args);
	};
	this.init = function(config){
		var tempNode = null,listbutton,i,len,ii,llen,path = sandbox.getPath(),haveSpace = false;
		instance = sandbox.addPanel("textmenu");
		node = instance.getElement();
		if(config && config.button){
			listbutton = config.button.split(";");
		} else {
			listbutton = ["indent,outdent,insertunorderedlist,insertorderedlist","forecolor,backcolor,bold,italic,underline,justifyleft,justifycenter,justifyright,justifyfull","fontfamily"];
		}
		for(i=0,len=listbutton.length;i<len;i++)
		{
			listbutton[i] = listbutton[i].split(",");
			if(!listbutton[i][0]) {continue;}
			tempNode = lib.setNode();
			for(ii=0,llen=listbutton[i].length;ii<llen;ii++){
				if(i>0 && ii===0) {haveSpace = true;}
				if(listbutton[i][ii] == "fontfamily"){
					haveSpace = true;
					if(config && config.font){
					if(ii==llen-1){
						tempNode.appendChild((new sandbox.Class("Input")({type:"selectbox",label:"fontfamily",value:config.font.split(","),styleMain:"margin:0;margin-left:2px;",styleDropdown:"margin:0;top:29px;left:-1px;"})).getElement());
					}
					else if(ii===0){
						tempNode.appendChild((new sandbox.Class("Input")({type:"selectbox",label:"fontfamily",value:config.font.split(","),styleMain:"margin:0;margin-left:2px;",styleDropdown:"margin:0;top:29px;left:-1px;"})).getElement());
						node.appendChild(tempNode);
						tempNode = lib.setNode();
					}
					else{
						node.appendChild(tempNode);
						tempNode = lib.setNode();
						tempNode.appendChild((new sandbox.Class("Input")({type:"selectbox",label:"fontfamily",value:config.font.split(","),styleMain:"margin:0;margin-left:2px;",styleDropdown:"margin:0;top:29px;left:-1px;"})).getElement());
						node.appendChild(tempNode);
						tempNode = lib.setNode();
					}}
				}
				else if(haveSpace){
					tempNode.appendChild(lib.setNode({tag:"button",html:"<span style=\"background: url("+path+"/img/"+listbutton[i][ii]+".png) -1px -1px no-repeat\"></span>",event:{add:"click",fn:lib.curry(this.execute,this,0,listbutton[i][ii])},attr:{style:"margin-left:2px"}}));
					haveSpace = false;
				} else {
					if(listbutton[i][ii] == "bold"){
						tempNode.appendChild(lib.setNode({tag:"button",html:"<b>B</b>",event:{add:"click",fn:lib.curry(this.execute,this,0,listbutton[i][ii])}}));
					}
					else if(listbutton[i][ii] == "italic"){
						tempNode.appendChild(lib.setNode({tag:"button",html:"<i>I</i>",event:{add:"click",fn:lib.curry(this.execute,this,0,listbutton[i][ii])}}));
					}
					else if(listbutton[i][ii] == "underline"){
						tempNode.appendChild(lib.setNode({tag:"button",html:"<u>U</u>",event:{add:"click",fn:lib.curry(this.execute,this,0,listbutton[i][ii])}}));
					}
					else {
						tempNode.appendChild(lib.setNode({tag:"button",html:"<span style=\"background: url("+path+"/img/"+listbutton[i][ii]+".png) -1px -1px no-repeat\"></span>",event:{add:"click",fn:lib.curry(this.execute,this,0,listbutton[i][ii])}}));
					}
				}
			}
			node.appendChild(tempNode);
		}

		sandbox.listen("textedit",function(){
			instance.show();
			sandbox.getUI("mainmenu").hide();
		},this);
		sandbox.listen("restorestate",function(){
			instance.hide();
			sandbox.getUI("mainmenu").show();
		},this);
		sandbox.listen("change-selectbox-fontfamily",function(e){
			this.execute("fontname",e.data);		
		},this);
	};
	this.destroy = function(){};
});
