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
      s += "'" + this.value + "' ";
    }
    for (var i = 0; i < this.children.length; i++) {
      s += this.children[i].toString() + " ";
    }
    return s + ")";
  };
};
