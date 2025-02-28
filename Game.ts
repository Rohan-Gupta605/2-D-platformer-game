import { Player } from './Player';
import { Platform } from './Platform';
import { Coin } from './Coin';
import { Enemy } from './Enemy';
import { Exit } from './Exit';
import { SoundManager } from './SoundManager';
import { Difficulty, LevelData } from './types';
import { levels } from './levels';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Player;
  private platforms: Platform[] = [];
  private coins: Coin[] = [];
  private enemies: Enemy[] = [];
  private exit: Exit | null = null;
  private animationFrameId: number = 0;
  private lastTimestamp: number = 0;
  private soundManager: SoundManager;
  private setScore: (score: number) => void;
  private setLives: (lives: number) => void;
  private onLevelComplete: () => void;
  private score: number = 0;
  private lives: number = 3;
  private keys: { [key: string]: boolean } = {};
  private gameRunning: boolean = false;
  private currentLevel: number;
  private difficulty: Difficulty;
  private enemySpeedMultiplier: number = 1;
  private playerLivesMultiplier: number = 1;
  private isMobile: boolean;
  private touchMoveDirection: string | null = null;
  private safetyBoundary: number = 600; // Safety boundary to prevent infinite falling

  constructor(
    canvas: HTMLCanvasElement, 
    setScore: (score: number) => void,
    setLives: (lives: number) => void,
    level: number = 1,
    difficulty: Difficulty = Difficulty.NORMAL,
    onLevelComplete: () => void,
    isMobile: boolean = false
  ) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    this.ctx = context;
    this.setScore = setScore;
    this.setLives = setLives;
    this.onLevelComplete = onLevelComplete;
    this.currentLevel = level;
    this.difficulty = difficulty;
    this.isMobile = isMobile;
    
    // Set difficulty modifiers
    switch (difficulty) {
      case Difficulty.EASY:
        this.enemySpeedMultiplier = 0.7;
        this.playerLivesMultiplier = 1.5;
        break;
      case Difficulty.NORMAL:
        this.enemySpeedMultiplier = 1;
        this.playerLivesMultiplier = 1;
        break;
      case Difficulty.HARD:
        this.enemySpeedMultiplier = 1.5;
        this.playerLivesMultiplier = 0.7;
        break;
    }
    
    // Initialize sound manager
    this.soundManager = new SoundManager();
    
    // Initialize player with default position (will be updated in createLevel)
    this.player = new Player(50, 300);
    
    // Create level
    this.createLevel();
    
    // Set up event listeners
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private createLevel() {
    // Get level data (index is 0-based, level is 1-based)
    const levelIndex = this.currentLevel - 1;
    const levelData = levels[levelIndex] || levels[0];
    
    // Create platforms
    this.platforms = levelData.platforms.map(
      platform => new Platform(platform.x, platform.y, platform.width, platform.height)
    );
    
    // Create coins
    this.coins = levelData.coins.map(
      coin => new Coin(coin.x, coin.y)
    );
    
    // Create enemies with speed based on difficulty
    this.enemies = levelData.enemies.map(
      enemy => new Enemy(
        enemy.x, 
        enemy.y, 
        enemy.leftBound, 
        enemy.rightBound, 
        this.enemySpeedMultiplier
      )
    );
    
    // Set player start position
    if (levelData.playerStart) {
      this.player = new Player(levelData.playerStart.x, levelData.playerStart.y);
    } else {
      this.player = new Player(50, 300);
    }
    
    // Create exit if defined
    if (levelData.exit) {
      this.exit = new Exit(
        levelData.exit.x,
        levelData.exit.y,
        levelData.exit.width,
        levelData.exit.height
      );
    } else {
      this.exit = null;
    }
    
    // Set lives based on difficulty
    this.lives = Math.max(1, Math.floor(3 * this.playerLivesMultiplier));
    this.setLives(this.lives);
  }

  public start() {
    this.gameRunning = true;
    this.lastTimestamp = performance.now();
    this.animate(this.lastTimestamp);
    this.soundManager.playBackgroundMusic();
  }

  public stop() {
    this.gameRunning = false;
    window.cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.soundManager.stopBackgroundMusic();
  }

  public setMuted(muted: boolean) {
    this.soundManager.setMuted(muted);
  }

  // Mobile touch controls
  public setTouchMove(direction: string) {
    this.touchMoveDirection = direction;
  }

  public clearTouchMove() {
    this.touchMoveDirection = null;
  }

  public triggerJump() {
    if (this.player.canJump) {
      this.player.jump();
      this.soundManager.playJumpSound();
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys[e.key] = true;
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.key] = false;
  };

  private update(deltaTime: number) {
    // Handle player input - keyboard
    if (this.keys['ArrowLeft'] || this.keys['a']) {
      this.player.moveLeft(deltaTime);
    }
    if (this.keys['ArrowRight'] || this.keys['d']) {
      this.player.moveRight(deltaTime);
    }
    if ((this.keys['ArrowUp'] || this.keys[' '] || this.keys['w']) && this.player.canJump) {
      this.player.jump();
      this.soundManager.playJumpSound();
    }

    // Handle touch controls for mobile
    if (this.touchMoveDirection === 'left') {
      this.player.moveLeft(deltaTime);
    }
    if (this.touchMoveDirection === 'right') {
      this.player.moveRight(deltaTime);
    }

    // Update player
    this.player.update(deltaTime);
    
    // Check platform collisions
    this.player.canJump = false;
    for (const platform of this.platforms) {
      if (this.player.checkPlatformCollision(platform)) {
        this.player.canJump = true;
      }
    }
    
    // Check boundaries
    if (this.player.x < 0) this.player.x = 0;
    if (this.player.x + this.player.width > this.canvas.width) {
      this.player.x = this.canvas.width - this.player.width;
    }
    
    // Check if player fell off the screen or beyond safety boundary
    if (this.player.y > this.canvas.height || this.player.y > this.safetyBoundary) {
      this.loseLife();
      this.resetPlayerPosition();
    }
    
    // Update enemies
    for (const enemy of this.enemies) {
      enemy.update(deltaTime);
      
      // Check enemy collision
      if (this.player.checkCollision(enemy)) {
        this.loseLife();
        this.resetPlayerPosition();
        break;
      }
    }
    
    // Check coin collisions
    for (let i = this.coins.length - 1; i >= 0; i--) {
      if (this.player.checkCollision(this.coins[i])) {
        this.score += 10;
        this.setScore(this.score);
        this.soundManager.playCoinSound();
        this.coins.splice(i, 1);
      }
    }
    
    // Update exit if it exists
    if (this.exit) {
      this.exit.update(deltaTime);
      
      // Check if player reached the exit
      if (this.player.checkCollision(this.exit)) {
        this.soundManager.playLevelCompleteSound();
        this.onLevelComplete();
      }
    }
  }

  private loseLife() {
    this.lives--;
    this.setLives(this.lives);
    this.soundManager.playHurtSound();
    
    if (this.lives <= 0) {
      this.soundManager.playGameOverSound();
    }
  }

  private resetPlayerPosition() {
    // Get level data
    const levelIndex = this.currentLevel - 1;
    const levelData = levels[levelIndex] || levels[0];
    
    // Reset to level start position
    if (levelData.playerStart) {
      this.player.x = levelData.playerStart.x;
      this.player.y = levelData.playerStart.y;
    } else {
      this.player.x = 50;
      this.player.y = 300;
    }
    
    this.player.velocityY = 0;
    this.player.velocityX = 0;
  }

  private render() {
    // Clear canvas
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw exit if it exists (behind everything else)
    if (this.exit) {
      this.exit.draw(this.ctx);
    }
    
    // Draw platforms
    for (const platform of this.platforms) {
      platform.draw(this.ctx);
    }
    
    // Draw coins
    for (const coin of this.coins) {
      coin.draw(this.ctx);
    }
    
    // Draw enemies
    for (const enemy of this.enemies) {
      enemy.draw(this.ctx);
    }
    
    // Draw player
    this.player.draw(this.ctx);
    
    // Draw level info
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(this.canvas.width - 150, 10, 140, 30);
    this.ctx.fillStyle = 'white';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Level ${this.currentLevel}`, this.canvas.width - 20, 30);
  }

  private animate = (timestamp: number) => {
    if (!this.gameRunning) return;
    
    const deltaTime = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;
    
    this.update(deltaTime);
    this.render();
    
    if (this.lives > 0) {
      this.animationFrameId = window.requestAnimationFrame(this.animate);
    }
  };
}