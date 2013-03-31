/*
 * This file is part of yoob.js version 0.3-PRE
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

yoob.Tree = function(type, children) {
  this.type = type;
  this.value = undefined;
  /*
   * If this is set to a string, this Tree node is a variable.
   */
  this.variable = undefined;
  this.children = children;
  if (this.children === undefined) {
    this.children = [];
  }

  // chain methods
  this.setValue = function(value) {
    this.value = value;
    return this;
  };
  this.setVariable = function(variable) {
    this.variable = variable;
    return this;
  };

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
  
  this.equals = function(tree) {
    if (this.type !== tree.type) {
      return false;
    }
    if (this.value !== tree.value) {
      return false;
    }
    if (this.children.length !== tree.children.length) {
      return false;
    }
    for (var i = 0; i < this.children.length; i++) {
      if (!this.children[i].equals(tree.children[i])) {
        return false;
      }
    }
    return true;
  };

  this.match = function(tree, unifier) {
    if (unifier === undefined) {
      unifier = {};
    }

    if (this.variable !== undefined) {
      var existing = unifier[this.variable];
      if (existing === undefined) {
        unifier[this.variable] = tree;
        return unifier;
      } else {
        return unifier[this.variable].match(tree, unifier);
      }
    }

    if (this.type !== tree.type) {
      return false;
    }
    if (this.value !== tree.value) {
      return false;
    }
    if (this.children.length !== tree.children.length) {
      return false;
    }
    for (var i = 0; i < this.children.length; i++) {
      if (!this.children[i].match(tree.children[i], unifier)) {
        return false;
      }
    }
    return unifier;
  };

};
