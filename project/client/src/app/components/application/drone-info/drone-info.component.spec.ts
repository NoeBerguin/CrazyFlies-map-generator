import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Drone } from 'src/app/interfaces/drone';
import { HttpRequestService } from 'src/app/services/http/http-request.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DroneInfoComponent } from './drone-info.component';
import { HttpClientModule } from '@angular/common/http';
import { Action } from '../../../interfaces/command';
import { MapService } from 'src/app/services/map/map.service';
import { canvasTestHelper } from 'src/app/classes/canvas-test-helper';

describe('DroneInfoComponent', () => {
  let component: DroneInfoComponent;
  let fixture: ComponentFixture<DroneInfoComponent>;
  let httpRequestServiceSpy: HttpRequestService;
  let httpMock: HttpTestingController;
  let mapServiceSpy: MapService;
  let canvas: CanvasRenderingContext2D;

  beforeEach(async () => {
    canvas = canvasTestHelper.drawCanvas.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    await TestBed.configureTestingModule({
      declarations: [DroneInfoComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
      ],
      // schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    // component['mapService'].ctx = canvas;
    httpRequestServiceSpy = TestBed.inject(HttpRequestService);
    httpMock = TestBed.inject(HttpTestingController);
    mapServiceSpy = TestBed.inject(MapService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DroneInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sendCommand should send data to drone', () => {
    const command: number = null;
    const spy = spyOn(httpRequestServiceSpy, 'postCommand').and.callThrough();
    component.sendCommand(command);
    expect(spy).toHaveBeenCalled();
    const url = 'http://localhost:4800/command';
    const request = httpMock.expectOne(url);
    expect(request.request.method).toEqual('POST');
  });

  it('connectDrone should connect to drone', () => {
    const drone: Drone = {id: 1, uri: 'test', point: {x: 0, y: 0, color: 'black'},
    state: 'test', is_connected: true, battery: 40, pos: 1, yawn: 1 };
    const spy = spyOn(httpRequestServiceSpy, 'postCommand').and.callThrough();
    component.connectDrone(drone);
    expect(spy).toHaveBeenCalled();
    const url = 'http://localhost:4800/command';
    const request = httpMock.expectOne(url);
    expect(request.request.method).toEqual('POST');
  });

  it('startDrone should send a http request state change', () => {
    const drone: Drone = {id: 1, uri: 'test', point: {x: 0, y: 0, color: 'black'},
    state: 'test', is_connected: true, battery: 40, pos: 1, yawn: 1 };
    const spy = spyOn(httpRequestServiceSpy, 'postCommand').and.callThrough();
    component.startDrone(drone);
    expect(spy).toHaveBeenCalled();
    const url = 'http://localhost:4800/command';
    const request = httpMock.expectOne(url);
    expect(request.request.method).toEqual('POST');
  });

  it('stopDrone should send a http request state change', () => {
    const drone: Drone = {id: 1, uri: 'test', point: {x: 0, y: 0, color: 'black'},
    state: 'test', is_connected: true, battery: 40, pos: 1, yawn: 1 };
    const spy = spyOn(httpRequestServiceSpy, 'postCommand').and.callThrough();
    component.stopDrone(drone);
    expect(spy).toHaveBeenCalled();
    const url = 'http://localhost:4800/command';
    const request = httpMock.expectOne(url);
    expect(request.request.method).toEqual('POST');
  });

  it('returnToBase should send a http request state change', () => {
    const drone: Drone = {id: 1, uri: 'test', point: {x: 0, y: 0, color: 'black'},
    state: 'test', is_connected: true, battery: 40, pos: 1, yawn: 1 };
    const spy = spyOn(httpRequestServiceSpy, 'postCommand').and.callThrough();
    component.returnToBase(drone);
    expect(spy).toHaveBeenCalled();
    const url = 'http://localhost:4800/command';
    const request = httpMock.expectOne(url);
    expect(request.request.method).toEqual('POST');
  });

  // it('loadCrazyflieMode expect to be in crazyflieMode', () => {
  //   const spy = spyOn(mapServiceSpy, 'reset').and.callThrough();
  //   component.loadCrazyflieMode();
  //   expect(spy).toHaveBeenCalled();
  //   expect(component.crazyflieMode).toEqual(true);
  //   expect(component.simulationMode).toEqual(false);
  // });

  // it('loadSimulationMode expect to be in simulationMode', () => {
  //   const spy = spyOn(mapServiceSpy, 'reset').and.callThrough();
  //   component.loadSimulationMode();
  //   expect(spy).toHaveBeenCalled();
  //   expect(component.crazyflieMode).toEqual(false);
  //   expect(component.simulationMode).toEqual(true);
  // });

  it('scanCrazyflie should send a http request to get drones detected', () => {
    component.crazyflieMode = true;
    const spy = spyOn(httpRequestServiceSpy, 'postCommand').and.callThrough();
    component.scanCrazyflie();
    expect(spy).toHaveBeenCalled();
    const url = 'http://localhost:4800/command';
    const request = httpMock.expectOne(url);
    expect(request.request.method).toEqual('POST');
  });

  it('idCrazyflie should send a http request to activate drones LED', () => {
    const drone: Drone = {id: 1, uri: 'test', point: {x: 0, y: 0, color: 'black'},
    state: 'test', is_connected: true, battery: 40, pos: 1, yawn: 1 };
    const spy = spyOn(httpRequestServiceSpy, 'postCommand').and.callThrough();
    component.idCrazyflie(drone);
    expect(spy).toHaveBeenCalled();
    const url = 'http://localhost:4800/command';
    const request = httpMock.expectOne(url);
    expect(request.request.method).toEqual('POST');
  });

  // it('changeMissionMode should send a http request state change', () => {
  //   const mode: number = null;
  //   const spy = spyOn(httpRequestServiceSpy, 'postCommand').and.callThrough();
  //   component.changeMissionMode(mode);
  //   expect(spy).toHaveBeenCalled();
  //   const url = 'http://localhost:4800/command';
  //   const request = httpMock.expectOne(url);
  //   expect(request.request.method).toEqual('POST');
  // });

  // it('error should send a http request state change', () => {
  //   const error: string = null;
  //   component.error(error);
  // });

  it('get Action should return Action', () => {
    const action = component.actions;
    expect(Action).toEqual(action);
  });
});
