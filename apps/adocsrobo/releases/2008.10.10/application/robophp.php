<?php
class robophp extends x_table2 {
    function custom_construct() {
        if(gp('gp_posted')=='1') $this->flag_buffer=false;
    }

    function main() {
        if(gp('gp_posted')==1) return $this->mainProcess();
        
        ?>
        <h1>Documentation Generation</h1>
        <p><a href="javascript:Popup('?gp_page=robophp&gp_posted=1')">
           You Know What Happens if You Click Me</a>
        </p>
        <?php
    }
    
    function mainProcess() {
        ob_start();
        # Hardcoded values, used throughout
        $dirin  = realpath(fsDirTop()).'/';
        $dirout = $dirin.'files/';
        $dirbyh = $dirin."application/byhand/";
        
        # - - - - - - - - - - - - - - - - - - - - - - 
        #
        #  PRE-PROCESSING 1: Copyright
        #
        #  - - - - - - - - - - - - - - - - - - - - - -
        x_echoFlush("<br/><br/>RoboPHP.php, (C) 2008 by Kenneth Downs, ken@secdat.com");
        x_echoFlush("<br/>Distributed under the GPL, Version 2.0 or later");
        x_echoFlush("<br/>");
        # - - - - - - - - - - - - - - - - - - - - - - 
        #
        #  PRE-PROCESSING 2: Get Parameters
        #   
        #  No more, these are hardcoded in the app
        #
        #  - - - - - - - - - - - - - - - - - - - - - -
        /*
        if($argc!=3) {
            x_echoFlush("<br/><br/>robophp.php USAGE:");
            x_echoFlush("<br/><br/>$ php robophp.php <input directory> <output directory>");
            x_echoFlush("<br/><br/>");
            return;
        }
        $dirin = realpath($argv[1]);
        $dirout= realpath($argv[2]);
        if(!is_dir($dirin)) {
            $this->addError("Input directory not found: $dirin");
        }
        if(!is_dir($dirout)) {
            $this->addError("Output directory not found: $dirout");
        }
        if($this->reportErrors()) exit;
        
        if(substr($dirin,-1) <>'/') $dirin .='/';
        if(substr($dirout,-1)<>'/') $dirout.='/';
        x_echoFlush("<br/>Input Directory: $dirin");
        x_echoFlush("<br/>Output Directory: $dirout");
        */
        
        # - - - - - - - - - - - - - - - - - - - - - - 
        #
        #  PRE-PROCESSING 3: Read config file
        #
        #  - - - - - - - - - - - - - - - - - - - - - -
        $this->rpParms = array(
            'dirs'=>array()
            ,'extensions'=>array()
            ,'replacements'=>array()
            ,'import'=>array()
        );
        $configFile = fsDirTop().'application/robophp.cfg';
        $configlines = explode("\n",file_get_contents($configFile));
        $current = '';
        foreach($configlines as $linenum=>$configline) {
            if(strlen(trim($configline))==0)       continue;
            if(substr(trim($configline),0,1)=='#') continue;
            if(substr($configline,0,1)<>' ') {
                $new = trim($configline);
                if(isset($this->rpParms[$new])) {
                    $current = $new;
                }
                else {
                    $this->addError("Bad configuration value $new at line $linenum,
                        <br/>allowed values are dirs, extensions, import, replacements"
                    );
                }
            }
            else {
                if($current == '') {
                    $this->addError("Data value $configline found at line $linenum,
                        <br/>without a preceeding block definition.  You must
                        <br/>first put a value of dirs, extensions, import,
                        <br/>or replacements."
                    );
                }
                else {
                    $this->rpParms[$current][] = trim($configline);
                }
            }
        }
        x_echoFlush("<br/><br/>Dump of configuration:<br/>");
        hprint_r($this->rpParms);
        x_echoFlush("<br/>");
        
        
        #
        #  Complete details of each page
        #
        #  rpPages = array(
        #     [$name] = array(    // $name is of form Parent/Child
        #        'file' = 'xxxx'
        #       ,'line' = 'xxxx'
        #       ,'text' = 'xxxx'  // raw text from comment block, including asterisks
        #       ,'parent'= 'xxxx'
        #       ,'prev' = 'xxxx'
        #       ,'next' = 'xxxx'
        #       ,'name' = 'xxxx'   // the "child" part of $name index above
        #       ,'imported'=true/false
        #     )
        #   )
        #
        $this->rpPages  = array();  // complete details each page, except html
        $rpHtml   = array();  // here is the html
        $this->rpFiles  = array();  // stats on files. keys: lines, blanks, comments, kids
         
        # List of items
        $this->rpItems = array(
            'NAME'
            ,'FUNCTION'
            ,'SYNOPSIS'
            ,'INPUTS'
            ,'OUTPUTS'
            ,'RESULT'
            ,'RESULTS'
            ,'RETURN'
            ,'RETURNS'
            ,'SIDE EFFECTS'
            ,'HISTORY'
            ,'BUGS'
            ,'EXAMPLE'
            ,'SOURCE'
            ,'SEE ALSO'
            ,'PORTABILITY'
            ,'NOTES'
        );
        
        #
        #  Errors.  This is a simple numeric-indexed
        #           list of messages
        #
        $rpErrors = array();
        
        # - - - - - - - - - - - - - - - - - - - - - - 
        # Step 1, begin in source directory and scan
        #         the list of directories from the
        #         configuration file
        # - - - - - - - - - - - - - - - - - - - - - -
        x_echoFlush("<br/><br/>Step 1: Scanning Directories and Files");
        foreach($this->rpParms['dirs'] as $dir) {
            `rm $dirin.$dir/js-min*.js`;
            $this->recurseDir(fsDirTop().$dir.'/',$dirin,0);
        }
        if($this->reportErrors()) exit;
        
        x_EchoFlush("Here are the files we found doc blocks in");
        hprint_r($this->rpFilesBlocks);

        
        # - - - - - - - - - - - - - - - - - - - - - - 
        #
        # Step 2, generate hierarchy and index
        #
        # rpToc lists children for any topic that has them:
        # rpToc = array( 'parent'=>array('child1','child2'), 'par2...
        #
        # rpTop is simple list of top-level topics
        # rpTop = array( 'parent','par2','par3')
        #
        # - - - - - - - - - - - - - - - - - - - - - -
        $this->rpToc    = array();
        $this->rpTop    = array();
        $this->rpTopics = array();
        $this->rpParents= array();
        x_echoFlush("<br/><br/>Step 2: Generating TOC."); 
        foreach($this->rpPages as $name=>$info) {
            $parent = $info['parent'];
            $child  = $info['name'];
            
            if($parent=='') {
                $this->rpTop[] = $child;
            }
            else {
                $this->rpToc[$parent][] = $child;
            }
            
            $this->rpParents[$child] = $parent;
            $this->rpTopics[$child][] = $parent;
        }
        if($this->reportErrors()) exit;
        
        # - - - - - - - - - - - - - - - - - - - - - - 
        #
        # Step 2.5 (2 and 1/2) Import a TOC if exists
        #
        # - - - - - - - - - - - - - - - - - - - - - -
        if(true) {
        #if($this->rpParms['import'][0]<>'') {
            $dir = $dirin.$this->rpParms['import'][0];
            $diri= $this->rpParms['import'][0];
            if(substr($dir,-1) <>'/') $dir.='/';
            if(substr($diri,-1)<>'/') $diri.='/';
            x_echoFlush("<br/>Examining Import directory $dir");
            
            # If a file is found named rpTop.php, it should 
            # completely redefine the rpTop array, with a
            # simple assignment, like:
            #
            # $this->rpTop = array('item','item','item);
            #
            # Naturally the file must include all of the
            # top-level topics discovered in the Robodoc blocks,
            # or they will not be in the table of contents
            $filename=fsDirTop().'application/rpTop.php';
            if(file_exists($filename)) {
                x_echoFlush("<br/>Importing Replacement Top-level topics from");
                x_echoFlush("<br/>$filename");
                include($filename);
                
                # now put each one into the rpPages file that
                # is not already there
                foreach($this->rpTop as $topTopic) {
                    $name = '/'.$topTopic;
                    if(!isset($this->rpPages[$name])) {
                        $this->addPage($name,0,$diri.$topTopic.'.html',array());
                        $this->rpParents[$topTopic] = '';
                        $this->rpTopics[$topTopic][] = '';
                    }
                }
            }
            
            # If a file is found named rpToc.php, it should
            # contain *additions* to the rpToc array, such as:
            #
            # $this->rpToc['topic'] = array(
            #   'subtopic','subtopic'
            # );
            # $this->rpToc['othertopic'] = array(
            #   'subtopic','subtopic'
            # );
            $filename=fsDirTop().'application/rpToc.php';
            if(file_exists($filename)) {
                x_echoFlush("<br/>Making additions to toc found in");
                x_echoFlush("<br/>$filename");
                include($filename);
                
                # now put each one into rpPages so it can be
                # handled normally, with things like prev/next
                # and so forth
                foreach($this->rpToc as $parent=>$kids) {
                    foreach($kids as $kid) {
                        $name = $parent.'/'.$kid;
                        if(!isset($this->rpPages[$name])) {
                            $this->addPage($name,0,$dir.'rpToc.php',array());
                            $this->rpParents[$kid] = $parent;
                            $this->rpTopics[$kid][] = $parent;
                            $this->rpPages[$name]['lines']    = 0;
                            $this->rpPages[$name]['blanks']   = 0;
                            $this->rpPages[$name]['comments'] = 0;
                        }
                    }
                }
            }
        }
        
        x_echoFlush("Here are the top-level definitions");
        hprint_r($this->rpTop);
        
        # - - - - - - - - - - - - - - - - - - - - - - 
        #
        # Step 3, generate prev/next information
        #
        # - - - - - - - - - - - - - - - - - - - - - -
        x_echoFlush("<br/><br/>Step 3: Generating prev/next.");
        foreach($this->rpPages as $name=>$info) {
            # get the parent and the topic out of the name
            list($parent,$topic) = explode("/",$name);
            
            # get the array of siblings.  See the step 
            # above for details on the two arrays we might pick
            $siblings = $parent=='' ? $this->rpTop : $this->rpToc[$parent];
        
            /*
            if(!isset($siblings[1])) {
                hprint_r($name);
                hprint_r($parent);
                hprint_r($this->rpTop);
                hprint_r($this->rpToc[$parent]);
                hprint_r($info);
                exit;
            }
            */
            
            # get the index of this item, which we will use to 
            # work out the prev/next using basic array functions
            $index = array_search($topic,$siblings);
            if($index==0) {
                $this->rpPages[$name]['prev'] = '';
                $this->rpPages[$name]['next'] = a($siblings,1);
            }
            elseif($index==count($siblings)-1) {
                $this->rpPages[$name]['prev'] = a($siblings,$index-1);  '';
                $this->rpPages[$name]['next'] = '';
            }
            else {
                $this->rpPages[$name]['prev'] = a($siblings,$index-1);
                $this->rpPages[$name]['next'] = a($siblings,$index+1);
            }
        }
        
        # - - - - - - - - - - - - - - - - - - - - - - 
        #
        # Step 4, Convert all recognized topic names
        #         into hyperlinks
        #
        #         This is tricky.  We continually 
        #         split the text up into a bunch of little
        #         pieces and then rebuild it by putting
        #         the links back in at each split
        #
        #  The structure we are building looks like:
        #
        #  $starter = array(
        #      'link' => ''
        #      'kids' => array(
        #          [0] = 'text text text '
        #          [1] = array(
        #               'link' => '<a href='pageName.html>pageName</a>
        #               'kids' => array(
        #                    [0] => 'text'
        #                    [1] => 'text'
        #          [2] = 'text'
        #       )
        #   )
        #
        #  ...so any child item might be text or might
        #     be an array of split up text
        # 
        #
        # This bit of test code shows how we use regular
        # expressions to trap recognized names and 
        # split them up much later down.  Unrem it to
        # test how they work.
        #
        # This test code shows the regular expression
        /*
        $string = "a walk in the park, a talk in the dark";
        $match  = "/(\b)a(\b)/";
        $answer = preg_split($match,$string);
        foreach($answer as $idx=>$value) {
            $answer[$idx] = '*'.$value.'*';
        }
        print_r($answer);
        echo implode("---X---",$answer);
        exit;
        */
        #
        #
        # - - - - - - - - - - - - - - - - - - - - - -
        x_echoFlush("<br/><br/>Step 4: Converting recognized topic names into links");
        foreach($this->rpPages as $name=>$info) {
            $starter = array('link'=>'','kids'=>$info['text']);
            
            foreach($this->rpTopics as $topic=>$x) {
                $bold = $topic==$info['name'];
                $this->recurseHtmlSplit($starter,$topic,$bold);
            }
            $this->rpPages[$name]['text2'] = $this->recurseHtmlJoin($starter);
        }
        
        # - - - - - - - - - - - - - - - - - - - - - - 
        #
        # Step 5, Process the "blocks" in the files and
        #         generate the base html.  Going into
        #         this routine we are dealing with 
        #         line-by-line arrays that still begin
        #         with asterisks.  They have had topics
        #         converted to links, but that's it.
        #
        #         The output from here will be a single
        #         block of html with <h2>, and <pre> and
        #         all of that stuff.
        # - - - - - - - - - - - - - - - - - - - - - - 
        x_echoFlush("<br/><br/>Step 5: Processing Blocks for pre, ul, etc.");
        foreach($this->rpPages as $page=>$info) {
            $rpHtml[$page] = $this->makeHTML($info['text2']);
            
            # Correct PHP and <SCRIPT> tags, and lose old-style [[ ]] stuff
            $search = array('<?'   ,'?>'   ,'<script>'      ,'</script>'   ,'[[',']]');
            $replace= array('&lt;?','?&gt;','&lt;script&gt;','&lt;/script&gt;');
            $rpHtml[$page] = str_replace($search,$replace,$rpHtml[$page]);
            
            # now do replacements
            foreach($this->rpParms['replacements'] as $replacement) {
                if(strpos($replacement,"\t")==false) {
                    $this->addError("Cannot process replacement request<br/>"
                        .$replacement."<br/>"
                        ."there is no TAB in the line"
                    );
                }
                else {
                    list($search,$replace) = explode("\t",$replacement);
                    $rpHtml[$page] = eregi_replace($search,$replace,$rpHtml[$page]);
                }
            }
            if($this->reportErrors()) exit;
        }
        
        # - - - - - - - - - - - - - - - - - - - - - - 
        #
        # Step 6, Writing out final HTML files
        #
        # - - - - - - - - - - - - - - - - - - - - - -
        x_echoFlush("<br/><br/>Step 6: Writing html");
        if(!isset($this->rpParms['import'][0])) {
            $diri=false;
        }
        else {
            $diri = $this->rpParms['import'][0];
            if(substr($diri,-1)<>'/') $diri.='/';
        }
        foreach($this->rpPages as $page=>$info) {
            $topic = $info['name'];
            
            $errors=false;
            if($info['parent']<>'') {
                if(!isset($this->rpTopics[$info['parent']])) {
                    echo "<br><br>ERROR<br>";
                    x_EchoFlush("Topic $topic, bad parent: {$info['parent']}");
                    hprint_r($info);
                    $errors=true;
                }
            }
            if($errors) {
                x_echoFlush("failed");
                exit;
            }
            
            # Get the prev/next stuff
            $prev  = $info['prev'];
            $hprev = $prev == '' ? '' : $this->makeLink($prev,$info['parent']);
            $next  = $info['next'];
            $hnext = $next == '' ? '' : $this->makeLink($next,$info['parent']);
            
            # Get the prev/next stuff for the parent
            $parent = $pprev = $pnext = '';
            if(trim($info['parent'])<>'') {
                $parent =  $this->makeLink($info['parent']);
                $p1 = $this->rpParents[$info['parent']];
                $pinfo = $this->rpPages["$p1/{$info['parent']}"];
                #x_echoFlush("<br/>For $topic using parent $p1/{$info['parent']}");
                $prev  = $pinfo['prev'];
                $pprev = $prev== '' ? '' : $this->makeLink($prev);
                $next  = $pinfo['next'];
                $pnext = $next == '' ? '' : $this->makeLink($next);
            }
            
            $aname = $info['parent'].'/'.$topic;
            
            # Make a prev/next block that is repeated at top and bottom
            ob_start();
            ?>
            <div style="text-align: center">
               <a href="toc-robophp.html#<?=$aname?>">Contents</a>
               &nbsp;&nbsp; - &nbsp;&nbsp;
               <a href="index-robophp.html#<?=$aname?>">Index</a>
               &nbsp;&nbsp; - &nbsp;&nbsp;
               <a href="files-robophp.html#<?=$aname?>">Files</a>
            </div>
            <table style="width: 100%">
              <tr>
              <td style="text-align: left;  width:33%"><?=$pprev?></td>
              <td style="text-align: center;width:33%"><?=$parent?></td>
              <td style="text-align: right; width:33%"><?=$pnext?></td>
            </table>
            <table style="width: 100%">
              <tr>
              <td style="text-align: left;  width:33%"><?=$hprev?></td>
              <td style="text-align: center;width:33%"></td>
              <td style="text-align: right; width:33%"><?=$hnext?></td>
            </table>
            <br/>In File: <a href="<?=str_replace("/","-",$info['file'])?>.html"
                ><?=$info['file']?></a>
            
            <?php
            $prevnext = ob_get_clean();
            
            # If there are children, list them
            $kids = '';
            if(isset($this->rpToc[$topic])) {
                $kids = '<h3>Child Topics:</h3>';
                $akids = array();
                foreach($this->rpToc[$topic] as $kid) {
                    $akids[] = $this->makeLink($kid,$topic,false);
                }
                $kids.=implode(', ',$akids)."<hr/>";
            }
            
            # If the entry has no text, and there is a file by the
            # correct name, load that up instead
            if($rpHtml[$page]=='') {
                $filename = str_replace(" ",'',$topic);
                $filename = strtolower($filename);
                $filename.='.html';
                if(!$diri) {
                    $rpHtml[$page] = 'No text was made for this entry,
                        and no import directory was specified';
                }
                elseif(!file_exists($dirin.$diri.$filename)) {
                    $rpHtml[$page] = "No text was made for this entry,
                        and the file $filename was not present in 
                        the import directory $diri";
                }
                else {
                    x_echoFlush("<br/>Importing file $filename");
                    $text = file_get_contents($dirin.$diri.$filename);
                    $text = preg_replace("!\<h1\>.*\<\/h1\>!","",$text);
                    $rpHtml[$page] = $text;
                }
            }
            

            # Convert images
            $imgxvrt = $rpHtml[$page];
            $imgxvrt = preg_replace(
                '/\[\[image:(.*)\]\]/u'
                ,'<img src="'.baseUrl().'appclib/$1" />'
                ,$imgxvrt
            );
            $rpHtml[$page] = $imgxvrt;
            
            
            # Assemble the final page.
            ob_start();
            ?>
            <h1><?=$topic?></h1>
            <hr/>
            <?=$prevnext?>
            <hr/>
            <?=$rpHtml[$page]?>
            <hr/>
            <?=$prevnext?>
            <hr/>
            <?=$kids?>
            Generated by robophp.php on <?=date('r',time())?>
            <?php
            $final = ob_get_clean();
        
            # Decide if it needs to be disambiguated, and
            # write it out
            $filename = count($this->rpTopics[$topic])>1
                ? $info['parent'].'--'.$topic.'.html'
                : $topic.'.html';
            $filename=strtolower($filename);
            $filename=str_replace(' ','',$filename);
            file_put_contents($dirout.$filename,$final);
            
            # Make a disambiguation page if required
            if(count($this->rpTopics[$topic])>1) {
                x_echoFlush("<br/>Disambiguating $topic");
                ob_start();
                ?>
                <h1><?=$topic?>: Disambiguation</h1>
                <p>This link name matches to multiple topics.</p>
                <?php
                foreach($this->rpTopics[$topic] as $parent) {
                    echo $this->makeLink($topic,$parent);
                    echo "<br/><br/>";
                }
                $filecontents = ob_get_clean();
                $filename=strtolower($dirout.$topic.'.html');
                $filename=str_replace(' ','',$filename);
                file_put_contents($filename,$filecontents);
            }
        }
        
        
        # - - - - - - - - - - - - - - - - - - - - - - 
        #
        # Step 7, Writing out the Table of Contents
        #
        # - - - - - - - - - - - - - - - - - - - - - -
        $fileout = $dirout.'toc-robophp.html';
        x_echoFlush("<br/><br/>Writing Table of Contents");
        x_EchoFlush($fileout);
        $toc = '<h1>Table of Contents</h1>';
        $toc.="<a href='index-robophp.html'>Index</a><br/><br/>";
        $toc.="<a href='files-robophp.html'>Files</a><br/><br/>";
        foreach($this->rpTop as $topic) {
            $toc.="<a name='/$topic'>";
            $toc.=$this->makeLink($topic)."<br/>";
            $toc.="</a>";
            $toc.=$this->recurseToc($topic,3);
        }
        file_put_contents($fileout,$toc);
        
        # - - - - - - - - - - - - - - - - - - - - - - 
        #
        # Step 8, Writing out the Index
        #
        # - - - - - - - - - - - - - - - - - - - - - -
        x_echoFlush("<br/><br/>Writing Index");
        $index = '<h1>Index</h1>';
        $index.="<a href='toc-robophp.html'>Contents</a><br/><br/>";
        $index.="<a href='files-robophp.html'>Files</a><br/><br/>";
        $keys  = array_keys($this->rpTopics);
        asort($keys);
        foreach($keys as $key) {
            if(count($this->rpTopics[$key])==1) {
                $index.="<a name='{$this->rpTopics[$key][0]}/$key'>";
                $index.=$this->makeLink($key)."<br/>";
                $index.="</a>";
            }
            else {
                foreach($this->rpTopics[$key] as $parent) {
                    $index.=$this->makeLink($key,$parent,false);
                    $index.=" (child of $parent) <br/>";
                }
            }
        }
        file_put_contents($dirout.'index-robophp.html',$index);
        
        
        # - - - - - - - - - - - - - - - - - - - - - - 
        #
        # Step 9, Writing out the List of Files
        #
        # - - - - - - - - - - - - - - - - - - - - - -
        x_echoFlush("<br/><br/>Writing Out List of Files");
        $index = '<h1>Files</h1>';
        $index.="<a href='toc-robophp.html'>Contents</a><br/><br/>";
        $index.="<a href='index-robophp.html'>Index</a><br/><br/>";
        
        $lcount = 0;
        $lblanks= 0;
        $lcomments=0;
        foreach($this->rpFiles as $filename=>$info) {
            $lcount+=a($info,'lines',0);
            $lblanks+=a($info,'blanks',0);
            $lcomments+=a($info,'comments',0);   
        }
        ob_start();
        ?>
        <style>
        table.files { border-spacing: 0px; border-collapse: collapse; }
        table.files td { border: 1px solid black; text-align: right; padding: 3px; }
        </style>
        <table class="files">
          <tr>
            <td>Count of Files
            <td>Gross Line Count
            <td>Blank Lines
            <td>Comment Lines
            <td>Lines of Code
            <td>RoboDoc Blocks
          <tr>
            <td><?=count($this->rpFiles)?>
            <td><?=number_format($lcount,0)?>
            <td><?=number_format($lblanks,0)?>
            <td><?=number_format($lcomments,0)?>
            <td><?=number_format($lcount-($lblanks+$lcomments),0)?>
            <td><?=number_format(count($this->rpPages),0)?>
        </table>
        <br/><br/>
        <table class="files">
          <tr>
            <td>File
            <td>Gross Line Count
            <td>Blank Lines
            <td>Comment Lines
            <td>Lines of Code
            <td>RoboDoc Blocks
          <tr>
          <?php foreach($this->rpFiles as $file=>$info) { ?>
              <tr>
              <td>
              <?php
              if(count($info['kids'])==0) 
                  echo $file;
              else {
                  $filename = str_replace("/","-",$file);
                  echo "<a href='$filename.html'>$file</a>";
              }
              ?>
            <td><?=number_format($info['lines'],0)?>
            <td><?=number_format($info['blanks'],0)?>
            <td><?=number_format($info['comments'],0)?>
            <td><?=number_format($info['lines']-($info['blanks']+$info['comments']),0)?>
            <td><?=number_format(count($info['kids']),0)?>
          <?php } ?>
        <?php
        $index.=ob_get_clean();
        file_put_contents($dirout.'files-robophp.html',$index);
        
        # - - - - - - - - - - - - - - - - - - - - - - 
        #
        # Step 10, Writing out HTML for each file
        #
        # - - - - - - - - - - - - - - - - - - - - - -
        x_echoFlush("<br/><br/>Writing Out HTML for each file");
        foreach($this->rpFiles as $filename=>$info) {
            if(count($info['kids'])==0) continue;
            
            $index = '<h1>File: '.$filename.'</h1>';
            $index.="<a href='files-robophp.html'>Files</a><br/><br/>";
            $index.="<a href='toc-robophp.html'>Contents</a><br/><br/>";
            $index.="<a href='index-robophp.html'>Index</a><br/>";
            
            $info['lines'] = a($info,'lines',0);
            $info['blanks'] = a($info,'blanks',0);
            $info['comments'] = a($info,'comments',0);
        
            $index.="<br/><b>Line Count:</b> ".number_format($info['lines']);
            $index.="<br/><b>Blank Lines:</b> ".number_format($info['blanks']);
            $index.="<br/><b>Comments:</b> ".number_format($info['comments']);
            $index.="<br/><b>Program Lines:</b> ".number_format(
                $info['lines']-($info['blanks']+$info['comments'])
            );
            
            $index.="<br/><h3>Topics in this file:</h3>";
            
            $kids = $info['kids'];
            asort($kids);
            foreach($kids as $topic) {
                list($parent,$child) = explode('/',$topic);
                if(count($this->rpTopics[$child])==1) {
                    $index.=$this->makeLink($child)."<br/>";
                }
                else {
                    $index.=$this->makeLink($child,$parent)."<br/>";
                }
            }
            $filename = str_replace("/","-",$filename);
            file_put_contents($dirout.$filename.'.html',$index);
        }
        
        
        
        
        # - - - - - - - - - - - - - - - - - - - - - - 
        #
        # Step 11, Update list of known pages
        #
        # - - - - - - - - - - - - - - - - - - - - - -
        # get a new value of recnum for the pages, we 
        # will use this as a batch number.  Any row with
        # an earlier or different number will be deleted
        # when we are done.
        # 
        x_EchoFlush("");
        x_EchoFlush("Step 11: Loading page names to database");
        $newrn = SQL_oneValue('newrn',
            'select max(recnum) as newrn from pages'
        );
        $newrn++;
        $dd=ddTable('pages');
        foreach($this->rpPages as $page=>$info) {
            $row = array(
                'page'=>strtolower($info['name'])
                ,'recnum'=>$newrn
            );
            scDBUpdateOrInsert($dd,$row);
        }
        x_EchoFlush("Step 11.5: Purging database of unused page names");
        sql("delete from pages where recnum<> $newrn");
        

        x_echoFlush("<br/><br/>Finished!<br/><br/>");

    }
     
