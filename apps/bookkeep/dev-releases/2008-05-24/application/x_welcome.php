<?php
class x_welcome extends x_table2 {
    function main() {
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
        <a href="?x4Page=menu">Click Here For Extended Desktop</a>
        </p>
           
        <h2>Source Code For This Application</h2>
        
        <p>This program has 10 files in it.  They are:</p>
        
        <ul>
            <li><a href="?gp_page=x_welcome&source=bookkeep">bookkeep.dd.yaml (The Data Definition)</a>
            <li><a href="?gp_page=x_welcome&source=x_welcome">x_welcome.php (This program)</a>
            <li><a href="?gp_page=x_welcome&source=applib">applib.php (Application library)</a>
            <li><a href="?gp_page=x_welcome&source=billproc">billproc.php (Generate Invoices)</a>
            <li><a href="?gp_page=x_welcome&source=orders">orders.php (Overrides default)</a>
            <li><a href="?gp_page=x_welcome&source=p_orders">p_orders.php (Prints Orders)</a>
            <li><a href="?gp_page=x_welcome&source=billproc_openl">billproc_openl.page.yaml</a>
            <li><a href="?gp_page=x_welcome&source=billproc_opens">billproc_opens.page.yaml</a>
            <li><a href="?gp_page=x_welcome&source=ex_customers">ex_customers.page.yaml</a>
            <li><a href="?gp_page=x_welcome&source=ex_custvend">ex_custvend.page.yaml</a>
            <li><a href="?gp_page=x_welcome&source=ex_salestax">ex_salestax.page.yaml</a>
        </ul>
            
        <?php
        if(gp('source')<>'') {
            // Form a sanitized file that is safe for readfile.  If
            // it is not safe, quietly exit.
            $alist = explode(".",gp('source'));
            if(count($alist)>1) return;
            $file = fsDirTop()."/application/".$alist[0].".html";
            if(!file_exists($file)) return;
            $files=array(
                'bookkeep'=>'bookeep.dd.yaml'
                ,'x_welcome'=>'x_welcome.php'
                ,'applib'=>'applib.php'
                ,'billproc'=>'applib.php'
                ,'orders'=>'applib.php'
                ,'p_orders'=>'p_orders.php'
                ,'billproc_openl'=>'billproc_openl.page.yaml'
                ,'billproc_opens'=>'billproc_opens.page.yaml'
                ,'ex_customers'=>'ex_customers.page.yaml'
                ,'ex_custvend'=>'ex_custvend.page.yaml'
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
