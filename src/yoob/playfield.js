/*
 * This file is part of yoob.js version 0.1
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A two-dimensional Cartesian grid of values.
 */
yoob.Playfield = function() {
    this._store = {};
    this.min_x = undefined;
    this.min_y = undefined;
    this.max_x = undefined;
    this.max_y = undefined;

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
        if (this.min_x === undefined || x < this.min_x) this.min_x = x;
        if (this.max_x === undefined || x > this.max_x) this.max_x = x;
        if (this.min_y === undefined || y < this.min_y) this.min_y = y;
        if (this.max_y === undefined || y > this.max_y) this.max_y = y;
        if (value === undefined) {
            delete this._store[x+','+y];
        }
        this._store[x+','+y] = value;
    };

    /*
     * Clear the contents of this Playfield.
     */
    this.clear = function() {
        this._store = {};
        this.min_x = undefined;
        this.min_y = undefined;
        this.max_x = undefined;
        this.max_y = undefined;
    };
          
    /*
     * Load a string into the playfield.
     * The string may be multiline, with newline (ASCII 10)
     * characters delimiting lines.  ASCII 13 is ignored.
     */
    this.load = function(x, y, string) {
        var lx = x;
        var ly = y;
        for (var i = 0; i < string.length; i++) {
            var c = string.charAt(i);
            if (c === '\n') {
                lx = x;
                ly++;
            } else if (c === ' ') {
                this.put(lx, ly, undefined);
                lx++;
            } else if (c === '\r') {
            } else {
                this.put(lx, ly, c);
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
        for (var y = this.min_y; y <= this.max_y; y++) {
            for (var x = this.min_x; x <= this.max_x; x++) {
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

    /*
     * Draws the Playfield, and a set of Cursors, on a canvas element.
     * Resizes the canvas to the needed dimensions.
     * cellWidth and cellHeight are canvas units of measure for each cell.
     */
    this.drawCanvas = function(canvas, cellWidth, cellHeight, cursors) {
        var ctx = canvas.getContext('2d');
      
        var width = this.max_x - this.min_x + 1;
        var height = this.max_y - this.min_y + 1;

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

        var offsetX = this.min_x * cellWidth * -1;
        var offsetY = this.min_y * cellHeight * -1;

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
