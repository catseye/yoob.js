if (window.yoob === undefined) yoob = {};

/*
 * An object representing a location on a Tape.
 */
yoob.TapeHead = function(tape, pos) {
    this.tape = tape;
    this.pos = pos;

    this.move = function(delta) {
        this.pos += delta;
    };

    this.moveLeft = function(amount) {
        if (amount === undefined) amount = 1;
        this.pos -= amount;
    };

    this.moveRight = function(amount) {
        if (amount === undefined) amount = 1;
        this.pos += amount;
    };

    this.read = function() {
        if (this.tape === undefined) return undefined;
        return this.tape.get(this.pos);
    };

    this.write = function(value) {
        if (this.tape === undefined) return;
        this.tape.put(this.pos, value);
    };

    this.drawContext = function(ctx, x, y, cellWidth, cellHeight) {
        ctx.fillStyle = "#50ff50";
        ctx.fillRect(x, y, cellWidth, cellHeight);
    };
}
