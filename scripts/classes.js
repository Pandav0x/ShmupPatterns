'use strict';

class Point{
    x = 0;
    y = 0;

    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

class BulletCollection{
    context = null;
    bulletNumber = null;
    bullets = [];
    movePattern;
    spriteName;

    constructor(context, origX, origY, spriteName, bulletNumber, movePattern) {
        this.context = context;
        this.origin = new Point(origX, origY);
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

    constructor(context, origX, origY){
        this.context = context;
        this.position = new Point(origX, origY);
    }
    move = function(){}
}

const BulletPatternShape = {
    UP_STREAM: 0,
    CIRCLE: 1,
    DIAMOND: 2
};


class Actor{
    context = null;
    sprite = null;
    fireRate = null;
    moveSpeed = 5;
    bullets;

    constructor(context, coordX, coordY, spriteName, fireRate){
        this.context = context;
        this.coordinate = new Point(coordX, coordY);
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
            30,
            function(){
                //CIRCLE
                //*
                this.position.x += (90*Math.cos(this.angle))*this.speed;
                this.position.y += (90*Math.sin(this.angle))*this.speed;
                //*/
                //DIAMOND
                /*
                this.position.x += (120*Math.pow(Math.cos(this.angle), 3))*this.speed;
                this.position.y += (120*Math.pow(Math.sin(this.angle), 3))*this.speed;
                //*/
                if( this.position.x > gameConfig.width || this.position.x < 0 || this.position.y > gameConfig.height || this.position.y < 0)
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
            () =>{
                this.position.y += (90*Math.sin(-1))*this.speed;
                if( this.position.x > gameConfig.width || this.position.x < 0 || this.position.y > gameConfig.height || this.position.y < 0)
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
