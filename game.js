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

// 1. LAPTOP CONTROLS (Keyboard Left & Right Arrow Keys)
document.addEventListener('keydown', (event) => {
    if (isGameOver) return; 

    if (event.key === 'ArrowLeft' && playerX > 0) {
        playerX -= 40; 
    } else if (event.key === 'ArrowRight' && playerX < 360) {
        playerX += 40; 
    }
    
    player.style.left = playerX + 'px';
});

// 2. MOBILE TOUCH CONTROLS (Tap Left or Right side of screen)
document.addEventListener('touchstart', (event) => {
    if (isGameOver) return;
    
    // Prevents the phone from scrolling or dragging the page while playing
    event.preventDefault(); 

    const touchX = event.touches[0].clientX;
    const screenMiddle = window.innerWidth / 2;

    if (touchX < screenMiddle) {
        if (playerX > 0) playerX -= 40; // Move Left
    } else {
        if (playerX < 360) playerX += 40; // Move Right
    }

    player.style.left = playerX + 'px';
}, { passive: false });

// 3. THE MAIN GAME LOOP
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
            localStorage.setItem('arcadeHighScore', highScore); 
        }
    }

    // 4. COLLISION DETECTION
    if (obstacleY >= 510 && obstacleY <= 570) {
        if (Math.abs(obstacleX - playerX) < 35) {
            endGame();
        }
    }
}

// 5. GAME OVER
function endGame() {
    isGameOver = true;
    clearInterval(gameInterval); 
    finalScoreDisplay.innerText = score;
    gameOverScreen.style.display = 'flex'; 
}

// 6. RESTART GAME
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

// 7. REAL ADSTERRA REVIVE PLAYER
function revivePlayer() {
    // Flag to check if the player is waiting for a revive
    let waitingToRevive = true;

    // Listen for when the user switches tabs back to the game
    const handleVisibilityChange = () => {
        if (!document.hidden && waitingToRevive) {
            // 1. Unfreeze the game state
            isGameOver = false;
            
            // 2. Clear old loops
            clearInterval(gameInterval);
            
            // 3. Reset obstacle positions out of the way
            obstacleY = -150; 
            obstacleX = Math.floor(Math.random() * 10) * 40;
            if (obstacleX >= 400) obstacleX = 360;
            obstacle.style.left = obstacleX + 'px';
            obstacle.style.top = obstacleY + 'px';
            
            // 4. Hide the game over screen
            gameOverScreen.style.display = 'none';
            
            // 5. Restart the game ticks
            gameInterval = setInterval(gameLoop, 20); 
            
            // Clean up the event listener so it doesn't run again accidentally
            waitingToRevive = false;
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
    };

    // Activate the listener right when they click the button and go to the ad tab
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Backup: If they don't leave the tab or if the popunder doesn't steal focus, revive after 1 second anyway
    setTimeout(() => {
        if (waitingToRevive) {
            isGameOver = false;
            clearInterval(gameInterval);
            obstacleY = -150;
            gameOverScreen.style.display = 'none';
            gameInterval = setInterval(gameLoop, 20);
            waitingToRevive = false;
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
    }, 1000);
}

// Event listeners to handle button clicks
restartBtn.addEventListener('click', restartGame);
reviveBtn.addEventListener('click', revivePlayer);

// Initial start of the game
clearInterval(gameInterval);
gameInterval = setInterval(gameLoop, 20);
