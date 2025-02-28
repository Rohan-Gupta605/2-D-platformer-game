import { GameObject } from './GameObject';

export class Coin extends GameObject {
  private rotation: number = 0;

  constructor(x: number, y: number) {
    super(x, y, 20, 20);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    this.rotation += 0.05;
    
    // Save context
    ctx.save();
    
    // Translate to center of coin
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    
    // Rotate
    ctx.rotate(this.rotation);
    
    // Draw coin
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(0, 0, this.width / 2 * Math.abs(Math.cos(this.rotation)), this.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Restore context
    ctx.restore();
  }
}