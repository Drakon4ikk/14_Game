// определить переменные
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var text;
var winningMessage;
var won = false;
var currentScore = 0;
var winningScore = 100;

// добавить в игру коллекционные предметы
function addItems() {
  items = game.add.physicsGroup();
  createItem(375, 400, 'coin');
  createItem(575, 500, 'coin');
  createItem(225, 500, 'coin');
  createItem(100, 250, 'coin');
  createItem(575, 100, 'coin');
  createItem(525, 300, 'coin');
  createItem(650, 250, 'coin');
  createItem(240, 200, 'coin');
  createItem(290, 200, 'poison');
  createItem(100, 45,'poison');
  createItem(320, 400, 'poison');
  createItem(125, 50, 'star');
}

// добавить платформы в игру
function addPlatforms() {
  platforms = game.add.physicsGroup();
  platforms.create(450, 550, 'platform');
  platforms.create(100, 550, 'platform');
  platforms.create(50, 300, 'platform');
  platforms.create(250, 250, 'platform2');
  platforms.create(650, 300, 'platform');
  platforms.create(350, 140, 'platform');
  platforms.create(700, 180, 'platform');
  platforms.create(300, 450, 'platform2');
  platforms.create(450, 350, 'platform2');
  platforms.create(0, 100, 'platform2');
  platforms.create(-5, 595, 'platform2');
  platforms.create(180, 595, 'platform2');
  platforms.create(365, 595, 'platform2');
  platforms.create(550, 595, 'platform2');
  platforms.create(650, 595 , 'platform2');
  platforms.setAll('body.immovable', true);
}

// создать единый анимированный элемент и добавить на экран
function createItem(left, top, image) {
  var item = items.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
}

// создать значок победителя и добавить на экран
function createBadge() {
  badges = game.add.physicsGroup();
  var badge = badges.create(450, 400, 'badge');
  badge.animations.add('spin');
  badge.animations.play('spin', 10, true);
}

// когда игрок собирает предмет на экране
function itemHandler(player, item) {
  item.kill();
  if (item.key === 'coin') {
     currentScore = currentScore + 10;
  } else if (item.key === 'poison') {
     currentScore = currentScore - 25;
  } else if (item.key === 'star') {
     currentScore = currentScore + 25;
  }
  if (currentScore >= winningScore) {
      createBadge();
  }
}

// когда игрок собирает значок в конце игры
function badgeHandler(player, badge) {
  badge.kill();
  won = true;
}

// настроить игру при загрузке веб-страницы
window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
  
  // до начала игры
  function preload() {
    game.stage.backgroundColor = '#5db1ad';
    
    // Загрузить изображения
    game.load.image('platform', 'platform_1.png');
    game.load.image('platform2', 'platform_2.png');
    
    //Load spritesheets
    game.load.spritesheet('player', 'chalkers.png', 48, 62);
    game.load.spritesheet('coin', 'coin.png', 36, 44);
    game.load.spritesheet('badge', 'badge.png', 42, 54);
    game.load.spritesheet('poison', 'poison.png', 32, 32);
    game.load.spritesheet('star', 'star.png', 32, 32);
  }

  // начальная настройка игры
  function create() {
    player = game.add.sprite(50, 585, 'player');
    player.animations.add('walk');
    player.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 4000;

    addItems();
    addPlatforms();

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    text = game.add.text(16, 16, "SCORE: " + currentScore, { font: "bold 24px Arial", fill: "white" });
    winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
    winningMessage.anchor.setTo(0.5, 1);
  }

  //  пока игра запущена
  function update() {
    text.text = "SCORE: " + currentScore;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    // нажата левая клавиша курсора?
    if (cursors.left.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = -600;
      player.scale.x = - 1  ;
    }
    // нажата правая клавиша курсора?
    else if (cursors.right.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = 600;
      player.scale.x = 1;
    }
    // игрок не двигается
    else {
      player.animations.stop();
    }
    
    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
      player.body.velocity.y = -1000;
    }
    // когда игрок выигрывает игру
    if (won) {
      winningMessage.text = "YOU WIN!!!";
    }
  }

  function render() {

  }

};
