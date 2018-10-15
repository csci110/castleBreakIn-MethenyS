import { game, Sprite } from "./sgc/sgc.js";

game.setBackground("grass.png");

class Wall extends Sprite {
    constructor(x, y, name, image) {
        super();
        this.x = x;
        this.y = y;
        this.name = "name";
        this.setImage(image);
        this.accelerateOnBounce = false;
    }
}
new Wall(0, 0, "A spooky castle wall", "castle.png");

let leftWall = new Wall(0, 200, "Left side wall", "wall.png");

let rightWall = new Wall(game.displayWidth - 48, 200, "Right side wall", "wall.png");

class Princess extends Sprite {
    constructor() {
        super();
        this.name = "Princess Ann";
        this.setImage("ann.png");
        this.height = 48;
        this.width = 48;
        this.x = game.displayWidth / 2;
        this.y = game.displayHeight - this.height;
        this.speedWhenWalking = 150;
        this.lives = 3;
        this.accelerateOnBounce = false;
        this.defineAnimation("left", 9, 11);
        this.defineAnimation("right", 3, 5);
        this.speedWhenWalking = 150;
        this.lives = 3;
    }
    handleLeftArrowKey() {
        this.playAnimation("left");
        this.speed = this.speedWhenWalking;
        this.angle = 180;
    }
    handleRightArrowKey() {
        this.playAnimation("right");
        this.speed = this.speedWhenWalking;
        this.angle = 360;
    }
    handleGameLoop() {
        this.y = Math.max(5, this.y); //Picks the greatest of 0, or the current value of y and assigns it to y
        this.y = Math.min(game.displayHeight - this.height, this.y); //Keeps Marcus in the display window
        this.x = Math.max(0, this.x);
        this.x = Math.min(game.displayWidth - this.width, this.x);
        this.speed = 0;
    }
    handleCollision(otherSprite) {
        let horizontalOffset = this.x - otherSprite.x;
        let verticalOffset = this.y - otherSprite.y;
        if (Math.abs(horizontalOffset) < this.width / 3 &&
            verticalOffset > this.height / 4) {

            otherSprite.angle = 90 + 2 * horizontalOffset;
        }
        return false;
    }
    handleFirstGameLoop() {
        // Set up a text area to display the number of lives remaining.
        this.livesDisplay = game.createTextArea(game.displayWidth - 144, 20);
        this.updateLivesDisplay();
    }
    updateLivesDisplay() {
        game.writeToTextArea(this.livesDisplay, "Lives =" + this.lives);
    }
    loseALife() {
        this.lives = this.lives - 1;
        this.updateLivesDisplay();
        if (this.lives > 0) {
            new Ball(350, 350, "Soccer Ball", "ball.png");
        }
        else {
            game.end('The mysterious stranger has escaped\nPrincess Ann for now!\n\nBetter luck next time.');
        }
    }
    addALife() {
        this.lives = this.lives + 1;
        this.updateLivesDisplay();
    }
}


let Ann = new Princess();

class Ball extends Sprite {
    constructor(x, y, name, image) {
        super();
        this.x = x;
        this.y = y;
        this.width = 48;
        this.height = 48;
        this.name = name;
        this.setImage(image);
        this.defineAnimation("spin", 0, 11);
        this.playAnimation("spin", true);
        this.speed = 1;
        this.angle = 50 + Math.random() * 80;
        Ball.ballsInPlay = Ball.ballsInPlay + 1;
    }
    handleGameLoop() {
        if (this.speed < 200) {
            this.speed++;
        }
    }
    handleBoundaryContact() {
        Ball.ballsInPlay = Ball.ballsInPlay - 1;
        if (Ball.ballsInPlay === 0) {
            Ann.loseALife();
        }
    }
}
Ball.ballsInPlay = 0;
new Ball(350, 350, "Soccer Ball", "ball.png");

class Block extends Sprite {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.name = "Block";
        this.setImage("block1.png");
        this.accelerateOnBounce = false;
        Block.blocksToDestroy = Block.blocksToDestroy + 1;
    }
    handleCollision() {
        game.removeSprite(this);
        Block.blocksToDestroy = Block.blocksToDestroy - 1;
        if (Block.blocksToDestroy <= 0) {
            game.end('Congratualtions!\n\nPrincess Ann can continue her pursuit\nof the mysterious stranger!');
            this.accelerateOnBounce = true;
        }
    }
}

class ExtraLifeBlock extends Block {
    constructor(x, y) {
        super(x, y);
        this.setImage("block2.png")
        Block.blocksToDestroy = Block.blocksToDestroy - 1;
    }
    handleCollision() {
        super.handleCollision();
        Ann.addALife();
        return true;
    }
}
class ExtraBallBlock extends Block {
    constructor(x, y) {
        super(x, y);
        this.setImage("block3.png");
    }
    handleCollision() {
        super.handleCollision();
        new Ball(350, 350, "Soccer Ball", "ball.png");
        return true;
    }
}
Block.blocksToDestroy = 0;
for (let i = 0; i < 5; i = i + 1) {
    new Block(200 + i * 48, 200);
}
new ExtraLifeBlock(200, 250);
new ExtraBallBlock(300, 250);
