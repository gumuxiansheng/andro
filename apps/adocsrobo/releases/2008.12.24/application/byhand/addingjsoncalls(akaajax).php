<h1>Adding JSON Calls (aka AJAX)</h1>

<p>Andromeda allows your pages to make server calls and receive
   back any combination of HTML, script, and data.  We refer
   to these calls as "JSON" calls for several reasons:
</p>

<ul><li>The default mode is actually <i>synchronous</i> 
    which is usually the Right Thing
    for database applications.  This means the "A" in AJAX does
    not apply.  (Asynchronous is also supported). 
    <li>Your Andromeda program returns JSON instead of XML, 
    so that knocks the "X" out of AJAX.
    <li>This would leave our "Synchronous Javascript and
    JSON" coming out as "SJOJ", which sounds 
    terrible, so we use "JSON" after the format of the data
    we are using.
</ul>

<span class="note">This is the only page in this documentation
   that will use the term AJAX.  The rest of the documentation
   will use the term JSON.
</span>

<h2>First Half: The HTML and Javascript</h2>

<p>Consider a page that displays the
   server's date and time when it is first loaded.  We would
   like a button for the user to click that will refresh the
   date and time without reloading the entire page.
</p>

<p>This process begins with regular Andromeda HTML, except
   that this time we code up a JSON call:
</p>

<pre>
<?php
class x6jsonexample extends androX6 {
    function x6main() {
        # Conventional HTML generation...
        $top = html('div');
        $top->h('h1','Hello JSON!');
        $top->h('p' ,'The server time is:');
        $top->h('p' ,date('r',time()));
        
        $input = $top->h('input','Refresh Time');
        $input->hp['type'] = 'button';
        $input->code['click'] = <<<JS
        function(e) {
            ua.json.init('x6page','jsonexample');
            ua.json.addParm('x6action','refreshtime');
            if(ua.json.execute()) {
                ua.json.process();
            }
        }
JS;
        $top->render();
    }
}
?>
</pre>

<p>All of the action here is in the "JS" block of text. When
   the user clicks on the INPUT, the function described there
   will be called.  
</p>

<p>The first line of the click function tells the ua.json 
   object that we are going to make a JSON call, and that our
   first parameter is named 'x6page' and the value of that
   parameter is 'jsonexample'.  This means that when the
   JSON call is actually executed, it will send back a
   parameter x6page=jsonexample, just like when a regular
   page call is made.
</p>

<p>The second specificies another parameter and is extremely
   important because <b>x6action tells Andromeda what method
   to call in your 'jsonexample' class.</b></p>

<p>The third line tells Andromeda to execute the call, and
   the call returns true (no errors), to process the results.
</p>

<p>So in short, this bit of Javascript is asking Andromeda to
   make a JSON call to the page 'jsonexample' and invoke the
   method 'refreshtime'.  Now we must see how to code up that
   method and what to put into it.
</p>

<h2>Second Half: Handling The Call</h2>

<p>Now that we have the browser trying to call back to the server,
   we have to add the "refreshtime" method to our class.  This
   is very simple:
</p>

<pre>
<?php
class x6jsonexample extends androX6 {
    function x6main() {
        # Conventional HTML generation...
        $top = html('div');
        $top->h('h1','Hello JSON!');
        $top->h('p' ,'The server time is:');
        
        # Give this element an ID, so it can be
        # refreshed.
        $p = $top->h('p' ,date('r',time()));
        $p->hp['id'] = 'the_time_paragraph';
        
        $input = $top->h('input','Refresh Time');
        $input->hp['type'] = 'button';
        $input->code['click'] = <<<JS
        function(e) {
            ua.json.init('x6page','jsonexample');
            ua.json.addParm('x6action','refreshtime');
            if(ua.json.execute()) {
                ua.json.process();
            }
        }
JS;
        $top->render();
    }
    
    # This routine handles the call
    function refreshtime() {
        x6html('the_time_paragraph',date('r',time()));
    }
}
?>
</pre>

<p>The x6html() call says to replace the innerHTML of node
   "the_time_paragraph" with the text string returned by
   date('r',time()).
</p>

<p>The x6html() call is not limited small snippets.  You can
   send back as large a chunk of HTML as your bandwidth
   can comfortably handle.
</p>

<p>You can call x6html() as often as you like in any single call,
   replacing any number of HTML elements in a single server call.
</p>



