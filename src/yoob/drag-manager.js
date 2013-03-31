/*
 * This file is part of yoob.js version 0.3-PRE
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

yoob.Draggable = function() {
  this.init = function(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.selected = false;
  };

  this.moveTo = function(x, y) {
    this.x = x;
    this.y = y;
  };

  this.containsPoint = function(x, y) {
    return (x >= this.x && x <= this.x + this.w &&
            y >= this.y && y <= this.y + this.h);
  };

  // you will probably want to override this
  this.draw = function(ctx) {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  };
};

/*
 * This has lots of shortcomings at the moment.
 */
yoob.DragManager = function() {
  this.canvas = undefined;
  this.canvasX = undefined;
  this.canvasY = undefined;
  this.offsetX = undefined;
  this.offsetY = undefined;
  this.dragging = undefined;
  this.draggables = [];
  var ctx = undefined;

  /*
   * Attach this DragManager to a canvas.
   */
  this.init = function(canvas) {
    this.canvas = canvas;
    ctx = canvas.getContext("2d");

    var self = this;
    canvas.onmousedown = function(e) {
      self.canvasX = e.pageX - canvas.offsetLeft;
      self.canvasY = e.pageY - canvas.offsetTop;

      for (var i = self.draggables.length-1; i >= 0; i--) {
        var draggable = self.draggables[i];
        if (draggable.containsPoint(self.canvasX, self.canvasY)) {
          self.dragging = draggable;
          self.dragging.selected = true;
          self.offsetX = draggable.x - self.canvasX;
          self.offsetY = draggable.y - self.canvasY;
          canvas.onmousemove = function(e) {
            self.canvasX = e.pageX - canvas.offsetLeft;
            self.canvasY = e.pageY - canvas.offsetTop;
            
            self.dragging.moveTo(self.canvasX + self.offsetX,
                                 self.canvasY + self.offsetY);
          };
          canvas.style.cursor = "move";
          break;
        }
      }
    };

    canvas.onmouseup = function() {
      canvas.onmousemove = null;
      self.canvasX = undefined;
      self.canvasY = undefined;
      self.offsetX = undefined;
      self.offsetY = undefined;
      self.dragging.selected = false;
      self.dragging = undefined;
      canvas.style.cursor = "auto";
    };
  };

  this.draw = function() {
    for (var i = 0; i < this.draggables.length; i++) {
      this.draggables[i].draw(ctx);
    }
  };

  this.addDraggable = function(draggable) {
    this.draggables.push(draggable);
  };
  
  // TODO: reorder and delete draggables
};
