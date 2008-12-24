<?php
$MPPages = array(
    'artview'=>0
    ,'cms'=>0
    ,'search'=>0
    ,'example'=>1
);

$html = array();



# ========================================================================
# Conventional Andromeda Routines
# ========================================================================
function appNoPage() {
    if(gp('gp0')<>'') return 'pageview';
    
    if(gp('txtsearch')<>'') return 'search';
    
    if(loggedIn()) 
        return 'x_welcome';
    else {
        global $html;
        $html['user7'] = getUser7();
        $html['user8'] = getUser8();
        $html['user1'] = getUser1();
        $html['user2'] = getUser2();
        return "artview";
    }
}


function app_template() {
    return "rt_versatility_iii";
}

function baseUrl() {
    return configGet('paypal_site_url');    
}

// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// The hard-coded menu across top
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// Which modules we will skip
$skip=array('debug','top','banner'
    ,'advert1','advert2'
    ,'right'
    ,'user3','user4','user5','user6'
);


function mosShowListMenu($parm) {
    ?>
<ul class="nav">
<li><a href="<?=baseUrl()?>index.php">Home</a>
<li><?=makeLink("Documentation",'toc-robophp.html')?>
<li><?=makeLink("Downloads")?>
<li><?=makeLink("Credits")?>
<li><?=makeLink("Contact")?>
</ul>
    <?php
}

function getUser1() {
    ob_start();
    ?>
    <div class="moduletable">
    <h3>Andromeda</h3>

    <p>
    Andromeda is a <i>programmer productivity tool</i> that offers two
    major families of features you will not find elsewhere.  The first is
    our extremely powerful data dictionary, which lets you put formulas 
    directly into your database definition, avoiding huge amounts of code.
    The second is our "free" admin screens, which provide very powerful
    data maintenance screens for all of your database tables.
    </p>
    <p>
    Andromeda dramatically reduces the labor involved in any
    database project that has
    non-trivial business rules.
    </p>

    <a class="readon" href="pages/cms/Short+Description+of+Andromeda">more...</a>
    </div>
    <?php				    
    return ob_get_clean();
}

function getUser2() {
    ob_start();
    ?>
    <div class="moduletable">
    <h3>Countdown to Release 1</h3>
    
    <p>As of December 2008 Andromeda's core feature set is now complete.
       All attention is now focused on the demo, the documentation, and
       making easy installation files for Windows, Mac, and Linux.
    					    <?php				    
    return ob_get_clean();
}


function getUser7() {
    ob_start();
    ?>
    <div class="moduletable">
    <h3>Meet The Developers</h3>
    
    <p>Andromeda was created and written by <a href="mailto:ken@secdat.com"
       >Kenneth Downs</a>, his blog is 
       <a target="_blank" href="http://database-programmer.blogspot.com"
       >The Database Programmer.</a>
    </p>
    <p><a href="mailto:dorgan@donaldorgan.com">Donald J. Organ IV</a>
       became our first code contributor in mid 2007 and has a growing
       list of contributions over the entire code base.  His blog
       is <a target="_blank" href="http://blog.donaldorgan.com">The PHP Guy</a>.
    </p>
    <p><a href="mailto:zippy1981@gmail.com">Justin Dearing</a> and 
       <a href="mailto:aames@centralsemi.com">Alex Ames</a>
       are working on Windows IE compatibility and release packages
       respectively.
    </p>
    </div>
    <?php
    return ob_get_clean();
}

function getUser8() {
    ob_start();
    ?>
    <div class="moduletable">
    <h3>Creative Talent Needed</h3>
    
    <p>Andromeda needs the assistance of a talented
    visual designer to help out in two broad areas:
    
    <ul><li>Handle all visual design of our new 
            "desktop-in-the-browser" interface.
        <li>General assistance with graphics for
            this website.
    </ul>
    
    <p><?=MakeLink('Contact')?> us to find out more.</p> 
        
    </div>
    <?php
    return ob_get_clean();
}
function appCountModules($module) {
    global $skip;
    if(in_array(trim($module),$skip)) return false;
    
    global $html;
    return isset($html[$module]);
}

function appLoadModules($module,$unknown) {
    global $skip;
    if(in_array(trim($module),$skip)) return false;

    global $html;
    if(isset($html[$module])) {
        echo $html[$module];
    }

}


// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
function MakeLink($page,$link='') {
    $base=baseUrl();
    if($link=='') {
        $link = $base.'pages/cms/'.strtolower($page);
    }
    else {
        $link = $base.'pages/cms/'.strtolower($link);
    }
    if(substr($link,-5)<>'.html') $link.='.html';
    return "<a href=\"$link\">$page</a>";
}

?>
