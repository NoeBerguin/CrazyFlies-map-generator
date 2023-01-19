import { TestBed } from '@angular/core/testing';

import { ErrorService } from './error.service';

describe('ErrorService', () => {
    let errorServiceStub: ErrorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        errorServiceStub = TestBed.inject(ErrorService);
    });

    it('should be created', () => {
        expect(errorServiceStub).toBeTruthy();
    });

    it('should call sendTest() ', () => {
        const text = 'ALLO';
        errorServiceStub.sendText(text);
        expect(errorServiceStub.text).toEqual(text);
    });
});
