const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.6;
const FRICTION = 0.8;

let gameState = 'menu'; // 'menu', 'levelSelect', 'playing', 'win'
let currentLevelIndex = 0;

// Players class
class Player {
  constructor(x, y, color, controls) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 50;
    this.color = color;
    this.velX = 0;
    this.velY = 0;
    this.speed = 3;
    this.jumping = false;
    this.controls = controls;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.velX = 0;
    this.velY = 0;
    this.jumping = false;
  }

  update(keys, platforms) {
    if (keys[this.controls.left]) {
      if (this.velX > -this.speed) this.velX -= 0.5;
    }
    if (keys[this.controls.right]) {
      if (this.velX < this.speed) this.velX += 0.5;
    }
    if (keys[this.controls.jump]) {
      if (!this.jumping) {
        this.velY = -12;
        this.jumping = true;
      }
    }

    this.velX *= FRICTION;
    this.velY += GRAVITY;

    this.x += this.velX;
    this.y += this.velY;

    let grounded = false;
    for (let p of platforms) {
      if (
        this.x < p.x + p.width &&
        this.x + this.width > p.x &&
        this.y < p.y + p.height &&
        this.y + this.height > p.y
      ) {
        if (this.velY > 0) {
          this.y = p.y - this.height;
          this.velY = 0;
          grounded = true;
          this.jumping = false;
        } else if (this.velY < 0) {
          this.y = p.y + p.height;
          this.velY = 0;
        }
      }
    }

    // Boundaries
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
      this.velY = 0;
      grounded = true;
      this.jumping = false;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Platform {
  constructor(x, y, width, height, color = '#654321') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Utility collision check
function rectsColliding(r1, r2) {
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  );
}

// Define levels as objects
const levels = [
  {
    name: 'Level 1',
    platforms: [
      new Platform(0, 350, 800, 50),
      new Platform(150, 300, 100, 20),
      new Platform(300, 250, 100, 20),
      new Platform(450, 200, 100, 20),
      new Platform(600, 150, 100, 20),
    ],
    goal: { x: 720, y: 100, width: 50, height: 50 },
    fireboyStart: { x: 50, y: 300 },
    watergirlStart: { x: 100, y: 300 },
  },
  {
    name: 'Level 2',
    platforms: [
      new Platform(0, 350, 800, 50),
      new Platform(100, 300, 150, 20),
      new Platform(300, 280, 150, 20),
      new Platform(500, 260, 150, 20),
      new Platform(700, 240, 80, 20),
    ],
    goal: { x: 720, y: 190, width: 50, height: 50 },
    fireboyStart: { x: 50, y: 300 },
    watergirlStart: { x: 10, y: 300 },
  },
  {
    name: 'Level 3',
    platforms: [
      new Platform(0, 350, 800, 50),
      new Platform(50, 320, 120, 20),
      new Platform(220, 290, 100, 20),
      new Platform(370, 260, 150, 20),
      new Platform(550, 230, 200, 20),
      new Platform(770, 200, 30, 20),
    ],
    goal: { x: 780, y: 160, width: 30, height: 40 },
    fireboyStart: { x: 10, y: 300 },
    watergirlStart: { x: 60, y: 300 },
  },
];

// Players
const fireboy = new Player(0, 0, 'red', {
  left: 'ArrowLeft',
  right: 'ArrowRight',
  jump: 'ArrowUp',
});
const watergirl = new Player(0, 0, 'blue', {
  left: 'a',
  right: 'd',
  jump: 'w',
});

function resetPlayers(level) {
  fireboy.reset(level.fireboyStart.x, level.fireboyStart.y);
  watergirl.reset(level.watergirlStart.x, level.watergirlStart.y);
}

// Buttons for menus
class Button {
  constructor(text, x, y, width, height, onClick) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.onClick = onClick;
  }

  draw() {
    ctx.fillStyle = '#555';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
  }

  isInside(mx, my) {
    return (
      mx >= this.x &&
      mx <= this.x + this.width &&
      my >= this.y &&
      my <= this.y + this.height
    );
  }
}

// Menu buttons
const startButton = new Button('Play', 350, 180, 100, 50, () => {
  gameState = 'levelSelect';
});
let levelButtons = [];
let backToMenuButton;

function createLevelButtons() {
  levelButtons = [];
  const btnWidth = 150;
  const btnHeight = 50;
  const spacing = 20;
  const startX = (canvas.width - (btnWidth * levels.length + spacing * (levels.length - 1))) / 2;
  const y = 150;

  levels.forEach((level, i) => {
    levelButtons.push(
      new Button(level.name, startX + i * (btnWidth + spacing), y, btnWidth, btnHeight, () => {
        currentLevelIndex = i;
        startLevel(i);
      })
    );
  });

  backToMenuButton = new Button('Back', 20, canvas.height - 70, 100, 40, () => {
    gameState = 'menu';
  });
}

function startLevel(index) {
  const level = levels[index];
  resetPlayers(level);
  gameState = 'playing';
}

createLevelButtons();

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if (gameState === 'menu') {
    if (startButton.isInside(mx, my)) startButton.onClick();
  } else if (gameState === 'levelSelect') {
    for (const btn of levelButtons) {
      if (btn.isInside(mx, my)) {
        btn.onClick();
        return;
      }
    }
    if (backToMenuButton.isInside(mx, my)) backToMenuButton.onClick();
  } else if (gameState === 'win') {
    if (backToMenuButton.isInside(mx, my)) backToMenuButton.onClick();
  }
});

function drawMenu() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '50px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Fireboy & Watergirl', canvas.width / 2, 100);

  startButton.draw();
}

function drawLevelSelect() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Select a Level', canvas.width / 2, 80);

  levelButtons.forEach((btn) => btn.draw());
  backToMenuButton.draw();
}

function drawWinScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '50px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2 - 50);

  ctx.font = '30px Arial';
  ctx.fillText('Click Back to Menu', canvas.width / 2, canvas.height / 2 + 20);

  backToMenuButton.draw();
}

function gameLoop() {
  if (gameState === 'menu') {
    drawMenu();
  } else if (gameState === 'levelSelect') {
    drawLevelSelect();
  } else if (gameState === 'playing') {
    playGame();
  } else if (gameState === 'win') {
    drawWinScreen();
  }

  requestAnimationFrame(gameLoop);
}

function playGame() {
  const level = levels[currentLevelIndex];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw goal
  ctx.fillStyle = 'gold';
  ctx.fillRect(level.goal.x, level.goal.y, level.goal.width, level.goal.height);

  // Draw platforms
  for (const p of level.platforms) p.draw();

  // Update and draw players
  fireboy.update(keys, level.platforms);
  watergirl.update(keys, level.platforms);

  fireboy.draw();
  watergirl.draw();

  // Check win condition: both players on goal
  if (rectsColliding(fireboy, level.goal) && rectsColliding(watergirl, level.goal)) {
    gameState = 'win';
  }
}

gameLoop();
