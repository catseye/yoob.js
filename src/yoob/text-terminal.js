/*
 * This file is part of yoob.js version 0.4-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A text-based-console simulation in Javascript.  It is, in actuality, a
 * facade for a yoob.Playfield and a yoob.Cursor.  (And soon, perhaps, a
 * yoob.Playfield*View also.)
 *
 * The yoob.TextTerminal has no concern for display; in MVC terms it is a
 * "model" and you will need to use a "view" such as yoob.PlayfieldCanvasView
 * or yoob.PlayfieldHTMLView to display it.
 *
 * Create a new yoob.TextTerminal object t, then call t.init(80, 25), then call
 * t.write() to write text to the console.
 *
 * You can also call t.setColors() to set the text and background colors of
 * the next text to be written, between calls to t.write().  You can call
 * t.reset() to clear the simulated screen (to the selected backgroundColor.)
 *
 * Note there is no overStrike mode anymore.  But also, because the TextTerminal
 * is backed by a Playfield, you can read characters and colors at any position
 * on the console.  Also, cursor doesn't blink anymore; will be addressed.
 *
 * Note, this console is completely "dumb": it does not understand any
 * control codes whatsoever, not even newline.  For a subclass of this
 * which does understand (some) control codes, use text-terminal.js.
 */
yoob.TextTerminal = function() {
    
    // Inner Class
    var ConsoleCell = function() {        
        this.init = function(c, tc, bc) {
            this.character = c;
            this.textColor = tc;
            this.backgroundColor = bc;
            return this;
        };
        
        this.draw = function(ctx, x, y, cellWidth, cellHeight) {
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(x, y, cellWidth, cellHeight);
            ctx.fillStyle = this.textColor;
            ctx.fillText(this.character.toString(), x, y);
        };
    };

    this.pf = undefined;
    this.rows = undefined;
    this.cols = undefined;
    this.cursor = undefined;
    this.row = undefined;
    this.col = undefined;
    this.textColor = undefined;
    this.backgroundColor = undefined;

    this.init = function(cols, rows) {
        this.pf = new yoob.Playfield();
        this.defaultCell = new ConsoleCell().init(' ', 'green', 'black');
        this.pf.setDefault(this.defaultCell);
        this.cursor = new yoob.Cursor(0, 0, 1, 0);
        this.rows = rows;
        this.cols = cols;
        this.textColor = "green";
        this.backgroundColor = "black";
        this.reset();
        return this;
    };

    // convenience function
    this.createPlayfieldCanvasView = function(element, cellWidth, cellHeight) {
        var view = new yoob.PlayfieldCanvasView();
        view.init(this.getPlayfield(), element);
        view.setCursors([this.getCursor()]);
        view.setCellDimensions(cellWidth, cellHeight);
        var self = this;
        view.getLowerX = function() { return 0; };
        view.getLowerY = function() { return 0; };
        view.getUpperX = function() { return self.cols - 1; };
        view.getUpperY = function() { return self.rows - 1; };
        return view;
    };

    this.getPlayfield = function() {
        return this.pf;
    };

    this.getCursor = function() {
        return this.cursor;
    };

    this.setColors = function(textColor, backgroundColor) {
        if (textColor !== undefined) {
            this.textColor = textColor;
        }
        if (backgroundColor !== undefined) {
            this.backgroundColor = backgroundColor;
        }
        return this;
    };

    this.getCharAt = function(x, y) {
        return this.pf.get(x, y).character;
    };

    this.getTextColorAt = function(x, y) {
        return this.pf.get(x, y).textColor;
    };

    this.getBackgroundColorAt = function(x, y) {
        return this.pf.get(x, y).backgroundColor;
    };

    this.setCharAt = function(x, y, c) {
        this.pf.get(x, y).character = c;
        return this;
    };

    this.setTextColorAt = function(x, y, style) {
        this.pf.get(x, y).textColor = style;
        return this;
    };

    this.setBackgroundColorAt = function(x, y, style) {
        this.pf.get(x, y).backgroundColor = style;
        return this;
    };

    /*
     * Clear the TextTerminal to the current backgroundColor,
     * make the cursor visible(?), and home it.
     */
    this.reset = function() {
        this.cursor.x = 0;
        this.cursor.y = 0;
        this.pf.clear();
    };

    /*
     * Advance the cursor to the next row, scrolling the
     * TextTerminal display if necessary.
     */
    this.advanceRow = function() {
        this.cursor.x = 0;
        this.cursor.y += 1;
        while (this.cursor.y >= this.rows) {
            this.pf.scrollRectangleY(-1, 0, 0, this.cols-1, this.rows-1);
            this.pf.clearRectangle(0, this.rows-1, this.cols-1, this.rows-1);
            this.cursor.y -= 1;
        }
    };

    /*
     * Advance the cursor to the next column, advancing to the
     * next row if necessary.
     */
    this.advanceCol = function() {
        this.cursor.x += 1;
        if (this.cursor.x >= this.cols) {
            this.advanceRow();
        }
    };

    /*
     * Write a character to the console.  Control characters are not heeded.
     */
    this.writeChar = function(c) {
        this.pf.put(
            this.cursor.x, this.cursor.y,
            new ConsoleCell().init(c, this.textColor, this.backgroundColor)
        );
        this.advanceCol();
    };

    /*
     * Write a string to the TextTerminal.  Control characters are not heeded.
     */
    this.writeRaw = function(string) {
        for (var i = 0; i < string.length; i++) {
            this.writeChar(string.charAt(i));
        };
    };

    /*
     * Write a string to the TextTerminal.  Basic control characters are
     * heeded: backspace moves the cursor one position to the left (but
     * does not overwrite the character there; and it has no effect if
     * the cursor is already in column 0) and LF causes the cursor to
     * move to column 0 on the next line.
     */
    this.write = function(string) {
        for (var i = 0; i < string.length; i++) {
            var c = string.charAt(i);
            if (c === '\n') {
                this.advanceRow();
            } else if (c === '\b' && this.getCursor().x > 0) {
                this.getCursor().x--;
            } else {
                this.writeChar(c);
            }
        }
    };

    /*
     * Move the cursor around the TextTerminal.  x is the column number
     * (0-based) and y is the row number (also 0-based.)
     */
    this.gotoxy = function(x, y) {
        this.cursor.x = x;
        this.cursor.y = y;
    };
};
