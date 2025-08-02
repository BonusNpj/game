var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 400,
    backgroundColor: '#2d2d2d',
    physics: { default: 'arcade' },
    scene: { preload: preload, create: create, update: update }
};

var game = new Phaser.Game(config);
var snake;
var snakeBody = [];
var snakeLength = 3;
var food;
var cursors;
var score = 0;
var scoreText;
var dir = "RIGHT";

function preload() {}

function create() {
    snake = this.add.rectangle(300, 200, 10, 10, 0x00ff00);
    this.physics.add.existing(snake);

    spawnFood(this);
    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(10, 10, "คะแนน: 0", { fontSize: '20px', fill: '#fff' });

    this.time.addEvent({
        delay: 150,
        loop: true,
        callback: () => moveSnake(this)
    });
}

function update() {}

function moveSnake(scene) {
    // ควบคุม
    if (cursors.left.isDown && dir !== "RIGHT") dir = "LEFT";
    else if (cursors.right.isDown && dir !== "LEFT") dir = "RIGHT";
    else if (cursors.up.isDown && dir !== "DOWN") dir = "UP";
    else if (cursors.down.isDown && dir !== "UP") dir = "DOWN";

    // เพิ่มหัวใหม่
    var newHead = scene.add.rectangle(snake.x, snake.y, 10, 10, 0x00ff00);

    if (dir === "LEFT") newHead.x -= 10;
    else if (dir === "RIGHT") newHead.x += 10;
    else if (dir === "UP") newHead.y -= 10;
    else if (dir === "DOWN") newHead.y += 10;

    snakeBody.unshift(newHead);
    snake = newHead;

    // กินอาหาร
    if (Phaser.Geom.Intersects.RectangleToRectangle(newHead.getBounds(), food.getBounds())) {
        score += 1;
        scoreText.setText("คะแนน: " + score);
        food.destroy();
        spawnFood(scene);
        snakeLength++;
    }

    // ถ้าเกินความยาว → ลบหาง
    if (snakeBody.length > snakeLength) {
        var tail = snakeBody.pop();
        tail.destroy();
    }

    // ชนตัวเอง
    for (let i = 1; i < snakeBody.length; i++) {
        if (Phaser.Geom.Intersects.RectangleToRectangle(newHead.getBounds(), snakeBody[i].getBounds())) {
            scene.scene.restart();
            snakeLength = 3;
            score = 0;
            dir = "RIGHT";
            snakeBody = [];
            return;
        }
    }

    // ออกนอกจอ
    if (newHead.x < 0 || newHead.x >= 600 || newHead.y < 0 || newHead.y >= 400) {
        scene.scene.restart();
        snakeLength = 3;
        score = 0;
        dir = "RIGHT";
        snakeBody = [];
    }
}

function spawnFood(scene) {
    var x = Phaser.Math.Between(0, 59) * 10;
    var y = Phaser.Math.Between(0, 39) * 10;
    food = scene.add.rectangle(x, y, 10, 10, 0xff0000);
    scene.physics.add.existing(food);
}
