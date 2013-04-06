/*
 * This file is part of yoob.js version 0.4-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A view (in the MVC sense) for depicting a yoob.Playfield (-compatible)
 * object on an HTML5 <canvas> element (or compatible object).
 */
yoob.PlayfieldCanvasView = function() {
    this.pf = undefined;
    this.canvas = undefined;
    this.ctx = undefined;

    this.init = function(pf, canvas) {
        this.pf = pf;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
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
     * offsetX and offsetY are canvas units of measure for the playfield.
     */
    this.drawContext = function(ctx, offsetX, offsetY, cellWidth, cellHeight) {
        var self = this;
        this.pf.foreach(function (x, y, elem) {
            self.drawElement(ctx, offsetX + x * cellWidth, offsetY + y * cellHeight,
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
      
        var width = this.pf.getExtentX();
        var height = this.pf.getExtentY();

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

        var offsetX = this.pf.getMinX() * cellWidth * -1;
        var offsetY = this.pf.getMinY() * cellHeight * -1;

        for (var i = 0; i < cursors.length; i++) {
            cursors[i].drawContext(
              ctx,
              offsetX + cursors[i].x * cellWidth,
              offsetY + cursors[i].y * cellHeight,
              cellWidth, cellHeight
            );
        }

        this.drawContext(ctx, offsetX, offsetY, cellWidth, cellHeight);
    };

};
