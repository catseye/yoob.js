/*
 * This file is part of yoob.js version 0.3
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * Object that captures keystrokes and accumulates a string from them.
 * Optionally also updates a TextTerminal (not a TextConsole as it sends
 * control codes such as backspace which TextConsole does not understand.)
 * Mostly for demonstration purposes so far.
 */
yoob.LineInputBuffer = function() {
    this.listenObject = undefined;
    this.terminal = undefined;
    this.callback = undefined;
    this.text = undefined;
    this.onupdate = undefined;
    this.onenter = undefined;
    
    this.init = function(listenObject, terminal) {
        this.listenObject = listenObject;
        this.terminal = terminal;
        this.text = "";

        var me = this;
        listenObject.addEventListener('keyup', function(e) {
          //alert(e.keyCode);
          switch (e.keyCode) {
            case 8:   /* Backspace */
              if (me.terminal !== undefined) {
                me.terminal.write('\b \b');
              }
              if (me.text.length > 0) {
                me.text = me.text.substring(0, me.text.length-2);
                if (me.onupdate !== undefined) {
                  me.onupdate(me.text);
                }
              }
              e.cancelBubble = true;
              break;
            case 13:  /* Enter */
              if (me.terminal !== undefined) {
                me.terminal.write('\n');
              }
              me.text = me.text.substring(0, me.text.length-1);
              if (me.onenter !== undefined) {
                me.onenter(me.text);
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
          if (me.terminal !== undefined) {
            me.terminal.write(chr);
          }
          me.text += chr;
          if (me.onupdate !== undefined) {
            me.onupdate(me.text);
          }
          e.cancelBubble = true;
        }, true);

        return this;
    };
};
