yoob.js
=======

*Version 0.7-2015.0108.  Everything subject to change.*

yoob.js started out as the HTML5 counterpart to [yoob][], but has since
grown to include several generally-useful facilities for making animated
and interactive HTML5 pages.

Like yoob, yoob.js:

*   provides a set of components for implementing visual interpreters for
    esoteric programming languages (esolangs).
*   is written amateurishly.
*   has an API that is not particularly good, finalized, or stable.
*   may eventually ship with some public-domain implementations of some
    esolangs (but the approach is different from yoob's; see below.)

Unlike yoob, yoob.js:

*   is written in Javascript which assumes HTML5 capabilities in the browser
    (mainly support for the `<canvas>` element.)
*   does not provide a single canonical overarching framework which "knows"
    how to interpret and display and run an esolang implementation.  Instead,
    more fitting with the dynamic approach of the Javascript language, yoob.js
    provides the constituent parts, and it's up to the developer to string
    them together into an esolang interpreter (or whatever else) and to lay it
    out on a web page.
*   is not limited to providing support for esolang interpreters; it might
    be better described as a set of components for implementing esolangs "and
    other bizarre things".
*   does not support unbounded integer values (yet; see "Planned", below).
*   provides components which are meant to be used as starting points for
    further modification.  (It's all public domain, so mangle it up!)  For
    example, `yoob.SexpParser` is meant to be used as an example or basis for
    a specific grammar of your choice.

yoob.js may eventually:

*   extend the idea of "a component to help implement an esolang" to
    encompass esolang implementations themselves.  So, for example, yoob.js
    might include an implementation of brainfuck, but this would not be
    provided solely as an "end implementation" but also as a component for
    implementing other brainfuck-derived esolangs, and other mashups.
    
    This emphasizes a thing with yoob, which is that while the yoob
    distribution contains implementations of various languages, it does
    not contain the reference implementation of any language; but the
    reference implementations of some languages may be written in yoob.
    yoob allows for this approach, but yoob.js hopes to accomodate it
    better than just allowing for it.  Somehow.  Perhaps.

Other things you should know about yoob.js are that it:

*   requires features from HTML5 and related "modern" web standards.  With
    the exception of a few simple "shims" for a few critical things, it does
    not try to do any feature detection or polyfilling.  If it doesn't work
    in your browser, it doesn't work in your browser.  Try another browser.
*   does not rely on jQuery or any other front-end web framework.
*   does not come minified or agglomerated or anything.  I mean, this isn't
    production web development, we're not trying to optimize page load time
    here, we just want to run us some esolangs, right?  You're free to do
    this yourself.  May we suggest `cat yoob/*.js > yoob.js`?  (Note: there
    may one day be a small script to do this sort of thing for you, more
    intelligently, respecting dependencies and whatnot.  Especially if you
    write it and send a pull request.)

API
---

Each yoob.js class is defined in some `.js` file, and each `.js` file
inserts the class\[es\] it defines into the `yoob` namespace (which it will
create as a new, empty, global namespace if it has not already been defined.)

The classes are currently:

*   `yoob.Playfield`, in `yoob/playfield.js`
    
    A two-dimensional Cartesian grid of values which dynamically expands as
    needed.  Objects of this class are suitable for representing programs in
    two-dimensional esolangs such as Befunge, as well as cellular automata,
    and suitable for use as a backing store for a text-terminal simulator.

*   `yoob.Cursor`, in `yoob/cursor.js`
    
    An object representing position and direction in some space, which may
    be one-dimensional (typically a `yoob.Tape`, where it serves as a tape
    head) or two-dimensional Cartesian space (typically a `yoob.Playfield`).
    The direction aspect need not not necessarily be used.

*   `yoob.PlayfieldCanvasView`, in `yoob/playfield-canvas-view.js`
    
    A view (in the MVC sense) which associates a `yoob.Playfield` with a
    `<canvas>` element in the DOM.  The playfield will be depicted on the
    canvas, which can also dynamically expand as needed.

*   `yoob.PlayfieldHTMLView`, in `yoob/playfield-html-view.js`
    
    A view (in the MVC sense) which associates a `yoob.Playfield` with any
    element which supports `innerHTML`, although typically a `<pre>` element.
    Compared to the canvas view, this view will allow text to be rendered
    more nicely in some browsers, be selected for copying/pasting in the
    browser, and so forth.

*   `yoob.SourceHTMLView`, in `yoob/source-html-view.js`
    
    A view (in the MVC sense) which associates a program text with any
    element which supports `innerHTML`, although typically a `<pre>` element.
    This supports displaying cursors on a linear program text.

*   `yoob.TextTerminal`, in `yoob/text-terminal.js`

    A crude simulation of a text-based addressable console, including some
    functions (which need not be used) which understand simple terminal
    control sequences, such as LF and backspace.  Requires `yoob.Playfield`
    and `yoob.Cursor` and, if you actually want to render the terminal in
    a browser DOM, `yoob.PlayfieldCanvasView` or a compatible playfield
    view class.
    
*   `yoob.LineInputBuffer`, in `yoob/line-input-buffer.js`
    
    A crude simulation of a buffer into which the user can type a line of
    text.  Typically it is associated with a `yoob.TextTerminal` object, on
    which the text is displayed as the user types it.

*   `yoob.Tape`, in `yoob/tape.js`
    
    A (theoretically) unbounded tape, like you'd find on a Turing machine,
    optionally associated with a `<canvas>` on which it is depicted.

*   `yoob.Stack`, in `yoob/stack.js`
    
    An object implementing a push-down, first-in-first-out stack of values,
    optionally associated with a `<canvas>` on which it is depicted.

*   `yoob.Tree`, in `yoob/tree.js`
    
    A multi-purpose, n-ary tree, with optional node name (String identifier)
    and payload (arbitrary value.)  Children are indexed by integer, 0-based.
    It's meant to serve two main purposes:
    
    *   as an AST (Abstract Syntax Tree) for the (initial) intermediate
        representation(s) of a program in an interpreter or compiler, in
        which case the node name is the node type and the payload is anything
        that might be handy, such as what the tree evaluated to; and
    *   as _terms_, roughly as defined in the science of term rewriting.  In
        this case the node name is the "constructor" and the payload is
        probably not used.  For this purpose, the `tree.js` module should
        eventually include facilities for matching and unification.
    
    Trees, with only two children, could also be used as lists a la Lisp.  In
    this case the node name and payload would both go unused.
    
*   `yoob.Scanner`, in `yoob/scanner.js`
    
    A simple, inefficient lexical analyzer, parameterized with a table of
    regexps.  Can also serve as a starting point for writing your own, less
    simple, inefficient lexical analyzer.

*   `yoob.SexpParser`, in `yoob/sexp-parser.js`
    
    A simple recursive-descent parser which parses S-expressions.  Uses
    `yoob.Scanner` to analyze the input string and `yoob.AST` to create the
    parsed version.  Can also serve as a starting point for writing your own
    recursive-descent parser for some other, more complex language.

*   `yoob.Controller`, in `yoob/controller.js`
    
    A controller for animating the evolution and animation of a state
    (such as an esolang program state or a cellular automaton configuration).
    Can be hooked up to DOM elements in the UI (typically buttons.)

*   `yoob.PresetManager`, in `yoob/preset-manager.js`
    
    An object for managing a set of "presets" — which, for an esolang,
    might be example programs; for an emulator, might be ROM images;
    for a control panel, may be pre-selected combinations of settings;
    and so forth.  Intended to be connected to a `yoob.Controller`,
    but need not be.

*   `yoob.Sprite` and `yoob.SpriteManager`, in `yoob/sprite-manager.js`
    
    A set of classes for (somewhat crudely) managing independent things which
    can be placed, moved, be clicked, and be dragged around a canvas.

*   `yoob.Turtle`, in `yoob/turtle.js`
    
    For Turtle Graphics.  This is a "model" rather than a "view"; movement
    of the turtle generates a `yoob.PathList` (see below) which can then be
    drawn on a canvas (or not.)

*   `yoob.Path` and `yoob.PathList`, in `yoob/path.js`
    
    A `Path` is an abstraction of a path (a list of connected, two-dimensional
    points.)  Think of it as a model that also contains a convenient default
    view (i.e., it knows how to draw itself into a 2d drawing context.)  A
    `PathList` is an ordered list of paths along with some convenience methods.
    
*   `yoob.FullScreenDetector`, in `yoob/full-screen-detector.js`
    
    A shim (of sorts) which detects when the user has toggled their browser's
    full-screen mode (usually but not necessarily by pressing the F11 key) and
    fires an 'onchange' event, in which you can resize DOM elements of your
    choosing to suit the (non-)full-screen display (or whatever else you wish.)
    
    Note that this is unrelated to the idea of *programatically* asking the
    browser to go into full-screen mode.  That isn't supported (but if you do
    do that by some other means, the detector should still detect it.)

*   `yoob.Joystick`, in `yoob/joystick.js`
    
    Emulates a joystick, with some finesse.  Be default, this is with the
    cursor keys as directional control, and either control key as the fire
    button.  However, this is configurable.

*   `yoob.Chargen`, in `yoob/chargen.js`
    
    An object for producing bitmapped-character-like displays, such as those
    found on 8-bit retrocomputers.  A monochromatic image, with the character
    patterns in a regular grid, must be supplied.  Chromatic versions of the
    character patterns, in each of the given colours, will be automatically
    created.  The character data may also be modified programatically.

*   `yoob.Animation`, in `yoob/animation.js`
    
    An object which manages animations.  It is given an object to operate on,
    and can be initialized in one of two modes.  The `quantum` mode calls the
    given object's `draw()` method on each animation frame, and calls the
    object's `update()` method as necessary to ensure that `update()` is called
    once every given number of milliseconds (default being 1/60th of a second.)
    The `proportional` mode calls the object's `draw()` method on each animation
    frame, passing to it the amount of time that has elapsed (in milliseconds)
    since the last time it was called.
    
    This object uses the `requestAnimationFrame` API to conduct the animation,
    or falls back on its included `setInterval`-based shim in browsers which
    don't support `requestAnimationFrame` (or support it only under "their"
    name.)
    
    This object is a replacement for the deprecated `*AnimationFrame` functions
    which appeared in an earlier version.

