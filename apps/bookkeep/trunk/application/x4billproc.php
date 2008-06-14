<?php
class x4billproc extends androX4 {
    function mainLayout($container) {
        $this->mainScript();
        
        # get the data dictionary
        $dd = ddTable('orders');
        
        # Begin layout with title and main object 
        $top = html('div',$container);
        $top->addClass('x4Pane');
        $top->addClass('x4Billing');
        $top->hp['id'] = 'x4TimeReview';
        $top->setAsParent();
        $h1 = html('h1',$top,'Billing');
        $top->br();

        # Pull open orders
        $sql = "select * from orders
                 where COALESCE(flag_printed,'N')='N'
                 order by date desc";
        $rows = sql_allRows($sql);
        
        # now spit them out into rows that have special properties
        $table = html('table',$top);
        $table->hp['id'] = 'x2data1';
        $table->addClass('x2data1');
        $thead = html('thead',$table);
        $tr    = html('tr'   ,$thead);
        $td    = html('td',$tr,'&nbsp;Order&nbsp;');
        $td    = html('td',$tr,'&nbsp;Date&nbsp;');
        $td    = html('td',$tr,'&nbsp;Customer&nbsp;');
        $td    = html('td',$tr,'&nbsp;Sale&nbsp;');
        $td->hp['style'] = 'text-align: right';
        $td    = html('td',$tr,'&nbsp;Tax Authority&nbsp;');
        $td    = html('td',$tr,'&nbsp;Tax Percent&nbsp;');
        $td->hp['style'] = 'text-align: right';
        $td    = html('td',$tr,'&nbsp;Tax Amount&nbsp;');
        $td->hp['style'] = 'text-align: right';
        $td    = html('td',$tr,'&nbsp;Order Final&nbsp;');
        $td->hp['style'] = 'text-align: right';
        $td    = html('td',$tr,'&nbsp;Printed&nbsp;');
        $td    = html('td',$tr,'&nbsp;Print&nbsp;');
        $td    = html('td',$tr,'&nbsp;Download&nbsp;');
        $tbody = html('tbody',$table);
        foreach($rows as $row) {
            $tr = html('tr',$tbody);
            
            # Lists of columns
            $arr = array('recnum_ord','date','customer'
                ,'amt_sales','tax_auth','pct_tax','amt_tax','amt_order'
                ,'flag_printed'
            );
            $arri = array('date','flag_printed');
            $arrr = array('amt_sales','pct_tax','amt_tax','amt_order');
            foreach($arr as $column_id) {
                if(in_array($column_id,$arri)) {
                    $input = input( $dd['flat'][$column_id] );
                    $input->hp['onchange'] = 'instaSave(this)';
                    $input->ap['skey'] = $row['skey'];
                    $td = html('td',$tr, $input->bufferedRender());
                }
                else {
                    $td = html('td',$tr,$row[$column_id]);
                }
                if(in_array($column_id,$arrr)) {
                    $td->hp['style'] = 'text-align: right';
                }
            }
            
            # the two links
            $td = html('td',$tr);
            $a = html('a',$td,'Print');
            $a->hp['href']="?x4Page=p_orders&order={$row['recnum_ord']}";
            $td = html('td',$tr);
            $a = html('a',$td,'Download');
            $a->hp['href']="?x4Page=p_orders&d=1&order={$row['recnum_ord']}";
            
        }
    }
    
    
    # ===============================================================
    # Part 2: Browser-side script
    # ===============================================================
    function mainScript() {
        ob_start();
        ?>
        <script>
        window.instaSave = function(obj) {
            $a.json.init('x4Page','billproc');
            $a.json.addParm('skey'  ,$a.p(obj,'skey'));
            $a.json.addParm('column',$a.p(obj,'xColumnId'));
            $a.json.addParm('value' ,encodeURIComponent(obj.value));
            $a.json.addParm('x4Action','instasave');
            
            if($a.json.execute()) {
                $a.json.process();
            }
        }
        
        window.x4Billing = function(self) {
            self.activate = function() {
                $(this).fadeIn('medium');
            }
        }
        </script>
        <?php
        x4Script(ob_get_Clean());
    }

    # ===============================================================
    # Part 3: PHP Script
    # ===============================================================
    function instasave() {
        $row = array(
            'skey'=>gp('skey')
            ,gp('column')=>urldecode(gp('value'))
        );

        SQLX_Update('orders',$row);
    }

}
?>
