/*
 * This file is part of yoob.js version 0.4
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A view (in the MVC sense) for depicting a yoob.Playfield (-compatible)
 * object onto any HTML element that supports innerHTML.
 *
 * TODO: *** THIS DOES NOT WORK *** please do not use it yet
 */
yoob.PlayfieldHTMLView = function() {
    this.pf = undefined;
    this.element = undefined;

    this.init = function(pf, element) {
        this.pf = pf;
        this.element = element;
        return this;
    };

    /*
     * Override these if you want to draw some portion of the
     * playfield which is not the whole playfield.
     */
    this.getLowerX = function() {
        return this.pf.getMinX();
    };
    this.getUpperX = function() {
        return this.pf.getMaxX();
    };
    this.getLowerY = function() {
        return this.pf.getMinY();
    };
    this.getUpperY = function() {
        return this.pf.getMaxY();
    };

    /*
     * Override to convert Playfield values to HTML.
     */
    this.render = function(value) {
        return value;
    };

    this.draw = function() {
        var text = "";
        for (var y = this.getLowerY(); y <= this.getUpperY(); y++) {
            var row = "";
            for (var x = this.getLowerX(); x <= this.getUpperX(); x++) {
                row += this.render(this.pf.get(x, y));
            }
            text += row + "\n";
        }
        this.element.innerHTML = text;
    };

};
