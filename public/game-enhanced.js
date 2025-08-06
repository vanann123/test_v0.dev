class BallShootingGameEnhanced {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.levelElement = document.getElementById('level');
        
        // Game state
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        
        // Player
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 30,
            width: 40,
            height: 20,
            color: '#2196f3'
        };
        
        // Game objects
        this.bullets = [];
        this.balls = [];
        this.particles = [];
        
        // Mouse position
        this.mouseX = this.canvas.width / 2;
        this.mouseY = this.canvas.height / 2;
        
        // Game settings
        this.ballSpawnRate = 0.02;
        this.ballSpeed = 2;
        this.bulletSpeed = 8;
        
        // Auth callback for saving scores
        this.onGameOver = null;
        
        this.setupEventListeners();
        this.gameLoop();
    }
    
    setGameOverCallback(callback) {
        this.onGameOver = callback;
    }
    
    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('click', (e) => {
            if (this.gameRunning && !this.gamePaused) {
                this.shoot();
            }
        });
        
        // Button events
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.resetGame());
    }
    
    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        document.getElementById('gameOverModal').classList.add('hidden');
    }
    
    togglePause() {
        this.gamePaused = !this.gamePaused;
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = this.gamePaused ? 'Tiếp Tục' : 'Tạm Dừng';
    }
    
    resetGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.bullets = [];
        this.balls = [];
        this.particles = [];
        this.ballSpawnRate = 0.02;
        this.ballSpeed = 2;
        
        this.updateUI();
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = 'Tạm Dừng';
        document.getElementById('gameOverModal').classList.add('hidden');
    }
    
    shoot() {
        const angle = Math.atan2(this.mouseY - this.player.y, this.mouseX - this.player.x);
        this.bullets.push({
            x: this.player.x,
            y: this.player.y,
            vx: Math.cos(angle) * this.bulletSpeed,
            vy: Math.sin(angle) * this.bulletSpeed,
            radius: 3,
            color: '#ffeb3b'
        });
    }
    
    spawnBall() {
        if (Math.random() < this.ballSpawnRate) {
            this.balls.push({
                x: Math.random() * (this.canvas.width - 40) + 20,
                y: -20,
                radius: 15 + Math.random() * 10,
                vy: this.ballSpeed + Math.random() * 2,
                color: this.getRandomColor(),
                points: Math.floor(Math.random() * 50) + 10
            });
        }
    }
    
    getRandomColor() {
        const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            
            // Remove bullets that are off screen
            if (bullet.x < 0 || bullet.x > this.canvas.width || 
                bullet.y < 0 || bullet.y > this.canvas.height) {
                this.bullets.splice(i, 1);
            }
        }
    }
    
    updateBalls() {
        for (let i = this.balls.length - 1; i >= 0; i--) {
            const ball = this.balls[i];
            ball.y += ball.vy;
            
            // Check if ball reached bottom
            if (ball.y > this.canvas.height) {
                this.balls.splice(i, 1);
                this.lives--;
                this.createExplosion(ball.x, this.canvas.height, '#ff4444');
                
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        }
    }
    
    checkCollisions() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            for (let j = this.balls.length - 1; j >= 0; j--) {
                const ball = this.balls[j];
                const dx = bullet.x - ball.x;
                const dy = bullet.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < bullet.radius + ball.radius) {
                    // Collision detected
                    this.score += ball.points;
                    this.createExplosion(ball.x, ball.y, ball.color);
                    
                    this.bullets.splice(i, 1);
                    this.balls.splice(j, 1);
                    
                    // Level up every 500 points
                    if (this.score > 0 && this.score % 500 === 0) {
                        this.levelUp();
                    }
                    
                    break;
                }
            }
        }
    }
    
    createExplosion(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 30,
                maxLife: 30,
                color: color
            });
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    levelUp() {
        this.level++;
        this.ballSpawnRate += 0.005;
        this.ballSpeed += 0.5;
    }
    
    async gameOver() {
        this.gameRunning = false;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverModal').classList.remove('hidden');
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        
        // Save score if callback is provided
        if (this.onGameOver && typeof this.onGameOver === 'function') {
            try {
                await this.onGameOver(this.score, this.level);
            } catch (error) {
                console.error('Error saving score:', error);
            }
        }
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.livesElement.textContent = this.lives;
        this.levelElement.textContent = this.level;
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw player
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x - this.player.width/2, this.player.y - this.player.height/2, 
                         this.player.width, this.player.height);
        
        // Draw aiming line
        if (this.gameRunning && !this.gamePaused) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(this.player.x, this.player.y);
            this.ctx.lineTo(this.mouseX, this.mouseY);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
        
        // Draw bullets
        this.bullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.color;
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw balls
        this.balls.forEach(ball => {
            this.ctx.fillStyle = ball.color;
            this.ctx.beginPath();
            this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw points on ball
            this.ctx.fillStyle = 'white';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(ball.points, ball.x, ball.y + 4);
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw pause overlay
        if (this.gamePaused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width/2, this.canvas.height/2);
        }
    }
    
    gameLoop() {
        if (this.gameRunning && !this.gamePaused) {
            this.spawnBall();
            this.updateBullets();
            this.updateBalls();
            this.updateParticles();
            this.checkCollisions();
            this.updateUI();
        }
        
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Export for use in React components
if (typeof window !== 'undefined') {
    window.BallShootingGameEnhanced = BallShootingGameEnhanced;
}
