import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss', '../home.component.scss']
})
export class PersonComponent implements OnInit {

  @Input() public name: string = '';
  @Input() public role: string = '';

  constructor() {
  }

  ngOnInit(): void {
  }

}
