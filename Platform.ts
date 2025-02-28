import { GameObject } from './GameObject';

export class Platform extends GameObject {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#795548';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw platform top
    ctx.fillStyle = '#8D6E63';
    ctx.fillRect(this.x, this.y, this.width, 10);
  }
}