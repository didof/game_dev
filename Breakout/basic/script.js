const ctx = document.querySelector(".canvas").getContext("2d");
    ctx.canvas.width = 720;
    ctx.canvas.height = 480;

let allBall = [];
let allPaddle = [];

class Paddle {
    constructor(x, y, width, height, dx) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
    }
}

class Ball {
    constructor(x, y, radius, dx, dy, mass, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.mass = mass;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
    }
}

const createPaddle = () => {
    let newPaddle = new Paddle(20, ctx.canvas.height - 10 - 10, 100, 10, 0);
    allPaddle.push(newPaddle);
}
createPaddle();

const drawPaddle = () => {
    for(let paddle of allPaddle) {
        ctx.beginPath();
        ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.fillStyle = "violet";
        ctx.fill();
        ctx.closePath();
    }
}

const createBall = () => {
    let randomDX = Math.floor(Math.random() * (7) + 3);
    let randomDY = -Math.floor(Math.random() * (35) + 40);
    let randomR = Math.floor(Math.random() * (5) + 10);
    let mass = (randomR * Math.PI * 2) / 100;

    let newBall = new Ball(10 + randomR, ctx.canvas.height - 20 - randomR, randomR, randomDX, randomDY, mass, "purple");
    allBall.push(newBall);
}
setInterval(createBall, 3000);

const drawBall = () => {
    for(let ball of allBall) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    }
}

const drawBackground = () => {
    ctx.beginPath();
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#1a1a1a";
    ctx.fill();
    ctx.closePath();
}

const physic = () => {
    for(let ball of allBall) {
        ball.dy += 1.5 * ball.mass ; // gravity
        ball.dy *= 0.9; // friction Y
        ball.dx *= 0.999; // friction X
    }
}

const collision = () => {
    // ball & walls
    for(let ball of allBall) {
        let newX = ball.x + ball.dx;
        let newY = ball.y + ball.dy;
            if(newY > ctx.canvas.height) {
                // allBall.splice(allBall.indexOf(ball), 1);
                // window.cancelAnimationFrame(request);
                // document.location.reload();
            } else if(newY < 0) {
                ball.dy = -ball.dy;
            }
            if(newX < 0 || newX + ball.radius > ctx.canvas.width) {
                ball.dx = -ball.dx;
            }
    }
    // paddle & walls
    for(let paddle of allPaddle) {
        let newX = paddle.x + paddle.dx;
        if(newX < 0 || newX + paddle.width > ctx.canvas.width) {
            paddle.dx = -paddle.dx;
        } else {
            paddle.x += paddle.dx;
        }
        paddle.dx *= 0.9;
    }
    // paddle & ball
    for(let paddle of allPaddle) {
        for(let ball of allBall) {
            if(ball.y + ball.dy > paddle.y - ball.radius && ball.y + ball.dy < ctx.canvas.height) {
                if(ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                    ball.dy = Math.abs(ball.dy + Math.floor(Math.random() * (30) + 20));
                    ball.dx += (paddle.dx * 0.2);
                    ball.dy = -ball.dy;
                }
            }
        }
    }
    // ball & brick
    for(let column of arrBrick) {
        for(let brick of column) {
            if(brick.status == 1) {
            for(let ball of allBall) {
                if(ball.x + ball.radius > brick.x && ball.x< brick.x + bricks.width && ball.y > brick.y && ball.y < brick.y + bricks.height) {
                    ball.dy = -ball.dy;
                    brick.status = 0;
                }
            }
            }
        }
    }
}

const calculateNewState = () => {
    for(let ball of allBall) {
        ball.x += ball.dx;
        ball.y += ball.dy;
    }
    if(controller.right) {
        for(let paddle of allPaddle) {
            paddle.dx += 1;
        }
    } else if(controller.left) {
        for(let paddle of allPaddle) {
            paddle.dx -= 1;
        }
    }
}

const controller = {
    left: false,
    right: false,
    keyListener: (event) => {
        let keyState = (event.type == "keydown") ? true : false;

        switch(event.keyCode) {
            case 37:
            controller.left = keyState;
            break;
            case 39:
            controller.right = keyState;
            break;
        }
    }
}

const bricks = {
    rows: 4,
    columns: 6,
    width: 100,
    height: 20,
    padding: 10,
    offSetTop: 30,
    offSetLeft: 30
}
const arrBrick = [];
for(let c = 0; c < bricks.columns; c++) {
    arrBrick[c] = [];
        for(let r = 0; r < bricks.rows; r++) {
            arrBrick[c][r] = { x: 0, y: 0, status: 1 }
        }
    }

const drawBrick = () => {
    for(let c = 0; c < bricks.columns; c++) {
        for(let r = 0; r < bricks.rows; r++) {
            if(arrBrick[c][r].status == 1) {
            let brickX = (c * (bricks.width + bricks.padding) + bricks.offSetLeft);
            let brickY = (r * (bricks.height + bricks.padding) + bricks.offSetTop);
            arrBrick[c][r].x = brickX;
            arrBrick[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, bricks.width, bricks.height);
            ctx.fillStyle = "pink";
            ctx.fill();
            ctx.closePath();
            }
        }
    }
}

const loop = () => {
    
    physic();
    collision();
    calculateNewState();

    drawBackground();
    drawPaddle();
    drawBrick();
    drawBall();
    
    window.requestAnimationFrame(loop);
};

window.addEventListener('keydown', controller.keyListener);
window.addEventListener('keyup', controller.keyListener);
window.requestAnimationFrame(loop);