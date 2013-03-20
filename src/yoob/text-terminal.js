/*
 * This file is part of yoob.js version 0.1
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A text-based terminal simulation in Javascript on an HTML5 canvas.
 *
 * This module requires text-console.js be included first.
 */
yoob.TextTerminal = function() {
  this.onWriteChar = function(c, ctx) {
    if (c === '\n') {
      this.advanceRow();
      return true;
    } else if (c === '\b' && this.col > 0) {
      this.col--;
      return true;
    }
    return false;
  };
};
yoob.TextTerminal.prototype = new yoob.TextConsole();
