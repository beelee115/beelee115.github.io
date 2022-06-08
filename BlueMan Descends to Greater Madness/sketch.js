let tileSpriteSheet
let gamemap
let alienSpriteSheet
let alien
let alienSprites
let rows, cols
let tiles = []
let platforms = []
let rez = 2
let viewX = 0
let viewY = 0
let coins = 0
let lives = 3
let coinSound, hitSound, musicSound, jumpSound, deathSound, levelSong
let gameOver = false
let coinCount = 0
let level = 1
var mode = 0;
let jump = 0;
let walk = 0;
let bg;
let enemySpriteSheet, enemySprites, enemies
let greenSlime, yellowSlime, blueSnail, yellowSnail, redFly, blueFly
let idleGreenSlime, idleYellowSlime, idleBlueSnail, idleYellowSnail, idleRedFly, idleBlueFly
let walkingGreenSlime, walkingYellowSlime, walkingBlueSnail, walkingYellowSnail, walkingRedFly, walkingBlueFly

const SPACE = 32

const WALKING_SPEED = 1.75
const JUMP_VELOCITY = 4
const GRAVITY = 0.1

// define player
const PLAYER = '-1'
const ENEMY = '-2'

// define tiles
const TILE_BRICK = '0'
const TILE_EMPTY = '3'

// cloud blocks
const CLOUD_LEFT = '5'
const CLOUD_RIGHT = '6'

// bush blocks
const BUSH_LEFT = '1'
const BUSH_RIGHT = '2'

// mushroom tiles
const MUSHROOM_TOP = '9'
const MUSHROOM_BOTTOM = '10'

// jump block
const JUMP_BLOCK = '4'
const JUMP_BLOCK_HIT = '8';

// pole
const POLE_TOP = '7';
const POLE_MIDDLE = '11';
const POLE_BOT = '15';

// flag
const FLAG_LEFT = '12'
const FLAG_MID = '13'
const FLAG_RIGHT = '14'

const COLLIDABLES = [TILE_BRICK, JUMP_BLOCK, JUMP_BLOCK_HIT, PLAYER, ENEMY]
const JUMP_THROUGH = [MUSHROOM_TOP, CLOUD_LEFT, CLOUD_RIGHT]

// margins
const LEFT_MARGIN = 60;
const VERTICAL_MARGIN = 40;
const RIGHT_MARGIN = 150;

function preload() {
    //load tile sprites for different levels
    tileSpriteSheet = loadImage('graphics/spritesheetTiles_day.png');
    tileSpriteSheet1 = loadImage('graphics/spritesheetTiles_day.png');
    tileSpriteSheet2 = loadImage('graphics/spritesheetTiles_dusk.png');
    tileSpriteSheet3 = loadImage('graphics/spritesheetTiles_sunset.png');
    tileSpriteSheet4 = loadImage('graphics/spritesheetTiles_night.png');

    //load alien for different levels
    alienSpriteSheet = loadImage('graphics/spritesheetAlien_day.png');
    alienSpriteSheet1 = loadImage('graphics/spritesheetAlien_day.png');
    alienSpriteSheet2 = loadImage('graphics/spritesheetAlien_dusk.png');
    alienSpriteSheet3 = loadImage('graphics/spritesheetAlien_sunset.png');
    alienSpriteSheet4 = loadImage('graphics/spritesheetAlien_night.png');

    //load enemy sprites
    enemySpriteSheet= loadImage('graphics/spritesheetEnemies_day.png');
    enemySpriteSheet1 = loadImage('graphics/spritesheetEnemies_day.png');
    enemySpriteSheet2 = loadImage('graphics/spritesheetEnemies_dusk.png');
    enemySpriteSheet3 = loadImage('graphics/spritesheetEnemies_sunset.png');
    enemySpriteSheet4 = loadImage('graphics/spritesheetEnemies_night.png');

    //load gamemaps for different levels
    gamemap1 = loadTable('graphics/gamemap1.csv');
    gamemap2 = loadTable('graphics/gamemap2.csv');
    gamemap3 = loadTable('graphics/gamemap3.csv');
    gamemap4 = loadTable('graphics/gamemap4.csv');

    //load songs
    levelSong = loadSound('graphics/song1.mp3');
    firstSong = loadSound('graphics/song1.mp3');
    secondSong = loadSound('graphics/song2.mp3');
    titleSong = loadSound('sounds/titlesong.mp3.mov');
    gameoverSound = loadSound('sounds/gameover.mp3')
    //load sounds
    mapclearedSound = loadSound('graphics/mapcleared.mp3'); // clear round sound
    coinSound = loadSound('sounds/coin.wav')  // reduce sounds for all of them
    hitSound = loadSound('sounds/hit.wav')
    jumpSound = loadSound('sounds/jump.wav')
    deathSound = loadSound('sounds/death.wav')
    startSound = loadSound('sounds/gamestart.wav')
    killSound = loadSound('sounds/kill.wav')
    //load font
    newFont = loadFont('graphics/gamerFont.ttf');
    //load title screen
    titlecard = loadImage('graphics/float.gif')

    //load backgrounds
    bg = loadImage('graphics/bg_day.png')
    bg1 = loadImage('graphics/bg_day.png')
    bg2 = loadImage('graphics/bg_dusk.png')
    bg3 = loadImage('graphics/bg_sunset.png')
    bg4 = loadImage('graphics/bg_night.png')
}

