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
var c1, c2;


const SPACE = 32

const WALKING_SPEED = 3
const JUMP_VELOCITY = 10
const GRAVITY = 0.6

// define player
const PLAYER = '-1'

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

const COLLIDABLES = [TILE_BRICK, JUMP_BLOCK, JUMP_BLOCK_HIT, MUSHROOM_TOP, CLOUD_LEFT, CLOUD_RIGHT, PLAYER]

// margins
const LEFT_MARGIN = 60;
const VERTICAL_MARGIN = 40;
const RIGHT_MARGIN = 150;

function preload() {
    //load tile sprites for different levels
    tileSpriteSheet = loadImage('graphics/spritesheet1.png');
    tileSpriteSheet1 = loadImage('graphics/spritesheet1.png');
    tileSpriteSheet2 = loadImage('graphics/spritesheet2.png');
    tileSpriteSheet3 = loadImage('graphics/spritesheet3.png');
    tileSpriteSheet4 = loadImage('graphics/spritesheet4.png');
    //load alien for different levels
    alienSpriteSheet = loadImage('graphics/blue_alien1.png');
    alienSpriteSheet1 = loadImage('graphics/blue_alien1.png');
    alienSpriteSheet2 = loadImage('graphics/blue_alien2.png');
    alienSpriteSheet3 = loadImage('graphics/blue_alien3.png');
    alienSpriteSheet4 = loadImage('graphics/blue_alien4.png');
    //load gamemaps for different levels
    gamemap = loadTable('graphics/gamemap1.csv');
    gamemap1 = loadTable('graphics/gamemap1.csv');
    gamemap2 = loadTable('graphics/gamemap2.csv');
    gamemap3 = loadTable('graphics/gamemap3.csv');
    gamemap4 = loadTable('graphics/gamemap4.csv')
    //load songs
    levelSong = loadSound('graphics/song1.mp3');
    level1Song = loadSound('graphics/song1.mp3');
    level2Song = loadSound('graphics/song2.mp3');
    level3Song = loadSound('graphics/song3.mp3');
    level4Song =loadSound('graphics/song4.mp3');
    //load sounds
    mapclearedSound = loadSound('graphics/mapcleared.mp3'); // clear round sound
    coinSound = loadSound('sounds/coin.wav')  // reduce sounds for all of them
    hitSound = loadSound('sounds/hit.wav')
    jumpSound = loadSound('sounds/jump.wav')
    deathSound = loadSound('sounds/death.wav')
}

function setup() {
  createCanvas(850, 480);
  frameRate(30) // slows alien down
  init()
  // Define colors
  c1 = color('#8FCCDD');
  c2 = color('#B8E2ED');
}

function createAlien() {
  idleAlien = [alienSprites[0]]
  walkingAlien = alienSprites.slice(7,11)
  jumpingAlien = [alienSprites[3]]

  alien = new AnimatedSprite(idleAlien[0], 50, 0, 'PLAYER', walkingAlien, idleAlien, jumpingAlien)
  // alien = new AnimatedSprite(idleAlien[0], 160, 188, 'PLAYER', walkingAlien, idleAlien, jumpingAlien)

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
  viewX = 0
  viewY = 0
  coins = 0
  lives = 3

  tiles = generateTiles(tileSpriteSheet, 16, 16);

  createPlatforms(gamemap);
  alienSprites = generateTiles(alienSpriteSheet, 16, 20)
  createAlien()
}

function draw() {
  setGradient(c1, c2);
  scale(rez)
  scroll()
  for (let tile of platforms) {
    tile.display()
  }

  alien.display()
  resolvePlatformCollisions(alien, platforms)

  checkGameOver()
  displayScore()
}

function checkGameOver() {
  if (!gameOver) {
    checkDeath()
  }
  if (lives == 0) {
    // game over
    fill(255, 0, 0)
    textAlign(CENTER)
    text("Game Over", width/4 + viewX, height/4 + viewY)
    text("Click to Restart", width/4 + viewX, height/4 + 20 + viewY)
    noLoop()
  }

  else if (coins == coinCount) {
    fill(255, 0, 0)
    textAlign(CENTER)
    if (level == 4) {
      text("Congrats, you cleared all the levels!", width/4 + viewX, height/4 +viewY)
      text("Click to Restart", width/4 + viewX, height/4 + 20 + viewY)
    }
    else {
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
      c1 = color('#F0889B')
      c2 = color('#F2B575')
      tileSpriteSheet = tileSpriteSheet2
      alienSpriteSheet = alienSpriteSheet2
      levelSong = level2Song
      level += 1
    }
    else if (level == 2) { //changes to LEVEL 3
      gamemap = gamemap3
      c1 = color('#383E60')
      c2 = color('#94554E')
      tileSpriteSheet = tileSpriteSheet3
      alienSpriteSheet = alienSpriteSheet3
      levelSong = level3Song
      level += 1
    }
    else if (level == 3) { //changes to LEVEL 4
      gamemap = gamemap4
      c1 = color('#000F41')
      c2 = color('#0E297E')
      tileSpriteSheet = tileSpriteSheet4
      alienSpriteSheet = alienSpriteSheet4
      levelSong = level4Song
      level += 1
    }
    else if (level == 4) { //changes to LEVEL 1
      gamemap = gamemap1
      c1 = color('#8FCCDD')
      c2 = color('#B8E2ED')
      tileSpriteSheet = tileSpriteSheet1
      alienSpriteSheet = alienSpriteSheet1
      levelSong = level1Song
      level = 1
    }
  }
 }

function mousePressed() {
  if (gameOver) {
    gameOver = false
    init()
    loop()
  }
}

function checkDeath() {
  if (alien.getTop() > rows * 16 + 1000) {
    lives--
    levelSong.stop()
    if (lives == 0) {
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
  fill('red')
  textAlign(LEFT)
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
  if (!gameOver) {
    if (keyCode == LEFT_ARROW) {
      alien.dx = -WALKING_SPEED
      alien.state = 'walking'
    }
    else if (keyCode == RIGHT_ARROW) {
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
    if (!levelSong.isPlaying()) {
      levelSong.play()
      levelSong.setVolume(0.1)
    }
  }
}

function keyReleased() {
  if (keyCode == LEFT_ARROW) {
    alien.dx = 0
    alien.state = 'idle'
  }
  else if (keyCode == RIGHT_ARROW) {
    alien.dx = 0
    alien.state = 'idle'
  }
  else if (keyCode == SPACE) {
    alien.dy = 0
    alien.state = 'idle'
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

//gradient bg
function setGradient(c1, c2) {
  for (var y = 0; y < height; y++) {
    var inter = map(y, 0, height, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}