import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Mission } from 'src/app/interfaces/mission';

import { NewMissionDialogComponent } from './new-mission-dialog.component';
const mision: Mission = {
    id: 1,
    name: 'string',
    date: 'string',
    time: 'string',
    type: 'string',
    totalDistance: 10,
    nbDrones: 10,
    logs: 'string',
    map: [],
};

describe('NewMissionDialogComponent', () => {
    let component: NewMissionDialogComponent;
    let fixture: ComponentFixture<NewMissionDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NewMissionDialogComponent],
            imports: [HttpClientModule],
            providers: [
                {
                    // I was expecting this will pass the desired value
                    provide: MAT_DIALOG_DATA,
                    useValue: mision,
                },
                {
                    // I was expecting this will pass the desired value
                    provide: MatDialogRef,
                    useValue: {},
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NewMissionDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
