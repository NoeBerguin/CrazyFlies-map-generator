import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapService } from 'src/app/services/map/map.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})

/**********************************************************************************************
 * ********************************************************************************************
 * This class represent the map of the application. It should show the current drones positions
 *  and generate the map.
 * ********************************************************************************************
 **********************************************************************************************/
export class MapComponent implements OnInit, OnDestroy {
    @ViewChild('canvas', { static: false })
    canvas: ElementRef<HTMLCanvasElement>;

    previewCtx: CanvasRenderingContext2D;
    public lock = true;
    dimension = true;
    mouseDown = false;
    resizeObservable: Observable<Event>;
    resizeSubscription: Subscription;
    dragStart = { x: 0, y: 0 };
    dragEnd = { x: 0, y: 0 };

    constructor(private mapService: MapService) {}

    ngOnInit(): void {
        this.resizeObservable = fromEvent(window, 'resize');
        this.resizeSubscription = this.resizeObservable.subscribe((evt) => {
            this.resize();
        });
        this.mapService.setGridCanvas();
    }

    ngOnDestroy(): void {
        this.resizeSubscription.unsubscribe();
    }

    changeDimension(): void {
        this.dimension = !this.dimension;
    }

    // tslint:disable-next-line: use-lifecycle-interface
    ngAfterViewInit(): void {
        this.mapService.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.mapService.setGridCanvas();
        this.mapService.ctx.canvas.width = window.innerWidth * 0.9;
        this.mapService.ctx.canvas.height = window.innerHeight * 0.8;
        this.mapService.drawMap();
    }

    onMouseEnterCanvas(event: MouseEvent, canvas: HTMLElement): void {
        const bounds = canvas.getBoundingClientRect();
        const posX = event.clientX - bounds.left;
        const posY = event.clientY - bounds.top;
        this.mapService.setIsMouseMouve(true, posX, posY);
    }

    /*** ********************************************************************************************
     * * ********************************************************************************************
     * * This method is use to detect when the mous leave the canvas. It is use to stop
     * * moving the points present on the map.
     * * ********************************************************************************************
     * * ********************************************************************************************/
    onMouseLeave(event: MouseEvent, canvas: HTMLElement): void {
        this.mapService.setIsMouseMouve(false, 0, 0);
    }

    /*** ********************************************************************************************
     * * ********************************************************************************************
     * * This method is use to detect when the mous enter on the canvas. It is use to move all the
     * * points present on the map. the clientX represent the absolute mouse position.
     * * PosX represent the relative mouse Position
     * * ********************************************************************************************
     * * ********************************************************************************************/
    onMouseMove(event: MouseEvent, canvas: HTMLElement): void {
        const bounds = canvas.getBoundingClientRect();
        if (this.mouseDown) {
            this.dragEnd = {
                x: event.pageX - canvas.offsetLeft,
                y: event.pageY - canvas.offsetTop,
            };
            this.mapService.ctx.translate(this.dragEnd.x - this.dragStart.x, this.dragEnd.y - this.dragStart.y);
            this.mapService.redrawMap();
            this.dragStart = this.dragEnd;
        }
    }

    onMouseDown(event: MouseEvent, canvas: HTMLElement): void {
        this.dragStart = {
            x: event.pageX - canvas.offsetLeft,
            y: event.pageY - canvas.offsetTop,
        };

        this.mouseDown = true;
    }

    onMouseUp(event: MouseEvent, canvas: HTMLElement): void {
        this.mouseDown = false;
    }

    zoomIn(): void {
        this.mapService.zoomIn();
    }

    zoomOut(): void {
        this.mapService.zoomOut();
    }

    resize(): void {
        this.mapService.ctx.canvas.width = window.innerWidth * 0.9;
        this.mapService.ctx.canvas.height = window.innerHeight * 0.8;
        this.mapService.drawMap();
    }
}
