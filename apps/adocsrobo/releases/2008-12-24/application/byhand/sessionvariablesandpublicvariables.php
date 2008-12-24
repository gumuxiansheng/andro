<h1>Session Variables and Public Variables</h1>

<p>Andromeda follows very strictly the policy <i>never provide
   replacements to native functions unless there is a tangible
   improvement.</i>  In the case of Session variables and
   public (global) variables, Andromeda provides a few routines
   that prevent collisions between your own application and
   the Andromeda framework.
</p>

<h2>Session Variables</h2>

<p>Andromeda allows a single person to connect to multiple 
   applications on the same server without mixing up their
   session variables.  This is usually only important to programmers
   who are running multiple Andromeda programs on their own
   machine, but for those of us who do this it is a very
   nice feature that our session variables do not get all mixed
   up between the applications.
</p>

<p>You can keep your own session variables automatically
   segregrated, so that you can use the same session variable in
   two different applications and connect to them both simultaneously.
   To do this, use SessionSet() to set Session variables, and
   SessionGet() to get them.
</p>

<pre>
<?php
class x6example extends androX6 {
    function x6main() {
        # Begin by assigning two session variables
        SessionSet("VAR1",time());
        SessionSet("VAR2",rand(1000,9999));
        
        # Now retrieve these two:
        echo "<br/>Session var1 is ".SessionGet('VAR1');
        echo "<br/>Session var2 is ".SessionGet('VAR2');
    
        # This is a nifty trick, if you are not sure if
        # a session variable has been set, you can provide
        # a default value to return:
        echo "<br/>You are a superuser: ".SessionGet("SUPER","N");
    }
}
?>
</pre>

<span class="notice">Many Andromeda function allow you to specify
   a value to return if the requested value does not exist.  This
   can greatly simplify your code.
</span>

<p>The two advantages of using Andromeda's session variables are
   that they prevent naming collissions when users accesss 
   multiple apps on the same domain, and they allow you to specify
   default values for non-existent Session variables.
</p>

<h2>Global Variables</h2>

<p>Whenever you use a framework like Andromeda, and you wish to
   use global variables, there is always the chance, no matter
   how small, that there will be a naming collission between your
   globals and the framework's.  Strategies such as namespaces
   can mitigate this in the case of code, but the fundamental
   problem always remains.
</p>

<p>Andromeda provides the functions vgaSet() and vgaGet() for
   setting the values of public variables that are guaranteed
   not to collide with framework variables, or the variables of
   any PEAR packages or any other library that you choose to
   use.
</p>

<pre>
<?php
class x6example extends androX6 {
    function x6main() {
        # Set two public variables to be retrieved later
        vgaSet("VAR1",time());
        vgaSet("VAR2",rand(1000,9999));
        
        # Now retrieve these two:
        echo "<br/>Global var1 is ".vgaGet('VAR1');
        echo "<br/>Global var2 is ".vgaGet('VAR2');
    
        # This is another spot where you can specify a 
        # default value if upstream code has failed to
        # create the variable.
        echo "<br/>You are a subscribed: ".vgaGet("subscribed","N");
    }
}
?>
</pre>

