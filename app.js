/**
 * Hero Adventure Game - MOBILE OPTIMIZED VERSION
 */

class HeroAdventureGame {
    static CONSTANTS = {
        INITIAL_LIVES: 3,
        XP_PER_OBSTACLE: 100,
        JUMP_DURATION: 300, // Corresponds to CSS animation duration
        GAME_LOOP_INTERVAL: 16,
        COLLISION_TOLERANCE: 10,
        OBSTACLE_RESET_DELAY: 500, // Shorter for faster testing
        ANIMATION_RESET_DELAY: 100,
        LEVELS: Object.freeze([
            { name: "Ferro", minXp: 0, maxXp: 1000 },
            { name: "Bronze", minXp: 1001, maxXp: 2000 },
            { name: "Prata", minXp: 2001, maxXp: 5000 },
            { name: "Ouro", minXp: 5001, maxXp: 7000 },
            { name: "Platina", minXp: 7001, maxXp: 8000 },
            { name: "Ascendente", minXp: 8001, maxXp: 9000 },
            { name: "Imortal", minXp: 9001, maxXp: 10000 },
            { name: "Radiante", minXp: 10001, maxXp: Infinity },
        ])
    };

    constructor() {
        this.elements = this._cacheElements();
        this.gameState = {};
        this._initialize();
        this._setupMobileOptimizations();
    }

    _cacheElements() {
        const elements = {};
        const selectors = [
            'hero', 'obstacle', 'game-container', 'setup-container',
            'heroNameInput', 'startGameButton', 'hero-info', 'xp-info',
            'level-info', 'lives-info', 'game-over-container',
            'final-score', 'restartGameButton'
        ];
        selectors.forEach(id => elements[id] = document.getElementById(id));
        return elements;
    }

