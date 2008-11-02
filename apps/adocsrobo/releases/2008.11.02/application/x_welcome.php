<?php
class x_welcome extends x_table2 {
    function main() {
        $html = html('div');
        $html->h('h1','Admin Menu');
        $html->a('Logout','?st2logout=1');
        
        $menu = SessionGet('AGMENU');
        foreach($menu as $module=>$info) {
            $html->h('h3',$info['description']);
            foreach($info['items'] as $page=>$info) {
                $html->a($info['description'],'?gp_page='.$page);
                $html->br();
            }
            
        }
        $html->render();
    }
}
?>
