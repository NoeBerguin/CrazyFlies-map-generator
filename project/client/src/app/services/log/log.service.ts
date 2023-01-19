import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LogService {
    public logs: string[] = [];

    constructor() {}

    public addLog(packet: any): void {
        const log: string =
            'recive package : id = ' +
            packet.id +
            ' state = ' +
            packet.state +
            ' position = {' +
            packet.x +
            ' ' +
            packet.y +
            ' ' +
            packet.z +
            '}' +
            ' sensors = {' +
            packet.front +
            ' ' +
            packet.back +
            ' ' +
            packet.right +
            ' ' +
            packet.left +
            '}';
        this.logs.push(log);
    }
}
