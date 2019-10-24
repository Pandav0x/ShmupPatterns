'use strict';

var spriteScale = 1.5;

var gameConfig = {
    type: Phaser.AUTO,
    width: 500 * spriteScale,
    height: 500 * spriteScale,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    }
};

var game = new Phaser.Game(gameConfig);

function preload ()
{
    this.resourceLocation = "./assets/";

    this.load.image('player', this.resourceLocation + "player/sprite.png");
    this.load.image('player_bullet', this.resourceLocation + "player/bullet.png");

    this.load.image('enemy', this.resourceLocation + "enemy/sprite.png");
    this.load.image('enemy_bullet', this.resourceLocation + "enemy/bullet.png");

    this.fireKey = this.scene.scene.input.keyboard.addKey('W'); //why not ?
}

function create ()
{
    //bounds
    var bounds = {
        top: true,
        bottom: true,
        left: true,
        right: true
    };
    this.physics.world.setBounds = bounds;

    //enemy
    this.enemy = new Enemy(this, (gameConfig.width/2), (gameConfig.height/2));

    //player
    this.player = new Player(this, (3 * (gameConfig.width/4)), (3 * (gameConfig.height/4)));

}

function update ()
{
    this.enemy.update();
    this.player.update();

    var cursors = this.input.keyboard.createCursorKeys();
    if(cursors.up.isDown){
        this.player.moveUp();
    }
    else if(cursors.down.isDown){
        this.player.moveDown();
    }
    else if (cursors.left.isDown){
        this.player.moveLeft();
    }
    else if (cursors.right.isDown){
        this.player.moveRight();
    }

    if(this.fireKey.isDown){
        this.player.shoot();
    }
}

class BulletCollection{
    context = null;
    bulletNumber = null;
    bullets = [];
    origin = {
        x: null,
        y: null
    };
    movePattern;
    spriteName;

    constructor(context, origX, origY, spriteName, bulletNumber, movePattern) {
        this.context = context;
        this.origin.x = origX;
        this.origin.y = origY;
        this.movePattern = movePattern;
        this.spriteName = spriteName;
        this.bulletNumber = bulletNumber;
    }
    moveAll = function(){
        if(this.bullets.length === 0)
            return;
        this.bullets.forEach(function(bullet, index, parent){
            if(!bullet.move())
                parent.splice(index, 1);
        });
    }
    createBullets = function(){
        var bulletNumber = this.bullets.length | 0;
        for(let i = bulletNumber; i < (this.bulletNumber + bulletNumber); i++){
            this.bullets[i] = new Bullet(this.context, this.origin.x, this.origin.y);
            this.bullets[i].move = this.movePattern;
            var degAngle = i * (360/this.bulletNumber);
            var radAngle = degAngle * Math.PI / 180;
            this.bullets[i].angle =  radAngle;
            this.bullets[i].sprite = this.context.add.sprite(this.bullets[i].x, this.bullets[i].y, this.spriteName).setScale(spriteScale);
        }
    }
    setPosition = function(newX, newY) {
        this.origin.x = newX;
        this.origin.y = newY;
    }
}

class Bullet{
    context = null;
    sprite = null;
    speed = 0.05;
    position = {
        x: null,
        y: null
    };

    constructor(context, origX, origY){
        this.context = context;
        this.position.x = origX;
        this.position.y = origY;
    }
    move = function(){}
}

class Actor{
    context = null;
    sprite = null;
    fireRate = null;
    moveSpeed = 5;
    coordinate = {
        x: null,
        y: null
    };
    bullets;

    constructor(context, coordX, coordY, spriteName, fireRate){
        this.context = context;
        this.coordinate.x = coordX;
        this.coordinate.y = coordY;
        this.fireRate = fireRate;
        this.sprite = this.context.add.sprite(this.coordinate.x, this.coordinate.y, spriteName).setScale(spriteScale);
        this.bullets = new BulletCollection();
        this.draw();
    }
    update = function() {
        this.bullets.moveAll();
    }
    draw = function(){
        this.bullets.setPosition(this.coordinate.x, this.coordinate.y);
        this.sprite.x = this.coordinate.x;
        this.sprite.y = this.coordinate.y;
    }
    moveUp = function(){
        this.coordinate.y -= this.moveSpeed;
        this.draw();
    };
    moveDown = function(){
        this.coordinate.y += this.moveSpeed;
        this.draw();
    };
    moveLeft = function(){
        this.coordinate.x -= this.moveSpeed;
        this.draw();
    };
    moveRight = function(){
        this.coordinate.x += this.moveSpeed;
        this.draw();
    };
}

class Enemy extends Actor{
    constructor(context, coordX, coordY){
        super(context, coordX, coordY, 'enemy', 750);
        this.bullets = new BulletCollection(
            context,
            this.coordinate.x,
            this.coordinate.y,
            'enemy_bullet',
            4,
            function(){
                this.position.x += (90*Math.cos(this.angle))*this.speed;
                this.position.y += (90*Math.sin(this.angle))*this.speed;
                if(this.position.x > gameConfig.width || this.position.x < 0 || this.position.y > gameConfig.height || this.position.y < 0)
                {
                    this.sprite.destroy();
                    return false;
                }
                this.sprite.x = this.position.x;
                this.sprite.y = this.position.y;
                return true;
            }
        );
        this.shoot();
    }
    shoot = function() {
        var bullets =  this.bullets;
        this.context.time.addEvent({
            delay: this.fireRate,
            callback: function(){
                bullets.createBullets();
            },
            loop: true
        });
    }
}

class Player extends Actor{
    constructor(context, coordX, coordY){
        super(context, coordX, coordY, 'player', 100);
        this.bullets = new BulletCollection(
            context,
            this.coordinate.x,
            this.coordinate.y,
            'player_bullet',
            1,
            function(){
                this.position.y += (90*Math.sin(-1))*this.speed;
                if(this.position.x > gameConfig.width || this.position.x < 0 || this.position.y > gameConfig.height || this.position.y < 0)
                {
                    this.sprite.destroy();
                    return false;
                }
                this.sprite.x = this.position.x;
                this.sprite.y = this.position.y;
                return true;
            }
        );
    }
    shoot = function(){
        if(typeof(this.lastTimeShot) == 'undefined' || (new Date() - this.lastTimeShot) >= this.fireRate){
            this.lastTimeShot = new Date();
            this.bullets.createBullets();
        }
    }
}
