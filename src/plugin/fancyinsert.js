/*
 * Jerboa Plugin
 */
Jerboa.register("FancyInsert",function(sandbox){
	var lib = sandbox.lib;
	var Clipboard = function(){
		var node = lib.setNode({attr:{"contenteditable":"true","style":"position:absolute;top:0;display:inline-block;overflow:hidden;width:1px;height:1px;"}})
		,olddata = "",jbdata=null;
		this.getElement = function(){
			return node;
		}
		this.getValue = function(){
			node.blur();
			if(!jbdata)
				return node.innerHTML;
			if(node.innerHTML == olddata || olddata == ""){
			var attrs = jbdata.attributes,returnHTML = "<div";
			for(var i=0,len = attrs.length;i<len;i++){
				returnHTML += " "+attrs[i].name+"=\""+attrs[i].value+"\""; 
			}
			returnHTML += ">"+jbdata.innerHTML+"</div>";
			return returnHTML;
			}
			
			jbdata = null;
			return node.innerHTML;
			
		}
		this.setValue = function(text){
			node.innerHTML = text;
		}
		this.setJerboaData = function(elementCopy){
			jbdata = elementCopy;
		}
		this.focus = function(){
			olddata = node.innerHTML;
			node.innerHTML = "";
			node.focus();
		}
	}
	var clipboard = new Clipboard(); 
	this.sendDecorateNode = function(text){
		var cropText="",typeMedia
		,listImg = {"png":1,"jpg":1,"gif":1}
		;
		if(text){
			//crop Text
			cropText = text.replace(/\<meta[^\>]+\>/i,"");
			if(/\<span[^\>]*Apple-style-span[^\>]+\>/i.test(cropText)) cropText = cropText.replace(/\<span[^\>]*Apple-style-span[^\>]+\>/i,"").replace(/\<\/span\>$/i,"");
			
			//check URI pattern
			if(/^\<a href="([^\>]+)"\>\1\<\/a\>$/i.test(cropText)){
				cropText = cropText.replace(/^\<a href="([^\>]+)"\>/i,"").replace(/\<\/a\>$/i,"");
				if(/^http/i.test(cropText)){
					var tail = cropText.split(".");
					tail = tail[tail.length-1];
					if(listImg[tail]) cropText = "<img src=\""+cropText+"\" />";
				}
			}

			//check flash object
			if(/^\&lt;object/i.test(cropText)){
				cropText = cropText.replace(/&lt;/ig,"<").replace(/&gt;/ig,">");
				cropText = cropText.replace(/\>\<param/i,"><param wmode=\"opaque\"><param");
				cropText = cropText.replace(/\<embed/i,"<embed wmode=\"opaque\"");
			}
		}else{
			cropText = "Insert Text here";
		}
		var returnNode;
		if(/^\<div role/i.test(cropText)){
			returnNode = lib.setNode({html:cropText}).children[0];
		} else {
			typeMedia = lib.detectMedia(cropText);
			if(typeMedia == "media") cropText = "<div class=\"jb-media-touch\"> </div>"+cropText;
			returnNode = lib.setNode({html:cropText,attr:{"role":typeMedia,"style":"position:absolute;top:0px;left:0px;"}});
		}
		sandbox.getStage().getLayer().appendChild(returnNode);
	}
	this.init = function(){
		var self = this;
		sandbox.getUI("core").appendChild(clipboard.getElement());
		sandbox.listen("keydown-noediting-paste",function(){
			clipboard.focus();
			setTimeout(function(){
				self.sendDecorateNode(clipboard.getValue());
				sandbox.getHistory().save(sandbox.getStage().getLayer().innerHTML);
			},100);
		},this);
		sandbox.listen("keydown-move-copy",function(){
			clipboard.setJerboaData(sandbox.getStage().currentEditingNode);
		},this);
	};
	this.destroy = function(){
		sandbox.getUI("core").removeChild(clipboard.getElement());
	};
});
