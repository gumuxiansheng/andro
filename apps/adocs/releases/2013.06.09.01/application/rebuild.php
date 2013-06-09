<?php
class rebuild extends x_table2 {
    function main() {
        if(gp('process',false) && SessionGet('ROOT')==1) {
            return $this->mainProcess();
        }
        ?>
        <h1>Build the site</h1>
        
        <a href="?gp_page=rebuild&process=1" target="_blank">Do It Now</a>
        <br/>
        <br/>
        <a href="?gp_page=rebuild&process=1&simple=1" target="_blank">Make Simple Instead</a>
        <?php
    
    }
    
    # ----------------------------------------------------------------
    # 
    # MAIN PROCESSING LOOP
    #
    # ----------------------------------------------------------------
    function mainProcess() {
        # Step one, read all files into memory
        x_EchoFlush("Reading in files");
        $this->pages   = array();
        $this->aliases = array();
        $this->toc     = array();
        $diro = realPath(fsDirTop()).'/';
        $diri = $diro.'application/';
        $this->scanDir($diri.'byhand/');
        $this->scanDir($diri.'fromcode/');

        x_EchoFlush("Sorting child topics in table of contents");
        foreach($this->toc as $idx=>$kids) {
            ksort($kids);
            $this->toc[$idx] = $kids;
        }
        
        x_echoFlush("Retrieving Top level table of contents");
        $this->toctop = array();
        $toctop = SQL_AllRows("select * from toctop order by queuepos");
        foreach($toctop as $top) {
            $this->toctop[] = $top['page'];
        }
        
        # Call out to main routines
        $this->escapeCode();
        $this->replaceLinks();
        #$this->makeLinks();
        $this->navigation();
        $this->loadPages();
        $this->writeToc();
        $this->writePages();
        
        #exit, don't returnts_ins
        x_EchoFlush("done");
        exit;
    }
    function scanDir($dir) {
        $files = scandir($dir);
        foreach($files as $file) {
            if(substr($file,0,1)=='.') continue;
            
            # Pull parameters out of top four lines
            $fc = file_get_contents($dir.$file);
            $parts = explode( "\n\n", $fc );
            $config = array_shift( $parts );
            
            $options = explode( "\n", $config );
            foreach( $options as $opt ) {
                $col = explode( ':', $opt );
                if ( isset( $col['1'] ) ) {
                    $$col['0'] = $col['1'];
                } else {
                    $$col['0'] = '';
                }
            }

            $lines = explode( "\n", implode( "\n\n", $parts ));
//            list($throwaway,$title)    = explode(":",array_shift($lines));
//            list($throwaway,$parent)   = explode(":",array_shift($lines));
//            list($throwaway,$sequence) = explode(":",array_shift($lines));
//            list($throwaway,$aliases)  = explode(":",array_shift($lines));
//            list($throwaway,$comments) = explode(":",array_shift($lines));

            $title = trim($title);
            $parent= trim($parent);

            if ( isset( $comments ) ) {
                $comments = trim($comments);
            } else {
                $comments = 'true';
            }
            if ( $comments == 'true' ) {
                $comments = true;
            } else if ( $comments == 'false' ) {
                $comments = false;
            } else {
                $comments = true;
            }
            # Add aliases to local memory
            $a_aliases = explode(',',$aliases);
            $this->aliases[$title] = $title;
            foreach($a_aliases as $alias) {
                $this->aliases[$alias] = $title;
            }
            # Build the two important arrays
            $this->pages[$title] = array(
                'parent'  =>$parent
                ,'sequence'=>$sequence
                ,'aliases' =>$aliases
                ,'comments'=>$comments
                ,'html'    =>implode("\n",$lines)
                ,'prev'    =>''
                ,'next'    =>''
                ,'parents' =>array()
            );
            $this->toc[$parent][$sequence] = $title;
        }
    }

    # ----------------------------------------------------------------
    # 
    # MAIN PROCESS: Escape out some code for the 
    #               syntax prettifier.
    #
    # ----------------------------------------------------------------
    function escapeCode() {
        foreach($this->pages as $page=>$info) {
            $html = $info['html'];
            $html = str_replace('<?php','&lt;?php',$html);
            $html = str_replace('<<<JS','&lt;&lt;&lt;JS',$html);
            $this->pages[$page]['html'] = $html;
        }
    }
    
