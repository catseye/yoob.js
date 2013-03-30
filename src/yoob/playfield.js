/*
 * This file is part of yoob.js version 0.2-PRE
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A two-dimensional Cartesian grid of values.
 */
yoob.Playfield = function() {
    this._store = {};
    this.minX = undefined;
    this.minY = undefined;
    this.maxX = undefined;
    this.maxY = undefined;

    /*
     * Obtain the value at (x, y).
     * Cells are undefined if they were never written to.
     */
    this.get = function(x, y) {
        return this._store[x+','+y];
    };

    /*
     * Write a new value into (x, y).
     */
    this.put = function(x, y, value) {
        if (this.minX === undefined || x < this.minX) this.minX = x;
        if (this.maxX === undefined || x > this.maxX) this.maxX = x;
        if (this.minY === undefined || y < this.minY) this.minY = y;
        if (this.maxY === undefined || y > this.maxY) this.maxY = y;
        var key = x+','+y;
        if (value === undefined) {
            delete this._store[key];
        }
        this._store[key] = value;
    };

    /*
     * Clear the contents of this Playfield.
     */
    this.clear = function() {
        this._store = {};
        this.minX = undefined;
        this.minY = undefined;
        this.maxX = undefined;
        this.maxX = undefined;
    };

    /*
     * Load a string into the playfield.
     * The string may be multiline, with newline (ASCII 10)
     * characters delimiting lines.  ASCII 13 is ignored.
     *
     * If transformer is given, it should be a one-argument
     * function which accepts a character and returns the
     * object you wish to write into the playfield upon reading
     * that character.
     */
    this.load = function(x, y, string, transformer) {
        var lx = x;
        var ly = y;
        if (transformer === undefined) {
            transformer = function(c) {
                if (c === ' ') {
                    return undefined;
                } else {
                    return c;
                }
            }
        }
        for (var i = 0; i < string.length; i++) {
            var c = string.charAt(i);
            if (c === '\n') {
                lx = x;
                ly++;
            } else if (c === '\r') {
            } else {
                this.put(lx, ly, transformer(c));
                lx++;
            }
        }
    };

    /*
     * Iterate over every defined cell in the Playfield.
     * fun is a callback which takes three parameters:
     * x, y, and value.  If this callback returns a value,
     * it is written into the Playfield at that position.
     * This function ensures a particular order.
     */
    this.foreach = function(fun) {
        for (var y = this.minY; y <= this.maxY; y++) {
            for (var x = this.minX; x <= this.maxX; x++) {
                var key = x+','+y;
                var value = this._store[key];
                if (value === undefined)
                    continue;
                var result = fun(x, y, value);
                if (result !== undefined) {
                    if (result === ' ') {
                        result = undefined;
                    }
                    this.put(x, y, result);
                }
            }
        }
    };

    /*
     * Draws elements of the Playfield in a drawing context.
     * x and y are canvas coordinates, and width and height
     * are canvas units of measure.
     * The default implementation just renders them as text,
     * in black.
     * Override if you wish to draw them differently.
     */
    this.drawElement = function(ctx, x, y, cellWidth, cellHeight, elem) {
        ctx.fillStyle = "black";
        ctx.fillText(elem.toString(), x, y);
    };

    /*
     * Draws the Playfield in a drawing context.
     * cellWidth and cellHeight are canvas units of measure for each cell.
     */
    this.drawContext = function(ctx, offsetX, offsetY, cellWidth, cellHeight) {
        var me = this;
        this.foreach(function (x, y, elem) {
            me.drawElement(ctx, offsetX + x * cellWidth, offsetY + y * cellHeight,
                           cellWidth, cellHeight, elem);
        });
    };

    this.getExtentX = function() {
        if (this.maxX === undefined || this.minX === undefined) {
            return 0;
        } else {
            return this.maxX - this.minX + 1;
        }
    };

    this.getExtentY = function() {
        if (this.maxY === undefined || this.minY === undefined) {
            return 0;
        } else {
            return this.maxY - this.minY + 1;
        }
    };

    /*
     * Draws the Playfield, and a set of Cursors, on a canvas element.
     * Resizes the canvas to the needed dimensions.
     * cellWidth and cellHeight are canvas units of measure for each cell.
     */
    this.drawCanvas = function(canvas, cellWidth, cellHeight, cursors) {
        var ctx = canvas.getContext('2d');
      
        var width = this.getExtentX();
        var height = this.getExtentY();

        if (cellWidth === undefined) {
            ctx.textBaseline = "top";
            ctx.font = cellHeight + "px monospace";
            cellWidth = ctx.measureText("@").width;
        }

        canvas.width = width * cellWidth;
        canvas.height = height * cellHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.textBaseline = "top";
        ctx.font = cellHeight + "px monospace";

        var offsetX = this.minX * cellWidth * -1;
        var offsetY = this.minY * cellHeight * -1;

        for (var i = 0; i < cursors.length; i++) {
            cursors[i].drawContext(
              ctx,
              cursors[i].x * cellWidth, cursors[i].y * cellHeight,
              cellWidth, cellHeight
            );
        }

        this.drawContext(ctx, offsetX, offsetY, cellWidth, cellHeight);
    };

};
