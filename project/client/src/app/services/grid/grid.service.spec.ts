import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from 'src/app/classes/canvas-test-helper';
import { Point } from 'src/app/interfaces/point';

import { GridService } from './grid.service';

describe('GridService', () => {
  let service: GridService;
  let canvas: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = canvasTestHelper.drawCanvas.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridService);
    service.ctx = canvas;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
    const point: Point = { x: 100, y: 100, color: 'black' };
    service.setOrigin(point);
    expect(service.origin.x).toEqual(100);
  });
});
