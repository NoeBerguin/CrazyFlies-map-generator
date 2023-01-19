import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpRequestService } from '../../services/http/http-request.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let httpRequestServiceSpy: HttpRequestService;
    let httpMock: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HomeComponent],
            imports: [HttpClientTestingModule],
            providers: [HTMLElement],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        httpRequestServiceSpy = TestBed.inject(HttpRequestService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should scroll', () => {
        const spy = jasmine.createSpy('scrollIntoView');
        const dummyElement = document.createElement('div');
        document.getElementById = jasmine.createSpy('HTMLElement');
        component.scroll(dummyElement);
        expect(spy).not.toHaveBeenCalled();
    });
});