function setup() {
  createCanvas(850, 480);
  frameRate(48) // game framrate
  init()
}

function createAlien() {
  idleAlien = [alienSprites[0]]
  walkingAlien = alienSprites.slice(2,11)
  jumpingAlien = [alienSprites[1]]

  alien = new AnimatedSprite(idleAlien[0], 50, 0, 'PLAYER', walkingAlien, idleAlien, jumpingAlien)
}

function createEnemies() {
  //Slimes
  walkingGreenSlime = enemySprites.slice(0, 6)
  idleGreenSlime =[enemySprites[0]]
  walkingYellowSlime = enemySprites.slice(6,12)
  idleYellowSlime =[enemySprites[6]]
  // Snails
  walkingBlueSnail = enemySprites.slice(12,18)
  idleBlueSnail = [enemySprites[12]]
  walkingYellowSnail = enemySprites.slice(18,24)
  idleYellowSnail = [enemySprites[18]]
  // Flies
  walkingRedFly = enemySprites.slice(24,30)
  idleRedFly =[enemySprites[24]]
  walkingBlueFly = enemySprites.slice(30,36)
  idleBlueFly =[enemySprites[30]]

  if (level == 1) {
    // level 1 enemies
    redFly = new Enemy(idleRedFly[0], 300, 188, 250, 450, ENEMY, idleRedFly, walkingRedFly)
    blueFly = new Enemy(idleRedFly[0], 300, 540, 310, 415, ENEMY, idleBlueFly, walkingBlueFly)
    yellowSlime = new Enemy(idleYellowSlime[0], 60, 352, 130, 200, ENEMY, idleYellowSlime, walkingYellowSlime)

    enemies = [redFly, yellowSlime, blueFly]
  }
  else if (level == 2) {
    // level 2 enemies
    redFly = new Enemy(idleRedFly[0], 400, 45, 420, 550, ENEMY, idleRedFly, walkingRedFly)
    yellowSlime = new Enemy(idleYellowSlime[0], 430, 224, 520, 580, ENEMY, idleYellowSlime, walkingYellowSlime)
    greenSlime = new Enemy(idleGreenSlime[0], 100, 288, 100, 300, ENEMY, idleGreenSlime, walkingGreenSlime)
    blueSnail = new Enemy(idleBlueSnail[0], 100, 528, 100, 220, ENEMY, idleBlueSnail, walkingBlueSnail)
    blueFly = new Enemy(idleBlueFly[0], 265, 445, 265, 445, ENEMY, idleBlueFly, walkingBlueFly)

    enemies = [redFly, yellowSlime, greenSlime, blueSnail, blueFly]
  }
  else if (level == 3) {
    // level 3 enemies
    redFly = new Enemy(idleRedFly[0], 350, 110, 300, 550, ENEMY, idleRedFly, walkingRedFly)
    blueSnail = new Enemy(idleBlueSnail[0], 200, 288, 290, 400, ENEMY, idleBlueSnail, walkingBlueSnail)
    greenSlime = new Enemy(idleGreenSlime[0], 60, 336, 60, 140, ENEMY, idleGreenSlime, walkingGreenSlime)
    yellowSlime = new Enemy(idleYellowSlime[0], 200, 480, 295, 420, ENEMY, idleYellowSlime, walkingYellowSlime)
    blueFly = new Enemy(idleBlueFly[0], 80, 500, 80, 220, ENEMY, idleBlueFly, walkingBlueFly)
    enemies = [redFly, blueSnail, greenSlime, yellowSlime, blueFly]
  }
  else if (level == 4) {
    // level 4 enemies
    yellowSnail = new Enemy(idleYellowSnail[0], 50, 160, 50, 125, ENEMY, idleYellowSnail, walkingYellowSnail)
    blueSnail = new Enemy(idleBlueSnail[0], 250, 192, 255, 330, ENEMY, idleBlueSnail, walkingBlueSnail)
    greenSlime = new Enemy(idleGreenSlime[0], 50, 336, 50, 140, ENEMY, idleGreenSlime, walkingGreenSlime)
    yellowSlime = new Enemy(idleYellowSlime[0], 80, 480, 80, 180, ENEMY, idleYellowSlime, walkingYellowSlime)
    blueFly = new Enemy(idleBlueFly[0], 230, 300, 230, 360, ENEMY, idleBlueFly, walkingBlueFly)
    redFly = new Enemy(idleRedFly[0], 545, 550, 545, 610, ENEMY, idleRedFly, walkingRedFly)
    enemies = [yellowSnail, greenSlime, yellowSlime, blueSnail, blueFly, redFly]
  }
}

