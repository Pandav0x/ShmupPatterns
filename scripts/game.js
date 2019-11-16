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