    # ----------------------------------------------------------------
    # 
    # MAIN PROCESS: Replace wiki links.
    #
    # ----------------------------------------------------------------
    function replaceLinks() {
        foreach($this->pages as $page=>$info) {
            # First replacement is image tags
            $pattern = '/\[\[image:(.*)\]\]/';
            $replace = '<img src="appclib/$1"/>';
            $matches = array();
            $html    = $info['html'];
            $html = preg_replace($pattern,$replace,$html);

            # Second replacement is direct links, which
            # have to be done a little differently
            $pattern = '/\[\[(.*)\]\]/';
            $matches = array();
            preg_match_all($pattern,$html,$matches);
            foreach($matches[0] as $idx=>$match) {
                $target  = $matches[1][$idx];
                if(isset($this->pages[$target])) {
                    $href    = makeFileStem($target).'.html';
                    $target  = "<a href='$href'>$target</a>";
                    $html    = str_replace($match,$target,$html);
                }
                else {
                    //$html = str_replace($match,$target,$html);
                }
            }
            $this->pages[$page]['html'] = $html;
        }
    }
    # ----------------------------------------------------------------
    # 
    # MAIN PROCESS: Make links out of aliases
    #
    # We do this by making a recursive structure of the
    # text blocks of this form:
    #
    # item => 
    #   [0] = left node
    #   [1] = link
    #   [2] = right node
    #
    # If a node is an array, it is a subnode.  If not, it is text.
    #
    # ----------------------------------------------------------------
    function makeLinks() {
        x_echoFlush("Auto-inserting links based on alias and page");
        foreach($this->pages as $page=>$info) {
            x_echoFlush(" -> Auto-inserting: $page");
            #if($page<>'The FETCH Family') continue;
            $this->temp = array_keys($this->pages);
            foreach($this->temp as $idx=>$temp) {
                $this->temp[$idx] = trim($temp);
            }
            unset($this->temp[array_search('code'   ,$this->temp)]);
            unset($this->temp[array_search('Columns',$this->temp)]);
            unset($this->temp[array_search('Tables' ,$this->temp)]);
            
            $nodeTree = $this->makeLinksRecurseText($page,$info['html'],0);
            
            $this->pages[$page]['html'] = $this->makeLinksRecombine($nodeTree);
            
        }
        #exit;
    }
    function makeLinksRecurseText($page,$text,$level) {
        if($level > 100) $text;
        # First things first.  Look for a code block, and
        # if found, split on that and recurse
        $pattern = '/\<pre\s*class\s*=\s*"prettyprint.*\<\/pre\>/msxU';
        $matches = array();
        preg_match($pattern,$text,$matches);
        if(count($matches)>0) {
            $match = $matches[0];
            $start = strpos($text,$match);
            $hxLeft  = substr($text,0,$start-1);
            $hxMiddle= substr($text,$start,strlen($match));
            $hxRight = substr($text,$start+strlen($match));
            $node = array(
                'left'=>$this->makeLinksRecurseText($page,$hxLeft,$level+1)
                ,'middle'=>$hxMiddle
                ,'right'=>$this->makeLinksRecurseText($page,$hxRight,$level+1)
            );
            return $node;
        }
        #<-------- Early return if code block found
        
        # Now loop through pagelinks looking to make links
        foreach($this->temp as $pageLink) {
            # Don't link to empties, shorts, or into the same page
            if($pageLink=='') continue;
            if(strlen($pageLink)<3) continue;
            if($page==$pageLink) continue;
            
            $pattern = "/\b".str_replace(' ','\s',$pageLink).'\b/';
            $stuff = preg_split($pattern,$text);
            if(count($stuff)==1) continue;
            
            $hxLeft  = array_shift($stuff);
            $hxRight = implode($pageLink,$stuff);
            $href = makeFileStem($pageLink).'.html';
            $hxMiddle = "<a class='autolink' href='$href'>$pageLink</a>";
            x_echoFlush(" ----> Link on $page $href");
            
            $node = array(
                'left'=>$this->makeLinksRecurseText($page,$hxLeft,$level+1)
                ,'middle'=>$hxMiddle
                ,'right'=>$this->makeLinksRecurseText($page,$hxRight,$level+1)
            );
            return $node;
        }
        
        # if nothing matched, return the text.
        return $text;
    }
    function makeLinksRecombine($nodeTree) {
        $left = !is_array($nodeTree['left'])
            ? $nodeTree['left']
            : $this->makeLinksRecombine($nodeTree['left']);
        $right = !is_array($nodeTree['right'])
            ? $nodeTree['right']
            : $this->makeLinksRecombine($nodeTree['right']);
        return $left.$nodeTree['middle'].$right;
    }
    
    
    # ----------------------------------------------------------------
    # 
    # MAIN PROCESS: Load page names to database
    #
    # ----------------------------------------------------------------
    function navigation() {
        x_echoflush("Creating Navigation Data");
        $prev = '';
        foreach($this->toctop as $top) {
            if($prev!='') {
                $this->pages[$top]['prev'] = $prev;
                $this->pages[$prev]['next'] = $top;
            }
            $prev = $top;
            $stack = array($top);
            $this->navigationRecurse($prev,$stack,$top);
        }
    }
    function navigationRecurse(&$prev,$stack,$topic) {
        if(isset($this->toc[$topic])) {
            foreach($this->toc[$topic] as $kid) {
                $this->pages[$kid]['parents'] = $stack;
                $this->pages[$kid]['prev'] = $prev;
                $this->pages[$prev]['next'] = $kid;
                $prev = $kid;
                $stackx = array_merge($stack,array($kid));
             //   $this->navigationRecurse($prev,$stackx,$kid);
            }
        }
        
    }

