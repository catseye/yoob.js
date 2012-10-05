if (window.yoob === undefined) yoob = {};

/*
 * A (theoretically) unbounded tape, like you'd find on a Turing machine.
 */
yoob.Tape = function() {
    this._store = {};
    this.min = undefined;
    this.max = undefined;

    /*
     * Obtain the value at the given position.
     * Cells are undefined if they were never written to.
     */
    this.get = function(pos) {
        return this._store[pos];
    }

    /*
     * Write a new value into the given position.
     */
    this.put = function(pos, value) {
        if (this.min === undefined || pos < this.min) this.min = pos;
        if (this.max === undefined || pos > this.max) this.max = pos;
        /* TODO: if value === undefined { del this._store[x+','+y]; } */
        this._store[pos] = value;
    }
}
