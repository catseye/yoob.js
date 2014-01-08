/*
 * This file is part of yoob.js version 0.5
 * Available from https://github.com/catseye/yoob.js/
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
    this.dx = 0;
    this.dy = 0;
    this.selected = false;
  };

  this.getX = function() {
    return this.x;
  };

  this.getY = function() {
    return this.y;
  };

  this.getCenterX = function() {
    return this.x + this.w / 2;
  };

  this.getCenterY = function() {
    return this.y + this.h / 2;
  };

  this.getWidth = function() {
    return this.w;
  };

  this.getHeight = function() {
    return this.h;
  };

  this.setVelocity = function(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  };

  this.setDestination = function(x, y, ticks) {
    this.destX = x;
    this.destY = y;
    this.dx = (this.destX - this.x) / ticks;
    this.dy = (this.destY - this.y) / ticks;
    this.destCounter = ticks;
  };

  this.move = function(x, y) {
    this.x += this.dx;
    this.y += this.dy;
    this.onmove();
    if (this.destCounter !== undefined) {
      this.destCounter--;
      if (this.destCounter <= 0) {
        this.destCounter = undefined;
        this.x = this.destX;
        this.y = this.destY;
        this.onreachdestination();
      }
    }
  };

  this.moveTo = function(x, y) {
    this.x = x;
    this.y = y;
  };

  this.moveCenterTo = function(x, y) {
    this.x = x - this.getWidth() / 2;
    this.y = y - this.getHeight() / 2;
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

  // event handlers.  override to detect these events.
  this.ongrab = function() {
  };
  this.ondrag = function() {
  };
  this.ondrop = function() {
  };
  this.onclick = function() {
  };
  this.onmove = function() {
  };
  this.onreachdestination = function() {
    this.setVelocity(0, 0);
  };

};

/*
 * This still has a few shortcomings at the moment.
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
   * Common handling of mouse and touch events
   */
  this.onmousedown = function(e, touch) {
    e.preventDefault();
    this.canvasX = touch.pageX - this.canvas.offsetLeft;
    this.canvasY = touch.pageY - this.canvas.offsetTop;

    var sprite = this.getSpriteAt(this.canvasX, this.canvasY);
    if (sprite === undefined) return;
    if (sprite.isDraggable) {
      this.dragging = sprite;
      this.dragging.selected = true;
      this.dragging.ongrab();
      this.offsetX = sprite.getX() - this.canvasX;
      this.offsetY = sprite.getY() - this.canvasY;
      this.canvas.style.cursor = "move";
    } else if (sprite.isClickable) {
      sprite.onclick(e);
    }
  };

  this.onmousemove = function(e, touch) {
    e.preventDefault();
    if (!this.dragging) return;

    this.canvasX = touch.pageX - this.canvas.offsetLeft;
    this.canvasY = touch.pageY - this.canvas.offsetTop;

    this.dragging.moveTo(this.canvasX + this.offsetX,
                         this.canvasY + this.offsetY);
  };

  this.onmouseup = function(e, touch) {
    e.preventDefault();
    this.canvas.onmousemove = null;
    this.canvasX = undefined;
    this.canvasY = undefined;
    this.offsetX = undefined;
    this.offsetY = undefined;
    if (this.dragging !== undefined) {
      this.dragging.ondrop();
      this.dragging.selected = false;
    }
    this.dragging = undefined;
    this.canvas.style.cursor = "auto";
  };

  /*
   * Attach this SpriteManager to a canvas.
   */
  this.init = function(canvas) {
    this.canvas = canvas;

    var self = this;
    this.canvas.addEventListener('mousedown', function(e) {
      return self.onmousedown(e, e);
    });
    this.canvas.addEventListener('touchstart', function(e) {
      return self.onmousedown(e, e.touches[0]);
    });

    this.canvas.addEventListener('mousemove', function(e) {
      return self.onmousemove(e, e);
    });
    this.canvas.addEventListener('touchmove', function(e) {
      return self.onmousemove(e, e.touches[0]);
    });

    this.canvas.addEventListener('mouseup', function(e) {
      return self.onmouseup(e, e);
    });
    this.canvas.addEventListener('touchend', function(e) {
      return self.onmouseup(e, e.touches[0]);
    });
  };

  this.move = function() {
    this.foreach(function(sprite) { sprite.move(); });
  };

  this.draw = function(ctx) {
    if (ctx === undefined) {
      ctx = this.canvas.getContext('2d');
    }
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

  this.foreach = function(fun) {
    for (var i = this.sprites.length-1; i >= 0; i--) {
      var sprite = this.sprites[i];
      var result = fun(sprite);
      if (result === 'remove') {
        this.removeSprite(sprite);
      }
      if (result === 'return') {
        return sprite;
      }
    }
  };

};
