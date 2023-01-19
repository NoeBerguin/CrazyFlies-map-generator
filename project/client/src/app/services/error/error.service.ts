import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  text = '';
  constructor() { }
  sendText(newText: string): void{
    this.text = newText;
  }
}
