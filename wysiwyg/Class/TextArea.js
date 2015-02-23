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

var TextArea = function (aID) {
    this.ID = document.getElementById(aID);

    TextArea.prototype.get_text = function () {
        return this.ID.value;
    };

    TextArea.prototype.empty_text = function () {
        this.ID.value = "";
    };

    TextArea.prototype.set_text = function (sText) {
        this.ID.value = sText;
    };
};
