import { Injectable } from '@angular/core';
import { Drone } from 'src/app/interfaces/drone';
import { Point } from 'src/app/interfaces/point';
import { GridService } from '../grid/grid.service';
import { HttpRequestService } from '../http/http-request.service';
import { LogService } from '../log/log.service';

const FACTOR_SIMULATION = 100;
const FACTOR_PHYSIC = 1;
const NEW_MAP_SIZE = 10000;
const ORIGIN_POSITION = 5050;

@Injectable({
    providedIn: 'root',
})
export class MapService {
    listDrone: Drone[] = [];
    DX = 0;
    DY = 0;
    newMap: string[] = [];
    ox = 0;
    oy = 0;
    counter = 0;
    minimum = 10;
    public ctx: CanvasRenderingContext2D;
    mouseX = 0;
    mouseY = 0;
    isMouseOnCanvas = false;
    lock = false;
    MODE = 0;
    zoom = 1;

    constructor(private httpRequestService: HttpRequestService, private logService: LogService, private gridService: GridService) {
        this.updateMap();
        this.lookForPacket();
        this.generateNewMap();
    }

    private updateMap(): void {
        setInterval(() => {
            if (this.ctx) {
                this.redrawMap();
            }
        }, 20);
    }

    private generateNewMap(): void {
        for (let i = 0; i < NEW_MAP_SIZE; i++) {
            this.newMap.push('0');
        }
    }

    public setGridCanvas(): void {
        this.gridService.ctx = this.ctx;
    }

    private addlog(packet: any): void {
        this.logService.addLog(packet);
    }

    private lookForPacket(): void {
        setInterval(() => {
            if (this.lock) {
                this.httpRequestService.getPackets().subscribe(
                    (data) => {
                        for (const obj of data.content) {
                            const packet: any = JSON.parse(obj);
                            this.addlog(packet);
                            this.checkIfDroneExsit(packet.id);

                            this.setDronePosition(packet.state, packet.id, packet.x, packet.y, packet.battery, packet.yawn, this.MODE);
                            if (this.MODE === 0) {
                                this.generatePoints_physic(
                                    packet.x * FACTOR_PHYSIC,
                                    packet.y * FACTOR_PHYSIC,
                                    packet.z * FACTOR_PHYSIC,
                                    packet.front * FACTOR_PHYSIC,
                                    packet.back * FACTOR_PHYSIC,
                                    packet.right * FACTOR_PHYSIC,
                                    packet.left * FACTOR_PHYSIC,
                                );
                            } else {
                                this.generatePoints_simulation(
                                    packet.x * FACTOR_SIMULATION,
                                    packet.y * FACTOR_SIMULATION,
                                    packet.z * FACTOR_SIMULATION,
                                    packet.front * FACTOR_SIMULATION,
                                    packet.back * FACTOR_SIMULATION,
                                    packet.right * FACTOR_SIMULATION,
                                    packet.left * FACTOR_SIMULATION,
                                );
                            }
                        }
                    },
                    (error) => {
                        this.stopLookForPacket();
                    },
                );
            }
        }, 400);
    }

    private checkIfDroneExsit(id: number): boolean {
        for (const drone of this.listDrone) {
            if (drone.id === id) {
                return true;
            }
        }
        const posX = 0;
        const posY = 0;
        const newDrone: Drone = {
            id,
            uri: '',
            point: { x: posX, y: posY, color: 'green' },
            state: '',
            is_connected: false,
            battery: 100,
            pos: 0,
            yawn: 0,
        };
        this.listDrone.push(newDrone);
        return false;
    }

    public stopLookForPacket(): void {
        this.lock = false;
    }

    public startLookForPacket(): void {
        this.lock = true;
    }

    convertionPointToPosition(point: Point): number {
        const x = Math.floor(point.x / this.gridService.equivalance);
        const y = Math.floor(point.y / this.gridService.equivalance);
        const pos = ORIGIN_POSITION + this.gridService.width * y + x;
        return pos;
    }

    convertionPositionToPoint(position: number): Point {
        const x = Math.floor(position % this.gridService.width) * this.gridService.tileSize + this.DX;
        const y = Math.floor(position / this.gridService.width) * this.gridService.tileSize + this.DY;
        return { x, y, color: 'black' };
    }

