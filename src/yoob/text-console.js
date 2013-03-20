/*
 * This file is part of yoob.js version 0.1
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A text-based console simulation in Javascript on an HTML5 canvas.
 *
 * Note that I am not suggesting that this is a *good* thing in most
 * circumstances.  I mean, you have a GUI!  You have graphics!  Why would
 * you want to limit your interaction to a text-based console?  And you
 * can't even select text in it, and if you want to handle input you'll
 * have to write a bunch of stuff to do line editing and everything.
 *
 * But still, sometimes, for art's sake, what you want to do is
 * simulate a text-based console.  So be it.  You can use this.
 *
 * Create a new TextConsole object t, then call t.init(), then call
 * t.write() to write text to the console.
 *
 * You can also change the textColor and backgroundColor attributes
 * between calls to t.write().  You can call t.reset() to clear the
 * simulated screen (to the selected backgroundColor.)  You can also set
 * or clear overStrike mode.
 *
 * Note, this console is completely "dumb": it does not understand any
 * control codes whatsoever, not even newline.  For a subclass of this
 * which does understand (some) control codes, use text-terminal.js.
 */
yoob.TextConsole = function() {
  this.canvas = undefined;
  this.charHeight = undefined;
  this.charWidth = undefined;
  this.rows = undefined;
  this.cols = undefined;
  this.row = undefined;
  this.col = undefined;
  this.overStrike = undefined;
  this.textColor = undefined;
  this.backgroundColor = undefined;

  this.cursorEnabled = undefined;  
  this.blinkInterval = undefined;
  this.cursorIsShowing = undefined;

  /*
   * Attach a canvas to this TextConsole.  The canvas will
   * be resized to match the given dimensions.
   */
  this.init = function(canvas, charHeight, cols, rows) {
    this.canvas = canvas;
    this.charHeight = charHeight;
    this.rows = rows;
    this.cols = cols;

    var ctx = this.canvas.getContext('2d');
    ctx.font = this.charHeight + "px monospace";
    this.charWidth = ctx.measureText("@").width;

    this.textColor = "green";
    this.backgroundColor = "black";
    this.reset();
  };

  this.drawCursor = function(sty) {
    var ctx = this.canvas.getContext('2d');
    ctx.strokeStyle = sty;
    ctx.lineWidth = 2;
    var x = this.col * this.charWidth;
    var y = (this.row+1) * this.charHeight - 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + this.charWidth, y);
    ctx.stroke();
  };

  /*
   * Start the cursor blinking, if it's not already.
   */
  this._startCursor = function() {
    if (!this.cursorEnabled) {
      return;
    }
    if (this.blinkInterval !== undefined) {
      clearInterval(this.blinkInterval);
    }
    this.drawCursor(this.textColor);
    this.cursorIsShowing = true;
    var me = this;
    this.blinkInterval = setInterval(function() {
      if (!me.cursorIsShowing) {
        me.drawCursor(me.textColor);
        me.cursorIsShowing = true;
      } else {
        me.drawCursor(me.backgroundColor);
        me.cursorIsShowing = false;
      }
    }, 500);
  };

  /*
   * Start the cursor blinking, if it's not already.
   */
  this._stopCursor = function() {
    if (!this.cursorEnabled) {
      return;
    }
    if (this.blinkInterval !== undefined) {
      clearInterval(this.blinkInterval);
      this.blinkInterval = undefined;
    }
    this.drawCursor(this.backgroundColor);
    this.cursorIsShowing = false;
  };

  /*
   * Resize the TextConsole to match the given dimensions,
   * clear it to the current backgroundColor, turn off
   * overstrike mode, make the cursor visible, and home it.
   */
  this.reset = function() {
    this.overStrike = false;
    this.row = 0;
    this.col = 0;
    this.canvas.width = this.charWidth * this.cols;
    this.canvas.height = this.charHeight * this.rows;
    var ctx = this.canvas.getContext('2d');
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.cursorEnabled = true;
    this._startCursor();
  };

  /*
   * Advance the cursor to the next row, scrolling the
   * TextConsole display if necessary.
   */
  this.advanceRow = function() {
    this._stopCursor();
    this.col = 0;
    this.row += 1;
    var ctx = this.canvas.getContext('2d');
    while (this.row >= this.rows) {
      var imgData = ctx.getImageData(
          0, this.charHeight, canvas.width, canvas.height - this.charHeight
      );
      ctx.putImageData(imgData, 0, 0);
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(
          0, canvas.height - this.charHeight, canvas.width, this.charHeight
      );
      this.row -= 1;
    }
    this._startCursor();
  };

  /*
   * Advance the cursor to the next column, advancing to the
   * next row if necessary.
   */
  this.advanceCol = function() {
    this._stopCursor();
    this.col += 1;
    if (this.col >= this.cols) {
      this.advanceRow();
    }
    this._startCursor();
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
    // Inefficient!
    var ctx = this.canvas.getContext('2d');
    ctx.textBaseline = "top";
    ctx.font = this.charHeight + "px monospace";
    ctx.fillStyle = this.textColor;

    if (this.onWriteChar(c))
      return;
    if (c >= ' ') {  // && c != DEL ?
      ctx.fillText(c, this.col * this.charWidth, this.row * this.charHeight);
      this.advanceCol();
    }
  };

  /*
   * Write a string to the TextConsole.  Control characters are not heeded.
   */
  this.write = function(string) {
    var i = 0;
    var ctx = this.canvas.getContext('2d');
    ctx.textBaseline = "top";
    ctx.font = this.charHeight + "px monospace";
    this._stopCursor();
    while (i < string.length) {
      var c = string.charAt(i);
      if (!this.overStrike) {
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.col * this.charWidth, this.row * this.charHeight,
                     this.charWidth, this.charHeight);
      }
      this.writeChar(c);
      i++;
    };
    this._startCursor();
  };

  /*
   * Move the cursor around the TextConsole.  x is the column number
   * (0-based) and y is the row number (also 0-based.)
   */
  this.gotoxy = function(x, y) {
    this._stopCursor();
    this.col = x;
    this.row = y;
    this._startCursor();
  };

  /*
   * Make the cursor visible (true) or invisible (false).
   */
  this.enableCursor = function(b) {
    b = !!b;
    if (b) {
      this.cursorEnabled = true;
      this._startCursor();
    } else {
      this._stopCursor();
      this.cursorEnabled = false;
    }
  };
};
