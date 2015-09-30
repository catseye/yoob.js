/*
 * This file is part of yoob.js version 0.11
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A view (in the MVC sense) for depicting a yoob.Tape (-compatible)
 * object on an HTML5 <canvas> element (or compatible object).
 *
 * drawCursorsFirst defaults to true.  This produces the pleasing visual
 * effect of the cursor being behind the cell values, but only if the cell values
 * themselves have transparent areas (e.g. if they're glyphs in some font.)
 * If the cell values are solid and fill the entire cell, drawCursorsFirst: false
 * may be in order.
 */
yoob.TapeCanvasView = function() {
    this.init = function(cfg) {
        this.tape = cfg.tape;
        this.canvas = cfg.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.fixedPosition = !!cfg.fixedPosition;
        this.fixedSizeCanvas = !!cfg.fixedSizeCanvas;
        this.drawCursorsFirst = (cfg.drawCursorsFirst === undefined) ? true : !!cfg.drawCursorsFirst;
        this.setCellDimensions(cfg.cellWidth || 8, cfg.cellHeight || 8);
        return this;
    };

    /*** Chainable setters ***/

    this.setTape = function(tape) {
        this.tape = tape;
        return this;
    };

    this.setCanvas = function(element) {
        this.canvas = element;
        this.ctx = this.canvas.getContext('2d');
        return this;
    };

    /*
     * Set the displayed dimensions of every cell.
     * cellWidth and cellHeight are canvas units of measure for each cell.
     * If cellWidth is undefined, the width of a character in the monospace
     * font of cellHeight pixels is used.
     */
    this.setCellDimensions = function(cellWidth, cellHeight) {
        this.ctx.textBaseline = "top";
        this.ctx.font = cellHeight + "px monospace";

        if (cellWidth === undefined) {
            cellWidth = this.ctx.measureText("@").width;
        }

        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        return this;
    };

    /*
     * Draws cells of the Tape in a drawing context.
     * cellWidth and cellHeight are canvas units of measure.
     *
     * The default implementation tries to call a .draw() method on the cell's
     * value, if one exists, and just renders it as text, in black, if not.
     *
     * Override if you wish to draw elements in some other way.
     */
    this.drawCell = function(ctx, value, pos,
                             canvasX, canvasY, cellWidth, cellHeight) {
        if (value.draw !== undefined) {
            value.draw(ctx, pos, canvasX, canvasY,
                       cellWidth, cellHeight);
        } else {
            ctx.fillStyle = "black";
            ctx.fillText(value.toString(), canvasX, canvasY);
        }
    };

    /*
     * Draws the Tape in a drawing context.
     * cellWidth and cellHeight are canvas units of measure for each cell.
     * offsetX and offsetY are canvas units of measure for the top-left
     *   of the entire playfield.
     */
    this.drawContext = function(ctx, offsetX, offsetY, cellWidth, cellHeight) {
        var $this = this;
        this.tape.foreach(function (pos, value) {
            $this.drawCell(ctx, value, pos,
                          offsetX + pos * cellWidth, offsetY,
                          cellWidth, cellHeight);
        });
    };

    /*
     * Override if you like.
     */
    this.drawCursor = function(ctx, cursor, canvasX, canvasY, cellWidth, cellHeight) {
        ctx.fillStyle = this.cursorFillStyle || "#50ff50";
        ctx.fillRect(canvasX, canvasY, cellWidth, cellHeight);
    };

    this.drawCursors = function(ctx, offsetX, offsetY, cellWidth, cellHeight) {
        var cursors = this.tape.cursors;
        for (var i = 0; i < cursors.length; i++) {
            var cursor = cursors[i];
            this.drawCursor(ctx, cursor,
                            offsetX + cursor.getX() * cellWidth, offsetY,
                            cellWidth, cellHeight);
        }
    };

    /*
     * Draw the Tape, and its set of Cursors, on the canvas element.
     * Resizes the canvas to the needed dimensions first.
     */
    this.draw = function() {
        var canvas = this.canvas;
        var cellWidth = this.cellWidth;
        var cellHeight = this.cellHeight;

        var width = this.tape.getCursoredExtent();
        var height = 1;

        canvas.width = width * cellWidth;
        canvas.height = height * cellHeight;
        this.ctx = canvas.getContext('2d');
        var ctx = this.ctx;

        ctx.textBaseline = "top";
        ctx.font = cellHeight + "px monospace";

        if (cellWidth === undefined) {
            cellWidth = ctx.measureText("@").width;
        }

        var offsetX = 0; // this.min * cellWidth * -1;
        var offsetY = 0;

        /*
        if (!this.fixedPosition) {
            offsetX = (this.pf.getLowerX() || 0) * cellWidth * -1;
            offsetY = (this.pf.getLowerY() || 0) * cellHeight * -1;
        }
        */

        if (this.drawCursorsFirst) {
            this.drawCursors(ctx, offsetX, offsetY, cellWidth, cellHeight);
        }

        this.drawContext(ctx, offsetX, offsetY, cellWidth, cellHeight);
        
        if (!this.drawCursorsFirst) {
            this.drawCursors(ctx, offsetX, offsetY, cellWidth, cellHeight);
        }
    };
};
