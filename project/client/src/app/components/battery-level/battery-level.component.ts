import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-battery-level',
  templateUrl: './battery-level.component.html',
  styleUrls: ['./battery-level.component.scss'],
})
export class BatteryLevelComponent {
  @Input() public percentage: number;
  public circumference = 126; // 126 comes from 2 * pi * 20px (circle radius)
  public batteryPercentage: number;
  public animationBar = 0;

  constructor() {
    setInterval(() =>
    {
      this.batteryPercentage = this.percentage;
      this.animationBar = this.circumference - (this.circumference * this.percentage) / 100;
    }, 30);
  }
}
