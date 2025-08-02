var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 400,
    backgroundColor: '#2d2d2d',
    scene: { create: create, update: update }
};

var game = new Phaser.Game(config);

var snake = [{x: 300, y: 200}];
var snakeLength = 3;
var dir = "RIGHT";
var nextDir = "RIGHT";
var food = {x: 100, y: 100};
var graphics;
var score = 0;
var scoreText;
var playArea = { x: 0, y: 0, width: 600, height: 400 };
var moveTimer = 0;

function create() {
    graphics = this.add.graphics();
    scoreText = this.add.text(10, 10, "คะแนน: 0", { fontSize: '20px', fill: '#fff' });
    cursors = this.input.keyboard.createCursorKeys();
}

function update(time) {
    // ควบคุมจากคีย์บอร์ด
    if (cursors.left.isDown && dir !== "RIGHT") nextDir = "LEFT";
    else if (cursors.right.isDown && dir !== "LEFT") nextDir = "RIGHT";
    else if (cursors.up.isDown && dir !== "DOWN") nextDir = "UP";
    else if (cursors.down.isDown && dir !== "UP") nextDir = "DOWN";

    // เคลื่อนที่ทุก 200ms
    if (time > moveTimer) {
        moveSnake();
        moveTimer = time + 200;
    }

    draw();
}

function moveSnake() {
    dir = nextDir;
    var head = { x: snake[0].x, y: snake[0].y };

    if (dir === "LEFT") head.x -= 10;
    if (dir === "RIGHT") head.x += 10;
    if (dir === "UP") head.y -= 10;
    if (dir === "DOWN") head.y += 10;

    snake.unshift(head);

    // กินอาหาร
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreText.setText("คะแนน: " + score);
        spawnFood();
        snakeLength++;

        if (playArea.width > 200 && playArea.height > 200) {
            playArea.x += 5;
            playArea.y += 5;
            playArea.width -= 10;
            playArea.height -= 10;
        }
    }

    // ตัดหางถ้าเกิน
    while (snake.length > snakeLength) {
        snake.pop();
    }

    // ชนตัวเอง
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) restart();
    }

    // ออกนอกขอบ
    if (head.x < playArea.x || head.x >= playArea.x + playArea.width ||
        head.y < playArea.y || head.y >= playArea.y + playArea.height) {
        restart();
    }
}

function draw() {
    graphics.clear();

    // วาดกรอบสนาม
    graphics.lineStyle(2, 0xff0000);
    graphics.strokeRect(playArea.x, playArea.y, playArea.width, playArea.height);

    // วาดงู
    graphics.fillStyle(0x00ff00);
    snake.forEach(part => {
        graphics.fillRect(part.x, part.y, 10, 10);
    });

    // วาดอาหาร
    graphics.fillStyle(0xff0000);
    graphics.fillRect(food.x, food.y, 10, 10);
}

function spawnFood() {
    var cols = playArea.width / 10;
    var rows = playArea.height / 10;
    food.x = playArea.x + Math.floor(Math.random() * cols) * 10;
    food.y = playArea.y + Math.floor(Math.random() * rows) * 10;
}

function restart() {
    snake = [{x: 300, y: 200}];
    snakeLength = 3;
    dir = "RIGHT";
    nextDir = "RIGHT";
    score = 0;
    playArea = { x: 0, y: 0, width: 600, height: 400 };
    spawnFood();
}
