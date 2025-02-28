import { GameObject } from './GameObject';
import { Platform } from './Platform';

export class Player extends GameObject {
  public velocityX: number = 0;
  public velocityY: number = 0;
  public canJump: boolean = false;
  private readonly gravity: number = 1000;
  private readonly jumpForce: number = -500;
  private readonly moveSpeed: number = 300;
  private lastY: number = 0;
  private wasMovingDown: boolean = false;

  constructor(x: number, y: number) {
    super(x, y, 40, 60);
    this.lastY = y;
  }

  public update(deltaTime: number) {
    // Store previous position for collision detection
    this.lastY = this.y;
    
    // Apply gravity
    this.velocityY += this.gravity * deltaTime;
    
    // Update position
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;
    
    // Determine if player was moving down
    this.wasMovingDown = this.velocityY > 0;
    
    // Apply friction
    this.velocityX *= 0.9;
  }

  public moveLeft(deltaTime: number) {
    this.velocityX = -this.moveSpeed;
  }

  public moveRight(deltaTime: number) {
    this.velocityX = this.moveSpeed;
  }

  public jump() {
    if (this.canJump) {
      this.velocityY = this.jumpForce;
      this.canJump = false;
    }
  }

  public checkPlatformCollision(platform: Platform): boolean {
    // Check if player is falling
    if (this.velocityY < 0) return false;
    
    // Check if player's feet are at platform level
    const playerBottom = this.y + this.height;
    const platformTop = platform.y;
    const previousPlayerBottom = this.lastY + this.height;
    
    // Only allow landing on platform if player was above the platform in the previous frame
    // This prevents "snapping" to platforms when jumping near them
    if (previousPlayerBottom <= platformTop && this.wasMovingDown) {
      // Check horizontal overlap
      if (
        this.x + this.width > platform.x &&
        this.x < platform.x + platform.width &&
        playerBottom >= platformTop
      ) {
        // Snap player to platform
        this.y = platform.y - this.height;
        this.velocityY = 0;
        return true;
      }
    }
    
    return false;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw face
    ctx.fillStyle = '#333';
    ctx.fillRect(this.x + this.width * 0.7, this.y + this.height * 0.3, this.width * 0.15, this.height * 0.1);
    ctx.fillRect(this.x + this.width * 0.3, this.y + this.height * 0.3, this.width * 0.15, this.height * 0.1);
    
    // Draw mouth
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + this.height * 0.6, this.width * 0.2, 0, Math.PI);
    ctx.stroke();
  }
}