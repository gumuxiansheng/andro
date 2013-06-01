<?php
class x6load1st extends androX6 {
    function x6main() {
        echo "Don't use this again, we're done with it";
        return;
        if(gp('process',false) && inGroup('admin')) {
            return $this->mainProcess();
        }
        ?>
        <h2>Pull Files From Robodoc</h2>
        <a target="_blank" 
             href="?x6page=load1st&process=1">Process Now</a>
        <?php
    }
    
    function mainProcess() {
            $string = "a walk in the park, a talk in the dark";
            $match  = "/(\b)a(\b)/";
            $answer = preg_split($match,$string);
            foreach($answer as $idx=>$value) {
                $answer[$idx] = '*'.$value.'*';
            }
            print_r($answer);
            echo implode("---X---",$answer);
            exit;


        $dir = realpath(fsDirTop().'../adocsrobo/application/').'/';
        $diri= $dir.'byhand/';
        $diro= fsDirTop().'application/byhand/';
        
        # First include the toc, then reverse it
        include($dir.'rpTop.php');
        foreach($this->rpTop as $idx=>$topic) {
            $idx+=100;
            $this->doOne($diri,$diro,'',$idx,$topic);
        }

        include($dir.'rpToc.php');
        foreach($this->rpToc as $parent=>$children) {
            foreach($children as $sequence=>$child) {
                $this->doOne($diri,$diro,$parent,$sequence,$child);
            }            
        }


        exit;
    }
    
    function doOne($diri,$diro,$parent,$sequence,$child) {
        $sequence*=100;
        $name = makeFileStem($child).'.html';
        if(!file_exists($diri.$name)) {
            x_echoflush("<b>Could not find: $diri$name</b>");
        }
        else {
            x_EchoFlush("Found: $diri$name");
            $fc = file_get_contents($diri.$name);
            $lines = explode("\n",$fc);
            $h1 = array_shift($lines);
            $h1 = str_replace('<h1>' ,'',$h1);
            $h1 = str_replace('</h1>','',$h1);
            
            $outfc =  
                "title:$h1"
                ."\nparent:$parent"
                ."\nsequence:$sequence"
                ."\naliases:"
                ."\ngeshi:N"
                ."\n\n"
                .implode("\n",$lines);
            
            file_put_contents($diro.$name,$outfc);
        }
    }        
}
?>
