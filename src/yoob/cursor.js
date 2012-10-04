if (yoob === undefined) yoob = {};

yoob.Cursor = function(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;

    this.is_headed = function(dx, dy) {
        return this.dx === dx && this.dy === dy;
    }

    this.advance = function() {
        this.x += this.dx;
        this.y += this.dy;
    }

    this.rotate_clockwise = function() {
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
    }

    this.rotate_counterclockwise = function() {
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
    }
}
