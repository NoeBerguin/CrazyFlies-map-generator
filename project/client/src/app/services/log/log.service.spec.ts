import { TestBed } from '@angular/core/testing';

import { LogService } from './log.service';

describe('LogService', () => {
    let service: LogService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LogService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('log should be added to logs array', () => {
        const packet: any = {
            id: 0,
            state: 100,
            x: 1,
            y: 2,
            z: 3,
            front: 5,
            back: 6,
            right: 7,
            left: 8,
        };
        service.addLog(packet);
        expect(service.logs.length).toEqual(1);
    });
});
