import { GameObject } from './GameObject';

export class Exit extends GameObject {
  private pulse: number = 0;
  private pulseDirection: number = 1;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }

  public update(deltaTime: number) {
    this.pulse += deltaTime * 2 * this.pulseDirection;
    
    if (this.pulse > 1) {
      this.pulse = 1;
      this.pulseDirection = -1;
    } else if (this.pulse < 0) {
      this.pulse = 0;
      this.pulseDirection = 1;
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    // Draw portal effect
    const gradient = ctx.createRadialGradient(
      this.x + this.width / 2,
      this.y + this.height / 2,
      0,
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width / 2 + 10 * this.pulse
    );
    
    gradient.addColorStop(0, '#8c00ff');
    gradient.addColorStop(0.7, '#4b0082');
    gradient.addColorStop(1, 'rgba(75, 0, 130, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width / 2 + 5 * this.pulse,
      this.height / 2 + 5 * this.pulse,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw swirl
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(performance.now() / 500);
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const radius = this.width / 4;
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        Math.cos(angle + 0.5) * radius * 2,
        Math.sin(angle + 0.5) * radius * 2,
        Math.cos(angle + 1) * radius,
        Math.sin(angle + 1) * radius
      );
    }
    ctx.stroke();
    
    ctx.restore();
  }
}