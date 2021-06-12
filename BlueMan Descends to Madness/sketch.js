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
var c1, c2, c3, c4;
var mode = 0;

let jump = 0
let walkR = 0
let walkL = 0


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
  tileSpriteSheet1 = loadImage('graphics/spritesheet1.png');
  tileSpriteSheet2 = loadImage('graphics/spritesheet2.png');
  tileSpriteSheet3 = loadImage('graphics/spritesheet3.png');
  tileSpriteSheet4 = loadImage('graphics/spritesheet4.png');
  //load alien for different levels
  alienSpriteSheet1 = loadImage('graphics/blue_alien1.png');
  alienSpriteSheet2 = loadImage('graphics/blue_alien2.png');
  alienSpriteSheet3 = loadImage('graphics/blue_alien3.png');
  alienSpriteSheet4 = loadImage('graphics/blue_alien4.png');
  //load gamemaps for different levels
  gamemap1 = loadTable('graphics/gamemap1.csv');
  gamemap2 = loadTable('graphics/gamemap2.csv');
  gamemap3 = loadTable('graphics/gamemap3.csv');
  gamemap4 = loadTable('graphics/gamemap4.csv')
  //load songs
  level1Song = loadSound('sounds/song1.mp3');
  level2Song = loadSound('sounds/song2.mp3');
  level3Song = loadSound('sounds/song3.mp3');
  level4Song =loadSound('sounds/song4.mp3');
  titleSong = loadSound('sounds/titlesong.mp3.mov');
  //load sounds
  mapclearedSound = loadSound('sounds/mapcleared.mp3'); // clear round sound
  coinSound = loadSound('sounds/coin.wav')  // reduce sounds for all of them
  hitSound = loadSound('sounds/hit.wav')
  jumpSound = loadSound('sounds/jump.wav')
  deathSound = loadSound('sounds/kill.wav')
  startSound = loadSound('sounds/gamestart.wav')
  gameoverSound = loadSound('sounds/gameover.mp3')
  //load font
  newFont = loadFont('graphics/gamerFont.ttf');
  //load title screen
  titlecard = loadImage('graphics/float.gif')
}

function setup() {
  createCanvas(850, 480);
  frameRate(30) // slows alien down
  init()
  // Define gradient colors
  c1 = color('black');
}

function createAlien() {
  idleAlien = [alienSprites[0]]
  walkingRightAlien = alienSprites.slice(2,7)
  walkingLeftAlien = alienSprites.slice(7,12)
  jumpingAlien = [alienSprites[1]]

  alien = new AnimatedSprite(idleAlien[0], 50, 0, 'PLAYER', walkingRightAlien, walkingLeftAlien, idleAlien, jumpingAlien)
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

    levelSong.loop()
    levelSong.setVolume(0.1)
  }
}

function draw() {
  //title screen
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
		text('Made By: Annica, Janeth, Jenylee, Khadiza Pd. 6',  width/4 + viewX, height/4 +100 + viewY + 10);
  }

  //transition to actual game
  else if (mode == 1) {
    setGradient(0, 0, width, height/3, c1, c2);
    setGradient(0, height/3+1, width, height/3, c2, c3);
    setGradient(0, height/1.5+1, width, height/1.5+1, c3, c4);

    scale(rez)
    scroll()
    for (let tile of platforms) {
      tile.display()
    }

    alien.display()
    resolvePlatformCollisions(alien, platforms)

    checkGameOver()
    displayScore()

    //fixes the jump walk idle bug
    if (jump == 1 && isOnPlatform(alien, platforms)) {
      jump = 0
      if (walkL == 1) {
        walkL = 0
        alien.state = 'walkingLeft'
      }
      if (walkR == 1) {
        walkL = 0
        alien.state = 'walkingRight'
      }
    }
  }
}

function checkGameOver() {
  if (!gameOver) {
    checkDeath()
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
    fill('white')
    textAlign(CENTER)
    if (level == 4) {
      stroke(0,0,0,0)
      textSize(10)
      textFont(newFont)
      text("Congrats, you cleared all the levels!", width/4 + viewX, height/4 +viewY)
      text("Return to Title", width/4 + viewX, height/4 + 20 + viewY)
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

    if (level == 1) { //changes FROM LEVEL 1 to LEVEL 2
      gamemap = gamemap2
      c1 = color('#8285AE')
      c2 = color('#ECD7C3')
      c3 = color('#ECD7C3')
      c4 = color('#EF8C7B')
      tileSpriteSheet = tileSpriteSheet2
      alienSpriteSheet = alienSpriteSheet2
      levelSong = level2Song
      level += 1
    }
    else if (level == 2) { //changes FROM LEVEL 2 to LEVEL 3
      gamemap = gamemap3
      c1 = color('#364D82')
      c2 = color('#55598E')
      c3 = color('#7271A4')
      c4 = color('#B782A6')
      tileSpriteSheet = tileSpriteSheet3
      alienSpriteSheet = alienSpriteSheet3
      levelSong = level3Song
      level += 1
    }
    else if (level == 3) { //changes FROM LEVEL 3 to LEVEL 4
      gamemap = gamemap4
      c1 = color('#000F41')
      c2 = color('#0E297E')
      c3 = color('#1F3B91')
      c4 = color('#475C9F')
      tileSpriteSheet = tileSpriteSheet4
      alienSpriteSheet = alienSpriteSheet4
      levelSong = level4Song
      level += 1
    }
    else if (level == 4) { //changes to a CLEAN SLATE
      mode = 0
      level = 1
      c1 = null;
      c2 = null;
      c3 = null;
      c4 = null;
      tileSpriteSheet = null
      alienSpriteSheet = null
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

function checkDeath() {
  if (alien.getTop() > rows * 16 + 1000) {
    lives--
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
  if (alien.getRight() > rightBound && viewX < 260) {
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
    c1 = color('#74B5D2');
    c2 = color('#A7D5D7');
    c3 = color('#A7D5D7');
    c4 = color('#F5F6DC');
    tileSpriteSheet = tileSpriteSheet1
    alienSpriteSheet = alienSpriteSheet1
    levelSong = level1Song
    //////////////
    init()
  }
  if (!gameOver) {
    if (keyCode == LEFT_ARROW) {
      walkL += 1
      alien.dx = -WALKING_SPEED
      alien.state = 'walkingLeft'
    }
    if (keyCode == RIGHT_ARROW) {
      walkR += 1
      alien.dx = WALKING_SPEED
      alien.state = 'walkingRight'
    }
    if (keyCode == SPACE && isOnPlatform(alien, platforms)) {
      jump += 1
      alien.dy = -JUMP_VELOCITY
      alien.state = 'jumping'
      jumpSound.play()
      jumpSound.setVolume(0.2)
    }
 /*   if (!levelSong.isPlaying()) {
      levelSong.loop()
      levelSong.setVolume(0.1)
    }*/
  }
}

function keyReleased() {
    if (keyCode == LEFT_ARROW) {
      walkL = 0
      alien.dx = 0
      alien.state = 'idle'
    }
    if (keyCode == RIGHT_ARROW) {
      walkR = 0
      alien.dx = 0
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

//gradient background
function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    var inter = map(i, y, y + h, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}