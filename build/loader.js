var Jerboa=(function(d){var c=document.getElementsByTagName("script");for(var b=0,a=c.length;b<a;b++){if(/loader\.js/.test(c[b].src)){d.path=c[b].src.replace("loader.js","");d.path=d.path.replace(/\/$/i,"");break}}d.load=function(e){var g=d.path+"/"+e.replace(/^\//i,"")+".js",f=document.createElement("script");f.setAttribute("src",g);f.setAttribute("type","text/javascript");if(e){document.getElementsByTagName("head")[0].appendChild(f)}return d};d.loadStyle=function(e){var g=d.path+"/"+e.replace(/^\//i,"")+".css",f=document.createElement("link");f.setAttribute("href",g);f.setAttribute("type","text/css");f.setAttribute("rel","stylesheet");if(e){document.getElementsByTagName("head")[0].appendChild(f)}return d};d.tempRegister=[];d.tempApply="";d.register=function(){d.tempRegister.push(arguments)};d.apply=function(f,e){d.tempApply=[f,e]};return d}(Jerboa||{}));Jerboa.loadStyle("css/core").load("../src/core").load("plugins/fancyinsert").load("plugins/textmenu");