if (window.yoob === undefined) yoob = {};

yoob.AST = function(type, value, children) {
  this.type = type;
  this.value = value;
  this.children = children;
  if (this.children === undefined) {
    this.children = [];
  }
  
  this.toString = function() {
    var s = this.type + "("
    if (this.value !== undefined) {
      s += "'" + this.value + "'";
    }
    if (this.children !== undefined && this.children.length > 0) {
      s + " ";
      for (var i = 0; i < this.children.length; i++) {
        if (this.children[i] !== undefined) {
          s += this.children[i].toString();
          if (i < this.children.length - 1)
            s += " ";
        }
      }
    }
    return s + ")";
  };
};