*   `yoob.Varier`, in `yoob/varier.js`
    
    A small wrapper on top of `yoob.Animation` which varies a variable from
    one value to another, automatically stopping the animation when the final
    value has been reached.

Plus some functions which aren't classes:

*   `yoob.showSplashScreen`, in `yoob/splash-screen.js`

    An adapter-type thing which displays a `div` element with some inner HTML
    (typically containing a message or logo or such) and a "Proceed" button,
    all in place of a given element.  When the button is clicked, the `div` is
    hidden, the given element is revealed, and a callback is invoked.

    The intention is to allow a "splash screen", which may contain a disclaimer
    or similar, before the "main stage" is actually displayed and started.

### Planned ###

*   `yoob.Environment`
    
    A scoped associative structure, suitable for implementing a symbol
    table or an evaluation context.

*   `yoob.Error`
    
    For error handling.  Scanning and Parsing should accumulate a
    list of these objects before choking and dying.  They should be
    displayable nicely somehow.

*   unbounded integer support
    
    Although yoob.js will likely not ship with an unbounded integer
    implementation (unless someone wants to contribute one), certain
    classes (Tape, Stack, Playfield) should probably, one day, have limited
    support for working with objects which conform to a subset of the API
    exposed by Matthew Crumley's [Javascript BigInteger][] class, which is
    unastonishing.

