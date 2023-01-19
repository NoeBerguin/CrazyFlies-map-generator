import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Mission } from 'src/app/interfaces/mission';
import { HttpRequestService } from 'src/app/services/http/http-request.service';
import { HistoryDialogComponent } from './history-dialog.component';
import { Subject } from 'rxjs/internal/Subject';

const mission: Mission = {
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
describe('HistoryDialogComponent', () => {
    let component: HistoryDialogComponent;
    let fixture: ComponentFixture<HistoryDialogComponent>;
    let httpRequestServiceSpy: HttpRequestService;
    let httpMock: HttpTestingController;
    let matrefSpy: jasmine.SpyObj<MatDialogRef<HistoryDialogComponent>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HistoryDialogComponent],
            imports: [HttpClientTestingModule],
            providers: [
                {
                    // I was expecting this will pass the desired value
                    provide: MAT_DIALOG_DATA,
                    useValue: mission,
                },
                {
                    // I was expecting this will pass the desired value
                    provide: MatDialogRef,
                    useValue: (matrefSpy = jasmine.createSpyObj('dialogRef', ['close']) as jasmine.SpyObj<MatDialogRef<any>>),
                },
            ],
        }).compileComponents();
        httpRequestServiceSpy = TestBed.inject(HttpRequestService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HistoryDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('deleteMission', () => {
        const spy = spyOn(httpRequestServiceSpy, 'postCommand').and.callThrough();
        component.deleteMission(mission);
        expect(spy).toHaveBeenCalled();
    });

    it('reloadListMission', () => {
        const spy = spyOn(httpRequestServiceSpy, 'postCommand').and.callThrough();
        component.reloadListMission();
        expect(spy).toHaveBeenCalled();
    });

    it('delete', () => {
        component.selection.selected.push(mission);
        const spy = spyOn(component, 'deleteMission').and.callThrough();
        component.delete();
        expect(spy).toHaveBeenCalled();
    });

    it('should close the dialog when onNoClick is called', () => {
        component.onNoClick();
        // tslint:disable-next-line: no-string-literal
        expect(component['dialogRef'].close).toHaveBeenCalled();
    });

    // it('masterToggle should call isAllSelected', () => {
    //   component["selection"].selected.length = 1;
    //   component["dataSource"].data.length =1;
    //   component.isAllSelected();
    //   expect(component.isAllSelected).toEqual(true);

    // });

    // it('should set data when open is called', () => {
    //   const selectionspy = jasmine.createSpyObj('SelectionModel','clear')
    //   component.isAllSelected();
    // });
});
