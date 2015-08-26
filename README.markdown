yoob.js
=======

*Version 0.10.  Everything subject to change.*
*For version history, see the file [HISTORY.markdown](HISTORY.markdown).*

yoob.js started out as the HTML5 counterpart to [yoob][], but has since
grown to include several generally-useful facilities for making animated
and interactive HTML5 pages.

[yoob]: http://catseye.tc/node/yoob

Like yoob, yoob.js:

*   provides a set of components for implementing visual interpreters for
    esoteric programming languages (esolangs).
*   is written amateurishly.
*   has an API that is not particularly good, finalized, or stable.

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

*   `yoob.SourceManager`, in `yoob/source-manager.js`
    
    An object for managing the editing and registering (generally, to a
    `yoob.Controller`) the textual source of a program or configuration.

*   `yoob.PresetManager`, in `yoob/preset-manager.js`
    
    An object for managing a set of "presets" — which, for an esolang,
    might be example programs; for an emulator, might be ROM images;
    for a control panel, may be pre-selected combinations of settings;
    and so forth.  May be used to populate the source of a `yoob.SourceManager`
    and/or a `yoob.Controller`,

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

*   `yoob.CanvasResizer`, in `yoob/canvas-resizer.js`
    
    An object which attempts to intelligently resize a canvas element, to make
    it fit inside the browser window at all times, resizing it or making it
    disappear if necessary, and retaining a maximum size or aspect ratio, if
    requested.

Plus some functions which aren't classes:

*   `yoob.showSplashScreen`, in `yoob/splash-screen.js`

    An adapter-type thing which displays a `div` element with some inner HTML
    (typically containing a message or logo or such) and a "Proceed" button,
    all in place of a given element.  When the button is clicked, the `div` is
    hidden, the given element is revealed, and a callback is invoked.

    The intention is to allow a "splash screen", which may contain a disclaimer
    or similar, before the "main stage" is actually displayed and started.

*   `yoob.make*`, in `yoob/element-factory.js`

    Convenience functions for creating DOM elements.  Some of them create
    groups of elements that co-operate to provide a functionality in the UI
    (e.g. spin controls.)

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
