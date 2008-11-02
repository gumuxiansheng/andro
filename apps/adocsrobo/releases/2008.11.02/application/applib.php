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
    Andromeda is a completely new way to do database application programming.
    Andromeda is radically data oriented, allow you to specify all of your business logic in 
    a single text file, which Andromeda uses to build most of what you need for a working
    system.  
    </p>
    
    <p>
    Andromeda dramatically reduces the labor involved in any database project that has
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

    <p>As of late summer 2007 Andromeda had all of its major elements
        coded at least in alpha form. Some are in beta, and others are 
        production ready.
    </p><p>When all of the main feature areas are production ready we
        can say that we have Release one.  The details are at
        <a href="http://www.andromeda-project.org/pages/cms/Countdown+to+Release+1.html">Countdown to Release 1</a>.
    </p></div>
    					    <?php				    
    return ob_get_clean();
}


function getUser7() {
    ob_start();
    ?>
    <div class="moduletable">
    <h3>Countdown to Release 1</h3>
    
    <p>As of late summer 2007 Andromeda had all of its major elements
       coded at least in alpha form. Some are in beta, and others are 
       production ready.
    <p>When all of the main feature areas are production ready we
       can say that we have Release one.  The details are at
       <?=MakeLink("Countdown to Release 1")?>.
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
