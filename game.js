const player = document.getElementById('player');
const obstacle = document.getElementById('obstacle');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreDisplay = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const reviveBtn = document.getElementById('revive-btn');

// Game Variables
let playerX = 180;        
let obstacleX = 180;      
let obstacleY = -40;      
let obstacleSpeed = 5;    
let score = 0;
let isGameOver = false;
let gameInterval;

// LOAD HIGH SCORE FROM BROWSER STORAGE
let highScore = localStorage.getItem('arcadeHighScore') || 0;
highScoreDisplay.innerText = highScore;

// 1. CONTROL PLAYER MOVEMENT
document.addEventListener('keydown', (event) => {
    if (isGameOver) return; 

    if (event.key === 'ArrowLeft' && playerX > 0) {
        playerX -= 40; 
    } else if (event.key === 'ArrowRight' && playerX < 360) {
        playerX += 40; 
    }
    
    player.style.left = playerX + 'px';
});

// 2. THE MAIN GAME LOOP
function gameLoop() {
    if (isGameOver) return;

    obstacleY += obstacleSpeed;
    obstacle.style.top = obstacleY + 'px';

    if (obstacleY > 600) {
        obstacleY = -40; 
        obstacleX = Math.floor(Math.random() * 10) * 40; 
        if (obstacleX >= 400) obstacleX = 360; 
        obstacle.style.left = obstacleX + 'px';
        
        score += 10; 
        scoreDisplay.innerText = score;
        obstacleSpeed += 0.2; 

        // Live check if you beat your current High Score
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.innerText = highScore;
            localStorage.setItem('arcadeHighScore', highScore); // Saves to laptop memory
        }
    }

    // 3. COLLISION DETECTION
    if (obstacleY >= 510 && obstacleY <= 570) {
        if (Math.abs(obstacleX - playerX) < 35) {
            endGame();
        }
    }
}

// 4. GAME OVER
function endGame() {
    isGameOver = true;
    clearInterval(gameInterval); 
    finalScoreDisplay.innerText = score;
    gameOverScreen.style.display = 'flex'; 
}

// 5. RESTART GAME
function restartGame() {
    score = 0;
    obstacleSpeed = 5;
    playerX = 180;
    obstacleY = -40;
    isGameOver = false;
    
    scoreDisplay.innerText = score;
    player.style.left = playerX + 'px';
    obstacle.style.top = obstacleY + 'px';
    gameOverScreen.style.display = 'none'; 
    
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 20); 
}

// 6. REVIVE PLAYER
function revivePlayer() {
    alert("🎬 Simulation: Loading Rewarded Video Ad...");
    alert("Ad complete! You've been revived. Keep going!");
    
    isGameOver = false;
    obstacleY = -100; 
    gameOverScreen.style.display = 'none';
    
    gameInterval = setInterval(gameLoop, 20); 
}

restartBtn.addEventListener('click', restartGame);
reviveBtn.addEventListener('click', revivePlayer);

// Start game
gameInterval = setInterval(gameLoop, 20);