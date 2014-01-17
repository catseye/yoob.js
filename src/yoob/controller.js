/*
 * This file is part of yoob.js version 0.6-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A controller for executing(/animating/evolving) states
 * (such as esolang program states or cellular automaton
 * configurations.)
 *
 * Can be connected to a UI in the DOM.
 *
 * Subclass this and override the following methods:
 * - make it evolve the state by one tick in the step() method
 * - make it load the state from a multiline string in the load() method
 *
 * You may wish to store the state in the controller's .state attribute,
 * but you needn't (and arguably shouldn't.)  Likewise, the controller
 * does not concern itself with depicting the state.  You should use
 * something like yoob.PlayfieldCanvasView for that, instead.
 */
yoob.Controller = function() {
    this.intervalId = undefined;
    this.delay = 100;
    this.source = undefined;
    this.speed = undefined;
    this.controls = {};

    this.makeEventHandler = function(control, key) {
        if (this['click_' + key] !== undefined) {
            key = 'click_' + key;
        }
        var $this = this;
        return function(e) {
            $this[key](control);
        };
    };

    /*
     * Single argument is a dictionary (object) where the keys
     * are the actions a controller can undertake, and the values
     * are either DOM elements or strings; if strings, DOM elements
     * with those ids will be obtained from the document and used.
     */
    this.connect = function(dict) {
        var keys = ["start", "stop", "step", "load", "edit"];
        for (var i in keys) {
            var key = keys[i];
            var value = dict[key];
            if (typeof value === 'string') {
                value = document.getElementById(value);
            }
            if (value) {
                value.onclick = this.makeEventHandler(value, key);
                this.controls[key] = value;
            }
        }
        if (this.controls.stop) {
            this.controls.stop.disabled = true;
        }

        var keys = ["source", "display"];
        for (var i in keys) {
            var key = keys[i];
            var value = dict[key];
            if (typeof value === 'string') {
                value = document.getElementById(value);
            }
            if (value) {
                this[key] = value;
            }
        }

        var speed = dict.speed;
        if (typeof speed === 'string') {
            speed = document.getElementById(speed);
        }
        if (speed) {
            this.speed = speed;
            speed.value = this.delay;
            var $this = this;
            speed.onchange = function(e) {
                $this.delay = speed.value;
                if ($this.intervalId !== undefined) {
                    $this.stop();
                    $this.start();
                }
            }
        }        
    };

    this.click_step = function(e) {
        this.stop();
        this.step();
    };

    this.step = function() {
        alert("step() NotImplementedError");
    };

    this.click_load = function(e) {
        this.click_stop();
        this.load(this.source.value);
        if (this.controls.edit) this.controls.edit.style.display = "inline";
        if (this.controls.load) this.controls.load.style.display = "none";
        if (this.controls.start) this.controls.start.disabled = false;
        if (this.controls.step) this.controls.step.disabled = false;
        if (this.controls.stop) this.controls.stop.disabled = true;
        if (this.display) this.display.style.display = "block";
        if (this.source) this.source.style.display = "none";
    };

    this.load = function(text) {
        alert("load() NotImplementedError");
    };

    /*
     * Loads a source text into the source element.
     */
    this.loadSource = function(text) {
        if (this.source) this.source.value = text;
        this.load(text);
    };

    /*
     * Loads a source text into the source element.
     * Assumes it comes from an element in the document, so it translates
     * the basic HTML escapes (but no others) to plain text.
     */
    this.loadSourceFromHTML = function(html) {
        var text = html;
        text = text.replace(/\&lt;/g, '<');
        text = text.replace(/\&gt;/g, '>');
        text = text.replace(/\&amp;/g, '&');
        this.loadSource(text);
    };

    this.click_edit = function(e) {
        this.click_stop();
        if (this.controls.edit) this.controls.edit.style.display = "none";
        if (this.controls.load) this.controls.load.style.display = "inline";
        if (this.controls.start) this.controls.start.disabled = true;
        if (this.controls.step) this.controls.step.disabled = true;
        if (this.controls.stop) this.controls.stop.disabled = true;
        if (this.display) this.display.style.display = "none";
        if (this.source) this.source.style.display = "block";
    };

    this.click_start = function(e) {
        this.start();
        if (this.controls.start) this.controls.start.disabled = true;
        if (this.controls.step) this.controls.step.disabled = false;
        if (this.controls.stop) this.controls.stop.disabled = false;
    };

    this.start = function() {
        if (this.intervalId !== undefined)
            return;
        this.step();
        var $this = this;
        this.intervalId = setInterval(function() { $this.step(); }, this.delay);
    };

    this.click_stop = function(e) {
        this.stop();
        if (this.controls.stop && this.controls.stop.disabled) {
            return;
        }
        if (this.controls.start) this.controls.start.disabled = false;
        if (this.controls.step) this.controls.step.disabled = false;
        if (this.controls.stop) this.controls.stop.disabled = true;
    };

    this.stop = function() {
        if (this.intervalId === undefined)
            return;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
    };
};
