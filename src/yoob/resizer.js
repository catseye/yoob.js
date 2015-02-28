/*
 * This file is part of yoob.js version 0.9-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * These classes are provided to help craft solutions to resizing problems,
 * which (in my experience, anyway) are always rather nasty and ugly.
 *
 * First, we have a class which is an abstraction of a size.  It may be
 * used explicitly to specify a desired size, or it may be used to determine
 * the size of some object (perhaps an Image, or a DOM element, or the
 * visible portion of a proposed DOM element.)
 */

yoob.Size = function() {
    this.init = function(cfg) {
        this.width = cfg.width;
        this.height = cfg.height;
        return this;
    };

    this.setFromImage = function(img) {
        this.width = img.width;
        this.height = img.height;
        return this;
    };

    this.setFromElement = function(elem) {
        this.width = elem.clientWidth;
        this.height = elem.clientHeight;
        return this;
    };

    this.applyToElement = function(elem) {
        elem.width = this.width;
        elem.height = this.height;
        return this;
    }; 

    this.applyAsStyle = function(elem) {
        elem.style.width = this.width + "px";
        elem.style.height = this.height + "px";
        return this;
    };

    this.getAspectRatio = function() {
        return this.width / this.height;
    };

    this.scale = function(factor) {
        this.width *= factor;
        this.height *= factor;
        return this;
    };

    /*
     * Return the factor that would be required to scale this size by
     * in order to make it fit inside the given size, while preserving
     * the aspect ratio.
     */
    this.getFitScale = function(destSize) {
        var widthFactor = this.width / destSize.width;
        var heightFactor = this.height / destSize.height;
        // say this is twice as wide, but 1.5 as high as dest.
        // then wf will be 2, and hf will be 1.5.
        // max of these is 2
        // so fitscale will be 0.5
        return 1 / Math.max(widthFactor, heightFactor);
    };

    this.fit = function(destSize) {
        return this.scale(this.getFitScale(destSize));
    };

    /*
     * Assume this size is placed at (left, top) inside the given size.
     * Truncate this size so that it fits entirely within the given size.
     * For example, the given size might be window.client{Width,Height}
     * and the (left, top) might be the position of a div.
     */
    this.clip = function(outerSize, left, top) {
        if (left + this.width > outerSize.width) {
            this.width = outerSize.width - left;
        }
        if (top + this.height > outerSize.height) {
            this.height = outerSize.height - top;
        }
        return this;
    };
};

/*
 * Offsets, too.
 */

yoob.Offset = function() {
    this.init = function(cfg) {
        this.left = cfg.left;
        this.top = cfg.top;
        return this;
    };

    /*
     * Yep, this does that thing.
     */
    this.setFromElement = function(elem) {
        var left = 0;
        var top = 0;
        while (elem) {
            left += elem.offsetLeft;
            top += elem.offsetTop;
            elem = elem.parentElement;
        }
        this.left = left;
        this.top = top;
        return this;
    };

    this.applyAsStyle = function(elem) {
        elem.style.left = this.left + "px";
        elem.style.top = this.top + "px";
        return this;
    };
};

/*
 * Now that we have Sizes, what we want to do is reconcile them
 *
 * So, what we have is a _source size_, which might be the size of an image we
 * wish to display, or the extents of a playfield we wish to consider.
 *
 * We also have a _destination size_, which might be the available screen
 * real estate for displaying the source image.  Or, more precisely, it
 * might be the available size, in a given DOM element, taking account of
 * any number of factors, like visibility on the screen.
 *
 * From these, and various jiggery-pokery, we compute a _result size_.
 */
yoob.Resizer = function() {
    this.init = function(cfg) {
        this.src = cfg.src;    // assumed to be a Size
        this.dest = cfg.dest;  // assumed to be a Size
        return this;
    };

    this.setSource = function(src) { this.src = src; return this; }
    this.setDestination = function(dest) { this.dest = dest; return this; }

    /* ??? */
    /* 3. Profit! */
    
    /* Things to handle:
        onload
        onresize
        onorientationchange
        if style.width/height expressed in %, re-get clientW/H after such
     */
};
