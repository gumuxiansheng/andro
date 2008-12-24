<?php
defined( '_VALID_MOS' ) or die( 'Direct Access to this location is not allowed.' );
require($mosConfig_absolute_path."/templates/" . $mainframe->getTemplate() . "/rt_styleswitcher.php");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Andromeda Documentation 
<?=vgaGet('pageTitle')=='' ? '' : ': '.vgaGet('pageTitle')?>
</title>
<?php
if ( $my->id ) {
	initEditor();
}
mosShowHead();

// *************************************************
// Change this variable blow to switch color-schemes
//
// If you have any issues, check out the forum at
// http://www.rockettheme.com
//
// *************************************************

$default_style = "style5";			// style1 | style2 | style3 | ..... | style20
$template_width = "950";				// width in px | fluid
$side_width = "175";						// width in px
$menu_name = "mainmenu";				// mainmenu by default, can be any Joomla menu name
$menu_type = "moomenu";					// moomenu | suckerfish | splitmenu | module
$menu_side = "right";						// left | right
$default_font = "default";      // smaller | default | larger
$show_pathway = "true";					// true | false
$show_pulldown = "false";				// true | false


require($mosConfig_absolute_path."/templates/" . $mainframe->getTemplate() . "/rt_styleloader.php");

$sidenav = false;
/*
if ($mtype=="splitmenu") :
	require($mosConfig_absolute_path."/templates/" . $mainframe->getTemplate() . "/rt_splitmenu.php");
	$topnav = rtShowHorizMenu($menu_name);
	$sidenav = rtShowSubMenu($menu_name, "-hilite2");
elseif ($mtype=="moomenu" or $mtype=="suckerfish") :
	require($mosConfig_absolute_path."/templates/" . $mainframe->getTemplate() . "/rt_moomenu.php");
	$sidenav = false;
endif;
*/

if ($template_width=="fluid") { 
	$template_width = "width: 100%;";
} else {
	$template_width = 'margin: 0 auto; width: ' . $template_width . 'px;';
}

// make sure sidenav is empty
if (strlen($sidenav) < 10) $sidenav = false;

//Are we in edit mode
$editmode = false;
if (  !empty( $_REQUEST['task'])  && $_REQUEST['task'] == 'edit'  ) :
	$editmode = true;
endif;

$mosConfig_live_site = baseUrl();
if(substr($mosConfig_live_site,-1)=='/') 
    $mosConfig_live_site
        = substr($mosConfig_live_site,0,strlen($mosConfig_live_site)-1);
        
?>
<meta http-equiv="Content-Type" content="text/html; <?php echo _ISO; ?>" />
<link href="<?php echo $mosConfig_live_site;?>/templates/<?php echo $mainframe->getTemplate(); ?>/css/template_css.css" rel="stylesheet" type="text/css" />
<link href="<?php echo $mosConfig_live_site;?>/templates/<?php echo $mainframe->getTemplate(); ?>/css/<?php echo $tstyle; ?>.css" rel="stylesheet" type="text/css" />
<link href="<?php echo $mosConfig_live_site;?>/templates/<?php echo $mainframe->getTemplate(); ?>/slimbox/slimbox.css" rel="stylesheet" type="text/css" />
<?php if($mtype=="moomenu" or $mtype=="suckerfish") :?>
<link href="<?php echo $mosConfig_live_site;?>/templates/<?php echo $mainframe->getTemplate(); ?>/css/rokmoomenu.css" rel="stylesheet" type="text/css" />
<?php endif; ?>
<!--[if lte IE 6]>
<style type="text/css">
#fxTab {background: none; filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='templates/<?php echo $mainframe->getTemplate(); ?>/images/<?php echo $tstyle; ?>/fx-tab.png', sizingMethod='scale', enabled='true');}
img { behavior: url(<?php echo $mosConfig_live_site;?>/templates/<?php echo $mainframe->getTemplate(); ?>/css/iepngfix.htc); }
</style>
<link href="<?php echo $mosConfig_live_site;?>/templates/<?php echo $mainframe->getTemplate(); ?>/css/template_ie6.css" rel="stylesheet" type="text/css" />
<![endif]-->
<link rel="shortcut icon" href="<?php echo $mosConfig_live_site;?>/images/favicon.ico" />
<style type="text/css">
	td.left div.moduletable, td.right div.moduletable, td.left div.moduletable-hilite1, td.right div.moduletable-hilite1, td.left div.moduletable-hilite2, td.right div.moduletable-hilite2, td.left div.moduletable-hilite3, td.right div.moduletable-hilite3, td.left div.moduletable-hilite4, td.right div.moduletable-hilite4, td.left div.moduletable-hilite5, td.right div.moduletable-hilite5, td.left div.moduletable-hilite6, td.right div.moduletable-hilite6, td.left div.moduletable-hilite7, td.right div.moduletable-hilite7, td.left div.moduletable-hilite8, td.right div.moduletable-hilite8 { width: <?php echo $side_width; ?>px;	}
	div.wrapper { <?php echo $template_width; ?>}
