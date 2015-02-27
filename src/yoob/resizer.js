/*
 * This file is part of yoob.js version 0.9-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * This class is provided to help craft solutions to resizing problems,
 * which (in my experience, anyway) are always rather nasty and ugly.
 *
 * So, what we have is: a rectangle of a desired size (width and height).
 * We call this the _source_ size.  This might be the size of an image we
 * wish to display, or the extents of a playfield we wish to consider.
 *
 * We also have a _destination_ size.  This might be the available screen
 * real estate for displaying the source image.  Or, more precisely, it
 * might be the available size, in a given DOM element, taking account of
 * any number of factors, like visibility on the screen.
 *
 * In general, we want to reconcile these two vectors.
 *
 * ...
 */
yoob.Resizer = function() {
    this.init = function(cfg) {
        this.sourceWidth = cfg.sourceWidth;
        this.sourceHeight = cfg.sourceHeight;
        return this;
    };
};
