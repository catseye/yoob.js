/*
 * This file is part of yoob.js version 0.10
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A view (in the MVC sense) for depicting a yoob.Stack (-compatible)
 * object onto any DOM element that supports innerHTML.
 */
yoob.StackHTMLView = function() {
    this.init = function(cfg) {
        this.stack = cfg.stack;
        this.element = cfg.element;
        return this;
    };

    /*** Chainable setters ***/

    this.setStack = function(stack) {
        this.stack = stack;
        return this;
    };

    /*
     * For compatibility with PlayfieldCanvasView.  Sets the font size.
     */
    this.setCellDimensions = function(cellWidth, cellHeight) {
        this.element.style.fontSize = cellHeight + "px";
        return this;
    };

    /*
     * Convert Stack values to HTML.  Override to customize appearance.
     */
    this.render = function(value) {
        if (value === undefined) return ' ';
        return value;
    };

    /*
     * Render the stack, as HTML, on the DOM element.
     */
    this.draw = function() {

        var text = "";
        this.stack.foreach(function(pos, value) {
            text += this.render(value) + "<br/>";
        });
        this.element.innerHTML = text;
    };
};
