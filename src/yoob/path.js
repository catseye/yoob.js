/*
 * This file is part of yoob.js version 0.5
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
        cfg = cfg || {};
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

    // view methods follow

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

    /*
     * Values in the cfg object will be used if they are not specified on
     * the yoob.Line object.
     */
    this.draw = function(ctx, cfg) {
        cfg = cfg || {};
        this._draw(ctx,
            this.lineWidth || cfg.lineWidth,
            this.fillStyle || cfg.fillStyle,
            this.strokeStyle || cfg.strokeStyle,
            this.closed
        );
    };

    /*
     * Values in the cfg object will be used instead of the values on
     * the yoob.Line object.
     */
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

yoob.PathList = function() {
    this.init = function(paths) {
        this.paths = paths || [];
        return this;
    };

    this.toString = function() {
        var t = 'new yoob.PathList([';
        for (var i = 0; i < this.paths.length; i++) {
            t += this.paths[i].toString();
            if (i < this.paths.length - 1) {
                t += ', ';
            }
        }
        return t + '])';
    };

    this.add = function(path) {
        if (path !== undefined)
            this.paths.push(path);
    };

    this.clear = function(path) {
        this.paths = [];
    };

    /*
     * Values in the cfg object will be used when they are not specified on
     * a yoob.Line object.
     */
    this.draw = function(ctx, cfg) {
        for (var i = 0; i < this.paths.length; i++) {
            this.paths[i].draw(ctx, cfg);
        }
    };

    /*
     * Values in the cfg object will be used instead of the values on
     * a yoob.Line object.
     */
    this.drawOverride = function(ctx, cfg) {
        for (var i = 0; i < this.paths.length; i++) {
            this.paths[i].drawOverride(ctx, cfg);
        }
    };
};
