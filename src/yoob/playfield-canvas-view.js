/*
 * This file is part of yoob.js version 0.11-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A view (in the MVC sense) for depicting a yoob.Playfield (-compatible)
 * object on an HTML5 <canvas> element (or compatible object).
 *
 * TODO: don't necesarily resize canvas each time?
 */
yoob.PlayfieldCanvasView = function() {
    this.init = function(cfg) {
        this.pf = cfg.playfield;
        this.canvas = cfg.canvas;
        this.ctx = canvas.getContext('2d');
        this.cursors = cfg.cursors || [];
        this.fixedPosition = !!cfg.fixedPosition;
        this.fixedSizeCanvas = !!cfg.fixedSizeCanvas;
        this.drawCursorsFirst = (cfg.drawCursorsFirst === undefined) ? true : !!cfg.drawCursorsFirst;
        this.setCellDimensions(cfg.cellWidth || 8, cfg.cellHeight || 8);
        return this;
    };

    /*** Chainable setters ***/

    this.setPlayfield = function(pf) {
        this.pf = pf;
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
     * Draws cells of the Playfield in a drawing context.
     * cellWidth and cellHeight are canvas units of measure.
     *
     * The default implementation tries to call a .draw() method on the cell's
     * value, if one exists, and just renders it as text, in black, if not.
     *
     * Override if you wish to draw elements in some other way.
     */
    this.drawCell = function(ctx, value, playfieldX, playfieldY,
                             canvasX, canvasY, cellWidth, cellHeight) {
        if (value.draw !== undefined) {
            value.draw(ctx, playfieldX, playfieldY, canvasX, canvasY,
                       cellWidth, cellHeight);
        } else {
            ctx.fillStyle = "black";
            ctx.fillText(value.toString(), canvasX, canvasY);
        }
    };

    /*
     * Draws the Playfield in a drawing context.
     * cellWidth and cellHeight are canvas units of measure for each cell.
     * offsetX and offsetY are canvas units of measure for the top-left
     *   of the entire playfield.
     */
    this.drawContext = function(ctx, offsetX, offsetY, cellWidth, cellHeight) {
        var $this = this;
        this.pf.foreach(function (x, y, value) {
            $this.drawCell(ctx, value, x, y,
                          offsetX + x * cellWidth, offsetY + y * cellHeight,
                          cellWidth, cellHeight);
        });
    };

    this.drawCursors = function(ctx, offsetX, offsetY, cellWidth, cellHeight) {
        var cursors = this.pf.cursors;
        for (var i = 0; i < cursors.length; i++) {
            cursors[i].drawContext(
              ctx,
              offsetX + cursors[i].x * cellWidth,
              offsetY + cursors[i].y * cellHeight,
              cellWidth, cellHeight
            );
        }
    };

    /*
     * Draw the Playfield, and its set of Cursors, on the canvas element.
     * Resizes the canvas to the needed dimensions first.
     */
    this.draw = function() {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        var cellWidth = this.cellWidth;
        var cellHeight = this.cellHeight;

        var width = this.pf.getCursoredExtentX();
        var height = this.pf.getCursoredExtentY();

        canvas.width = width * cellWidth;
        canvas.height = height * cellHeight;

        this.ctx.textBaseline = "top";
        this.ctx.font = cellHeight + "px monospace";

        var offsetX = 0;
        var offsetY = 0;

        if (!this.fixedPosition) {
            offsetX = (this.pf.getLowerX() || 0) * cellWidth * -1;
            offsetY = (this.pf.getLowerY() || 0) * cellHeight * -1;
        }

        if (this.drawCursorsFirst) {
            this.drawCursors(ctx, offsetX, offsetY, cellWidth, cellHeight);
        }

        this.drawContext(ctx, offsetX, offsetY, cellWidth, cellHeight);
        
        if (!this.drawCursorsFirst) {
            this.drawCursors(ctx, offsetX, offsetY, cellWidth, cellHeight);
        }
    };

};
