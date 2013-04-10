/*
 * This file is part of yoob.js version 0.4-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * Object that captures keystrokes and accumulates a string from them.
 * Optionally also updates a TextTerminal.
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
            //alert('keyup:' + e.keyCode);
            switch (e.keyCode) {
              case 8:   /* Backspace */
                if (me.text.length > 0) {
                    if (me.terminal !== undefined) {
                        me.terminal.write('\b \b');
                    }
                    me.text = me.text.substring(0, me.text.length-1);
                    if (me.onupdate !== undefined) {
                      me.onupdate(me.text);
                    }
                }
                e.cancelBubble = true;
                e.preventDefault();
                break;
              case 13:  /* Enter */
                if (me.terminal !== undefined) {
                    me.terminal.write('\n');
                }
                me.text = me.text.substring(0, me.text.length);
                if (me.onenter !== undefined) {
                    me.onenter(me.text);
                }
                me.text = "";
                e.cancelBubble = true;
                e.preventDefault();
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
            if (e.charCode === 0 || e.charCode === 13 || e.charCode === 8) {
                return;
            }
            //alert('keypress:' + e.charCode);
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
            e.preventDefault();
        }, true);

        return this;
    };
};