    _setupMobileOptimizations() {
        // Prevent default touch behaviors
        document.addEventListener('touchstart', (e) => {
            if (e.target === this.elements['game-container'] || 
                e.target.closest('#game-container')) {
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('#game-container')) {
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            if (e.target.closest('#game-container')) {
                e.preventDefault();
            }
        }, { passive: false });

        // Handle orientation changes
        this._handleOrientationChange();
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this._handleOrientationChange(), 100);
        });

        // Prevent context menu on long press
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Handle Enter key on setup screen
        this.elements.heroNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.startGame();
            }
        });
    }

    _handleOrientationChange() {
        // Force viewport recalculation
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
        }

        // Trigger resize event to recalculate game elements
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 200);
    }

    _initialize() {
        this.elements.startGameButton.addEventListener('click', () => this.startGame());
        this.elements.restartGameButton.addEventListener('click', () => this.restartGame());

        // Use animationend to reliably reset state after animations
        this.elements.hero.addEventListener('animationend', (e) => {
            if (e.animationName === 'jump') {
                this.elements.hero.classList.remove('jump');
                this.gameState.isJumping = false;
            }
        });

        // The simplified CSS handles infinite animation, so this is for collision reset
        this.elements.obstacle.addEventListener('animationend', () => {
            this._resetObstacle(); // Reset after it completes a cycle
        });

        this._showScreen('setup-container'); // Ensure setup screen is shown on init
    }

    getHeroLevel(xp) {
        return HeroAdventureGame.CONSTANTS.LEVELS.find(l => xp >= l.minXp && xp <= l.maxXp)?.name || "Desconhecido";
    }

    _updateHUD() {
        this.elements['hero-info'].textContent = `Herói: ${this.gameState.heroName}`;
        this.elements['xp-info'].textContent = `XP: ${this.gameState.heroXp}`;
        this.elements['level-info'].textContent = `Nível: ${this.getHeroLevel(this.gameState.heroXp)}`;
        this.elements['lives-info'].textContent = `Vidas: ${this.gameState.heroLives}`;

        // Update game container class based on lives
        if (this.gameState.heroLives === 1) {
            this.elements['game-container'].classList.add('one-life-mode');
        } else {
            this.elements['game-container'].classList.remove('one-life-mode');
        }
    }

    jump() {
        if (this.gameState.isJumping || !this.gameState.isGameRunning) return;
        this.gameState.isJumping = true;
        this.elements.hero.classList.add('jump');
    }

    _checkCollisionAndScore() {
        if (this.gameState.isInvincible) return;

        const heroRect = this.elements.hero.getBoundingClientRect();
        const obstacleRect = this.elements.obstacle.getBoundingClientRect();

        // Create a more precise, virtual hitbox based on user feedback
        // Visible part is 50% of width and 90% of height, centered.
        const horizontalOffset = obstacleRect.width * 0.25; // 25% transparent on each side
        const verticalOffset = obstacleRect.height * 0.05;   // 5% transparent on top

        const virtualHitbox = {
            left: obstacleRect.left + horizontalOffset,
            right: obstacleRect.right - horizontalOffset,
            top: obstacleRect.top + verticalOffset,
            bottom: obstacleRect.bottom // Bottom is on the ground, no offset needed
        };

        const isColliding = (
            heroRect.right > virtualHitbox.left &&
            heroRect.left < virtualHitbox.right &&
            heroRect.bottom > virtualHitbox.top
        );

        if (isColliding) {
            this._handleCollision();
            return;
        }

        // If the obstacle's right edge is to the left of the hero's left edge,
        // and we haven't scored for it yet, grant points.
        if (obstacleRect.right < heroRect.left && !this.elements.obstacle.passed) {
            this._handleObstaclePassed();
        }
    }

    _handleCollision() {
        this.gameState.heroLives--;
        this._updateHUD();

        if (this.gameState.heroLives <= 0) {
            this._endGame();
            return;
        }

        // Start invincibility period
        this.gameState.isInvincible = true;
        this.elements.hero.classList.add('hero-hit');
        this.elements.obstacle.style.display = 'none'; // Hide obstacle immediately

        setTimeout(() => {
            this.gameState.isInvincible = false;
            this.elements.hero.classList.remove('hero-hit');
            this._resetObstacle(); // Respawn obstacle after invincibility ends
        }, 1500); // 1.5 second invincibility
    }

    _handleObstaclePassed() {
        this.gameState.heroXp += HeroAdventureGame.CONSTANTS.XP_PER_OBSTACLE;
        this.elements.obstacle.passed = true;

        // Increase speed by reducing animation duration, but don't apply it yet
        this.gameState.obstacleDuration /= 1.01;

        this._updateHUD();
    }

    _resetObstacle() {
        // This function is called to respawn the obstacle. It ensures the animation
        // restarts from the beginning by forcing a CSS reflow.
        this.elements.obstacle.classList.remove('move');
        this.elements.obstacle.passed = false;

        // Apply the current speed before restarting the animation
        this.elements.obstacle.style.animationDuration = `${this.gameState.obstacleDuration}s`;

        // Use a timeout to re-add the class in a separate 'tick'.
        // This forces the browser to restart the animation.
        setTimeout(() => {
            if (this.gameState.isGameRunning) {
                this.elements.obstacle.style.display = 'block'; // Ensure it's visible
                this.elements.obstacle.classList.add('move');
            }
        }, 10);
    }

    _endGame() {
        this.gameState.isGameRunning = false;
        clearInterval(this.gameState.gameLoopId);
        this._cleanupGameControls(); // Cleanup controls when game ends
        this.elements.obstacle.classList.remove('move');
        this.elements['final-score'].textContent = `Fim de Jogo! Nível: ${this.getHeroLevel(this.gameState.heroXp)} | XP: ${this.gameState.heroXp}`;
        this._showScreen('game-over-container');
    }

    startGame() {
        const heroName = this.elements.heroNameInput.value.trim();
        if (!heroName) {
            alert('Digite o nome do seu herói!');
            return;
        }

        this._resetGameState(heroName);
        this._updateHUD();
        this._showScreen('game-container');
        this._setupGameControls();
        
        this.gameState.gameLoopId = setInterval(() => {
            if (this.gameState.isGameRunning) {
                this._checkCollisionAndScore();
            }
        }, HeroAdventureGame.CONSTANTS.GAME_LOOP_INTERVAL);

        this._setupObstacle();
    }

    _resetGameState(heroName) {
        this.gameState = {
            heroName,
            heroXp: 0,
            heroLives: HeroAdventureGame.CONSTANTS.INITIAL_LIVES,
            isJumping: false,
            isGameRunning: true,
            isInvincible: false, // Add invincibility state
            gameLoopId: this.gameState.gameLoopId || null,
            obstacleDuration: 2.5 // Initial animation duration in seconds
        };
    }

    _setupObstacle() {
        this.elements.obstacle.style.display = 'block';
        this.elements.obstacle.passed = false;
        // Set the initial animation speed
        this.elements.obstacle.style.animationDuration = `${this.gameState.obstacleDuration}s`;
        this.elements.obstacle.classList.add('move');
    }

    _setupGameControls() {
        this.keydownHandler = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.jump();
            }
        };
        document.addEventListener('keydown', this.keydownHandler);

        this._setupMobileControls(); // Setup mobile controls
    }

    _cleanupGameControls() {
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
        }
        this._cleanupMobileControls(); // Cleanup mobile controls
    }

    _setupMobileControls() {
        this.touchHandler = (e) => {
            e.preventDefault();
            this.jump();
        };
        this.elements['game-container'].addEventListener('touchstart', this.touchHandler);
    }

    _cleanupMobileControls() {
        if (this.touchHandler) {
            this.elements['game-container'].removeEventListener('touchstart', this.touchHandler);
        }
    }

    restartGame() {
        clearInterval(this.gameState.gameLoopId);
        this._cleanupGameControls();
        this._resetElements();
        this._showScreen('setup-container');
    }

    _resetElements() {
        this.elements.hero.classList.remove('jump');
        this.elements.obstacle.classList.remove('move');
        this.elements.obstacle.style.display = 'none';
    }

    _showScreen(screenId) {
        ['setup-container', 'game-container', 'game-over-container'].forEach(id => {
            this.elements[id].style.display = 'none'; // Hide all by default
        });
        // Show the requested screen
        if (screenId === 'game-container') {
            this.elements[screenId].style.display = 'block'; // Game container is block
        } else {
            this.elements[screenId].style.display = 'flex'; // Other screens are flex
        }
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.heroGame = new HeroAdventureGame();
});
