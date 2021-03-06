![Shmup Patterns](.readme/project_title.png)

# ShmupPatterns

Do you know Shoot'em up - or Shmups for the initiates - and more specifically, the Japanese hardcore Shmups (named Danmaku 弾幕, lit. bullet curtain) ? It has always facinated me how pretty and complex those patterns are. [Here](https://en.wikipedia.org/wiki/Shoot_%27em_up#Bullet_hell) is the wikipedia paragraph about it, and [here](https://en.touhouwiki.net/wiki/Danmaku) a more complete definition from the Touhou wiki.

This project was only for test purposes. I wanted to experiment on the maths and more generally, the code's structure that would ease the creation of such a game.

Development is not intended to go further.

## Getting Started

* `git clone` or download it.
* put it in a web server so you can avoid XHR errors due to CORS policy (or deal with it another way).
* browse to **127.0.0.1/ShmupPatterns/** to get to the page.

Be aware that the library I'm using for the game is included via a CDN call, which might result in a long loading if you have a weak internet connection.

## Result

I was able to easily change the number of bullets per waves and the waves intervals. Shown below is the same bullet behavior with **6** and **200** bullets.

|6|200|
|:-:|:-:|
|<image src=".readme/bullets_6.gif" width="200px"/>|<image src=".readme/bullets_200.gif" width="200px"/>|

As we can see, as the number of bullets increase, some bullets become stray. I think this is due to WebGL getting too many entities to display on the canvas.

I was also able to propose three patterns for the bullets:

|circle|diamond|double_eight|
|:-:|:-:|:-:|
|<image src=".readme/bullets_c_30.gif" width="200px"/>|<image src=".readme/bullets_d_30.gif" width="200px"/>|<image src=".readme/bullets_de_30.gif" width="200px"/>|

The formulas for a given bullet **B(x,y,θ,v)** with **x** and **y** the coordinates of the bullet on the canvas, **θ** its angle from its source and **v** its speed:

||Circle|Diamond|Double eight|
|:-:|:-:|:-:|:-:|
|new **x** (named **x'**)|`x'=x+90*cos(θ)*v`|`x'=x+120*(cos(θ)^3)*v`|`x'=x+120*(cos(θ)^3))*tan(θ)*v`|
|new **y** (named **y'**)|`y'=x+90*cos(θ)*y`|`y'=y+120*(cos(θ)^3)*v`|`y'=y+120*(cos(θ)^3))*tan(θ)*v`|

Those Three examples are with a 'standard' **30** bullets per shot. I found it to be the optimal amount of bullets as we can clearly identify the pattern while not having WebGL dying too much.

Here are the last two patterns (I named them **diamond** and **double_eight**) with **200** bullets:

|diamond 200|double_eight 200|
|:-:|:-:|
|<image src=".readme/bullets_d_200.gif" width="200px"/>|<image src=".readme/bullets_de_200.gif" width="200px"/>|

The little triangle on the bottom right is the player, it was intended to interact with the bullets, but was just a mean for me to put extra bullets to benchmark WebGL and make il look like a more or less real game prototype.

## What I've learned

* Danmaku patterns are too complex to only be tackle down by an algebra formula. As further searches on the internet had proved me, it will be easier to use a scripting language to detail the bullet behavior.
* Some math I guess.

## Built With

* [Phaser3](https://github.com/photonstorm/phaser) v3.19.0 (included via CDN).
* Javascript, no external library (apart from Phaser obviously).
* All assets are free, you can use them if you'd like (I made them).

## Acknowledgments

* Phaser, for the framework.
* Github user [@Sparen](https://github.com/sparen) for his Danmakufu tutorials available [here](https://sparen.github.io/ph3tutorials/ph3u1l11.html).
