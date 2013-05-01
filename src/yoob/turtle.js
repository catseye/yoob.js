/*
 * This file is part of yoob.js version 0.5-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * requires yoob.Sprite and yoob.Path.
 *
 * I really haven't worked this out fully yet.
 * It could also have a velocity, and dx/dy = cos/sin(theta) * velocity.
 * moveBy is maybe useful enough to have in Sprite itself.
 */

yoob.Turtle = function() {

    this.init = function(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dx = 0;
        this.dy = 0;
        this.selected = false;
        this.theta = 0;
        this.trail = new yoob.PathSet().init();
        this.setPenDown(true);
    };

    this.setPenDown = function(penDown) {
        penDown = !!penDown;
        if (penDown === this.penDown) return;
        this.penDown = penDown;
        if (this.penDown) {
            this.trail.add(this.curPath);
            this.curPath = new yoob.Path().init();
            this.curPath.addPoint(this.getCenterX(), this.getCenterY());
        }
    };

    /* theta is in radians */
    this.setTheta = function(theta) {
        this.theta = theta;
        this.dx = Math.cos(theta);
        this.dy = Math.sin(theta);
    };

    /* dtheta is in radians */
    this.rotateBy = function(dtheta) {
        this.setTheta(this.theta + dtheta);
    };
    
    this.moveBy = function(units) {
        this.x += this.dx * units;
        this.y += this.dy * units;
        if (this.penDown) {
            this.curPath.addPoint(this.getCenterX(), this.getCenterY());
        }
    };

    this.draw = function(ctx) {
        var x = this.getCenterX();
        var y = this.getCenterY();
        var r = this.getWidth() / 2;
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.dx * r, y + this.dy * r);
        ctx.stroke();
    };

    this.drawTrail = function(ctx, cfg) {
        cfg = cfg || {
            strokeStyle: "black",
            lineWidth: 1
        };
        this.trail.drawOverride(ctx, cfg);
        this.curPath.drawOverride(ctx, cfg);
    };
};
yoob.Turtle.prototype = new yoob.Sprite();
