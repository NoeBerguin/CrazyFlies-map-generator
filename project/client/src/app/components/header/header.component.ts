import { Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {

  links = ['application', 'videos'];
  activeLink = this.links[0];

  constructor() { }

  ngOnInit(): void { }
}
