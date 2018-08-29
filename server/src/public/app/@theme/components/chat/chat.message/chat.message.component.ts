import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, OnDestroy }
 from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import { BehaviorSubject } from 'rxjs';
import { ChatService } from '../../../../providers/socket/chat.service';
const MAX_FAILED_ACTIONS = 3;
interface IChatData {
  type: string;
  text?: string;
  actions?: [any];
}
interface IChatMessageItem {
  type: string,
  timestamp: number;
  username?: string;
  data: IChatData;
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
  protected chatMessagesFilter = 'timestamp';
  protected chatMessages = [];
  protected chatMessageText = '';
  protected failedActionsCount = 1;
  constructor(private chatService: ChatService) {}

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

    this.chatService.getChatNotification().subscribe((message) => {
      if (message.type === 'status' || message.type === 'control') return;
      console.log('PUSHING CHAT MESSAGE:',this.chatMessages);
      this.chatMessages.push(message);
      (message.data.value === 'to_be_trained') ? this.failedActionsCount += 1 :
        this.failedActionsCount = 1;
      (this.failedActionsCount > MAX_FAILED_ACTIONS) ? this.sendFailedActionMessage()
        : null;
    });

  }

  protected sendFailedActionMessage() {
    const newMessage = {
      type: 'control',
      timestamp: Date.now(),
      data: {
        command: 'failedAction'
      }
    };
    this.chatService.sendMessage(newMessage);
  }

  protected sendMessage(chatMessage): void {
    const chatMessageItem = this.loadMessage(chatMessage);
    this.chatService.sendMessage(chatMessageItem);
  }

  public loadMessage(chatMessage): IChatMessageItem {
    if (!chatMessage) return;
    const chatMessageItem: IChatMessageItem = {
      type: 'message',
      timestamp: Date.now(),
      data: {
        type: 'basic',
        text: chatMessage,
      }
    };
    this.chatMessages.push(chatMessageItem);
    this.chatMessageText = '';
    return chatMessageItem;
  }

  protected sendActionMessage(action) {
    const chatMesageItem: IChatMessageItem = {
      type: 'message',
      timestamp: Date.now(),
      data: {
        type: 'basic-preset',
        text: action.name,
      }
    };
    this.chatMessages.push(chatMesageItem);
    this.chatService.sendMessage(chatMesageItem);

  }

  public ngOnDestroy() {
    this.isOpen.unsubscribe();
    this.chatService.getChatNotification().unsubscribe();
  }

}
