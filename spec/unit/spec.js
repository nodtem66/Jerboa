JSpec.describe('Jerboa',function(){
	that=Jerboa()
	,$=that.$;
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
});
