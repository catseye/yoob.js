/*
 * This file is part of yoob.js version 0.9
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * yoob.Chargen is an object for producing bitmapped-character-like displays,
 * such as those found on 8-bit home computers of olde.  A monochromatic image,
 * with the character patterns in a regular grid, must be supplied.  Chromatic
 * versions of the character patterns, in each of the given colours, will be
 * automatically created.
 *
 * The character data may also be modified programatically.
 *
 * There may be better ways to accomplish this feat -- perhaps far, far better
 * ways -- but this aims to be reasonable and good-enough-for-now.
 */
yoob.Chargen = function() {
    this.init = function(cfg) {
        this.colorTriples = cfg.colorTriples || [[0, 0, 0], [255, 255, 255]];
        this.charWidth = cfg.charWidth || 8;
        this.charHeight = cfg.charHeight || 8;
        this.charsPerRow = cfg.charsPerRow || 16;
        this.rows = cfg.rows || 16;
        this.bitmaps = [];  // canvas elements

        for (var i = 0; i < this.colorTriples.length; i++) {
            var canvas = document.createElement("canvas");
            canvas.width = this.charWidth * this.charsPerRow;
            canvas.height = this.charHeight * this.rows;
            this.bitmaps.push(canvas);
        }

        this.img = new Image();
        var $this = this;
        this.img.onload = function() {
            $this.reset();
            if (cfg.onLoad) cfg.onLoad();
        }
        this.img.src = cfg.imageSrc;
        return this;
    };

    /*
     * Copy the image of a character from this Chargen into a given
     * drawing context.  x and y are canvas positions of the destination.
     */
    this.blitChar = function(charNum, charColor, ctx, x, y,
                             destWidth, destHeight) {
        destWidth = destWidth || this.charWidth;
        destHeight = destHeight || this.charHeight;
        var srcCharX = (charNum % this.charsPerRow) * this.charWidth;
        var srcCharY = Math.floor(charNum / this.charsPerRow) * this.charHeight;
        ctx.drawImage(this.bitmaps[charColor],
          /* source */ srcCharX, srcCharY, this.charWidth, this.charHeight,
          /* dest   */ x, y, destWidth, destHeight);
    };

    this.reset = function() {
        var ctx = this.bitmaps[0].getContext('2d');
        var w = this.img.width;
        var h = this.img.height;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(this.img, 0, 0, w, h);
        this._createChromaticBitmaps();
    };

    /*
     * Probably you will never need to call this directly.
     */
    this._createChromaticBitmaps = function() {
        var ctx = this.bitmaps[0].getContext('2d');
        var w = this.img.width;
        var h = this.img.height;
        var imageData = ctx.getImageData(0, 0, w, h);
        for (var color = 1; color < this.colorTriples.length; color++) {
            var newData = ctx.getImageData(0, 0, w, h);
            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    var index = (y * w + x) * 4;
                    //var red = imageData.data[index];
                    //var green = imageData.data[index + 1];
                    //var blue = imageData.data[index + 2];
                    var alpha = imageData.data[index + 3];
                    newData.data[index] = this.colorTriples[color][0];
                    newData.data[index + 1] = this.colorTriples[color][1];
                    newData.data[index + 2] = this.colorTriples[color][2];
                    newData.data[index + 3] = alpha;
                }
            }
            this.bitmaps[color].getContext('2d').putImageData(newData, 0, 0);
        }
    };

    this.modifyChar = function(charNum, bytes) {
        var w = this.charWidth;
        var h = this.charHeight;
        var srcCharX = (charNum % this.charsPerRow) * w;
        var srcCharY = Math.floor(charNum / this.charsPerRow) * h;
        var ctx = this.bitmaps[0].getContext('2d');
        var newData = ctx.createImageData(w, h);
        for (var y = 0; y < h; y++) {
            var byt = bytes[y];
            for (var x = w - 1; x >= 0; x--) {
                var index = (y * w + x) * 4;
                if (byt & 1 === 1) {
                    newData.data[index] = 0;
                    newData.data[index + 1] = 0;
                    newData.data[index + 2] = 0;
                    newData.data[index + 3] = 255;
                }
                byt >>= 1;
            }
        }
        ctx.clearRect(srcCharX, srcCharY, w, h);
        ctx.putImageData(newData, srcCharX, srcCharY);
        // FIXME this is such overkill!!!
        this._createChromaticBitmaps();
    };
};
