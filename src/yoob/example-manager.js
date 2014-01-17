/*
 * This file is part of yoob.js version 0.6-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * An object for managing a set of example programs (or other "pre-fab"
 * things) for use in an esolang interpreter (or other thing that could
 * use these things.  For example, games for an emulator, etc.)
 *
 * Mostly intended to be connected to a yoob.Controller.
 */
yoob.ExampleManager = function() {
    /*
     * The single argument is a dictionary (object) where the keys are:
     *    selectElem: (required) the <select> DOM element that will be
     *        populated with the available example programs.  Selecting one
     *        will cause the .select() method of this manager to be called.
     *        it will also call .onselect if that method is present.
     */
    this.init = function(cfg) {
        this.selectElem = cfg.selectElem;
        this.exampleClass = cfg.exampleClass || null;
        this.controller = cfg.controller || null;
        this.clear();
        var $this = this;
        this.selectElem.onchange = function() {
            $this.select(this.options[this.selectedIndex].value);
        }
        return this;
    };

    /*
     * Removes all options from the selectElem, and their associated data.
     */
    this.clear = function() {
        this.reactTo = {};
        while (this.selectElem.firstChild) {
            this.selectElem.removeChild(this.selectElem.firstChild);
        }
        this.add('(select one...)', function() {});
        return this;
    };

    /*
     * Adds an example to this ExampleManager.  When it is selected,
     * the given callback will be called, being passed the id as the
     * first argument.  If no callback is provided, a default callback,
     * which loads the contents of the element with the specified id
     * into the configured controller, will be used.
     */
    this.add = function(id, callback) {
        var opt = document.createElement("option");
        opt.text = id;
        opt.value = id;
        this.selectElem.options.add(opt);
        var $this = this;
        this.reactTo[id] = callback || function(id) {
            $this.controller.click_stop(); // in case it is currently running
            $this.controller.loadSourceFromHTML(
              document.getElementById(id).innerHTML
            );
        };
        return this;
    };

    /*
     * Called by the selectElem's onchange event.  For sanity, you should
     * probably not call this yourself.
     */
    this.select = function(id) {
        this.reactTo[id](id);
        if (this.onselect) {
            this.onselect(id);
        }
    };

    /*
     * When called, every DOM element in the document with the given
     * class will be considered an example program, and the manager
     * will be populated with these.  Generally the CSS for the class
     * will have `display: none` and the elements will be <div>s.
     *
     * callback is as described for the .add() method.
     */
    this.populateFromClass = function(className, callback) {
        var elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++) {
            var e = elements[i];
            this.add(e.id, callback);
        }
        return this;
    };
};
