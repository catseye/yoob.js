Changelog
=========

*   version 0.8
    
    Added `yoob.SourceManager`.
    
    `yoob.Controller` is no longer responsible for showing the editor for
    the textual source of a program/configuration; that's the new
    `yoob.SourceManager`'s job.  All that code has been removed from
    `yoob.Controller`, and several backwards-incompatible changes have
    been made to its API as well.  In particular, a subclass or client
    must supply a `reset` method now rather than a `load` method.  Please
    consuly the source comments in `yoob/controller.js` for more details.
    
    Both `yoob.Controller` and `yoob.SourceManager` are capable of
    creating their control panels (full of buttons) programmatically.
    
    `yoob.PresetManager` no longer takes a `yoob.Controller` to establish
    a default callback.  Instead, a default callback can be configured
    with the `setPreset` key.
    
    Added `yoob.makePre()` to `yoob/element-factory.js`.

    Added `setPlayfield(pf)` to `yoob.PlayfieldCanvasView` and
    `yoob.PlayfieldHTMLView`.  Also added `setCellDimensions()` to
    `yoob.PlayfieldHTMLView`, mostly as compatibility with
    `yoob.PlayfieldCanvasView`; and `yoob.PlayfieldHTMLView` renders
    undefined values as ` ` (space) by default now.

*   version 0.7-2015.0108
    
    Fixed bug in `yoob.Controller` where the "Reset" button was not being
    disabled during source editing.

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

*   version 0.5
    
    `yoob.SpriteManager` handles both mouse and touch events.
    
    Added `yoob.Turtle`, `yoob.Path`, and `yoob.PathSet`.
    
    Added `yoob.FullScreenDetector`.

    Added `yoob.Joystick`.
    
    Added `yoob.Chargen`.
    
    Added `yoob/splash-screen.js` and `yoob/animation-frame.js`.
    
    `yoob.PlayfieldCanvasView` now sets up some reasonable default values
    for cell size and cursors, and `yoob.PlayfieldHTMLView` is less incomplete.

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

*   version 0.3
    
    Added `embed-sources` tool.
    
    Added `yoob.SpriteManager` and `yoob.Sprite` classes.
    
    Moved `yoob.AST` to `yoob.Tree`, and added `equals`, `setValue`,
    `setVariable`, `match`, and `subst` methods to it.
    
    Added support for `edit` and `select` controls in `yoob.Controller`.
    
    Added `get(Max|Min)(X|Y)` methods to `yoob.Playfield`, and fixed
    issue with drawing cursors at wrong offsets.

*   version 0.2
    
    Added `yoob.Controller` class.
    
    In `yoob.Playfield`:
    
    *   made attributes camelCase
    *   added support for `transformer` argument to `load`
    *   added support for default values (`setDefault`)
    *   added `dump` method
    *   added `putDirty` and `recalculateBounds` methods
    *   added `map` method

*   version 0.1
    
    Initial release.