    # ----------------------------------------------------------
    #
    # MAJOR FUNCTION -1: Recurse Table of Contents
    #
    # ----------------------------------------------------------
    function recurseToc($topic,$indent) {
        if(!isset($this->rpToc[$topic])) return;
        
        $retval = '';
        foreach($this->rpToc[$topic] as $subtopic) {
            $retval.="<a name='$topic/$subtopic'>";
            $retval.=str_repeat('&nbsp;',$indent).$this->makeLink($subtopic,$topic);
            $retval.="</a>";
            $retval.="<br/>";
            $retval.=$this->recurseToc($subtopic,$indent+3);
        }
        return $retval;
    }
    # ----------------------------------------------------------
    #
    # MAJOR FUNCTIONs 0: Recurse HTML split and join
    #
    # ----------------------------------------------------------
    function recurseHtmlSplit(&$array,$topic,$bold) {
        foreach($array['kids'] as $index=>$sub) {
            if(is_array($sub)) {
                # If its an array, dive into it
                $this->recurseHtmlSplit($array['kids'][$index],$topic,$bold);
            }
            else {
                # If its a string, split it up and see what to do
                $x = preg_split('/\b'.$topic.'\b/',$sub);
                if(count($x)==1) {
                    # Do nothing, the string was not found
                }
                else {
                    $link = $bold 
                        ? "<b>$topic</b>"
                        : $this->makeLink($topic);   
                    $array['kids'][$index] = array('link'=>$link,'kids'=>$x);
                }
            }
        }        
    }
    function recurseHtmlJoin(&$array) {
        $retval = '';
        foreach($array['kids'] as $index=>$sub) {
            if(is_array($sub)) {
                $array['kids'][$index] = $this->recurseHTMLJoin($sub);
            }
        }
        if($array['link']=='') {
            return $array['kids'];
        }
        else {
            return implode($array['link'],$array['kids']);
        }
    }
    
