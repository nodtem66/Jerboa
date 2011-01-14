my = {};
my.lib = {};
my.lib.getObjectOfStyle = function(element) { //{{{1
			var listStyle = element.getAttribute("style") || "",
					i=0,
					len=0,
					objectStyle={},
					cssValue="";
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
		var listStyle="",
				item;
		for(item in objectStyle)
		{
			if(item.substr(0,1) != "_"){
				listStyle = listStyle.concat(item+":"+objectStyle[item]+";");
			}
		}
		element.setAttribute("style",listStyle);
	}; //}}}
	my.lib.addStyle = function(element,List) { //{{{1
		var objStyle = this.getObjectOfStyle(element),item;
		for(item in List)
			{
				if(item.substr(0,1) != "_"){
					objStyle[item] = List[item];
				}
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
JSpec.describe("Lib",function(){
	describe('.addStyle()',function(){
		it('test i',function(){
			a = document.createElement("div");
			a.setAttribute("style","width:10px;height:10px;");
			my.lib.addStyle(a,{"position":"absolute"});
			expect(a.getAttribute("style")).to(be,"");
		});
	});
});
/*JSpec.describe('Jerboa',function(){
	that=Jerboa()
	,$=that.$;
	describe('$.CSS.hasClass()',function(){
		it('test null',function(){
			var tree = $.Element.set({tag: "div",attr:{"class":"test"}});
			expect($.CSS.hasClass(tree,"")).to(be,false);	
		});
		it('test single classes',function(){
			var tree = $.Element.set({tag: "div",attr:{"class":"test"}});
			expect($.CSS.hasClass(tree,"test")).to(be,true);	
		});
		it('test single classes',function(){
			var tree = $.Element.set({tag: "div",attr:{"class":"test"}});
			expect($.CSS.hasClass(tree,"test2")).to(be,false);	
		});		
		it('test multiple classes',function(){
			var tree = $.Element.set({tag: "div",attr:{"class":"test1 test2"}});
			expect($.CSS.hasClass(tree,"test3")).to(be,false);	
		});
		it('test multiple classes',function(){
			var tree = $.Element.set({tag: "div",attr:{"class":"test1 test2 test3"}});
			expect($.CSS.hasClass(tree,"test2")).to(be,true);	
		});
		it('test multiple classes',function(){
			var tree = $.Element.set({tag: "div",attr:{"class":"test1 test2 test3"}});
			expect($.CSS.hasClass(tree,"test1")).to(be,true);
		});
		it('test hyphen-type classes',function(){
			var tree = $.Element.set({tag: "div",attr:{"class":"test"}});
			expect($.CSS.hasClass(tree,"test")).to(be,true);	
		});
		

	});
	describe('.normalizeTree()',function(){
		it('input null should be \'\'',function() {
			expect(normalizeTree(null)).to(equal,'');	
		});
		it('test <text> transform (*)',function(){
			var tree = $.Element.set({tag:"div",html:"<p>111</p><p>222</p>"});
			expect(normalizeTree.call(that,tree)).to(be,"<div><p>111</p></div><div><p>222</p></div>");
		});
		it('test <text> transform (**)',function(){
			var tree = $.Element.set({tag:"div",html:"<p>1</p><p>2</p><div><p>3</p><p>4</p></div>"});
			expect(normalizeTree.call(that,tree)).to(be,"<div><p>1</p></div><div><p>2</p></div><div><p>3</p><p>4</p></div>");
		});
		it('test <text> transform (**)',function(){
			var tree = $.Element.set({tag:"div",html:"<p></p><div>1</div><div></div>"});
			expect(normalizeTree.call(that,tree)).to(be,"<div>1</div><div></div>");
		});

		it('test <text> transform (**)',function(){
			var tree = $.Element.set({tag:"div",html:"<div>1</div><div><p></p></div>"});
			expect(normalizeTree.call(that,tree)).to(be,"<div>1</div><div></div>");
		});

		it('test <img> transform (*)',function(){
			var tree = $.Element.set({tag:"div",html: "<img id=\"1\" />"});
			expect(normalizeTree.call(that,tree)).to(be,"<div><img id=\"1\"></div>");
		});
		it('test <img> transform (**)',function() {
			var tree = $.Element.set({tag:"div",html:"<div>11<img id=\"1\" /></div>"});
			expect(normalizeTree.call(that,tree)).to(be,"<div>11</div><div><img id=\"1\"></div>");
		});

		it('test <img> transform (**)',function() {
			var tree = $.Element.set({tag:"div",html:"<div><p>1</p><img></div>"});
			expect(normalizeTree.call(that,tree)).to(be,"<div><p>1</p></div><div><img></div>");
		});
		it('test <img> transform (***)',function() {
			var tree = $.Element.set({tag: "div",html:"<p>11<img id=\"1\" /></p><div><img id=\"2\" /></div>"});	
			expect(normalizeTree.call(that,tree)).to(be,"<div><p>11</p></div><div><img id=\"2\"></div><div><img id=\"1\"></div>");
		});
		
	});
});*/

