/*
 * This file is part of yoob.js version 0.6
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A view (in the MVC sense) for depicting a program source (or any
 * unidimensional text string, really) onto any DOM element that supports
 * innerHTML.
 *
 * Supports yoob.Cursors.  The cursor's x indicates the position in the
 * program.  The cursor's y is ignored.
 */
yoob.SourceHTMLView = function() {
    this.text = undefined;
    this.element = undefined;

    this.init = function(text, element) {
        this.text = text;
        this.element = element;
        this.cursors = [];
        return this;
    };

    /*** Chainable setters ***/

    /*
     * Set the list of cursors to the given list of yoob.Cursor (or compatible)
     * objects.
     */
    this.setCursors = function(cursors) {
        this.cursors = cursors;
        return this;
    };

    this.setSourceText = function(text) {
        this.text = text;
        return this;
    };

    /*
     * Override if you wish to convert source text characters to HTML somehow.
     */
    this.render = function(value) {
        return value;
    };

    /*
     * Render the source text, as HTML, on the DOM element.
     */
    this.draw = function() {
        var text = "";
        for (var x = 0; x < this.text.length; x++) {
            var rendered = this.render(this.text.charAt(x));
            for (var i = 0; i < this.cursors.length; i++) {
                if (this.cursors[i].x === x) {
                    rendered = this.cursors[i].wrapText(rendered);
                }
            }
            text += rendered;
        }
        this.element.innerHTML = text;
    };

};
