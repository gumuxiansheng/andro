<?php
class x4configinst extends androX4 {
    # =================================================================
    # Area 1: 
    # =================================================================
    function mainLayout($container) {
        $this->mainScript();
        $top = $container;
        
        # Pull the values
        $row = SQL_OneRow("Select * from ".$this->table_id);
        
        # Basic information at top
        html('h1',$top,'Instance Configuration');
        html('p',$top,'Any changes made here will take immediate 
            effect for all users of this program, except where a user
            has configured their own preferred setting.');

        # Set up titles
        $table = html('table',$top);
        $table->hp['id'] = 'x2data1';
        $thead = html('thead',$table);
        $tr    = html('tr',$thead);
        $td    = html('th',$tr,'Setting');
        $td    = html('th',$tr,'Instance Value');
        $td    = html('th',$tr,'Default Value');
        $td    = html('th',$tr,'&nbsp;');
        
        # Now put out inputs for each one
        $tbody = html('tbody',$table);
        $askip = array('recnum','_agg','skey_quiet','skey');
        foreach($this->flat as $column_id =>$colinfo) {
            if(in_array($column_id,$askip)) continue;
            $tr = html('tr',$tbody);
            $tr->hp['id'] = 'tr_'.$column_id;
            $tr->SetAsParent();
            $td = html('td',$tr,$colinfo['description']);
            
            # the input
            $input = input($colinfo);
            if($colinfo['type_id']=='text') 
                $input->setHTML($row[$column_id]);
            else
                $input->hp['value'] = $row[$column_id];
            $input->hp['onchange'] = 'instaSave(this)';
            $input->hp['id'] = 'inp_'.$column_id;
            $input->ap['skey'] = $row['skey'];
            $td = html('td',$tr);
            $td->addChild($input);
            
            # The default value
            $td = html('td',$tr
                ,ConfigGet($column_id,'*null*',array('user','inst'))
            );
            $td->hp['id']='def_'.$column_id;
            
            # The reset 
            $td = html('td',$tr);
            $button = html('a-void',$td,'Use Default');
            $button->hp['onclick'] = "makeDefault('$column_id')";
        }
    }
    
    
    # =================================================================
    # This class just contains skeleton code that calls
    # library routines.  The class x4configuser calls the
    # same routines
    # =================================================================
    function mainScript() {
        ob_start();
        ?>
        <script>
        window.instaSave = function(obj) {
            $a.json.init('x4Page','configinst');
            $a.json.addParm('skey'  ,$a.p(obj,'skey'));
            $a.json.addParm('column',$a.p(obj,'xColumnId'));
            $a.json.addParm('value' ,encodeURIComponent(obj.value));
            $a.json.addParm('x4Action','instasave');
            
            if($a.json.execute()) {
                $a.json.process();
            }
        }
        
        window.makeDefault = function(id) {
            var obj = $a.byId('inp_'+id);
            obj.value = '';
            $a.json.init('x4Page','configinst');
            $a.json.addParm('skey'  ,$a.p(obj,'skey'));
            $a.json.addParm('column',$a.p(obj,'xColumnId'));
            $a.json.addParm('x4Action','makeDefault');
            
            if($a.json.execute()) {
                $a.json.process();
            }
        }
        </script>
        <?php
        x4Script(ob_get_clean());
    }
    
    function instaSave() {
        $val = trim(urldecode(gp('value')));
        $row = array(
            'skey'=>gp('skey')
            ,gp('column')=>$val
        );
        SQLX_Update('configinst',$row);
        configWrite('inst');        
    }

    function makeDefault() {
        $col = SQLFN(gp('column'));
        $skey= SQLFN(gp('skey'));
        SQL("update configinst set $col = null WHERE skey = $skey");
        configWrite('inst');        
    }
}
?>