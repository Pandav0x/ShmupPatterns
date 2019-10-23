'use strict';

var redirectTo = "./redirect.html";
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

    this.load.image('enemy', this.resourceLocation + "enemy.png");
    this.load.image('bullet', this.resourceLocation + "bullet.png")
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

}

function update ()
{
    this.enemy.shoot();

    var cursors = this.input.keyboard.createCursorKeys();
    if(cursors.up.isDown){
        this.enemy.moveUp();
    }
    else if(cursors.down.isDown){
        this.enemy.moveDown();
    }
    else if (cursors.left.isDown){
        this.enemy.moveLeft();
    }
    else if (cursors.right.isDown){
        this.enemy.moveRight();
    }
}

class Enemy{
    context = null;
    firerate = 750;
    sprite = null;
    moveSpeed = 5;
    coordinate = {
        x: null,
        y: null
    };
    bullets;

    constructor(context, coordX, coordY){
        this.context = context;
        this.coordinate.x = coordX;
        this.coordinate.y = coordY;
        this.bullets = new BulletCollection(context, this.coordinate.x, this.coordinate.y);
        this.sprite = this.context.add.sprite(this.coordinate.x, this.coordinate.y, 'enemy').setScale(spriteScale);
        this.draw();
        this.behavior();
    }
    shoot = function() {
        this.bullets.moveAll();
    }
    draw = function(){
        this.bullets.setPosition(this.coordinate.x, this.coordinate.y);
        this.sprite.x = this.coordinate.x;
        this.sprite.y = this.coordinate.y;
    }
    behavior = function() {
        var bullets =  this.bullets;
        this.context.time.addEvent({
            delay: this.firerate,
            callback: function(){
                bullets.createBullets();
            },
            loop: true
        });
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

class BulletCollection{
    context = null;
    bulletNumber = 4;
    bullets = [];
    origin = {
        x: null,
        y: null
    };

    constructor(context, origX, origY) {
        this.context = context;
        this.origin.x = origX;
        this.origin.y = origY;
    }
    moveAll = function(){
        if(this.bullets.length === 0)
            return;
        this.bullets.forEach(function(bullet, index, parent){
            if(!bullet.move())
                parent.splice(index, 1);
                console.log()
        });
    }
    createBullets = function(){
        var bulletNumber = this.bullets.length | 0;
        for(let i = bulletNumber; i < (this.bulletNumber + bulletNumber); i++){
            this.bullets[i] = new Bullet(this.context, this.origin.x, this.origin.y);
            var degAngle = i * (360/this.bulletNumber);
            var radAngle = degAngle * Math.PI / 180;
            this.bullets[i].angle =  radAngle;
            this.bullets[i].sprite = this.context.add.sprite(this.bullets[i].x, this.bullets[i].y, 'bullet');
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
    move = function(){
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

}
