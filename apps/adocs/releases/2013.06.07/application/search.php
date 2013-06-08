<?php
class search extends x_table2 {
    function main() {
        // Pull out search term and look for it
        $string=gp('search');
        $string = '%'.strtolower($string).'%';
        $string = sqlfc($string);
    
        $div=html('div');
        $div->h('h1','Search Results');
        $div->h('p','Search term: '.hx(gp('search')));
        
        $sq="Select distinct page
               from aliases where LOWER(description) like $string";
        $matches = SQL_ALLROWs($sq);
        
        
        if(count($matches)==0) {
            $div->h('p','No results');
        }
        else {
            $div->h('h3',"The following pages matched");
            foreach($matches as $listitem) {
                $name = $listitem['page'];
                $url = makeFileStem($name).'.html';
                $url = strtolower($url);
                $url = str_replace(' ','',$url);
                $div->a($name,$url);
                $div->br();
            }
        }
        
        $div->render();
    }
}
?>    
