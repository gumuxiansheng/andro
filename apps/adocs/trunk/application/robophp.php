<?php
class robophp extends x_table2 {
    function main() {
        if(gp('process',false) && inGroup('admin')) {
            return $this->process();
        }
        ?>
        <h2>Generate API Pages From Code</h2>
        <p>This program scans code directories and generates
           pages out of the rododoc blocks.
        </p>
        <a target="_blank" 
             href="?gp_page=robophp&process=1">Process Now</a>
        <?php
    }
    
    function process() {
        # Hardcoded values, used throughout
        $dirin  = realpath(fsDirTop()).'/';
        $dirout = $dirin.'application/fromcode/';
        `rm $dirout/*`;
        
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
        x_echoFlush("<br/><br/>Step 1: Scanning Files");
        $files=array('clib/x6.js','lib/androLib.php');
        #$files=array('clib/x6.js');
        foreach($files as $file) {
            $this->scanFile($dirin.$file,$file);
        }
        if($this->reportErrors()) exit;
        
        $pages = array_keys($this->rpPages);

        x_echoFlush("<br/><br/>Step 2: Removing PHP and SCRIPT Tags");
        foreach($this->rpPages as $page=>$info) {
            $html = $this->makeHTML($info['text']);
            
            # Correct PHP and <SCRIPT> tags, and lose old-style [[ ]] stuff
            $search = array('<?'   ,'?>'   ,'<script>'      ,'</script>'   ,'[[',']]');
            $replace= array('&lt;?','?&gt;','&lt;script&gt;','&lt;/script&gt;');
            $html = str_replace($search,$replace,$html);
            
            x_echoFlush("name: ".$info['name']);
            $name = makeFileStem($info['name']).'.html';
            $outfc =  
                "title:{$info['name']}"
                ."\nparent:{$info['parent']}"
                ."\nsequence:{$info['line']}"
                ."\naliases:"
                ."\n\n"
                .$html;
            
            file_put_contents($dirout.$name,$outfc);
        }
        exit;
    }

    
    function addPage($current,$cline,$file,$text) {
        echo "adding page $current<br/>";
        
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
    # MAJOR FUNCTION 2: Scan a File
    #
    # ----------------------------------------------------------
    function scanFile($file,$fileshort) {
        # Get file and get rid of all \r 
        $fc = file_get_contents($file);
        $fc = str_replace("\r","",$fc);
        
        # Split up into lines
        $fcl = explode("\n",$fc);
        
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
                    $retval.="\n<pre class='prettyprint'>";
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
    function makeLink($topic,$parent='',$parinLink='',$class='') {
        $base=baseUrl().'pages/cms/';

        $url = $base.urlencode($topic).'.html';
        $url = strtolower($url);
        
        if($class<>'') $class="class='$class'";
        
        # Simple case, no multiples, just send it back
        if(count($this->rpTopics[$topic])==1) {
            return "<a $class href='$url'>$topic</a>";
        }
        else {
            if($parent<>'') {
                $url = $base.urlencode($parent.'--'.$topic).'.html';
                $url = strtolower($url);
                $link = $parinLink ? "$parent/$topic" : $topic;
                return "<a $class href='$url'>$link</a>";
            }
            else {
                return "<a $class href='$url'>$topic</a>";
            }
        }
    }        
}
?>
