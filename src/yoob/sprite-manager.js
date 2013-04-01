/*
 * This file is part of yoob.js version 0.3-PRE
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * This is really just an interface; duck-typing-wise, you can use any
 * Javascript object you want as a sprite, so long as it exposes these
 * methods.
 */
yoob.Sprite = function() {
  this.isDraggable = false;

  this.init = function(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.selected = false;
  };

  this.getX = function() {
    return this.x;
  };

  this.getY = function() {
    return this.y;
  };

  this.getWidth = function() {
    return this.w;
  };

  this.getHeight = function() {
    return this.h;
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

  // override this to detect this event
  this.ondrop = function() {
  };

};

/*
 * This has lots of shortcomings at the moment.
 */
yoob.SpriteManager = function() {
  this.canvas = undefined;
  this.canvasX = undefined;
  this.canvasY = undefined;
  this.offsetX = undefined;
  this.offsetY = undefined;
  this.dragging = undefined;
  this.sprites = [];

  /*
   * Attach this DragManager to a canvas.
   */
  this.init = function(canvas) {
    this.canvas = canvas;

    var self = this;
    canvas.onmousedown = function(e) {
      self.canvasX = e.pageX - canvas.offsetLeft;
      self.canvasY = e.pageY - canvas.offsetTop;

      for (var i = self.sprites.length-1; i >= 0; i--) {
        var sprite = self.sprites[i];
        if (!sprite.isDraggable) continue;
        if (sprite.containsPoint(self.canvasX, self.canvasY)) {
          self.dragging = sprite;
          self.dragging.selected = true;
          self.offsetX = sprite.x - self.canvasX;
          self.offsetY = sprite.y - self.canvasY;
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
      if (self.dragging !== undefined) {
        self.dragging.ondrop();
        self.dragging.selected = false;
      }
      self.dragging = undefined;
      canvas.style.cursor = "auto";
    };
  };

  this.draw = function(ctx) {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i].draw(ctx);
    }
  };

  this.addSprite = function(sprite) {
    this.sprites.push(sprite);
  };

  this.removeSprite = function(sprite) {
    var index = undefined;
    for (var i = 0; i < this.sprites.length; i++) {
      if (this.sprites[i] === sprite) {
        index = i;
        break;
      }
    }
    if (index !== undefined) {
      this.sprites.splice(index, 1);
    }
  };

  // TODO: reorder and delete draggables
};