Used in
-------

yoob.js is currently used in the HTML5 implementations of:

*   [Gemooy][]
*   [Wunnel][]
*   [Etcha][]
*   [noit o' mnain worb][]
*   [Super Wumpus Land][]
*   [REDGREEN][]
*   [Circute][]
*   [Braktif][]
*   [Jaccia][] and Jacciata
*   [Cyclobots][] and many other [HTML5-Gewgaws][]


[yoob]: http://catseye.tc/node/yoob
[Gemooy]: http://catseye.tc/node/Gemooy
[Wunnel]: http://catseye.tc/node/Wunnel
[Etcha]: http://catseye.tc/node/Etcha
[Javascript BigInteger]: https://github.com/silentmatt/javascript-biginteger
[noit o' mnain worb]: http://catseye.tc/node/noit_o%27_mnain_worb.html
[Super Wumpus Land]: http://catseye.tc/node/Super_Wumpus_Land
[REDGREEN]: http://catseye.tc/node/REDGREEN
[Circute]: http://catseye.tc/node/Circute
[Braktif]: http://catseye.tc/node/Braktif
[Jaccia]: http://catseye.tc/node/Jaccia
[Cyclobots]: http://catseye.tc/node/Cyclobots
[HTML5-Gewgaws]: https://github.com/catseye/HTML5-Gewgaws

Changelog
---------

*   version 0.1
    
    Initial release.
    
*   version 0.2
    
    Added `yoob.Controller` class.
    
    In `yoob.Playfield`:
    *   made attributes camelCase
    *   added support for `transformer` argument to `load`
    *   added support for default values (`setDefault`)
    *   added `dump` method
    *   added `putDirty` and `recalculateBounds` methods
    *   added `map` method

*   version 0.3
    
    Added `embed-sources` tool.
    
    Added `yoob.SpriteManager` and `yoob.Sprite` classes.
    
    Moved `yoob.AST` to `yoob.Tree`, and added `equals`, `setValue`,
    `setVariable`, `match`, and `subst` methods to it.
    
    Added support for `edit` and `select` controls in `yoob.Controller`.
    
    Added `get(Max|Min)(X|Y)` methods to `yoob.Playfield`, and fixed
    issue with drawing cursors at wrong offsets.

*   version 0.4
    
    Moved all-display related code from `yoob.Playfield` into a new class,
    `yoob.PlayfieldConsoleView`; in MVC parlance, `yoob.Playfield` is now
    a "model", and to actually display it in a browser, you will need a
    "view".
    
    `yoob.PlayfieldConsoleView` has a `drawCell` method instead of the
    old `drawElement` which will try to call `draw` on the value in the
    cell, if it has such a method, and will also takes (and will pass) the
    x and y co-ordinates of the cell in the playfield being drawn.
    
    Removed `yoob.TextConsole`; use `yoob.TextTerminal` and don't call
    `write()`, just call `writeRaw()`, if you want a console that doesn't
    understand terminal control codes.
    
    Refactored `yoob.TextTerminal` to be a facade over a `yoob.Playfield`
    and a `yoob.Cursor`.  Thus, you can now read characters from any
    position in the terminal — however it has lost the ability to overstrike
    characters.  Again, since `yoob.Playfield` is now a "model",
    `yoob.TextTerminal` itself does not concern itself with displaying the
    terminal (although there is a helper method to create a canvas view.)
    
    `yoob.LineInputBuffer` generally improved; it listens to `keydown`
    instead of `keyup` for special keys, prevents the default action for
    them, and has been tested in Firefox, Chrome, and Internet Explorer
    (recent versions.)

*   version 0.5
    
    `yoob.SpriteManager` handles both mouse and touch events.
    
    Added `yoob.Turtle`, `yoob.Path`, and `yoob.PathSet`.
    
    Added `yoob.FullScreenDetector`.

    Added `yoob.Joystick`.
    
    Added `yoob.Chargen`.
    
    Added `yoob/splash-screen.js` and `yoob/animation-frame.js`.
    
    `yoob.PlayfieldCanvasView` now sets up some reasonable default values
    for cell size and cursors, and `yoob.PlayfieldHTMLView` is less incomplete.

*   version 0.6
    
    Renamed `yoob.PathSet` to `yoob.PathList`.
    
    Added `yoob.SourceHTMLView`.
    
    `yoob.PlayfieldHTMLView` may now have cursors.
    The extents of both kinds of Playfield View now include cursors.
    Cursors may be drawn early or late in `yoob.PlayfieldCanvasView`.

    Added `yoob.PresetManager`.
    
    `yoob.Controller` is no longer responsible for selecting between
    provided programs/configurations.  It also keeps track of its state
    (running/paused/stopped/blocked on input) internally.
        
    animationFrame shims improved; animation functions deprecated in
    favour of the `yoob.Animation` object.
    
    `yoob.TapeHead` deprecated in favour of `yoob.Cursor`.

*   version 0.7
    
    Added `yoob.StateMachine`.
    
    Removed `yoob/animation-frame.js`.
    
    Added `.size()` method to yoob.Stack.
    
    Added `.clone()` and `.rotateDegrees()` to yoob.Cursor.
    
    Added `yoob/element-factory.js`.
    
    Fixed z-index bugs in yoob.SplashScreen.

    `yoob.Controller` now supports a 'reset' button.  In addition, the
    'speed' control defaults to reversed mode (low values = slow.)
    
    `yoob.Controller` now has rudimentary support for loading source via XHR
    (AJAX).
    
    `yoob.Animation` allows the `update()` (or `draw()`, in `proportional`
    mode) to return the exact object `false` to force the animation to stop
    immediately.
    
    Added `yoob.Varier`.

*   version 0.7-2015.0108
    
    Fixed bug in `yoob.Controller` where the "Reset" button was not being
    disabled during source editing.
