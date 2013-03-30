yoob.js
=======

*Version 0.2-PRE.  Everything subject to change.*

yoob.js is the HTML5 counterpart to [yoob][].

Like yoob, yoob.js:

*   provides a set of components for implementing visual interpreters for
    esoteric programming languages (esolangs).
*   is written amateurishly.
*   has an API that is not particularly good, finalized, or stable.
*   will eventually ship with some public-domain implementations of some
    esolangs (but the approach is different from yoob's; see below.)

Unlike yoob, yoob.js:

*   is written in Javascript which assumes HTML5 capabilities in the browser
    (mainly `<canvas>` elements.)
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
    further modification.  (It's all public domain, so build on it!)  For
    example, `yoob.sexpParser` is meant to be used as an example or basis for
    a specific grammar of your choice.

yoob.js will eventually:

*   extend the idea of "a component to help implement an esolang" to
    encompass esolang implementations themselves.  So, for example, yoob.js
    might include an implementation of brainfuck, but this would not be
    provided solely as an "end implementation" but also as a component for
    implementing other brainfuck-derived esolangs, and other mashups.
    
    This emphasizes a thing with yoob, which is that while the yoob
    distribution may contain implementations of various languages, it does
    not contain the reference implementation of any language; but the
    reference implementations of some languages may be written in yoob.
    yoob allows for this approach, but yoob.js hopes to accomodate it
    better than just allowing for it.

Other things you should know about yoob.js are that it:

*   requires features from HTML5 and related "modern" web standards.  It does
    not try to do any feature detection or polyfilling.  If it doesn't work
    in your browser, it doesn't work in your browser.  Try another browser.
*   does not rely on jQuery (yet) (possibly to its detriment.)
*   does not come minified or agglomerated or anything.  I mean, this isn't
    production web development, we're not trying to optimize page load time
    here, we just want to run us some esolangs, right?  You're free to do
    this yourself.  May we suggest `cat yoob/*.js > yoob.js`?  (Note: there
    may one day be a small script to do this sort of thing for you, more
    intelligently, respecting dependencies and whatnot.  Especially if you
    write it and send a pull request.)

API
---

Each yoob.js class is defined in its own `.js` file, and each `.js` file
inserts the class it defines into the `yoob` namespace (which it will create
as a new, empty, global namespace if it has not already been defined.)

The classes are currently:

*   `yoob.Playfield`, in `yoob/playfield.js`
    
    A two-dimensional Cartesian grid of values which dynamically expands as
    needed.  It can be associated with a `<canvas>` element, on which it will
    be depicted, which will also dynamically expand as needed.  Objects of
    this class should be suitable for representing programs in two-dimensional
    esolangs such as Befunge, as well as cellular automata.

*   `yoob.Cursor`, in `yoob/cursor.js`
    
    A pointer (position vector) into two-dimensional Cartesian space
    (typically a `yoob.Playfield`) which also has a _delta_ (direction
    vector) which need not necessarily be used.

*   `yoob.TextConsole`, in `yoob/text-console.js`
    
    A crude simulation of a text-based addressable console on a `<canvas>`
    element.  Not recommended for serious use; mainly intended to provide a
    sort of retro feel to input and ouput.

*   `yoob.TextTerminal`, in `yoob/text-terminal.js`
    
    A subclass of `yoob.TextConsole` which understands some terminal control
    codes such as newline and backspace.

*   `yoob.LineInputBuffer`, in `yoob/line-input-buffer.js`
    
    A crude simulation of a buffer into which the user can type a line of
    text.  Typically it is associated with a `yoob.TextConsole` object, on
    which the text is displayed as the user types it.

*   `yoob.Tape`, in `yoob/tape.js`
    
    A (theoretically) unbounded tape, like you'd find on a Turing machine,
    optionally associated with a `<canvas>` on which it is depicted.

*   `yoob.TapeHead`, in `yoob/tape-head.js`
    
    An object representing a position on a Tape.

*   `yoob.Stack`, in `yoob/stack.js`
    
    An object implementing a push-down, first-in-first-out stack of values,
    optionally associated with a `<canvas>` on which it is depicted.

*   `yoob.AST`
    
    An AST (Abstract Syntax Tree) is a type identifier (String), an optional
    value (of any type), and an array of zero or more children ASTs.

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

### Planned ###

*   `yoob.List`
    
    A List is either an atom (String) or a pair of a List and a List.

*   `yoob.Term`
    
    A Term is either an atom (String) or a variable (String in a special
    namespace), plus an array of zero or more children Terms.  Should
    include facilities for matching and unification.

*   `yoob.Environment`
    
    A scoped associative structure, suitable for implementing a symbol
    table or an evaluation context.

*   `yoob.Turtle`
    
    For Turtle Graphics.

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
*   [noit o' mnain worb][]
*   [Super Wumpus Land][]

[yoob]: http://catseye.tc/node/yoob.html
[Gemooy]: http://catseye.tc/node/Gemooy.html
[Javascript BigInteger]: https://github.com/silentmatt/javascript-biginteger
[noit o' mnain worb]: http://catseye.tc/node/noit%20o%27%20mnain%20worb.html
[Super Wumpus Land]: http://catseye.tc/node/Super%20Wumpus%20Land.html
