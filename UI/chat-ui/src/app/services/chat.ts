import { Service } from '@angular/core';
import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  user: string;
  text: string;
}

@Service()
@Injectable({
  providedIn: 'root'
})
export class Chat {
    private backendUrl = 'http://localhost:8000/api';

    constructor(private http: HttpClient, private zone: NgZone) {}

    // Send a standard POST request back to the server
    sendMessage(message: ChatMessage): Observable<any> {
        return this.http.post(`${this.backendUrl}/messages`, message);
    }

    // Open a persistent SSE stream connection
    getChatStream(): Observable<ChatMessage> {
        return new Observable<ChatMessage>((observer) => {
        const eventSource = new EventSource(`${this.backendUrl}/stream`);

        eventSource.addEventListener('message', (event: MessageEvent) => {
            // Run inside NgZone to trigger Angular change detection
            this.zone.run(() => {
            const message: ChatMessage = JSON.parse(event.data);
            observer.next(message);
            });
        });

        eventSource.onerror = (error) => {
            this.zone.run(() => observer.error(error));
        };

        // Automatically triggers when unsubscribed
        return () => {
            eventSource.close();
        };
        });
    }

}
