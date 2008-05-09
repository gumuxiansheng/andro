<?php
#  This custom file exists so that we can put
#  a link onto the orders page
#
class orders extends x_table2 {
    function aLinks_extra($mode) {
        if($mode<>'upd') return;
            
        $a = html('a');
        $a->setHTML('Print Order');
        $a->hp['href']="?gp_page=p_orders&order=".$this->row['recnum_ord'];
        $retval[] = $a->bufferedRender();
        return $retval;
    }
}
?>