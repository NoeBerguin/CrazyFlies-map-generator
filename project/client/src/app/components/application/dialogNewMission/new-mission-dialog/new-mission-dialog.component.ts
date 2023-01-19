import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Mission } from 'src/app/interfaces/mission';
import { LogService } from 'src/app/services/log/log.service';
import { MapService } from 'src/app/services/map/map.service';

@Component({
  selector: 'app-new-mission-dialog',
  templateUrl: './new-mission-dialog.component.html',
  styleUrls: ['./new-mission-dialog.component.scss'],
})
export class NewMissionDialogComponent {
  constructor(
    private mapService: MapService,
    private logService: LogService,
    public dialogRef: MatDialogRef<NewMissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Mission
  ) {
    this.data.id = Math.floor(Math.random() * 10000) + 1;
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    this.data.date = mm + '/' + dd + '/' + yyyy;
    this.data.time =
      String(today.getHours()) + ':' + String(today.getMinutes());
    this.data.nbDrones = this.mapService.listDrone.length;
    this.data.logs = this.logService.logs.toString();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
