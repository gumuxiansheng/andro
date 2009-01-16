/* ================================================================== *\
   (C) Copyright 2008 by Secure Data Software, Inc.
   This file is part of Andromeda
   
   Andromeda is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2 of the License, or
   (at your option) any later version.

   Andromeda is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with Andromeda; if not, write to the Free Software
   Foundation, Inc., 51 Franklin St, Fifth Floor,
   Boston, MA  02110-1301  USA 
   or visit http://www.gnu.org/licenses/gpl.html
\* ================================================================== */

// KFD 12/30/08, establish the browser's name
if(navigator.appName=='Microsoft Internet Explorer') {
    window.androIsIE = true;
}
else {
    window.androIsIE = false;
}


/* **************************************************************** *\

   Cookie functions.
   
   Thanks to the amazing quirksmode site:
   http://www.quirksmode.org/js/cookies.html
   
\* **************************************************************** */
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

/* **************************************************************** *\


   Cross Browser selectionStart/selectionEnd
   Version 0.2
   Copyright (c) 2005-2007 KOSEKI Kengo
 
   This script is distributed under the MIT licence.
   http://www.opensource.org/licenses/mit-license.php
   
   Notes from KFD:
   Explained at: http://www.teria.com/~koseki/memo/xbselection/
   Download    : http://www.teria.com/~koseki/memo/xbselection/Selection.js

\* **************************************************************** */

function Selection(textareaElement) {
    this.element = textareaElement;
}

Selection.prototype.create = function() {
    if (document.selection != null && this.element.selectionStart == null) {
        return this._ieGetSelection();
    } else {
        return this._mozillaGetSelection();
    }
}

Selection.prototype._mozillaGetSelection = function() {
    return { 
        start: this.element.selectionStart, 
        end: this.element.selectionEnd 
    };
}

Selection.prototype._ieGetSelection = function() {
    this.element.focus();

    var range = document.selection.createRange();
    var bookmark = range.getBookmark();

    var contents = this.element.value;
    var originalContents = contents;
    var marker = this._createSelectionMarker();
    while(contents.indexOf(marker) != -1) {
        marker = this._createSelectionMarker();
    }

    var parent = range.parentElement();
    if (parent == null || parent.type != "textarea") {
        return { start: 0, end: 0 };
    }
    range.text = marker + range.text + marker;
    contents = this.element.value;

    var result = {};
    result.start = contents.indexOf(marker);
    contents = contents.replace(marker, "");
    result.end = contents.indexOf(marker);

    this.element.value = originalContents;
    range.moveToBookmark(bookmark);
    range.select();

    return result;
}

Selection.prototype._createSelectionMarker = function() {
    return "##SELECTION_MARKER_" + Math.random() + "##";
}

/* **************************************************************** *\

   Javasript Language Extensions
   
\* **************************************************************** */


/****M* Javascript-API/Date-Extensions
*
* NAME
*   Date-Extensions
*
* FUNCTION
*   Javascript lacks a handful of useful date functions, 
*   such as returning the day of the week as a string.
*   These extensions to the Date object provide those
*   facilities.
*
******
*/

/****m* Date-Extensions/getDow
*
* NAME
*   Date.getDow
*
* FUNCTION
*   The Javascript method Date.getDow returns the day of
*   the week as a string.
*
*   If logical true is passed for the first parameter,
*   a 3-digit abbreviation is returned, using 'Thu' for
*   Thursday.
*
* INPUTS
*   boolean - If true, returns a 3-digit abbreviation
*
*
* SOURCE
*
*/
Date.prototype.getDow = function(makeItShort) {
    var days = ['Sunday','Monday','Tuesday','Wednesday'
        ,'Thursday','Friday','Saturday'
    ];
    var retval = days[this.getDay()];
    if(makeItShort) {
        return retval.slice(0,3);
    }
    return retval;
}
/******/


/****M* Javascript-API/String-Extensions
*
* NAME
*   String-Extensions
*
* FUNCTION
*   Javascript lacks a handful of useful string functions, 
*   such as padding and trimming, which we have added
*   to our standard library.
*
******
*/


/****m* String-Extensions/trim
*
* NAME
*   String.trim
*
* FUNCTION
*   The Javascript function trim removes leading and trailing
*   spaces from a string.
*
* EXAMPLE
*   Example usage:
*     var x = '  abc  ';
*     var y = x.trim();  // returns 'abc'
*
* SOURCE
*/
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}
/******/

/****m* String-Extensions/ltrim
*
* NAME
*   String.ltrim
*
* FUNCTION
*   The Javascript function ltrim removes leading spaces
*   from a string (spaces on the left side).
*
* EXAMPLE
*   Example usage:
*     var x = '  abc  ';
*     var y = x.ltrim();  // returns 'abc  '
*
* SOURCE
*/
String.prototype.ltrim = function() {
	return this.replace(/^\s+/,"");
}
/******/

/****m* String-Extensions/rtrim
*
* NAME
*   String.rtrim
*
* FUNCTION
*   The Javascript function rtrim removes trailing spaces
*   from a string (spaces on the right side).
*
* EXAMPLE
*   Example usage:
*     var x = '  abc  ';
*     var y = x.ltrim();  // returns '  abc'
*
* SOURCE
*/
String.prototype.rtrim = function() {
	return this.replace(/\s+$/,"");
}
/******/


/****m* String-Extensions/pad
*
* NAME
*   String.pad
*
* FUNCTION
*   The Javascript function pad pads out a string to a given
*   length on either left or right with any character.
*
* INPUTS
*   int - the size of the resulting string
*
*   string - the string that should be added.  You can provide
*   a string of more than one character.  The resulting string
*   will be clipped to ensure it is returned at the requested
*   size.
*
*   character - either an 'L' or left padding or an 'R' for
*   right padding.
*
* EXAMPLE
*   Example usage:
*     var x = 'abc';
*     var y = x.pad(6,'0','L');  // returns '000abc';
*
* SOURCE
*/
String.prototype.pad = function(size,character,where) {
    var val = this;
    while(val.length < size) {
        if(where == 'L') 
            val = character + val;
        else
            val += character;
        if(val.length > size) {
            val = val.slice(0,size);
        }
    }
    return val;
}
/******/


// Taken from http://www.sourcesnippets.com/javascript-string-pad.html
var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;
 
String.prototype.strpad = function(str, len, pad, dir) {
 
    str = String(str);
	if (typeof(len) == "undefined") { var len = 0; }
	if (typeof(pad) == "undefined") { var pad = ' '; }
	if (typeof(dir) == "undefined") { var dir = STR_PAD_RIGHT; }
 
	if (len + 1 >= str.length) {
 
		switch (dir){
 
			case STR_PAD_LEFT:
				str = Array(len + 1 - str.length).join(pad) + str;
			break;
 
			case STR_PAD_BOTH:
				var right = Math.ceil((padlen = len - str.length) / 2);
				var left = padlen - right;
				str = Array(left+1).join(pad) + str + Array(right+1).join(pad);
			break;
 
			default:
				str = str + Array(len + 1 - str.length).join(pad);
			break;
 
		} // switch
 
	}
 
	return str;
 
}

String.prototype.pad = function(len, pad, dir) {
 
    str = this.toString();
	if (typeof(len) == "undefined") { var len = 0; }
	if (typeof(pad) == "undefined") { var pad = ' '; }
	if (typeof(dir) == "undefined") { var dir = STR_PAD_RIGHT; }
 
	if (len + 1 >= str.length) {
 
		switch (dir){
 
			case STR_PAD_LEFT:
				str = Array(len + 1 - str.length).join(pad) + str;
			break;
 
			case STR_PAD_BOTH:
				var right = Math.ceil((padlen = len - str.length) / 2);
				var left = padlen - right;
				str = Array(left+1).join(pad) + str + Array(right+1).join(pad);
			break;
 
			default:
				str = str + Array(len + 1 - str.length).join(pad);
			break;
 
		} // switch
 
	}
 
	return str;
 
}

/****m* String-Extensions/repeat
*
* NAME
*   String.repeat
*
* FUNCTION
*   The Javascript function repeat returns the input string
*   repeated any number of times
*
* INPUTS
*   * int - the number of times to repeat the string.
*
*
* EXAMPLE
*   Example usage:
*     alert( 'abc'.repeat(3));
*
* SOURCE
*/
String.prototype.repeat = function(count) {
    if(count==null) count = 1;
    retval = '';
    for(var x = 1; x<= count; x++) {
        retval+= this;
    }
    return retval;
}
/******/

