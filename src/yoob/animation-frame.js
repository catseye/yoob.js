/*
 * This file is part of yoob.js version 0.6-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * Pretty standard shim to get window.{request,cancelRequest}AnimationFrame
 * functions, synthesized from the theory and the many examples I've seen.
 */

window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(f, elem) {
        return setTimeout(function() {
            f(Date.now());
        }, 1000 / 60);
    };

// it was called "cancelRequestAnimationFrame" in the editor's draft:
// http://webstuff.nfshost.com/anim-timing/Overview.html
// but "cancelAnimationFrame" in the Candidate Recommendation:
// http://www.w3.org/TR/animation-timing/
window.cancelRequestAnimationFrame =
    window.cancelRequestAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    window.msCancelRequestAnimationFrame ||
    window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    clearTimeout;
window.cancelAnimationFrame = window.cancelRequestAnimationFrame;

/*
 * Convenience function for using requestAnimationFrame.  Calls the
 * object's draw() method on each animation frame, and calls update()
 * as necessary to ensure it is called once every tickTime milliseconds.
 * By default, tickTime = 1/60th of a second.  It can be configured by
 * passing in a configuration dictionary after the object.  If the
 * configuration dictionary is assigned to a variable outside this
 * function, after this function returns, the request entry in the
 * dictionary will contain the animation request handle.  e.g.,
 *
 *     var cfg = {};
 *     cfg.tickTime = 1000.0 / 50.0;
 *     yoob.setUpQuantumAnimationFrame(this, cfg);
 *     cancelRequestAnimationFrame(cfg.request);
 *
 */
yoob.setUpQuantumAnimationFrame = function(object, cfg) {
    cfg = cfg || {};
    cfg.lastTime = cfg.lastTime || null;
    cfg.accumDelta = cfg.accumDelta || 0;
    cfg.tickTime = cfg.tickTime || (1000.0 / 60.0);
    var animFrame = function(time) {
        object.draw();
        if (cfg.lastTime === null) {
            cfg.lastTime = time;
        }
        cfg.accumDelta += (time - cfg.lastTime);
        while (cfg.accumDelta > cfg.tickTime) {
            cfg.accumDelta -= cfg.tickTime;
            object.update();
        }
        cfg.lastTime = time;
        cfg.request = requestAnimationFrame(animFrame);
    };
    cfg.request = requestAnimationFrame(animFrame);
};

/*
 * Convenience function for using requestAnimationFrame.  Calls the
 * object's draw() method on each animation frame, passing the amount
 * of time that has elapsed (in milliseconds) since the last time it
 * was called (or 0 if it was never previously called.)  Otherwise
 * similar to yoob.setUpQuantumAnimationFrame.
 */
yoob.setUpProportionalAnimationFrame = function(object, cfg) {
    cfg = cfg || {};
    cfg.lastTime = cfg.lastTime || null;
    var animFrame = function(time) {
        var timeElapsed = cfg.lastTime == null ? 0 : time - cfg.lastTime;
        cfg.lastTime = time;
        object.draw(timeElapsed);
        if (cfg.request) {
            cfg.request = requestAnimationFrame(animFrame);
        }
    };
    cfg.request = requestAnimationFrame(animFrame);
};
