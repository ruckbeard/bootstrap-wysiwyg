

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

function TextArea (aID) {
    this.ID = document.getElementById(aID);

    this.get_text = function () {
        return this.ID.value;
    };

    this.empty_text = function () {
        this.ID.value = "";
    }; 

    this.set_text = function (sText) {
        this.ID.value = sText;
    };
};

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

function RichTextField (aID, oTextArea) {
    this.ID = "";
    this.oTextArea = oTextArea;
    this.Doc = "";

    this.get_HTML = function () {
        return this.Doc.body.innerHTML;
    };

    this.empty_HTML = function () {
        this.Doc.body.innerHTML = "";
    };

    this.set_HTML = function (sText) {
        this.Doc.body.innerHTML = sText;
    };

    this.get_doc = function () {
        this.Doc = (this.ID.contentDocument) ? this.ID.contentDocument : document.frames[this.ID.id].document;
        this.Doc.designMode = "on";
        if (oTextArea.get_text !== "") {
            this.set_HTML(oTextArea.get_text());
        }
    }

    this.init = function (aID) {
        var iframe = document.createElement("iframe"),
            parent = this.oTextArea.ID.parentNode;

        iframe.setAttribute("name", aID);
        iframe.setAttribute("id", aID);
        parent.appendChild(iframe);

        this.ID = document.getElementById(aID);
        this.oTextArea.ID.classList.add("hidden");

        this.ID.onload = this.get_doc();
    };


    this.init(aID);
};

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
 * menu div, the button div, and all of the buttons that populate the control panel.
 * 
 * @param string aID This is the ID of the main control panel div
 * 
 *---------------------------------------------------------------------------------------------
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

function ControlPanel(aID, oRtf, oTextArea) {
    this.ID = "";
    this.oRtf = oRtf;
    this.oTextArea = oTextArea;

    this.init = function (aID) {
        var panelDiv = document.createElement("div"),
            parent = this.oTextArea.ID.parentNode,
            menu_bar = document.createElement("div"),
            button_bar = document.createElement("div");

        panelDiv.setAttribute("id", aID);
        parent.insertBefore(panelDiv, this.oTextArea.ID);
        menu_bar.setAttribute("id", "menu_bar");
        button_bar.setAttribute("id", "button_bar");

        this.ID = document.getElementById(aID);
        this.ID.appendChild(menu_bar);
        this.ID.appendChild(button_bar);

        var get_json = function(url, success, error) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function() {
                var status;
                var data;
                if (xhr.readyState == 4) {
                    status = xhr.status;
                    if (status == 200) {
                        data = JSON.parse(xhr.responseText);
                        success && success(data);
                    } else {
                        error && error(status);
                    }
                }
            }
            xhr.send();
        }

        //create buttons from JSON file
        get_json("../js/wysiwyg/buttons.json", function(data) {
            this.stop_default = function (evt) {
                evt.preventDefault();
            };
            
            var aButton = data.buttons, button = [], command = "", i, j;

            for (i = 0; i < aButton.length; i += 1) {
                button.push(document.createElement("button"));
                for (j = 0; j < aButton[i].class.length; j += 1) {
                    button[i].classList.add(aButton[i].class[j]);
                }

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
        
        }, function(status) {
            console.log("Error: " + status);
        })

        //create menus from JSON file
        get_json("../js/wysiwyg/menus.json", function(data) {
            this.stop_default = function (evt) {
                evt.preventDefault();
            };
            
            var aMenu = data.menus, div = document.createElement("div"),
                button = [],
                ul = document.createElement("ul"),
                li = [],
                a = document.createElement("a"),
                command = "",
                i,
                j,
                k;

            for (i = 0; i < aMenu.length; i += 1) {
                div.classList.add("btn-group");

                button.push(document.createElement("button"));
                for (j = 0; j < aMenu[i].buttonClass.length; j += 1) {
                    button[i].classList.add(aMenu[i].buttonClass[j]);
                }
                button[i].setAttribute("data-toggle", "dropdown");
                button[i].setAttribute("aria-expand", "false");
                button[i].innerHTML = aMenu[i].buttonText;
                button[i].addEventListener('click', this.stop_default, false);

                ul.classList.add("dropdown-menu");
                ul.setAttribute("role", "menu");

                for (j = 0; j < aMenu[i].list.length; j += 1) {
                    li.push(document.createElement("li"));

                    for (k = 0; k < aMenu[i].list[j].class.length; k += 1) {
                        a.classList.add(aMenu[i].list[j].class[k]);
                    }
                    a.setAttribute("href", "#");

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
        }, function(status) {
            console.log("Error: " + status);
        })
    };

    this.init(aID, oTextArea);

    this.format = function (sCmd, sValue) {
        if (this.check_mode()) {
            this.oRtf.Doc.execCommand(sCmd, false, sValue);
            this.oRtf.ID.focus();
        }
    };

    this.check_mode = function () {
        return this.oTextArea.ID.classList.contains("hidden");
    };

    this.switch_view = function () {
        if (this.check_mode()) {
            this.oTextArea.set_text(this.oRtf.get_HTML());
            this.oRtf.empty_HTML();
        } else {
            this.oRtf.set_HTML(this.oTextArea.get_text());
            this.oTextArea.empty_text();
        }
        this.oTextArea.ID.classList.toggle("hidden");
        this.oRtf.ID.classList.toggle("hidden");
    };
};

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