window.addEventListener('load', function() {
  var Q = window.Q = Quintus().include('Sprites, Scenes, Input, 2D, Touch, UI, MkiData, Anim')
                              .setup({ maximize: true }).controls().touch();

  Q.animations('miles', {
    invincible: { frames: [0,1,2,3,4], loop: true, rate: 1/15 },
    invincible_done: { frames: [0] } //ghetto hack
  });
  Q.animations('qbox', {
    done: { frames: [1] }
  });

  Q.Sprite.extend('Player', {
    init: function(p) {
      this._super(p, { sprite: 'miles', sheet: 'miles', x: 410, y: 90, frame: 0});
      this.add('animation, 2d, platformerControls');
      this.p.score = 0;
      this.p.invincible = false;
      this.p.invincible_animation_priority = 0;

      this.on('hit.sprite', function(collision) {
        if (collision.obj.isA('Tower')) {
          Q.stageScene('endGame', 1, { label: 'You Won!' });
          this.destroy();
        }
      });

      this.on('invincible', function(e) {
        this.play('invincible', this.p.invincible_animation_priority);
        this.p.invincible = true;
        setTimeout(function() {
          Q('Player').trigger('invincible_done');
        }, 5000);
      });

      this.on('invincible_done', function(e) {
        this.play('invincible_done', this.p.invincible_animation_priority + 1);
        this.p.invincible_animation_priority += 2;
        this.p.invincible = false;
      });
    }
  });

  Q.Sprite.extend('Qbox', {
    init: function(p) {
      this._super(p, { sprite: 'qbox', sheet: 'qbox', gravity: 0, frame: 0 });
      this.add('2d, animation');
      this.p.contents_exhausted = false;

      this.on('bump.bottom', function(collision) {
        if (collision.obj.isA('Player') && !this.p.contents_exhausted ) {
          window.stage.insert(new Q.Powerup({x: this.p.x, y: this.p.y - 32, vx: 100}));
          this.play('done');
          this.p.contents_exhausted = true;
        }
      });
    }
  });

  Q.Sprite.extend('Powerup', {
    init: function(p) {
      this._super(p, { sheet: 'cisco-powerup' });
      this.add('2d, aiBounce');

      this.on('hit.sprite', function(collision) {
        if (collision.obj.isA('Player')) {
          collision.obj.trigger('invincible');
          this.destroy();
        }
      });
    }
  });

  Q.Sprite.extend('Tower', {
    init: function(p) {
      this._super(p, { sheet: 'castle' });
    }
  });

  Q.Sprite.extend('Enemy', {
    init: function(p) {
      this._super(p, { sheet: 'enemy', vx: 75 });
      this.add('2d, aiBounce');

      this.on('bump.left, bump.right, bump.bottom', function(collision) {
        if (collision.obj.isA('Player')) {
          if (collision.obj.p.invincible) {
            this.destroy();
            collision.obj.p.score += 100;
          } else {
            Q.stageScene('endGame', 1, { label: 'Try again!' });
            collision.obj.destroy();
          }
        }
      });

      this.on('bump.top', function(collision) {
        if (collision.obj.isA('Player')) {
          this.destroy();
          collision.obj.p.vy = -300;
          collision.obj.p.score += 100;
        }
      });
    }
  });

  Q.scene('level1', function(stage) {
    stage.insert(new Q.Repeater({ asset: 'background.png', speedX: 0.5, speedY: 0.5 }));
    stage.collisionLayer(new Q.TileLayer({ dataAsset: 'level1.json', sheet: 'tiles' }));
    var player = stage.insert(new Q.Player());
    stage.add('viewport').follow(player);
    stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));
    for (var i = 0; i < Q.assets['level1_qbox'].length; i++) {
      stage.insert(new Q.Qbox(Q.assets['level1_qbox'][i]));
    }
    stage.insert(new Q.Tower({ x: 300, y: 50 }));
  });

  Q.scene('endGame', function(stage) {
    var box = stage.insert(new Q.UI.Container({
      x: Q.width / 2, y: Q.height / 2, fill: 'rgba(0,0,0,0.5)'
    }));

    var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC", label: 'Play Again'}));
    var label  = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, label: stage.options.label }));

    button.on('click', function() {
      Q.clearStages();
      Q.stageScene('level1');
    });
    box.fit(20);
  });

  //Q.load("sprites.png, sprites.json, level.json, tiles.png", function() {
  Q.load('tiles.png, miles-sprites.png, enemy-sprite.png, background.png, qbox-sprites.png, cisco-powerup.png, castle.png', function() {
    Q.sheet('tiles', 'tiles.png', { tilew: 32, tileh: 32 });
    Q.sheet('enemy', 'enemy-sprite.png', {
      tilew: 30,
      tileh: 24,
      cols: 1,
      frames: 1,
      sx: 0,
      sy: 0
    });
    Q.sheet('cisco-powerup', 'cisco-powerup.png', {
      tilew: 32,
      tileh: 32,
      cols: 1,
      frames: 1
    });
    Q.sheet('castle', 'castle.png', {
      tilew: 30,
      tileh: 30,
      cols: 1,
      frames: 1
    });
    Q.compileSheets("miles-sprites.png","miles-sprites.json");
    Q.compileSheets('qbox-sprites.png', 'qbox-sprites.json');
    Q.stageScene('level1');
  });
});