function createPlatforms(gamemap) {
  platforms = []
  coinCount = 0
  rows = gamemap.getRowCount()
  cols = gamemap.getColumnCount()

  rows = gamemap.getRowCount();
  cols = gamemap.getColumnCount();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let spriteIndex = gamemap.getString(r, c)
      let sprite = tiles[spriteIndex]
      let tile = new Sprite(sprite, sprite.width * c, sprite.height * r, spriteIndex)
      platforms.push(tile)
      if (spriteIndex == JUMP_BLOCK) {
        coinCount++
      }
    }
  }

}

function init() {
  if (mode == 0) {
    viewX = 0
    viewY = 0
    titleSong.loop()
    titleSong.setVolume(0.1)
  }
  if (mode == 1) {
    viewX = 0
    viewY = 0
    coins = 0
    lives = 3

    tiles = generateTiles(tileSpriteSheet, 16, 16);
    createPlatforms(gamemap);

    alienSprites = generateTiles(alienSpriteSheet, 16, 20)
    createAlien()

    enemySprites = generateTiles(enemySpriteSheet, 16, 20)
    createEnemies()

    levelSong.loop()
    levelSong.setVolume(0.1)
  }
}

function draw() {
  if (mode == 0) {
    scale(rez)
    for (let tile of platforms) {
      tile.display()
    }
    image(titlecard, 0, 0, width / rez, height / rez)
    stroke(0,0,0,0)
		fill('#F6FFE8')
		textAlign(CENTER);
		textSize(14)
		textFont(newFont)
		text('BLUE MAN DESCENDS TO MADNESS', width/4 + viewX, height/4 + viewY - 80)
		textSize(12)
		text('Press ENTER to start', width/4 + viewX, height/4 + 50 + viewY - 15);
		textSize(8)
    stroke('#DDF8EB')
		fill('#0B0E12')
		text('Made By: Annica & Jenylee Pd.1',  width/4 + viewX, height/4 +100 + viewY + 10);
  }
  //transition to actual game
  else if (mode == 1) {
    background(bg)
    scale(rez)
    scroll()
    for (let tile of platforms) {
      tile.display()
    }

    alien.display()
    resolvePlatformCollisions(alien, platforms)

    for (let enemy of enemies) {
      enemy.display()
      enemy.update()
    }
    checkGameOver()
    displayScore()
  }
}