    # ----------------------------------------------------------
    #
    # MAJOR FUNCTION 1: Recurse directories
    #
    # ----------------------------------------------------------
    function recurseDir($dir,$stem,$level) {
        $extensions = $this->rpParms['extensions'];
    
        x_echoFlush("<br/>Scanning $dir");
        $entries = scandir($dir);
        foreach($entries as $entry) {
            if(!in_array($this->extension($entry),$extensions)) continue;
            
            if(is_dir($dir.$entry)) {
                #recurseDir($dir.$entry.'/',$stem,$level+1);
            }
            else {
                $fileshort = substr($dir.$entry,strlen($stem));
                $this->scanFile($dir.$entry,$fileshort);
            }
        }
    }
    function extension($filename) {
        $segments = explode(".",$filename);
        return array_pop($segments);
    }
    
    # ----------------------------------------------------------
    #
    # MAJOR FUNCTION 2: Scan a File
    #
    # ----------------------------------------------------------
    function scanFile($file,$fileshort) {
        # Get file and get rid of all \r 
        $fc = file_get_contents($file);
        $fc = str_replace("\r","",$fc);
        
        # Split up into lines
        $fcl = explode("\n",$fc);
        #x_echoFlush("<br/>File $fileshort has ".count($fcl)." lines");
        
        # Initialize the current page name
        $current = '';
        $cline   = 0;
        $lines   = array();
        
        # Generate the line stats
        $fLinesCount   = count($fcl);
        $fLinesBlank   = 0;
        $fLinesComment = 0;
        foreach($fcl as $linenum=>$oneline) {
            $line = trim(str_replace("\t","",$oneline));
            if(substr($line,0,2)=='/*') $fLinesComment++;
            if(substr($line,0,2)=='*/') $fLinesComment++;
            if(substr($line,0,2)=='//') $fLinesComment++;
            if(substr($line,0,1)=='*')  $fLinesComment++;
            if(substr($line,0,1)=='#')  $fLinesComment++;
            
            if(strlen($line)==0) $fLinesBlank++;
        }
        $this->rpFiles[$fileshort] = array(
            'lines'=>$fLinesCount
            ,'blanks'=>$fLinesBlank
            ,'comments'=>$fLinesComment
            ,'kids'=>array()
        );
        
        # Scan the lines
        foreach($fcl as $linenum=>$oneline) {
            $regs = array();
            $oneline = $oneline;
            if(ereg('\/\*\*\*\*([^\*])\*\s*(.*)',$oneline,$regs)) {
                if($current<>'') {
                    $msg= "Found $current at line $cline of<br/>"
                        ."   $fileshort,<br/>"
                        ."   but could not find the end marker.";
                    $this->addError($msg);
                }
                #x_echoFlush("<br/>Found ".$regs[2]." at line $linenum of $fileshort");
                $current = trim($regs[2]);
                $cline   = $linenum;
                $lines   = array();
                $this->rpFilesBlocks[$file] = 0;
            }
            elseif(ereg('\*\*\*\*\*\*',$oneline)) {
                if($current=='') {
                    # No action on stray end markers, could be long
                    # lines of asterisks in comment blocks
                }
                else {
                    $this->addPage($current,$cline,$fileshort,$lines);
                    $current = '';
                    $cline   = '';
                    $lines   = array();
                }
            }
            elseif($current<>'') {
                $lines[] = $oneline;
            }
        }
        if($current<>'') {
            $msg="Found $current at line $cline of<br/>"
                ."   $fileshort,<br/>"
                ."   but could not find the end marker.";
            $this->addError($msg);
        }
    }
    
