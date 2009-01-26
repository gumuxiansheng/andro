<h1>Returning Data with JSON</h1>

<p>Andromeda allows you to send raw data back to the browser
   which can then be put to any purpose.
</p>

<p>The example below shows a routine that requests some data
   from the server, and takes the resulting data and 
   renders an HTML Table.
<p>

<pre>
<?php
class x6jsonexample extends androX6 {
    function x6main() {
        # Conventional HTML generation...
        $top = html('div');
        $top->h('h1','Hello JSON/DATA');
        
        $input = $top->h('input','Fetch Data');
        $input->hp['type'] = 'button';
        $input->code['click'] = <<<JS
        function(e) {
            ua.json.init('x6page','jsonexample');
            ua.json.addParm('x6action','gimmeData');
            if(ua.json.execute()) {
                html = '<table>';
                // The data that came back can be found
                // in "ua.data" plus the name provided by
                // the servers-side routine.
                for(var y in ua.data.exampStuff) {
                    html+='<tr>';
                    for(var x in ua.data.exampStuff[y]) {
                        html+='<td>'+ua.data.exampStuff[y][x];
                    }
                }
                html+="</table>";
                $('#put_table_here').html(html);
            }
        }
JS;
    
        $div = $top->h('div');
        $div->hp['id'] = 'put_table_here';
        $top->render();
    }
    
    # This routine handles the call
    function gimmeData() {
        $data = array(
            array('a','b','c')
           ,array('x','y','z')
           ,array('1','2','3')
           ,array( 4 , 5 , 6 )
        );
        x6data('exampStuff',$data);
    }
}
?>
</pre>

<p>All of the code in x6main should be familiar now, so we will
   concentrate on the function gimmeData(), which is invoked by
   JSON call from the browser when the user clicks the button.
</p>

<p>The example first generates an array of arrays, and then 
   goes directly to the x6data() call.  The x6data() function
   says, "here is some data to send back to the browser."
   The function has two parameters.
   The first is the name of the data element, which can be anything.
   The second is the data itself.
</p>

<p>Now looking up towards the Javascript, we see that the data we
   sent back with the name "exampStuff" can be found browser-side
   in the "ua.data" object as "ua.data.exampStuff".  After that
   it is a matter of simply recursing through the data and 
   generating a simple HTML table by way of example.
</p>

<span class="note">This is an ideal method for sending database
   rows back to the browser.  
</span>
