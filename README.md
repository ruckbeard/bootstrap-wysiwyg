# bootstrap-wysiwyg
A WYSIWYG editor written in JavaScript to be used with twitter bootstrap 3

<h2>How to use:</h2>

To use this WYSIWYG editor, just include the script on the page you want to use it. Then call the init() function as so:

<pre>
document.addEventListener("DOMContentLoaded", function(event) {
    init("textAreaID", "richTextFieldID", "controlPanelID");
});
</pre>

The first parameter is the id of the text area that you want to target. The second and third parameters are the ids of the rich text field and control panel that the script will create.
