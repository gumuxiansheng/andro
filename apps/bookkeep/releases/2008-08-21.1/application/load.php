<?php
class load extends x_table2 {
    function main() {
        // Load customers
        SQL("truncate table customers");
        for($x=1;$x<100;$x++) {
            $row = array(
                'description'=>"Customer $x"
                ,'add1'=>'123 Main Street'
                ,'city'=>'Anytown'
                ,'zip9'=>'11111-2222'
            );
            SQLX_Insert('customers',$row);
        }
        
        // Load Activities
        SQL("truncate table activities");
        SQL("truncate table actrates");
        SQL("truncate table actemprates");
        SQL("truncate table custactemprates");
        SQL("truncate table custactrates");
        $row=array('activity'=>'SOFTDEV'
            ,'description'=>'Software Development'
        );
        SQLX_Insert('activities',$row);
        $row=array('activity'=>'IT'
            ,'description'=>'IT Activities'
        );
        SQLX_Insert('activities',$row);
        
        // Load Fifty Items
        SQL("truncate table items");
        for($x=1;$x<100;$x++) {
            $tax = 'Y';
            if(($x % 2) == 0) $tax = 'N';
            $row = array(
                'sku'=>$x
                ,'description'=>"Item $x"
                ,'price'=>$x
                ,'flag_tax'=>$tax
            );
            SQLX_Insert('items',$row);
        }
        
        // Now capture the customers and items and lets 
        // generate the orders
        $tax=SQL_AllRows("Select * from tax_auths");
        $cus=SQL_AllRows("Select * from customers");
        $itm=SQL_AllRows("Select * From items");
        SQL("truncate table orders");
        SQL("truncate table orderlines");
        SQL("truncate table payments");
        for($x=0;$x<250;$x++) {
            $customer = $cus[ intval(rand(0,98)) ]['customer'];
            $tax_auth = $tax[ intval(rand(0,5))  ]['tax_auth'];
            $order = array(
                'customer'=>$customer
                ,'tax_auth'=>$tax_auth
            );
            SQLX_Insert('orders',$order);
        }
        
        // Now capture the orders and make some line items for them,
        // and then decide whether to make a payment
        $ords=SQL_AllRows("Select recnum_ord from orders");
        foreach($ords as $ord) {
            $loop=rand(1,3);
            $order = $ord['recnum_ord'];
            for($x=0;$x<$loop;$x++) {
                $sku = $itm[ rand(0,count($itm)-1) ]['sku'];
                $row=array(
                    'recnum_ord'=>$order
                    ,'sku'=>$sku
                    ,'qty'=>rand(1,10)
                );
                SQLX_Insert('orderlines',$row);
                if(Errors()) {
                    echo hErrors();
                    errorsClear();
                }
            }
            if(rand(1,3)==1) {
                $due = SQL_OneRow(
                    "Select amt_order from orders where recnum_ord=$order"
                );
                $row = array(
                    'recnum_ord'=>$order
                    ,'date'=>date('Y-m-d')
                    ,'paytype'=>'CASH'
                    ,'amt'=>$due['amt_order']
                );
                SQLX_Insert("payments",$row);
            }
        }
        
        
    }
}
?>
