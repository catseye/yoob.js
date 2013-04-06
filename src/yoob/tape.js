/*
 * This file is part of yoob.js version 0.3
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A (theoretically) unbounded tape, like you'd find on a Turing machine.
 */
yoob.Tape = function() {
    this._store = {};
    this.min = undefined;
    this.max = undefined;

    /*
     * Obtain the value at the given position.
     * Cells are undefined if they were never written to.
     */
    this.get = function(pos) {
        return this._store[pos];
    };

    /*
     * Write a new value into the given position.
     */
    this.put = function(pos, value) {
        if (this.min === undefined || pos < this.min) this.min = pos;
        if (this.max === undefined || pos > this.max) this.max = pos;
        if (value === undefined) {
            delete this._store[pos];
        }
        this._store[pos] = value;
    };

    /*
     * Iterate over every defined cell on the Tape
     * fun is a callback which takes two parameters:
     * position and value.  If this callback returns a value,
     * it is written into the Tape at that position.
     * This function ensures a particular order.
     */
    this.foreach = function(fun) {
        for (var pos = this.min; pos <= this.max; pos++) {
            var value = this._store[pos];
            if (value === undefined)
                continue;
            var result = fun(pos, value);
            if (result !== undefined) {
                if (result === ' ') {
                    result = undefined;
                }
                this.put(pos, result);
            }
        }
    };

    /*
     * Draws elements of the Tape in a drawing context.
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
     * Draws the Tape in a drawing context.
     * cellWidth and cellHeight are canvas units of measure for each cell.
     */
    this.drawContext = function(ctx, offsetX, offsetY, cellWidth, cellHeight) {
        var me = this;
        this.foreach(function (pos, elem) {
            me.drawElement(ctx, offsetX + pos * cellWidth, offsetY,
                           cellWidth, cellHeight, elem);
        });
    };

    /*
     * Draws the Tape, and a set of TapeHeads, on a canvas element.
     * Resizes the canvas to the needed dimensions.
     * cellWidth and cellHeight are canvas units of measure for each cell.
     */
    this.drawCanvas = function(canvas, cellWidth, cellHeight, heads) {
        var ctx = canvas.getContext('2d');

        var width = this.max - this.min + 1;
        var height = 1;

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

        var offsetX = this.min * cellWidth * -1;
        var offsetY = 0;

        for (var i = 0; i < heads.length; i++) {
            heads[i].drawContext(
              ctx,
              offsetX + heads[i].pos * cellWidth, offsetY,
              cellWidth, cellHeight
            );
        }

        this.drawContext(ctx, offsetX, offsetY, cellWidth, cellHeight);
    };

};
