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
*   is not limited to providing support for an esolang interpreter;
    potentially yoob.js could provide all kinds of miscellaneous widgets and
    other junk.
*   does not support unbounded integer values (yet).

Other things you should know about yoob.js are that it:

*   requires features from HTML5 and related "modern" web standards.  It does
    not try to do any feature detection or polyfilling.  If it doesn't work
    in your browser, it doesn't work in your browser.  Try another browser.
*   does not rely on jQuery (yet) (possibly to its detriment.)
*   does not come minified or agglomerated or anything.  I mean, this isn't
    production web development, we're not trying to optimize page load time
    here, we just want to run us some esolangs, right?

API
---

Each yoob.js class is defined in its own `.js` file, and each `.js` file
inserts the class it defines into the `yoob` namespace (which it will create
as a new, empty namespace if it has not already been defined.)

The classes are currently:

*   `yoob.Playfield`, in `yoob/playfield.js`
    
    A two-dimensional Cartesian grid of values which dynamically expands as
    needed.  It can be associated with a `<canvas>` element, which will also
    dynamically expand as needed, on which it will be depicted.

*   `yoob.Cursor`, in `yoob/cursor.js`
    
    A pointer into a `yoob.Playfield` which also has a "delta" which
    indicates the putative direction/speed at which it is moving.

*   `yoob.TextConsole`, in `yoob/text-console.js`
    
    A crude simulation of a text-based addressable console on a `<canvas>`
    element.

*   `yoob.LineInputBuffer`, in `yoob/line-input-buffer.js`
    
    A crude simulation of a buffer into which the user can type a line of
    text.  Typically it is associated with a `yoob.TextConsole` object, on
    which the text is displayed as the user types it.

PLANNED:

*   `yoob.Stack`, in `yoob/stack.js`

*   `yoob.Tape`, in `yoob/tape.js`

*   `yoob.TapeHead`, in `yoob/tape-head.js`

[yoob]: http://catseye.tc/node/yoob.html
