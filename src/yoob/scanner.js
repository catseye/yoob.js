if (window.yoob === undefined) yoob = {};

/*
 * A lexical analyzer.
 */
yoob.Scanner = function() {
  this.text = undefined;
  this.index = undefined;
  this.token = undefined;
  this.type = undefined;
  this.error = undefined;

  this.init = function(text) {
    this.text = text;
    this.index = 0;
    this.token = undefined;
    this.type = undefined;
    this.error = undefined;
    this.scan();
  };
  
  this.scanPattern = function(pattern, type, tokenGroup) {
    var re = new RegExp(pattern);
    var match = re.exec(this.text);
    if (match === null) return false;
    this.type = type;
    if (tokenGroup !== undefined) {
      this.token = match[tokenGroup];
    }
    this.text = this.text.substr(match[0].length);
    return true;
  };

  this.scan = function() {
    this.scanPattern("^[ \\t\\n\\r]*", "whitespace");
    if (this.text.length === 0) {
      this.token = null;
      this.type = "EOF";
      return;
    }
    if (this.scanPattern("^(\\(|\\)|\\[|\\])", "bracket", 1)) return;
    if (this.scanPattern("^(\\d+)", "integer literal", 1)) return;
    if (this.scanPattern("^([a-zA-Z]\\w*)", "identifier", 1)) return;
    if (this.scanPattern("^\"(.*?)\"", "string literal", 1)) return;
    if (this.scanPattern("^([\\s\\S])", "unknown character", 1)) return;
    // todo insert catchall case
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
