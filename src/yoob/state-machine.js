/*
 * This file is part of yoob.js version 0.12-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A simple, generic state machine.
 */
yoob.StateMachine = function() {
    this.init = function(cfg) {
        this.currentState = null;
        this.state = {};
        for (var nm in cfg.stateClasses) {
            var stateClass = cfg.stateClasses[nm];
            this.state[nm] = new stateClass();
            this.state[nm].machine = this;
            if (this.state[nm].init) {
                this.state[nm].init();
            } else {
                throw new Error('"' + nm + '" must implement .init');
            }
        }
        return this;
    };

    /*
     * When called, calls .onleave() on the current state (if there is one)
     * automatically, then calls .onenter() on the target state.
     */
    this.enter = function(nm, args) {
        if (this.currentState) {
            if (this.currentState.onleave) {
                this.currentState.onleave();
            } else {
                throw new Error('"' + nm + '" must implement .onleave');
            }
        }
        var state = this.state[nm];
        this.currentState = state;
        if (state.onenter) {
            state.onenter(args);
        } else {
            throw new Error('"' + nm + '" must implement .onenter');
        }
        return this;
    };
};

/*
 * You don't have to subclass this.  But you should follow its rules.
 */
yoob.State = function() {
    this.init = function() {
        throw new Error("You must implement .init()");
    };

    /*
     * When called, set up the things for the current state:
     *   Create/reveal any DOM elements
     *   Link up their events
     *   Set up timers/animations.  They can unilaterally transition
     *     to another state when done (so this is a "transition state")
     *   onenter itself can enter another state immediately, but it
     *     should only do so as the last thing in the handler.
     */
    this.onenter = function(args) {
        throw new Error("You must implement .onenter()");
    };

    /*
     * When called,
     *   Hide/destroy DOM elements relevant to this state
     *   Unlink events, if necessary
     *   Cancel timers/animations
     */
    this.onleave = function() {
        throw new Error("You must implement .onleave()");
    };
};
