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
     * Override if you like.
     */
    this.wrapCursorText = function(cursor, text) {
        var fillStyle = this.cursorFillStyle || "#50ff50";
        return '<span style="background: ' + fillStyle + '">' +
               text + '</span>';
    };

    /*
     * Render the Tape, as HTML, on the DOM element.
     * TODO: make this not awful.
     */
    this.draw = function() {
        var cursors = this.tape.cursors;
        var text = "";
        var $this = this;
        this.tape.foreach(function(pos, value) {
            var rendered = $this.render(value);
            for (var i = 0; i < cursors.length; i++) {
                if (cursors[i].getX() === pos) {
                    rendered = $this.wrapCursorText(cursors[i], rendered);
                }
            }
            text += rendered + "<br/>";
        }, { dense: true });
        this.element.innerHTML = text;
    };
};
