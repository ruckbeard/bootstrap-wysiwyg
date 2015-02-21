/*----------------------------------------------------------------------------------------------
 * 
 * Text Area
 * The text area object contains the text area that will be turned into the rich text field
 * for the WYSIWYG editor.
 * 
 * @param string aID This is the id of the text area in the document.
 * 
 *----------------------------------------------------------------------------------------------
 * 
 * TextArea::get_text()
 * This function will return the text inside of the text area element
 * 
 * @return string
 * 
 *----------------------------------------------------------------------------------------------
 * 
 * TextArea::empty_text()
 * This function will empty the textarea element
 * 
 *----------------------------------------------------------------------------------------------
 * 
 * TextArea::set_text()
 * This function will set the text of the text area element
 * 
 *--------------------------------------------------------------------------------------------*/

var TextArea = function(aID) {
    this.ID = document.getElementById(aID);

    TextArea.prototype.get_text = function() {
        return this.ID.value;
    }

    TextArea.prototype.empty_text = function() {
        this.ID.value = "";
    }

    TextArea.prototype.set_text = function(sText) {
        this.ID.value = sText;
    }
}

/*---------------------------------------------------------------------------------------------
 * 
 * Rich Text Field
 * The rich text field object creates and contains the WYSIWYG iframe. It dynamically creates
 * the iframe object that allows the user to write with rich text instead of plain text.
 * 
 * @param string aID This is the id of the iframe that will be created by this object
 * 
 *----------------------------------------------------------------------------------------------
 * 
 * RichTextField::init()
 * This function initializes the rich text field object. It creates the iframe object, inserts
 * it into the document and turns the designMode on for the iframe. If the text area contains
 * text when this object is initialized, it will load the text into the iframe.
 * 
 * @param string aID This is the id of the iframe that will be created by the function
 * 
 *----------------------------------------------------------------------------------------------
 * 
 * RichTextField::get_HTML()
 * This function will return HTML inside of the body tag of the iframe
 * 
 * @return string Returns the HTML of the body tag of the iframe as a string
 * 
 *----------------------------------------------------------------------------------------------
 * 
 * RichTextField::empty_HTML()
 * This function will empty the body tag of the iframe
 * 
 *----------------------------------------------------------------------------------------------
 * 
 * RichTextField::set_HTML()
 * This function will set the HTML inside of the body tag of the iframe
 * 
 *--------------------------------------------------------------------------------------------*/

var RichTextField = function (aID, oTextArea) {
    this.ID = "";
    this.oTextArea = oTextArea;
    this.Doc = "";

    RichTextField.prototype.init = function(aID) {
        var iframe = document.createElement("iframe");
        iframe.setAttribute("name",aID);
        iframe.setAttribute("id",aID);
        
        var parent = this.oTextArea.ID.parentNode;
        parent.appendChild(iframe);

        this.ID = document.getElementById(aID);
        this.oTextArea.ID.classList.add("hidden");
        
        this.ID.onload = function() {           
            oRtf.Doc = oRtf.ID.contentDocument ? oRtf.ID.contentDocument : document.frames[oRtf.ID.id].document;
            oRtf.Doc.designMode = "on";
            if (oTextArea.get_text !== "")
                oRtf.set_HTML(oTextArea.get_text());
        }
    }

    this.init(aID);

    RichTextField.prototype.get_HTML = function() {
        return this.Doc.body.innerHTML;
    }

    RichTextField.prototype.empty_HTML = function() {
        this.Doc.body.innerHTML = "";
    }

    RichTextField.prototype.set_HTML = function(sText) {
        this.Doc.body.innerHTML = sText;
    }
}

