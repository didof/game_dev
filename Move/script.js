const ctx = document.querySelector(".canvas").getContext("2d");

ctx.canvas.height = 480;
ctx.canvas.width = 720;

let rect = {
    height: 32,
    width: 32,
    x: ctx.canvas.width / 2 - 16,
    y: 0,
    jumping: true,
    x_vel: 0,
    y_vel: 0
}

const controller = {
    left: false,
    right: false,
    up: false,
    keyListener: function(event) {
        let keyState = (event.type == "keydown")? true : false;

        switch(event.keyCode) {
            case 37:
            controller.left = keyState;
            break;
            case 39:
            controller.right = keyState;
            break;
            case 38:
            controller.up = keyState;
            break;
        }
    }
}

let loop = function() {
    if(controller.up && rect.jumping == false) {
        rect.y_vel -= 40;
        rect.jumping = true;
    }
    if(controller.left) {
        rect.x_vel -= 0.5;
    }
    if(controller.right) {
        rect.x_vel += 0.5;
    }

    physic(rect);

    if(rect.y > 480 - 32) {
        rect.jumping = false;
        rect.y = 480 - 32;
        rect.y_vel = 0;
    }
    if(rect.x < -32) {
        rect.x = 720
    } else if(rect.x > 752) {
        rect.x = -32;
    }

    drawBackground();
    drawRect();
    drawBalls();

    window.requestAnimationFrame(loop);

}

function drawBackground() {
    ctx.beginPath();
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#2a2a2a";
    ctx.fill();
    ctx.closePath();
}

function drawRect() {
    ctx.beginPath();
    ctx.rect(rect.x , rect.y, rect.width, rect.height);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

function drawBalls() {
    if(ballArr.length > 0) {
        for(let ball of ballArr) {
            ctx.beginPath();
            ctx.arc(ball.x , ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = ball.color;
            ctx.fill();
            ctx.closePath();
            moveBall(ball);
        }
    }
}

function physic(element) {
    element.y_vel += 1.5;
    element.x += element.x_vel;
    element.y += element.y_vel;
    element.x_vel *= 0.9;
    element.y_vel *= 0.9;
}

function randomMove(element) {
    element.dx += 0.3;
    element.dy += 0.3;
}

function moveBall(element) {
    if (element.x + element.dx > ctx.canvas.width - element.radius || element.x + element.dx < element.radius) {
        element.dx = -element.dx;
    } else {
        element.x += element.dx;
    }
    if (element.y + element.dy > ctx.canvas.height - element.radius || element.y + element.dy < element.radius) {
        element.dy = -element.dy;
    } else {
        element.y += element.dy;
    }
}

class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = Math.floor(Math.random() * (10 - 2) + 2);
        this.dy = Math.floor(Math.random() * (10 - 2) + 2);
    }
}

let ballArr = [];

setInterval(createBall, Math.floor(Math.random() * (10000 - 5000) + 5000));

const colorArr = ["red", "blue", "yellow", "green", "pink", "orange", "brown"]
function createBall() {
    let random_x = Math.floor(Math.random() * (ctx.canvas.width - 20) + 20);
    let random_radius = Math.floor(Math.random() * (30 - 10) + 10);
    let random_color = Math.floor(Math.random() * (colorArr.length - 1));
    let newBall = new Ball(random_x, 100, random_radius, colorArr[random_color]);
    ballArr.push(newBall);
}

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);
