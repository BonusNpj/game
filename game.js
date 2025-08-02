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
var food;
var cursors;
var score = 0;
var scoreText;

function preload() { }

function create() {
    // สร้างงู
    snake = this.add.rectangle(300, 200, 10, 10, 0x00ff00);
    this.physics.add.existing(snake);

    // สร้างอาหาร
    spawnFood(this);

    // ควบคุม
    cursors = this.input.keyboard.createCursorKeys();

    // คะแนน
    scoreText = this.add.text(10, 10, "คะแนน: 0", { fontSize: '20px', fill: '#fff' });

    // ตั้งค่า update loop
    this.time.addEvent({
        delay: 150, // ความเร็ว
        loop: true,
        callback: () => moveSnake(this)
    });
}

function update() { }

function moveSnake(scene) {
    if (cursors.left.isDown) {
        snake.x -= 10;
    } else if (cursors.right.isDown) {
        snake.x += 10;
    } else if (cursors.up.isDown) {
        snake.y -= 10;
    } else if (cursors.down.isDown) {
        snake.y += 10;
    }

    // ชนอาหาร
    if (Phaser.Geom.Intersects.RectangleToRectangle(snake.getBounds(), food.getBounds())) {
        score += 1;
        scoreText.setText("คะแนน: " + score);
        food.destroy();
        spawnFood(scene);
    }

    // ออกนอกจอ → Game Over
    if (snake.x < 0 || snake.x > 600 || snake.y < 0 || snake.y > 400) {
        scene.scene.restart();
        score = 0;
    }
}

function spawnFood(scene) {
    var x = Phaser.Math.Between(0, 59) * 10;
    var y = Phaser.Math.Between(0, 39) * 10;
    food = scene.add.rectangle(x, y, 10, 10, 0xff0000);
    scene.physics.add.existing(food);
}
