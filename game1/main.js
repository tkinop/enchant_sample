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
    core.preload('gameover.png');
    core.preload('start.png');
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

        // 弾数制限
        var maxBulletNum = 5;
        var activeBulletNum = 0;
        
        // 自機の弾
        var Bullet = Class.create(Sprite, {
            initialize: function(x, y) {

                if (activeBulletNum < maxBulletNum) {
                    Sprite.call(this, 16, 16);
                    this.image = core.assets['icon0.png'];
                    this.frame = 48;
                    this.x = x;
                    this.y = y;
                    this.on('enterframe', function() {
                        //常に上に移動
                        this.y -= 10;
                        for (var i = 0; i < 10; i++) {
                            var enemy = enemies[i];
                            if (this.within(enemy) && !enemy.isIntersect) {
                                //接触済みフラグ
                                enemy.isIntersect = true;
                                //敵座標取得
                                var enemyX = enemy.x + 8;
                                var enemyY = enemy.y + 8;
                                //弾接触時、爆発エフェクトを表示
                                //1.敵を非表示
                                this.parentNode.removeChild(enemy);
                                enemyCount--;
                                //2.弾を非表示
                                this.parentNode.removeChild(this);
                                activeBulletNum--;
                                //3.爆発エフェクトを表示
                                //　敵表示箇所でエフェクト表示
                                new Effect(enemyX, enemyY);
                                break;
                            }
                        }
                        if (this.y < 0) {
                            activeBulletNum--;
                            //弾を非表示
                            this.parentNode.removeChild(this);
                        }
                    });
                    activeBulletNum++;
                    core.rootScene.addChild(this);
                }
            }
        });

        // 敵の弾
        var EnemyBullet = Class.create(Sprite, {
            initialize: function(x, y) {

                if (activeBulletNum < maxBulletNum) {
                    Sprite.call(this, 16, 16);
                    this.image = core.assets['icon0.png'];
                    this.frame = 60;
                    this.x = x;
                    this.y = y;
                    this.on('enterframe', function() {
                        // 常に下に移動
                        this.y += 5;
                        // 自機接触時
                        if (this.within(own)) {
                            // 自機座標取得
                            var ownX = own.x + 8;
                            var ownY = own.y + 8;
                            // 弾接触時、爆発エフェクトを表示
                            // 1.自機を非表示
                            this.parentNode.removeChild(own);
                            // 2.弾を非表示
                            this.parentNode.removeChild(this);
                            // 3.爆発エフェクトを表示
                            // 敵表示箇所でエフェクト表示
                            new Effect(ownX, ownY);
                            // ゲームオーバー処理
                            core.rootScene.tl.delay(10).then(function(){
                                core.replaceScene(createGameoverScene(1)); 
                                core.stop();
                            });
                        } else if (this.y > 320) {
                            // 弾を非表示
                            this.parentNode.removeChild(this);
                        }
                    });
                    core.rootScene.addChild(this);
                }
            }
        });

        // 敵クラス
        var Enemy = Class.create(Sprite, {
            initialize: function(x, y) {
                Sprite.call(this, 32, 32);
                this.image = core.assets['chara6.png'];
                this.frame = 6;
                this.x = x;
                this.y = y;
                this.liveTime = 0;
                this.on('enterframe', function() {
                    this.liveTime++;
                    if (this.liveTime % 32 == 0) new EnemyBullet(this.x + 8, this.y + 24 );
                });

                var isIntersect = false;
                core.rootScene.addChild(this);
            }
        });

        // 爆発エフェクト
        var Effect = Class.create(Sprite, {
            initialize: function(x, y) {
                Sprite.call(this, 16, 16);
                this.image = core.assets['effect0.png'];
                this.frame = 0;
                this.moveTo(x, y);
                this.on('enterframe', function() {
                    this.frame++;
                    if (this.frame > 3) {
                        this.parentNode.removeChild(this);
                    }
                });
                core.rootScene.addChild(this);
            }
        });

        //enemyオブジェクト格納
        var enemies = new Array();
        var enemyMaxCount = 10;
        var enemyCount = 0;

        core.addEventListener('enterframe', function() {
            //enemyオブジェクト作成
            if (enemyCount == 0) {
                for (var i = 0; i < enemyMaxCount; i++) {
                    var ajustLeft = 16;
                    var ajustRight = 32;
                    var ajustTop = 16;
                    enemies[i] = new Enemy(
                        Math.floor( Math.random() * (320 - ajustRight - ajustLeft) + ajustLeft ),
                        Math.floor( Math.random() * (50 - ajustTop) + ajustTop ));
                    enemyCount++;
                }
            }
        });
        
        
        
        var gameoverScene = new Scene();
        gameoverScene.backgroundColor = 'black';

        var createStartScene = function() {
            var scene = new Scene();
            scene.backgroundColor = '#fcc800';
            var startImage = new Sprite(236, 48);
            startImage.image = core.assets['start.png'];
            startImage.x = 42;
            startImage.y = 136;
            scene.addChild(startImage);

            startImage.addEventListener(Event.TOUCH_START, function(e) {
                core.popScene();
            });
            return scene;
        };

        var createGameoverScene = function(resultScore) {
            var scene = new Scene();
            scene.backgroundColor = '#303030';
            var gameoverImage = new Sprite(189, 97);
            gameoverImage.image = core.assets['gameover.png'];
            gameoverImage.x = 65;
            gameoverImage.y = 112;
            scene.addChild(gameoverImage);
            return scene;
        };

        core.pushScene(createStartScene());
        
	}

    core.start();

};
