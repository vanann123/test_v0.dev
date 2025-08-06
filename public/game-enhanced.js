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
        this.cannon = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 30,
            angle: 0,
            width: 40,
            height: 20
        };
        
        // Game objects
        this.bullets = [];
        this.balls = [];
        this.particles = [];
        
        // Mouse position
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Game settings
        this.ballSpawnRate = 0.02;
        this.ballSpeed = 1;
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
            
            // Calculate cannon angle
            const dx = this.mouseX - this.cannon.x;
            const dy = this.mouseY - this.cannon.y;
            this.cannon.angle = Math.atan2(dy, dx);
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
        this.ballSpeed = 1;
        
        this.updateUI();
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = 'Tạm Dừng';
        document.getElementById('gameOverModal').classList.add('hidden');
    }
    
    shoot() {
        const bullet = {
            x: this.cannon.x,
            y: this.cannon.y,
            vx: Math.cos(this.cannon.angle) * this.bulletSpeed,
            vy: Math.sin(this.cannon.angle) * this.bulletSpeed,
            radius: 3
        };
        this.bullets.push(bullet);
    }
    
    spawnBall() {
        if (Math.random() < this.ballSpawnRate) {
            const ball = {
                x: Math.random() * (this.canvas.width - 40) + 20,
                y: -20,
                vx: (Math.random() - 0.5) * 2,
                vy: this.ballSpeed + Math.random() * 2,
                radius: 15 + Math.random() * 10,
                color: this.getRandomColor(),
                points: Math.floor(Math.random() * 50) + 10
            };
            this.balls.push(ball);
        }
    }
    
    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
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
                continue;
            }

            // Check collision with balls
            for (let j = this.balls.length - 1; j >= 0; j--) {
                const ball = this.balls[j];
                const dx = bullet.x - ball.x;
                const dy = bullet.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < bullet.radius + ball.radius) {
                    // Hit!
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
    
    updateBalls() {
        for (let i = this.balls.length - 1; i >= 0; i--) {
            const ball = this.balls[i];
            ball.x += ball.vx;
            ball.y += ball.vy;
            
            // Check if ball reached bottom
            if (ball.y > this.canvas.height + ball.radius) {
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
        // Collision detection handled in updateBullets
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
        
        // Show level up notification
        this.showNotification(`Level ${this.level}!`, '#4ECDC4');
    }

    showNotification(text, color = '#4ECDC4') {
        // Create a temporary notification element
        const notification = document.createElement('div');
        notification.textContent = text;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${color};
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 24px;
            font-weight: bold;
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
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
        
        // Draw cannon
        this.drawCannon();

        // Draw crosshair
        this.drawCrosshair();

        // Draw balls
        this.balls.forEach(ball => {
            this.ctx.beginPath();
            this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = ball.color;
            this.ctx.fill();
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Draw points on ball
            this.ctx.fillStyle = '#333';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(ball.points, ball.x, ball.y + 4);
        });

        // Draw bullets
        this.bullets.forEach(bullet => {
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fill();
            this.ctx.strokeStyle = '#FFA500';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
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

    drawCannon() {
        this.ctx.save();
        this.ctx.translate(this.cannon.x, this.cannon.y);
        this.ctx.rotate(this.cannon.angle);
        
        // Cannon body
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(-this.cannon.width/2, -this.cannon.height/2, this.cannon.width, this.cannon.height);
        
        // Cannon barrel
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(this.cannon.width/2, -5, 30, 10);
        
        this.ctx.restore();
        
        // Cannon base
        this.ctx.beginPath();
        this.ctx.arc(this.cannon.x, this.cannon.y, 15, 0, Math.PI * 2);
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fill();
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }

    drawCrosshair() {
        if (this.gameRunning && !this.gamePaused) {
            this.ctx.strokeStyle = '#FF0000';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.cannon.x, this.cannon.y);
            this.ctx.lineTo(this.mouseX, this.mouseY);
            this.ctx.stroke();
            
            this.ctx.setLineDash([]);
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

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new BallShootingGameEnhanced();
    
    // Add CSS for notification animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        }
    `;
    document.head.appendChild(style);
});
