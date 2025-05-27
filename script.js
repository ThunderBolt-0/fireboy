// Get the canvas element
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
// Define the player properties
const fireboy = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    speed: 5,
    color: 'red'
};
const watergirl = {
    x: 200,
    y: 100,
    width: 50,
    height: 50,
    speed: 5,
    color: 'blue'
};
// Define the keys
const keys = {
    fireboy: {
        up: 'w',
        down: 's',
        left: 'a',
        right: 'd'
    },
    watergirl: {
        up: 'ArrowUp',
        down: 'ArrowDown',
        left: 'ArrowLeft',
        right: 'ArrowRight'
    }
};
// Handle keyboard input
let fireboyMovingUp = false;
let fireboyMovingDown = false;
let fireboyMovingLeft = false;
let fireboyMovingRight = false;
let watergirlMovingUp = false;
let watergirlMovingDown = false;
let watergirlMovingLeft = false;
let watergirlMovingRight = false;
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case keys.fireboy.up:
            fireboyMovingUp = true;
            break;
        case keys.fireboy.down:
            fireboyMovingDown = true;
            break;
        case keys.fireboy.left:
            fireboyMovingLeft = true;
            break;
        case keys.fireboy.right:
            fireboyMovingRight = true;
            break;
        case keys.watergirl.up:
            watergirlMovingUp = true;
            break;
        case keys.watergirl.down:
            watergirlMovingDown = true;
            break;
        case keys.watergirl.left:
            watergirlMovingLeft = true;
            break;
        case keys.watergirl.right:
            watergirlMovingRight = true;
            break;
    }
});
document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case keys.fireboy.up:
            fireboyMovingUp = false;
            break;
        case keys.fireboy.down:
            fireboyMovingDown = false;
            break;
        case keys.fireboy.left:
            fireboyMovingLeft = false;
            break;
        case keys.fireboy.right:
            fireboyMovingRight = false;
            break;
        case keys.watergirl.up:
            watergirlMovingUp = false;
            break;
        case keys.watergirl.down:
            watergirlMovingDown = false;
            break;
        case keys.watergirl.left:
            watergirlMovingLeft = false;
            break;
        case keys.watergirl.right:
            watergirlMovingRight = false;
            break;
    }
});
// Update the game state
function update() {
    if (fireboyMovingUp) {
        fireboy.y -= fireboy.speed;
    }
    if (fireboyMovingDown) {
        fireboy.y += fireboy.speed;
    }
    if (fireboyMovingLeft) {
        fireboy.x -= fireboy.speed;
    }
    if (fireboyMovingRight) {
        fireboy.x += fireboy.speed;
    }
    if (watergirlMovingUp) {
        watergirl.y -= watergirl.speed;
    }
    if (watergirlMovingDown) {
        watergirl.y += watergirl.speed;
    }
    if (watergirlMovingLeft) {
        watergirl.x -= watergirl.speed;
    }
    if (watergirlMovingRight) {
        watergirl.x += watergirl.speed;
    }
    // Collision detection with the canvas edges
    if (fireboy.x < 0) {
        fireboy.x = 0;
    } else if (fireboy.x + fireboy.width > canvas.width) {
        fireboy.x = canvas.width - fireboy.width;
    }
    if (fireboy.y < 0) {
        fireboy.y = 0;
    } else if (fireboy.y + fireboy.height > canvas.height) {
        fireboy.y = canvas.height - fireboy.height;
    }
    if (watergirl.x < 0) {
        watergirl.x = 0;
    } else if (watergirl.x + watergirl.width > canvas.width) {
        watergirl.x = canvas.width - watergirl.width;
    }
    if (watergirl.y < 0) {
        watergirl.y = 0;
    } else if (watergirl.y + watergirl.height > canvas.height) {
        watergirl.y = canvas.height - watergirl.height;
    }
}
// Draw the game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = fireboy.color;
    ctx.fillRect(fireboy.x, fireboy.y, fireboy.width, fireboy.height);
    ctx.fillStyle = watergirl.color;
    ctx.fillRect(watergirl.x, watergirl.y, watergirl.width, watergirl.height);
}
// Main game loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}
loop();
