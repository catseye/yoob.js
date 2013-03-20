/*
 * This file is part of yoob.js version 0.1
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * An object representing a pointer (position vector) into two-dimensional
 * Cartesian space (possibly a yoob.Playfield) with a direction vector
 * (that need not be used).
 */
yoob.Cursor = function(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;

    this.isHeaded = function(dx, dy) {
        return this.dx === dx && this.dy === dy;
    };

    this.advance = function() {
        this.x += this.dx;
        this.y += this.dy;
    };

    this.rotateClockwise = function() {
        if (this.dx === 0 && this.dy === -1) {
            this.dx = 1; this.dy = -1;
        } else if (this.dx === 1 && this.dy === -1) {
            this.dx = 1; this.dy = 0;
        } else if (this.dx === 1 && this.dy === 0) {
            this.dx = 1; this.dy = 1;
        } else if (this.dx === 1 && this.dy === 1) {
            this.dx = 0; this.dy = 1;
        } else if (this.dx === 0 && this.dy === 1) {
            this.dx = -1; this.dy = 1;
        } else if (this.dx === -1 && this.dy === 1) {
            this.dx = -1; this.dy = 0;
        } else if (this.dx === -1 && this.dy === 0) {
            this.dx = -1; this.dy = -1;
        } else if (this.dx === -1 && this.dy === -1) {
            this.dx = 0; this.dy = -1;
        }
    };

    this.rotateCounterclockwise = function() {
        if (this.dx === 0 && this.dy === -1) {
            this.dx = -1; this.dy = -1;
        } else if (this.dx === -1 && this.dy === -1) {
            this.dx = -1; this.dy = 0;
        } else if (this.dx === -1 && this.dy === 0) {
            this.dx = -1; this.dy = 1;
        } else if (this.dx === -1 && this.dy === 1) {
            this.dx = 0; this.dy = 1;
        } else if (this.dx === 0 && this.dy === 1) {
            this.dx = 1; this.dy = 1;
        } else if (this.dx === 1 && this.dy === 1) {
            this.dx = 1; this.dy = 0;
        } else if (this.dx === 1 && this.dy === 0) {
            this.dx = 1; this.dy = -1;
        } else if (this.dx === 1 && this.dy === -1) {
            this.dx = 0; this.dy = -1;
        }
    };

    this.drawContext = function(ctx, x, y, cellWidth, cellHeight) {
        ctx.fillStyle = "#50ff50";
        ctx.fillRect(x, y, cellWidth, cellHeight);
    };
}
