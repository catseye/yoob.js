/*
 * This file is part of yoob.js version 0.5-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * An abstraction of a path (a set of connected, two-dimensional points.)
 * Think of it as a model that also contains a nice default view (i.e.,
 * it knows how to draw itself into a 2d drawing context.)
 *
 * The interface is not entirely to my liking so may change.  (But you should
 * already know that because of the `0` before the `.` in the version.)
 */
yoob.Path = function(cfg) {
    this.init = function(cfg) {
        this.points = cfg.points || [];
        this.title = cfg.title;
        // if defined, the path will be filled with this style
        this.fillStyle = cfg.fillStyle;
        // if defined, the path will be stroked with this style
        this.strokeStyle = cfg.strokeStyle;
        this.lineWidth = cfg.lineWidth;
        this.closed = cfg.closed;
        return this;
    };

    /*
     * Returns a string representation of this yoob.Path, also suitable
     * for eval()'ing as Javascript.
     */
    this.toString = function() {
        var t = 'new yoob.Path({';
        if (this.title) t += 'title:"' + this.title + '",';
        if (this.fillStyle) t += 'fillStyle:"' + this.fillStyle + '",';
        if (this.strokeStyle) t += 'strokeStyle:"' + this.strokeStyle + '",';
        if (this.lineWidth) t += 'lineWidth:"' + this.lineWidth + '",';
        if (this.closed) t += 'closed:"' + this.closed + '",';
        t += '\n    points:[' + this.points + ']})';
        return t;
    };

    this.clone = function() {
        return new yoob.Path({
            points: this.points,
            title: this.title,
            fillStyle: this.fillStyle,
            strokeStyle: this.strokeStyle,
            lineWidth: this.lineWidth,
            closed: this.closed
        });
    };

    this.clear = function() {
        this.points = [];
    };

    this.addPoint = function(x, y) {
        this.points.push(x);
        this.points.push(y);
    };

    this.close = function() {
        this.closed = true;
    };

    this.foreachPoint = function(f) {
        if (this.points.length < 2) return;
        for (var i = 0; i < this.points.length; i += 2) {
            f(this.points[i], this.points[i+1]);
        }        
    };

    this.map = function(f) {
        var path = this.clone();
        path.clear();
        this.foreachPoint(function(x, y) {
            var newPoint = f(x, y);
            path.addPoint(newPoint[0], newPoint[1]);
        });
        return path;
    };

    this.mapWithJitter = function(jitter) {
        var r = function() {
            return Math.random() * jitter - (jitter / 2);
        };
        return this.map(function(x, y) {
            return [x + r(), y + r()];
        });
    };

    this.applyLine = function(ctx) {
        this.foreachPoint(function(x, y) {
            ctx.lineTo(x, y);
        });
    };

    this._draw = function(ctx, lineWidth, fillStyle, strokeStyle, closed) {
        ctx.beginPath();
        this.applyLine(ctx);
        if (closed) ctx.closePath();
        if (fillStyle) {
            ctx.fillStyle = fillStyle;
            ctx.fill();
        }
        if (strokeStyle) {
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }
    };

    this.draw = function(ctx, cfg) {
        cfg = cfg || {};
        this._draw(ctx,
            this.lineWidth || cfg.lineWidth,
            this.fillStyle || cfg.fillStyle,
            this.strokeStyle || cfg.strokeStyle,
            this.closed
        );
    };

    this.drawOverride = function(ctx, cfg) {
        cfg = cfg || {};
        this._draw(ctx,
            cfg.lineWidth,
            cfg.fillStyle,
            cfg.strokeStyle,
            this.closed
        );
    };

    this.init(cfg);
};