    function addPage($current,$cline,$file,$text) {
        
        # First trap, no slash in name
        if(strpos($current,"/")===false) {
            $this->addError("Item $current at line $cline of<br/>"
                ."   $file<br/>"
                ."   has no slash in the name.  If this is a top-level<br/>"
                ."   item, it's name should contain a leading slash."
            );
            return;
        }
        
        
        # Second trap, duplicate names
        if(isset($this->rpPages[$current])) {
            $x = $this->rpPages[$current];
            $msg = "Found $current at line $cline of<br/>"
                ."    $file,<br/>"
                ."    but topic $current was already at line ".$x['line'].' of '
                .'    '.$x['file'];
            $this->addError($msg);
        }
        else {
            list($parent,$topic) = explode("/",$current);
            $this->rpPages[$current] = array(
                'file'   => $file
                ,'line'  => $cline
                ,'text'  => $text
                ,'parent'=> $parent
                ,'name'  => $topic
            );
            $this->rpFiles[$file]['kids'][] = $current;
        }
    }
    
    # ----------------------------------------------------------
    #
    # MAJOR FUNCTION 3: Process text of a line
    #
    # ----------------------------------------------------------
    function makeHTML($text) {
        # Initialize status variables
        $retval = '';
        $indent = 0;
        $sindent= false;   // spaces to remove from source blocks
        $mode   = '';
        $uls    = array();
        $sclose = false;
        
        foreach($text as $oneline) {
            # get rid of the leading spaces and convert tabs
            $oneline = str_replace("\t",'    ',$oneline);
            $line = trim($oneline);
            if($sindent===false) {
                $sindent = strlen($oneline) - strlen($line);
            }
            
            # If in source mode, just output it
            if($mode=='source') {
                if(!$sclose) {
                    if(trim($oneline)=='*/') {
                        $sclose = true;
                        continue;
                    }
                }
                $retval.="\n".substr($oneline,$sindent);
                continue;
            }
    
            # For future tests, get rid of the comment marker
            $line = substr($line,1);
            
            # Next possibility is a new item, which requires us
            # to close out whatever mode we were in and start
            # over with a few things.
            if(in_array(trim($line),$this->rpItems)) {
                $retval.= $this->closeMode($mode,$uls);
                $retval.="\n<h2>".trim($line)."</h2>";
                
                # reset base indent 
                $indent = 0;          
                
                # set the mode, and open it if required
                $mode   = trim($line)=='SOURCE' ? 'source' : '';
                if($mode=='source') {
                    $retval.="\n<pre class='source'>";
                }
                continue;
            }
            
            # A blank line closes all modes except pre 
            if(trim($line)=='') {
                if($mode=='pre') {
                    $retval.="\n";
                }
                else {
                    $retval.=$this->closeMode($mode,$uls);
                    $mode = '';
                }
                continue;
            }
            
            # Now get the indentation, we may need that.
            $lineIndent = strlen($line) - strlen(trim($line));
    
            # If we have not established a first line
            # indent level, take this line as it
            if($indent == 0) $indent = $lineIndent;
    
            # If line begins with an asterisk, and not in
            # ul mode, go into ul mode
            if(substr(trim($line),0,1)=='*' && $mode<>'ul') {
                $retval.=$this->closeMode($mode,$uls);
                $mode = 'ul';
            }
            # Now handle ul mode
            if($mode=='ul') {
                if(substr(trim($line),0,1)<>'*') {
                    $retval.=$line;
                }
                else {
                    if(count($uls)==0) {
                        $uls[] = $lineIndent;
                        $retval.="\n<ul><br/><li>".substr(trim($line),1);
                    }
                    else {
                        if($lineIndent > $uls[count($uls)-1]) {
                            $uls[] = $lineIndent;
                            $retval.="\n<ul>";
                            $retval.="\n<li>".substr(trim($line),1);
                        }
                        elseif($lineIndent < $uls[count($uls)-1]) {
                            while(count($uls)>0) {
                                $retval.="\n</ul>";
                                array_pop($uls);
                                if($lineIndent >= $uls[count($uls)-1]) break;
                            }
                            $retval.="\n<li>".substr(trim($line),1);
                        }
                        else {
                            $retval.="\n<li>".substr(trim($line),1);
                        }
                    }
                }
                continue;
            }
    
            # If the line has a different indent than the 
            # base indent, and we are in p mode or no
            # mode, begin pre
            if(($mode=='' || $mode=='p') && $lineIndent > $indent) {
                if($mode=='p') $retval.="\n</p>";
                $mode = 'pre';
                $retval.="\n<pre>".$line;
                continue;
            }
    
            # If pre mode and the line has base indent,
            # close it and open a paragraph
            if($mode=='pre' && $lineIndent <= $indent) {
                $retval.="</pre>\n<p>".trim($line);
                $mode = 'p';
                continue;
            }
            
            # If in no mode and base indent
            # begin a paragraph
            if($mode=='' && $lineIndent <= $indent) {
                $mode = 'p';
                $retval.="\n<p>".trim($line);
                continue;
            }
            
            # Final is simply to output the line, which is 
            # also based on the mode
            $retval.="\n".$line;
        }
        
        # At the end, we have to close out whatever mode
        # we happened to be in
        return $retval.$this->closeMode($mode,$uls);
    }
    
