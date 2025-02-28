import { GameObject } from './GameObject';

export class Enemy extends GameObject {
  private direction: number = 1;
  private speed: number = 100;
  private leftBound: number;
  private rightBound: number;
  private speedMultiplier: number;

  constructor(x: number, y: number, leftBound: number, rightBound: number, speedMultiplier: number = 1) {
    super(x, y, 40, 40);
    this.leftBound = leftBound;
    this.rightBound = rightBound;
    this.speedMultiplier = speedMultiplier;
    this.speed = 100 * this.speedMultiplier;
  }

  public update(deltaTime: number) {
    this.x += this.direction * this.speed * deltaTime;
    
    if (this.x <= this.leftBound) {
      this.x = this.leftBound;
      this.direction = 1;
    } else if (this.x + this.width >= this.rightBound) {
      this.x = this.rightBound - this.width;
      this.direction = -1;
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#F44336';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw eyes
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.x + this.width * 0.2, this.y + this.height * 0.2, this.width * 0.15, this.height * 0.15);
    ctx.fillRect(this.x + this.width * 0.65, this.y + this.height * 0.2, this.width * 0.15, this.height * 0.15);
    
    // Draw pupils
    ctx.fillStyle = '#000';
    const pupilOffset = this.direction > 0 ? 0.05 : -0.05;
    ctx.fillRect(this.x + this.width * (0.2 + pupilOffset), this.y + this.height * 0.2, this.width * 0.1, this.height * 0.1);
    ctx.fillRect(this.x + this.width * (0.65 + pupilOffset), this.y + this.height * 0.2, this.width * 0.1, this.height * 0.1);
    
    // Draw mouth
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(this.x + this.width * 0.3, this.y + this.height * 0.7);
    ctx.lineTo(this.x + this.width * 0.7, this.y + this.height * 0.7);
    ctx.lineTo(this.x + this.width * 0.5, this.y + this.height * 0.8);
    ctx.closePath();
    ctx.fill();
  }
}