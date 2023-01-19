import { Injectable } from '@angular/core';
import { Point } from 'src/app/interfaces/point';

const SIZE_100 = 100;
const ZERO = 0;

@Injectable({
  providedIn: 'root',
})
export class GridService {
  public ctx: CanvasRenderingContext2D;
  width = SIZE_100;
  height = SIZE_100;
  tileSize = 10;
  equivalance = 20;
  origin: Point = { x: ZERO, y: ZERO, color: 'blue' };

  constructor() {}

  drawGrid(): void {
    this.ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    for (let i = ZERO; i <= SIZE_100; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.origin.x + i * this.tileSize, this.origin.y);
      this.ctx.lineTo(
        this.origin.x + i * this.tileSize,
        this.origin.y + SIZE_100 * this.tileSize
      );
      this.ctx.stroke();
    }
    for (let j = ZERO; j <= SIZE_100; j++) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.origin.x, this.origin.y + j * this.tileSize);
      this.ctx.lineTo(
        this.origin.x + SIZE_100 * this.tileSize,
        this.origin.y + j * this.tileSize
      );
      this.ctx.stroke();
    }
  }

  setOrigin(point: Point): void {
    this.origin = point;
    this.drawGrid();
  }
}