    function closeMode($mode,&$uls) {
        if(count($uls)>0) {
            $retval = '';
            foreach($uls as $ul) {
                $retval.="<br/></ul>";
            }
            return $retval;
        }
        if($mode=='p')      return "<br/></p>";
        if($mode=='pre')    return "</pre>";
        if($mode=='source') return "</pre>";
        return '';
    }
    
    
    # ----------------------------------------------------------
    #
    # HELPER A: add an error
    #
    # ----------------------------------------------------------
    function addError($msg) {
        global $rpErrors;
        $rpErrors[] = $msg;
    }
    
    # ----------------------------------------------------------
    #
    # HELPER B: Report errors, if any
    #
    # ----------------------------------------------------------
    function reportErrors() {
        global $rpErrors;
        if(count($rpErrors)==0) return false;
        
        foreach($rpErrors as $msg) {
            x_echoFlush("<br/><br/>$msg");
        }
        x_echoFlush("<br/><br/>");
        return true;
    }
    
    # ----------------------------------------------------------
    #
    # HELPER C: Make a Link
    #
    # ----------------------------------------------------------
    function makeLink($topic,$parent='',$parinLink=true) {
        $base=baseUrl().'pages/cms/';

        $url = $base.$topic.'.html';
        $url = strtolower($url);
        $url = str_replace(' ','',$url);
        
        # Simple case, no multiples, just send it back
        if(count($this->rpTopics[$topic])==1) {
            return "<a href='$url'>$topic</a>";
        }
        else {
            if($parent<>'') {
                $url = $base.$parent.'--'.$topic.'.html';
                $url = strtolower($url);
                $url = str_replace(' ','',$url);
                $link = $parinLink ? "$parent/$topic" : $topic;
                return "<a href='$url'>$link</a>";
            }
            else {
                return "<a href='$url'>$topic</a>";
            }
        }
    }        
}
?>
