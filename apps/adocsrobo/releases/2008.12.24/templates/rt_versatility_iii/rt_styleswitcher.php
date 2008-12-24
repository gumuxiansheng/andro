<?php
defined( '_VALID_MOS' ) or die( 'Direct Access to this location is not allowed.' );
$cookie_prefix = "v3-";
$cookie_time = time()+31536000;
if (isset($_GET['fontstyle'])) {
	$font = $_GET['fontstyle'];
	$_SESSION[$cookie_prefix. 'fontstyle'] = $font;
	setcookie ($cookie_prefix. 'fontstyle', $font, $cookie_time, '/', false);
}
if (isset($_GET['tstyle'])) {
	$tstyle = $_GET['tstyle'];
	$_SESSION[$cookie_prefix. 'tstyle'] = $tstyle;
	setcookie ($cookie_prefix. 'tstyle', $tstyle, $cookie_time, '/', false);
}
if (isset($_GET['mtype'])) {
	$mtype = $_GET['mtype'];
	$_SESSION[$cookie_prefix. 'mtype'] = $mtype;
	setcookie ($cookie_prefix. 'mtype', $mtype, $cookie_time, '/', false);
}
?>