    # ----------------------------------------------------------------
    # 
    # MAIN PROCESS: Generate navigation information
    #
    # ----------------------------------------------------------------
    function loadPages() {
        x_echoflush("loading page names to database");
        foreach($this->pages as $page=>$info) {
            $row = array('page'=>$page);
            SQLX_Insert('pages',$row);
        }
        
        # Now for the aliases
        SQL("delete from aliases");
        foreach($this->aliases as $alias=>$page) {
            $row = array('page'=>$page,'description'=>$alias);
            SQLX_Insert('aliases',$row);
        }
        
        errorsClear();
    }
    
    
    # ----------------------------------------------------------------
    # 
    # MAIN PROCESS: WRITE OUT TABLE OF CONTENTS
    #
    # ----------------------------------------------------------------
    function writeToc() {
        $html = '<h1 class="toc">Table of Contents</h1>';
        $toctop = $this->toctop;
        foreach($toctop as $top) {
            $name = makeFileStem($top);
            $html.="<br/><a class='toctop' href=\"$name.html\">$top</a>";
            if(isset($this->toc[$top])) {
                foreach($this->toc[$top] as $sub) {
                    $name = makeFileStem($sub).'.html';
                    $html.="<br/><a class='tocsub' href=\"$name\">"
                        .$sub."</a>";
                }
            }
            if ( isset( $this->pages[$top]['html'] ) ) {
                $this->writepage($top,$this->pages[$top]['html'],$this->pages[$top]['comments']);
            }
            
        }
        $this->writePage('Table of Contents',$html,false);        
    }
    
    # ----------------------------------------------------------------
    # 
    # MAIN PROCESS: WRITE OUT FILES
    #
    # ----------------------------------------------------------------
    function writePages() {
        x_EchoFlush("Writing out pages");
        foreach($this->pages as $page=>$info) {
            if ( isset( $info['html'] ) ) {
                $this->writePage($page,$info['html'], $info['comments']);
            }
        }
    }
    
