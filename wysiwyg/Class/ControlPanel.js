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

var ControlPanel = function (aID, oRtf, oTextArea) {
    this.ID = "";
    this.oRtf = oRtf;
    this.oTextArea = oTextArea;

    ControlPanel.prototype.init = function (aID) {
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
    };

    this.init(aID, oTextArea);

    ControlPanel.prototype.stop_default = function (evt) {
        evt.preventDefault();
    };

    ControlPanel.prototype.create_button = function (aButton) {
        var button = [], command = "", i, j;
        
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
    };

    ControlPanel.prototype.create_toggle_button = function (aMenu) {
        var div = document.createElement("div"),
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
    };

    ControlPanel.prototype.format = function (sCmd, sValue) {
        if (this.check_mode()) {
            this.oRtf.Doc.execCommand(sCmd, false, sValue);
            this.oRtf.ID.focus();
        }
    };
    
    ControlPanel.prototype.check_mode = function () {
        return this.oTextArea.ID.classList.contains("hidden");
    };

    ControlPanel.prototype.switch_view = function () {
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

