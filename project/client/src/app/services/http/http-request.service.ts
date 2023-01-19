import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user';
import { MissionState } from 'src/app/interfaces/missionState';
import { Drone } from 'src/app/interfaces/drone';
import { Command } from 'src/app/interfaces/command';
import { LogService } from '../log/log.service';
import { Action } from 'rxjs/internal/scheduler/Action';

@Injectable({
    providedIn: 'root',
})
export class HttpRequestService {
    url = 'http://localhost:4800/';

    constructor(private http: HttpClient, private logService: LogService) {}

    public postTestConnection(user: User): Observable<any> {
        return this.http.post(this.url + 'user', user);
    }

    public postMissionState(state: MissionState): Observable<any> {
        return this.http.post(this.url + 'state', state);
    }

    public getAvailableDrones(): Observable<any> {
        return this.http.get(this.url + 'scan');
    }

    public getPackets(): Observable<any> {
        return this.http.get(this.url + 'packet');
    }

    public postCommand(command: Command): Observable<any> {
        this.logService.addLog('user send command to server: ' + command.action + ' ' + command.arg);
        return this.http.post(this.url + 'command', command);
    }
}
