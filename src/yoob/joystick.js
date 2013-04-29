/*
 * This file is part of yoob.js version 0.5-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * Emulates a joystick.  Be default, this is with the cursor keys and (either)
 * control key as the fire button, but the keys can be reconfigured by changing
 * values in the keyMap map, for example:
 *
 *     var joystick = new yoob.Joystick().init();
 *     joystick.keyMap[32] = joystick.fire;
 *     joystick.keyMap[17] = undefined;
 *
 * Control is used by default rather than space because, on all browsers I have
 * tried on both Ubuntu (FF, Chrome) and Windows (FF, IE), down+right and
 * up+left combinations both prevent the space key from registering.
 *
 * Some finesse is built into this design; for example, the user may hold
 * down right, then additionally hold down left (and the stick will register
 * no horizontal movement), then release right (and the stick will then
 * register leftward movement.)
 *
 * The joystick may either be used in a polled mode (and if you are animating
 * using setInterval or setTimeout or requestAnimationFrame, you may wish to
 * use this method; simply poll the joystick's dx and dy and buttonPressed
 * on each frame) or evented mode, by assigning an onchange method.  (see
 * eg/joystick.html for an example)
 */
yoob.Joystick = function() {
    this.init = function() {
        this.dx = 0;
        this.dy = 0;
        this.leftPressed = false;
        this.rightPressed = false;
        this.upPressed = false;
        this.downPressed = false;
        this.buttonPressed = false;
        this.keyMap = {
            17: this.fire,
            37: this.left,
            38: this.up,
            39: this.right,
            40: this.down
        };
        this.onchange = undefined;
        return this;
    };

    this.fire = function(obj, pressed) {
        if (obj.buttonPressed === pressed) return;
        obj.buttonPressed = pressed;
        if (obj.onchange !== undefined) obj.onchange();
    };

    this.left = function(obj, pressed) {
        if (obj.leftPressed === pressed) return;
        obj.leftPressed = pressed;
        obj.dx = (obj.leftPressed ? -1 : 0) + (obj.rightPressed ? 1 : 0);
        if (obj.onchange !== undefined) obj.onchange();
    };

    this.up = function(obj, pressed) {
        if (obj.upPressed === pressed) return;
        obj.upPressed = pressed;
        obj.dy = (obj.upPressed ? -1 : 0) + (obj.downPressed ? 1 : 0);
        if (obj.onchange !== undefined) obj.onchange();
    };

    this.right = function(obj, pressed) {
        if (obj.rightPressed === pressed) return;
        obj.rightPressed = pressed;
        obj.dx = (obj.leftPressed ? -1 : 0) + (obj.rightPressed ? 1 : 0);
        if (obj.onchange !== undefined) obj.onchange();
    };

    this.down = function(obj, pressed) {
        if (obj.downPressed === pressed) return;
        obj.downPressed = pressed;
        obj.dy = (obj.upPressed ? -1 : 0) + (obj.downPressed ? 1 : 0);
        if (obj.onchange !== undefined) obj.onchange();
    };

    this.attach = function(element) {
        var $this = this;
        element.addEventListener('keydown', function(e) {
            var u = $this.keyMap[e.keyCode];
            if (u !== undefined) {
                u($this, true);
                e.cancelBubble = true;
                e.preventDefault();
            }
        }, true);
        element.addEventListener('keyup', function(e) {
            var u = $this.keyMap[e.keyCode];
            if (u !== undefined) {
                u($this, false);
                e.cancelBubble = true;
                e.preventDefault();
            }
        }, true);
    };
};
