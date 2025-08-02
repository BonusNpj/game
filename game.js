var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 400,
    backgroundColor: '#2d2d2d',
    scene: { preload: preload, create: create }
};

var game = new Phaser.Game(config);
var snakeBody = [];
var snakeLength = 3;
var food;
var cursors;
var score = 0;
var scoreText;
var dir = "RIGHT";
var nextDir = "RIGHT"; 
var playArea = { x: 0, y: 0, width: 600, height: 400 };

function preload() {}

function create() {
    let head = this.add.rectangle(300, 200, 10, 10, 0x00ff00);
    snakeBody.push(head);

    spawnFood(this);
    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(10, 10, "คะแนน: 0", { fontSize: '20px', fill: '#fff' });

    // เคลื่อนงูทุก 200ms
    this.time.addEvent({
        delay: 200,
        loop: true,
        callback: () => moveSnake(this)
    });
}

function moveSnake(scene) {
    // ควบคุมจากคีย์บอร์ด
    if (cursors.left.isDown && dir !== "RIGHT") nextDir = "LEFT";
    else if (cursors.right.isDown && dir !== "LEFT") nextDir = "RIGHT";
    else if (cursors.up.isDown && dir !== "DOWN") nextDir = "UP";
    else if (cursors.down.isDown && dir !== "UP") nextDir = "DOWN";

    dir = nextDir;

    var head = snakeBody[0];
    var newHead = scene.add.rectangle(head.x, head.y, 10, 10, 0x00ff00);

    if (dir === "LEFT") newHead.x -= 10;
    else if (dir === "RIGHT") newHead.x += 10;
    else if (dir === "UP") newHead.y -= 10;
    else if (dir === "DOWN") newHead.y += 10;

    snakeBody.unshift(newHead);

    // กินอาหาร
    if (Phaser.Geom.Intersects.RectangleToRectangle(newHead.getBounds(), food.getBounds())) {
        score += 1;
        scoreText.setText("คะแนน: " + score);
        food.destroy();
        spawnFood(scene);
        snakeLength++;

        // ลดขอบสนาม (ถ้ายังไม่เล็กเกินไป)
        if (playArea.width > 200 && playArea.height > 200) {
            playArea.x += 5;
            playArea.y += 5;
            playArea.width -= 10;
            playArea.height -= 10;
        }
    }

    // ถ้าเกินความยาว ลบหาง
    if (snakeBody.length > snakeLength) {
        var tail = snakeBody.pop();
        tail.destroy();
    }

    // ชนตัวเอง
    for (let i = 1; i < snakeBody.length; i++) {
        if (Phaser.Geom.Intersects.RectangleToRectangle(newHead.getBounds(), snakeBody[i].getBounds())) {
            restart(scene);
            return;
        }
    }

    // ออกนอกสนาม
    if (newHead.x < playArea.x || 
        newHead.x >= playArea.x + playArea.width || 
        newHead.y < playArea.y || 
        newHead.y >= playArea.y + playArea.height) {
        restart(scene);
    }
}

function spawnFood(scene) {
    var x = Phaser.Math.Between(playArea.x / 10, (playArea.x + playArea.width) / 10 - 1) * 10;
    var y = Phaser.Math.Between(playArea.y / 10, (playArea.y + playArea.height) / 10 - 1) * 10;
    food = scene.add.rectangle(x, y, 10, 10, 0xff0000);
    // ❌ ไม่มี physics แล้ว อาหารจะไม่วิ่งมั่ว
}

function restart(scene) {
    scene.scene.restart();
    snakeBody = [];
    snakeLength = 3;
    score = 0;
    dir = "RIGHT";
    nextDir = "RIGHT";
    playArea = { x: 0, y: 0, width: 600, height: 400 };
}
