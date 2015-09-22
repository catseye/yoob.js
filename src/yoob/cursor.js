/*
 * This file is part of yoob.js version 0.11-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * An object representing a position and direction in some space.  The space
 * may be one-dimensional (a yoob.Tape, or a string representing a program
 * source) or a two-dimensional Cartesian space (such as a yoob.Playfield.)
 * A direction vector accompanies the position, so the cursor can "know which
 * way it's headed", but this facility need not be used.
 */
yoob.Cursor = function() {
    this.init = function(cfg) {
        cfg = cfg || {};
        this.setX(cfg.x || 0);
        this.setY(cfg.y || 0);
        this.setDx(cfg.dx || 0);
        this.setDy(cfg.dy || 0);
        return this;
    };

    this.clone = function() {
        return new yoob.Cursor().init(this.x, this.y, this.dx, this.dy);
    };

    /*** Chainable setters ***/

    this.setX = function(x) {
        this.x = x;
        return this;
    };

    this.setY = function(y) {
        this.y = y;
        return this;
    };

    this.setDx = function(dx) {
        this.dx = dx;
        return this;
    };

    this.setDy = function(dy) {
        this.dy = dy;
        return this;
    };

    /*** Accessors ***/

    this.getX = function() {
        return this.x;
    };

    this.getY = function() {
        return this.y;
    };

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

    this.rotateDegrees = function(degrees) {
        while (degrees > 0) {
            this.rotateCounterclockwise();
            degrees -= 45;
        }
    };

    /* from yoob.TapeHead; may go away or change slightly */
    this.move = function(delta) {
        this.x += delta;
    };

    this.moveLeft = function(amount) {
        if (amount === undefined) amount = 1;
        this.x -= amount;
    };

    this.moveRight = function(amount) {
        if (amount === undefined) amount = 1;
        this.x += amount;
    };

    this.read = function() {
        if (!this.tape) return undefined;
        return this.tape.get(this.x);
    };

    this.write = function(value) {
        if (!this.tape) return;
        this.tape.put(this.x, value);
    };
}