function checkGameOver() {
  if (!gameOver) {
    checkDeath()
    enemyCollision()
  }
  if (lives == 0) {
    // game over
    stroke(0,0,0,0)
    textSize(10)
    textFont(newFont)
    fill('white')
    textAlign(CENTER)
    text("Game Over", width/4 + viewX, height/4 + viewY)
    text("Click to Restart", width/4 + viewX, height/4 + 20 + viewY)
    levelSong.stop()
    gameoverSound.play()
    gameoverSound.setVolume(0.3)
    noLoop()
  }

  else if (coins == coinCount) {
    fill(255, 0, 0)
    textAlign(CENTER)
    if (level == 4) {
      stroke(0,0,0,0)
      textSize(10)
      textFont(newFont)
      text("Congrats, you cleared all the levels!", width/4 + viewX, height/4 +viewY)
      text("Click to Restart", width/4 + viewX, height/4 + 20 + viewY)
    }
    else {
      stroke(0,0,0,0)
      textSize(10)
      textFont(newFont)
      text("You collected all the coins!", width/4 + viewX, height/4 +viewY)
      text("Click to Proceed", width/4 + viewX, height/4 + 20 + viewY)
    }

    levelSong.stop()
    mapclearedSound.play()
    mapclearedSound.setVolume(0.1)
    gameOver = true
    noLoop()

    if (level == 1) { //changes to LEVEL 2
      gamemap = gamemap2
      levelSong = firstSong
      tileSpriteSheet = tileSpriteSheet2
      alienSpriteSheet = alienSpriteSheet2
      enemySpriteSheet = enemySpriteSheet2
      bg = bg2
      level += 1
    }
    else if (level == 2) { //changes to LEVEL 3
      gamemap = gamemap3
      levelSong = secondSong
      tileSpriteSheet = tileSpriteSheet3
      alienSpriteSheet = alienSpriteSheet3
      enemySpriteSheet = enemySpriteSheet3
      bg = bg3
      level += 1
    }
    else if (level == 3) { //changes to LEVEL 4
      gamemap = gamemap4
      levelSong = secondSong
      tileSpriteSheet = tileSpriteSheet4
      alienSpriteSheet = alienSpriteSheet4
      enemySpriteSheet = enemySpriteSheet4
      bg = bg4
      level += 1
    }
    else if (level == 4) { //changes to LEVEL 1
      mode = 0
      level = 1
      tileSpriteSheet = null
      alienSpriteSheet = null
      enemySpriteSheet = null
      levelSong = null
    }
  }
 }

function mousePressed() {
  if (gameOver) {
    gameOver = false
    mapclearedSound.stop()
    gameoverSound.stop()
    init()
    loop()
  }
}
function enemyCollision() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (alien.dy > 0 && checkCollision(alien, enemies[i])) {
      enemies.splice(i, 1)
      killSound.play()
      killSound.setVolume(0.1)
      break
    }
  }
}

function checkDeath() {
  if (alien.getTop() > rows * 16 + 1000 || ((checkCollisionList(alien, enemies).length) && alien.dy == 0)) {
    lives--
    if (lives <= 0) {
      gameOver = true
    }
    else {
      deathSound.play()
      deathSound.setVolume(0.1)
      viewX = 0
      viewY = 0
      translate(viewX, viewY)
      alien.x = 50
      alien.y = 0
    }
  }
}

function displayScore() {
  stroke(0,0,0,0)
  fill('white')
  textAlign(LEFT)
  textSize(10)
  textFont(newFont)
  text("Coins: " + coins, viewX + 15, viewY + 20)
  text("Lives: " + lives, viewX +15, viewY +35)
  // display time/countdown


}

function scroll() {
  let rightBound = viewX + width / rez - RIGHT_MARGIN
  // here our backdrop ends at an x value of 260
  if (alien.getRight() > rightBound && viewX < 260) { // Test if it work for new gamemap(change 260 when using a new gamemap)
    viewX += alien.getRight() - rightBound
  }

  let leftBound = viewX + LEFT_MARGIN
  if (alien.getLeft() < leftBound && viewX > 0) {
    viewX -= leftBound - alien.getLeft()
  }

  let bottomBound = viewY + height / rez - VERTICAL_MARGIN
  if (alien.getBottom() > bottomBound) {
    viewY += alien.getBottom() - bottomBound
  }

  let topBound = viewY + VERTICAL_MARGIN
  if (alien.getTop() < topBound) {
    viewY -= topBound - alien.getTop()
  }

  translate(-viewX, -viewY)
}

