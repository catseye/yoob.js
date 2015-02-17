/*
 * This file is part of yoob.js version 0.9-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A lexical analyzer.
 * Create a new yoob.Scanner object, then call init, passing it an
 * array of two-element arrays; first element of each of these is the
 * type of token, the second element is a regular expression (in a
 * String) which matches that token at the start of the string.  The
 * regular expression should have exactly one capturing group.
 * Then call reset, passing it the string to be scanned.
 * 
 */
yoob.Scanner = function() {
    this.init = function(cfg) {
        this.text = undefined;
        this.token = undefined;
        this.type = undefined;
        this.error = undefined;
        this.table = cfg.table;
        this.whitespacePattern = cfg.whitespacePattern || "^[ \\t\\n\\r]*";
        return this;
    };

    this.reset = function(text) {
        this.text = text;
        this.token = undefined;
        this.type = undefined;
        this.error = undefined;
        this.scan();
    };

    this.scanPattern = function(pattern, type) {
        var re = new RegExp(pattern);
        var match = re.exec(this.text);
        if (match === null) return false;
        this.type = type;
        this.token = match[1];
        this.text = this.text.substr(match[0].length);
        return true;
    };

    this.scan = function() {
        this.scanPattern(this.whitespacePattern, "whitespace");
        if (this.text.length === 0) {
            this.token = null;
            this.type = "EOF";
            return;
        }
        for (var i = 0; i < this.table.length; i++) {
            var type = this.table[i][0];
            var pattern = this.table[i][1];
            if (this.scanPattern(pattern, type)) return;
        }
        if (this.scanPattern("^([\\s\\S])", "unknown character")) return;
        // should never get here
    };
    
    this.expect = function(token) {
        if (this.token === token) {
            this.scan();
        } else {
            this.error = "expected '" + token + "' but found '" + this.token + "'";
        }
    };
    
    this.on = function(token) {
        return this.token === token;
    };
    
    this.onType = function(type) {
        return this.type === type;
    };
    
    this.checkType = function(type) {
        if (this.type !== type) {
            this.error = "expected " + type + " but found " + this.type + " (" + this.token + ")"
        }
    };
    
    this.expectType = function(type) {
        this.checkType(type);
        this.scan();
    };
    
    this.consume = function(token) {
        if (this.on(token)) {
            this.scan();
            return true;
        } else {
            return false;
        }
    };
};
