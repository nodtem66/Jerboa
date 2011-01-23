/*
 * Jerboa Plugin for Exteen
 * @Author Jirawat Iamsam-ang
 */
Jerboa.register("Exteen",function(sandbox){
	this.init = function() {
		if(!window.gf_insertimg){
			setTimeout(this.init,1000);
		} else {
			window.gf_insertimg = function(url){
				var ext  = url.substr(url.lastIndexOf(".") + 1).toLowerCase(),code;
				
				if ((ext == 'jpg') || (ext == 'png') || (ext == 'gif')) {
					code = '<img src="'+url+'" />';
				} else if (ext == 'swf') {
					code = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0" width="100" height="100">'+
					'<param name="movie" value="' + url + '" /><param name="quality" value="high" />'+
					'<embed src="' + url + '" quality="high" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" width="100" height="100"></embed></object>';
				}
				sandbox.insertHTML(code);
			};
			window._chmode = window.chmode;
			window.chmode = function(mode){
				document.getElementById("elm1").value = Jerboa.getContent();
				window._chmode(mode);
			};
			window._autosave = window.autosave;
			window.autosave = function(mode){
				document.getElementById("elm1").value = Jerboa.getContent();
				window._autosave(mode);
			};
			window._entrysaved = window.entrysaved;
			window.entrysaved = function(mode){
				document.getElementById("elm1").value = Jerboa.getContent();
				window._entrysaved(mode);
			};
		}
	};
	this.destroy = function() {};
});
