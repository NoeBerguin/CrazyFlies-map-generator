import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Drone } from 'src/app/interfaces/drone';
import { Mission } from 'src/app/interfaces/mission';
import { HttpRequestService } from 'src/app/services/http/http-request.service';

import { ApplicationComponent } from './application.component';

describe('ApplicationComponent', () => {
  let component: ApplicationComponent;
  let fixture: ComponentFixture<ApplicationComponent>;
  let httpRequestServiceSpy: HttpRequestService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    httpRequestServiceSpy = TestBed.inject(HttpRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sendNewMission should send a http request to add mission to db ', () => {
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
    const spy = spyOn(httpRequestServiceSpy, 'postCommand').and.callThrough();
    const fakeDrones: Drone[] = [
      {
        id: 0,
        uri: 'test',
        point: null,
        state: 'test',
        is_connected: true,
        battery: 40,
        pos: 0,
        yawn: 0,
      },
    ];
    component.sendNewMission(mission);
    expect(spy).toHaveBeenCalled();
    const url = 'http://localhost:4800/command';
    const request = httpMock.expectOne(url);
    expect(request.request.method).toEqual('POST');
  });

  // it('getMissionHistory should send a http request to land the drone', () => {
  //   const spy = spyOn(httpRequestServiceSpy, 'postCommand').and.callThrough();
  //   component.sendNewMission(1);
  //   expect(spy).toHaveBeenCalled();
  // });
});