/*---------------------------------------------------------------------------------------------
 * 
 * Control Panel
 * The control panel object creates and contains the WYSIWYG control panel. It dynamically
 * creates the div objects that hold the menu and button toolbars.
 * 
 * @param string aID This is the ID of the main control panel div that will be created.
 * @param object oRtf This holds a reference to the oRtf object
 * @param object oTextArea This holds a reference to the oTextArea object
 * 
 *---------------------------------------------------------------------------------------------
 * 
 * ControlPanel::init()
 * This function initializes the control panel by dynamically creating the main div, the
 * menu div, and the button div.
 * 
 * @param string aID This is the ID of the main control panel div
 * 
 *---------------------------------------------------------------------------------------------
 * 
 * ControlPanel::stop_default()
 * This function will stop the default function of any buttons and menu items created by
 * the Control Panel object.
 * 
 * @param event Holds a reference to the event that called the function;
 * 
 *----------------------------------------------------------------------------------------------
 * 
 * ControlPanel::create_button()
 * This function will read an array of objects and parse them. It will then use this information
 * to generate the HTML of the buttons and insert each button into the button div of the Control
 * Panel.
 * 
 * @param array aButton This is an array of objects that hold information to generate the HTML
 * 
 *----------------------------------------------------------------------------------------------
 * 
 * ControlPanel::create_toggle_button()
 * This function will read an array of objects and parse them. It will then use this information
 * to genereate the HTML of the menus and insert each menu into the menu div of the Control
 * Panel.
 * 
 * @param array aMenu This is an array of objects that hold information to generate the HTML
 * 
 *----------------------------------------------------------------------------------------------
 * 
 * ControlPanel::format()
 * This function can be called to format the text of the rich text field.
 * 
 * @param string sCmd This is the command that will be called to format the text
 * @param string sVal This is the value that will be used by the command to format the text
 * 
 *----------------------------------------------------------------------------------------------
 * 
 * ControlPanel::check_mode()
 * This function will check if the user is editing the text via the iframe or text area input
 * 
 *----------------------------------------------------------------------------------------------
 * 
 * ControlPanel::switch_view()
 * This function will switch between the iframe and the text area input
 * 
 *--------------------------------------------------------------------------------------------*/

