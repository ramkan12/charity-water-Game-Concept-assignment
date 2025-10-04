/*
 * charity: water Game - JavaScript
 * Water Drop Catching Game
 */

// Game variables
let score = 0;
let timeLeft = 60;
let gameActive = false;
let timerInterval = null;
let dropInterval = null;

// Get HTML elements
const startButton = document.getElementById('start-button');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gameArea = document.getElementById('game-area');

// Start button click event
startButton.addEventListener('click', startGame);

// Function to start the game
function startGame() {
    // Reset game variables
    score = 0;
    timeLeft = 60;
    gameActive = true;

    // Update displays
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;

    // Clear game area and remove start screen
    gameArea.innerHTML = '';

    // Start the countdown timer
    startTimer();

    // Start creating water drops
    createDrops();
}

// Function to start and manage the timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        // Check if time is up
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000); // Update every second
}

// Function to create and drop water drops
function createDrops() {
    dropInterval = setInterval(() => {
        if (gameActive) {
            createSingleDrop();
        }
    }, 800); // Create a new drop every 800ms
}

// Function to create a single water drop
function createSingleDrop() {
    // Create drop element
    const drop = document.createElement('div');
    drop.classList.add('water-drop');

    // Randomly decide if it's clean (70% chance) or polluted (30% chance)
    const isClean = Math.random() > 0.3;

    if (isClean) {
        drop.classList.add('clean-drop');
        drop.dataset.points = '10'; // Clean drops worth 10 points
    } else {
        drop.classList.add('polluted-drop');
        drop.dataset.points = '-5'; // Polluted drops cost 5 points
    }

    // Random horizontal position (within game area)
    const gameAreaWidth = gameArea.offsetWidth;
    const randomX = Math.random() * (gameAreaWidth - 40); // 40px is drop width
    drop.style.left = randomX + 'px';
    drop.style.top = '-50px'; // Start above the game area

    // Animate drop falling
    let position = -50;
    const fallInterval = setInterval(() => {
        if (!gameActive || !drop.parentElement) {
            clearInterval(fallInterval);
            if (drop.parentElement) drop.remove();
            return;
        }

        position += 3; // Fall speed
        drop.style.top = position + 'px';

        // Remove drop if it goes below game area
        if (position > gameArea.offsetHeight) {
            clearInterval(fallInterval);
            drop.remove();
        }
    }, 20); // Update position every 20ms for smooth animation

    // Store the interval ID on the drop element so we can clear it later
    drop.dataset.intervalId = fallInterval;

    // Add click event to catch the drop
    drop.addEventListener('click', (e) => {
        e.stopPropagation();
        catchDrop(drop, fallInterval);
    });

    // Add drop to game area
    gameArea.appendChild(drop);
}

// Function to catch a drop when clicked
function catchDrop(drop, fallInterval) {
    if (!gameActive || !drop.parentElement) return;

    // Stop the drop from falling
    clearInterval(fallInterval);

    // Get points from drop
    const points = parseInt(drop.dataset.points);

    // Update score
    score += points;
    scoreDisplay.textContent = score;

    // Visual feedback - make drop disappear with animation
    drop.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
    drop.style.transform = 'rotate(45deg) scale(0)';
    drop.style.opacity = '0';
    drop.style.pointerEvents = 'none'; // Prevent multiple clicks

    setTimeout(() => {
        if (drop.parentElement) {
            drop.remove();
        }
    }, 200);
}

// Function to end the game
function endGame() {
    gameActive = false;

    // Stop all intervals
    clearInterval(timerInterval);
    clearInterval(dropInterval);

    // Remove all remaining drops
    const drops = document.querySelectorAll('.water-drop');
    drops.forEach(drop => drop.remove());

    // Show game over message
    gameArea.innerHTML = `
        <div class="start-screen">
            <h2 style="color: #0077BE;">Game Over!</h2>
            <p style="color: #0077BE; font-size: 1.5rem;">Final Score: ${score}</p>
            <p style="color: #0077BE;">Great job raising awareness for clean water!</p>
            <button id="restart-button" class="start-button">Play Again</button>
        </div>
    `;

    // Add event listener to restart button
    document.getElementById('restart-button').addEventListener('click', () => {
        location.reload(); // Simple page reload to restart
    });
}
