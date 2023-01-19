import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from 'src/app/classes/canvas-test-helper';
import { Drone } from 'src/app/interfaces/drone';
import { Packet } from 'src/app/interfaces/Packet';
import { LogService } from '../log/log.service';

import { MapService } from './map.service';

describe('MapService', () => {
    let service: MapService;
    let serviceSpy: MapService;
    let canvas: CanvasRenderingContext2D;
    let logServiceSpy: LogService;

    beforeEach(() => {
        canvas = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
        });
        service = TestBed.inject(MapService);
        serviceSpy = TestBed.inject(MapService);
        logServiceSpy = TestBed.inject(LogService);
    });

    // it('should be created', () => {
    //   expect(service).toBeTruthy();
    // });

    // it('should be created', () => {
    //   expect(service).toBeTruthy();
    // });

    // it('play with lock', () => {S
    //   service.startLookForPacket();
    //   expect(service.lock).toBeTruthy();
    //   service.stopLookForPacket();
    //   expect(service.lock).not.toBeTruthy();
    // });

    // it('addLogs should add new log ', () => {
    //   const spy = spyOn(logServiceSpy, 'addLog').and.callThrough();
    //   const fakePacket: Packet = {id: 1, state: null, x: null, y: null, z: null, front: null, back: null, right: null, left: null};
    //   service.counter = service.minimum + 1;
    //   // tslint:disable-next-line: no-string-literal
    //   service['addlog'](fakePacket);
    //   expect(spy).toHaveBeenCalled();
    // });

    // it('checkIfDroneExsit should look for exsisting drone', () => {
    //   let exit = service['checkIfDroneExsit'](1);
    //   expect(exit).toEqual(false);
    //   exit = service['checkIfDroneExsit'](1);
    //   expect(exit).toEqual(true);
    // });

    // it('setDronePosition should move drone', () => {
    //   service['checkIfDroneExsit'](1);
    //   let exit = service.setDronePosition(1, 1, 0, 0, 0, 0, 0);
    //   expect(exit).toEqual(false);
    //   exit = service.setDronePosition(1, 1, 500, 500, 500,0,1);
    //   expect(exit).toEqual(false);
    // });

    // it('set mouse position should modify position', () => {
    //   service.mouseX = 0;
    //   service.setMousePos(100, 100);
    //   expect( service.mouseX).toEqual(100);
    // });

    // it('generatePoints should call add point', () => {
    //   const spy = spyOn(service, 'addPoint').and.callThrough();
    //   // service.generatePoints(1, 1, 1, -2 * service.factor, -2 * service.factor, -2 * service.factor, -2 * service.factor);
    //   expect(spy).not.toHaveBeenCalled();
    //   // service.generatePoints(1, 1, 1, 100, 100, 100, 100);
    //   expect(spy).toHaveBeenCalled();
    // });

    // it('set mouse position should modify position', () => {
    //   const spy = spyOn(canvas, 'fillRect').and.callThrough();
    //   service.mouseX = 0;
    //   service.ctx = canvas;
    //   service.addPoint({x: 100, y: 100, z: 100, color: 'black'});
    //   service.map.push({x: 100, y: 100, z: 100, color: 'black'});
    //   service.drawMap();
    //   // tslint:disable-next-line: no-string-literal
    //   expect(spy).toHaveBeenCalled();
    // });
});
