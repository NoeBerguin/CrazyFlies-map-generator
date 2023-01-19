import { Component, OnInit, ViewChild, HostListener} from '@angular/core';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class VideosComponent implements OnInit {

  @ViewChild('tabGroup') tabGroup: { selectedIndex: number; };
  @ViewChild('tabGroup') tab: any;
  constructor() { }

  public onLabels: boolean;

  ngOnInit(): void {
    this.onLabels = false;
  }

  @HostListener('wheel', ['$event'])
  swapTabs(event: WheelEvent): void {
    // needed for hostlistener
    if (this.onLabels)
    {
      if (event.deltaY > 0)
      {
        this.tabGroup.selectedIndex++;
      }
      else
      {
        this.tabGroup.selectedIndex--;
      }
    }
    event.stopPropagation();
  }

  @HostListener('document:keydown', ['$event'])
  swapTabs2(event: KeyboardEvent): void{
    event.stopPropagation();
    if (event.key === 'l')
    {
        this.tabGroup.selectedIndex++;
    }
    else if (event.key === 'h')
    {
        this.tabGroup.selectedIndex--;
    }
  }
}
