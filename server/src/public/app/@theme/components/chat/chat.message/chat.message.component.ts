import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, OnDestroy }
 from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import { BehaviorSubject } from 'rxjs';
interface IChatData {
  type: string;
  message: string;
  timestamp: number;
}
interface IChatMessageItem {
  [data: string]: IChatData;
}
@Component({
  selector: 'ngx-chat-message-component',
  templateUrl: './chat.message.component.html',
  styleUrls: ['./chat.message.component.scss'],
})
export class ChatMessageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chatMessageInput') chatMessageInput: ElementRef;
  @ViewChild('chatContainer') chatContainer: ElementRef;
  @Input() isOpen: BehaviorSubject<boolean>;
  protected chatMessagesFilter = 'date.timestamp';
  protected chatMessages = [];
  protected chatMessageText = '';

  ngAfterViewInit() {
    this.isOpen.subscribe((value) => {
      if(value) {
        setTimeout(() => {
          this.chatMessageInput.nativeElement.focus();
          this.chatContainer.nativeElement.scrollTop =
            this.chatContainer.nativeElement.scrollHeight;
        },100);
      }
    });

  }
  protected sendMessage(chatMessage): void {
    this.loadMessage(chatMessage);
  }

  public loadMessage(chatMessage): void {
    if (!chatMessage) return;
    const chatMesageItem: IChatMessageItem = {
      data: {
        type: 'text',
        message: chatMessage,
        timestamp: new Date().getTime()
      }
    };
    this.chatMessages.push(chatMesageItem);
    this.chatMessageText = '';
  }

  public ngOnDestroy() {
    this.isOpen.unsubscribe();
  }

}
