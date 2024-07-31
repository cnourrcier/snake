// Get references to the canvas and audio elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');
const backgroundMusic = document.getElementById('backgroundMusic');

// Define grid size and initialize game variables
const gridSize = 20;
let snake = [{ x: 5 * gridSize, y: 5 * gridSize }];
let direction = { x: 0, y: 0 };
let food = getRandomFoodPosition();
let score = 0;
let gameStarted = false;

// Add event listener for keypresses to change the snake's direction and start the game
document.addEventListener('keydown', handleKeydown);

// Function to handle keydown events
function handleKeydown(event) {
    if (!gameStarted) {
        startGame();
        gameStarted = true;
    }

    changeDirection(event);
}

// Function to start the game and play background music
function startGame() {
    backgroundMusic.play().catch(error => {
        console.error('Failed to play background music:', error); // Debugging line
    });
    gameLoop();
}

// Function to change the direction of the snake based on arrow keys pressed
function changeDirection(event) {
    switch (event.keyCode) {
        case 37: if (direction.x === 0) direction = { x: -gridSize, y: 0 }; break;
        case 38: if (direction.y === 0) direction = { x: 0, y: -gridSize }; break;
        case 39: if (direction.x === 0) direction = { x: gridSize, y: 0 }; break;
        case 40: if (direction.y === 0) direction = { x: 0, y: gridSize }; break;
    }
}

// Function to update the position of the snake and handle game logic
function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Check if the snake has eaten the food
    if (head.x === food.x && head.y === food.y) {
        food = getRandomFoodPosition();
        score++;
        scoreDisplay.textContent = 'Score: ' + score;
        console.log('Playing eat sound'); // Debugging line
        playSound(eatSound); // Ensure sound plays
    } else {
        snake.pop();
    }

    // Check for collisions with the wall or self
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        console.log('Playing game over sound'); // Debugging line
        playSound(gameOverSound); // Ensure sound plays
        alert('Game Over! Your score: ' + score);
        document.location.reload();
    }
}

// Function to draw the game objects on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    ctx.fillStyle = 'green';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, gridSize, gridSize));
}

// Function to generate a random position for the food
function getRandomFoodPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
}

// Function to play a sound
function playSound(sound) {
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => {
            console.error('Failed to play sound:', error); // Debugging line
        });
    }
}

// Main game loop to update and draw the game at regular intervals
function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 100);
}







// a. Implement smoother animations using requestAnimationFrame.
// b. Add levels of difficulty that increase as the score increases.