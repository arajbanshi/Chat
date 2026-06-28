import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatApp } from './chat-app/chat-app';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatApp],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('chat-ui');
}