/****m* String-Extensions/htmlDisplay
*
* NAME
*   String.htmlDisplay
*
* FUNCTION
*   The Javascript function htmlDisplay converts the HTML
*   characters ampersand '&amp;', less than '&lt;' and
*   greater-than '&gt;' to their HTML entities equivalents
*   for safe display.
*
*   The reverse function is htmlEdit.
*
* SOURCE
*/
String.prototype.htmlDisplay = function() {
    return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
/******/

/****m* String-Extensions/htmlEdit
*
* NAME
*   String.htmlEdit
*
* FUNCTION
*   The Javascript function htmlEdit removes HTML entities 
*   from a string and replaces them with literal characters,
*   suitable for editing in an input.  The characters replaced
*   are ampersand '&amp;', less-than '&lt;', greater-than '&gt;'
*   and non-breaking space '&amp;nbsp;'.
*
* SOURCE
*/
String.prototype.htmlEdit = function() {
    return this.replace(/&amp;/g,'&')
        .replace(/&lt;/g,'<')
        .replace(/&gt;/g,'>')
        .replace(/&nbsp;/g,' ');
}
/******/

/* ---------------------------------------------------- *\

   FIX BRAIN-DAMAGED INTERNET EXPLORER  
   
\* ---------------------------------------------------- */

if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            }
        }
        return -1;
    }
}


  
/* **************************************************************** *\

   X6 Object
   
\* **************************************************************** */
var x6 = {
    // KFD 1/15/09. The options sub-object will control
    //              various behaviors.  The PHP code must
    //              send commands to set options, the javascript
    //              will not try to figure them out or do
    //              anything 'smart'.
    options: {
        get: function(optName,defValue) {
            return typeof(this[optName])=='undefined'
                ? defValue
                : this[optName];
        },
        set: function(optName,optValue) {
            this[optName] = optValue;
        },
        
        navOnEnter: false
    },
    
    // A list of keyboard events that is allowed when a modal
    // dialog is up.  False means allow all, an array would list
    // what is allowed, and an empty array allows none.
    dialogsAllow: false,
    
    // Find all plugins in the x6plugins object.  Find all
    // DOM elements with property x6plugIn=xxx.  
    // Invoke the constructor for each one.
    init: function() {
        // Activate a global keyboard handler
        // SEE ALSO: input.keyDown(), it must also pass some
        //           events to keyDispatcher that don't go to
        //           the document.keypress from an input
        // KFD 1/15/09.  Major problem.  IE does not recognize keypress
        //               for meta keys at document level, so we have to
        //               use keydown.  But firefox has one very specific
        //               problem: if you hit ESC while a control has
        //               focus and change the value of the control in
        //               a document.keydown, it gets changed back!
        //               So firefox must remain keypress and IE keydown
        if(window.androIsIE) {
            $(document).keydown(function(e) {
                    //e = e ? e : window.event;
                    x6.console.group("Document Keydown");
                    if(x6bb.fwGet('noKeyPress',false)==true) {
                        x6.console.log("noKeyPress was set, ignoring");
                        x6bb.fwSet('noKeyPress',false);
                    }
                    else {
                        // no log entry, key dispatcher does that
                        var retval= x6.keyDispatcher(e);
                    }
                    x6.console.groupEnd(); 
                    return retval;
            });
        }
        else {
            $(document).keypress(function(e) {
                    //e = e ? e : window.event;
                    x6.console.group("Document Keydown");
                    if(x6bb.fwGet('noKeyPress',false)==true) {
                        x6.console.log("noKeyPress was set, ignoring");
                        x6bb.fwSet('noKeyPress',false);
                    }
                    else {
                        // no log entry, key dispatcher does that
                        var retval= x6.keyDispatcher(e);
                    }
                    x6.console.groupEnd(); 
                    return retval;
            });
        }
        
        // Put little buttons next to stuff
        $(':input').each(function() { x6inputs.x6select.addButton(this); });
    },
    
    // Initialize an object that has been sent from the server
    initOne: function(id) {
        var obj = x6.byId(id);
        var pin = x6.p(obj,'x6plugin');
        obj.zTable = x6.p(obj,'x6table');
        x6.console.log(pin,obj.zTable);
        x6.console.log(obj);
        x6plugins[pin](obj,obj.id,obj.zTable);
    },
    
    initFocus: function() {
        var str   = ':input:not([disabled]):not([type=hidden])';
        this.jqSetFocus(str);
    },
    
    jqSetFocus: function(jqString) {
        x6.console.log("in jqSetFocus, string: ",jqString);
        var x = $(jqString);
        if(x.length>0) {
            // KFD 12/30/08, awful IE hack for grids, we get some
            //               inputs in there that are not real,
            //               probably related to the zRowEditHtml
            //               property, who knows really;
            if(!window.androIsIE) {
                x[0].focus();
            }
            else {
                var z=0;
                while(z < x.length) {
                    if(x6.p(x[z],'id','').trim()!='') break;
                    z++;
                }
                if(x6.p(x[z],'id','').trim() !='') {
                    x[z].focus();
                }
            }
        }
    },
    
    // Keyboard handler
    keyDispatcher: function(e) {
        x6.console.group("Document Level Key Dispatching");
        var retval = x6.keyLabel(e);
        
        // Possible trapping because of modal dialogs
        if(typeof(x6dialogsAllow)=='object') {
            if(x6dialogsAllow.indexOf(retval) == -1) {
                e.stopPropagation();
                return false;
            }
        }
        
        // Trap IE/Firefox refresh buttons so they work
        // the same on both platforms.
        if(retval=='ShiftF5' && !window.androIsIE) {
            window.location.reload(true);
        }
        if(retval=='CtrlF5' && window.androIsIE) {
            window.location.reload(true);
        }
        
        
        // Make list of keys to stop no matter what
        var stopThem = [ 'CtrlF5', 'F10' ];
        
        var noPropagate = [
            'CtrlS', 'CtrlN', 'CtrlI', 'CtrlD',
            'CtrlL', 'CtrlO', 'CtrlW', 'CtrlP',
            'CtrlQ', 'CtrlR', 'CtrlU', 'CtrlK',
            'CtrlY',
            'DownArrow','UpArrow'
        ];
        
        // Set a flag now.  If user hit ESC, we are trying
        // to exit the screen, unless somebody tells us we
        // cannot do so.
        if(retval=='Esc') {
            x6.console.log("Esc key pressed, pre-seting exitApproved=true");
            x6bb.fwSet('exitApproved',true);
        }
        
        // Now we have a complete key label, fire the event
        if(stopThem.indexOf(retval)>0) {
            x6.console.log("x6.keyDispatch: key is in force stop list, stopping propagation.");
            x6.console.groupEnd();
            e.stopPropagation();
            return false;
        }
        else {
            var eventRetVal = x6events.fireEvent('key_'+retval,retval);
            // ESC key is special, we need to know the retval
            // for that, because if it came back true we will exit,
            // but otherwise we cannot.
            if(retval=='Esc') {
                var exitApproved = x6bb.fwGet('exitApproved',false);
                x6.console.log("Key dispatch, ESC, exitapproved: ",exitApproved);
                if(exitApproved) {
                    x6.console.log("exit for ESC was approved, going to menu");
                    setTimeout(
                        function() {
                            var x6page_prior=x6.p(x6.byId('x6page'),'value');
                            var x6mod_prior =x6.p(x6.byId('x6module'),'value');
                            var str = '?x6page=menu'
                                +'&x6page_prior='+x6page_prior
                                +'&x6mod_prior='+x6mod_prior;
                            //window.location.replace(str);
                        }
                        ,10
                    );
                }
            }
            else {
                // All othere keys in the no-propagate list are
                // stopped here.
                if(noPropagate.indexOf(retval)>=0) {
                    x6.console.log("In no propagate list, stopping");
                    x6.console.groupEnd();
                    e.stopPropagation();
                    return false;
                }
                else {
                    x6.console.log("Key dispatch returning true");
                    x6.console.groupEnd();
                    return true;
                }
            }
        }
        x6.console.log("key dispatch finished, returning true");
        x6.console.groupEnd();
        return true;
    },
    
    
    
    /*
    *  The console object starts out with do-nothing functions.
    *  These are replaced if the console object exists.
    */
    console: {
        enabled:       false, 
        enableLog:     false,
        enableWarn:    false,
        enableInfo:    false,
        enableError:   false,
        enableTime:    false,
        enableGroup:   false,
        enableProfile: false,
        enableOutline: function() {
            this.enableTime  = true;
            this.enableGroup = true;
            this.enableProfile=true;
        },
        enableAll: function() {
            var retVal = this.enableLog;
            this.enableLog   = true;
            this.enableWarn  = true;
            this.enableInfo  = true;
            this.enableError = true;
            this.enableTime  = true;
            this.enableGroup = true;
            this.enableProfile=true;
            return retVal;
        },
        disableAll: function(wasEnabled) {
            if(wasEnabled==null) wasEnabled = false;
            if(wasEnabled) return;
            this.enableLog   = false;
            this.enableWarn  = false;
            this.enableInfo  = false;
            this.enableError = false;
            this.enableTime  = false;
            this.enableGroup = false;
            this.enableProfile=false;
        },
        indent:  '',
        log:     function(args) { },
        warn:    function(args) { },   
        info:    function(args) { },   
        error:   function(args) { },
        time:    function(args) { },
        timeEnd: function(args) { },
        group:   function(args) { },
        groupEnd:function(args) { },
        _log:     function(fnname,x1,x2,x3,x4,x5,x6,x7) {
            if(typeof(x1)=='string') x1 = this.indent + x1;
            if(typeof(x2)=='undefined') 
                console[fnname](x1);
            else if (typeof(x3)=='undefined')
                console[fnname](x1,x2);
            else if (typeof(x4)=='undefined')
                console[fnname](x1,x2,x3);
            else if (typeof(x5)=='undefined')
                console[fnname](x1,x2,x3,x4);
            else if (typeof(x6)=='undefined')
                console[fnname](x1,x2,x3,x4,x5);
            else if (typeof(x7)=='undefined')
                console[fnname](x1,x2,x3,x4,x5,x6);
            else
                console[fnname](x1,x2,x3,x4,x5,x6,x7);
        }   
    },
    
    /* KFD 11/26/08
       EXPERIMENTAL
       Put here because there is already one in ua, where it
       really does not belong.
       Originally used by x6inputs.keydown to figure things out
    */
    metaKeys: {
        8: 'BackSpace',
        9: 'Tab',
        13: 'Enter',
        16: 'Shift',
        17: 'Ctrl',
        18: 'Alt',
        20: 'CapsLock',
        27: 'Esc',
        33: 'PageUp',
        34: 'PageDown',
        35: 'End',
        36: 'Home',
        37: 'LeftArrow',
        38: 'UpArrow',
        39: 'RightArrow',
        40: 'DownArrow',
        45: 'Insert',
        46: 'Delete',
        112: 'F1' ,
        113: 'F2' ,
        114: 'F3' ,
        115: 'F4' ,
        116: 'F5' ,
        117: 'F6' ,
        118: 'F7' ,
        119: 'F8' ,
        120: 'F9' ,
        121: 'F10',
        122: 'F11',
        123: 'F12'
    },
    keyLabel: function(e) {
        x6.console.group("Key Label processing, event follows");
        x6.console.log(e);
        // if e.originalEvent is defined, this is a jQuery event.
        // jQuery events have charCode for non-meta keys, and they
        // shift the alphabet up by 32 characters for no good reason
        // at all.  
        if(e.originalEvent) {
            x6.console.log("e.originalEvent exists, this is jQuery");
            if(e.charCode >= 97 && e.charCode <= 122) {
                var x = e.charCode - 32;
                x6.console.log(
                    "Taking charCode and subtracting 32:",e.charCode,x
                );
            }
            else if(e.charCode != 0 && e.charCode != null) {
                x6.console.log("Taking charCode ",e.charCode);
                var x = e.charCode
            }
            else {
                x6.console.log("Taking keyCode ",e.keyCode);
                var x = e.keyCode;
            }
        }
        else {
            x6.console.log("Taking keyCode ",e.keyCode);
            var x = e.keyCode;
        }
        x6.console.log("Proceeding with this code: ",x);
        
        x4Keys = this.metaKeys;
    
        // If they hit one of the control keys, check for
        // Shift, Ctrl, or Alt
        var retval = '';
        if(typeof(x4Keys[x])!='undefined') {
            retval = x4Keys[x];
            if(e.ctrlKey)  retval = 'Ctrl'  + retval;
            if(e.altKey)   retval = 'Alt'   + retval;
            if(e.shiftKey) retval = 'Shift' + retval;
            x6.console.log("Found meta-key, returning: ",retval);
            x6.console.groupEnd();
            return retval;
        }
        
        // If letters we look at shift key and return
        // upper or lower case
        if(x >= 65 && x <= 90) {
            if(e.shiftKey || e.ctrlKey || e.altKey) {
                var letters = 
                    [ 'A', 'B', 'C', 'D', 'E', 'F', 'G',
                      'H', 'I', 'J', 'K', 'L', 'M', 'N',
                      'O', 'P', 'Q', 'R', 'S', 'T', 'U',
                      'V', 'W', 'X', 'Y', 'Z' ];
            }
            else {
                var letters = 
                    [ 'a', 'b', 'c', 'd', 'e', 'f', 'g',
                      'h', 'i', 'j', 'k', 'l', 'm', 'n',
                      'o', 'p', 'q', 'r', 's', 't', 'u',
                      'v', 'w', 'x', 'y', 'z' ];
            }
            var retval = letters[x - 65];
            if(e.ctrlKey)  retval = 'Ctrl'  + retval;
            if(e.altKey)   retval = 'Alt'   + retval;
            x6.console.log("Found letter, returning: ",retval);
            x6.console.groupEnd();
            return retval;
        }
        else if( x >= 96 && x <= 105 ) {
            var numbers = [ '0','1','2','3','4','5','6','7','8','9' ];
            var retval = numbers[x - 96];
            x6.console.log("number pad number, returning: ",retval);
        }
        else if(x >= 48 && x <= 57) {
            if(e.shiftKey) {
                var numbers = [ ')','!','@','#','$','%','^','&','*','(' ];
            }
            else {
                var numbers = [ '0','1','2','3','4','5','6','7','8','9' ];
            }
            var retval = numbers[x - 48];
            if(e.ctrlKey)  retval = 'Ctrl'  + retval;
            if(e.altKey)   retval = 'Alt'   + retval;
            x6.console.log("Found number, returning: ",retval);
            return retval;
        }
        else {
            var lastChance = {
                192: '`',
                109: '-',
                61:  '=',
                219: '[',
                221: ']',
                220: '\\',
                188: ',',
                190: '.',
                191: '/',
                59:  ';',
                222: "'",
                // special keys on number pad follow:
                106: '*',
                107: '+',
                110: '.',
                111: '/'
                
            }
            if(typeof(lastChance[x])!='undefined') {
                if(e.shiftKey) {
                    var lastChance = {
                        192: '~',
                        109: '_',
                        61:  '+',
                        219: '{',
                        221: '}',
                        220: '|',
                        188: '<',
                        190: '>',
                        191: '?',
                        59:  ':',
                        222: '"'
                    }
                }
                var retval = lastChance[x];
                x6.console.log("Found 'last chance' character, returning: ",retval);
                return retval;
            }
        }
        
        x6.console.groupEnd();
        return retval;
    },
    
    keyIsNumeric: function(e) {
        var keyLabel = this.keyLabel(e);
        var numbers = [ '0','1','2','3','4','5','6','7','8','9' ];
        return numbers.indexOf(keyLabel)>=0;
    },
    
    keyIsMeta: function(e) {
        var code = e.keyCode || e.charCode;
        return typeof(this.metaKeys[code])!='undefined';
    },
    
    /****m* x6/uniqueId
    * NAME
    *   x6.uniqueId
    *
    * FUNCTION
    *   Generates a random number between 1 and 1,000,000 that is
    *   not being used as the ID for any DOM object.  Useful for
    *   generating unique and content-free Id's for DOM objects.
    *
    * EXAMPLE
    *   Example usage would be:
    *
    *     var x = document.createElement('div');
    *     x.id = x6.uniqueId();
    *
    * RESULT
    *   id - returns the id
    *
    * SOURCE
    */
    uniqueId: function() {
        var retval = 0;
        while( $('#'+retval).length > 1  || retval==0) {
            var retval=Math.floor(Math.random()*1000000);
        }
        return retval;
    },
    /******/
    
    /*
    *  KFD 1/13/09.  We put this here so we do not have to
    *                load up androLib.js anymore.  We will
    *                gradually eliminate use of this function
    *                and make it go away.  We will use
    *                $(id)... instead.
    */
    byId: function(id) {
        return document.getElementById(id );
    },
    
    p: function(obj,propname,defvalue) {
        if(typeof(obj)!='object') {
            return defvalue;
        }
        
        // First try, maybe it is a direct property
        if(typeof(obj[propname])!='undefined') {
            return obj[propname];
        }
        // Second try, maybe it is an attribute
        if(obj.getAttribute) {
            if(obj.getAttribute(propname)!=null) {
                return obj.getAttribute(propname);
            }
        }
        // Give up, return the defvalue
        return defvalue;
    },
    
    openWindow: function(url) {
        window.open(url);
    },
    
    /****O* ua/json
    *
    * NAME
    *   x6.json
    *
    * FUNCTION
    *   The Javascript object x6.json is used to send any request
    *   to the web server, either for a new complete page or for
    *   data and HTML fragments.
    *   Examples include requesting a single row from a table,
    *   requesting search results, fetching HTML fragments, or
    *   popping up a new window.
    *
    *   Andromeda uses the term JSON instead of AJAX because 
    *   the term AJAX does not describe how Andromeda works.
    *   Specifically, Andromeda PHP pages return JSON data
    *   instead of XML (hence no "X" in AJA"X"), and many calls
    *   are actually synchronous (hence no "A" in "A"JAX).
    *
    *   The x6.json object is always present on all pages, and
    *   you can use it in Javascript code on any custom page.
    *
    * NOTES
    *   Andromeda handles all of the values returned in the
    *   request automatically.  On custom pages you do not have
    *   to code a response handler because Andromeda handles
    *   the response for you.
    *
    *   The PHP code that handles a JSON request sends data back
    *   by using the routines x4Debug, x4Data, x4HTML, x4Script,
    *   x4Error.  While the complete PHP-API documentation on
    *   those functions will give you most of what you need, we
    *   must note here how the returned data is handled:
    *   * x4Debug - ignored, but you can examine the results in
    *     firebug.
    *   * x4Error - any errors sent back by this function are reported
    *     to the user and x6.json.execute returns false.
    *   * x4HTML - calls to this function in PHP code provide an 
    *     element Id and a fragment of HTML.  The HTML replaces the
    *     innerHTML of the specific item.
    *   * x4Data - calls to this function in PHP code provide a name
    *     and some data value (including arrays and objects).  The
    *     result can be examined when the call completes in x6.data.<name>.
    *   * x4Script - provides script that should execute on the browser
    *     when the call returns.
    *
    * EXAMPLE
    *
    *   The basic usage of x6.json is to initialize a call 
    *   with x6.json.init, and then to add parameters with
    *   x6.json.addParm, and finally to execute and process the
    *   call with x6.json.execute and x6.json.process.
    *
    *   There are also special-purpose methods like x6.json.inputs
    *   that will take all of the inputs inside of an object and
    *   add them to the request.
    *
    *   You can also use the function x6.json.windowLocation to
    *   execute the call as a new page request, and x6.json.newWindow
    *   to execute the call as a new page request in a tab.
    *  
    *      <script>
    *      // Initialize the call
    *      x6.json.init('x4Page','myCustomPage'); 
    *      // Name the server-side PHP method to call
    *      x6.json.addParm('x4Action','getSomething'); 
    *      // Add some parms
    *      x6.json.addParm('parm1','value');
    *      x6.json.addParm('parm2','value');
    *      // Execute and process in one step.  Note that this
    *      // is synchronous, there is no need for a callback
    *      // function.
    *      x6.json.execute(true);
    *     
    *      for(var x in x6.data.returnedStuff) {
    *        ....
    *      }
    *      </script>
    *
    *  This call requires an Extended-Desktop page to be defined
    *  in PHP that will service the request.  A super-simple example
    *  is here, more information is provided in the
    *  Extended-Desktop documentation.
    *
    *      <?php
    *      # This is file application/x4MyCustomPage.php
    *      class x4MyCustomPage extends androX4 {
    *          # this function handles the call given above
    *          function getSomething() {
    *               $parm1 = gp('parm1');
    *               $parm2 = gp('parm2');
    *               $sql = "Select blah blah blah";
    *               $rows = SQL_AllRows($sql);
    *               x4Data('returnedStuff',$rows
    *          }
    *      }
    *      ?>
    *
    *   Sometimes you make a call that returns replacement HTML
    *   for a single object.  In this case your PHP code supplies
    *   the HTML by calling x4HTML with the value of '*MAIN*' for
    *   the first parameter, as in x4HTML('*MAIN*',$html);
    *   Such a call is handled this way in script:
    *
    *      <script>
    *      x6.json.init('x4Page','myCustomPage');
    *
    *      // We need the conditional in case the server returns
    *      // an error and we should not replace the html
    *      if(x6.json.execute()) {
    *         x6.json.process('nameofItemToReplace');
    *      }
    *      </script>
    *
    ******
    */
    data: { },  // required for json
    json: {
        callString: '',
        http:       false,
        active:     false,
        jdata:      { },
        data:       { dd: {} },
        requests:   { },
        parms:      { },
        reportErrors: true,
        x4Page:     '',
        x4Action:   '',
        explicitParms: '',
        hadErrors: false,
        
        /****m* json/init
        *
        * NAME
        *   x6.json.init
        *
        * FUNCTION
        *   The Javascript method x6.json.init initiates a new 
        *   JSON request.
        *
        *   Optionally you can pass two inputs and eliminate one
        *   call to x6.json.addParm.
        *
        * INPUTS
        *   string - if provided, a parameter name
        *   mixed - if provided, the value for the parameter
        *
        * EXAMPLE
        *   Here are two examples for initiating a JSON request
        *
        *      <script>
        *      // The short way
        *      x6.json.init('x4Page','myCustomPage');
        * 
        *      // Passing w/o parameters requires at least one
        *      // call to x6.json.addParm.
        *      x6.json.init();
        *      x6.json.addParm('x4Page','myCustomPage');
        *      </script>
        *
        * SOURCE
        */
        init: function(name,value) {
            this.x4Page     = '';
            this.x4Action   = '';
            this.callString = '';
            this.parms      = { };
            this.reportErrors=true;
            this.explicitParms= '';
            if(name!=null) {
                this.addParm(name,value);
            }
        },
        /******/

        /****** json/addParm
        *
        * NAME
        *   x6.json.addParm
        *
        * FUNCTION
        *   The Javascript method x6.json.addParm adds one parameter
        *   to a JSON call previously initiated with x6.json.init.
        *
        * INPUTS
        *   string - required, a parameter name
        *   mixed - required, the value for the parameter
        *
        * EXAMPLE
        *   Here are two examples for initiating a JSON request
        *
        *      <script>
        *      x6.json.init();
        *      // Name the server-side page to call
        *      x6.json.addParm('x4Page','myCustomPage');
        *      // Name the server-side method to call
        *      x6.json.addParm('x4Action','fetchSomething');
        *      </script>
        *
        * SOURCE
        */
        addParm: function(name,value) {
            this.parms[name] = value;
            if(name=='x4Page')   this.x4Page = value;
            if(name=='x4Action') this.x4Action = value;
        },
        /******/
        
        makeString: function() {
            if(this.explicitParms!='') {
                return this.explicitParms;
            }
            var list = [ ];
            for(var x in this.parms) {
                list[list.length] = x + "=" +encodeURIComponent(this.parms[x]);
            }
            return list.join('&');
        },
        //addValue: function(name,value) {
        //    if(this.callString!='') this.callString+="&";
        //    this.callString += 'x4c_' + name + '=' + encodeURIComponent(value);
        //},
        
        /****** json/inputs
        *
        * NAME
        *   x6.json.inputs
        *
        * FUNCTION
        *   The Javascript method x6.json.inputs adds inputs to
        *   a JSON call previously initiated with x6.json.init.
        *
        *   This method accepts an object as its parameter, and
        *   will add every input that is a child (at any level)
        *   of that object.
        *
        *   This method uses the "id" property of the input to
        *   name the parameter, not the "name" property.  Andromeda
        *   makes no use of the "name" property.
        *
        *   This method is equivalent to use x6.json.addParm
        *   for each of the desired inputs.
        *
        *   Checkboxes receive special treatment.  If the box is 
        *   checked a value of 'Y' is sent, and if the box is not
        *   checked a value of 'N' is sent.
        *
        *   The name of each parameter is normally the Id of the
        *   input.  If the inputs were generated by Andromeda
        *   on an Extended-Desktop page, they will have the names
        *   'x4inp_<tableId>_<columnId>.  
        *
        * INPUTS
        *   object - optional, the object to recurse.  You must
        *   pass the object itself, not its Id.  If no object is
        *   passed the Extended-Desktop top-level object x4Top
        *   is used, which means you get every input on the page,
        *   whether or not it is visible or
        *
        *   direct - a special flag that says to name the parameters
        *   'x4c_<columnId>'.  This is required when you are sending
        *   Direct-Database-Access calls.
        *
        *
        * SOURCE
        */
        inputs: function(obj,direct) {
            if(direct==null) direct=false;
            if(obj==null) {
                if(x6.byId('x4Top')!=null) {
                    obj = x6.byId('x4Top');
                }
                else {
                    obj = $('.x6main')[0];
                }
            }
            if(typeof(obj)=='string') {
                if(obj.indexOf('input')==-1) {
                    var jqObjects = $(obj).find(':input');
                }
                else {
                    var jqObjects = $(obj);
                }
            }
            else {
                var jqObjects = $(obj).find(":input");
            }
            jqObjects.each( function() {
                if(direct) 
                    var id = 'x4c_'+x6.p(this,'xColumnId');
                else
                    var id = this.id;
                    
                
                if(this.type=='checkbox') {
                    if(this.checked) {
                        x6.json.addParm(id,'Y');
                    }
                    else {
                        x6.json.addParm(id,'N');
                    }
                }
                else {
                    if(typeof(x6)=='undefined') {
                        if(this.value!='') {
                            x6.json.addParm(id,this.value);
                        }
                    }
                    else {
                        var zOrig = x6.p(this,'zOriginalValue','').trim();
                        if(this.value.trim()!=zOrig) {
                            x6.json.addParm(id,this.value);
                        }
                    }
                }
            });
        },
        /******/
        
        /****** json/serialize
        *
        * NAME
        *   x6.json.serialize
        *
        * FUNCTION
        *   The Javascript method x6.json.serialize takes a
        *   Javascript Object or Array and serializes it and
        *   adds the values to a JSON request previously
        *   initialized with x6.json.init.
        *
        *   This method accepts an object as its parameter.
        *
        *   When you call this function, the parameters sent
        *   back take the form of an associative array.
        *
        * INPUTS
        *   prefix - The base name of the parameter
        *
        *   object - the object to serialize.
        *
        * EXAMPLE
        *   Consider the following object that is serialized
        *
        *      <script>
        *      var x = {
        *         parm1: [ 1, 2, 3],
        *         parm2: 'hello',
        *         parm3: {
        *             x: 5,
        *             y: 10,
        *         }
        *      x6.json.init('x4Page','myCustomPage');
        *      x6.json.addParm('x4Action','serialHandler');
        *      x6.json.serialize('example',x);
        *      <script>
        *
        *   Then on the server, you can grab the "example" parameter
        *   and you will get the following associative array:
        *
        *      <?php
        *      # this is file x4myCustomPage.php
        *      class x4myCustomPage extends androX4 {
        * 
        *          # this handles the 'x4Action' specified above
        *          function serialHandler() {
        *              $example = gp('example');
        *            
        *              # ...the following code shows how 
        *              #    the values that are in x4
        *              $example['parm1'][0] = 1;
        *              $example['parm1'][1] = 2;
        *              $example['parm1'][2] = 3;
        *              $example['parm2'] = 'hello';
        *              $example['parm3']['x'] = 5;
        *              $example['parm3']['y'] = 10;
        *          }
        *      }
        *      ?>
        *
        * SOURCE
        */
        serialize: function(prefix,obj) {
            for(var x in obj) {
                if(typeof(obj[x])=='object') {
                    this.serialize(prefix+'['+x+']',obj[x]);
                }
                else {
                    this.addParm(prefix+'['+x+']',obj[x]);
                }
            }
        },
        /******/
        
        /****** json/windowLocation
        *
        * NAME
        *   x6.json.windowLocation
        *
        * FUNCTION
        *   The Javascript method x6.json.windowLocation takes a
        *   JSON request and executes it as a page request.
        *
        * EXAMPLE
        *   The following example loads a new page
        *
        *      <script>
        *      x6.json.init('x4Page','calendar');
        *      x6.json.windowLocation();
        *      </script>
        *
        * SOURCE
        */
        windowLocation: function() {
            var entireGet = 'index.php?'+this.makeString()
            window.location = entireGet;
        },
        /******/
        
        /****** json/newWindow
        *
        * NAME
        *   x6.json.newWindow
        *
        * FUNCTION
        *   The Javascript method x6.json.newWindow takes a
        *   JSON request and executes it as a page request, popping
        *   the result up in a new tab or window.
        *
        *   When the user exits the resulting tab or window, it
        *   will close.  
        *
        * EXAMPLE
        *   The following example loads a new page
        *
        *      <script>
        *      x6.json.init('x4Page','calendar');
        *      x6.json.newWindow();
        *      </script>
        *
        * SOURCE
        */
        newWindow: function() {
            var entireGet = 'index.php?'+this.makeString()+'&x4Return=exit';
            x6.openWindow(entireGet);
        },
        /******/

        /****** json/executeAsync
        *
        * NAME
        *   x6.json.executeAsync
        *
        * FUNCTION
        *   By default Andromeda sends JSON requests synchronously,
        *   which is more appropriate for business database applications
        *   than asynchronous requests.
        *
        *   There are however some times when you do not want the user
        *   to wait, and so you can make asynchronous calls. 
        *
        *   Andromeda does not make use of response handlers, see the
        *   above section on x6.json for more details.
        *
        * SOURCE
        */
        executeAsync: function() {
            this.execute(true,true);
        },
        /******/
        
        /****** json/execute
        *
        * NAME
        *   x6.json.execute
        *
        * FUNCTION
        *   The Javascript method x6.json.execute sends a request to
        *   the server that has been initialized with x6.json.init
        *   and has received parameters with any of x6.json.addParm,
        *   x6.json.inputs and x6.json.serialize.
        *
        *   In normal usage, you call this routine and check for
        *   a return value of true.  If the routine returns true
        *   you call x6.json.process to process the returned
        *   results.
        *
        * RESULTS
        *   This routine returns true if the server reports no 
        *   errors.
        *
        *   If the server reports errors, they are displayed to the
        *   user using u.dialogs.alert, and this routine returns
        *   false.
        *
        *******
        */
        execute: function(autoProcess,async) {
            this.hadErrors = false;
            if(async==null) async = false;
            if(autoProcess==null) autoProcess=false;
            
            // Create an object
            var browser = navigator.appName;
            if(browser == "Microsoft Internet Explorer"){
                // KFD 11/24
                var http = new ActiveXObject("Microsoft.XMLHTTP");
            }
            else {
                // KFD 11/24
                var http = new XMLHttpRequest();
            }
            // KFD 7/8/08, When the user is clicking on
            //             search boxes, they can click faster
            //             than we can get answers, so if
            //             we notice we are running an action
            //             that is already in progress, we
            //             cancel the earlier action.
            var key = this.x4Page + this.x4Action;
            if( typeof(this.requests[key])!='undefined') {
                this.requests[key].abort();
            }
            this.requests[key] = http;
            
            // If async, we have to do it a little differently
            // KFD 11/24, did nothing yet for async
            if(async) {
                http.onreadystatechange = function() {
                    if(this.readyState!=4) return;
                    x6.json.processPre(this,key,false);
                    x6.json.process();
                }
            }
            
            // Execute the call
            var entireGet = 'index.php?json=1&'+this.makeString();
            http.open('POST' , entireGet, async);
            http.send(null);

            // KFD 11/24A
            this.active = false;
            
            
            // An asynchronous call now exits, but a
            // synchronous call continues            
            if (async) return;
            else return this.processPre(http,key,autoProcess);
            
        },
        
        processPre: function(http,key,autoProcess) {
            // Attempt to evaluate the JSON
            try {
                eval('this.jdata = '+http.responseText);
            }
            catch(e) { 
                x6dialogs.alert("Could not process server response!");
                if(x6.byId('x6Log')) {
                    x6.byId('x6Log').innerHTML = http.responseText;
                    x6.byId('x6Log').style.display='block';
                }
                return false;
            }
            
            // KFD 7/8/08, additional housekeeping, throw away
            //             references to the object  
            delete this.requests[key];
            delete http;

            // If there were server errors, report those
            if(this.jdata.error.length>0 && this.reportErrors) {
                this.hadErrors = true;
                x6dialogs.alert(this.jdata.error.join("\n\n"));
                return false;
            }
            if(this.jdata.notice.length>0 && this.reportErrors) {
                x6dialogs.alert(this.jdata.notice.join("\n\n"));
            }
            
            if(autoProcess) {
                this.process();
            }
            
            return true;
        },
        
        /****** json/process
        *
        * NAME
        *   x6.json.process
        *
        * FUNCTION
        *   The Javascript method x6.json.execute is the final
        *   step in sending and receiving JSON requests.  This
        *   routine does the following:
        *   * Any HTML sent back via PHP x4HTML replaces the 
        *     innerHTML of the named items (actually item Ids are used).
        *   * Any script sent back via PHP x4Script is executed.
        *   * Any data sent back via PHP x4Data is placed into
        *     x6.data.
        *
        * EXAMPLE
        *   This example shows how you can retrieve table data and
        *   then process it:
        *
        *      <script>
        *      x6.json.init('x4Page','myCustomPage');
        *      x6.json.addParm('x4Action','getStates');
        *      // x6.json.execute will return false on errors
        *      if(x6.json.execute()) {
        *         // x6.json.process puts everything in its place...
        *         x6.json.process();
        *         // ...so that we can handle the returned data
        *         for (var idx in x6.data.states) {
        *            // do something
        *         }
        *      }
        *      <script>
        *
        *   This code requires the following PHP code on the server:
        *
        *      <?php
        *      # this is file application/x4myCustomPage.php
        *      class x4myCustomPage extends androX4 {
        *          function getStates() {
        *              $states = SQL("Select * from states");
        *              x4Data('states',$states);
        *          }
        *      }
        *
        *******
        */
        process: function(divMain) {
            for(var x in this.jdata.html) {
                if(x=='*MAIN*') {
                    $('#'+divMain).html(this.jdata.html[x]);
                }
                else {
                    var obj = x6.byId(x);
                    if(obj) {
                        if (obj.tagName =='INPUT') {
                            obj.value = this.jdata.html[x];
                        }
                        else {
                            obj.innerHTML = this.jdata.html[x];
                        }
                    }
                }
            }
            
            // Execute any script that was provided
            for(var x in this.jdata.script) {
                eval(this.jdata.script[x]); 
            }
            
            return true;
        }
    }
}

/* **************************************************************** *\

   Run-time creation of specialized functions on
   the x6.console object.  These are cross-compatible between
   firebug and blackbird.
   
\* **************************************************************** */
function x6consoleActivate() {
    if(typeof(console)=='undefined') {
        x6.console.log=     function(args) { }
        x6.console.warn=    function(args) { }   
        x6.console.info=    function(args) { }   
        x6.console.error=   function(args) { }
        x6.console.time=    function(args) { }
        x6.console.timeEnd= function(args) { }
        x6.console.group=   function(args) { }
        x6.console.groupEnd=function(args) { }
        return false;
    }
    
    var retval = 'Found: console (yes), '
        
    // Firebug defines "x6.console.group", but blackbird does
    // not.  So if we cannot find x6.console.group we create
    // functions that do indenting instead.
    //
    var fblite = readCookie('log_FBLite');
    if(typeof(console.group)=='undefined' || fblite==1) {
        retval+=" console.group (no), ";
        x6.console.group = function(x) { 
            if(!this.enableGroup) return;
            this._log('log',x);
            this.indent+='     ';   
        }
        x6.console.groupEnd = function(x) {
            if(!this.enableGroup) return;
            if(x!=null) {
                this._log('log',x);
            }
            if(this.indent.length > 0) {
                if(this.indent.length==5) {
                    this.indent = '';
                }
                else {
                    this.indent = this.indent.slice(0,this.indent.length-5);
                }
            }
        }
    }
    else {
        retval+=" console.group (yes), ";
        x6.console.group = function(x) {
            if(this.enableGroup) console.group(x);
        }
        x6.console.groupEnd = function(x) {
            if(this.enableGroup) console.groupEnd(x);
        }
    }

    if(typeof(console.time)=='undefined') {
        retval+=" console.time/console.timeEnd (no) ";
        x6.console.time    = function(x) { }
        x6.console.timeEnd = function(x) { }
    }
    else {
        retval+=" console.time/console.timeEnd (yes) ";
        x6.console.time = function(x) {
            if(this.enableTime) console.time(x);
        }
        x6.console.timeEnd = function(x) {
            if(this.enableTime) console.timeEnd(x);
        }
    }
    
    
    // These are the normal ones.  They all route to 
    // a function that figures out how many parameters
    // were passed in executes the appropriate commands.
    x6.console.log = function(x1,x2,x3,x4,x5,x6,x7) {
        if(this.enableLog) {
            this._log('log',x1,x2,x3,x4,x5,x6,x7);    
        }
    }
    x6.console.warn = function(x1,x2,x3,x4,x5,x6,x7) {
       if(this.enableWarn) {
            this._log('warn',x1,x2,x3,x4,x5,x6,x7);    
        }
     }
    x6.console.info = function(x1,x2,x3,x4,x5,x6,x7) {
       if(this.enableInfo) {
            this._log('info',x1,x2,x3,x4,x5,x6,x7);    
        }
     }
    x6.console.error = function(x1,x2,x3,x4,x5,x6,x7) {
       if(this.enableError) {
            this._log('error',x1,x2,x3,x4,x5,x6,x7);    
        }
     }
    return retval;
}
x6consoleActivate();
if(readCookie('log_Group')==1) x6.console.enableGroup = true;
if(readCookie('log_Time') ==1) x6.console.enableTime  = true;
if(readCookie('log_Log')  ==1) x6.console.enableLog   = true;
if(readCookie('log_Info') ==1) x6.console.enableInfo  = true;
if(readCookie('log_Warn') ==1) x6.console.enableWarn  = true;
if(readCookie('log_Error')==1) x6.console.enableError = true;

