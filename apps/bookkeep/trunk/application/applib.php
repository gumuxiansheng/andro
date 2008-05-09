<?php
# ======================================================================
#   (C) Copyright 2005 by Secure Data Software, Inc.
#   
#  "BOOKKEEP" is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.
#
#   BOOKKEEP is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU General Public License for more details.
#
#   You should have received a copy of the GNU General Public License
#   along with BOOKKEEP; if not, write to the Free Software
#   Foundation, Inc., 51 Franklin St, Fifth Floor,
#   Boston, MA  02110-1301  USA 
#   or visit http://www.gnu.org/licenses/gpl.html
#
# ======================================================================

# ======================================================================
# PROGRAM: APPLIB.PHP
#
# This is the application level library.  It is included in GLOBAL
# scope near the top of every web request.  Any code placed here will
# be executed after the GP variables are processed but before there
# is a database connection.  Any functions or classes placed here are
# availably to your entire application.
# ======================================================================
# This says go to x4menu after login, don't go to x_welcome
#
#vgfset('x4Welcome',true);
#
# Put an x4 menu on top if you are on an x4 page 
# 
vgfset('x4menu',true);

#  Put out some links to activate or de-activate x4
#
function appModuleLeft() {
    if(!LoggedIn()) return;
    ?>
    <div class="moduletable">
    <h3>Extended Desktop</h3>
    <br/>
    <p>You are currently in "classic" Andromeda mode.  This mode is suitable
       for low-volume administration interfaces, it expects regular use of
       the mouse and many actions require a round trip to the server.
    </p>
    
    <p>The Extended Desktop interface is for high-volume data entry and
       administration.  It emphasizes complete
       keyboard functionality,
       and ajax-based responsiveness.  These give the user the
       much-coveted "desktop" feel.
    </p>

    <p>
    <center>
    <a href="?x4Page=menu">Click Here For Extended Desktop</a>
    </center>
    </p>
    <br/>
    
    
    </div>
    <?php
    return false;
}
?>
