import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

declare var Phaser;

@Component({
  selector: 'page-oyun',
  templateUrl: 'oyun.html',
})
export class OyunPage {
	

  game = new Phaser.Game(300, 500, Phaser.AUTO, 'gameArea',{ preload: preload, create: create, update: update });

  constructor(public navCtrl: NavController, public navParams: NavParams,public plt: Platform) {

  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad OyunPage');
  }


  hareketSol(){
  	 player.body.velocity.x = -150;
     player.animations.play('left');
  }

  hareketSag(){
  	player.body.velocity.x = 150;
    player.animations.play('right');
  }

}



function preload() {

    this.game.load.image('sky', 'assets/sky.png');
    this.game.load.image('ground', 'assets/platform.png');
    this.game.load.image('star', 'assets/star.png');
    this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

}

var player;
var platforms;
var cursors;

var stars;

var score = 0;
var scoreText;

function create() {

	    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    this.game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, this.game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');

    ledge.body.immovable = true;

    /////// KARKTERİ EKLİYORUZ
        // The player and its settings
    player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
  	player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    			// YILDIZLAR

     //  Finally some stars to collect
    stars = this.game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    // SKOR
    scoreText = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    
    ///KONTROL İÇİN
      //  Our controls.
    cursors = this.game.input.keyboard.createCursorKeys();
}

function update() {
	//  Collide the player and the stars with the platforms
    this.game.physics.arcade.collide(player, platforms);

    this.game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.game.physics.arcade.overlap(player, stars, collectStar, null, this);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
}


function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    score += 10;
    scoreText.text = 'Score: ' + score;

}

