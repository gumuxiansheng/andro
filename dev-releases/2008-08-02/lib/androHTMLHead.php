<?php
$deprecated = configGet('deprecated','Y');
# =====================================================================
# 
# Output the title
#
# =====================================================================
echo "\n<title>".vgfGet('pageTitle')."</title>\n";

# =====================================================================
# 
# The jQuery libraries always come first
#
#  NOTICE!  Andromeda has its own mini-fication system, 
#           so do not fear all of these individual files!
#
# =====================================================================
# The jQuery library always comes first
jsInclude('clib/jquery-1.2.6.js','JQuery is distributed under the GPL
      license, written by a team of programmers led by John Resig,
      more info at http://www.jquery.com'
);

# EXPERIMENTAL: jquery ui full boat
#   This seems to be the annointed king of jQuery UI
#   facilities, so we may as well load the entire thing
#   and have it available for experiments
jsInclude('clib/jquery-ui-1.5.2.js');

# EXPERIMENTAL.  Added KFD 8/2/08 to scroll inside
#                of androSelect dropdown.
jsInclude('clib/jquery.scrollTo.js');

# JQUERY MODALS
# Status: must keep, at least one commercial customer
#         using it already.
jsInclude('clib/jqModal.js','jqModal was written by Brice Burgess
     and is distributed under the MIT license.  His website is
     http://dev.iceburg.net/jquery/jqModal/');
cssInclude('clib/jqModal.css');


# SCROLLING TO ANYWHERE ON SCREEN
# Scrolling - not used at the moment.  I put it in experimentally
#             for scrollable tables, but am not happy with those yet
#sInclude('clib/jquery.scrollTo.js');


# SCROLLABLE TABLES
# Status: unknown.  It's kind of ok, but it seems that it might
#         be simpler just to create table bodies with fixed 
#         heights and overflow: scroll
if(gpExists('x4Page')) {
    jsInclude('clib/webtoolkit.jscrollable.js','Scrollable table is
        available at www.webtoolkit.info');
    jsInclude('clib/webtoolkit.scrollabletable.js','Scrollable table is
        available at www.webtoolkit.info');
}

# Time Entry.  A very nifty plugin that makes time entry
#              inputs easy to work with
cssInclude('clib/jquery.timeentry.css');
jsInclude('clib/jquery.timeentry.js');
// Date entry with their over-engineered downloads

# Date Manipulation.  This is a combo data input system
#      and library for date manipulation.
jsInclude('clib/jquery.date_input.js');
cssInclude('clib/date_input.css');

# Jquery Tooltip
#  Don't need dimensions, we have jquery 1.2.6 now
#jsInclude("clib/jquery.dimensions.js");
jsInclude("clib/jquery.tooltip.js");
cssInclude("clib/jquery.tooltip.css");


# =====================================================================
#
# 
# The base and universal Andromeda files come second 
#
#
# =====================================================================
jsInclude('clib/androLib.js');
if($deprecated) {
    jsInclude('clib/androLibDeprecated.js');
}

// The x2 css file is loaded, unless there is an x4 page
if(gp('x4Page')=='' && gp('gp_page')<>'') {
    cssInclude('templates/'.$mainframe->getTemplate().'/css/x2.css');
}
// ..and this (misnamed) holds info for dynamic select
//cssInclude('clib/raxlib.css');

// DHTML Goodies calendar
if(vgfGet('suppress_goodies_calendar')!==true) { 
    cssInclude('clib/dhtmlgoodies_calendar.css');
    jsInclude('clib/dhtmlgoodies_calendar.js');
}

// Positioning styles
if(vgfGet('suppress_andromeda_css')!==true || vgfGet('x4')===true) {
    cssInclude("clib/andromeda.css");
}




# =====================================================================
#
# 
# Bringing up the rear are the x4 libraries 
#
#
# =====================================================================
if(gpExists('x4Page')) {
    jsInclude('clib/androX4.js');
}

# =====================================================================
#
# 
# Output styles and script that must go at top 
#
# DEPRECATED.  The suppressDeprecated will remove this  
#
# =====================================================================
if($deprecated=='Y') {
    $styles = ElementImplode('styles');
    if($styles<>'') {
        ?>
        <style type="text/css">
        <?=$styles?>
        </style>
        <?php
    }
    ob_start();
    ElementOut('script');
    $script = ob_get_clean();
    if($script<>'') {
        ?>
        <script language="javascript" type="text/javascript">
        /* Script generated specifically for a page */
        <?=ElementOut("script");?>
        </script>
        <?php
    }
}

# =====================================================================
#
# Thus it was written in the book of YSlow!
# Output your CSS in the header, so here it is
# Output your JS in the footer, so that is in androHTMLFoot.php 
#
#
# =====================================================================
cssOutput();
?>