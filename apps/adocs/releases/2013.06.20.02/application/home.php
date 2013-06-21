<?php
class home extends x_table2 {
    function main() {
        ?>
        <style>
        #a6body {
        }
        
        #a6body-top {
            font-size: 13px;
        }
        #a6body-top h2 { 
            margin: 5px 0 0 0;
            font-size: 16px;
        }
        
        #a6body-news {
        }
        #a6body-news div.article {
            border: 1px solid #AAA;
            background-color: #F7F7F7;
            padding: 5px;
            margin-bottom: 10px;
        }
        #a6body-news div.article h3 {
            border-bottom: 2px dotted #D69600;
            margin: 0 0 8px 0;
            font-size: 15px;
            font-weight: bold;
            color: #08288C;
        }
        #a6body-news div.article div.dateline {
            font-weight: bold;
            font-size: 11px;
            margin-top: -8px;
        }
        </style>
        <div id = "a6body-left">
        <h3>Project Status</h3>
	Looking for team members
        <h3>Mailing Lists</h3>
	Join our mailing list at: <a href="http://lists.sourceforge.net/mailman/listinfo/andro-general"
        >andro-general</a>.
        <h3>Technical News</h3>
        Bug fix announcements are available on our
        <a href="http://code.google.com/p/andro/updates/list"
        target="_blank">Google Code Updates</a> page.
        <h3>Author Blogs</h3>
        Kenneth Downs- Andromeda Creator: <a target="_blank" href="http://database-programmer.blogspot.com">The Database Programmer</a><br /><br />
        Donald Organ- Project Maintainer: <a target="_blank"
        href="http://blog.donaldorgan.com/"
        >The PHP Guy</a>
        <h3>We Are Looking For...</h3>
		<ul>
			<li>PHP Developers</li>
      			<li>Postgres Gurus</li>
    			<li>Graphical Designers</li>
 		</ul>
        </div>
        <div id = "a6body-right">
            <div id = "a6body-top">
            <?php $this->bodyTop()?>
            </div>
            <div id="a6body-news">
            <?php $this->bodyNews()?>
            </div>
        </div>
        <?php
    }
    
    function bodyTop() {
        ?>
        <h2>About Andromeda</h2>
        
        <p>Andromeda is a <i>programmer productivity tool</i>, our only
           measure of success is how much we can reduce labor and 
           increase quality.   We want to help you to <b>get it done,
           get it right</b>.
        </p>
        <p>Andromeda's primary unique feature is our incredibly powerful
           <i>data dictionary</i>, which allows you to radically apply
           the D-R-Y (don't repeat yourself) principle when creating
           applications.  This feature is not present in any other
           framework that we have found, and it will change
           the way you work on projects that require powerful database
           features.
        </p>
        <p>The Andromeda philosophy is to <i>help or get out of the 
           way</i>.  Andromeda has features to speed up accurate
           development at the database level, PHP level, and in the
           browser, but the programmer can always 'escape the box' 
           without fear of a dictorial framework.
        </p>
        <?php
        
    }
    
    function bodyNews() {
        $sq="Select * from articles order by ts_ins desc limit 5";
        $arts = SQL_AllRows($sq);
        
        foreach($arts as $art) {
            ?>
            <div class='article'>
            <h3><?php echo $art['headline']?></h3>
            <div class='dateline'>
            <?php echo date('l F d, Y',dEnsureTs($art['date']))?>
            </div>
            <br/>
            <?php echo $art['article_html']?>
            </div>
            <?php
        }
    }
    
    function bodyShort() {
        ?>
        <h3>Dictionary Code</h3>
<pre><span class="syntax0"><span class="syntax10">column</span><span class="syntax10"> </span><span class="syntax10">headline:</span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax8"> </span><span class="syntax8">type_id:</span><span class="syntax13"> </span><span class="syntax13">vchar</span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax8"> </span><span class="syntax8">colprec:</span><span class="syntax13"> </span><span class="syntax13">100</span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax8"> </span><span class="syntax8">description:</span><span class="syntax13"> </span><span class="syntax13">Headline</span>
<span class="syntax10">table</span><span class="syntax10"> </span><span class="syntax10">articles:</span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax8"> </span><span class="syntax8">module:</span><span class="syntax13"> </span><span class="syntax13">main</span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax8"> </span><span class="syntax8">uisort:</span><span class="syntax13"> </span><span class="syntax13">100</span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax8"> </span><span class="syntax8">description:</span><span class="syntax13"> </span><span class="syntax13">Articles</span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax9"> </span><span class="syntax9">column</span><span class="syntax9"> </span><span class="syntax9">headline:</span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax8"> </span><span class="syntax8">primary_key:</span><span class="syntax13"> </span><span class="syntax13">&quot;</span><span class="syntax13">Y</span><span class="syntax13">&quot;</span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax8"> </span><span class="syntax8">uisearch:</span><span class="syntax13"> </span><span class="syntax13">&quot;</span><span class="syntax13">Y</span><span class="syntax13">&quot;</span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax9"> </span><span class="syntax9">column</span><span class="syntax9"> </span><span class="syntax9">date:</span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax8"> </span><span class="syntax8">description:</span><span class="syntax13"> </span><span class="syntax13">Dateline</span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax8"> </span><span class="syntax8">uisearch:</span><span class="syntax13"> </span><span class="syntax13">&quot;</span><span class="syntax13">Y</span><span class="syntax13">&quot;</span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax9"> </span><span class="syntax9">column</span><span class="syntax9"> </span><span class="syntax9">desclong:</span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax8"> </span><span class="syntax8">uisearch:</span><span class="syntax13"> </span><span class="syntax13">&quot;</span><span class="syntax13">Y</span><span class="syntax13">&quot;</span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax9"> </span><span class="syntax9">column</span><span class="syntax9"> </span><span class="syntax9">notes:</span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax8"> </span><span class="syntax8">description:</span><span class="syntax13"> </span><span class="syntax13">Text</span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax9"> </span><span class="syntax9">column</span><span class="syntax9"> </span><span class="syntax9">ts_ins:</span>
<span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax13"> </span><span class="syntax9"> </span><span class="syntax9">column</span><span class="syntax9"> </span><span class="syntax9">uid_ins:</span>
</span></pre>     
        
        <?php
    }
}
?>
        
