/*
 * This file is part of yoob.js version 0.9-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * NOTE: this still has bugs!
 *
 * This class provides objects that resize a canvas to fill (or be centered in)
 * an area in the viewport, with several options.
 *
 * See here for the main use cases I wanted to address:
 *     https://gist.github.com/cpressey/0e2d7f8f9a9a28c863ec
 *
 * You don't really need this if all you want is a full-viewport canvas;
 * that's easy enough to do with CSS and a simple onresize handler (see
 * above article.)  But it does accomodate that if you want.
 */
yoob.CanvasResizer = function() {
    /*
     * Initializes this CanvasResizer and returns it.  Does not hook into
     * any DOM events, so generally you want to call .register() afterwards.
     *
     * `canvas`: the canvas to resize
     * `redraw`: a function that redraws the canvas after redimensioning
     *   (optional; not needed if redimensionCanvas is false.)
     * `desired{Width,Height}`: the desired width and height of the canvas
     * `redimensionCanvas`: should we set the canvas's width and height
     *   properties to the clientWidth and clientHeight of the element
     *   after it has been resized?  defaults to true.
     * `preserveAspectRatio`: should we try to preserve the aspect ratio
     *   of the canvas after resizing?  defaults to true.
     * `allowExpansion`: should we ever resize the canvas to a size larger
     *   than the desired width & height?  defaults to false.
     * `allowContraction`: should we ever resize the canvas to a size smaller
     *   than the desired width & height?  defaults to true.
     * `missingCanvasElement`: if allowContraction is false, this should be
     *   a DOM element whose `display` style will be changed from `none` to
     *   `block` when the viewport is too small to display the canvas.
     * `centerVertically`: should we apply a top margin to the canvas
     *   element, to equal half the available space below it, after resizing
     *   it?  defaults to defaults to true.
     */
    this.init = function(cfg) {
        this.canvas = cfg.canvas;
        this.redraw = cfg.redraw || function() {};
        this.desiredWidth = cfg.desiredWidth || null;
        this.desiredHeight = cfg.desiredHeight || null;
        this.redimensionCanvas = cfg.redimensionCanvas === false ? false : true;
        this.preserveAspectRatio = cfg.preserveAspectRatio === false ? false : true;
        this.allowExpansion = !!cfg.allowExpansion;
        this.allowContraction = cfg.allowContraction === false ? false : true;
        this.missingCanvasElement = cfg.missingCanvasElement;
        this.centerVertically = cfg.centerVertically === false ? false : true;
        return this;
    };

    this.register = function(w) {
        var $this = this;
        var resizeCanvas = function(e) {
            $this.resizeCanvas(e);
        };
        window.addEventListener("load", resizeCanvas);
        window.addEventListener("resize", resizeCanvas);
        // TODO: orientationchange?
        return this;
    };

    /*
     * Returns a two-element list, containing the width and height of the
     * available space in the viewport, measured from the upper-left corner
     * of the given element.
     */
    this.getAvailableSpace = function(elem) {
        var rect = elem.getBoundingClientRect();
        var absTop = Math.round(rect.top + window.pageYOffset);
        var absLeft = Math.round(rect.left + window.pageXOffset);
        var html = document.documentElement;
        var availWidth = html.clientWidth - absLeft * 2;
        var availHeight = html.clientHeight - (absTop + absLeft * 2);
        return [availWidth, availHeight];
    };

    /*
     * Given a destination width and height, return the scaling factor
     * which is needed to scale the desired width and height to that
     * destination rectangle.
     */
    this.getFitScale = function(destWidth, destHeight) {
        var widthFactor = this.desiredWidth / destWidth;
        var heightFactor = this.desiredHeight / destHeight;
        return 1 / Math.max(widthFactor, heightFactor);
    };

    this.resizeCanvas = function() {
        var avail = this.getAvailableSpace(this.canvas.parentElement);
        var availWidth = avail[0];
        var availHeight = avail[1];
        var newWidth = availWidth;
        var newHeight = availHeight;

        if (this.preserveAspectRatio) {
            var scale = this.getFitScale(availWidth, availHeight);
            if (!this.allowExpansion) {
                scale = Math.min(scale, 1);
            }
            if (!this.allowContraction) {
                scale = Math.max(scale, 1);
            }
            newWidth = Math.trunc(this.desiredWidth * scale);
            newHeight = Math.trunc(this.desiredHeight * scale);
        } else {
            // if we don't care about preserving the aspect ratio but do
            // care about preserving the size, clamp each dimension
            if (!this.allowExpansion) {
                newWidth = Math.min(newWidth, this.desiredWidth);
                newHeight = Math.min(newHeight, this.desiredHeight);
            }
            if (!this.allowContraction) {
                newWidth = Math.max(newWidth, this.desiredWidth);
                newHeight = Math.max(newHeight, this.desiredHeight);
            }
        }

        if (newWidth > availWidth || newHeight > availHeight) {
            // due to not allowing contraction, our canvas is still
            // too big to display.  hide it and show the other thing
            canvas.style.display = 'none';
            if (this.missingCanvasElement) {
                this.missingCanvasElement.style.display = 'block';
            }
        } else {
            canvas.style.display = 'block';
            if (this.missingCanvasElement) {
                this.missingCanvasElement.style.display = 'none';
            }
        }

        if (true) {
            // TODO: add an option to skip this part...?
            // you might want to skip it if you have these as %'s
            this.canvas.style.width = newWidth + "px";
            this.canvas.style.height = newHeight + "px";
        }

        this.canvas.style.marginTop = "0";
        if (this.centerVertically) {
            if (availHeight > newHeight) {
                this.canvas.style.marginTop =
                    Math.trunc((availHeight - newHeight) / 2) + "px";
            }
        }

        if (this.redimensionCanvas) {
            if (this.canvas.width !== newWidth || this.canvas.height !== newHeight) {
                this.canvas.width = newWidth;
                this.canvas.height = newHeight;
                this.redraw();
            }
        }
    };
};
