import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Action, Command } from 'src/app/interfaces/command';
import { Mission } from 'src/app/interfaces/mission';
import { HttpRequestService } from 'src/app/services/http/http-request.service';

@Component({
  selector: 'app-history-dialog',
  templateUrl: './history-dialog.component.html',
  styleUrls: ['./history-dialog.component.scss'],
})
export class HistoryDialogComponent {
  listMission: Mission[] = [
    {
      id: 10,
      name: 'test',
      date: null,
      time: null,
      type: '',
      totalDistance: null,
      nbDrones: 0,
      logs: '',
      map: [],
    },
  ];
  displayedColumns: string[] = [
    'select',
    'id',
    'name',
    'date',
    'time',
    'type',
    'totalDistance',
    'nbDrones',
  ];
  dataSource = new MatTableDataSource<Mission>(this.listMission);
  selection = new SelectionModel<Mission>(true, []);

  constructor(
    public dialogRef: MatDialogRef<HistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Mission[],
    private httpRequestService: HttpRequestService
  ) {
    this.dataSource = new MatTableDataSource<Mission>(data);
    this.reloadListMission();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): any {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Mission): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  deleteMission(mission: Mission): void {
    const command: Command = { action: Action.DeleteMission, arg: mission };
    this.httpRequestService.postCommand(command).subscribe((data) => {
      this.reloadListMission();
    });
  }

  delete(): void {
    for (const mission of this.selection.selected) {
      this.deleteMission(mission);
    }
  }

  reloadListMission(): void {
    this.listMission = [];
    const command: Command = { action: Action.MissionHistory, arg: null };
    this.httpRequestService.postCommand(command).subscribe((data) => {
      for (const obj of data.content) {
        const mission: Mission = JSON.parse(obj);
        this.listMission.push(mission);
      }
      this.dataSource = new MatTableDataSource<Mission>(this.listMission);
    });
  }

  open(): void {
    this.data = this.selection.selected;
  }
}
