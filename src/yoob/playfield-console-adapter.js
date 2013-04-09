/*
 * This file is part of yoob.js version 0.4-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

yoob.ConsoleCell = function() {
    this.character = ' ';
    this.textColor = "green";
    this.backgroundColor = "black";
    
    this.draw = function(ctx, x, y, cellWidth, cellHeight) {
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(x, y, cellWidth, cellHeight);
        ctx.fillStyle = this.textColor;
        ctx.fillText(this.character.toString(), x, y);
    };
};

/*
 * A temporary class, supporting the interface of yoob.TextConsole,
 * but based on a yoob.Playfield and yoob.Cursor, and no concern of
 * display (use a yoob.Playfield(Canvas|HTML)View for that.)
 *
 * Requires yoob.Cursor.
 * Requires yoob.Playfield.
 */
yoob.PlayfieldConsoleAdapter = function() {
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
        this.defaultCell = new yoob.ConsoleCell();
        this.pf.setDefault(this.defaultCell);
        this.cursor = new yoob.Cursor(0, 0, 1, 0);
        this.rows = rows;
        this.cols = cols;        
        this.textColor = "green";
        this.backgroundColor = "black";
        this.reset();
        return this;
    };

    this.getPlayfield = function() {
        return this.pf;
    };

    this.setTextColor = function(textColor, backgroundColor) {
        if (textColor !== undefined) {
            this.textColor = textColor;
        }
        if (backgroundColor !== undefined) {
            this.backgroundColor = backgroundColor;
        }
    };

    this.getTextColorAt = function(x, y) {
        return this.pf.get(x, y).textColor;
    };

    this.getBackgroundColorAt = function(x, y) {
        return this.pf.get(x, y).backgroundColor;
    };

    this.setTextColorAt = function(x, y, style) {
        this.pf.get(x, y).textColor = style;
    };

    this.setBackgroundColorAt = function(x, y, style) {
        this.pf.get(x, y).backgroundColor = style;
    };

    /*
     * Clear the TextConsole to the current backgroundColor, turn off
     * overstrike mode, make the cursor visible, and home it.
     */
    this.reset = function() {
        this.overStrike = false;
        this.cursor.x = 0;
        this.cursor.y = 0;
        this.pf.clear();
    };

    /*
     * Advance the cursor to the next row, scrolling the
     * TextConsole display if necessary.
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
     * Called when a character is written to the console.  This
     * may be overridden by subclasses.  If it returns false, the
     * character is written with the default logic.  If it returns
     * true, it is not, and neither is the cursor advanced.  (A
     * subclass which overrides this may write the character and/or
     * advance the cursor itself.
     */
    this.onWriteChar = function(character, ctx) {
        return false;
    };

    /*
     * Write a character to the console.
     */
    this.writeChar = function(c) {
        if (this.onWriteChar(c))
            return;
        var cc = new yoob.ConsoleCell();
        cc.character = c;
        cc.textColor = this.textColor;
        cc.backgroundColor = this.backgroundColor;
        this.pf.put(this.cursor.x, this.cursor.y, cc);
        this.advanceCol();
    };

    /*
     * Write a string to the TextConsole.  Control characters are not heeded.
     */
    this.write = function(string) {
        for (var i = 0; i < string.length; i++) {
            this.writeChar(string.charAt(i));
        };
    };

    /*
     * Move the cursor around the TextConsole.  x is the column number
     * (0-based) and y is the row number (also 0-based.)
     */
    this.gotoxy = function(x, y) {
        this.cursor.x = x;
        this.cursor.y = y;
    };

    /*
     * Make the cursor visible (true) or invisible (false).
     */
    this.enableCursor = function(b) {
        // nothing now
    };
};
