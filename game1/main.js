enchant();

/*
	rootscene
	sprite
*/

window.onload = function () {
	var core = new Core(320,320);
	core.preload('chara3.png');
	core.preload('chara6.png');
	core.preload('icon0.png');
	core.preload('effect0.png');
	core.fps = 15;
	core.onload = function() {

		var own = new Sprite(32,32);
		own.image = core.assets['chara3.png'];
		own.x = 0;
		own.y = 250;
		own.frame = 18;
		
		own.addEventListener('enterframe', function() {
			if (core.input.left && this.x > 0) this.x -= 10;
			if (core.input.right && this.x < 290) this.x += 10;
			// zキー押下で弾発射
			if (core.input.a) new Bullet(this.x + 8, this.y -10);
		});
		core.rootScene.addChild(own);
		core.keybind(90, 'a');

		var enemy = new Enemy(160, 50);

		// 自機の弾
        var Bullet = Class.create(Sprite, {
            initialize: function(x, y) {
                Sprite.call(this, 16, 16);
                this.image = core.assets['icon0.png'];
                this.frame = 48;
                this.x = x;
                this.y = y;
                this.on('enterframe', function() {
                    //常に上に移動
                    this.y -= 10;
                    if (this.intersect(enemy)) {
//                        enemy.frame = 3;
//                        enemy.image = core.assets['effect0.png'];
//                        enemy.frame = 0;
//                        enemy.scaleX = 1;
//                        enemy.scaleY = 1;
                        //弾接触時、爆発エフェクトを表示
                        //1.敵を非表示
                        this.parentNode.removeChild(enemy);
                        //2.弾を非表示
                        this.parentNode.removeChild(this);
                        //2.爆発エフェクトを表示
                        new Effect(this.x, this.y);
                    }
                });
                core.rootScene.addChild(this);
            }
        });

	}
	core.start();

	// 敵クラス
	var Enemy = Class.create(Sprite, {
		initialize: function(x, y) {
			Sprite.call(this, 32, 32);
			this.image = core.assets['chara6.png'];
			this.frame = 6;
			this.x = x;
			this.y = y;
			this.on('enterframe', function() {
			});
			core.rootScene.addChild(this);
		}
	});

	// 爆発エフェクト
	var Effect = Class.create(Sprite, {
		initialize: function(x, y) {
			Sprite.call(this, 16, 16);
			this.image = core.assets['effect0.png'];
			this.frame = 0;
			this.x = x;
			this.y = y;
			this.on('enterframe', function() {
                this.frame++;
                if (this.frame > 5) {
                    this.parentNode.removeChild(this);
                }
            });
			core.rootScene.addChild(this);
		}
	});


};
