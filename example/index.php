<?php
session_start();
define("TEMPLETE",1);

$content = "";
$req = $_SERVER["QUERY_STRING"];
$req = preg_replace("/^\//i","",$req);
$req = preg_replace("/\/$/i","",$req);
$req = explode("/",$req);
if(isset($_POST["u"])){
	if($_POST["u"] != "" and $_POST["p"] != ""){
		session_unset("u");
		$_SESSION["u"] = $_POST["u"];
		header("Location: ?manage");
	}
} 
$h = <<<HTMLBLOCK
<!DOCTYPE html>
<html>
	<head>
		<title>Jerboa Stupid</title>
		<link rel="stylesheet" type="text/css" href="main.css" />
<script src="../build/loader.js"></script>
<script language="javascript" type="text/javascript" src="js/tinymce/jscripts/tiny_mce/tiny_mce.js"></script>
	</head>
	<body>
HTMLBLOCK;

switch($req[0]){
case "view": //{{{
if(count($req) == 3){
	$file = "./data/".$req[1]."/".urldecode($req[2]);
	echo $h;
} ?>
<div id="menubar">
<div><a href="?manage">DashBoard</a></div><div><a href="?">logout</a></div>
</div>
<iframe src="<?php echo $file;?>" style="position:fixed;z-index:-1;top:3%;width:100%;height:97%;border:none;" scrolling="no"></iframe>
<script type="text/javascript">
/** This is high-level function.
 * It must react to delta being more/less than zero.
 */
function handle(delta) {
	var d=delta*-10;
window.frames[0].scrollBy(0,d);
}

/** Event handler for mouse wheel event.
 */
function wheel(event){
        var delta = 0;
        if (!event) /* For IE. */
                event = window.event;
        if (event.wheelDelta) { /* IE/Opera. */
                delta = event.wheelDelta/120;
                /** In Opera 9, delta differs in sign as compared to IE.
                 */
                if (window.opera)
                        delta = -delta;
        } else if (event.detail) { /** Mozilla case. */
                /** In Mozilla, sign of delta is different than in IE.
                 * Also, delta is multiple of 3.
                 */
                delta = -event.detail/3;
        }
        /** If delta is nonzero, handle it.
         * Basically, delta is now positive if wheel was scrolled up,
         * and negative, if wheel was scrolled down.
         */
        if (delta)
                handle(delta);
        /** Prevent default actions caused by mouse wheel.
         * That might be ugly, but we handle scrolls somehow
         * anyway, so don't bother here..
         */
        if (event.preventDefault)
                event.preventDefault();
				event.returnValue = false;
				return false;
}

/** Initialization code. 
 * If you use your own event management code, change it as required.
 */
if (window.addEventListener)
        /** DOMMouseScroll is for mozilla. */
        window.addEventListener('DOMMouseScroll', wheel, false);
/** IE/Opera. */
window.onmousewheel = document.onmousewheel = wheel;
</script>

<?php //}}}
break; case "manage": //{{{
if(!isset($_SESSION["u"])) header("Location: ?");
$dir = "./data/".$_SESSION["u"];
if(is_dir($dir)){
	$dh = opendir($dir);
} else {
	@mkdir($dir,0777,true) or die("can't make dir in ./data/".$_SESSION["u"]);
	chmod($dir,0777);
	$dh = opendir($dir);
}
echo $h;
?>
<div id="menubar">
<div><a href="?manage">DashBoard</a></div><div><a href="?">logout</a></div>
</div>
<div id="wrapper">
<div id="manage">
<div id="menuitem"></div>
<div id="info">
<img src="./img/avatar.gif" width="100" height="100" />
<blockquote>"No is easier to do. Yes is easier to say."</blockquote>
<p style="color:#ff0051;margin-top:30px;"><?php echo $_SESSION["u"] ?></p>
<p><?php echo date("F j, Y, g:i a") ?></p>
</div>
<div id="ttlist">
<ul>
<?php
while($file=readdir($dh))
{
	if(filetype($dir."/".$file) != "dir"){
?>
<li><a href="?edit/<?php echo $_SESSION["u"];?>/<?php echo $file;?>"><?php echo $file; ?></a>
<a href="?view/<?php echo $_SESSION["u"];?>/<?php echo $file;?>" style="width:20px;height:20px;padding:0;background:url(./img/view.png)"></a>
<a href="?delete/<?php echo $_SESSION["u"];?>/<?php echo $file;?>">X</a></li>
<?php }} ?>
</ul>
<div>
<input type="button" value="new page" onclick="window.location='?edit/<?php echo $_SESSION["u"];?>/'" class="button" style="margin-top:20px" />
</div>
</div>

</div>
</div>
<?php
 closedir($dh);		
//}}} 
 break; case "edit": //{{{ 
if(count($req) != 3) {
	$req[2] = "";
	$dataToEdit = "New Text Here";
}
else {
	$file = "./data/".$req[1]."/".urldecode($req[2]);
	$dataToEdit = file_get_contents($file);
	preg_match("/<!-- startRead -->([\S\D]*)<!-- endRead -->/i",$dataToEdit,$dataToEdit);
	$dataToEdit = $dataToEdit[1];
}
	echo $h;
?>
<div id="menubar">
<div><a href="?manage">DashBoard</a></div><div><a href="?">logout</a></div>
</div>
<div id="wrapper">
<div id="manage">
<div id="menuitem"></div>
<div id="info">
<p style="color:#ff0051;margin-top:30px;"><?php echo $_SESSION["u"] ?></p>
<p><?php echo date("F j, Y, g:i a") ?></p>
</div>

<div id="editor">
<form action="index.php?save/<?php echo $req[1]?>/<?php echo $req[2]?>" method="post">
<label>Title</label><input type="text" name="title" value="<?php $a = explode(".",$req[2]); echo urldecode($a[0]);?>" />
<textarea id="elm1" name="elm1" class=""><?php echo $dataToEdit;?></textarea>
<input type="submit" value="Save" class="hilight button" />
<input type="button" value="Cancel" onclick="window.location='?manage'" class="button" />
<input type="button" value="Enable WYSIWYG editor" onclick="Jerboa.apply('elm1')" class="button" style="float:right;" />
</form>
</div>
</div></div>
<?php //}}}
break; case "save": //{{{
if(count($req) != 3)
{$req[2] = $_POST["title"];}
$file = "./data/".$req[1]."/".urldecode($req[2]);
if($_POST["title"]){
	if($_POST["title"].".html" != urldecode($req[2])){
		if(file_exists($file)){
			unlink($file);
		}
		$file = "./data/".$req[1]."/".$_POST["title"].".html";
	}
	$dataToWrite = file_get_contents("./theme/".TEMPLETE."/index.html");
	$dataToWrite = str_replace("<!-- replaceContent -->","<!-- startRead -->".$_POST["elm1"]."<!-- endRead -->",$dataToWrite);
	$dataToWrite = preg_replace("/href=[\"'](.*)\.css/i","href=\"../../theme/".TEMPLETE."/$1.css",$dataToWrite);
	$dataToWrite = preg_replace("/href=\"..\/..\/theme\/".TEMPLETE."\/http/i","href=\"http",$dataToWrite);
	$dataToWrite = preg_replace("/src=[\"'](.*)\.(.*)/i","src=\"../../theme/".TEMPLETE."/$1.$2",$dataToWrite);
	$dataToWrite = preg_replace("/src=\"..\/..\/theme\/".TEMPLETE."\/http/i","src=\"http",$dataToWrite);
	@file_put_contents($file,$dataToWrite) or die("<script>alert(\"Not Found ${file}\");</script>");
}
header("Location: ?manage");
//}}}
break; case "delete": //{{{
$file = "./data/".$req[1]."/".urldecode($req[2]);
if(file_exists($file)){
	unlink($file);
	header("Location: ?manage");
}
//}}}
break; default: //{{{ 
echo $h;?>
<div id="wrapper">
<div id="login">
<div id="header">jerboa <b>stupid</b><sup>beta</sup></div>
<div id="form-login">
	<form action="index.php" method="post">
	<div style="margin-bottom:10px;display:inline-block;"><label>User</label><input type="text" name="u" /></div>
	<div style="margin-bottom:10px;display:inline-block;"><label>Pass</label><input type="password" name="p" /></div>
	<input type="submit" class="button" style="margin:0px 10px 0 80px;" />
	<input type="reset" value="clear" class="button" />
	</form>
</div>
</div></div>
<?php //}}}
break;
} ?>
</body></html>