    public setDronePosition(state: number, id: number, posX: number, posY: number, battery: number, yawn: number, mode: number): boolean {
        let factor = 1;
        mode === 0 ? (factor = FACTOR_PHYSIC) : (factor = FACTOR_SIMULATION);
        for (const drone of this.listDrone) {
            if (drone.id === id) {
                drone.state = this.checkState(state);
                drone.point.x = Number((posX * factor).toFixed(2));
                drone.point.y = Number((posY * factor).toFixed(2));
                drone.battery = Math.round(battery * 100);
                drone.pos = this.convertionPointToPosition({
                    x: Number((posX * factor).toFixed(2)),
                    y: Number((posY * factor).toFixed(2)),
                    color: 'black',
                });
                this.newMap[drone.pos] = '7';
                drone.yawn = yawn;
            }
        }
        return false;
    }

    private createPoint(x: number, y: number, directionFront: number, directionSide: number): void {
        const point: Point = {
            x: directionFront,
            y: directionSide,
            color: 'black',
        };
        point.x += x;
        point.y += y;
        if (this.filterAxesPoint(x, y, 0, point)) {
            this.addPoint(point);
        }
    }

    public generatePoints_physic(x: number, y: number, z: number, front: number, back: number, right: number, left: number): void {
        const limitMax = 1000;
        const limitMin = 0;
        if (front != null && back != null && right != null) {
            if (front >= limitMin && front <= limitMax) {
                this.createPoint(x, y, front, 0);
            }
            if (Math.abs(right) >= limitMin && Math.abs(right) <= limitMax) {
                this.createPoint(x, y, 0, right);
            }
            if (Math.abs(left) >= limitMin && Math.abs(left) <= limitMax) {
                this.createPoint(x, y, 0, -left);
            }
        }
    }

    private filterAxesPoint(droneX: number, droneY: number, yawn: number, capteur: Point): boolean {
        const dronePos = this.convertionPointToPosition({
            x: droneX,
            y: droneY,
            color: 'black',
        });
        const capteurPos = this.convertionPointToPosition({
            x: capteur.x,
            y: capteur.y,
            color: 'black',
        });
        if (capteurPos % this.gridService.width === dronePos % this.gridService.width) {
            return true;
        } else if (Math.floor(capteurPos / this.gridService.width) === Math.floor(dronePos / this.gridService.width)) {
            return true;
        }
        return false;
    }

    public generatePoints_simulation(x: number, y: number, z: number, front: number, back: number, right: number, left: number): void {
        let i = 0;
        if (front != null && back != null && right != null) {
            if (front !== -2 * FACTOR_SIMULATION) {
                i++;
                const point: Point = { x: x - front, y, color: 'black' };
                this.addPoint(point);
            }
            if (back !== -2 * FACTOR_SIMULATION) {
                i++;
                const point: Point = { x: x + back, y, color: 'black' };
                this.addPoint(point);
            }
            if (right !== -2 * FACTOR_SIMULATION) {
                i++;
                const point: Point = { x, y: y + right, color: 'black' };
                this.addPoint(point);
            }
            if (left !== -2 * FACTOR_SIMULATION) {
                i++;
                const point: Point = { x, y: y - left, color: 'black' };
                this.addPoint(point);
            }
        }
    }

    public setIsMouseMouve(state: boolean, posX: number, posY: number): void {
        this.isMouseOnCanvas = state;
        this.mouseX = posX;
        this.mouseY = posY;
    }

    private setGridOrigin(): void {
        const point: Point = this.convertionPositionToPoint(0);
        this.gridService.setOrigin({ x: point.x, y: point.y, color: 'blue' });
    }

    public drawMap(): void {
        this.setGridOrigin();
        for (let i = 0; i < NEW_MAP_SIZE; i++) {
            if (this.newMap[i] === '1') {
                const point: Point = this.convertionPositionToPoint(i);
                if (i === ORIGIN_POSITION) {
                    this.drawPoint({ x: point.x, y: point.y, color: 'blue' });
                } else {
                    this.drawPoint({ x: point.x, y: point.y, color: 'black' });
                }
            } else if (this.newMap[i] === '7') {
                const point: Point = this.convertionPositionToPoint(i);
                this.drawPoint({ x: point.x, y: point.y, color: 'red' });
            }
        }
        for (const drone of this.listDrone) {
            this.drawDrones(drone);
        }
    }

