<?php
class billproc extends x_table2 {
    function main() {
        # Call out to get some vital stats
        list($cnt_ol,$cnt_os,$customers) = $this->makeInquiries();
        
        # If they asked us to process and there is anything to do, do it
        if(gp('process')==1 && count($customers)>0) {
            $this->process();
            # refresh the counts, they should all come to zero
            list($cnt_ol,$cnt_os,$customers) = $this->makeInquiries();
        }
        
        # Get the last 10 batches
        $batches = sql_allrows(
            "Select * from opbatches ORDER by ts_ins desc limit 10"
        );
        
        ?>
        <h1>Bill Processing</h1>
        <hr/>
        
        <h2>Preview Unbilled Lines</h2>

        <p>There are <?=$cnt_ol?> new order lines waiting for processing.
        <a href="?gp_page=billproc_openl">Click here to view</a>.</p>
        
        <p>There are <?=$cnt_os?> new order services waiting for processing.
        <a href="?gp_page=billproc_opens">Click here to view</a>.</p>
        
        <hr/>
        <h2>Automatically Generate Orders</h2>

        <p>This program will automatically generate orders for all customers
            that require them, and assign the order lines and services to
            those new orders.
        </p>
        
        <p>There are <?=$cnt_ol?> order lines and <?=$cnt_os?> order services
           that will be processed.  The customers who will get orders are:</p>
        
        
        <?php foreach($customers as $customer) { ?>
        <a href="?gp_page=customers&gp_skey=<?=$customer['skey']?>"
        ><?=$customer['customer']?></a> - <?=$customer['description']?><br/>
        <?php } ?>

        <br/>
        <br/>
        <p><a href="?gp_page=billproc&process=1"?>Process Now</a></p>
        
        <hr/>
        <h2>Print Recent Orders</h2>
        
        <p>These are the most recent batches that were generated,
           along with their most recent printing times.
        </p>
        
        <table id="x2data1">
            <thead>
            <tr>
                <th>Batch
                <th>Created
                <th>User
                <th>Last Printed
                <th>Print Now
            </thead>
        <?php
        if(count($batches)==0) {
            echo "<tr><td colspan=5><b>No Batches Available</b></td></tr>";
        }
        else {
            foreach($batches as $batch) {
                ?>
                <tr>
                <td> <?= $batch['recnum_op'];?>
                <td> <?= hDate($batch['ts_ins'])?>
                <td> <?= $batch['uid_ins']; ?>
                <td> <?= hDate($batch['date_print']); ?>
                <td> <a href="?gp_page=p_orders&batch=<?=$batch['recnum_op']?>"
                   >Print Now</a>
                <?php
            }        
        }
        echo "</table>"; 
    }
    
    # ===================================================================
    #
    # Make inquiries: find out what is available to process
    #
    # ===================================================================
    function makeInquiries() {
        // Get
        $cnt_ol = SQL_oneValue('cnt',
            "Select COUNT(*) as cnt FROM orderlines where recnum_ord is null"
        );
        $cnt_os = SQL_oneValue('cnt',
            "Select COUNT(*) as cnt FROM orderservices where recnum_ord is null"
        );
        $customers = SQL_AllRows(
            "Select cu.skey,cu.description,c.customer
               FROM customers cu
               JOIN (Select customer from orderlines where recnuM_ord is null
                     UNION
                     SELECT customer from orderservices where recnum_ord is null
                     ) c ON cu.customer = c.customer"
        );
        
        return array($cnt_ol,$cnt_os,$customers);
    }

    # ===================================================================
    #
    # Processing Code: Generate new orders
    #
    # ===================================================================
    function process() {
        // Step 0, create a new batch
        SQLX_TrxBegin();
        $row=array('skey_quiet'=>'N');
        $skey=SQLX_Insert('opbatches',$row);
        $batch = SQL_oneValue("recnum_op",
            "Select recnum_op from opbatches where skey = $skey"
        );
        
        // Step 1, create empty orders for all customers
        // that need them
        $sq="INSERT INTO ORDERS (customer,recnum_op)
             SELECT customer,$batch  from
                 ( select customer from orderlines
                    where recnum_ord is null
                   UNION
                   Select customer from orderservices
                    where recnum_ord is null) x";
        SQL($sq);
        
        // Step 2, now assign the order number to order lines and services
        $sq = "UPDATE ORDERLINES set recnum_ord = x.recnum_ord
                 FROM (SELECT recnum_ord,customer
                         FROM orders
                        WHERE recnum_op = $batch
                         )  x
                WHERE orderlines.customer = x.customer
                  AND orderlines.recnum_ord IS NULL";
        SQL($sq);
        $sq = "UPDATE ORDERSERVICES set recnum_ord = x.recnum_ord
                 FROM (SELECT recnum_ord,customer
                         FROM orders
                        WHERE recnum_op = $batch
                         )  x
                WHERE orderservices.customer = x.customer
                  AND orderservices.recnum_ord IS NULL";
        SQL($sq);
        
        // Step 3, recalculate all empty orders.  Andromeda does not
        //         yet know what to do when a foreign key changes
        $sq = "UPDATE orders SET _agg='C' where recnum_op = $batch";
        SQL($sq);
        SQLX_TrxClose();
    }
}
?>