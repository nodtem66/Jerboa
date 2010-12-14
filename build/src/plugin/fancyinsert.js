/*
 * Jerboa Plugin
 */
Jerboa.register("FancyInsert",function(sandbox){
	var lib = sandbox.lib;
	var Clipboard = function(){
		var node = lib.setNode({attr:{"contenteditable":"true","style":"display:inline-block;overflow:hidden;width:1px;height:1px;"}})
		;
		this.getElement = function(){
			return node;
		}
		this.getValue = function(){
			node.blur();
			return node.innerHTML;
		}
		this.setValue = function(text){
			node.innerHTML = text;
		}
		this.focus = function(){
			node.innerHTML = "";
			node.focus();
		}
	}
	var clipboard = new Clipboard();
	this.enable = true;
	this.sendDecorateNode = function(text){
		if(!this.enable) return;
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
				console.log(cropText);
			}
		}else{
			cropText = "Insert Text here";
		}
		typeMedia = lib.detectMedia(cropText);
		if(typeMedia == "media") cropText = "<div class=\"jerboa-media-touch\"> </div>"+cropText;
		var returnNode = lib.setNode({html:cropText,attr:{"role":typeMedia,"style":"position:absolute;top:0px;left:0px;"}});
		sandbox.Class("stage").getLayer().appendChild(returnNode);
	}
	this.init = function(){
		var self = this;
		sandbox.ui("core").appendChild(clipboard.getElement());
		sandbox.listen(["keydown-noediting-paste"],function(){
			clipboard.focus();
			setTimeout(function(){
				self.sendDecorateNode(clipboard.getValue());
			},100);
		},this);
		sandbox.listen(["click-flipswitch-FancyInsert"],function(value){
				this.enable = value.data;
		},this);
	};
	this.destroy = function(){
		sandbox.ui("core").removeChild(childboard.getElement());
	};
});