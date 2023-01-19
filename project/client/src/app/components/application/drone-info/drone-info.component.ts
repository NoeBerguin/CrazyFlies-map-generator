import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpRequestService } from 'src/app/services/http/http-request.service';
import { Drone } from 'src/app/interfaces/drone';
import { MapService } from 'src/app/services/map/map.service';
import { Action, Command } from 'src/app/interfaces/command';
import { MatDialog } from '@angular/material/dialog';
import { ErrorService } from 'src/app/services/error/error.service';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorComponent } from '../../error/error.component';

export interface Tile {
    color: string;
    cols: number;
    rows: number;
    text: string;
}

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'drone-info',
    templateUrl: './drone-info.component.html',
    styleUrls: ['./drone-info.component.scss', '../application.component.scss'],
})
export class DroneInfoComponent implements OnInit {
    listDrone: Drone[] = [];
    crazyflieMode = false;
    simulationMode = false;

    @ViewChild(MatAccordion) accordion: MatAccordion;

    constructor(
        private httpRequestService: HttpRequestService,
        private mapService: MapService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar,
        public snackBarService: ErrorService,
    ) {}

    ngOnInit(): void {}

    /*********************************************************************************************
     * ********************************************************************************************
     * * send command start to the drone in the SIMULATION
     * ********************************************************************************************
     * *********************************************************************************************/
    sendCommand(command: number): void {
        const data: Command = { action: command, arg: null };
        this.httpRequestService.postCommand(data).subscribe(
            // tslint:disable-next-line: no-shadowed-variable
            (data) => {},
            (error) => {
                this.error(error.message);
            },
        );
    }

    connectDrone(drone: Drone): void {
        console.log('try connect drone');
        const command: Command = { action: Action.ConnectDrone, arg: drone.uri };
        this.httpRequestService.postCommand(command).subscribe(
            (data) => {
                console.log(data.content);
                if (data.content === '1') {
                    drone.is_connected = true;
                } else {
                    this.error('Connection denied');
                    drone.is_connected = true;
                }
            },
            (error) => {
                this.error(error.message);
            },
        );
    }

    /*** ********************************************************************************************
     * * ********************************************************************************************
     * * send command START DRONE to a specific drone in PHYSIC environement
     * * ********************************************************************************************
     * * ********************************************************************************************/
    startDrone(drone: Drone): void {
        const command: Command = { action: Action.StartDrone, arg: drone.uri };
        this.httpRequestService.postCommand(command).subscribe(
            (data) => {},
            (error) => {
                this.error(error.message);
            },
        );
    }

    /*** ********************************************************************************************
     * * ********************************************************************************************
     * * send command STOP DRONE to a specific drone in PHYSIC environement
     * * ********************************************************************************************
     * * ********************************************************************************************/
    stopDrone(drone: Drone): void {
        const command: Command = { action: Action.StopDrone, arg: drone.uri };
        this.httpRequestService.postCommand(command).subscribe(
            (data) => {},
            (error) => {
                this.error(error.message);
            },
        );
    }

    /*** ********************************************************************************************
     * * ********************************************************************************************
     * * send command return to base to a specific drone in PHYSIC environement
     * * ********************************************************************************************
     * * ********************************************************************************************/
    returnToBase(drone: Drone): void {
        const command: Command = { action: Action.returnToBase, arg: drone.uri };
        this.httpRequestService.postCommand(command).subscribe(
            (data) => {},
            (error) => {
                this.error(error.message);
            },
        );
    }

    /*** ********************************************************************************************
     * * ********************************************************************************************
     * * change the interface view to control PHYSIC drones
     * * ********************************************************************************************
     * * ********************************************************************************************/
    loadCrazyflieMode(): void {
        this.crazyflieMode = true;
        this.simulationMode = false;
        this.mapService.startLookForPacket();
        this.changeMissionMode(0);
    }

    /*** ********************************************************************************************
     * * ********************************************************************************************
     * * change the interface view to control SIMULATE drones
     * * ********************************************************************************************
     * * ********************************************************************************************/
    loadSimulationMode(): void {
        this.crazyflieMode = false;
        this.simulationMode = true;
        this.mapService.startLookForPacket();
        this.changeMissionMode(1);
        // Initialize the list of drones
        this.listDrone = this.mapService.listDrone;
    }

    /*** ********************************************************************************************
     * * ********************************************************************************************
     * * Scan all the available drones
     * * ********************************************************************************************
     * * ********************************************************************************************/
    scanCrazyflie(): void {
        if (this.crazyflieMode === true) {
            this.listDrone = [];
            const temp = [];
            const command: Command = { action: Action.Scan, arg: null };
            this.httpRequestService.postCommand(command).subscribe(
                (data) => {
                    for (const obj of data.content) {
                        const drone: Drone = JSON.parse(obj);
                        drone.is_connected = false;
                        drone.state = 'undefined';
                        drone.pos = 0;
                        drone.yawn = 0;
                        drone.battery = 0;
                        drone.point = { x: 0, y: 0, color: 'black' };
                        temp.push(drone);
                    }
                    this.listDrone = temp;
                    this.mapService.listDrone = this.listDrone;
                },
                (error) => {
                    this.error(error.message);
                },
            );
        }
    }

    /*** ********************************************************************************************
     * * ********************************************************************************************
     * * Send a command to identify a specific drone,
     * * A green LED will turn ON
     * * ********************************************************************************************
     * * ********************************************************************************************/
    idCrazyflie(drone: Drone): void {
        const command: Command = { action: Action.Identify, arg: drone.uri };
        this.httpRequestService.postCommand(command).subscribe(
            (data) => {},
            (error) => {
                this.error(error.message);
            },
        );
    }

    /*** ********************************************************************************************
     * * ********************************************************************************************
     * * Send the new mission state to the server and reset the map
     * * *******************************************************************************************
     * * *********************************************************************************************/
    changeMissionMode(mode: number): void {
        this.mapService.reset(mode);

        const command: Command = { action: Action.ChangeMissionMode, arg: mode };
        this.httpRequestService.postCommand(command).subscribe(
            (data) => {},
            (error) => {
                this.error(error.message);
            },
        );
    }

    error(error: string): void {
        this.snackBarService.sendText('ERROR : ' + error);
        this.snackBar.openFromComponent(ErrorComponent, {
            duration: 3000,
        });
    }

    public get actions(): typeof Action {
        return Action;
    }
}
