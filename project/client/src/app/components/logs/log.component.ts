import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/services/log/log.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})

/**********************************************************************************************
 * ********************************************************************************************
 * The class "LogComponent" represent the "Log" page in our application. You can access this
 * page by clicking on the button "LOG" of the "Application" page.
 * All the command send by the user to the server appear here, also all the package recive
 * from the server.
 * (Soon this class will support error)
 * ##### This class is connected to the LogService #######
 * ********************************************************************************************
 **********************************************************************************************/
export class LogComponent implements OnInit {
  log = null;

  constructor(private logService: LogService) { }

  ngOnInit(): void {
    this.log = this.logService.logs;
  }

}
