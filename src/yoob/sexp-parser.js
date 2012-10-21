if (window.yoob === undefined) yoob = {};

/*
 * A simple S-expression parser.
 *
 * requires you load yoob.AST and yoob.Scanner first
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
      return new yoob.AST('atom', x);
    } else if (this.scanner.consume('(')) {
      var children = []
      while (!this.scanner.on(')') && !this.scanner.onType('EOF')) {
        children.push(this.parse());
      }
      this.scanner.expect(')');
      return new yoob.AST('list', undefined, children);
    } else {
      /* register some kind of error */
      this.scanner.scan();
    }
  };

};
