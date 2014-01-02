/*
 * This file is part of yoob.js version 0.3
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A simple S-expression parser.  Note that it produces yoob.Trees rather
 * than cons cells (pairs), so parsing "(a b c)" will yield a single yoob.Tree
 * node with three children.
 *
 * Note also that atomic symbols are restricted to alphanumeric characters.
 *
 * This module requires that you load yoob.Tree and yoob.Scanner first.
 *
 * This module is really intended more for you to copy and modify (and maybe
 * extend into a parser for a more complex language) than to use directly.
 */
yoob.SexpParser = function() {
  this.scanner = undefined;

  this.init = function(text) {
    this.scanner = new yoob.Scanner();
    this.scanner.init([
      ['paren',  "^(\\(|\\))"],
      ['atom',   "^([a-zA-Z]\\w*)"]
    ]);
    this.scanner.reset(text);
  };

  /*
   * SExp ::= Atom | "(" {SExpr} ")".
   */
  this.parse = function(text) {
    if (this.scanner.onType('atom')) {
      var x = this.scanner.token;
      this.scanner.scan();
      return (new yoob.Tree('atom')).setValue(x);
    } else if (this.scanner.consume('(')) {
      var children = []
      while (!this.scanner.on(')') && !this.scanner.onType('EOF')) {
        children.push(this.parse());
      }
      this.scanner.expect(')');
      return new yoob.Tree('list', children);
    } else {
      /* TODO: register some kind of error */
      this.scanner.scan();
    }
  };

};