//Also updates alien's position
function resolvePlatformCollisions(s, list){ // creates gravity as well
  s.dy += GRAVITY
  s.y += s.dy

  let collisions = checkCollisionList(s, list)
  if (collisions.length > 0) {
    let collided = collisions[0]
    if (s.dy > 0) {
      //falling down so bottom of alien gets top of collided
      s.setBottom(collided.getTop())
    }
    else if (s.dy < 0) {
      //alien is jumping
      s.setTop(collided.getBottom())

      // check if jump block is hit
      if (collided.type == JUMP_BLOCK) {
        collided.img = tiles[JUMP_BLOCK_HIT]
        collided.type = JUMP_BLOCK_HIT
        coinSound.play()
        coinSound.setVolume(0.2)
        coins++
      }
      else if (collided.type == JUMP_BLOCK_HIT) {
        hitSound.play()
        hitSound.setVolume(0.2)
      }
    }
    s.dy = 0
  }

  // check left and right
    s.x += s.dx
    collisions = checkCollisionList(s, list)
  if (collisions.length > 0) {
    let collided = collisions[0]
    // moving right
    if (s.dx > 0) {
      s.setRight(collided.getLeft())
    }
    // moving left
    else if (s.dx < 0) {
      s.setLeft(collided.getRight())
    }
  }
}

function keyPressed() {
  if (keyCode==ENTER && mode == 0) {
    mode = 1
    titleSong.stop()
    startSound.play()
    ///////////// set up level 1
    gamemap = gamemap1
    levelSong = firstSong
    //////////////
    init()
  }

  if (!gameOver) {
    if (keyCode == LEFT_ARROW) {
      walk = 1
      alien.dx = -WALKING_SPEED
      alien.state = 'walking'
    }
    else if (keyCode == RIGHT_ARROW) {
      walk = 1
      alien.dx = WALKING_SPEED
      alien.state = 'walking'
    }
    else if (keyCode == SPACE && isOnPlatform(alien, platforms)) {
      alien.dy = -JUMP_VELOCITY
      alien.state = 'jumping'
      jumpSound.play()
      jumpSound.setVolume(0.2)
    }
    else {
      alien.state = 'idle'
    }
  }
}

function keyReleased() {
  if (keyCode == LEFT_ARROW) {
    walk = 0
    alien.dx = 0
    alien.state = 'idle'
  }
  if (keyCode == RIGHT_ARROW) {
    walk = 0
    alien.dx = 0
    alien.state = 'idle'
  }
  if (keyCode == SPACE) {
    alien.dy = 0
    if (walk == 1)
    {
      alien.state = 'walking'
    }
    else
    {
      alien.state = 'idle'
    }
  }
}

function checkCollision(s1, s2) {

  let noXOverlap = s1.getRight() <= s2.getLeft() || s1.getLeft() >= s2.getRight()
  let noYOverlap = s1.getBottom() <= s2.getTop() || s1.getTop() >= s2.getBottom()

  if (noXOverlap || noYOverlap) {
    return false
  }
  else {
    return true
  }
}


function checkCollisionList(s, list) {

    let collisionList = []
    for(let sprite of list) {
      if (checkCollision(s, sprite) && sprite.collidable) {
        collisionList.push(sprite)
      }
      if (checkCollision(s, sprite) && sprite.jumpthru && s.getBottom() >= sprite.getTop())
      {
        //collisionList.push(sprite)
        if ((s.dy >= 0)) {
          collisionList.push(sprite)
        }
      }
    }
    return collisionList
  }


function isOnPlatform(s, list) {
  s.y += 5
  let collisions = checkCollisionList(s, list)
  s.y -= 5
  if (collisions.length > 0) {
    return true
  }
  else {
    return false
  }
}