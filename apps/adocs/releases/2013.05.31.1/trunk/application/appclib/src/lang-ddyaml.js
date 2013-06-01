/**
 * @fileoverview
 * Registers a language handler for Andromeda's DD-YAML Format
 *
 *
 * To use, include prettify.js and this file in your HTML page.
 * Then put your code in an HTML tag like
 *      <pre class="prettyprint lang-ddyaml">table name: etc</pre>
 *
 *
 * copied from
 */

var properties = 'column|module|description|uisort|uisearch|primary_key'
    +'|suffix|prefix|type_id|colprec|colscale'
    +'|automation_id|auto_formula|auto';
var objects    = 'table|column|menu|module|group';
var allofthem  = properties + '|' + objects;
PR.registerLangHandler(
    PR.createSimpleLexer(
        [
         // Whitespace
         [PR.PR_PLAIN,       /^[\t\n\r \xA0]+/, null, '\t\n\r \xA0'],
         // A double or single quoted, possibly multi-line, string.
         [PR.PR_STRING,      /^(?:"(?:[^\"\\]|\\.)*"|'(?:[^\'\\]|\\.)*')/, null,
          '"\'']
        ],
        [
         // A comment is either a line comment that starts with two dashes, or
         // two dashes preceding a long bracketed block.
         [PR.PR_COMMENT, /^(?:--[^\r\n]*|\/\*[\s\S]*?(?:\*\/|$))/],
         [PR.PR_KEYWORD, /^(?:table|menu|module|column|group|column|module|description|uisort|uisearch|primary_key|suffix|prefix|type_id|colprec|colscale|automation_id|auto_formula|auto)(?=[^\w-]|$)/i, null],
         // A number is a hex integer literal, a decimal real literal, or in
         // scientific notation.
         [PR.PR_LITERAL,
          /^[+-]?(?:0x[\da-f]+|(?:(?:\.\d+|\d+(?:\.\d*)?)(?:e[+\-]?\d+)?))/i],
         // An identifier
         [PR.PR_PLAIN, /^[a-z_][\w-]*/i],
         // A run of punctuation
         [PR.PR_PUNCTUATION, /^[^\w\t\n\r \xA0]+/]
        ]),
    ['ddyaml']
);

