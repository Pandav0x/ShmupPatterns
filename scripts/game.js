'use strict';

var redirectTo = "./redirect.html";
var spriteScale = 1.5;
var bulletNumber = 100;

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
    this.enemy = this.add.sprite((gameConfig.width/2), (gameConfig.height/2), 'enemy').setScale(spriteScale);

    this.bullets = [];
    for(let i = 0; i < bulletNumber; i++){
        this.bullets[i] = new Bullet();
        this.bullets[i].angle = i * 10;
        this.bullets[i].image = this.add.sprite(this.bullets[i].x, this.bullets[i].y, 'bullet');

    }

}

function update ()
{
    for(let i = 0; i < bulletNumber; i++){
       this.bullets[i].move();
        console.log(i + ":{x:" + this.bullets[i].x + ",y:" + this.bullets[i].y + "}");
    }
}

class Bullet{
    x = (gameConfig.width/2);
    y = (gameConfig.height/2);
    speed = 0.05;
    move = function(){
        this.x += (90*Math.cos(this.angle))*this.speed;
        this.y += (90*Math.sin(this.angle))*this.speed;
        this.image.x = this.x;
        this.image.y = this.y;
    }

}
