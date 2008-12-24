<?php
class artview extends x_table2 {
    function main() {
        if(gp('skey')<>'') {
            if ($this->oneArticle()) return;
        }
        
        $sq="Select * from articles order by date desc limit 5";
        $arts = SQL_AllRows($sq);
        
        $html = html('div');
        $html->h('h1','Latest News');
        foreach($arts as $art) {
            $div=$html->h('div',date('l F d, Y',dEnsureTs($art['date'])));
            $div->addClass('dateline');

            $h3=$html->h('h3');
            $h3->addClass('news');            
            $h3->a($art['headline'],"?gp_page=artview&skey=".$art['skey']);

            $div=$html->h('div',$art['desclong']);
            $div->addClass('summary');
        }
        $html->render();
    }
    
    function oneArticle() {
        $sq="Select * from articles where skey=".SQLFC(gp('skey'));
        $art=SQL_OneRow($sq);
        
        if(!$art) return false;
        
        $div=html('div');
        $div->h('h1',$art['headline']);
        $x=$div->h('div',date('l F d, Y',dEnsureTs($art['date'])));
        $x->addClass('dateline');
        $div->br(2);
        
        $div->h('div',$art['notes']);
        $div->render();
        return true;
    }
}
?>
