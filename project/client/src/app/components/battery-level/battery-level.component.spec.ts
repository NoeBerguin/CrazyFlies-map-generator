import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BatteryLevelComponent } from './battery-level.component';

describe('BatteryLevelComponent', () => {
  let component: BatteryLevelComponent;
  let fixture: ComponentFixture<BatteryLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatteryLevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