/****O* Javascript-API/x6dialogs
*
* NAME
*   Javascript-API/x6dialogs
*
* FUNCTION
*   The two Javascript dialogs x6dialogs.alert and
*   x6dialogs.confirm replace the Javascript native functions
*   alert() and confirm().
*
*   The third dialog, x6dialogs.pleaseWait, puts up a 
*   suitable notice if your application must do something that
*   will take more than 1-2 seconds.
*
*   They are all fully modal, respond to appropriate keystrokes
*   like 'Y', 'N', 'Enter' and 'Esc', and maintain the same
*   style as the rest of the template.
*
* PORTABILITY
*   The x6dialogs object expects your HTML to contain two
*   invisible (display:none) divs.  One is called "dialogoverlay"
*   and the other is called "dialogbox".  These two divs are 
*   provided by default on Andromeda templates.  If you make
*   your own template and include androHTMLFoot.php at the bottom
*   then your templates will also have these divs.
*
*   Making a page fully modal is difficult, because if an INPUT
*   has focus it will be possible for the user to use the keyboard
*   to navigate around.  Therefore the code in x4 checks
*   the x6dialogs.currentDialog property, and disallow all activity
*   if that property is not false.  If you make your own 
*   custom pages that are not Extended Desktop pages, you must have
*   your input's onkeyPress methods also check this property.
*
*   If this object is used outside of Andromeda, you must have
*   the file phpWait.php in your public web root, otherwise the
*   x6dialogs.confirm function will not work.
*
******
*/
x6dialogs = {
    /** NO DOC **/
    id: 'u_dialogs',
    answer: null,
    json: null,
    
    /****v* dialogs/currentDialog
    *
    * NAME
    *    u.events.currentDialog   
    *
    * FUNCTION
    *    This Javascript property will hold any of the value of:
    *    * false, no dialog is active
    *    * alert, an alert dialog is active
    *    * confirm, a confirm dialog is active
    *    * pleaseWait, a "Please Wait" box is being displayed
    *
    ******
    */
    currentDialog: false,
    
    /****v* dialogs/clear
    *
    * NAME
    *   u.events.clear
    *
    * FUNCTION
    *   The Javascript Method u.events.clear
    *   clears the current modal dialog.  
    *
    *   The two dialogs x6dialogs.alert and x6dialogs.confirm are
    *   cleared by user action.  But the x6dialogs.pleaseWait 
    *   dialog will remain on the screen until your application
    *   Javascript code clears it by calling this method.
    *
    * INPUTS
    *   ignore - This method accepts a paremeter that is useful
    *   only to the framework when managing a confirm dialog.
    *
    * SOURCE
    */
    clear: function(answer) {
        this.answer = answer;
        this.currentDialog = false;
        
        $('#dialogbox,#dialogoverlay').css('display','none');
    },
    /******/
    
    prepare: function(type) {
        // Tell the master what we are doing, 
        // and suppress all keystrokes except ENTER and ESC
        this.currentDialog = type;

        // Get some basic heights and widths
        var wh = $(window).height();
        var ww = $(window).width();
        
        // Make complete assignment to the overlay
        $('#dialogoverlay')
            .css('position','absolute')
            .css('top',0)
            .css('left',0)
            .css('width' ,ww)
            .css('height',wh)
            .css('background-color','black')
            .css('opacity',0)
            .css('display','')
            .css('z-index',500);

        // Get height and width of the inner guy and center him
        var ch = $('#dialogbox').height();
        $('#dialogbox').css('width',300);
        cw = 300;
        
        // Center and otherwise prepare the box
        $('#dialogbox')
            .css('position','absolute')
            .css('top' , 300)
            .css('left', (ww - cw)/2)
            .css('opacity',0)
            .css('display','')
            .css('z-index',501)
            .addClass('dialog');
        x6.byId('dialogbox').notify = function(eventName,args) {
            if(this.currentDialog == 'alert') {
                if(eventName == 'keyPress_Enter') {
                    this.clear();
                    return true;
                }
                if(eventName == 'keyPress_Esc')  {
                    this.clear();
                    return true;
                }
            }
            if(x6dialogs.currentDialog == 'confirm') {
                if(eventName == 'keyPress_Y') {
                    this.clear(true);
                    return true;
                }
                if(eventName == 'keyPress_N') {
                    this.clear(false);
                    return true;
                }
            }
            return false;
        }
    },
    
    /****m* dialogs/alert
    *
    * NAME
    *   x6dialogs.alert
    *
    * FUNCTION
    *   The Javascript method x6dialogs.alert replaces the native
    *   Javascript alert() function with one that is stylistically
    *   consistent with the rest of the application.
    *
    *   Unlike Javascript's native alert() function, execution 
    *   continues after you call this function.  The user must
    *   clear it by clicking the OK button, hitting Enter, or
    *   hitting Esc.
    *
    *   When this alert is active, all keyboard events are
    *   suppressed except Enter and Esc.
    *
    * EXAMPLE
    *   Here is a usage example:
    *
    *       x6dialogs.alert("New data has been saved");
    *       // maybe do some other stuff while 
    *       // waiting for the user
    *       u.events.notify('myEventName',objParms);
    *
    ******
    */
    alert: function(msg) {
        alert(msg);
        return;
    },
    
    /****m* dialogs/confirm
    *
    * NAME
    *   x6dialogs.confirm
    *
    * FUNCTION
    *   The Javascript method x6dialogs.confirm replaces the native
    *   Javascript confirm() function with one that is stylistically
    *   consistent with the rest of the application.
    *
    *   Like Javascript's native confirm() function, execution 
    *   *stops* until the user answers the question.  This makes
    *   coding far easier because you do not have to code
    *   anonymous callback functions.
    *
    *   When this alert is active, all keyboard events are
    *   suppressed except 'Y' and 'N'.
    *
    * EXAMPLE
    *   Here is a usage example:
    *
    *       if(x6dialogs.confirm("Do you really want to delete?")) {
    *           // code to delete
    *       }
    *       else {
    *           u.events.debug("user chose not to delete");
    *       }
    *
    * PORTABILITY
    *    Javascript does not natively support an elegant way to
    *    pause execution.  For instance, it does not have a 
    *    "sleep" function that would allow a low-CPU idefinite
    *    loop to be executing while waiting for user input.
    *
    *    We could solve this by throwing caution to the wind and
    *    doing an indefinite loop anyway, which checks over and over
    *    to see if the user has responded, but this spikes CPU usage
    *    and is very bad form.
    *
    *    The technique used by x6dialogs.confirm is unusual, but it
    *    has the benefit of being extremely low on CPU power and
    *    extremely low on network bandwidth.  The approach contains
    *    an indefinite loop that makes a call to the program
    *    phpWait.php, which does a sleep for 1/4 second and returns.
    *    Even at four calls per second, the overall CPU and network
    *    bandwidth is practically zero.
    *
    *    Therefore, x6dialogs.confirm has a dependency that the
    *    php file phpWait.php be present in the web server's public
    *    root.  This is handled automatically by Andromeda, but you
    *    must provide such a file if you use this object in 
    *    a non-Andromeda application.
    *
    ******
    */
    confirm: function(msg,options) {
        return confirm(msg);
    },
    
    /****m* dialogs/pleaseWait
    *
    * NAME
    *   x6dialogs.pleaseWait
    *
    * FUNCTION
    *   The Javascript method x6dialogs.pleaseWait is not,
    *   strictly speaking, a dialog, because it does not require
    *   any user feedback, and in fact does not even allow it.
    *
    *   When you call x6dialogs.pleaseWait, a modal box pops up
    *   that is stylistically consistent with the overall template
    *   and which has an animated gif and the message "Please Wait".
    *
    *   Use this method when you are executing a long-running
    *   (greater than 2-3 seconds) process and you must let the
    *   user know the program is working on something.
    *
    *   The user cannot clear this display.  You must clear it
    *   yourself when work has been completed by calling
    *   x6dialogs.clear().
    *
    *  EXAMPLE
    *    Here is a usage example:
    *
    *         x6dialogs.pleaseWait();
    *         for(var x in rowsToSave()) {
    *            // some actions to save to server
    *         }
    *         x6dialogs.clear();
    *  
    ******
    */
    pleaseWait: function(msg) {
        if(msg==null) msg = "Please Wait...";
        this.prepare('pleaseWait');
        
        // Create the content for the dialog itself
        var html =
            "<center><br/>"
            +"<img src='clib/ajax-loader.gif'>"
            +"<br/><br/>"
            +msg+"<br/><br/>"
            +"</center>";

        x6.byId('dialogbox').innerHTML=html;
        
        // Finally, display the dialog
        $('#dialogoverlay').css('opacity',0.4);
        $('#dialogbox').css(    'opacity',1);
    }
}

/****O* u/bb
* NAME
*   x6bb
*
* FUNCTION
*   "Bulletin Board" object that lets you "stick" values on it
*   and "grab" them from elsewhere.
*
*   x6bb methods should be used instead of global variables
*   because they allow you to avoid collisions with framework
*   globals.  The framework uses the methods x6bb.fwGet
*   and x6bb.fwSet, and your application should use x6bb.appGet
*   and x6bb.appSet.
*
* EXAMPLE:
*   Example usage:
*      x6bb.appSet('myvar','value');
*      var myvar = x6bb.appGet('myvar','acceptableDefault');
*
******
*/
x6bb = {
    /****v* x6bb/fwvars
    * NAME
    *   x6bb.fwvars
    *
    * FUNCTION
    *   Global bulletin board framework variables.  Not intended
    *   for direct access, manipulate at your own risk!
    ******
    */
    fwvars: { },
    /****v* x6bb/appvars
    * NAME
    *   x6bb.appvars
    *
    * FUNCTION
    *   Global bulletin board application variables.  Not intended
    *   for direct access, manipulate at your own risk!
    ******
    */
    appvars: { },
    /****m* x6bb/vgfSet
    * NAME
    *   x6bb.vgfSet
    *
    * FUNCTION
    *   Used by the Andromeda framework to save global variables
    *   for later use.  Application code should never use this,
    *   or you risk overwriting framework values and disrupting
    *   normal performance.
    *
    * INPUTS
    *   varName - The name of your variable
    *   varValue   - The value to store
    *
    * SOURCE
    */
    fwSet: function(varName,value) {
        this.fwvars[varName] = value;
    },
    /******/
    
    /****m* x6bb/vgfGet
    * NAME
    *   x6bb.vgfGet
    *
    * FUNCTION
    *   Retrieves a variable saved by the framework.
    *
    *   Unlike vfgSet, which application code should never call,
    *   it may be appropriate from time-to-time to call this
    *   function to find out what the framework is up to.
    *
    * INPUTS
    *   varName - the variable you wish to retrieve
    *   defValue - the value to return if the variable does not exist.
    *
    * SOURCE
    */
    fwGet: function(varName,defValue) {
        var retval = x6.p(this.fwvars,varName,defValue);
        return retval;
    },
    /******/

    /****m* x6bb/vgaSet
    * NAME
    *   x6bb.vgaSet
    *
    * FUNCTION
    *   Sets a global variable.  Globals saved with this method
    *   will not collide with any framework globals.
    *
    * INPUTS
    *   varName - the variable you wish to save
    *   varValue - the value to save
    *
    * SOURCE
    */
    appSet: function(varName,value) {
        this.appvars[varName] = value;
    },
    /******/
    
    
    /****m* bb/vgaGet
    * NAME
    *   x6bb.vgaGet
    *
    * FUNCTION
    *   Retrieves a global variable, or the default value
    *   if the global has not been set.
    *
    * INPUTS
    *   varName - the variable you wish to save
    *   defValue - the value to return if the global does
    *              not exist.
    *
    * SOURCE
    */
    appGet: function(varName,defValue) {
        return x6.p(this.appvars,varName,defValue);
    }
    /******/
}


/****O* Javascript-API/x6events
*
* NAME
*   x6events
*
* FUNCTION
*   The javascript object x6events implements the classic
*   event listener and dispatcher pattern.
*
*   Objects can subscribe to events by name.  Other 
*   objects can notify the events object when an event
*   fires, and it will in turn notify all of the subscribers.
*
* PORTABILITY
*   The u.events object and its methods expect other u
*   methods to be available, but do not have any other
*   dependencies.
*
******
*/
var x6events = {
    /****iv* events/subscribers
    *
    * NAME
    *   u.events.subscribers
    *
    * FUNCTION
    *   The javascript object x6events.subscribers is an object
    *   serving as an Associative Array.  Each entry in the array
    *   has a key that is the name of the event, and a value that
    *   is an array of object ids for the subscribers.  In JSON
    *   format the array might look like this:
    *
    *       u.events.subscribers = {  // example code only
    *           keyPress_Enter: { 
    *              gridEdit_regrules: 'gridEdit_regrules'
    *           }
    *           addRow_customers: {
    *              gridBrowse_customers: 'gridBrowse_customers'
    *           }
    *       }
    *
    *   This object is documented for completeness only, it is
    *   not intended for direct manipulation.
    * 
    ******
    */
    subscribers: { },
    
    eventsDisabled: false,
    disableEvents: function() {
        this.eventsDisabled = true;
    },
    enableEvents: function() {
        this.eventsDisabled = false;
    },

    /****m* x6events/subscribeToEvent
    *
    * NAME
    *   x6events.subscribeToEvent
    *
    * FUNCTION
    *   The Javascript method x6events.subscribeToEvent allows an
    *   object to subscribe to a named event.  That object will
    *   then be notified whenever the event fires.  See the
    *   method x6events.notify for more information on how
    *   the notification is handled.
    *
    * INPUTS
    *   * eventName - Any string.  There is no validation of the 
    *   eventName, so misspellings will result in your object 
    *   not being notified.
    *   * id - the Id of the object
    *   
    * NOTES
    *
    * RESULT
    *   No return value
    *
    * SEE ALSO
    *   x6events.fireEvent
    *
    * SOURCE
    */
    subscribeToEvent: function(eventName,id) {
        x6.console.group("subscribeToEvent "+eventName);
        x6.console.log("event name: ",eventName)
        x6.console.log("id subscriber: ",id);
        if(id=='undefined') {
            x6.console.error('x6events.subscribeToEvent.  Second parameter '
                +' undefined.  First parameter: '+eventName
            );
            return;
        }
        if(id==null) {
            x6.console.error('x6events.subscribeToEvent.  Second parameter '
                +' null.  First parameter: '+eventName
            );
            return;
        }
        
        // First determine if we have any listeners for this
        // event at all.  If not, make up the empty object
        if( x6.p(this.subscribers,eventName,null)==null) {
            this.subscribers[eventName] = [ ];
        }
        if(this.subscribers[eventName].indexOf(id)==-1) {
            this.subscribers[eventName].push(id);
        }
        x6.console.groupEnd();
    },
    /******/
    
    unsubscribeToEvent: function(eventName,id) {
        var subs = x6.p(this.subscribers,eventName);
        if( subs!=null) {
            var i = this.subscribers[eventName].indexOf(id);
            if(i >= 0) {
                this.subscribers[eventName].splice(i,1);
            }
        }
    },
        
    /****m* events/getSubscribers
    *
    * NAME
    *   x6events.getSubscribers
    *
    * FUNCTION
    *   The Javascript method x6events.getSubscribers returns
    *   an array of subscribers to a particular event.
    *
    * NOTES
    *   Use this method to discover which objects are
    *   subscribed to a particular event.
    *
    * RETURNS
    *   An array of zero or more object id's. 
    *
    * SOURCE
    */
    getSubscribers: function(eventName) {
        return x6.p(this.subscribers,eventName,[]);
    },
    /******/

    /****m* x6events/fireEvent
    *
    * NAME
    *   x6events.fireEvent
    *
    * FUNCTION
    *   The Javascript method x6events.fireEvent will notify all
    *   objects that have subscribed to an event.  Each subscribing
    *   object must have a either:
    *   * a method named receiveEvents(eventName,args)
    *   * a method named receiveEvent_{EventName}(args)
    *
    *   If you want your application objects to notify other objects
    *   of its own events, call this function.
    *
    * INPUTS
    *   * eventName, the name of the event
    *   * mixed, a single argument.  If multiple arguments are required,
    *   pass an object that contains property:value assignments or 
    *   an array.  The only requirement for the argument is that the
    *   listeners know what to expect.
    *
    * RESULTS
    *   no return value.
    *
    ******
    */
    makeMap: true,
    map: [ ],
    mapStack: [ ],
    mapClear: function() {
        this.map = [ { name: 'root', kids: [ ] } ];
        this.mapStack = [ this.map[0] ];
    },
    mapWrite: function(map) {
        iAmRoot = false;
        if(map   ==null) {
            var conEnabled = x6.console.enableAll();
            var iAmRoot = true;
            map   = this.map;
        }
        var maplen = map.length;
        for(var x=0; x<maplen; x++) {
            x6.console.group(map[x].name);
            this.mapWrite(map[x].kids);
            x6.console.groupEnd(map[x].name);
        }
        if(iAmRoot) {
            x6.console.disableAll(conEnabled);
        }
    },
    
    retvals: { },
    fireEvent: function(eventName,arguments) {
        if(this.eventsDisabled) return;
        
        if(this.makeMap) {
            if(this.map.length==0) this.mapClear();
            var spot = this.mapStack[this.mapStack.length-1];
            var len  = spot.kids.length;
            spot.kids[len] = { name: eventName, kids: [ ] };
            this.mapStack.push(spot.kids[len]);
        }
        
        x6.console.group("fireEvent "+eventName);
        x6.console.log('arguments: ',arguments);
        // Find out if anybody is listening for this event
        var subscribers = this.getSubscribers(eventName);
        if(subscribers.length==0) {
            x6.console.log("No subscribers to this event, no action");
            x6.console.groupEnd();
            return;
        }
        
        // loop through subscribers.  Note at the bottom of the list
        // that if an event handler returns false we must stop.
        this.retvals[eventName] = true;
        for(var x=0; x<subscribers.length;x++) {
            var id = subscribers[x];
            x6.console.log("subscriber: ",id);
            var subscriber = x6.byId(id);
            if(subscriber==null) {
                x6.console.error(
                    "There is no object with that ID, cannot dispatch"
                );
                continue;
            }
            
            // Look for the method to receive the event
            var retval = false;
            var method = 'receiveEvent_'+eventName;
            if(typeof(subscriber[method])=='function') {
                /*
                if(this.makeMap) {
                    var spot = this.mapStack[this.mapStack.length-1];
                    var len  = spot.length;
                    spot[len] = { name: id, kids: [ ] };
                    this.mapStack.push(spot[len].kids);
                }
                */
                
                retval = subscriber[method](arguments);
                x6.console.log(id,eventName,retval);
                
                //if(this.makeMap) {
                //    this.mapStack.pop();
                //}
            }
            else {
                x6.console.error(
                    "Subscriber "+subscriber.id+" has no method: "+method
                ); 
            }
            if(retval==false) {
                x6.console.log('id returned false, setting false');
                this.retvals[eventName] = false;
                break;
            }
        }

        if(this.makeMap) {
            this.mapStack.pop();
        }
        
        x6.console.log("fireEvent ",eventName," RETURNING: ",this.retvals[eventName]);
        x6.console.groupEnd();
        return this.retvals[eventName];
    }
}


