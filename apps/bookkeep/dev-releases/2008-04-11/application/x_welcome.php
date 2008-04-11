<?php
class x_welcome extends x_table2 {
    function main() {
        if(gpExists('x4')) {
            return $this->x4Menu();
        }
        ?>
        <h1>Andromeda Demo Application</h1>
        
        <p>Hello and Welcome to the Andromeda Demonstration Program.
           This program was created on March 20, 2008, and will be
           improved from time to time to reflect features inside
           of Andromeda.
        </p>
        
        <p>Our main documentation site is: <a href=
           "http://www.andromeda-project.org">The Andromeda Project</a>.
           
        <h2>Extended Desktop Mode</h2>
        
        <p>All of Ken's development time is now going into the extended
           desktop mode, which gives users a highly snappy, keyboard-responsive
           experience.</p>
           
        <p>           
        <a href="?gp_page=androX4Menu">Click Here For Extended Desktop</a>
        </p>
           
        <h2>Source Code For This Application</h2>
        
        <p>This program has 5 files in it.  They are:</p>
        
        <ul>
            <li><a href="?gp_page=x_welcome&source=x_welcome">x_welcome.php</a>
            <li><a href="?gp_page=x_welcome&source=applib">applib.php</a>
            <li><a href="?gp_page=x_welcome&source=bookkeep">bookkeep.dd.yaml</a>
            <li><a href="?gp_page=x_welcome&source=ex_customers">ex_customers.page.yaml</a>
            <li><a href="?gp_page=x_welcome&source=ex_salestax">ex_salestax.page.yaml</a>
        </ul>
            
        <?php
        if(gp('source')<>'') {
            // Form a sanitized file that is safe for readfile.  If
            // it is not safe, quietly exit.
            $alist = explode(".",gp('source'));
            if(count($alist)>1) return;
            $file = fsDirTop()."/application/".$alist[0].".html";
            $files=array(
                'x_welcome'=>'x_welcome.php'
                ,'applib'=>'applib.php'
                ,'bookkeep'=>'bookeep.dd.yaml'
                ,'ex_customers'=>'ex_customers.page.yaml'
                ,'ex_salestax'=>'ex_salestax.page.yaml'
            );
            ?>
            <h2>File: <?=$files[gp('source')]?></h2>
            <div style="margin: 5px; border:2px solid gray; padding: 5px">
            <?php readfile($file) ?>
            </div>
            <?php
        }
        
    }
}
?>