</style>
<script type="text/javascript" src="<?php echo $mosConfig_live_site;?>/templates/<?php echo $mainframe->getTemplate(); ?>/js/mootools-release-1.11.js"></script>
<?php if ($show_pulldown == "true") : ?>
<script type="text/javascript" src="<?php echo $mosConfig_live_site;?>/templates/<?php echo $mainframe->getTemplate(); ?>/js/roktools.js"></script>
<?php endif; ?>
<?php if($mtype=="moomenu") :?>
<script type="text/javascript" src="<?php echo $mosConfig_live_site;?>/templates/<?php echo $mainframe->getTemplate(); ?>/js/mootools.bgiframe.js"></script>
<script type="text/javascript" src="<?php echo $mosConfig_live_site;?>/templates/<?php echo $mainframe->getTemplate(); ?>/js/rokmoomenu.js"></script>
<script type="text/javascript">
window.addEvent('domready', function() {
	new rokmoomenu($E('ul.nav'), {
		bgiframe: false,
		delay: 500,
		animate: {
			props: ['opacity', 'width', 'height'],
			opts: {
				duration:400,
				fps: 100,
				transition: Fx.Transitions.sineOut
			}
		}
	});
});
</script>
<?php endif; ?>
<?php if($mtype=="suckerfish") :
	echo "<!--[if IE]>\n";		
  include_once( "$mosConfig_absolute_path/templates/" . $mainframe->getTemplate() . "/js/ie_suckerfish.js" );
  echo "<![endif]-->\n";
