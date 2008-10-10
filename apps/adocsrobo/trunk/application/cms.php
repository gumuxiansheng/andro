<?php
class cms extends x_table2 {
    function main() {
        $file=fsDirTop().'files/'.gp('gp0');
        include($file);
    }
}
?>
