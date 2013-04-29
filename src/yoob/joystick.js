/*
 * This file is part of yoob.js version 0.5-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

yoob.Joystick = function() {
    this.init = function() {
        this.dx = 0;
        this.dy = 0;
        this.button = false;
        return this;
    };

    this.keyMap = {
        32: 'fire',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    this.fire = function(obj, pressed) {
        obj.button = pressed;
    };

    this.left = function(obj, pressed) {
        obj.dx = pressed ? -1 : 0;
    };

    this.up = function(obj, pressed) {
        obj.dy = pressed ? -1 : 0;
    };

    this.right = function(obj, pressed) {
        obj.dx = pressed ? 1 : 0;
    };

    this.down = function(obj, pressed) {
        obj.dy = pressed ? 1 : 0;
    };

    this.attach = function(element) {
        var $this = this;
        element.addEventListener('keydown', function(e) {
            var u = $this[$this.keyMap[e.keyCode]];
            if (u !== undefined) {
                u($this, true);
                e.cancelBubble = true;
                e.preventDefault();
            }
        }, true);
        element.addEventListener('keyup', function(e) {
            var u = $this[$this.keyMap[e.keyCode]];
            if (u !== undefined) {
                u($this, false);
                e.cancelBubble = true;
                e.preventDefault();
            }
        }, true);
    };
};