endif; ?>
<?php include 'androHTMLHead.php' ?>
</head>
<body id="page_bg" class="<?php echo $fontstyle; ?>">
<script type="text/javascript" src="<?php echo $mosConfig_live_site;?>/templates/<?php echo $mainframe->getTemplate(); ?>/js/slimbox.js"></script>
	<?php if ($show_pulldown == "true") : ?>
	<div id="fxContainer">
		<div id="fxTarget">
			<div id="fxPadding" class="wrapper">
				<?php mosLoadModules('header', -2); ?>
			</div>
		</div>
		<div id="fxTab">
			<span id="fxTrigger">&nbsp;</span>
		</div>
	</div>
	<?php endif; ?>
	<div id="template" class="wrapper">
		<div id="header">
			<a href="<?php echo $mosConfig_live_site;?>" class="nounder"><img src="<?php echo $mosConfig_live_site;?>/images/blank.png" style="border:0;" alt="" id="logo" /></a>
			<div id="banner">
				<div class="padding">
					<?php mosLoadModules('banner', -1); ?>
				</div>
                <div style="float: right; margin-top: -10px">
                <h3><i>The Fastest Easiest Way <u>to get it Right</u></i></h3>
                </div>
			</div>
		</div>
		<div id="horiz-menu" class="<?php echo $mtype; ?>">
			<?php if($mtype == "splitmenu") : ?>
				<?php echo $topnav; ?>
			<?php elseif($mtype == "moomenu" or $mtype=="suckerfish") : ?>
				<?php mosShowListMenu($menu_name);	?>
			<?php else: ?>
      	<?php mosLoadModules('toolbar',-1); ?>
	    <?php endif; ?>
        <form action="<?=$mosConfig_live_site?>/index.php" method="POST">
        <span style="float: right; margin-top: 10px">
        <span style="color: white;">SEARCH:</span
          ><input name='txtsearch' style="height: 12px; font-size: 90%">
        </form>
        </span>
		</div>
		<div id="top">
			<?php if ($show_pathway == "true") : ?>
				<?php mosPathway(); ?>
			<?php endif; ?>
			<?php mosLoadModules('top', -1); ?>
		</div>
		<?php $section1count = mosCountModules('advert1') + mosCountModules('user1') + mosCountModules('user2'); ?>
		<?php if($section1count) : ?>
		<?php $section1width = 'w' . floor(99 / $section1count); ?>
		<div class="clr" id="section1">
			<table class="sections" cellspacing="0" cellpadding="0">
				<tr valign="top">
					<?php if(mosCountModules('advert1')) : ?>
					<td class="section <?php echo $section1width ?>">
						<?php mosLoadModules('advert1', -2); ?>
					</td>
					<?php endif; ?>
					<?php if(mosCountModules('user1')) : ?>
					<td class="section <?php echo $section1width; ?>">
						<?php mosLoadModules('user1', -2); ?>
					</td>
					<?php endif; ?>
					<?php if(mosCountModules('user2')) : ?>
					<td class="section <?php echo $section1width; ?>">
						<?php mosLoadModules('user2', -2); ?>
					</td>
					<?php endif; ?>
				</tr>
			</table>
		</div>
		<?php endif; ?>
		<div class="clr" id="mainbody">
			<table class="mainbody" cellspacing="0" cellpadding="0">
				<tr valign="top">
					<?php if(!$editmode and (mosCountModules('left') or ($sidenav and $menu_side == 'left'))) : ?>
					<td class="left">
						<?php if($sidenav and $menu_side == 'left') : ?>
						<div id="vert-menu">
							<?php echo $sidenav; ?>
						</div>
						<?php endif; ?>
						<?php mosLoadModules('left', -2); ?>
					</td>
					<?php endif; ?>
					<td class="mainbody">
					<?php $mainbodycount = mosCountModules('user3') + mosCountModules('user4'); ?>
					<?php if($mainbodycount) : ?>
					<?php $mainbodywidth = 'w' . floor(99 / $mainbodycount); ?>
						<table class="sections" cellspacing="0" cellpadding="0">
							<tr valign="top">
								<?php if(mosCountModules('user3')) : ?>
								<td class="section <?php echo $mainbodywidth; ?>">
									<?php mosLoadModules('user3', -2); ?>
								</td>
								<?php endif; ?>
								<?php if(mosCountModules('user4')) : ?>
								<td class="section <?php echo $mainbodywidth; ?>">
									<?php mosLoadModules('user4', -2); ?>
								</td>
								<?php endif; ?>
							</tr>
						</table>
					<?php endif; ?>
					<div class="padding">
						<?php mosMainbody(); ?>
					</div>
						<?php $mainbody2count = mosCountModules('user5') + mosCountModules('user6'); ?>
						<?php if($mainbody2count) : ?>
						<?php $mainbody2width = 'w' . floor(99 / $mainbody2count); ?>
							<table class="sections" cellspacing="0" cellpadding="0">
								<tr valign="top">
									<?php if(mosCountModules('user5')) : ?>
									<td class="section <?php echo $mainbody2width; ?>">
										<?php mosLoadModules('user5', -2); ?>
									</td>
									<?php endif; ?>
									<?php if(mosCountModules('user6')) : ?>
									<td class="section <?php echo $mainbody2width; ?>">
										<?php mosLoadModules('user6', -2); ?>
									</td>
									<?php endif; ?>
								</tr>
							</table>
						<?php endif; ?>
					</td>
					<?php if(!$editmode and (mosCountModules('right') or ($sidenav and $menu_side == 'right'))) : ?>
					<td class="right">
						<?php if($sidenav and $menu_side == 'right') : ?>
						<div id="vert-menu">
							<?php echo $sidenav; ?>
						</div>
						<?php endif; ?>
						<?php mosLoadModules('right', -2); ?>
					</td>
					<?php endif; ?>
				</tr>
			</table>
		</div>
		<?php $section2count = mosCountModules('advert2') + mosCountModules('user7') + mosCountModules('user8'); ?>
		<?php if($section2count) : ?>
		<?php $section2width = 'w' . floor(99 / $section2count); ?>
		<?php $block2div = (mosCountModules('advert2') and (mosCountModules('user7') or mosCountModules('user8'))) ? " divider" : ""; ?>
		<?php $block3div = (mosCountModules('user8') and (mosCountModules('advert2') or mosCountModules('user8'))) ? " divider" : ""; ?>
		<div class="clr" id="section2">
			<table class="sections" cellspacing="0" cellpadding="0">
				<tr valign="top">
					<?php if(mosCountModules('advert2')) : ?>
					<td class="section <?php echo $section2width; ?>">
						<?php mosLoadModules('advert2', -2); ?>
					</td>
					<?php endif; ?>
					<?php if(mosCountModules('user7')) : ?>
					<td class="section <?php echo $section2width . $block2div; ?>">
						<?php mosLoadModules('user7', -2); ?>
					</td>
					<?php endif; ?>
					<?php if(mosCountModules('user8')) : ?>
					<td class="section <?php echo $section2width . $block3div; ?>">
						<?php mosLoadModules('user8', -2); ?>
					</td>
					<?php endif; ?>
				</tr>
			</table>
		</div>
		<?php endif; ?>
		<div id="footer" class="clr">
			<div class="rk-1">
				<div class="rk-2">
                <div style="color: #D0D0D0; text-align: center; padding-top: 8px">
                Andromeda is &copy; Copyright 2004-2007 by Kenneth Downs
                <br/>
                Distributed under the General Public License version 2.0 or later
                </div>
                <?php /*
					<div id="the-footer">
						<a href="http://www.rockettheme.com/" title="RocketTheme Joomla Template Club" class="nounder"><img src="<?php echo $mosConfig_live_site;?>/images/blank.png" style="border:0;" alt="RocketTheme Joomla Templates" id="rocket" /></a>
					</div>
                    */ ?>
				</div>
			</div>
		</div>
	</div>
<?php mosLoadModules( 'debug', -1 );?>
<?php include 'androHTMLFoot.php' ?>
<?php if(baseUrl()=='http://www.andromeda-project.org/') { ?>
<!-- Start of StatCounter Code -->
<script type="text/javascript">
var sc_project=4149040; 
var sc_invisible=1; 
var sc_partition=51; 
var sc_click_stat=1; 
var sc_security="1156951b"; 
</script>

<script type="text/javascript"
         src="http://www.statcounter.com/counter/counter.js">
</script>
<noscript>
   <div class="statcounter">
     <a title="site stats"
         href="http://www.statcounter.com/"
       target="_blank">
     <img class="statcounter" 
            src="http://c.statcounter.com/4149040/0/1156951b/1/"
            alt="site stats" >
     </a>
   </div>
</noscript>
<!-- End of StatCounter Code -->
<?php } ?>
</body>
</html>