var oTextArea, oRtf, oControlPanel;

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
    var TextAreaDoc = document.createElement("script"),
        RichTextFieldDoc = document.createElement("script"),
        ControlPanelDoc = document.createElement("script");
    
    TextAreaDoc.type = "text/javascript";
    TextAreaDoc.src = "../js/wysiwyg/Class/TextArea.js";
    document.head.appendChild(TextAreaDoc);
    
    RichTextFieldDoc.type = "text/javascript";
    RichTextFieldDoc.src = "../js/wysiwyg/Class/RichTextField.js";
    document.head.appendChild(RichTextFieldDoc);
    
    ControlPanelDoc.type = "text/javascript";
    ControlPanelDoc.src = "../js/wysiwyg/Class/ControlPanel.js";
    document.head.appendChild(ControlPanelDoc);
    
    TextAreaDoc.onload = function() {
        oTextArea = new TextArea(sTextAreaID);

        return true;
    }

    if (TextAreaDoc.onload) {
        RichTextFieldDoc.onload = function () {
            oRtf = new RichTextField(sRichTextFieldID, oTextArea);
            
            return true;
        }
    }
    
    if (TextAreaDoc.onload && RichTextFieldDoc.onload) {
        ControlPanelDoc.onload = function () {
            oControlPanel = new ControlPanel(sControlPanelID, oRtf, oTextArea);
            oControlPanel.create_button(button);
            oControlPanel.create_toggle_button(menu);
        }
    }

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
                    "class" : [
                        "cp_btn",
                        "font-size-dropdown"
                    ],
                    "command" : "fontsize",
                    "value" : "1",
                    "text" : "Very Small"
                }, {
                    "class" : [
                        "cp_btn",
                        "font-size-dropdown"
                    ],
                    "command" : "fontsize",
                    "value" : "2",
                    "text" : "Small"
                }, {
                    "class" : [
                        "cp_btn",
                        "font-size-dropdown"
                    ],
                    "command" : "fontsize",
                    "value" : "3",
                    "text" : "Normal"
                }, {
                    "class" : [
                        "cp_btn",
                        "font-size-dropdown"
                    ],
                    "command" : "fontsize",
                    "value" : "4",
                    "text" : "Medium"
                }, {
                    "class" : [
                        "cp_btn",
                        "font-size-dropdown"
                    ],
                    "command" : "fontsize",
                    "value" : "5",
                    "text" : "Large"
                }, {
                    "class" : [
                        "cp_btn",
                        "font-size-dropdown"
                    ],
                    "command" : "fontsize",
                    "value" : "6",
                    "text" : "Very Large"
                }, {
                    "class" : [
                        "cp_btn",
                        "font-size-dropdown"
                    ],
                    "command" : "fontsize",
                    "value" : "7",
                    "text" : "Maximum"
                }

            ]
        }
    ];
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