var ControlPanel = function(aID, oRtf, oTextArea) {
    this.ID = "";
    this.oRtf = oRtf;
    this.oTextArea = oTextArea;

    ControlPanel.prototype.init = function(aID) {
        var panelDiv = document.createElement("div");
        panelDiv.setAttribute("id", aID);
        
        var parent = this.oTextArea.ID.parentNode;
        parent.insertBefore(panelDiv,this.oTextArea.ID)

        this.ID = document.getElementById(aID);
        
        var menu_bar = document.createElement("div");
        var button_bar = document.createElement("div");
        menu_bar.setAttribute("id", "menu_bar");
        button_bar.setAttribute("id", "button_bar")
        this.ID.appendChild(menu_bar);
        this.ID.appendChild(button_bar);
    }

    this.init(aID, oTextArea);

    ControlPanel.prototype.stop_default = function(evt) {
        evt.preventDefault();
    }

    ControlPanel.prototype.create_button = function(aButton) {
        var button = new Array();
        
        for (var i = 0; i < aButton.length; i++){
            button.push(document.createElement("button"));
            for (var j = 0; j < aButton[i].class.length; j++) {
                button[i].classList.add(aButton[i].class[j]);
            }
            
            var command = "";
            if (aButton[i].hasOwnProperty('command')) {
                command = "oControlPanel.format('" + aButton[i].command + "'";
                if (aButton[i].hasOwnProperty('value')) {
                    command += "," + aButton[i].value;
                }
                command += ");";
            }

            if (aButton[i].hasOwnProperty('customCommand')) {
                command = aButton[i].customCommand;
            }

            button[i].setAttribute("onClick", command);
            button[i].innerHTML = aButton[i].text;
            button[i].addEventListener('click', this.stop_default, false);

            document.getElementById("button_bar").appendChild(button[i]);
        }
    }

    ControlPanel.prototype.create_toggle_button = function(aMenu) {
        var button = new Array();
        for (var i = 0; i < aMenu.length; i++) {
            var div = document.createElement("div");
            div.classList.add("btn-group");
            
            button.push(document.createElement("button"));
            for (var j = 0; j < aMenu[i].buttonClass.length; j++) {
                button[i].classList.add(aMenu[i].buttonClass[j]);
            }
            button[i].setAttribute("data-toggle", "dropdown");
            button[i].setAttribute("aria-expand", "false");
            button[i].innerHTML = aMenu[i].buttonText;
            button[i].addEventListener('click', this.stop_default, false);
            
            var ul = document.createElement("ul");
            ul.classList.add("dropdown-menu");
            ul.setAttribute("role", "menu");
            
            var li = new Array();
            for (var j = 0; j < aMenu[i].list.length; j++) {
                li.push(document.createElement("li"))
                
                var a = document.createElement("a");
                for (var k = 0; k < aMenu[i].list[j].class.length; k++) {
                    a.classList.add(aMenu[i].list[j].class[k]);
                }
                a.setAttribute("href","#");
                
                var command = "";
                if (aMenu[i].list[j].hasOwnProperty('command')) {
                    command = "oControlPanel.format('" + aMenu[i].list[j].command + "'";
                    if (aMenu[i].list[j].hasOwnProperty('value')) {
                        command += "," + aMenu[i].list[j].value;
                    }
                    command += ");";
                }

                if (aMenu[i].list[j].hasOwnProperty('customCommand')) {
                    command = aMenu[i].list[j].customCommand;
                
                }
                a.setAttribute("onClick", command);
                a.addEventListener('click', this.stop_default, false);
                a.textContent = aMenu[i].list[j].text;
                
                li[j].appendChild(a);
                ul.appendChild(li[j]);
            }
            div.appendChild(button[i]);
            div.appendChild(ul);

            document.getElementById("menu_bar").appendChild(div);
        }
    }

    ControlPanel.prototype.format = function(sCmd, sValue) {
        if (this.check_mode()) {
            this.oRtf.Doc.execCommand(sCmd, false, sValue);
            this.oRtf.ID.focus();
        }
    }
    
    ControlPanel.prototype.check_mode = function() {
        return this.oTextArea.ID.classList.contains("hidden")
    }

    ControlPanel.prototype.switch_view = function() {
        if (this.check_mode()) {
            this.oTextArea.set_text(this.oRtf.get_HTML());
            this.oRtf.empty_HTML();
        } else {
            this.oRtf.set_HTML(this.oTextArea.get_text());
            this.oTextArea.empty_text();
        }
        this.oTextArea.ID.classList.toggle("hidden");
        this.oRtf.ID.classList.toggle("hidden");
    }
}

/*---------------------------------------------------------------------------------------------
 * 
 * init()
 * This function initializes the WYSIWYG editor. Creates the text area, richt text field, and
 * control panel objects. The buttons and menus are created dynamically from the button and
 * menu arrays that hold each button and menu as an object.
 * 
 * @param string sTextAreaID This is the id of the text area
 * @param string sRichTextFieldID This is the id of the iframe that will be created
 * @param string ScontrolPanelID This is the id of the control panel div that will be created
 * 
 *-------------------------------------------------------------------------------------------*/

