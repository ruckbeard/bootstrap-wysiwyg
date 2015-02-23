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

    RichTextField.prototype.get_HTML = function () {
        return this.Doc.body.innerHTML;
    };

    RichTextField.prototype.empty_HTML = function () {
        this.Doc.body.innerHTML = "";
    };

    RichTextField.prototype.set_HTML = function (sText) {
        this.Doc.body.innerHTML = sText;
    };
    
    RichTextField.prototype.get_doc = function () {
        this.Doc = (this.ID.contentDocument) ? this.ID.contentDocument : document.frames[this.ID.id].document;
        this.Doc.designMode = "on";
        if (oTextArea.get_text !== "") {
            this.set_HTML(oTextArea.get_text());
        }
    };

    RichTextField.prototype.init = function (aID) {
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
