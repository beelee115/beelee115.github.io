// Takes tile sheet and returns an array of tiles

function generateTiles(spriteSheet, tileWidth, tileHeight) {
    let sheetWidth = spriteSheet.width / tileWidth      //number of collumns
    let sheetHeight = spriteSheet.height / tileHeight   //number of rows

    let sprites = [];

    for (let j = 0; j < sheetHeight; j++) {
        for (let i = 0; i < sheetWidth; i++) {
            let img = spriteSheet.get(i * tileWidth, j * tileHeight, tileWidth, tileHeight);
            sprites.push(img); //array
        }
    }
    return sprites
}