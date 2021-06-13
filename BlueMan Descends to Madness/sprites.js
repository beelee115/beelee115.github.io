class Sprite {
    constructor(img, x, y, type) {
        this.img = img
        this.x = x
        this.y = y
        this.w = img.width
        this.h = img.height
        this.type = type
        this.collidable = COLLIDABLES.includes(type) ? true : false
    }

    display() {
        image(this.img, this.x, this.y, this.w, this.h)
    }

    getTop() {
        return this.y
    }

    getBottom() {
        return this.y + this.h
    }

    getLeft() {
        return this.x
    }

    getRight() {
        return this.x + this.w
    }

    setTop(y) {
        this.y = y
    }

    setBottom(y) {
        this.y = y - this.h
     }

    setLeft(x) {
        this.x = x
     }

     setRight(x) {
        this.x = x - this.w
     }
}


class AnimatedSprite extends Sprite { //builds off of what is in class Sprite
    constructor(img, x, y, type, walkingRight, walkingLeft, idle, jumping) {
        super(img, x, y, type)
        this.dx = 0
        this.dy = 0
        this.state = 'idle'
        this.walkingRight = walkingRight
        this.walkingLeft = walkingLeft
        this.idle = idle
        this.jumping = jumping
    }

    display() {
        if (this.state == 'idle') {
            this.animation = this.idle
        }
        else if (this.state == 'walkingRight') {
            this.animation = this.walkingRight
        }
        else if (this.state == 'walkingLeft') {
            this.animation = this.walkingLeft
        }
        else if (this.state == 'jumping') {
            this.animation = this.jumping
        }

        let numImages = this.animation.length

        image(this.animation[frameCount % numImages], this.x, this.y)
    }
}