    public setMousePos(posX: number, posY: number): void {
        this.mouseX = posX;
        this.mouseY = posY;
    }

    private drawPoint(point: Point): void {
        this.ctx.fillStyle = point.color;
        this.ctx.fillRect(point.x, point.y, this.gridService.tileSize, this.gridService.tileSize);
    }

    private drawDrones(drone: Drone): void {
        const point: Point = this.convertionPositionToPoint(drone.pos);
        const img = document.createElement('img');
        img.src = '../../../assets/drone.png';
        const size = 30;
        this.ctx.drawImage(img, point.x - size / 2, point.y - size / 2, size, size);
        this.drawDroneAxes(point, drone.yawn);
    }

    private drawDroneAxes(point: Point, yawn: number): void {
        let rotatePoint = this.rotattion({ x: 50, y: 0, color: 'black' }, yawn);
        this.ctx.strokeStyle = 'rgb(255,0,0)';
        this.ctx.beginPath();
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(point.x + rotatePoint.x, point.y + rotatePoint.y);
        this.ctx.stroke();

        rotatePoint = this.rotattion({ x: 0, y: 50, color: 'black' }, yawn);
        this.ctx.strokeStyle = 'rgb(0,255,0)';
        this.ctx.beginPath();
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(point.x + rotatePoint.x, point.y + rotatePoint.y);
        this.ctx.stroke();
    }

    public addPoint(point: Point): void {
        const pos = this.convertionPointToPosition(point);
        let test = 0;
        for (const drone of this.listDrone) {
            if (
                pos ===
                (drone.pos ||
                    drone.pos + 1 ||
                    drone.pos - 1 ||
                    drone.pos - this.gridService.width ||
                    drone.pos + this.gridService.width ||
                    drone.pos - this.gridService.width + 1 ||
                    drone.pos + this.gridService.width + 1 ||
                    drone.pos - this.gridService.width - 1 ||
                    drone.pos + this.gridService.width - 1)
            ) {
                test = 1;
                break;
            }
        }
        if (test === 0) {
            if (this.newMap[pos] === '0') {
                this.newMap[pos] = '1';
            }
        }
    }

    public redrawMap(): void {
        // Store the current transformation matrix
        this.ctx.save();

        // Use the identity matrix while clearing the canvas
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Restore the transform
        this.ctx.restore();

        this.drawMap();
    }

    public moveCamera(): void {
        const speed = this.gridService.tileSize;
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        let dx = 0;
        let dy = 0;

        if (this.mouseX < 100) {
            dx += speed;
            this.DX += speed;
        }
        if (this.mouseX > this.ctx.canvas.width - 100) {
            dx -= speed;
            this.DX -= speed;
        }
        if (this.mouseY < 100) {
            dy += speed;
            this.DY += speed;
        }
        if (this.mouseY > this.ctx.canvas.height - 100) {
            dy -= speed;
            this.DY -= speed;
        }
        this.drawMap();
    }

    private rotattion(point: Point, yawn: number): Point {
        const angle = yawn * (Math.PI / 180);
        const x = point.x * Math.cos(angle) + point.y * Math.sin(angle);
        const y = -point.x * Math.sin(angle) + point.y * Math.cos(angle);
        point.x = x;
        point.y = y;
        return point;
    }

    public checkState(state: number): string {
        switch (state) {
            case 3: {
                return 'Return to Base';
            }
            case 4: {
                return 'Identify';
            }
            case 5: {
                return 'Start';
            }
            case 6: {
                return 'Stop';
            }
            case 7: {
                return 'Exploring';
            }
            case 8: {
                return 'Crashed';
            }
            default: {
                return 'Idle';
            }
        }
    }

    reset(mode: number): void {
        this.MODE = mode;
        this.listDrone = [];
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.newMap = [];
        this.generateNewMap();
    }

    zoomIn(): void {
        this.gridService.tileSize += 10;
        this.redrawMap();
    }

    zoomOut(): void {
        if (this.gridService.tileSize >= 20) {
            this.gridService.tileSize -= 10;
            this.redrawMap();
        }
    }
}
