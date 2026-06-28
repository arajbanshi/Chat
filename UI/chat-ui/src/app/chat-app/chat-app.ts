import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Chat, ChatMessage } from '../services/chat';

@Component({
  selector: 'app-chat-app',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-app.html',
  styleUrls: ['./chat-app.css'],
})
export class ChatApp implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  username: string = 'User_' + Math.floor(Math.random() * 100);
  currentMessage: string = '';
  private streamSub!: Subscription;

  constructor(private chatService: Chat) {}

  ngOnInit(): void {
    this.streamSub = this.chatService.getChatStream().subscribe({
      next: (msg) => this.messages.push(msg),
      error: (err) => console.error('SSE Stream Error:', err)
    });
  }

  send(): void {
    if (!this.currentMessage.trim()) return;

    const payload: ChatMessage = {
      user: this.username,
      text: this.currentMessage
    };

    this.chatService.sendMessage(payload).subscribe(() => {
      this.currentMessage = ''; // Clear text input
    });
  }

  ngOnDestroy(): void {
    if (this.streamSub) this.streamSub.unsubscribe(); // Safely closes connection
  }

}
