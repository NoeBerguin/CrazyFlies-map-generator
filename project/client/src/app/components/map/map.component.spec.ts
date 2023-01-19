import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from 'src/app/classes/canvas-test-helper';
import { MapService } from 'src/app/services/map/map.service';
import { HttpRequestService } from '../../services/http/http-request.service';
import { MapComponent } from './map.component';

describe('MapComponent', () => {
    let component: MapComponent;
    let fixture: ComponentFixture<MapComponent>;
    let httpRequestServiceSpy: jasmine.SpyObj<HttpRequestService>;
    let mouseEvent: MouseEvent;
    let canvas: CanvasRenderingContext2D;
    let mapService: MapService;
    let mouseEvent2: MouseEvent;

    beforeEach(async () => {
        canvas = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        httpRequestServiceSpy = jasmine.createSpyObj('httpRequestService', ['getTestConnection']);
        await TestBed.configureTestingModule({
            declarations: [MapComponent],

            imports: [HttpClientModule],
            providers: [{ provide: httpRequestServiceSpy, useValue: httpRequestServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        httpRequestServiceSpy = TestBed.inject(HttpRequestService) as jasmine.SpyObj<HttpRequestService>;
        mapService = TestBed.inject(MapService);
        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;

        mouseEvent2 = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MapComponent);
        component = fixture.componentInstance;
        component.lock = false;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onMouseEnterCanvas sould  call setIsMouseMouve()', () => {
        const spy = spyOn(mapService, 'setIsMouseMouve').and.callThrough();
        component.onMouseEnterCanvas(mouseEvent, canvas.canvas);
        expect(spy).toHaveBeenCalled();
    });

    it('onMouseLeave should  call setIsMouseMouve()', () => {
        const spy = spyOn(mapService, 'setIsMouseMouve').and.callThrough();
        component.onMouseLeave(mouseEvent, canvas.canvas);
        expect(spy).toHaveBeenCalled();
    });

    it('onMouseMove should  call setMousePos()', () => {
        const spy = spyOn(mapService, 'setMousePos').and.callThrough();
        component.onMouseMove(mouseEvent, canvas.canvas);
        expect(spy).not.toHaveBeenCalled();
    });

    // it('onMouseDown should set mouseDown to true', () => {
    //   component.onMouseMove(mouseEvent, canvas.canvas);
    //   expect(component.mouseDown).toEqual(true);
    // });

    it('onMouseDown should set mouseDown to false', () => {
        component.onMouseMove(mouseEvent, canvas.canvas);
        expect(component.mouseDown).toEqual(false);
    });

    it('onMouseMove should  call redrawMap()', () => {
        component.mouseDown = true;
        const spy = spyOn(mapService, 'redrawMap').and.callThrough();
        component.onMouseMove(mouseEvent, canvas.canvas);
        expect(spy).toHaveBeenCalled();
    });

    it('onMouseDown should set mousedown to true', () => {
        component.onMouseDown(mouseEvent2, canvas.canvas);
        expect(component.mouseDown).toEqual(true);
    });

    it('onMouseUp should set mousedown to false', () => {
        component.onMouseUp(mouseEvent2, canvas.canvas);
        expect(component.mouseDown).toEqual(false);
    });

    it('zoomIn should call zoomIn from mapService', () => {
        const spyZoomIn = spyOn(mapService, 'zoomIn').and.callThrough();
        component.zoomIn();
        expect(spyZoomIn).toHaveBeenCalled();
    });

    it('zoomOut should call zoomOut from mapService', () => {
        const spyZoomOut = spyOn(mapService, 'zoomOut').and.callThrough();
        component.zoomOut();
        expect(spyZoomOut).toHaveBeenCalled();
    });

    it('resize should call drawMap from mapService', () => {
        const drawMapSpy = spyOn(mapService, 'drawMap').and.callThrough();
        component.resize();
        expect(drawMapSpy).toHaveBeenCalled();
    });

    it('changeDimension should  set dimension to false', () => {
        component.changeDimension();
        expect(component.dimension).toEqual(false);
    });
});
