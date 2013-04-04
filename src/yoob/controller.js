/*
 * This file is part of yoob.js version 0.3-PRE
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
 */
yoob.Controller = function() {
    this.intervalId = undefined;
    this.delay = 100;
    this.source = undefined;
    this.speed = undefined;
    this.controls = {};

    var makeOnClick = function(controller, key) {
        if (controller['click_' + key] !== undefined)
            key = 'click_' + key;
        return function(e) { controller[key](); }
    };

    /*
     * Single argument is a dictionary (object) where the keys
     * are the actions a controller can undertake, and the values
     * are either DOM elements or strings; if strings, DOM elements
     * with those ids will be obtained from the document and used.
     */
    this.connect = function(dict) {
        var self = this;
        var keys = ["start", "stop", "step", "load", "edit"];
        for (var i in keys) {
            var key = keys[i];
            var value = dict[key];
            if (typeof value === 'string') {
                value = document.getElementById(value);
            }
            if (value !== undefined) {
                value.onclick = makeOnClick(this, key);
                this.controls[key] = value;
            }
        }

        var keys = ["source", "display"];
        for (var i in keys) {
            var key = keys[i];
            var value = dict[key];
            if (typeof value === 'string') {
                value = document.getElementById(value);
            }
            if (value !== undefined) {
                this[key] = value;
            }
        }

        var speed = dict.speed;
        if (typeof speed === 'string') {
            speed = document.getElementById(speed);
        }
        if (speed !== undefined) {
            this.speed = speed;
            speed.value = self.delay;
            speed.onchange = function(e) {
                self.delay = speed.value;
                if (self.intervalId !== undefined) {
                    self.stop();
                    self.start();
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
        this.stop();
        this.load(this.source.value);
        if (this.controls.edit) this.controls.edit.style.display = "inline";
        if (this.controls.load) this.controls.load.style.display = "none";
        if (this.controls.start) this.controls.start.disabled = false;
        if (this.controls.step) this.controls.step.disabled = false;
        if (this.controls.stop) this.controls.stop.disabled = false;
        if (this.display) this.display.style.display = "block";
        if (this.source) this.source.style.display = "none";
    };

    this.load = function(text) {
        alert("load() NotImplementedError");
    };

    this.click_edit = function(e) {
        this.stop();
        if (this.controls.edit) this.controls.edit.style.display = "none";
        if (this.controls.load) this.controls.load.style.display = "inline";
        if (this.controls.start) this.controls.start.disabled = true;
        if (this.controls.step) this.controls.step.disabled = true;
        if (this.controls.stop) this.controls.stop.disabled = true;
        if (this.display) this.display.style.display = "none";
        if (this.source) this.source.style.display = "block";
    };

    this.start = function() {
        if (this.intervalId !== undefined)
            return;
        this.step();
        var self = this;
        this.intervalId = setInterval(function() { self.step(); }, this.delay);
    };

    this.stop = function() {
        if (this.intervalId === undefined)
            return;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
    };
};
