document.addEventListener('DOMContentLoaded', () => {
    const hero = document.getElementById('hero');
    const obstacle = document.getElementById('obstacle');
    const gameContainer = document.getElementById('game-container');
    const setupContainer = document.getElementById('setup-container');
    const heroNameInput = document.getElementById('heroNameInput');
    const startGameButton = document.getElementById('startGameButton');
    const heroInfo = document.getElementById('hero-info');
    const xpInfo = document.getElementById('xp-info');
    const levelInfo = document.getElementById('level-info');
    const livesInfo = document.getElementById('lives-info');
    const gameOverContainer = document.getElementById('game-over-container');
    const finalScore = document.getElementById('final-score');
    const restartGameButton = document.getElementById('restartGameButton');

    let heroName = '';
    let heroXp = 0;
    let heroLives = 3;
    let isJumping = false;
    let gameInterval = null;
    let keydownListener = null;
    let touchstartListener = null;

    const levels = [
        { name: "Ferro", minXp: 0, maxXp: 1000 },
        { name: "Bronze", minXp: 1001, maxXp: 2000 },
        { name: "Prata", minXp: 2001, maxXp: 5000 },
        { name: "Ouro", minXp: 5001, maxXp: 7000 },
        { name: "Platina", minXp: 7001, maxXp: 8000 },
        { name: "Ascendente", minXp: 8001, maxXp: 9000 },
        { name: "Imortal", minXp: 9001, maxXp: 10000 },
        { name: "Radiante", minXp: 10001, maxXp: Infinity },
    ];

    const getHeroLevel = (xp) => {
        return levels.find(l => xp >= l.minXp && xp <= l.maxXp)?.name || "Desconhecido";
    };

    const updateHUD = () => {
        heroInfo.textContent = `Herói: ${heroName}`;
        xpInfo.textContent = `XP: ${heroXp}`;
        levelInfo.textContent = `Nível: ${getHeroLevel(heroXp)}`;
        livesInfo.textContent = `Vidas: ${heroLives}`;
    };

    const jump = () => {
        if (isJumping) return;
        isJumping = true;
        hero.classList.add('jump');
        setTimeout(() => {
            hero.classList.remove('jump');
            isJumping = false;
        }, 800);
    };

    const checkCollisionAndScore = () => {
        const heroRect = hero.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        // Collision detection - melhorada para ser mais precisa
        if (
            heroRect.right > obstacleRect.left + 10 &&
            heroRect.left < obstacleRect.right - 10 &&
            heroRect.bottom > obstacleRect.top + 10 &&
            heroRect.top < obstacleRect.bottom - 10
        ) {
            heroLives--;
            updateHUD();

            if (heroLives <= 0) {
                endGame();
                return;
            }

            // Reset obstacle after collision
            resetObstacle();
        }

        // Award XP when the obstacle is passed
        if (obstacleRect.right < heroRect.left && !obstacle.passed) {
            heroXp += 100;
            updateHUD();
            obstacle.passed = true;
        }
    };

    const resetObstacle = () => {
        obstacle.classList.remove('move');
        obstacle.style.right = '-100px';
        obstacle.passed = false;
        setTimeout(() => {
            obstacle.classList.add('move');
        }, 1000); // Pequena pausa após colisão
    };

    const endGame = () => {
        clearInterval(gameInterval);
        obstacle.classList.remove('move');
        
        // Remove event listeners
        if (keydownListener) {
            document.removeEventListener('keydown', keydownListener);
        }
        if (touchstartListener) {
            document.removeEventListener('touchstart', touchstartListener);
        }
        
        finalScore.textContent = `O Herói ${heroName} alcançou o rank ${getHeroLevel(heroXp)} com ${heroXp} de XP.`;
        gameOverContainer.style.display = 'flex';
        gameContainer.style.display = 'none';
    };

    const startGame = () => {
        heroName = heroNameInput.value.trim();
        if (!heroName) {
            alert('Por favor, digite o nome do seu herói!');
            return;
        }

        // Reset game state
        heroXp = 0;
        heroLives = 3;
        isJumping = false;
        updateHUD();

        // Show game and hide setup
        setupContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        obstacle.style.display = 'block';
        obstacle.passed = false;

        // Start obstacle movement
        obstacle.style.right = '-100px';
        obstacle.classList.add('move');
        
        // Start game loop
        gameInterval = setInterval(checkCollisionAndScore, 10);

        // Add event listeners for controls
        keydownListener = (e) => {
            if (e.code === 'Space') {
                e.preventDefault(); // Previne scroll da página
                jump();
            }
        };
        
        touchstartListener = (e) => {
            e.preventDefault(); // Previne comportamentos padrão do touch
            jump();
        };

        document.addEventListener('keydown', keydownListener);
        document.addEventListener('touchstart', touchstartListener);
    };

    const restartGame = () => {
        // Reset obstacle
        obstacle.classList.remove('move');
        obstacle.style.right = '-100px';
        obstacle.style.display = 'none';
        obstacle.passed = false;
        
        // Remove jump class if present
        hero.classList.remove('jump');
        
        // Clear any existing interval
        if (gameInterval) {
            clearInterval(gameInterval);
        }
        
        // Remove event listeners
        if (keydownListener) {
            document.removeEventListener('keydown', keydownListener);
        }
        if (touchstartListener) {
            document.removeEventListener('touchstart', touchstartListener);
        }
        
        // Show setup screen
        gameOverContainer.style.display = 'none';
        setupContainer.style.display = 'flex';
        
        // Clear input
        heroNameInput.value = '';
    };

    // Event listeners for buttons
    startGameButton.addEventListener('click', startGame);
    restartGameButton.addEventListener('click', restartGame);

    // Handle obstacle animation end
    obstacle.addEventListener('animationend', () => {
        if (obstacle.classList.contains('move')) {
            resetObstacle();
        }
    });

    // Allow Enter key to start game
    heroNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            startGame();
        }
    });
});