/* ----------------------------------------------------- *\
   EXPERIMENTAL, json constructor
\* ----------------------------------------------------- */
function x6JSON(parm,value) {
    
    this.callString = '';
    this.http       =  false,
    this.active     =false,
    this.jdata      ={ },
    this.data       ={ dd: {} },
    this.requests   ={ },
    this.parms      ={ },
    this.reportErrors= true,
    this.x4Page     ='',
    this.x4Action   ='',
    this.explicitParms= '',
    this.hadErrors= false,

    /****m* json/addParm
    *
    * NAME
    *   x6.json.addParm
    *
    * FUNCTION
    *   The Javascript method x6.json.addParm adds one parameter
    *   to a JSON call previously initiated with x6.json.init.
    *
    * INPUTS
    *   string - required, a parameter name
    *   mixed - required, the value for the parameter
    *
    * EXAMPLE
    *   Here are two examples for initiating a JSON request
    *
    *      <script>
    *      x6.json.init();
    *      // Name the server-side page to call
    *      x6.json.addParm('x4Page','myCustomPage');
    *      // Name the server-side method to call
    *      x6.json.addParm('x4Action','fetchSomething');
    *      </script>
    *
    * SOURCE
    */
    this.addParm = function(name,value) {
        this.parms[name] = value;
        if(name=='x4Page')   this.x4Page = value;
        if(name=='x4Action') this.x4Action = value;
    }
    /******/
    
    // Original init code
    this.x4Page     = '';
    this.x4Action   = '';
    this.callString = '';
    this.parms      = { };
    this.reportErrors=true;
    this.explicitParms= '';
    if(parm!=null) {
        this.addParm(parm,value);
    }
    // Create an object
    var browser = navigator.appName;
    if(browser == "Microsoft Internet Explorer"){
        // KFD 11/24
        this.http = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else {
        // KFD 11/24
        this.http = new XMLHttpRequest();
    }
    
    this.makeString = function() {
        if(this.explicitParms!='') {
            return this.explicitParms;
        }
        var list = [ ];
        for(var x in this.parms) {
            list[list.length] = x + "=" +encodeURIComponent(this.parms[x]);
        }
        return list.join('&');
    }
    //addValue: function(name,value) {
    //    if(this.callString!='') this.callString+="&";
    //    this.callString += 'x4c_' + name + '=' + encodeURIComponent(value);
    //},
    
    /****m* json/inputs
    *
    * NAME
    *   x6.json.inputs
    *
    * FUNCTION
    *   The Javascript method x6.json.inputs adds inputs to
    *   a JSON call previously initiated with x6.json.init.
    *
    *   This method accepts an object as its parameter, and
    *   will add every input that is a child (at any level)
    *   of that object.
    *
    *   This method uses the "id" property of the input to
    *   name the parameter, not the "name" property.  Andromeda
    *   makes no use of the "name" property.
    *
    *   This method is equivalent to use x6.json.addParm
    *   for each of the desired inputs.
    *
    *   Checkboxes receive special treatment.  If the box is 
    *   checked a value of 'Y' is sent, and if the box is not
    *   checked a value of 'N' is sent.
    *
    *   The name of each parameter is normally the Id of the
    *   input.  If the inputs were generated by Andromeda
    *   on an Extended-Desktop page, they will have the names
    *   'x4inp_<tableId>_<columnId>.  
    *
    * INPUTS
    *   object - optional, the object to recurse.  You must
    *   pass the object itself, not its Id.  If no object is
    *   passed the Extended-Desktop top-level object x4Top
    *   is used, which means you get every input on the page,
    *   whether or not it is visible or
    *
    *   direct - a special flag that says to name the parameters
    *   'x4c_<columnId>'.  This is required when you are sending
    *   Direct-Database-Access calls.
    *
    *
    * SOURCE
    */
    this.inputs= function(obj,direct) {
        if(direct==null) direct=false;
        if(obj==null) {
            obj = $a.byId('x4Top');
        }
        if(typeof(obj)=='string') {
            var jqObjects = $(obj);
        }
        else {
            var jqObjects = $(obj).find(":input");
        }
        jqObjects.each( function() {
                if(direct) 
                    var id = 'x4c_'+x6.p(this,'xColumnId');
                else
                    var id = this.id;
                    
                
                if(this.type=='checkbox') {
                    if(this.checked) {
                        x6.json.addParm(id,'Y');
                    }
                    else {
                        x6.json.addParm(id,'N');
                    }
                }
                else {
                    if(this.value!='') {
                        x6.json.addParm(id,this.value);
                    }
                }
        });
    }
    /******/
    
    /****m* json/serialize
    *
    * NAME
    *   x6.json.serialize
    *
    * FUNCTION
    *   The Javascript method x6.json.serialize takes a
    *   Javascript Object or Array and serializes it and
    *   adds the values to a JSON request previously
    *   initialized with x6.json.init.
    *
    *   This method accepts an object as its parameter.
    *
    *   When you call this function, the parameters sent
    *   back take the form of an associative array.
    *
    * INPUTS
    *   prefix - The base name of the parameter
    *
    *   object - the object to serialize.
    *
    * EXAMPLE
    *   Consider the following object that is serialized
    *
    *      <script>
    *      var x = {
    *         parm1: [ 1, 2, 3],
    *         parm2: 'hello',
    *         parm3: {
    *             x: 5,
    *             y: 10,
    *         }
    *      x6.json.init('x4Page','myCustomPage');
    *      x6.json.addParm('x4Action','serialHandler');
    *      x6.json.serialize('example',x);
    *      <script>
    *
    *   Then on the server, you can grab the "example" parameter
    *   and you will get the following associative array:
    *
    *      <?php
    *      # this is file x4myCustomPage.php
    *      class x4myCustomPage extends androX4 {
    * 
    *          # this handles the 'x4Action' specified above
    *          function serialHandler() {
    *              $example = gp('example');
    *            
    *              # ...the following code shows how 
    *              #    the values that are in x4
    *              $example['parm1'][0] = 1;
    *              $example['parm1'][1] = 2;
    *              $example['parm1'][2] = 3;
    *              $example['parm2'] = 'hello';
    *              $example['parm3']['x'] = 5;
    *              $example['parm3']['y'] = 10;
    *          }
    *      }
    *      ?>
    *
    * SOURCE
    */
    this.serialize = function(prefix,obj) {
        for(var x in obj) {
            if(typeof(obj[x])=='object') {
                this.serialize(prefix+'['+x+']',obj[x]);
            }
            else {
                this.addParm(prefix+'['+x+']',obj[x]);
            }
        }
    }
    /******/
    
    /****m* json/windowLocation
    *
    * NAME
    *   x6.json.windowLocation
    *
    * FUNCTION
    *   The Javascript method x6.json.windowLocation takes a
    *   JSON request and executes it as a page request.
    *
    * EXAMPLE
    *   The following example loads a new page
    *
    *      <script>
    *      x6.json.init('x4Page','calendar');
    *      x6.json.windowLocation();
    *      </script>
    *
    * SOURCE
    */
    this.windowLocation = function() {
        var entireGet = 'index.php?'+this.makeString()
        window.location = entireGet;
    }
    /******/
    
    /****m* json/newWindow
    *
    * NAME
    *   x6.json.newWindow
    *
    * FUNCTION
    *   The Javascript method x6.json.newWindow takes a
    *   JSON request and executes it as a page request, popping
    *   the result up in a new tab or window.
    *
    *   When the user exits the resulting tab or window, it
    *   will close.  
    *
    * EXAMPLE
    *   The following example loads a new page
    *
    *      <script>
    *      x6.json.init('x4Page','calendar');
    *      x6.json.newWindow();
    *      </script>
    *
    * SOURCE
    */
    this.newWindow = function() {
        var entireGet = 'index.php?'+this.makeString()+'&x4Return=exit';
        $a.openWindow(entireGet);
    }
    /******/

    /****m* json/executeAsync
    *
    * NAME
    *   x6.json.executeAsync
    *
    * FUNCTION
    *   By default Andromeda sends JSON requests synchronously,
    *   which is more appropriate for business database applications
    *   than asynchronous requests.
    *
    *   There are however some times when you do not want the user
    *   to wait, and so you can make asynchronous calls. 
    *
    *   Andromeda does not make use of response handlers, see the
    *   above section on x6.json for more details.
    *
    * SOURCE
    */
    this.executeAsync = function() {
        this.execute(true,true);
    }
    /******/
    
    /****m* json/execute
    *
    * NAME
    *   x6.json.execute
    *
    * FUNCTION
    *   The Javascript method x6.json.execute sends a request to
    *   the server that has been initialized with x6.json.init
    *   and has received parameters with any of x6.json.addParm,
    *   x6.json.inputs and x6.json.serialize.
    *
    *   In normal usage, you call this routine and check for
    *   a return value of true.  If the routine returns true
    *   you call x6.json.process to process the returned
    *   results.
    *
    * RESULTS
    *   This routine returns true if the server reports no 
    *   errors.
    *
    *   If the server reports errors, they are displayed to the
    *   user using u.dialogs.alert, and this routine returns
    *   false.
    *
    *******
    */
    this.execute = function(autoProcess,async,returnString) {
        this.hadErrors = false;
        if(async==null) async = false;
        if(autoProcess==null) autoProcess=false;
        
        // If async, we have to do it a little differently
        // KFD 11/24, did nothing yet for async
        var json = this;
        if(async) {
            this.http.onreadystatechange = function() {
                if(this.readyState!=4) return;
                json.processPre(false);
                json.process();
            }
        }
        
        // Execute the call
        var entireGet = 'index.php?json=1&'+this.makeString();
        this.http.open('POST' , entireGet, async);
        this.http.send(null);
        
        // An asynchronous call now exits, but a
        // synchronous call continues            
        if (async) return;
        else if(returnString) return this.http.responseText;
        else return this.processPre(autoProcess);
        
    }
    
    this.processPre = function(autoProcess) {
        // Attempt to evaluate the JSON
        try {
            eval('this.jdata = '+this.http.responseText);
        }
        catch(e) { 
            x6dialogs.alert("Could not process server response!");
            if(typeof(x4)!='undefined') {
                x4.debug(this.http.responseText);
            }
            if(x6.byId('x6Log')) {
                x6.byId('x6Log').innerHTML = http.responseText;
                x6.byId('x6Log').style.display='block';
            }
            this.http = false;
            return false;
        }
        
        // KFD 7/8/08, additional housekeeping, throw away
        //             references to the object
        this.http = false;

        // If there were server errors, report those
        if(this.jdata.error.length>0 && this.reportErrors) {
            this.hadErrors = true;
            x6dialogs.alert(this.jdata.error.join("\n\n"));
            return false;
        }
        if(this.jdata.notice.length>0 && this.reportErrors) {
            x6dialogs.alert(this.jdata.notice.join("\n\n"));
        }
        
        if(autoProcess) {
            this.process();
        }
        
        return true;
    }
    
    /****m* json/process
    *
    * NAME
    *   x6.json.process
    *
    * FUNCTION
    *   The Javascript method x6.json.execute is the final
    *   step in sending and receiving JSON requests.  This
    *   routine does the following:
    *   * Any HTML sent back via PHP x4HTML replaces the 
    *     innerHTML of the named items (actually item Ids are used).
    *   * Any script sent back via PHP x4Script is executed.
    *   * Any data sent back via PHP x4Data is placed into
    *     x6.data.
    *
    * EXAMPLE
    *   This example shows how you can retrieve table data and
    *   then process it:
    *
    *      <script>
    *      x6.json.init('x4Page','myCustomPage');
    *      x6.json.addParm('x4Action','getStates');
    *      // x6.json.execute will return false on errors
    *      if(x6.json.execute()) {
    *         // x6.json.process puts everything in its place...
    *         x6.json.process();
    *         // ...so that we can handle the returned data
    *         for (var idx in x6.data.states) {
    *            // do something
    *         }
    *      }
    *      <script>
    *
    *   This code requires the following PHP code on the server:
    *
    *      <?php
    *      # this is file application/x4myCustomPage.php
    *      class x4myCustomPage extends androX4 {
    *          function getStates() {
    *              $states = SQL("Select * from states");
    *              x4Data('states',$states);
    *          }
    *      }
    *
    *******
    */
    this.process = function(divMain) {
        for(var x in this.jdata.html) {
            if(x=='*MAIN*') {
                $('#'+divMain).html(this.jdata.html[x]);
            }
            else {
                var obj = x6.byId(x);
                if(obj) {
                    if (obj.tagName =='INPUT') {
                        obj.value = this.jdata.html[x];
                    }
                    else {
                        obj.innerHTML = this.jdata.html[x];
                    }
                }
            }
        }
        
        // Execute any script that was provided
        for(var x in this.jdata.script) {
            eval(this.jdata.script[x]); 
        }
        
        return true;
    }
}


/* **************************************************************** *\

   X6 Data Dictionary and general functions that require knowledge
   of a data dictionary or work on dictionary-supplied data.
   
\* **************************************************************** */
var x6dd = {
    // Oddly enough, we figured out how to do without this
    // by putting extra attributes onto inputs.  Currently 
    // not being used.
    tables: { },
    
    // KFD 11/13/08.  Generic display routine
    display: function(typeid,value,nullDisplay) {
        if(nullDisplay==null) nullDisplay = '';
        if(value==null || value.toString().trim()=='') {
            return nullDisplay;
        }
        switch(typeid) {
        case 'int':
        case 'numb':
        case 'money':
            if(value=='null') return '';
            return Number(value);
            break;
        case 'dtime':
            // if value contains decimal seconds, get rid of them
            if(value.indexOf('.')!=-1) {
                value = value.slice(0,value.indexOf('.'));
            }
            var retval = new Date(value);
            var hours  = retval.getHours();
            var ampm   = 'am'; 
            if(hours >= 12) {
                ampm = 'pm';
            }
            if(hours > 12) hours-=12;
            return retval.getMonth()
                +"/"+retval.getDate()
                +"/"+retval.getFullYear()
                +" "+hours.toString()
                +":"+retval.getMinutes().toString().pad(2,'0',STR_PAD_LEFT)
                +" "+ampm;
            break;
        default:
            return value;
        }
    }
}




/* **************************************************************** *\

   Universal x6 input keyup handler
   
\* **************************************************************** */
var x6inputs = {
    // Key up is used to look for changed values because
    // you do not see an input's new value until the keyup 
    // event.  You do not see it in keypress or keydown.
    keyUp: function(inp,e) {
        // KFD/JD IE event compatibility
        e = e ? e : window.event;
        
        x6.console.group("Input keyUp");
        x6.console.log(e);
        x6.console.log(inp);
        
        // KFD 1/15/09.  Key post-processing.  Reformat a date
        var type = $(inp).attr('xtypeid');
        if(type=='date') {
            // this will work until the year 2020
            var value = $(inp).attr('value').trim();
            if(value.length==6) {
                if(value.indexOf('/')==-1 && value.indexOf('-')==-1) {
                    var month=value.substr(0,2);
                    var day  =value.substr(2,2);
                    var year =value.substr(4,2);
                    yearint = parseInt(year);
                    if(yearint < 30) {
                        year = '20'+year;
                    }
                    else {
                        year = '19'+year;
                    }
                    inp.value=month+'/'+day+'/'+year;
                }
            }
        }
        
        
        
        x6inputs.setClass(inp);
        x6.console.groupEnd("Input keyUp");
    },
    
    // Keydown is used only for tab or shift tab, to enforce
    // the concept of a "tab loop".  This function only does
    // anything if there are no enabled controls after the
    // current control
    keyDown: function(inp,e) {
        // KFD/JD IE event compatibility
        e = e ? e : window.event;
        inp = inp ? inp : e.srcElement;
        x6.console.group('Input keyDown, input and event follow.');
        x6.console.log(inp);
        x6.console.log(e);
        var keyLabel=x6.keyLabel(e);
        var isTab   =keyLabel=='Tab'    || keyLabel=='ShiftTab';
        var isEnter =keyLabel=='Enter'  || keyLabel=='ShiftEnter';  
        var isMeta  =x6.keyIsMeta(e);
        var isNav   =isTab || (x6.options.get('navOnEnter',false) && isEnter);
        x6.console.log("label: "  ,keyLabel);
        x6.console.log('isTab: '  ,isTab   );
        x6.console.log('isEnter: ',isEnter );
        x6.console.log('isMeta: ' ,isMeta  );
        x6.console.log('isNav: '  ,isNav   );
        
        // All meta keys return true immediately except TAB and ENTER
        if(isMeta && !isNav) {
            var handUpList = ['UpArrow','DownArrow','PageUp','PageDown'];
            if(handUpList.indexOf(keyLabel)>=0) {
                // If we are passing it up or not, it should not be
                // handled by the doc level, so we suppress it.
                x6bb.fwSet('noKeyPress',true);
                x6.console.log("This key may be passed up to doc handler.");
                // An explicit flag can prevent handing events up
                if(x6.p(inp,'xNoPassup','N')=='N') {
                    if(x6inputs.x6select.div) {
                        if(keyLabel == 'DownArrow') {
                            x6inputs.x6select.display(inp,'Down');
                        }
                        if(keyLabel == 'UpArrow'  ) {
                            x6inputs.x6select.display(inp,'Up');
                        }
                    }
                    else {
                        x6.console.log("Going to doc keypress dispatcher.");
                        var retval= x6.keyDispatcher(e);
                    }
                }
                x6.console.groupEnd(); 
                return retval;
            }
            else if(keyLabel=='CtrlLeftArrow') {
                this.firstInput(inp);
            }
            else if(keyLabel=='CtrlRightArrow') {
                this.lastInput(inp);
            }
            else if(keyLabel=='ShiftDownArrow') {
                if(x6.p(inp,'x6select','N')=='Y') {
                    x6inputs.x6select.display(inp,'Down');
                }
            }
            else if(keyLabel=='ShiftUpArrow') {
                if(x6.p(inp,'x6select','N')=='Y') {
                    x6inputs.x6select.display(inp,'Up');
                }
            }
            else if(keyLabel=='Home') {
                if(inp.selectionStart == 0 && inp.selectionEnd==0)
                    this.firstInput(inp);
            }
            else if(keyLabel=='End') {
                x6.console.log(inp);
                var ss = inp.selectionStart;
                var se = inp.selectionEnd;
                var ln = inp.value.toString().trim().length;
                x6.console.log(ss,se,ln);
                if(ss == se && se == ln) this.lastInput(inp);
            }
            else {
                x6.console.log("meta but not nav, ret true");
            }
            x6.console.groupEnd();
            return true;
        }
        
        // Type validation for some types, only if not TAB or ENTER
        if(!isNav ) {
            x6.console.log("Not nav key, doing type validation");
            if(x6.p(inp,'xLookup','N')=='Y') {
                x6.console.log("This is a lookup input, allowing everything");
                x6.console.groupEnd();
                return true;
            }
            type = x6.p(inp,'xtypeid');
            switch(type) {
            case 'int':
                x6.console.log("type validation for int");
                if(!x6.keyIsNumeric(e)) return false;
                break;
            case 'numb':
            case 'money':
                x6.console.log("type validation for numb/money");
                if(!x6.keyIsNumeric(e) && x6.keyLabel(e)!='.') return false;
                break;
            case 'date':
                x6.console.log("type validation for date");
                if(!x6.keyIsNumeric(e)) {
                    if(keyLabel!='-' && keyLabel!='/') return false;
                }
                break;
            case 'gender':
                if(['M','F','U','H'].indexOf(keyLabel.toUpperCase())==-1) {
                    return false;
                }
                break;
            case 'cbool':
                if(['Y','N'].indexOf(keyLabel.toUpperCase())==-1) {
                    return false;
                }
                break;
            }
            
            // Next possibility is a lookup that requires a
            // fetch from the server.
            if(x6.p(inp,'x6select','N')=='Y' && x6.p(inp,'xValues',null)==null) {
                // Generate the value to send back
                x6.console.group("An x6select, fetching from Server");
                var val = inp.value;
                var val = val.slice(0,inp.selectionStart)
                    +keyLabel
                    +val.slice(inp.selectionEnd);
                x6.console.log("current value: ",inp.value)
                x6.console.log("sel start: ",inp.selectionStart)
                x6.console.log("sel end: ",inp.selectionEnd)
                x6.console.log("computed value:",val);
                json = new x6JSON('x6page',x6.p(inp,'x6seltab'));
                json.addParm('x6select','Y');
                json.addParm('gpletters',val);
                json.execute(true);
                //x6inputs.x6select.display(inp);
                x6inputs.x6select.displayDynamic(inp,x6.data.x6select);
                x6.console.groupEnd();
            }
          
            // Yet another possibility is a lookup on a set
            // of fixed values.  
            if(x6.p(inp,'x6select','N')=='Y' && x6.p(inp,'xValues',null)!=null) {
                x6inputs.x6select.display(inp);
            }
            
            x6.console.log("Type validation complete, returning true");
            x6.console.groupEnd();
            return true;
        }
        // <---- EARLY RETURN.  If we did type validation
        //                      we are finished.  The rest of
        //                      this is only for TAB.
        
        // If this input has an open x6select (SELECT replacement)
        // then ask it for the value.
        //
        // Do this *before* the afterBlurner command below, so that
        // the value is set when afterBlurner fires.
        if(x6.p(inp,'x6select','N')=='Y') {
            x6inputs.x6select.assignToMe(inp);
            x6inputs.x6select.hide();
        }
        
        // This took a lot of experimentation to get right.
        // Normally a BLUR would occur when an object loses focus
        //  -> except if the user hits ENTER, we must force processing
        //  -> except if processing enables new inputs
        //
        // So we unconditionally fire the afterblurner to hit
        // anything the control's special processing code might
        // do.  Then we proceed normally.
        //
        // Also: returning false does NOT prevent losing focus,
        // that's we don't check the return value.  We are not
        // *validating*, we are *processing*.
        x6inputs.afterBlurner(inp);
        
        
        // Get the first and last controls for easier
        // logic immediately below
        var tg       = x6.p(inp,'xTabGroup','tgdefault');
        var jqString = '[xTabGroup='+tg+']:not([disabled])';
        var jqObj = $(jqString);
        var inpCount = jqObj.length;
        var first    = jqObj[0];
        var last     = jqObj[inpCount-1];

                
        // If we are on first or last, Enter/Tab dichotomy does not matter,
        // we just send focus where we want and return false to kill
        // original behavior.
        if(inp==first && e.shiftKey) {
            var str ='[xTabGroup='+tg+']:not([disabled]):last';
            x6.jqSetFocus(str);
            x6.console.log("First input, hit shift, going to last");
            x6.console.groupEnd();
            return false;
        }
        if(inp==last && !e.shiftKey) {
            var str = '[xTabGroup='+tg+']:not([disabled]):first';
            x6.jqSetFocus(str);
            x6.console.log("Last input, no shift, going to first");
            x6.console.groupEnd();
            return false;
        }
        
        // If they hit the TAB key, we can quit now and return
        // true to allow default behavior.  If they hit ENTER 
        // we have to work out the next control to give focus
        // to, either forward or backward
        if(isTab) {
            x6.console.log("Tab key hit, returning true");
            x6.console.groupEnd();
            return true;
        }
        if(!e.shiftKey) {
            // no shift means look for next one
            var focusTo = false;
            var foundMe = false;
            $('[xTabGroup='+tg+']:not([disabled])').each(
                function() {
                    x6.console.log(this.id);
                    x6.console.log(focusTo,foundMe);
                    if(focusTo) return;
                    if(foundMe) {
                        focusTo = this.id;
                    }
                    if(this == inp) foundMe = true;
                }
            );
            if(focusTo) {
                x6.console.log("Setting focus forward to ",focusTo);
                // KFD 1/8/08. zActive MARK
                //var str = '[zActive]#'+focusTo;
                var str = '#'+focusTo;
                x6.jqSetFocus(str);
                //$('[zActive]#'+focusTo).focus().select();
            }
            
        }
        else {
            // shift means look for previous one.  Go forward 
            // through inputs, assuming each one is the one that
            // will get focus.  Once we find the input we are
            // on stop doing that, and the last one assigned will
            // be the one that gets focus.
            var focusTo = false;
            var foundMe = false;
            $('[xTabGroup='+tg+']:not([disabled])').each(
                function() {
                    if(foundMe) return;
                    if(this == inp) 
                        foundMe = true;
                    else
                        focusTo = this.id;
                }
            );
            if(focusTo) {
                x6.console.log("Setting focus backward to ",focusTo);
                var str = '[zActive]#'+focusTo;
                x6.jqSetFocus(str);
                //$('[zActive]#'+focusTo).focus().select();
            }
        }
        x6.console.log("Returning True");
        x6.console.groupEnd();
        return true;
    },
    
    focus: function(inp) {
        x6.console.group("Input focus ",inp.id);
        x6.console.log("Input: ",inp);
        this.x6select.checkForMe(inp);
        inp.zSelected = 1;
        inp.zOriginalValue = x6.p(inp,'zOriginalValue','').trim();
        inp.lastBlurred    = '';
        x6inputs.setClass(inp);
        if(x6.p(inp,'zNew',0)==0) {
            x6bb.fwSet('lastFocus_'+x6.p(inp,'xTableId'),inp.id);
        }
        x6.console.log("Input focus DONE");
        x6.console.groupEnd();
        return true;
    },
    // KFD 11/29/08, not being called anywhere?
    //xFocus: function(anyObject) {
    //    $(this).addCla*ss('selected');
    //},
    
    blur: function(inp) {
        x6.console.group("Input blur ",inp.id);
        inp.zSelected = 0;
        x6inputs.setClass(inp);
        x6inputs.afterBlurner(inp);
        x6inputs.x6select.hide();
        x6.console.log("Input Blur DONE");
        x6.console.groupEnd();
        return true;
    },
    // KFD 11/29/08, not being called anywhere?
    //xBlur: function(anyObject) {
    //},
    /*
    *  We need to route through a wrapper to afterBlur 
    *  mostly to keep it from firing multiple times.
    *  Example: a blur calling alert() causes blur to fire again
    *  
    */
    afterBlurner: function(inp) {
        x6.console.group("afterBlurner");
        x6.console.log(inp);
        if(x6.p(inp,'inblur',false)) {
            x6.console.log("inblur flag set, no action");
            x6.console.groupEnd();
            return false;
        }
        inp.inblur = true;
        // If method does not exist forget it
        if(!inp.afterBlur) {
            x6.console.log("No afterBlur(), leaving flag set and returning");
            x6.console.groupEnd();
            return true;
        }
        // If value has changed, fire it
        if(inp.lastBlurred==x6.p(inp,'value','').trim()) {
            x6.console.log("Input lastBlurred is current value, no action");
            x6.console.groupEnd();
            inp.inblur = false;
            return true;
        }
        else {
            // Note that returning true only means the afterBlur() will
            // not be fired again for this value.  It does not mean there
            // is anything particularly "valid" or correct about the
            // value.
            if(inp.afterBlur()) {
                x6.console.log("Afterblurner setting flag false, return true");
                x6.console.groupEnd();
                inp.inblur = false;
                inp.lastBlurred = x6.p(inp,'value','').trim();
                return true;
            }
            else {
                x6.console.log("Afterblurner setting flag false, return false");
                x6.console.groupEnd();
                inp.inblur = false;
                return false;
            }
        }
    },
    
    enable: function(inp) {
        if(typeof(inp)=='string') inp = x6.byId(inp);
        x6.console.log("Enabling input ",inp.id);
        inp.disabled = false;
        inp.zOriginalValue = x6.p(inp,'value','');
        this.setClass(inp);
    },
    disable: function(inp) {
        if(typeof(inp)=='string') inp = x6.byId(inp);
        x6.console.log("Disabling input ",inp.id);
        inp.disabled = true;
        this.setClass(inp);
    },
    
    setClass: function(inp) {
        if(x6.p(inp,'xLookup')=='Y') return;

        // If permupd for this table is "N", all controls
        // become read only
        if(x6bb.fwGet('permupd_'+x6.p(inp,'xTableId'),'')=='N') {
            inp.disabled = true;
        }
        
        
        // Easiest is disabled controls, remove all classes
        if(x6.p(inp,'disabled',false)) {
            inp.className='';
            doRow = x6.p(inp,'xClassRow',0);
            if(doRow!=0) {
                inp.parentNode.parentNode.className = '';
            }
            return;
        }
        
        ux = x6.uniqueId();
        x6.console.group("setClass for an input  "+ux);
        x6.console.log(inp);
        if(x6.p(inp,'zOriginalValue',null)==null) inp.zOriginalValue = '';
        if(inp.value.trim()==inp.zOriginalValue.trim()) {
            inp.zChanged = 0;
        }
        else {
            inp.zChanged = 1;
        }
        
        // First grab the flags that determine
        // what we will do
        var zSelected = x6.p(inp,'zSelected',0);
        var zChanged  = x6.p(inp,'zChanged', 0);
        var zError    = x6.p(inp,'zError'  , 0);
        //var zRO       = x6.p(inp,'zRO'     , 0);
        var zNew      = x6.p(inp,'zNew'    , 0);
        
        // now pick them in order of preference,
        // we only pick one stem.
        //if     (zRO)      css = 'readOnly';
             if(zError)   css = 'error';
        else if(zNew)     css = 'changed';
        else if(zChanged) css = 'changed';
        else              css = '';
        x6.console.log("initial class is "+css);
        
        // Now pick the selected version if required
        if(zSelected) css += 'Selected';
        x6.console.log("Final class is "+css);
        
        // Now do some stuff if it is read only
        //inp.disabled = zRO;
        x6.console.log("Read Only Decision is",inp.disabled);
        
        // Flag to do the row
        doRow = x6.p(inp,'xClassRow',0);
            
        // Now set the class name
        inp.className = css;
        if(doRow!=0) {
            x6.console.log('do row');
            if(zSelected) {
                inp.parentNode.parentNode.className = 'selected';
            }
            else {
                inp.parentNode.parentNode.className = '';
            }
        }
        x6.console.groupEnd();
    },
    
    clearOut: function(inp) {
        if(inp.zSelected==1) {
            x6.console.log("In clear out, blurring ",inp);
            inp.blur();
        }
        inp.disabled       = true;
        inp.zNew           = 0;
        inp.zSelected      = 0;
        inp.value          = '';
        inp.zOriginalValue = '';
        x6inputs.setClass(inp);
    },
    
    findFocus: function(obj) {
        if(typeof(obj)=='string') {
            x6.jqSetFocus(obj+" :input:first:not([disabled])");
            //$(obj+" :input:first:not([disabled])").focus();
        }
        else {
            $(obj).find(":input:first:not([disabled])").focus();
        }
    },
    
    firstInput: function(inp) {
        var xtg = x6.p(inp,'xTabGroup','tgdefault');
        x6.jqSetFocus(":input[xtabgroup="+xtg+"]:not([disabled]):first");
    },
    lastInput: function(inp) {
        var xtg = x6.p(inp,'xTabGroup','tgdefault');
        x6.jqSetFocus(":input[xtabgroup="+xtg+"]:not([disabled]):last");
    },
    
    jqFocusString: function() {
        return ":input:not([disabled]):first";
    },
    
    obj: function(table,column) {
        if(table ==null) table='';
        if(column==null) column='';
        var selector = ':input'
        if(table!='') {
            selector += '[xtableid='+table+']';
        }
        if(column!='') {
            selector += '[xcolumnid='+column+']';
        }
        var jq = $(selector);
        if(jq.length>0) {
            return jq[0];
        }
        else {
            return false;
        }
    },
    
    viewClob: function(inp,table,column) {
        if(typeof(inp)=='number') {
            var skey = inp;
        }
        else {
            var skey = x6bb.fwGet('skey_'+table,-1);
        }
        if(skey==-1) return;
        x6.console.log(table,skey);
        
        x6.json.init('x6page',table);
        x6.json.addParm('x6action','viewClob');
        x6.json.addParm('skey'    ,skey);
        x6.json.addParm('column'  ,column);
        x6.json.newWindow();
    },
    
    ddClick: function(button) {
        var id = x6.p(button,'xInputId');
        var inp = $('#'+id)[0];
        if(inp.disabled) return;
        if(x6.p(inp,'xValues','')=='') {
            x6dialogs.alert("To see values, please click on the input"
                +" and type in one or two letters to activate an"
                +" automatic search."
            );
            return;
        }
        this.x6select.display(inp);
    },
    
    x6select: {
        input:       false,
        dynRowCount: 15,
        div:         false,
        
        addButton: function(input) {
            if(x6.p(input,'x6select','N')=='Y') {
                var str= '<span '
                    + 'class="button" '
                    + 'xInputId="'+input.id+'" '
                    + 'onmousedown = "this.className = '+"'button_mousedown'"+'" '
                    + 'onmouseup   = "this.className = '+"'button'"+'" '
                    + 'onmouseout  = "this.className = '+"'button'"+'" '
                    + 'onclick="x6inputs.ddClick(this)">'
                    + '&nbsp;&darr;&nbsp;</span>';
                $(input).after(str);
            }
        },
        
        checkForMe: function(input) {
            if(this.input != input) this.hide();
        },
        
        hide: function() {
            $(".x6select").remove();
            this.tbody=false;
            this.div  =false;
            this.input=false;
        },
        
        assignToMe: function(inp) {
            if(this.div) {
                var row = $('.x6select tr.hilight');
                if(row.length > 0) {
                    inp.value = row[0].firstChild.innerHTML;
                }
            }
        },
        
        display: function(input,fromKeyboard) {
            if(fromKeyboard!=null) {
                if(this.div && this.div.style.display=='block') {
                    return this.moveUpOrDown(fromKeyboard);
                }
            }
            
            if(!this.div) {
                this.input = input;
                this.div = document.createElement('DIV');
                this.div.style.display    = 'none';
                this.div.style.position   = 'absolute';
                this.div.style.backgroundColor = 'white';
                this.div.style.overflow   = 'hidden';
                this.div.style.border     ="1px solid black";
                var lineHeight            = $(input).height();
                this.lineHeight           = lineHeight;
                this.div.style.lineHeight = lineHeight+"px";
                this.div.style.cursor     = 'pointer';
                this.div.style.zIndex     = 1000;
                this.div.className        = 'x6select';

                // Work out minimum width as the input plus the button
                var jqButton = $('[xInputId='+input.id+']');
                if(jqButton.length==0) {
                    var minwidth = 10;
                }
                else {
                    var minwidth 
                        = ($(jqButton).offset().left - $(input).offset().left)
                        + $(jqButton).width();
                }
                this.div.style.minWidth = minwidth + "px";
                
                // Put in the titles.  This is also where we
                // work out the height of the drop-down
                this.div.innerHTML = this.displayTitles(input);
                
                // Put in the div, and do the mouse events
                document.body.appendChild(this.div);

                // This is for optimization, allows us to avoid
                // repeatedly making jquery calls for this object
                this.tbody = $('.x6select tbody')[0];
                
                // special routine to populate with fixed
                // values on a pre-populated attribute.  If none
                // are there it does nothing.
                this.displayFixed(input);
                
            }
            // If it is invisible, position it and then make it visible
            if(this.div.style.display=='none') {
                var position = $(input).offset();
                var postop = position.top -1;
                var poslft = position.left;
                this.div.style.top  = (postop + input.offsetHeight +1) + "px";
                this.div.style.left = poslft + "px";
                this.div.style.display = 'block';
                this.mouseEvents(input);
            }
            
            if(fromKeyboard != null) {
                this.moveUpOrDown(fromKeyboard);
            }
            else {
                //$(input).focus();
                x6.byId(input.id).focus();
            }
        },
        
        displayTitles: function(input) {
            // If still here, we have values and descriptions
            var retval = '<table><thead><tr>';
            var descs  = x6.p(input,'xTitles').split('|');
            for(var idx=0; idx<descs.length; idx++) {
                retval+='<th>'+descs[idx]+'</th>';
            }
            retval+='<th>&nbsp;&nbsp;&nbsp;&nbsp;';

            // Now work out the height.  If static, go by
            // the number of rows, otherwise set it to 16, which
            // is 15 for data and one for titles.
            if(x6.p(input,'x6rowCount',null)!=null) {
                var rowCount = Number(x6.p(input,'x6rowCount'));
                if(rowCount > this.dynRowCount) rowCount = this.dynRowCount;
            }
            else {
                var rowCount = this.dynRowCount;
            }
            this.div.style.height = ((this.lineHeight+3)*(rowCount+1))+"px";
            // ...and the height of the body
            var h = (this.lineHeight + 3)*rowCount;
            
            // Now put out an empty body
            retval+='</thead>'
                +'<tbody style="height: '+h+'px; max-height: '+h+'px; '
                +' overflow-y:scroll">'
                +'</tbody></table>';
            return retval;
        },
        
        displayFixed: function(input) {
            var svals = x6.p(input,'xValues','');
            if(svals.trim()=='') return;

            x6.console.log(svals);
            retval = '';
            var rows   = svals.split('||');
            for(var idx=0;idx<rows.length;idx++) {
                retval += '<tr>';
                var values = rows[idx].split('|');
                for(var idx2=0;idx2 < values.length; idx2++) {
                    retval+= '<td>'+values[idx2];
                }
            }
            x6.console.log(retval);
            this.tbody.innerHTML = retval;
        },
        
        displayDynamic: function(input,rows) {
            x6.console.group("In x6input.s6select.displayDynamic");
            x6.console.log(input);
            x6.console.log(rows);
            window.rows = rows;
            // Begin by determining if we will show or hide
            retval = ''
            if(rows.length==0) {
                x6.console.log("There are no rows, hiding display");
                this.hide();
                //this.tbody.innerHTML = '';
                x6.console.groupEnd();
                return;
            }
            this.display(input);  
            
            // Find out if there is a currently selected row
            var curVal = '';
            var jqCandidate = $(this.tbody).find("tr.hilight td:first");
            if(jqCandidate.length > 0 ) {
                curVal = jqCandidate[0].innerHTML;
            }
            
            var rows_length = rows.length;
            for(var idx in rows) {
                retval += '<tr>';
                var values = rows[idx];
                for(var idx2 in values) {
                    if(values[idx2] == null) {
                        retval+= '<td>&nbsp;';
                    }
                    else {
                        retval+= '<td>'+values[idx2];
                    }
                }
            }
            var lh = this.lineHeight + 3;
            if(rows.length < this.dynRowCount) {
                this.div.style.height = lh*(rows.length+1) + "px";
                this.tbody.style.height = lh*rows.length  + "px";
            }
            else {
                this.div.style.height = lh*(this.dynRowCount+1) + "px";
                this.tbody.style.height = lh*this.dynRowCount + "px";
            }
            
            this.tbody.innerHTML = retval;
            this.mouseEvents(input);

            // Now determine if we will highlight a row
            var doFirst = true;
            if(curVal!='') {
                var jqCandidate = $(this.tbody).find('td:contains('+curVal+')');
                if(jqCandidate.length > 0) {
                    $(jqCandidate).mouseover();
                    doFirst = false;
                }
            }
            if(doFirst) {
                window.x = this.tbody;
                $(this.tbody).find('td:first').mouseover();
            }
            x6.console.groupEnd();
        },
        
        mouseEvents: function(input) {
            $('.x6select td')
            .each(
                function() {
                    this.input = input;
                }
            )
            .mouseover(
                function() {
                    var rowNow = $('.x6select tr.hilight');
                    if(rowNow.length > 0) {
                        if(rowNow[0] == this.parentNode) return;
                    }
                    $('.x6select tr.hilight').removeClass('hilight');
                    $(this.parentNode).addClass('hilight');
                }
            )
            .mousedown(
                function(e) {
                    this.input.value = this.parentNode.firstChild.innerHTML;
                    x6inputs.afterBlurner(this.input);
                    x6inputs.x6select.hide();
                    setTimeout(
                        function() {
                            $(this.input).focus();
                        }
                        ,100
                    );
                    e.stopPropagation();
                    return false;
                }
            );
        },
        
        moveUpOrDown: function(direction) {
            // get current row
            var rowNow = $('.x6select tr.hilight:visible');
            var jqBody = $('.x6select tbody');
            if(rowNow.length==0) {
                $(jqBody[0].firstChild).addClass('hilight');
            }
            else {
                if(direction == 'Up') {
                    var candidate = $(rowNow).prev();
                    x6.console.log("Up candidate ",candidate);
                    var rowsBelow = $(rowNow).nextAll().length;
                    if(rowsBelow > 5) {
                        var stNow = $('.x6select tbody').scrollTop();
                        $(jqBody).scrollTop(stNow - ( this.lineHeight + 3));                        
                    }
                }
                else {
                    var candidate = $(rowNow).next();
                    x6.console.log("Down candidate ",candidate);
                    var rowsAbove = $(rowNow).prevAll().length;
                    if(rowsAbove > 5) {
                        var stNow = $('.x6select tbody').scrollTop();
                        $(jqBody).scrollTop(stNow + this.lineHeight + 3);                        
                    }
                }
                x6.console.log("row now ",rowNow);
                x6.console.log(direction);
                if (candidate.length > 0) $(candidate[0].firstChild).mouseover();
            }
        }
    }
}



/* **************************************************************** *\

   X6 Builtin plugins
   
\* **************************************************************** */

/****O* Javascript-API/x6plugins
*
* NAME
*   x6plugins
*
* FUNCTION
*   The javascript object x6plugins is a collection of functions.
*   Each function is a 'constructor'.
*  
*
******
*/
var x6plugins = {
    buttonNew: function(self,id,table) {
        x6plugins.buttonStandard(self,'new','CtrlN');
        self.main = function() {
            return x6events.fireEvent('reqNewRow_'+this.zTable);   
        }
    },
    buttonInsert: function(self,id,table) {
        x6plugins.buttonStandard(self,'ins','CtrlI');
        self.main = function() {
            return x6events.fireEvent('reqNewRow_'+this.zTable,true);   
        }
    },
    buttonDelete: function(self,id,table) {
        x6plugins.buttonStandard(self,'delete','CtrlD');
        self.main = function() {
            return x6events.fireEvent('reqDelRow_'+this.zTable);
        }
    },
    buttonCancel: function(self,id,table) {
        x6plugins.buttonStandard(self,'cancel','Esc');
        self.main = function() {
            x6events.fireEvent('reqUndoRow_'+this.zTable);
        }
    },
    buttonSave: function(self,id,table) {
        x6plugins.buttonStandard(self,'save','CtrlS');
        self.main = function() {
            return x6events.fireEvent('reqSaveRow_'+this.zTable);
        }
    },
    buttonCustom: function(self,id,table) {
        self.zTable = table;
        // This is sort of the same as the predefined buttons
        x6plugins.buttonStandard(self,id,x6.p(self,'buttonKey'));
        
        // This is special for custom buttons
        x6events.subscribeToEvent('buttonsOn_'+table,id);
        self['receiveEvent_buttonsOn_'+table] = function() {
            var skey = x6bb.fwGet('skey_'+this.zTable);
            var doit = false;
            if(skey==0) {
                doit = x6.p(this,'permins','N')=='Y';
            }
            else {
                doit = x6.p(this,'permupd','N')=='Y';
            }
            if(doit) {
                this.className = 'button';
                this.zDisabled = false;
            }
            return true;
        }
        x6events.subscribeToEvent('buttonsOff_'+table,id);
        self['receiveEvent_buttonsOff_'+table] = function() {
            this.className = 'button_disabled';
            this.zDisabled = true;
            return true;
        }
    },
    
    /****m* x6plugins/buttonStandard
    *
    * NAME
    *   x6plugins.buttonStandard
    *
    * FUNCTION
    *   The Javascript method buttonStandard gives a button 
    *   object the standard behavior of responding to 
    *   a single keystroke and responding to enable/disable
    *   commands.
    * 
    *   Use this function when you create a custom button to
    *   put onto the screen.
    *
    *   A custom button requires a uniquely named 'action' and
    *   a hotkey.  Actions reserved by andromeda are:
    *   *  duplicate
    *   *  new
    *   *  remove
    *   *  save
    *
    * EXAMPLE
    *   A custom button is created in PHP code like so:
    *
    *    <?php
    *    # option 1, straight html
    *    <input type='button' x6plugIn='buttonMine' x6table='example'>
    *
    *    # option 2, or a link
    *    $div = html('div');
    *    $a = $div->h('a-void','My Action');
    *    $a->hp['x6plugIn'] = 'buttonMine';
    *    $a->hp['x6table'] = 'example';  // only if relevant
    *    ?>
    *
    *   Then you define a javascript x6plugIn that includes a 
    *   single function, main(), which is called when the button
    *   is enabled and is clicked or the hotkey is pressed.
    *
    *     <script>
    *     x6plugins.buttonMine = function(self,id,table) {
    *         // the first line activates normal behavior, 
    *         // replace the values in this line with those
    *         // appropriate to your button.
    *         x6plugins.buttonStandard(self,'save','CtrlS');
    *
    *         // Then create the main function 
    *         self.main = function() {
    *            // fire off some event
    *         }
    *     }
    *     </script>    
    *
    ******/
    buttonStandard: function(self,action,key) {
        // Assume everything starts out disabled
        self.zDisabled = true;
        self.zTable    = x6.p(self,'x6table');
        self.zAction   = action;
        self.zKey      = key;
        
        // Respond to an enable event
        x6events.subscribeToEvent('enable_'+action+'_'+self.zTable,self.id);
        self['receiveEvent_enable_'+action+'_'+self.zTable] = function() {
            this.className = 'button';
            this.zDisabled = false;
        }

        // Respond to an disable event
        x6events.subscribeToEvent('disable_'+action+'_'+self.zTable,self.id);
        self['receiveEvent_disable_'+action+'_'+self.zTable] = function() {
            this.className = 'button_disabled';
            this.zDisabled = true;
        }
        
        // Create an empty main routine to be replaced
        // button by button.  Put out a useful error message
        // when they have not made their main function.
        self.main = function() {
            x6.console.error(
                "Button "+this.id+", handling action "+this.zAction
                +" and keypress "+this.zKey+" has no main() function."
            );
        }
        // Respond to a keypress event
        x6events.subscribeToEvent('key_'+key,self.id);
        self['receiveEvent_key_'+key] = function() {
            if(!this.zDisabled) this.main();
        }
        
        // finally of course set the onclick method
        $(self).click(function() { 
            if(!this.zDisabled) this.main(); 
        });
        
        // Make cute mouse effects on buttons
        self.onmousedown = function() {
            if(!this.zDisabled) {
                $(this).addClass('button_mousedown');
            }
        }
        self.onmouseup = self.onmouseout = function() {
            if(!this.zDisabled) {
                $(this).removeClass('button_mousedown');
            }
        }
    }
}
 

/****m* x6plugins/tableController
*
* NAME
*   x6plugins.tableController
*
* FUNCTION
*   The Javascript method x6plugins.tableController is
*   a constructor function.  It accepts as a parameter the
*   ID of a DOM element.  It adds functions to that DOM 
*   element so that it will fully implement all browser-side
*   features of our tableController object.
*
*   A tableController subscribes to all events in which a
*   user requests to do something like add a row or delete
*   a row.  The tableController executes whatever server-side
*   requests are required, and then fires various events to
*   notify other UI elements that they should display the
*   results.
* 
*   Normally you do not invoke this method directly.  All 
*   x6 plugins are detected and implmented automatically on
*   page load.

*   To turn any DOM element into a table controller, just set
*   the properties x6plugIn and x6table, as in either
*   of these:
*
*      <?php
*      # here is one way to do it:
*      echo "<div x6plugIn='tableController' x6table='users'>";
*
*      # another way to do it:
*      $div = html('div');
*      $div->hp['x6plugIn'] = 'tableController';
*      $div->hp['x6table'] = 'users';
*      $div->render();
*      ?>
*
*   You should not have more than one table controller per 
*   table on a page -- Andromeda will not trap for this!
*
* INPUTS
*   id - the ID of the object to be 'activated'.
*
* RESULTS
*   no return value.
*
******
*/
x6plugins.tableController = function(self,id,table) {
    // Initialize new properties
    x6bb.fwSet('skey_'+table,-1);
    self.zTable   = table;
    self.zSortCol = false;
    self.zSortAsc = false;
    self.zCache   = x6.p(self,'xCache')=='Y' ? true : false;
    
    if(x6.p(self,'xPermIns','*')=='*') {
        alert("Program Error!  Table Controller was not assigned permissions!"
            +"\n\nPlease assign xPermIns,xPermUpd,xPermDel,xPermSel"
        );
    }
    else {
        x6bb.fwSet('permins_'+table,x6.p(self,'xPermIns'));
        x6bb.fwSet('permupd_'+table,x6.p(self,'xPermUpd'));
        x6bb.fwSet('permdel_'+table,x6.p(self,'xPermDel'));
        x6bb.fwSet('permsel_'+table,x6.p(self,'xPermSel'));
    }
    
    /*
    *   Table controller accepts the request to
    *   save current changes.  First checks if this
    *   makes sense.
    *   
    */
    x6events.subscribeToEvent('reqSaveRow_'+table,id);
    self['receiveEvent_reqSaveRow_'+table] = function(dupe) {
        x6.console.group("tableController reqSaveRow "+this.zTable);
        
        var result = this.saveOk();
        x6bb.fwSet('lastSave_'+this.zTable,result);
        x6.console.log('tableController reqSaveRow finished');
        x6.console.groupEnd();
    }
    
    
    /*
    *   Table controller accepts the request to
    *   begin editing a new row.  It must first 
    *   work out if any open rows being edited must
    *   be saved.  If everything works out it 
    *   broadcasts a UI notification that UI elements
    *   should display their inputs in NEW mode.
    *   
    */
    x6events.subscribeToEvent('reqNewRow_'    +table,id);
    self['receiveEvent_reqNewRow_'+table] = function(tabDivBefore) {
        x6.console.group("tableController reqNewRow "+this.zTable);
        
        var result = this.saveOk();
        x6bb.fwSet('lastSave_'+this.zTable,result);
        if(result!='fail') {
            x6events.fireEvent('uiNewRow_'+this.zTable,tabDivBefore);
        }
        x6.console.groupEnd();
    }

    /*
    *   Table controller accepts a request to edit a 
    *   row.  It is smart enough that if we are already
    *   editing that row it does nothing.  Otherwise
    *   it tries to save any existing row before 
    *   deciding whether to move on.
    *   
    */
    x6events.subscribeToEvent('reqEditRow_'+table,id);
    self['receiveEvent_reqEditRow_'+table] = function(skey) {
        x6.console.group("tableController reqEditRow "+this.zTable);
        var skeynow = x6bb.fwGet('skey_'+this.zTable);
        if(skeynow == skey) {
            x6.console.log("Request to edit same row, no action");
        } 
        else {
            var result = this.saveOk();
            x6bb.fwSet('lastSave_'+this.zTable,result);
            if(result!='fail') {
                x6events.fireEvent('uiEditRow_'+this.zTable,skey);
            }
        }
        x6.console.log("tableController reqEditRow finished");
        x6.console.groupEnd();
        return true;
    }
    
    /*
    *   The saveOk figures out if it needs to save and
    *   tries to do so.  If no active fields have changed,
    *   it just returns 'noaction'.  If it needs to save,
    *   it attempts to do so and returns 'success' or
    *   'fail'.
    */
    self.saveOk = function() {
        x6.console.group("tableController saveOK");
        var inpAll = { };
        var inpChg = { };
        var cntChg = 0;
        var jq = ':input[xtableid='+this.zTable+'][zActive]';
        x6.console.log("Query string",jq);
        var rowOld = { };
        $(jq).each(
            function() {
                var col = x6.p(this,'xcolumnid');
                inpAll[col] = this.value;
                rowOld[col] = x6.p(this,'zOriginalValue','').trim();
                var oval = x6.p(this,'zOriginalValue','').trim();
                if(this.value.trim()!= oval) {
                    inpChg[col] = this.value.trim();
                    cntChg++;
                }
            }
        );
        x6bb.fwSet('rowOld_'+this.zTable,rowOld);
        x6.console.log("All inputs: ",inpAll);
        x6.console.log("Changed inputs: ",inpChg);
        x6.console.log("Count of changes: ",cntChg);
        
        // Only attempt a save if something changed
        if(cntChg == 0) {
            var retval = 'noaction';
            var skeynow=x6bb.fwGet('skey_'+this.zTable)
            if(skeynow==0) {
                x6.console.log(" ---- was editing new row, exit denied ---- ");
                x6bb.fwSet('exitApproved',false);
            }
        }
        else {
            x6.console.log(" ---- There were changes, not approving exit ----");
            x6bb.fwSet('exitApproved',false);
            
            x6.console.log("attempting database save");
            x6.console.log("Sending x4v_skey ",this.zSkey);
            x6.json.init('x6page',this.zTable);
            x6.json.addParm('x6action','save');
            x6.json.addParm('x6v_skey',x6bb.fwGet('skey_'+this.zTable));
            x6.json.inputs(jq);
            // Look for an "skey after" to send back 
            var queuepos  = x6bb.fwGet('queuepos_'+this.zTable,false);
            if(queuepos) {
                var skeyAfter = x6bb.fwGet('skeyAfter_' +this.zTable,-1);
                var skeyBefore= x6bb.fwGet('skeyBefore_'+this.zTable,-1);
                x6.json.addParm('queuepos'  ,queuepos);
                x6.json.addParm('skeyAfter' ,skeyAfter);
                x6.json.addParm('skeyBefore',skeyBefore);
            }
            if(x6.json.execute()) {
                var retval = 'success';
                x6.json.process();
            }
            else {
                var retval = 'fail';
                var errors = [ ];
                for(var idx = 0; idx < x6.json.jdata.error.length; idx++) {
                    if(x6.json.jdata.error[idx].slice(0,8)!='(ADMIN):') {
                        errors.push(x6.json.jdata.error[idx]);
                    }
                }
                x6.console.log("save failed, here are errors");
                x6.console.log(errors);
                x6events.fireEvent('uiShowErrors_'+this.zTable,errors);
            }
        }
        x6bb.fwSet('lastSave_'+this.zTable,retval);
        
        // If save went ok, notify any ui elements, then 
        // fire off a cache save also if required.
        if(retval=='success') {
            // KFD 1/8/09, fire a delta of the row
            x6events.fireEvent(
                'rowDelta_'+this.zTable
                ,{rowOld:rowOld, rowNew:x6.data.row}
            );
            
            
            x6.console.log(retval);
            x6events.fireEvent('uiRowSaved_'+table,x6.data.row);
            if(this.zCache) {
                this.zRows[x6.data.row.skey] = x6.data.row;
            }
        }            
        
        x6.console.log("tableController saveOK RETURNING: ",retval);
        x6.console.groupEnd();
        return retval;
    };


    /*
    *   The table controller accepts requests to undo
    *   changes to a row.  It actually rolls back all
    *   inputs and sets their classes, and then
    *   fires of a uiUndoRow event so various other
    *   elements can do their own thing.
    */
    x6events.subscribeToEvent('reqUndoRow_'+table,id);
    self['receiveEvent_reqUndoRow_'+table] = function() {
        x6.console.group("tableController reqUndoRow");
        var skey = x6bb.fwGet('skey_'+table);
        
        /*
        if(skey>=0) {
            x6.console.log("Skey is >= 0, continuing ",skey);
            $(this).find(":input:not([disabled])[zActive]").each( 
                function() {
                    this.value = this.zOriginalValue;
                    this.zError = 0;
                    x6inputs.setClass(this);
                }
            );
            //x6events.fireEvent('uiUndoRow_'+this.zTable,skey);
        }
        */
        x6events.fireEvent('uiUndoRow_'+this.zTable,skey);
        x6.console.log("tableController reqUndoRow Finished");
        x6.console.groupEnd();
        return true;
    }
    

    /*
    *   The table controller accepts delete request
    *   and asks the database to do the delete.  If
    *   this is successful, it tells any UI subscribers
    *   to update their displays accordingly.
    */
    x6events.subscribeToEvent('reqDelRow_'    +table,id);
    self['receiveEvent_reqDelRow_'+table] = function() {
        x6.console.group("tableController reqDelRow ",this.zTable);
        var skey = x6bb.fwGet('skey_'+this.zTable);
        if(this.zSkey<1) {
            x6.console.log("nothing being edited, quietly ignoring");
        }
        else {
            if(confirm("Delete current row?")) {
                x6.console.log("sending delete to server");
                x6.json.init('x6page',this.zTable);
                x6.json.addParm('x6action','delete');
                x6.json.addParm('skey',skey);
                x6.json.addParm('json',1);
                if(x6.json.execute()) {
                    x6events.fireEvent('uiDelRow_'+table,skey);
                }
            }
        }
        x6.console.log("tableController reqDelRow finished");
        x6.console.groupEnd();
        return true;
    }
    
    // Sort requests are sorted out here.        
    x6events.subscribeToEvent('reqSort_'+table,id);
    self['receiveEvent_reqSort_'+table] = function(args) {
        // Work out sort order
        table = this.zTable
        xColumn = args.xColumn;
        xChGroup= args.xChGroup;
        if(xColumn == this.zSortCol) {
            this.zSortAsc = ! this.zSortAsc;
        }
        else {
            this.zSortCol = xColumn;
            this.zSortAsc = true;
        }
        
        // Flip all icons to both
        //$('[xChGroup='+xChGroup+']').html('&hArr;');
        
        // Flip just this icon to up or down
        var icon = this.zSortAsc ? '&dArr;' : '&uArr;';
        //$('[xChGroup='+xChGroup+'][xColumn='+xColumn+']').html(icon);
        
        // Make the request to the server
        var args2 = { sortCol: this.zSortCol, sortAsc: this.zSortAsc };
        x6events.fireEvent('uiSort_'+this.zTable,args2);
    }
    

    /*
    *   Table controller will be happy to cache
    *   rows for a table if they are offered. It
    *   will also be happy to add a row to that
    *   cache if offered.  There ought also to be
    *   something here to remove a row, but that
    *   seems to be missing?
    *
    *   Note: shouldn't that be cacheAddRow ?
    *   Note: and then wouldn't we want cacheDelRow?
    */
    self.zRows = { };
    x6events.subscribeToEvent('cacheRows_'+table,id);
    self['receiveEvent_cacheRows_'+table] = function(rows) {
        this.zRows = rows;
    }
    x6events.subscribeToEvent('addRow_'+table,id);
    self['receiveEvent_addRow_'+table] = function(row) {
        this.zRows[row.skey] = row;
    }
    
    /*
    *    A request to put the current row onto
    *    the bulletin board.
    */
    x6events.subscribeToEvent('dbFetchRow_'+table,id);
    self['receiveEvent_dbFetchRow_'+table] = function(skey) {
        if(typeof(this.zRows[skey])=='undefined') {
            x6.console.log("tableController bbRow, no row found, fetching");
            x6.json.init('x6page',this.zTable);
            x6.json.addParm('x6action','fetchRow');
            x6.json.addParm('x6w_skey',skey);
            if(x6.json.execute(true)) {
                x6bb.fwSet('dbRow_'+this.zTable,x6.data.row);
                var rowNew = x6.data.row;
            }
        }
        else {
            x6.console.log("tableController bbRow, publishing row "+skey);
            x6.console.log("putting onto bb as dbRow_"+this.zTable);
            x6bb.fwSet('dbRow_'+this.zTable,this.zRows[skey]);
            var rowNew = this.zRows[skey];
        }
    }
    
    /*
    *   Two requests, one to turn on editing-mode buttons,
    *   another to turn them off.  Third to turn on just new/ins
    */
    x6events.subscribeToEvent('buttonsNew_'+table,id);
    self['receiveEvent_buttonsNew_'+table] = function(turnOn) {
        if(turnOn==null) turnOn = false;
        
        // Turn on the default property
        if(typeof(this.buttonsNew)=='undefined') this.buttonsNew=false;
        
        // Branch 1: turn off.  Notice two return statements
        if(!turnOn) {
            if(!this.buttonsNew) return;
            x6events.fireEvent('disable_new_' +this.zTable);
            x6events.fireEvent('disable_ins_' +this.zTable);
            this.buttonsNew = false;
            return;
        }
        
        // Branch 2: turn on
        if(this.buttonsNew) return;
        var permins = x6.p(this,'xPermIns','Y')=='N' ? false : true;
        if(permins) {
            x6events.fireEvent('enable_new_' +this.zTable);
            x6events.fireEvent('enable_ins_' +this.zTable);
        }
        this.buttonsNew = true;
    }

    x6events.subscribeToEvent('buttonsEdit_'+table,id);
    self['receiveEvent_buttonsEdit_'+table] = function(turnOn) {
        if(turnOn==null) turnOn = false;

        // Branch 1: turn off.  Notice early returns
        if(!turnOn) {
            if(!this.buttonsEdit) return;
            x6events.fireEvent('disable_save_' +this.zTable);
            x6events.fireEvent('disable_cancel_' +this.zTable);
            x6events.fireEvent('disable_delete_' +this.zTable);
            this.buttonsNew = false;
            return;
        }
        
        // Branch 2: turn on
        if(this.buttonsEdit) return;
        var permins = x6.p(this,'xPermIns','Y')=='N' ? false : true;
        var permupd = x6.p(this,'xPermUpd','Y')=='N' ? false : true;
        var permdel = x6.p(this,'xPermDel','Y')=='N' ? false : true;
        var permsave= permins || permupd;
        if(permupd) {
            x6events.fireEvent('enable_save_' +this.zTable);
            x6events.fireEvent('enable_cancel_' +this.zTable);
        }
        if(permdel) {
            x6events.fireEvent('enable_delete_' +this.zTable);
        }
        this.buttonsEdit = true;
    }
}
    
    
/****m* x6plugins/detailDisplay
*
* NAME
*   x6plugins.detailDisplay
*
* FUNCTION
*   The Javascript method x6plugins.detailDisplay implements
*   all browser-side functionality for Andromeda's built-in
*   plugIn detailDisplay.
*
*   A 'detailDisplay' plugIn displays user inputs to edit
*   the values for a particular row in a table.  
*
*   This plugin subscribes to the following events:
*   *  goMode_{table}
*
* INPUTS
*   self - the DOM object to be activated.
*   id - the ID of the object to be 'activated'.
*   table - the database table that the detailPane is handling.
*
* RESULTS
*   no return value.
*
******
*/
x6plugins.detailDisplay = function(self,id,table) {
    self.zTable = table;
    
    // If we are supposed to start out disabled, do it
    if(x6.p(self,'xInitDisabled','N')=='Y') {
        $(self).find(":input").each(
            function() {
                x6inputs.disable(this);
            }
        );
        
        // DO 1-15-2009 For some reason chaining
        // this to the above doesnt work
        $(self).find("textarea").each(
            function() {
                var el = '#' + $(this).attr('id');
                var wysiwyg = el + '_WYSIWYG';
                if  ($(this).attr('xtypeid') == 'mime-h-f' ) {
                    $(el).wysiwyg();
                } else if ( $(this).attr('xtypeid') == 'mime-h' ) {
                    $(el).wysiwyg();
                }
                $(wysiwyg).block({message: null});
            }
        );
    }
    
    // detail receives a request to go to a mode which
    // is unconditional, it will do what it is told
    x6events.subscribeToEvent('uiEditRow_'+table,id);
    self['receiveEvent_uiEditRow_'+table] = function(skey) {
        x6.console.group("detailDisplay uiEditRow",skey);
        
        // Ask somebody to publish the row
        x6events.fireEvent('dbFetchRow_'+table,skey);
        var row = x6bb.fwGet('dbRow_'+table);
        
        // Branch out to display in edit mode
        this.displayRow('edit',row);
        x6events.fireEvent('uiHideKids_'+this.zTable,this.zTable);
        x6events.fireEvent('uiEnableKids_'+this.zTable,this.zTable);
        
        x6.console.log("detailDisplay uiEditRow FINISHED");
        x6.console.groupEnd();
    }
        
    // Detail receives an addRow event and interprets it
    // as a goMode.  The parameter is intended only for
    // grids, a detail display ignores it.
    x6events.subscribeToEvent('uiNewRow_'+table,id);
    self['receiveEvent_uiNewRow_'+table] = function(tabDivBefore) {
        x6.console.group("detailDisplay uiNewRow");
        this.displayRow('new',{});
        
        // KFD 12/18/08. Fire an event to disable kid tabs
        x6events.fireEvent('uiHideKids_'+this.zTable,this.zTable);
        x6events.fireEvent('uiDisableKids_'+this.zTable,this.zTable);
        
        x6.console.log("detailDisplay uiNewRow FINISHED");
        x6.console.groupEnd();
    }

    /*
    *    A uiRowSaved says there are new values.  This
    *    will be caught and interpreted as a uiEditRow
    */
    x6events.subscribeToEvent('uiRowSaved_'+table,id);
    self['receiveEvent_uiRowSaved_'+table] = function(row) {
        x6.console.group("detailDisplay uiRowSaved");
        x6.console.log("parms: ",row);
        this.displayRow('edit',row);
        x6.console.log("detailDisplay uiRowSaved FINISHED");
        x6.console.groupEnd();
    }
    
    /*
    *   A detail always subscribes to uiUndoRow, and disables
    *   and clears all controls.  
    *
    */
    x6events.subscribeToEvent('uiUndoRow_'+table,id);
    self['receiveEvent_uiUndoRow_'+table] = function(skey) {
        $(this).find(":input").each(
            function() {
                x6inputs.clearOut(this);
            }
        );
        x6bb.fwSet('skey_'+this.zTable,-1);
        x6events.fireEvent('uiHideKids_'+this.zTable,this.zTable);
        x6events.fireEvent('uiDisableKids_'+this.zTable,this.zTable);
    }
    
        
    /*
    *    A uiDelRow clears all inputs
    */
    x6events.subscribeToEvent('uiDelRow_'+table,id);
    self['receiveEvent_uiDelRow_'+table] = function(skey) {
        x6.console.group("detailDisplay uiDelRow",skey);
        $(this).find(':input').each(function() {
                x6inputs.clearOut(this);
        });
        x6events.fireEvent('buttonsOff_'+this.zTable);
        x6events.fireEvent('uiHideKids_'+this.zTable,this.zTable);
        x6events.fireEvent('uiDisableKids_'+this.zTable,this.zTable);
        x6.console.log("detailDisplay uiDelRow FINISHED");
        x6.console.groupEnd();
    }

    self.displayRow = function(mode,row) { 
        x6.console.group("detailDisplay displayRow ",mode);
        x6.console.log(row);
        if(mode!='new' && mode!='edit') {
            x6.console.error(
                "Object "+this.id+" has received a 'goMode' event "
                +"for unhandled mode "+mode+".  Cannot process this "
                +"request."
            );
        }

        // Set values and remember skey value
        if(mode=='new')  {
            x6.console.log("detail display going into new mode");
            // For new rows, set defaults, otherwise blank
            // out.
            $(this).find(':input').each(function() {
                this.value=x6.p(this,'xdefault','');
                this.zOriginalValue = this.value;
                this.zChanged = 0;
                this.zActive  = 1;
            });
            //if(typeof(row.skey)!='undefined') {
            //    u.debug("detail display populating inputs");
            //    this.populateInputs(row);
            //}
            x6bb.fwSet('skey_'+this.zTable,0);
        }
        else {
            this.populateInputs(row);
            x6bb.fwSet('skey_'+this.zTable,row.skey);
        }
        x6events.fireEvent('buttonsOn_'+this.zTable);
        
        
        // now set the readonly and new flags on all controls
        $(this).find(':input').each(function() {
            this.zNew = mode=='new' ? 1 : 0;
            if(mode=='new') {
                var ro = x6.p(this,'xroins','N');
            }
            else {
                var ro = x6.p(this,'xroupd','N');
            }
            if(ro=='Y') {
                this.disabled = true;
            }
            else {
                this.disabled = false;
            }
            x6inputs.setClass(this);
        });
        var jqString = x6inputs.jqFocusString();
        $(this).find(jqString).focus();
        
        // Now that all displays are done, if we have a tab
        // selector then select it
        var tabSelector = x6.p(this,'xTabSelector','');
        x6.console.log("tabSelector ",tabSelector);
        if(tabSelector != '') {
            var tabIndex = x6.p(this,'xTabIndex');
            x6.console.log("Tab index ",tabIndex);
            $(tabSelector).tabs('select', Number(tabIndex));
        }
        
        // Create a status message on right if the item exists
        var sbRight = x6.byId('sbr_'+this.zTable);
        if(sbRight!=null) {
            var status = '';
            if(typeof(row.ts_ins)!='undefined') {
                if(row.uid_ins==null) row.uid_ins = '';
                status+=typeof(row.uid_ins)!='undefined'
                    ? 'Created ('+row.uid_ins.trim()+'): '
                    : 'Created: ';
                status += x6dd.display('dtime',row.ts_ins);
            }
            if(typeof(row.ts_upd)!='undefined') {
                if(row.uid_upd==null) row.uid_upd = '';
                status+=typeof(row.uid_upd)!='undefined'
                    ? ' Changed ('+row.uid_upd.trim()+'): '
                    : ' Changed: ';
                status += x6dd.display('dtime',row.ts_upd);
            }
            sbRight.innerHTML = status;
        }
        
        
        
        x6.console.log("detailDisplay displayRow FINISHED");
        x6.console.groupEnd();
        return true;
    }

    self.populateInputs = function(row) {
        $(this).find(":input").each(function() {
                this.zOriginalValue = '';
                this.zChanged       = false;
        });
        for(var colname in row) {
            var val = row[colname];
            colname=colname.trim();
            var jqobj =$(this).find(':input[xcolumnid='+colname+']');
            if(jqobj.length>0) {
                if(val==null) val='';
                jqobj[0].value          = val.trim();
                jqobj[0].zOriginalValue = val.trim();
                jqobj[0].zChanged       = false;
                jqobj[0].zActive        = 1;
            }
        }

        $(self).find("textarea").each(
            function() {
                if  ($(this).attr('xtypeid') == 'mime-h-f' || $(this).attr('xtypeid') == 'mime-h' ) {
                    var elIFrame = '#' + $(this).attr('id') + 'IFrame';
                    var el = '#' + $(this).attr('id');
                    $($(elIFrame).document()).find('body').html($(el).val());
                    $(el + '_WYSIWYG').unblock();
                }
            }
        );

    }
    
    if(x6.p(self,'x6profile')=='twosides') {
        x6events.fireEvent('buttonsNew_'+table);
    }
}

x6tabDiv = {
    mouseEnabled: true,
    
    mouseDisable: function() {
        this.mouseEnabled = false;
        $('body').css('cursor','url(clib/mouseOff.png), default');
        $(document).one('mousemove',function() {
            x6tabDiv.mouseEnabled = true;
            $('body').css('cursor','');
        });
    },
    
    removeHighlight: function(table) {
        var rowNow = x6bb.fwGet('highlight_'+table,'');
        if(rowNow!='') $('#'+rowNow).removeClass('hilight');
        x6bb.fwSet('highlight_'+table,'');
        this.mouseDisable();
    },
    
    mouseover: function(rowDiv) {
        if(rowDiv == null) return;
        if(!this.mouseEnabled) return false;
        if(!rowDiv.id) return false;
        if(rowDiv.className=='selected') return false;
        var pieces = rowDiv.id.split('_');
        
        var rowNow = x6bb.fwGet('highlight_'+pieces[0],'');
        if(rowNow!='' && x6.byId(rowNow)!=null) x6.byId(rowNow).className = '';
        var row = x6.byId(rowDiv.id);
        if(row.id != 'selected') {
            x6.byId(rowDiv.id).className = 'hilight';
            x6bb.fwSet('highlight_'+pieces[0],rowDiv.id);
        }
        
        //$(rowDiv).siblings('.hilight').removeClass('hilight');
        //$('#'+rowDiv.id+':not(.selected)').addClass('hilight');
    }
}

/***im* x6plugins/tabDiv
*
* NAME
*   x6plugins.tabDiv
*
* FUNCTION
*   The Javascript method x6plugins.tabDiv implements
*   all browser-side functionality for Andromeda's built-in
*   plugIn tabDiv.  A "tabDiv" appears to the user to be an
*   HTML TABLE but it is implemented with divs.
*
*   This routine is called automatically by x6.init, there
*   is not usually any reason for calling this routine
*   directly.
*
* INPUTS
*   self - the DOM object to be activated.
*   id - the ID of the object to be 'activated'.
*   table - the database table that the tabDiv is handling.
*
* RESULTS
*   no return value.
*
******
*/
x6plugins.x6tabDiv = function(self,id,table) {
    self.zTable    = table;
    self.x6profile = x6.p(self,'x6profile','none');
    self.kbOnEdit  = ['x6tabDiv','twosides'].indexOf(self.x6profile)>=0;

    /*
    *   Many plugins can receive the objectFocus event
    *   and either turn themselves on or off
    */
    x6events.subscribeToEvent('objectFocus',id);
    self.receiveEvent_objectFocus = function(id) {
        x6.console.group("Object Focus: ",id,this.id);
        // If it is NOT us, turn everything off
        if(id!=this.id) {
            this.keyboardOff();
        }
        // If it IS us, turn everything on, and set
        // the bulletin board.  But if we already have
        // focus then do nothing.
        else {
            if(x6bb.fwGet('objectFocus','')!=id) {
                this.keyboardOn();
                x6events.fireEvent('buttonsNew_'+this.zTable,true);
                
                if(this.x6profile == 'x6tabDiv') {
                    x6events.fireEvent('key_DownArrow','DownArrow');
                }
                
                x6bb.fwSet('objectFocus',id);
            }
        }
        x6.console.groupEnd();
    }
    
    
    /*
    *    These two will tell us down below if the grid
    *    displays inputs for new rows and allows 
    *    inline editing of rows
    */
    var uiNewRow  = x6.p(self,'uiNewRow' ,'');
    var uiEditRow = x6.p(self,'uiEditRow','');
 
    /*
    *  A grid may be set to receive a cacheRows event.
    *  If so, it will replace its own data with the
    *  data that has been provided.
    */
    /* SUSPICIOUS, probably do not need this
    if(x6.p(self,'xCacheRows','')=='Y') {
        x6events.subscribeToEvent('cacheRows_'+table,id);
        
        self['receiveEvent_cacheRows_'+table] = function(rows) {
            // Clear current data
            $(this).find('.tbody').html();
            // Add new data
            //for(var x in rows) {
            //    this.addRow(rows[x]);
            //}
        }
    }
    */

    self.rowId = function(skey,noPound) {
        return (noPound==null ? '#' : '')+this.zTable+'_'+skey;
    }
    self.skeyForRow = function(row) {
        if(typeof(row)!='undefined') {
            var pieces = row.id.split('_');
            return pieces[1];
        }
    }
    
    /*
    *   The grid is happy to display a new row for
    *   editing if a certain flag has been set.
    *   The event uiNewRow is unconditional, it means
    *   all prerequisites have been met and the grid
    *   should proceed forthwith.
    */
    x6events.subscribeToEvent('uiNewRow_'+table,id);
    if(uiNewRow!='Y') {
        // If the grid itself does not display the row, then it
        // stops responding to keyboard events while somebody
        // else is displaying the new row.
        self['receiveEvent_uiNewRow_'+table] = function() {
            this.keyboardOff();
        }
    }
    else {
        self['receiveEvent_uiNewRow_'+table] = function(tabDivBefore) {
            x6.console.group("tabDiv uiNewRow "+this.zTable);
            x6.console.time("tabDiv uiNewRow");
            var skey = x6bb.fwGet('skey_'+this.zTable,-1);
            
            /*
            *   If we are currently editing a new row, just
            *   focus on it.
            */
            if(skey==0 && x6bb.fwGet('lastSave_'+this.zTable)=='noaction') {
                x6.jqSetFocus(this.rowId(0)+" :input:first:not([disabled])");
                x6.console.log("On an empty new row, setting focus");
                x6.console.groupEnd();
                return;
            }
                                                                                         
            /*
            *   If editing some other row, we know it was saved
            *   and is ok, convert it back to display
            */
            if(skey>=0) {
                this.removeInputs();
            }

            /*
            *   Pull the empty row and replace all of the values.
            */
            var html = "<div id='"+this.zTable+"_0' style='display:none'>"
                + this.zRowEditHtml
                + "</div>";
            // Here we have an object, not an array, so we iterate by name?
            for(var idx in this.zColsById) {
                html = html.replace('*VALUE_'+idx+'*','');
            }
            
            
            /* 
            *   Now figure out where to put the row.  [New] always
            *   goes after current row, and [Insert] passes the 
            *   tabDivBefore flag that says go before the current
            *   row.  If there is no current row, [Insert] goes at
            *   the top and [New] goes at the bottom.
            */
            // First work out current row, if there is one
            var iRelative = false;
            if(skey!=0) {
                iRelative = skey;
                if(tabDivBefore) {
                    x6bb.fwSet('skeyBefore_'+this.zTable,skey);
                    x6bb.fwSet('skeyAfter_' +this.zTable,-1);
                }
                else {
                    x6bb.fwSet('skeyAfter_' +this.zTable,skey);
                    x6bb.fwSet('skeyBefore_'+this.zTable,-1);
                }
                //var jqRow = $('#row_'+skey);
                var jqRow = $(this.rowId(skey));
            }
            else {
                x6bb.fwSet('skeyBefore_'+this.zTable,-1);
                x6bb.fwSet('skeyAfter_'+this.zTable, -1);
                var jqRow = this.jqCurrentRow();
            }
            
            // Now go either before or after the row we found, or at
            // top or bottom as the case may be
            if(jqRow.length==0) {
                if(tabDivBefore) {
                    x6.console.log("body prepend");
                    $(this).find('.tbody').prepend(html);                    
                }
                else {
                    x6.console.log("body append");
                    $(this).find('.tbody').append(html);                    
                }
            }
            else {
                if(tabDivBefore) {
                    x6.console.log("before this row: ",jqRow);
                    $(jqRow).before(html);
                }
                else {
                    x6.console.log("after this row: ",jqRow);
                    $(jqRow).after(html);
                }
            }
            
            // This initializes the inputs
            var grid = this;
            $(this.rowId(0)+" :input").each(
                function() { grid.initInput(this,0,'new'); }
            );
            
            //$(this).find('#row_0').fadeIn('fast'
            $(this.rowId(0)).fadeIn('fast'
                ,function() {
                    x6inputs.findFocus( this );
                }
            );
            
            // Send a message and get lost
            x6bb.fwSet('skey_'+this.zTable,0);
            x6events.fireEvent('buttonsOnEdit_'+this.zTable);
            x6tabDiv.removeHighlight(this.zTable);
            x6.console.log('New row created, ready to edit');
            x6.console.timeEnd("tabDiv uiNewRow");
            x6.console.groupEnd();
            return true;
        }
    }
    
   
    self.initInput = function(input,tabIndex,mode,tabGroup) {
        x6.console.group("Initializing Input");
        x6.console.log("tabindex, mode, tabgroup: ",tabIndex,mode,tabGroup);
        x6.console.log(input);
        
        // Get the read-only decision
        if(mode=='new') {
            x6.console.log("hello, ro ins");
            input.disabled = x6.p(input,'xroins','N')=='Y';
            
            // Set a default if there
            var x = x6.p(input,'xDefault','');
            if(x !='') input.value = x;
        }
        else {
            x6.console.log("hello, ro upd");
            input.disabled = x6.p(input,'xroupd','N')=='Y';
        }
        
        input.inGrid = 1;
        
        // Set original value and class
        input.zOriginalValue = x6.p(input,'value','').trim();
        if(mode=='new') {
            input.zNew = 1;
        }
        x6inputs.setClass(input);
        
        // An 'x6select' control replaces HTML Select.  We add
        // a little button off to the right of the input.
        x6inputs.x6select.addButton(input);
        
        // This is important, it says that this is an 
        // active input.  This distinguishes it from possible
        // hidden inputs that were used as a clone source 
        // that have many or all of the same properties.
        // NOTE 12/18/08, this is no longer necessary, but some
        //      code still expects it.  There is a cleanup task
        //      
        input.zActive = 1;
        x6.console.groupEnd();
    }


    /*
    *   Always subscribe to an editrow command.  If in edit
    *   mode the handler makes inputs and stuff.  If not,
    *   it just turns off the keyboard.
    */
    x6events.subscribeToEvent('uiEditRow_'+table,id);
    if(uiEditRow!='Y') {
        self['receiveEvent_uiEditRow_'+table] = function(skey) {
            this.keyboardOff();
        }
    }
    else {
        self['receiveEvent_uiEditRow_'+table] = function(skey) {
            x6.console.group("tabDiv uiEditRow "+this.zTable);
    
            if(x6.byId(this.rowId(skey,false))==null) {
            //if( $(this).find('#row_'+skey).length == 0) {
                x6.console.log("We don't have that row, cannot edit");
                x6.console.groupEnd();
                return;
            }

            var skeynow = x6bb.fwGet('skey_'+this.zTable);
            if(skeynow == skey) {
                x6.console.log("Grid is already on the row, no action");
                x6.console.groupEnd();
                return;
            }
            
            /*
            *   If editing some other row, we know it was saved
            *   and is ok, convert it back to display
            */
            if(x6bb.fwGet('skey_'+this.zTable)>=0) {
                this.removeInputs();
            }

            // Set this before adding inputs.  If you
            // do it afterward we get "jumpies" as the
            // border/padding/margin adjusts.
            x6.byId(this.rowId(skey,true)).className='selected';

            x6.console.log("Putting inputs into div cells");
            this.addInputs(skey);
            
            x6tabDiv.removeHighlight(this.zTable);
            x6bb.fwSet('skey_'+this.zTable,skey);
            x6events.fireEvent('buttonsEdit_'+this.zTable,true);
            //this.keyboardOff();
            x6.console.log('uiEditRow Completed, returning true');
            x6.console.groupEnd();
            return true;
        }
    }
    
    /*
    *   This routine makes a row of inputs, either by 
    *   replacing a row already there or inserting a
    *   new row
    *
    */
    self.addInputs = function(skey) {
        var grid = this;
        var html = this.zRowEditHtml;
        $(this.rowId(skey)+' div').each(            
            function() {
                var div = this;
                // Get the name of the column so we can                                   
                // replace the value.
                var colnum = x6.p(div,'gColumn');
                var colid  = grid.zColsInfo[colnum].column_id;
                var search = '*VALUE_'+colid+'*';
                var replace= this.innerHTML.htmlEdit();
                html = html.replace(search,replace);
            }
        );
        x6.byId(this.rowId(skey,true)).innerHTML = html;
        $(this.rowId(skey)+" :input").each(
            function() { grid.initInput(this); }
        );
        var focusCandidate = x6bb.fwGet('lastFocus_'+this.zTable,'');
        if(focusCandidate!='') {
            var str = this.rowId(skey)+' #'+focusCandidate;
            x6.jqSetFocus(str);
        }
        else {
            var str = this.rowId(skey)+" :input:not([disabled]):first"; 
            x6.jqSetFocus(str);
        }
    }
    
    
    /*
    *   A grid may need to convert inputs back into display
    *   elements.  This routine is unconditionally created
    *   and is only called by ui event handlers.
    *
    */
    self.removeInputs = function() {
        x6.console.group("tabDiv removeInputs");
        var skey = x6bb.fwGet('skey_'+this.zTable);

        //if( $(this).find('#row_'+skey+' :input').length==0 ) {
        if( $(this.rowId(skey)+' :input').length==0 ) {
            x6.console.log("no inputs, doing nothing");
            x6.console.groupEnd();
            return;
        }
        
        // KFD 12/10/08, hide any dropdowns
        x6inputs.x6select.hide();
        
        // Remove the "selected" class from the inputs row,
        // it does not belong there anymore.
        x6.byId(this.rowId(skey,true)).className = '';

        x6.console.log("skey is ",skey);
        var grid = this;
        //$(this).find("#row_"+skey).removeClass('selected').find("div").each(
        //if( $(this.rowId(skey)+' :input').length==0 ) {
        //$(this).find("#row_"+skey+" div").each(
        $(this.rowId(skey)+' div').each(
            function() {
                var inp    = this.firstChild; 
                //var inp    = $(this).find(":input")[0];
                if(inp != null) {
                    var val    = inp.value;
                    var col    = x6.p(inp,'xColumnId');
                    var typeid = grid.zColsById[col].type_id;
                    x6.console.log(val);
                    this.innerHTML = x6dd.display(typeid,val,'&nbsp;');
                }
            }
        );

        // If we are removing inputs from the 0 row
        // and the last save had no action, kill the row
        if(skey==0) {
            if(x6bb.fwGet('lastSave_'+this.zTable)=='noaction') {
                x6.console.log("No action on last save, removing row ",skey);
                $(this.rowId(0)).fadeOut(
                    function() { $(this).remove() }
                );
            }
        }
        
        x6.console.log("turning on keyboard events");
        this.keyboardOn();
        
        // Since we are no longer editing, set skey appropriately
        x6.console.log("tabDiv removeInputs Finished");
        x6.console.groupEnd();
        return true;
    }
    
    /*
    *   Undo Row: the table controller has already reset
    *   any inputs, we will just remove them
    */
    if(uiEditRow=='Y' || uiNewRow=='Y') {
        x6events.subscribeToEvent('uiUndoRow_'+table,id);
        self['receiveEvent_uiUndoRow_'+table] = function(skey) {
            x6.console.group('tabDiv uiUndoRow ',skey);
            if(skey!=0) {
                x6.console.log("Skey is not zero, resetting values");
                //$(this).find('#row_'+skey+' :input').each(
                var change = 0;
                $(this.rowId(skey)+' :input:not([disabled])').each(
                    function() {
                        if(this.value.trim()!=this.zOriginalValue.trim()) {
                            change++;
                            console.log(this.value);
                            console.log(this.zOriginalValue);
                            this.value = this.zOriginalValue.trim();
                            this.zOriginalValue = this.value;
                            console.log(this.value);
                            console.log(this.zOriginalValue);
                            x6inputs.setClass(this);
                            console.log(this.value);
                            console.log(this.zOriginalValue);
                        }
                    }
                );
                
                // When we do an undo, the user might have hit
                // ESC to do it.  If anything was changed, we
                // do not want the ESC to exit the screen.
                //if(change>0) {
                //    x6bb.fwSet('exitApproved',false);
                //}
            }
            else {
                x6.console.log("Skey is zero, removing row");
                this.removeInputs();
                x6bb.fwSet('exitApproved',false);
                var iBefore = x6bb.fwGet('skeyBefore_'+this.zTable,-1);
                var iAfter  = x6bb.fwGet('skeyAfter_' +this.zTable,-1);
                x6.console.log(iBefore,iAfter);
                if     (iBefore!=-1) skeyNew = iBefore;
                else if(iAfter !=-1) skeyNew = iAfter;
                else skeyNew = -1;
                if(skeyNew!=-1){
                    x6.console.log("Picked this row to edit: ",skeyNew);
                    x6events.fireEvent('reqEditRow_'+this.zTable,skeyNew);
                    //$(this).find('#row_'+skeyNew).mouseover();
                }
            }
            x6.console.groupEnd();
        }
    }
    else if(self.kbOnEdit) {
        x6events.subscribeToEvent('uiUndoRow_'+table,id);
        self['receiveEvent_uiUndoRow_'+table] = function(skey) {
            this.keyboardOn();
        }
    }
    
    /*
    *   A grid must always have a facility to receive 
    *   new values from any source.  The code is smart
    *   enough to figure out if the row is in edit mode
    *   or display mode.
    *
    */
    x6events.subscribeToEvent('uiRowSaved_'+table,id);
    self['receiveEvent_uiRowSaved_'+table] = function(row) {
        x6.console.group("tabDiv uiRowSaved: "+this.zTable);
        // Replace the input values with server returned values
        skey = x6bb.fwGet('skey_'+this.zTable);
        
        // KFD 1/15/09.  Major change.  If profile is 'x6tabDiv'
        //               then simply replace input values and
        //               we are done.
        if($(this).attr('x6profile')=='x6tabDiv') {
            x6.console.log("Profile x6tabDiv, updating inputs and returning");
            var grid = this;
            $(this.rowId(skey)+" :input").each(
                function() {
                    var col    = $(this).attr('xColumnId');
                    var typeid = grid.zColsById[col].type_id;
                    x6.console.log("setting: ",col,row[col]);
                    this.value = x6dd.display(typeid,row[col],'');
                    this.zOriginalValue = this.value;
                    x6inputs.setClass(this);
                }
            );
            x6.console.groupEnd();
            return;
        }
        // <-------- EARLY RETURN for profile x6tabDiv
        
        //if( $(this).find("#row_"+skey+" :input").length > 0) {
        if( $(this.rowId(skey)+' :input').length > 0) {
            x6.console.log($(this).find("#row_"+skey+" :input"));
            x6.console.log("found inputs, going rowSavedEdit");
            this.uiRowSavedEdit(row);
            var skeyNew = skey==0 ? row.skey : skey;
            x6events.fireEvent('reqEditRow_'+this.zTable,skeyNew);
        }
        else {
            x6.console.log("no inputs, going rowSavedNoEdit");
            this.uiRowSavedNoEdit(row);
            if(this.kbOnEdit) {
                this.keyboardOn();
            }
        }
        x6.console.log("tabDiv uiRowSaved finished, returning TRUE");
        x6.console.groupEnd();
    }
    
    self.uiRowSavedEdit = function(row) {
        var skey = x6bb.fwGet('skey_'+this.zTable);
        var grid = this;
        //$(this).find("#row_"+skey+" :input").each(
        $(this.rowId(skey)+" :input").each(
            function() {
                var col    = x6.p(this,'xColumnId');
                var typeid = grid.zColsById[col].type_id;
                x6.console.log(col,row[col]);
                this.value = x6dd.display(typeid,row[col],'');
                this.zOriginalValue = this.value;
            }
        );
        this.removeInputs();
        //x6events.fireEvent('buttonsOff_'+this.zTable);
        x6bb.fwSet('skey_'+this.zTable,-1);
        
        // If this was a new row, set it up
        if(skey==0) {
            x6.console.log("Was new row, setting up the row for editing");
            table = this.zTable;
            /*
            $(this).find("#row_0").each(
                function() {
                    this.id = 'row_'+row.skey;
                }
            );
            */
            x6.byId(this.zTable+'_0').id = this.zTable+'_'+row.skey;
            this.initRow(row.skey);
            
        }
    }
        
    self.uiRowSavedNoEdit = function(row) {
        var skey = row.skey;
        x6.console.log("in uirowsavednoedit ",row);
        
        // If a new row has been saved and we don't 
        // have it, create it now
        //if($(this).find('.tbody #row_'+skey).length==0) {
        if($(this.rowId(skey)).length==0) {   
            x6.console.log("tabDiv does not have row, adding");
            var newRow = 
                "<div id='"+this.rowId(row.skey,true)+"'"
                +" style='display:none'>";
            var numbers = [ 'int', 'numb', 'money' ];
            for (var idx=0; idx<this.zColsInfo.length; idx++) {
                var colInfo = this.zColsInfo[idx];
                if(colInfo.column_id == '') continue;

                newRow+= "<div gColumn = '"+colInfo.column_id+"'" 
                    +" style='width: "+colInfo.width+"px;";
                if(numbers.indexOf(colInfo.type_id)>=0) {
                    newRow+="text-align: right;";
                }
                newRow+="'>";
                newRow+=row[colInfo.column_id]+"</div>";
            }
            newRow+="</div>";
            x6.console.log(newRow);
            $(this).find('.tbody').prepend(newRow);
            this.initRow(skey);
            $(this.rowId(skey)).fadeIn();
        }
        else {
            for (var idx=0; idx<this.zColsInfo.length;idx++) {
                var col = this.zColsInfo[idx].column_id;
                if(col!='') {
                    //var str="#row_"+skey+" div[gColumn="+idx+"]";
                    var str=this.rowId(skey)+" div[gColumn="+idx+"]";
                    //$(this).find(str).html(row[col]);
                    $(str).html(row[col]);
                }
            }
        }
    }
    
    self.initRow = function(skey) {
        // PHP-JAVASCRIPT DUPLICATION ALERT!
        // This code also exists in androLib.php
        // addRow method of the tabDiv class
        var table = this.zTable;
        //$(this).find('#row_'+skey)
        $(this.rowId(skey))
            .mouseover(
                function() { x6tabDiv.mouseover(this) }
            )
            .click(
                function() {
                    x6events.fireEvent(
                        'reqEditRow_'+table,skey
                    );
                }
            );
        
    }
                
    /*
    *   A uiDelRow command means a row has been deleted
    *   from the server, and anybody displaying it must
    *   remove it from the display.
    */
    x6events.subscribeToEvent('uiDelRow_'+table,id);
    self['receiveEvent_uiDelRow_'+table] = function() {
        x6.console.group("tabDiv uiDelRow "+this.zTable);
        skey = x6bb.fwGet('skey_'+this.zTable);
        x6.console.log("current skey ",skey);
        
        if(this.kbOnEdit) {
            this.keyboardOn();
            $(this.rowId(skey)).fadeOut('fast',function() { $(this).remove()});
            if(this.x6profile=='twosides') {
                x6.console.log("Twosides profile, exiting after keyboardOn()");
                x6.console.groupEnd();
                return;
            }
        }
        
        if(skey!=-1) {
            var hilightRow = false;
            x6.console.log("Determining row to highlight afer removing");
            var jqCandidate = $(this.rowId(skey)).next();
            if(jqCandidate.length>0) {
                var hilightRow = jqCandidate;
            }
            else {
                var jqCandidate = $(this.rowId(skey)).prev();
                if(jqCandidate.length>0) {
                    var hilightRow = jqCandidate;
                }
            }
        }
        
        if(skey==-1) {
            x6.console.log("No row, ignoring");
            return;
        }
        else if(skey==0) {
            x6.console.log("on a new row, firing cancelEdit command");
            x6events.fireEvent('cancelEdit_'+this.zTable);
        }
        else {
            $(this.rowId(skey)).fadeOut(
                function() {
                    $(this).remove();
                }
            );
            x6bb.fwSet('skey_'+this.zTable,-1);
            x6events.fireEvent('buttonsOff_'+this.zTable);
        }
        if(!hilightRow) {
            x6.console.log("No candidate row to hilight");
        }
        else {
            x6.console.log("Will hilight this row: ",hilightRow);
            var skey = this.skeyForRow(hilightRow[0]);
            x6events.fireEvent('reqEditRow_'+this.zTable,skey);
        }
        x6.console.log("uiDelRow finished");
        x6.console.groupEnd();
    }
    
    /*
    *    If a grid is displaying inputs, it may also have
    *    to display errors.
    */
    if(uiEditRow=='Y' || uiNewRow=='Y') {
        x6events.subscribeToEvent('uiShowErrors_'+table,id);
        self['receiveEvent_uiShowErrors_'+table] = function(errors) {
            x6.console.group("tabDiv uiShowErrors");
            x6.console.log(errors);
            for(var idx=0; idx<errors.length; idx++) {
                x6.console.log(errors[idx]);
                var aError = errors[idx].split(':');
                var column = aError[0];
                x6.console.log("Setting zError for column ",column);
                $(this).find(":input[xColumnId="+column+"]").each(
                    function() {
                        this.zError = 1;
                        x6inputs.setClass(this);
                    }
                );
            }
            x6.console.log("tabDiv uiShowErrors finished");
            x6.console.groupEnd();
            return true;
        }
    }
    
    /*
    *    Keyboard handling: row navigation
    */
    self.receiveEvent_key_UpArrow = function(e) {
        x6.console.group("tabDiv key_UpArrow");
        var jqCurrent = this.jqCurrentRow();
        var jqRowPrev = $(jqCurrent).prev();
        if(jqCurrent.length==0) {
            x6.console.log("current is zero, going to top");
            this.goRowTop();
        }
        else if(jqRowPrev.length!=0) {
            x6.console.log("there is a previous, going to that");
            this.goRowJq(jqRowPrev);
            this.scrollMove(-1);
        }
        else {
            // KFD 12/8/08, if new rows are inline, do it
            if(x6.p(this,'uiNewRow','N')=='Y') {
                x6.console.log("requesting new row, forcing insert before");
                x6events.fireEvent('reqNewRow_'+this.zTable,true);
            }
        }
        //x6events.retvals['key_UpArrow'] =false;
        x6.console.log("tabDiv key_UpArrow finished");
        x6.console.groupEnd();
        return false;
    }
    self.receiveEvent_key_DownArrow = function(e) {
        x6.console.group("tabDiv key_DownArrow");
        x6.console.log(e);
        var jqCurrent = this.jqCurrentRow();
        var jqRowNext = $(jqCurrent).next();
        x6.console.log(jqCurrent,jqRowNext);
        if(jqCurrent.length==0) {
            this.goRowTop();
        }
        else if(jqRowNext.length!=0) {
            this.goRowJq(jqRowNext);
            this.scrollMove(1);
        }
        else {
            // KFD 12/8/08, if new rows are inline, do it
            if(x6.p(this,'uiNewRow','N')=='Y') {
                x6events.fireEvent('reqNewRow_'+this.zTable);
            }
        }
        //x6events.retvals['key_DownArrow'] =false;
        x6.console.log("tabDiv key_DownArrow finished");
        x6.console.groupEnd();
        return false;
    }
    self.receiveEvent_key_PageUp = function(e) {
        x6.console.group("tabDiv key_DownArrow");
        var jqCurrent = this.jqCurrentRow();
        var jqRowPrev = $(jqCurrent).prevAll();
        if(jqCurrent.length==0) {
            this.goRowTop();
        }
        else if(jqRowPrev.length!=0) {
            var cntAbove  = jqRowPrev.length;
            var cntJump   = Number(x6.p(this,'xRowsVisible')) - 2;
            
            // Figure out how far to go up, then figure the row
            var rowsChange = cntAbove < cntJump ? cntAbove : cntJump;
            var newRow     = jqRowPrev[ rowsChange - 1 ];
            this.goRowJq($(newRow));
            this.scrollMove(-rowsChange);
        }
        x6events.retvals['key_PageUp'] =false;
        x6.console.log("tabDiv key_DownArrow finished");
        x6.console.groupEnd();
    }
    self.receiveEvent_key_PageDown = function(e) {
        x6.console.group("tabDiv key_DownArrow");
        var jqCurrent = this.jqCurrentRow();
        var jqRowNext = $(jqCurrent).nextAll();
        if(jqCurrent.length==0) {
            this.goRowTop();
        }
        else if(jqRowNext.length!=0) {
            // before doing anything, figure how many rows above
            var cntBelow = jqRowNext.length;
            var cntJump  = Number(x6.p(this,'xRowsVisible')) - 2;
            
            // Figure out how far to go up, then figure the row
            var rowsChange = cntBelow < cntJump ? cntBelow : cntJump;
            var newRow     = jqRowNext[ rowsChange - 1 ];
            this.goRowJq($(newRow));
            this.scrollMove(rowsChange);
        }
        x6events.retvals['key_PageDown'] =false;
        x6.console.log("tabDiv key_DownArrow finished");
        x6.console.groupEnd();
    }
    self.receiveEvent_key_CtrlHome = function(e) {
        this.goRowTop();
        x6events.retvals['key_CtrlHome'] =false;
    }
    self.receiveEvent_key_CtrlEnd = function(e) {
        this.goRowJq( $(this).find('.tbody > div:last') ); 
        var rowHeight = Number(x6.p(this,'cssLineHeight'));
        var rowCount  = $(this).find('.tbody > div').length;
        var stNew = rowHeight * rowCount;
        $(this).find('.tbody').animate({scrollTop:stNew},400);
    }
    self.receiveEvent_key_Enter = function(e) {
        x6.console.group("tabDiv key_Enter - clicking hilighted rows");
        if(x6.p(this,'x6profile')!='x6tabDiv') {
            $(this).find('.tbody div.hilight').click();
        }
        //var jqRow = $(this).find('div.hilight')[0];
        //var skey  = this.skeyForRow(jqRow);
        //x6events.fireEvent('reqEditRow_'+this.zTable,skey);
        x6.console.groupEnd();
    }
    
    /*
    *    Routines to move pick a row and scroll
    *
    */
    self.jqCurrentRow = function() {
        if(x6.p(this,'uiEditRow','N')=='Y') {
            return $(this).find('.selected');
        }
        else {
            return $(this).find('.hilight');
        }
    }
    self.goRowBySkey = function(skey) {
        x6.console.log('goRowBySkey ',skey);
        if( x6.p(this,'uiEditRow','')=='Y') {
            x6.console.log("We can edit, firing reqEditRow");
            x6events.fireEvent('reqEditRow_'+this.zTable,skey);
        }
        else {
            x6.console.log("We do not edit, hilighting");
            x6tabDiv.mouseover(x6.byId(this.rowId(skey,true)));
            //$(this).find('.hilight').removeClass('.hilight');
            //$(this).find('#row_'+skey).addClass('.hilight');
        }
    }
    self.goRow = function(ordinal) {
        var row = $(this).find('.tbody > div')[ordinal];
        var skey= this.skeyForRow(row);
        x6.console.log("goRow for ",ordinal,' has picked skey ',skey);
        this.goRowBySkey(skey);
    }
    self.goRowJq = function(jqRow) {
        var skey = this.skeyForRow(jqRow[0]);
        x6.console.log("goRow by jQuery object ");
        x6.console.log(jqRow);
        x6.console.log(skey);
        this.goRowBySkey(skey);
    }
    self.goRowTop = function() {
        this.goRow(0);
        //$(this).find('.tbody').scrollTop(0);
        $(this).find('.tbody').animate({scrollTop: 0},400);
    }
    self.scrollMove = function(change) {
        // Get all of the numbers we need
        var jqRow     = this.jqCurrentRow();
        var cntAbove  = $(jqRow).prevAll().length;
        var cntBelow  = $(jqRow).nextAll().length;
        var cntAll    = cntAbove + cntBelow + 1;
        var cntVisible= Number(x6.p(this,'xRowsVisible'));
        var cssHeight = Number(x6.p(this,'cssLineHeight')) - 2;
        var scrollNow = $(this).find('.tbody').scrollTop();
        var limitBot  = cntVisible - 2;
        var limitTop  = 3;
        
        // Work out where the last row was, by first working out
        // where the current row is and then going backward.
        var rowRaw = (cntAbove + 1);
        var rowReal= rowRaw - (scrollNow / cssHeight);
        
        // Work out what we should adjust.
        var stAdjust = false;
        if(change > 0) {
            // We are going down.  If the new position would be
            // beyond
            if(rowReal > limitBot) {
                var rowsAdjust = rowReal - limitBot;
                stAdjust = rowsAdjust * cssHeight;
            }
        }
        else {
            if(rowReal < limitTop) {
                var rowsAdjust = rowReal - limitTop;
                stAdjust = rowsAdjust * cssHeight;
            }
        }
        if(stAdjust!=0) {
            x6.console.log(stAdjust);
            var stNew     = scrollNow + stAdjust;
            //$(this).find('.tbody').scrollTop(stNow + stAdjust);
            $(this).find('.tbody').animate({scrollTop:stNew},200);
        }
    }

    /*
    *   This is the list of the keys that we wrote handlers
    *   for above.  They have to sometimes be turned off
    *   and on
    */
    self.keyList = [
        'PageUp', 'PageDown', 'CtrlHome', 'CtrlEnd'
        ,'UpArrow', 'DownArrow', 'Enter'
    ];
    self.keyboardOn = function() {
        if(this.keyboardStatus=='On') return;
        for(var key=0; key<this.keyList.length; key++) {
            var keyLabel = this.keyList[key];
            x6events.subscribeToEvent('key_'+keyLabel,id);
        }
        this.keyboardStatus = 'On';
        $(this).focus();
    }
    self.keyboardOff = function() {
        if(this.keyboardStatus=='Off') return;
        for(var key=0; key<this.keyList.length; key++) {
            var keyLabel = this.keyList[key];
            x6events.unsubscribeToEvent('key_'+keyLabel,id);
        }
        this.keyboardStatus = 'Off';
    }
    
    /*
    *    Lookup stuff.  If we have a row of input lookups on the
    *    grid, they will all route to here.
    *
    */
    self.fetch = function(doFetch) {
        if(doFetch==null) doFetch=false;
        var cntNoBlank = 0;
        
        // Initialize and then scan
        //x6.json.init('x6page',this.zTable);
        var json = new x6JSON('x6page',this.zTable);        
        $(this).find(".thead :input").each(function() {
            if(typeof(this.zValue)=='undefined') 
                this.zValue = this.getAttribute('xValue');
            if(this.value!=this.zValue) {
                doFetch = true;
            }
            if(this.value!='') {
                cntNoBlank++;
            }
            this.zValue = this.value;
            //x6.json.addParm('x6w_'+x6.p(this,'xColumnId'),this.value);
            json.addParm('x6w_'+x6.p(this,'xColumnId'),this.value);
        });
        
        if(doFetch) {
            // Clear the previous results
            x6.data.browseFetchHtml = '';
            if(cntNoBlank==0) {
                $(this).find('.tbody').html('');
                return;
            }
            //x6.json.addParm('x6action'   ,'browseFetch');
            //x6.json.addParm('xSortable'  ,'N');
            //x6.json.addParm('xReturnAll' ,'N');
            json.addParm('x6action'   ,'browseFetch');
            json.addParm('xSortable'  ,x6.p(this,'xSortable'  ,'N'));
            json.addParm('xReturnAll' ,'N');
            json.addParm('xGridHeight',x6.p(this,'xGridHeight',500));
            json.addParm('xLookups'   ,x6.p(this,'xLookups'   ,'N'));
            
            if( html = json.execute(false,false,true)) {
                //json.process();
                // The standard path is to take data returned
                // by the server and render it.  This is safe
                // even if the server does not return anything,
                // because we initialized to an empty object.
                $(this).find(".tbody").replaceWith(html);
                $(this).find('.tbody div:first').mouseover();
            }
        }
        delete json;
    }
    
    /*
    *    Accept request to sort on a column.  The grid makes
    *    the request because the grid is going to display it,
    *    which keeps everything in one place.
    */    
    x6events.subscribeToEvent('uiSort_'+table,id);
    self['receiveEvent_uiSort_'+table] = function(args) {
        x6bb.fwSet('skey_'+this.zTable,-1);
        json = new x6JSON('x6page',this.zTable);
        //x6.json.init('x6page',this.zTable);

        var tablePar = x6.p(this,'x6tablePar','');
        if(tablePar!='') {
            var skeyPar = x6bb.fwGet('skey_'+tablePar);
            json.addParm('tableIdPar',tablePar     );
            json.addParm('skeyPar'   ,skeyPar      );
        }
            
        json.addParm('x6action','browseFetch');
        json.addParm('xGridHeight',x6.p(this,'xGridHeight'));
        json.addParm('xSortable'  ,x6.p(this,'xSortable'  ));
        json.addParm('xReturnAll' ,x6.p(this,'xReturnAll' ));
        json.addParm('xButtonBar' ,x6.p(this,'xButtonBar','N'));
        json.addParm('sortCol',args.sortCol);
        json.addParm('sortAsc',args.sortAsc);
        x6dialogs.pleaseWait();
        if(html = json.execute(false,false,true)) {
            //var html = x6.json.jdata.html['browseFetchHtml'];
            $(this).find('.tbody').replaceWith(html);
        }
        delete json;
        x6dialogs.clear();
    }
    
    // Initialization. If we see "search_" inputs that are 
    // not empty, execute the search and pick the first one.
    if( $(self).find("[id^=search][value!=]").length > 0) {
        self.fetch();
        var jqRow = self.jqCurrentRow();
        if(jqRow.length>0) {
            var rowId = jqRow[0].id;
            var aRowId = rowId.split('_');
            var skey = aRowId.pop();
            console.log(rowId,aRowId,skey);
            setTimeout(function() {
                    x6events.fireEvent('reqEditRow_'+table,skey);
            },900);
        }
    }
}


/* **************************************************************** *\

   Additional routines for jquery tabs
   
\* **************************************************************** */
x6tabs = {
    // IE/Firefox Event handling.  This event comes from 
    // jQuery so we can trust it is ok.
    tabsShow: function(tabsUl,event,ui) {
        var tabs = tabsUl.parentNode;
        var profile = x6.p(tabs,'x6profile','');
        
        // A "kids" profile must do slideup, and get busy turning
        // buttons on and off for other tabs.
        if(profile=='kids') {
            // disable all other tabs until we are finished, this is
            // the easiest way to prevent user from clicking on some
            // other tab while processing is going on.
            tabsUl.parentNode.disableAll([ui.index]);

            // First job for kids is to turn parent stuff on/off
            var tablePar = x6.p(tabs,'x6parentTable');
            if(ui.index > 0) {
                x6events.fireEvent('buttonsOff_'+tablePar,true);
            }
            else {
                x6events.fireEvent('buttonsOn_'+tablePar,true);
            }
            
            // Next job is to turn previous tab's buttons on/off.
            // Find the first item with a tableid property and
            // assume that is the culprit.
            var previousTabId = x6.p(tabs,'zCurrentId','');
            if(previousTabId != '') {
                var jqTable = $('#'+previousTabId+' [xtableid]:first');
                var oldTable = x6.p(jqTable[0],'xTableId','');
                x6events.fireEvent('buttonsOff_'+oldTable,true);
                $('#'+previousTabId+' div[x6plugin=x6tabDiv]').each(
                    function() { this.keyboardOff(); }
                );
            }
            
            var topPane = x6.p(tabs,'x6slideUp');
            var tpi     = x6.p(tabs,'x6slideUpInner');
            x6tabs.slideUp(tabsUl,event,ui,topPane,tpi);
        }
        
        // A conventional profile assumes two tabs, first one
        // is grid, second one is detail
        if(profile=='conventional') {
            var table = x6.p(tabs,'x6table');
            var grid = $(tabs).find("div:first div[x6plugin=x6tabDiv]")[0];
            if(ui.index==0) {
                grid.keyboardOn();
                x6events.fireEvent('buttonsOff_'+table,true);
                
                // Turn keyboard off for all grids found over on detail side
                $('#kids_'+table+' div[x6plugin=x6tabDiv]').each(
                    function() { this.keyboardOff(); }
                );
            }
            else {
                grid.keyboardOff();
                x6events.fireEvent('buttonsNew_'+table);
                
                // KFD 1/2/08.  Always hide the child tabs when
                //              going back to 
                $("#kids_"+table+" > ul").tabs('select',0);
            }
        }


        /*
        *   Nice little trick, always set focus to first item
        *
        */
        var str = '#' + ui.panel.id;
        str+=' :input:not([disabled]):first';
        x6.jqSetFocus(str);
        
        /*
        *  Save the id and index of the newly shown tab
        *
        */
        tabs.zCurrentId    = ui.panel.id;
        tabs.zCurrentIndex = ui.index;
    
    },
    
    slideUp: function(tabsUl,event,ui,topPane,topPaneI) {
        var obj = x6.byId(topPane);
        if(typeof(obj.currentChild)=='undefined') obj.currentChild='*';
        var currentChild = obj.currentChild
        var newChild     = ui.panel.id;
        
        // if UI.index = 0, they clicked hide.  Make the
        if(ui.index==0) {
            if(currentChild!='*') {
                var newHeight = $('#'+topPane).height()+350;
                var newHeightI= $('#'+topPaneI).height()+350;
                $('#'+topPaneI).animate( {height: newHeightI},500,null
                    ,function() { $(this).css('overflow-y','scroll'); }
                );
                $('#'+topPane).animate( {height: newHeight},500);
                obj.currentChild = '*';
                tabsUl.parentNode.enableAll();
                $('#'+currentChild).css('overflow','hidden').height(3);
                return true;
            }
        }
        
        // Make the current tab effectively invisible
        $(ui.panel).css('overflow','hidden').height(3);
        
        
        // If no tab, slide up and slide down 
        if(currentChild=='*') {
            var newHeight = $('#'+topPane).height()-350;
            var newHeightI= $('#'+topPaneI).height()-350;
            setTimeout(function() {
                $('#'+topPaneI).animate( {height: newHeightI},500,null
                    ,function() {
                        $(this).css('overflow-y','scroll');
                    }
                );
            },100);
            $('#'+topPane).animate( {height: newHeight},500 );
            var newHeight=$(ui.panel).height()+350;
            setTimeout(function() {
                    $(ui.panel).animate({height: newHeight},500,null
                        ,function() { 
                            x6tabs.slideUpData(tabsUl,newChild,newHeight);
                        }
                    );
            },200);
            x6.byId(topPane).currentChild = newChild;
            return true;
        }

        // If we are still here, they picked one child tab
        // while another was still open.  We have to drop down
        // the selected tab.  We have to do this even if they
        // swap around between tabs, because jQuery restores the
        // original height (3px or so) when it hides a tab.
        var newHeight=$(ui.panel).height()+350;
        setTimeout(function() {
                $(ui.panel).animate({height: newHeight},500,null
                    ,function() { 
                        x6tabs.slideUpData(tabsUl,newChild,newHeight); 
                    } 
                );
                $('#'+currentChild).css('overflow','hidden').height(3);
        },100);
        x6.byId(topPane).currentChild = newChild;
        return true;
    },
    
    slideUpData: function(tabsUl,paneId,newHeight) {
        var pane     = x6.byId(paneId);
        var tablePar = x6.p(pane,'x6tablePar');
        var table    = x6.p(pane,'x6table'   );
        var skeyPar  = x6bb.fwGet('skey_'+tablePar);
        
        // KFD 1/2/08.  Get smarter.  If we already loaded a grid
        //              for a child table for current skey, don't
        //              bother doing it again.
        var skeyDid = x6bb.fwGet('skey_'+tablePar+'_'+table,0);
        if(skeyDid==skeyPar) {
            tabsUl.parentNode.enableAll();
            x6events.fireEvent('buttonsOn_'+table,true);
        }
        else {
            var json = new x6JSON(   'x6page'    ,table        );
            json.addParm('x6action'   ,'browseFetch');
            json.addParm('tableIdPar' ,tablePar     );
            json.addParm('skeyPar'    ,skeyPar      );
            json.addParm('sendGrid'   ,1            );
            json.addParm('xSortable'  ,'Y'          );
            json.addParm('xReturnAll' ,'Y'          );
            json.addParm('xGridHeight',newHeight-2  ); // assume borders
            x6.console.log(json);
            //html = json.execute(false,false,true);
            //pane.innerHTML = html;
            //var tabDiv = $(pane).find('[x6plugin=x6tabDiv]')[0];
            //x6plugins.x6tabDiv(tabDiv,tabDiv.id,table);
            x6dialogs.pleaseWait("Retrieving Data...");
            if(json.execute()) {
                json.process(paneId);
                //var id = $(pane).find("div")[0].id;
                //x6.initOne(id);
            }
            x6bb.fwSet('skey_'+tablePar+'_'+table,skeyPar);
            tabsUl.parentNode.enableAll();
            x6dialogs.clear();
        }
    }
}

x6plugins.x6tabs = function(self,id,table) {
    self.zTable        = table;
    self.zCurrentIndex = 0;  // Assume it starts with zeroth
    self.jqId          = '#'+id+' > ul';

    var x6profile = x6.p(self,'x6profile');
    
    self.disableAll = function(exceptions) {
        if(exceptions==null) exceptions = [ ];
        var count = $(this.jqId+" > li").length;
        for(x = 0;x < count; x++) {
            if(exceptions.indexOf(x)==-1) {
                $(this.jqId).tabs('disable',x);
            }
        }
    }
    self.enableAll = function(exceptions) {
        if(exceptions==null) exceptions = [ ];
        var count = $(this.jqId+" > li").length;
        for(x = 0;x < count; x++) {
            if(exceptions.indexOf(x)==-1) {
                $(this.jqId).tabs('enable',x);
            }
        }
    }
    

    /*
    *   Always bind the tabsshow event to a generic
    *   handler that looks at x6 parameters to decide
    *   what to do.  Notice the binding goes to the UL
    *   object!  x6tabs.tabsShow must then pop up to
    *   the parentNode, which is where the settings are.
    */
    $(self.jqId).bind('tabsshow',
        function(event,ui) {
            x6tabs.tabsShow(this,event,ui);
        }
    );
    
    /*
    *   A tabs bar accepts requests to hide a child
    *   tabs bar.  Also accepts request to enable/disable
    *   child tabs at bottom.
    *
    */
    if(x6profile=='kids') {
        x6events.subscribeToEvent('uiHideKids_'+table,id);
        self['receiveEvent_uiHideKids_'+table] = function(tableId) {
            var str = '#kids_'+tableId+" > ul";
            x6.console.log(str);
            $(str).tabs("select",0);
        }
        
        var parTab = x6.p(self,'x6parentTable');
        x6events.subscribeToEvent('uiDisableKids_'+parTab,id);
        self['receiveEvent_uiDisableKids_'+parTab] = function() {
            var count = $(this.jqId+" > li").length;
            for(x = 1;x < count; x++) {
                $(this.jqId).tabs('disable',x);
            }
        }
        x6events.subscribeToEvent('uiEnableKids_'+parTab,id);
        self['receiveEvent_uiEnableKids_'+parTab] = function() {
            var count = $(this.jqId+" > li").length;
            for(x = 1;x < count; x++) {
                $(this.jqId).tabs('enable',x);
            }
        }
        
        x6events.fireEvent('uiDisableKids_'+parTab);
    }
    
    
    
    // The count and offset variables determine which
    // keystrokes to listen for.
    var count = Number($('#'+id+' > ul > li').length);
    var offset= Number(x6.p(self,'xOffset',0));

    for(var x = offset; x<(offset+count); x++) {
        x6events.subscribeToEvent('key_Ctrl'+x.toString(),self.id);
        self['receiveEvent_key_Ctrl'+x.toString()] = function(key) {
            //return;
            x6.console.time("tabs key");
            x6.console.time("checking for visible");
            // Abort if he is not really visible, this is the
            // easiest way to do this, and we don't have to 
            // keep track of whether or not it is visible.
            var subject = this;
            while(true) {
                var wrapperPaneId = x6.p(subject,'x6wrapperPane','');
                // First break is not wrapped, its at the top of
                // the screen, so break out of here and allow 
                // the keystroke to select the tab.
                if(wrapperPaneId=='') break;
                
                var wrapperIndex  = Number(wrapperPaneId.slice(-1)) - 1;
                var wrapperTabsId = x6.p(x6.byId(wrapperPaneId),'xParentId','');
                // Here we re-assing the subject to one tab higher
                var subject = x6.byId(wrapperTabsId);
                if(x6.p(subject,'zCurrentIndex',-1)!=wrapperIndex) {
                    return;
                }
            }
            x6.console.timeEnd("checking for visible");
            
            // get the offset, the keystroke, 
            // and calculate the index.
            var offset = Number(x6.p(this,'xOffset',0));
            var key    = Number(key.slice(-1));
            var index  = (key - offset);
            var str = '#'+this.id+' > ul';
            $(str).tabs('select',index);
            x6.console.timeEnd("tabs key");
        }
    }
    
    /*
    *   These are all event handlers for a tabs bar full
    *   of xref entries for child tables.  Mostly they just
    *   turn everything off, the only one that really matters
    *   is uiEditRow, which turns it back on.
    */
    if(x6profile=='x6xrefs') {
        self.style.display='none';
        
        x6events.subscribeToEvent('uiNewRow_'+table,id);
        self['receiveEvent_uiNewRow_'+table] = function(x) {
            $(this).fadeOut('fast');
        }
        x6events.subscribeToEvent('uiUndoRow_'+table,id);
        self['receiveEvent_uiUndoRow_'+table] = function(x) {
            $(this).fadeOut('fast');
        }
        x6events.subscribeToEvent('uiDelRow_'+table,id);
        self['receiveEvent_uiDelRow_'+table] = function(x) {
            $(this).fadeOut('fast');
        }
        
        x6events.subscribeToEvent('uiEditRow_'+table,id);
        self['receiveEvent_uiEditRow_'+table] = function(x) {
            var kids = x6.p(this,'kids').split('|');
            for(var kid=0; kid < kids.length; kid++) {
                var pieces = kids[kid].split(':');
                var table_chd = pieces[0];
                var display   = pieces[1];  // assume 'checkbox'
                var json = new x6JSON('x6page',this.zTable);
                json.addParm('skey',x6bb.fwGet('skey_'+this.zTable));
                json.addParm('table_chd',pieces[0]);
                json.addParm('x6action' ,'child_checkbox');
                html = json.execute(false,false,true);
                var str = '#'+this.id+'-'+(Number(kid)+1);
                $(str).html(html);                
            }
            $(this).fadeIn('fast');
        }
        
        x6events.subscribeToEvent('xrefClick_'+table,id);
        self['receiveEvent_xrefClick_'+table] = function(args) {
            var inp = args.inp;
            
            // Here we have all of the values we need to make
            // a literal command to the back to either insert
            // or delete a row.
            var json = new x6JSON('x6table',args.x6table);
            json.addParm('x6action','checkboxSave');
            json.addParm('checked',inp.checked);
            json.addParm('cbval_'+args.pkl,args.pkvalleft);
            json.addParm('cbval_'+args.pkr,inp.value);
            if(!json.execute()) {
                inp.checked = !inp.checked;
            }
            delete json;
        }
    }
}

/***im* x6plugins/androPage
*
* NAME
*   x6plugins.androPage
*
* FUNCTION
*   The Javascript method x6plugins.androPage implements
*   all browser-side functionality for Andromeda's built-in
*   'androPage' inquiry system.
*
*   This routine is called automatically by x6.init, there
*   is not usually any reason for calling this routine
*   directly.
*
* INPUTS
*   self - the DOM object to be activated.
*   id - the ID of the object to be 'activated'.
*   table - the database table that the tabDiv is handling.
*
* RESULTS
*   no return value.
*
******
*/
x6plugins.androPage = function(self,id,table) {
    self.zTable    = table;
    
    x6events.subscribeToEvent('key_CtrlP',id);
    self.receiveEvent_key_CtrlP = function(key) {
        x6.byId('gp_post').value='pdf';
        x6.json.init('x6page',x6.byId('x6page').value);
        x6.json.inputs();
        x6.json.windowLocation();
        return false;
    }

    x6events.subscribeToEvent('key_CtrlE',id);
    self.receiveEvent_key_CtrlE = function(key) {
        x6.byId('gp_post').value='csvexport';
        x6.json.init('x6page',x6.byId('x6page').value);
        x6.json.inputs();
        x6.json.windowLocation();
        return false;
    }

    x6events.subscribeToEvent('key_CtrlO',id);
    self.receiveEvent_key_CtrlO = function(key) {
        this.tBody = null;
        
        x6.byId('gp_post').value='onscreen';
        x6.json.init('x6page',x6.byId('x6page').value);
        x6.json.inputs();
        x6.json.execute();
        x6.json.process('divOnScreen');
        
    }

    x6events.subscribeToEvent('key_CtrlQ',id);
    self.receiveEvent_key_CtrlQ = function(key) {
        this.tBody = null;
        
        x6.byId('gp_post').value='showsql';
        x6.json.init('x6page',x6.byId('x6page').value);
        x6.json.inputs();
        x6.json.addParm('showsql',1);
        x6.json.execute();
        x6.json.process('divOnScreen');
        
    }
}

