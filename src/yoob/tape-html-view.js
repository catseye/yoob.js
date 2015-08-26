/*
 * This file is part of yoob.js version 0.10
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A view (in the MVC sense) for depicting a yoob.Tape (-compatible)
 * object onto any DOM element that supports innerHTML.
 */
yoob.TapeHTMLView = function() {
    this.init = function(cfg) {
        this.tape = cfg.tape;
        this.element = cfg.element;
        return this;
    };

    /*** Chainable setters ***/

    this.setTape = function(tape) {
        this.tape = tape;
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
     * Convert Tape values to HTML.  Override to customize appearance.
     */
    this.render = function(value) {
        if (value === undefined) return ' ';
        return value;
    };

    /*
     * Render the Tape, as HTML, on the DOM element.
     * TODO: make this not awful.
     */
    this.draw = function() {
        var text = "";
        this.tape.foreach(function(pos, value) {
            text += this.render(value) + "<br/>";
        }, { dense: true });
        this.element.innerHTML = text;
    };
};
