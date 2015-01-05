/*
 * This file is part of yoob.js version 0.7
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

// Requires yoob.Animation be loaded first.

/*
 * A wrapper around yoob.Animation that slides (varies) between two values,
 * automatically finishing when the end value has been reached.
 */
yoob.Varier = function() {
    this.init = function(cfg) {
        this.begin = cfg.begin;
        this.end = cfg.end;
        this.duration = cfg.duration;       // in milliseconds
        this.update = cfg.update;
        this.ondone = cfg.ondone;
        return this;
    };

    this.start = function() {
        this.current = this.begin;
        this.animation = new yoob.Animation().init({
            mode: 'proportional',
            object: this
        });
        this.totalTime = 0;
        this.animation.start();
        return this;
    };

    this.draw = function(timeElapsed) {
        this.totalTime += timeElapsed;
        if (this.totalTime >= this.duration) {
            this.update(this.end);
            this.ondone();
            this.animation.stop();
            return false;
        }
        this.update(
            this.begin +
            (this.totalTime / this.duration) * (this.end - this.begin)
        );
    };
};
