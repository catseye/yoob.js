/*
 * This file is part of yoob.js version 0.5-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A shim (of sorts) which detects when the user has toggled their browser's
 * full-screen mode (usually but not necessarily by pressing the F11 key) and
 * fires an 'onchange' event, in which you can resize DOM elements of your
 * choosing to suit the (non-)full-screen display (or whatever else you wish.)
 *
 * Tested in recent Firefox, Chromium, and IE.  Sure to fail in older versions
 * of some of those.
 */
yoob.FullScreenDetector = function(cfg) {
    this.init = function(cfg) {
        this.period = cfg.period || 250;
        this.onchange = cfg.onchange || function() {};
        this.fullScreen = false;
        this.start();
        return this;
    };

    this.start = function() {
        if (this.intervalId) return;
        var $this = this;
        this.intervalId = setInterval(function() {
            if (!$this.fullScreen) {
                if (window.fullScreen ||
                      ((!window.screenTop) && (!window.screenY))) {
                    $this.fullScreen = true;
                    $this.onchange($this.fullScreen);
                }
            } else {
                if (window.screenTop || window.screenY ||
                    (window.fullScreen === false)) {
                    $this.fullScreen = false;
                    $this.onchange($this.fullScreen);
                }
            }
        }, this.period);
    };

    this.stop = function() {
        if (!this.intervalId) return;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
    };

    this.init(cfg);
};