function init(sTextAreaID, sRichTextFieldID, sControlPanelID) {
    oTextArea = new TextArea(sTextAreaID);
    oRtf = new RichTextField(sRichTextFieldID, oTextArea);
    oControlPanel = new ControlPanel(sControlPanelID, oRtf, oTextArea);

    var button = [
        {
            "class": [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "command" : "undo",
            "text" : "Undo"
        }, {
            "class" : [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "command" : "redo",
            "text" : "Redo"
        }, {
            "class" : [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "command" : "removeformat",
            "text" : "Remove Format"
        }, {
            "class" : [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "command" : "forecolor",
            "value" : "prompt('Define a basic color or apply a hexidecimal color code:', '')",
            "text" : "Color"
        }, {
            "class" : [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "command" : "bold",
            "text" : "<span class=\"glyphicon glyphicon-bold\"></span>"
        }, {
            "class" : [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "command" : "underline",
            "text" : "U"
        }, {
            "class" : [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "command" : "italic",
            "text" : "<span class=\"glyphicon glyphicon-italic\"></span>"
        }, {
            "class" : [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "command" : "justifyleft",
            "text" : "<span class=\"glyphicon glyphicon-align-left\"></span>"
        }, {
            "class" : [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "command" : "justifycenter",
            "text" : "<span class=\"glyphicon glyphicon-align-center\"></span>"
        }, {
            "class" : [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "command" : "justifyright",
            "text" : "<span class=\"glyphicon glyphicon-align-right\"></span>"
        }, {
            "class" : [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "command" : "insertorderedlist",
            "text" : "OL"
        }, {
            "class" : [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "command" : "insertunorderedlist",
            "text" : "UL"
        }, {
            "class" : [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "command" : "formatblock",
            "value" : "'blockquote'",
            "text" : "Quote"
        }, {
            "class" : [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "command" : "outdent",
            "text" : "<span class=\"glyphicon glyphicon-indent-right\"></span>"
        }, {
            "class" : [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "command" : "indent",
            "text" : "<span class=\"glyphicon glyphicon-indent-left\"></span>"
        }, {
            "class" : [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "customCommand" : "var link = prompt('Enter a URL:', 'http://'); oControlPanel.format('createlink',link);",
            "text" : "Link"
        }, {
            "class" : [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "command" : "unlink",
            "text" : "UnLink"
        }, {
            "class" : [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "customCommand" : "var imgSrc = prompt('Enter image location', ''); if (imgSrc !== null) { oControlPanel.format('insertimage',imgSrc); };",
            "text" : "Image"
        }, {
            "class" : [
                "btn", 
                "btn-default", 
                "btn-xs", 
                "cp_btn"
            ],
            "customCommand" : "oControlPanel.switch_view();",
            "text" : "Switch"
        }
    ];

    var menu = [
        {
            "buttonClass" : [
                "btn",
                "btn-default",
                "btn-xs",
                "dropdown-toggle",
                "cp_btn"
            ],
            "buttonText" : "Font Size <span class=\"caret\"></span>",
            "list" : [
                {
                    class : [
                        "cp_btn",
                        "font-size-dropdown"
                    ],
                    command : "fontsize",
                    value : "1",
                    text : "Very Small"
                }, {
                    class : [
                        "cp_btn",
                        "font-size-dropdown"
                    ],
                    command : "fontsize",
                    value : "2",
                    text : "Small"
                }, {
                    class : [
                        "cp_btn",
                        "font-size-dropdown"
                    ],
                    command : "fontsize",
                    value : "3",
                    text : "Normal"
                }, {
                    class : [
                        "cp_btn",
                        "font-size-dropdown"
                    ],
                    command : "fontsize",
                    value : "4",
                    text : "Medium"
                }, {
                    class : [
                        "cp_btn",
                        "font-size-dropdown"
                    ],
                    command : "fontsize",
                    value : "5",
                    text : "Large"
                }, {
                    class : [
                        "cp_btn",
                        "font-size-dropdown"
                    ],
                    command : "fontsize",
                    value : "6",
                    text : "Very Large"
                }, {
                    class : [
                        "cp_btn",
                        "font-size-dropdown"
                    ],
                    command : "fontsize",
                    value : "7",
                    text : "Maximum"
                }

            ]
        }
    ];

    oControlPanel.create_button(button);
    oControlPanel.create_toggle_button(menu);
}

/*---------------------------------------------------------------------------------------------
 * 
 * submit_form()
 * This function can be called when submitting a form to make sure you get the content from the
 * WYSIWYG editor.
 * 
 * @param string sFormID This is the id of the form you are submitting
 * 
 *-------------------------------------------------------------------------------------------*/

function submit_form(sFormID) {
    var form = document.getElementById(sFormID);
    var post_submit = document.createElement("input");
    post_submit.setAttribute("type", "hidden");
    post_submit.setAttribute("name", "post_submit");
    post_submit.setAttribute("value", "Submit");
    form.appendChild(post_submit);
    if (oControlPanel.check_mode()) {
        oTextArea.set_text(oRtf.get_HTML());
        form.submit();
    } else {
        form.submit();
    }
}