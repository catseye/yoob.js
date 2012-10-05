if (window.yoob === undefined) yoob = {};

/*
 * Object that captures keystrokes and accumulates a string from them.
 * Optionally also updates a TextConsole.
 * Mostly for demonstration purposes so far.
 */
yoob.LineInputBuffer = function() {
  this.listenObject = undefined;
  this.console = undefined;
  this.callback = undefined;
  this.text = undefined;

  this.init = function(listenObject, console, callback) {
    this.listenObject = listenObject;
    this.console = console;
    this.callback = callback;
    this.text = "";
    
    me = this;
    listenObject.addEventListener('keyup', function(e) {
      //alert(e.keyCode);
      switch (e.keyCode) {
        case 8:   /* Backspace */
          if (me.console !== undefined) {
            me.console.write('\b \b');
          }
          if (me.text.length > 0) {
            me.text = me.text.substring(0, me.text.length-2);
          }
          e.cancelBubble = true;
          break;
        case 13:  /* Enter */
          if (me.console !== undefined) {
            me.console.write('\n');
          }
          me.text = me.text.substring(0, me.text.length-1);
          if (me.callback !== undefined) {
            me.callback(me.text);
          }
          me.text = "";
          e.cancelBubble = true;
          break;
        case 38:  /* Up arrow */
          break;
        case 40:  /* Down arrow */
          break;
        case 37:  /* Left arrow */
          break;
        case 39:  /* Right arrow */
          break;
      }
    }, true);
    /* TODO support on more browsers, with keyup */
    listenObject.addEventListener('keypress', function(e) {
      if (e.altKey) {
        //alert(e.charCode);
        return;
      }
      var chr = String.fromCharCode(e.charCode);
      if (me.console !== undefined) {
        me.console.write(chr);
      }
      me.text += chr;
      e.cancelBubble = true;
    }, true);
  };
};
