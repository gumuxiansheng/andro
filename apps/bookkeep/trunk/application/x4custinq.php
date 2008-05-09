<?php 
class x4customers extends androX4 {
    
    function browse() {
        $ddcust   = ddTable("customers");
        
        $div   = html('div');
        $h1    = html('h1',$div,'Custom Order Inquiry');
        
        $table = html('table',$div);
        $tr    = html('tr',$table);
        $tdleft= html('td',$tr);
        
        // Hardcoded column on left of screen
        $tabindex = 1000;
        $x   = html('div',$tdleft,'Account:');
        $inp = html('input',$tdleft); 
        $inp->hp['class']     = 'x4browseinput x4input'; 
        $inp->hp['tabindex']  = ++$tabindex;
        $inp->ap['x_tabindex']  = $tabindex;
        $inp->hp['id'] = 'search_customer';
        $x = html('br',$tdleft);
        $x = html('br',$tdleft);
        $inputs[] = $inp->hp['id'];
            
        $x   = html('div',$tdleft,'Cust Name:');
        $inp = html('input',$tdleft); 
        $inp->hp['class']     = 'x4browseinput x4input'; 
        $inp->hp['tabindex']  = ++$tabindex;
        $inp->ap['x_tabindex']  = $tabindex;
        $inp->hp['id'] = 'search_description';
        $x = html('br',$tdleft);
        $x = html('br',$tdleft);
        $inputs[] = $inp->hp['id'];
        
        $x   = html('div',$tdleft,'Order:');
        $inp = html('input',$tdleft); 
        $inp->hp['class']     = 'x4browseinput x4input'; 
        $inp->hp['tabindex']  = ++$tabindex;
        $inp->ap['x_tabindex']  = $tabindex;
        $inp->hp['id'] = 'search_address1';
        $x = html('br',$tdleft);
        $x = html('br',$tdleft);
        $inputs[] = $inp->hp['id'];


        $tdright = html('td',$tr);
        $tab2 = html('table',$tdright);
        $tbody= html('tbody',$tab2);
        $tbody->hp['id'] = 'x4browsetbody';
        
        $details= array(
            'table_id'=>gp('x4Page')
            ,'returnAll'=>$this->table['returnall']
        );
        
        // Now put out the HTML...
        jsonHtml('*MAIN*',$div->bufferedRender());
        // ...and then put out the data
        jsonData('inputs',$inputs);
        jsonData('details',$details);
        jsonData('dd',$this->table);
    }
}
?>
