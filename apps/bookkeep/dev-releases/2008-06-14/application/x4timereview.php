<?php
class x4timereview extends androX4 {
    function mainLayout($container) {
        $this->mainScript();
        
        # get the data dictionary
        $dd = ddTable('orderservices');
        
        # Begin layout with title and main object 
        $top = html('div',$container);
        $top->addClass('x4Pane');
        $top->addClass('x4TimeReview');
        $top->hp['id'] = 'x4TimeReview';
        $top->setAsParent();
        $h1 = html('h1',$top,'Time Review and Approval');
        $top->br();
        
        # Pull a list of customers to view
        $sql = "Select distinct customer from orderservices
                 where coalesce(flag_close,'N')='N'";
        $customers = SQL_AllRows($sql);
        $span = html('span',$top,'Filter by Customer:');
        $select = html('select',$top);
        $select->hp['id'] = 'theselect';
        $select->hp['onchange'] = "filterCustomer(this)";
        $option = html('option',$select,'* ALL *');
        foreach($customers as $customer) {
            html('option',$select,$customer);
        }
        $top->br(3);
        elementAdd('jqueryDocumentReady'
            ,"\$a.byId('theselect').value='* ALL *'"
        );
        
        # Pull the open order services
        $sql = "select * from orderservices
                 where COALESCE(flag_close,'N')='N'
                 order by date ";
        $rows = sql_allRows($sql);
        
        # now spit them out into rows that have special properties
        foreach($rows as $row) {
            $div = html('div',$top);
            $div->ap['xCustomer']=$row['customer'];
            $table = html('table',$div);
            $table->addClass('tab100');
            $tr = html('tr',$table);
            $tr->addClass('available');

            # do the stuff
            $arr = array('date','customer','employee','activity'
                ,'qtydec','price','notes','flag_close'
            );
            foreach($arr as $column_id) {
                $input = input( $dd['flat'][$column_id] );
                $input->hp['onchange'] = 'instaSave(this)';
                $input->ap['skey'] = $row['skey'];
                if($column_id=='notes') {
                    $input->setHTML($row[$column_id]);
                }
                else {
                    $input->hp['value'] = $row[$column_id];
                }
                $td = html('td',$tr, $input->bufferedRender());
            }
        }
    }
    
    
    # ===============================================================
    # Part 2: Browser-side script
    # ===============================================================
    function mainScript() {
        ob_start();
        ?>
        <script>
        window.filterCustomer = function(obj) {
            var prop = obj.value;
            if(prop == '* ALL *') {
                $("#x4TimeReview div").show();
            }
            else {
                var sel = "#x4TimeReview div[xCustomer="+prop+"]";
                $(sel).show('fast', function() {
                    var sel = "#x4TimeReview div:not([xCustomer="+prop+"])";
                    $(sel).hide('fast');
                });
            }
        }
        
        window.instaSave = function(obj) {
            $a.json.init('x4Page','timereview');
            $a.json.addParm('skey'  ,$a.p(obj,'skey'));
            $a.json.addParm('column',$a.p(obj,'xColumnId'));
            $a.json.addParm('value' ,encodeURIComponent(obj.value));
            $a.json.addParm('x4Action','instasave');
            
            var killme = false; 
            if($a.p(obj,'xColumnId') == 'flag_close') {
                if (obj.value=='Y') {
                    var killme = true;
                    var skey = $a.p(obj,'skey');
                    var sel = '#x4TimeReview :input[skey='+skey+']'
                    var obj2 = $(sel)[5];
                    if(Number(obj2.value)==0) {
                        if(!$a.dialogs.confirm("Really close with no amount?")){
                            obj.value='N';
                            return;
                        }
                    }
                }
            }
            
            if($a.json.execute()) {
                $a.json.process();
                
                if(killme) {
                    //      input     td         tr      table       div
                    var div = obj.parentNode.parentNode.parentNode.parentNode;
                    $(div).slideUp('slow',function() {
                        $(this).remove();
                    });
                }
            }
            else {
                if(killme) {
                    obj.value = 'N';
                }
            }
            
        }
        
        window.x4TimeReview = function(self) {
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

        # trigger code, make an order for it if none is found        
        if(gp('column')=='flag_close' && urldecode(gp('value'))=='Y') {
            $cust=SQL_oneValue("customer",
                "Select customer from orderservices where skey=".gp('skey')
            );
            $sql="Select recnum_ord from orders
                   where coalesce(flag_printed,'N')='N'
                     and customer = ".SQLFC($cust);
            $orders = SQL_AllRows($sql);
            if(count($orders)==0) {
                $roworder=array('customer'=>$cust,'flag_printed'=>'N'
                    ,'flag_close'=>'N');
                SQLX_Insert('orders',$roworder);
                $orders = SQL_AllRows($sql);
            }
            SQL("update orderservices set recnum_ord = "
                 .$orders[0]['recnum_ord']
                 .' where skey = '.SQLFN(gp('skey')));
            SQL("update orders set _agg='C' 
                  where recnum_ord = ".$orders[0]['recnum_ord']
            );
        }
        
        
        SQLX_Update('orderservices',$row);
    }

}
?>
