import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpRequestService } from 'src/app/services/http/http-request.service';
import { MapService } from 'src/app/services/map/map.service';
import { Action, Command } from 'src/app/interfaces/command';
import { MatDialog } from '@angular/material/dialog';
import { NewMissionDialogComponent } from './dialogNewMission/new-mission-dialog/new-mission-dialog.component';
import { Mission } from 'src/app/interfaces/mission';
import { HistoryDialogComponent } from './dialogHistory/history-dialog/history-dialog.component';
import { ErrorComponent } from '../error/error.component';
import { ErrorService } from 'src/app/services/error/error.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogService } from 'src/app/services/log/log.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})

/**********************************************************************************************
 * ********************************************************************************************
 * La classe ApplicationComponent represente la page "Application" de notre application.
 * Elle centralise l'ensemble des outils necessaire a l'utilisateur pour controller les drones
 * en environement physique et simule.
 * ********************************************************************************************
 **********************************************************************************************/
export class ApplicationComponent implements OnInit {
  crazyflieMode = false;
  simulationMode = false;

  constructor(
    private httpRequestService: HttpRequestService,
    private mapService: MapService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public snackBarService: ErrorService,
    private logService: LogService
  ) {}

  ngOnInit(): void {}

  /*** ********************************************************************************************
   * * ********************************************************************************************
   * * Open dialog to create a new mission
   * * ********************************************************************************************
   * * ********************************************************************************************/
  openDialogNewMission(): void {
    let mission: Mission;
    // tslint:disable-next-line: prefer-const
    let name: string;
    const dialogRef = this.dialog.open(NewMissionDialogComponent, {
      width: '95%',
      data: { name, mission },
    });

    dialogRef.afterClosed().subscribe((result) => {
      mission = result;
      console.log(mission);
      this.simulationMode = mission.type === 'Simulation';
      this.crazyflieMode = mission.type === 'Physics';
      this.sendNewMission(mission);
    });
  }

  /*** ********************************************************************************************
   * * ********************************************************************************************
   * * Open the history dialog, the user can chose to delete old mission,
   * * or to show old mission.
   * * ********************************************************************************************
   * * ********************************************************************************************/
  openDialogHistory(): void {
    const listMission: Mission[] = [];
    const dialogRef = this.dialog.open(HistoryDialogComponent, {
      width: '98%',
      data: listMission,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.mapService.newMap = result.map;
      this.logService.logs.push(String(result.logs));
    });
  }

  /*** ********************************************************************************************
   * * ********************************************************************************************
   * * Use to send the save of the current mission. When you click on "Save mission"
   * * or if you click on "New mission". (This fonction will change soon)
   * * ********************************************************************************************
   * * ********************************************************************************************/
  sendNewMission(mission: Mission): void {
    mission.map = this.mapService.newMap;
    const command: Command = { action: Action.NewMission, arg: mission };
    this.httpRequestService.postCommand(command).subscribe(
      (data) => {},
      (error) => {
        this.error(error.message);
      }
    );
  }

  error(error: string): void {
    this.snackBarService.sendText('ERROR : ' + error);
    this.snackBar.openFromComponent(ErrorComponent, {
      duration: 3000,
    });
  }
}
