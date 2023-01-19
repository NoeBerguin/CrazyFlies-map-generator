import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosComponent } from './videos.component';

describe('VideosComponent', () => {
    let component: VideosComponent;
    let fixture: ComponentFixture<VideosComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VideosComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VideosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('wheel up should increment tabs', () => {
        component.tabGroup.selectedIndex = 5;
        component.onLabels = true;
        const event = new WheelEvent('wheel', { deltaY: 4, deltaMode: 0 });
        // window.dispatchEvent(event);
        component.swapTabs(event);
        expect(component.tabGroup.selectedIndex).toEqual(6);
    });

    it('wheel down should decrement tabs', () => {
        component.tabGroup.selectedIndex = 5;
        component.onLabels = true;
        const event = new WheelEvent('wheel', { deltaY: -1, deltaMode: 0 });
        component.swapTabs(event);
        expect(component.tabGroup.selectedIndex).toEqual(4);
    });

    it('wheel event shouldnt modify selectedIndex if onLabels = false', () => {
        component.tabGroup.selectedIndex = 5;
        component.onLabels = false;
        const event = new WheelEvent('wheel', { deltaY: 4, deltaMode: 0 });
        component.swapTabs(event);
        expect(component.tabGroup.selectedIndex).toEqual(5);
    });

    it('h key should should decrement tabs', () => {
        component.tabGroup.selectedIndex = 5;
        const event = new KeyboardEvent('keydown', { key: 'h' });
        component.swapTabs2(event);
        expect(component.tabGroup.selectedIndex).toEqual(4);
    });

    it('l key should should increment tabs', () => {
        component.tabGroup.selectedIndex = 5;
        const event = new KeyboardEvent('keydown', { key: 'l' });
        component.swapTabs2(event);
        expect(component.tabGroup.selectedIndex).toEqual(6);
    });

    it('random key shouldnt increment or decrement tabs', () => {
        component.tabGroup.selectedIndex = 5;
        const event = new KeyboardEvent('keydown');
        component.swapTabs2(event);
        expect(component.tabGroup.selectedIndex).toEqual(5);
    });
});
