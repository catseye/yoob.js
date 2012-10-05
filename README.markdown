yoob.js
=======

yoob.js is the Javascript/HTML5 counterpart to [yoob][].

Like yoob, yoob.js:

*   provides a set of classes for implementing visual interpreters for
    esoteric programming languages (esolangs).
*   is written amateurishly.

Unlike yoob, yoob.js:

*   is written in Javascript.
*   does not provide an overarching framework which "knows" how to interpret
    and display your esolang implementation.  Instead, more fitting with the
    dynamic approach of the Javascript language, yoob.js simply provides the
    constituent parts; it's up to you to string them together into an esolang
    interpreter (or whatever else) and to lay it out on a web page.
*   is not limited to providing support for esolang interpreters; it might
    be better described as a set of classes for implementing esolangs "and
    other bizarre things".
*   does not support unbounded integer values (yet).
*   will provide classes which are meant to be used as starting points for
    further modification.  (It's all public domain, so build on it!)  For
    example, Scanner and Parser are meant to be adapted to specific grammars.

Other things you should know about yoob.js are that it:

*   requires features from HTML5 and related "modern" web standards.  It does
    not try to do any feature detection or polyfilling.  If it doesn't work
    in your browser, it doesn't work in your browser.  Try another browser.
*   does not rely on jQuery (yet) (possibly to its detriment.)
*   does not come minified or agglomerated or anything.  I mean, this isn't
    production web development, we're not trying to optimize page load time
    here, we just want to run us some esolangs, right?  You're free to do
    this yourself.  May we suggest `cat yoob/*.js > yoob.js`?

API
---

Each yoob.js class is defined in its own `.js` file, and each `.js` file
inserts the class it defines into the `yoob` namespace (which it will create
as a new, empty, global namespace if it has not already been defined.)

The classes are currently:

*   `yoob.Playfield`, in `yoob/playfield.js`
    
    A two-dimensional Cartesian grid of values which dynamically expands as
    needed.  It can be associated with a `<canvas>` element, which will also
    dynamically expand as needed, on which it will be depicted.

*   `yoob.Cursor`, in `yoob/cursor.js`
    
    A pointer (position vector) into two-dimensional Cartesian space
    (typically a `yoob.Playfield`) which also has a "delta" (direction
    vector) which need not necessarily be used.

*   `yoob.TextConsole`, in `yoob/text-console.js`
    
    A crude simulation of a text-based addressable console on a `<canvas>`
    element.

*   `yoob.LineInputBuffer`, in `yoob/line-input-buffer.js`
    
    A crude simulation of a buffer into which the user can type a line of
    text.  Typically it is associated with a `yoob.TextConsole` object, on
    which the text is displayed as the user types it.

*   `yoob.Tape`, in `yoob/tape.js`
    
    A (theoretically) unbounded tape, like you'd find on a Turing machine.

*   `yoob.TapeHead`, in `yoob/tape-head.js`
    
    An object representing a position on a Tape.

*   `yoob.Stack`, in `yoob/stack.js`
    
    An object implementing a push-down, first-in-first-out stack/

PLANNED:

*   `yoob.Turtle`
    
    For Turtle Graphics.

*   `yoob.Scanner`
    
    A regexp-based lexical analyzer, intended to be copied and adapted for
    your specific needs.

*   `yoob.Parser`
    
    A recursive-descent parser, using `yoob.Scanner`, intended to be copied
    and adapted for your specific needs.

*   `yoob.AST`
    
    An AST (Abstract Syntax Tree) is a string (type), an optional value,
    and an array of children ASTs.

*   `yoob.List`
    
    A List is either an atom (a string) or a pair of a List and a List.

*   `yoob.Term`
    
    A Term is a string plus an array of zero or more Terms.


[yoob]: http://catseye.tc/node/yoob.html
