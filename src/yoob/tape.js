/*
 * This file is part of yoob.js version 0.11-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A (theoretically) unbounded tape, like you'd find on a Turing machine.
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
        if (this.min === undefined || pos < this.min) this.min = pos;
        if (this.max === undefined || pos > this.max) this.max = pos;
        if (value === this._default) {
            delete this._store[pos];
        }
        this._store[pos] = value;
    };

    /*
     * Iterate over every defined cell on the Tape.
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
};
