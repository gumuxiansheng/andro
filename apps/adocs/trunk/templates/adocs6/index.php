<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Andromeda</title>
<link rel='stylesheet'
     href='templates/adocs6/adocs6.css' />
<link rel='stylesheet'
     href='appclib/src/prettify.css'/>
<script type='text/javascript' src='clib/jquery-1.2.3.js'></script>
<script type='text/javascript' src='appclib/src/prettify.js'></script>
<script type='text/javascript' src='appclib/src/lang-ddyaml.js'></script>
</head>
<body>
<div id='a6wrapper'>
    <div id='a6banner'>
      <a href="index.php" style="float: left;">
        <img src='appclib/logo.png'>
      </a>
      <div id='a6bannertext'>
        The fastest easiest way to <i>get it right</i>.
      </div>
    </div>
    <div id='a6links'>
        <div style="float: left">
        <a href="index.php">Home</a>
        <a href="thedemo.html">Demos</a>
        <a href="tableofcontents.html">Documentation</a>
        <a href="downloads.html">Download</a>
        <a href="credits.html">Credits</a>
        <a href="contact.html">Contact</a>
        <a href="index.php?gp_page=x_login">Login</a>
        </div>
        <div style="float: right; font-size: 80%">
        <form style='display: inline' action="index.php">
        <input type="hidden" name="gp_page" value="search" />
        <input type="submit"  value="Search: " 
               style="border: 0; background-color: white;" />
        <input style="border: 0; background-color: silver;height: 15px;"
                       name="search"></input>
        </form>
        </div>
        <div style="clear:both"></div>
    </div>
    <div id='a6body'>
        <?php echo ehStandardContent()?>
    </div>
    <div style="clear:both"></div>
    <div id='a6foot'>
        <a href="index.php">Home</a>&nbsp;|&nbsp;
        <a href="tableofcontents.html">Documentation</a>&nbsp;|&nbsp;
        <a href="downloads.html">Download</a>&nbsp;|&nbsp;
        <a href="credits.html">Credits</a>&nbsp;|&nbsp;
        <a href="contact.html">Contact</a>&nbsp;|&nbsp;
        <a href="index.php?gp_page=x_login">Login</a>
        <br/>
        Andromeda &copy; Copyright 2004-<?php echo date('Y'); ?>, 
        Licensed under the 
        <a href="http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt"
        >GPL Version 2</a>
    </div>
</div>
</body>
<script>
$('pre.prettyprint').each(
    function() {
        var x = $(this).html();
        $(this).html(x.replace(/\</g,'&lt;'));
    }
);
prettyPrint();
</script>
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-3482551-5");
pageTracker._setDomainName(".andromeda-project.org");
pageTracker._trackPageview();
} catch(err) {}
</script>
</html>