    function writePage($page,$html,$comments) {
        # begin with the prev/next
        if ( isset( $this->pages[$page] ) ) {
            $prev = makeFileStem($this->pages[$page]['prev']).'.html';
            $prevn= $this->pages[$page]['prev'];
            $next = makeFileStem($this->pages[$page]['next']).'.html';
            $nextn= $this->pages[$page]['next'];
            $prevnext =
                "<div class='prevnext'>"
                ."<a class='left'  href=\"$prev\">$prevn</a>"
                ."<a class='right' href=\"$next\">$nextn</a>"
                ."</div>";
            ob_start();
            }
        ?>
            
            <?php
            echo( '<div id="a6body-left">' );
            if ( isset( $this->pages[$page] ) ) {
                echo $this->navLeft($page);
            }
            echo( '</div>' );
            echo( '<div id="a6body-right">' );
            if ( isset( $prevnext ) ) {
                echo $prevnext;
            }
            echo '<h1>'.$page.'</h1>';
            echo $html;
            if ( isset( $prevnext ) ) {
                echo $prevnext;
            }

        echo $this->childTopics($page);
        echo('<div id="disqus_thread"></div>
            <script type="text/javascript">
                var disqus_shortname = \'andro\'; // required: replace example with your forum shortname
                (function() {
                    var dsq = document.createElement(\'script\'); dsq.type = \'text/javascript\'; dsq.async = true;
                    dsq.src = \'//\' + disqus_shortname + \'.disqus.com/embed.js\';
                    (document.getElementsByTagName(\'head\')[0] || document.getElementsByTagName(\'body\')[0]).appendChild(dsq);
                })();
            </script>
            <noscript>Please enable JavaScript to view the <a href="http://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
            <a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>
        ');
            echo "</div>";
            echo "<div style='clear:both'></div>";
        $html = ob_get_clean();
        $name = makeFileStem($page).'.html';
        ob_start();
        vgfSet('HTML',$html);
        vgaSet('NOFORM',true);
        if(gp('simple',false)) {
            include(fsDirTop().'templates/adocs6/index2.php');
            file_put_contents(fsDirtop().$name,str_replace( '<title>Andromeda</title>', '<title>Andromeda: Documentation- ' .$page .'</title>', ob_get_clean()));
        } else {
            include(fsDirTop().'templates/adocs6/index.php');
            
            file_put_contents(fsDirtop().$name,str_replace( '<title>Andromeda</title>', '<title>Andromeda: Documentation- ' .$page .'</title>', ob_get_clean()));
        }
        
    }
    function navLeft($page) {
        $html = '<h3><a href="tableofcontents.html">Documentation</a></h3>';
        # get the parents
        if ( isset( $this->pages[$page] ) ) {
            $stack = $this->pages[$page]['parents'];
            foreach($stack as $parent) {
                $name = makeFileStem($parent).'.html';
                $html.="<h4><a href=\"$name\">$parent</a></h4>";
            }
            # figure out where the peers are
            if(count($stack)==0) {
                $peers = $this->toctop;
            } else {
                $parent= array_pop($stack);
                $peers = arr($this->toc,$parent,array());
            }
        }
        # Now look at the last parent and see if it has kids
        if ( isset( $peers ) ) {
            foreach($peers as $peer) {
                $name = makeFileStem($peer).'.html';
                $class = $peer==$page 
                    ? 'class="current"' 
                    : 'class="toc"';
                $html.="<a $class href=\"$name\">$peer</a>";
            }
        }
        return $html;
    }
    function childTopics($page) {
        if(!isset($this->toc[$page])) return '';
        
        $html = '<h3>Child Topics</h3><ul>';
        foreach($this->toc[$page] as $topic) {
            $name = makeFileStem($topic).'.html';
            $html.='<li><a href="'.$name.'">'.$topic.'</a></li>';
        }
        $html.='</ul>';
        return $html;
    }
    function addComments($page) {
        $dd  = ddTable('comments');
        $top = html('div');
        $top->addclass('comments');
        $div = $top->h('form');
        
        $div->hp['action'] = '/index.php';
        $div->hp['method'] = 'GET';
        $div->hidden('gp_page','commentspost');
        $div->hidden('page',$page);
        
        # First add any existing comments
        $div->h('h3','User Comments');
        $comments=sql_allRows(
            "select * from comments 
              where page = ".SQLFC($page)."
              order by ts_ins DESC"
        );
              
        foreach($comments as $comment) {
            $dc = $div->h('div');
            $dc->hp['style'] = 'border: 1px solid #606060;
                border-bottom: 0;
                padding: 5px;
                background-color: #c0c0c0';
            $dc->setHtml(
                "Submitted by ".$comment['name'].', '
                .date('l F j, Y',dEnsureTs($comment['ts_ins']))
            );
            $dc=$div->h('div');
            $dc->hp['style'] = 'border: 1px solid #606060;
                padding: 5px;
                background-color: #E0E0E0';
            $comment['notes'] = str_replace("\r","\n",$comment['notes']);
            $comment['notes'] = str_replace("\n\n\n\n","\n\n",$comment['notes']);
            $comment['notes'] = str_replace("\n","<br/>",$comment['notes']);
            $dc->setHtml($comment['notes']);
            $div->br(2);
        }
        if(count($comments)==0) {
            $div->h('p','There are no user comments yet on this page.');
        }
        
        $div->hr();
        $div->h('h3','Add A Comment');
        $div->h('div','<b>Comments will not appear until after they are
            moderated.  Comments are usually moderated within a few hours
            on weekdays, but may take longer on weekends and holidays.
            </b><br/><br/>'
        );
        $div->h('div','Name or nickname: (This will appear with your comment)');
        $input = $this->input($dd['flat']['name']);
        $div->addChild($input);
        $div->br(2);
        
        $input = $this->input($dd['flat']['name']);
        $input->hp['name'] = $input->hp['id'] = 'first_name';
        $input->hp['value'] = '';
        $input->hp['style'] = 'display: none;';
        $div->addChild($input);
        
        $div->h('div','Email (this will never be displayed)');
        $input = $this->input($dd['flat']['email']);
        $div->addChild($input);
        $div->br(2);

        $div->h('div','Enter your comment here.  Use [b] and [/b] for
            bold, [i] and [/i] for italic, and [pre] and [/pre] for
            code samples.  All literal HTML and PHP that you enter will
            be escaped out and displayed as you enter it.');
        $input = $this->input($dd['flat']['notes']);
        $div->addChild($input);

        $div->br(2);
        $inp=$div->h('input');
        $inp->hp['type'] = 'submit';
        $inp->hp['value'] = 'Submit';
        
        return $top->bufferedRender();
    }
    function input($ddinfo) {
        $input = input($ddinfo);
        $kills = array('onfocus','onblur','onchange','onkeyup'
            ,'onkeydown','onchange'
        );
        foreach($kills as $kill) {
            if(isset($input->hp[$kill])) unset($input->hp[$kill]);
        }
        return $input;
    }
}
?>
