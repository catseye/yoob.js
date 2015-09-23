/*
 * This file is part of yoob.js version 0.11-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A (theoretically) unbounded tape, like you'd find on a Turing machine.
 *
 * It can also be used as a stack -- in this case, give it a single cursor
 * starting at x=0.  Note that the result of trying to use it both as a stack
 * and as a tape is currently undefined.
 *
 * TODO: recalculate bounds?
 */
yoob.Tape = function() {
    this.init = function(cfg) {
        cfg = cfg || {};
        this._default = cfg.defaultValue;
        this.cursors = cfg.cursors || [];
        this.clear();
        return this;
    };

    /*
     * Removes all values that have been written to the tape.
     */
    this.clear = function() {
        this._store = {};
        this.min = undefined;
        this.max = undefined;
        return this;
    };

    /*
     * Obtain the value at the given position.
     * Returns the tape's default value, if the position was never written to.
     */
    this.get = function(pos) {
        var val = this._store[pos];
        return val === undefined ? this._default : val;
    };

    /*
     * Write a new value into the given position.
     */
    this.put = function(pos, value) {
        if (value === this._default) {
            delete this._store[pos];
            // NOTE: this does not recalculate the bounds.
            return;
        }
        if (this.min === undefined || pos < this.min) this.min = pos;
        if (this.max === undefined || pos > this.max) this.max = pos;
        this._store[pos] = value;
    };

    this.size = function() {
        return this._top;
    };

    /*
     * Iterate over every cell on the Tape.
     * fun is a callback which takes two parameters:
     * position and value.  If this callback returns a value,
     * it is written into the Tape at that position.
     * This function iterates in a defined order: ascending.
     * The callback is not called for cells containing the
     * default value unless `dense: true` is given in the
     * configuration object.
     */
    this.foreach = function(fun, cfg) {
        cfg = cfg || {};
        var dense = !!cfg.dense;
        for (var pos = this.min; pos <= this.max; pos++) {
            var value = this._store[pos];
            if (value === undefined) {
                if (dense) {
                    value = this._default;
                } else {
                    continue;
                }
            }
            var result = fun(pos, value);
            if (result !== undefined) {
                this.put(pos, result);
            }
        }
    };

    this.getExtent = function() {
        return this.max - this.min + 1;
    };

    this.getCursoredExtent = function() {
        var max_ = this.max;
        var min_ = this.min;
        var i;
        for (i = 0; i < this.cursors.length; i++) {
            var x = this.cursors[i].getX();
            if (x > max_) max_ = x;
            if (x < min_) min_ = x;
        }
        return max_ - min_ + 1;
    };

    /*
     * Cursored read/write interface
     */
    this.read = function(index) {
        var cursor = this.cursors[index || 0];
        return this.get(cursor.getX());
    };

    this.write = function(value, index) {
        var cursor = this.cursors[index || 0];
        this.put(cursor.getX(), value);
        return this;
    };

    /*
     * Cursored stack interface.
     */
    this.push = function(value) {
        var cursor = this.cursors[0];
        this.put(cursor.getX(), value);  // updates bounds
        cursor.setX(cursor.getX() + 1);
        return this;
    };

    this.pop = function() {
        var cursor = this.cursors[0];
        var x = cursor.getX();
        if (x === 0) {
            return undefined;  // stack underflow
        }
        x--;
        cursor.setX(x);
        value = this.get(x);
        this.put(x, this._default);
        if (x === this.max) {  // which it really should be.  recalculate bounds
            this.max--;
            if (this.max < this.min) {
                this.max = undefined;
                this.min = undefined;
            }
        }
        return value;
    };

    this.peek = function() {
        var cursor = this.cursors[0];
        var x = cursor.getX();
        if (x === 0) {
            return undefined;  // empty stack
        }
        return this.get(x - 1);
    };

    this.getSize = function() {
        return this.max === undefined ? 0 : this.max + 1;
    };

};
