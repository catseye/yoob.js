/*
 * This file is part of yoob.js version 0.5-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * requires yoob.Sprite.
 *
 * I really haven't worked this out fully yet.
 * It could also have a velocity, and dx/dy = cos/sin(theta) * velocity.
 * moveBy is maybe useful enough to have in Sprite itself.
 */

yoob.Turtle = function() {
    this.theta = 0;

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
};
yoob.Turtle.prototype = new yoob.Sprite();
