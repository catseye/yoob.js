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
  this.isClickable = false;

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
  this.ongrab = function() {
  };

  // override this to detect this event
  this.ondrag = function() {
  };

  // override this to detect this event
  this.ondrop = function() {
  };

  // override this to detect this event
  this.onclick = function() {
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

      var sprite = self.getSpriteAt(self.canvasX, self.canvasY);
      if (sprite === undefined) return;
      if (sprite.isDraggable) {
        self.dragging = sprite;
        self.dragging.selected = true;
        self.dragging.ongrab();
        self.offsetX = sprite.getX() - self.canvasX;
        self.offsetY = sprite.getY() - self.canvasY;
        canvas.onmousemove = function(e) {
          self.canvasX = e.pageX - canvas.offsetLeft;
          self.canvasY = e.pageY - canvas.offsetTop;

          self.dragging.moveTo(self.canvasX + self.offsetX,
                               self.canvasY + self.offsetY);
        };
        canvas.style.cursor = "move";
      } else if (sprite.isClickable) {
        sprite.onclick(e);
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

  this.moveToFront = function(sprite) {
    this.removeSprite(sprite);
    this.sprites.push(sprite);
  };

  this.moveToBack = function(sprite) {
    this.removeSprite(sprite);
    this.sprites.unshift(sprite);
  };

  this.getSpriteAt = function(x, y) {
    for (var i = this.sprites.length-1; i >= 0; i--) {
      var sprite = this.sprites[i];
      if (sprite.containsPoint(x, y)) {
        return sprite;
      }
    }
    return undefined;
  };

};
