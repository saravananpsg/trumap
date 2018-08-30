import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, OnDestroy }
 from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import { BehaviorSubject } from 'rxjs';
import { ChatService } from '../../../../providers/socket/chat.service';
const INITIAL_NUM_MESSAGES  = 3;
const MAX_FAILED_ACTIONS = 3;
const INACTIVITY_TIMEOUT = 3 * 60 * 1000; //millis
// const INACTIVITY_TIMEOUT =  20 * 1000; //millis
const INACTIVE_FIRST_TIME = 'inActiveFirstTime';
const INACTIVE_SECOND_TIME = 'inActiveSecondTime';
const TO_BE_TRAINED = 'to_be_trained';
const STATUS_TYPE = 'status';
const MESSAGE_TYPE = 'message';
const CONTROL_TYPE = 'control';

interface IChatData {
  type: string;
  text?: string;
  value?: string;
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
  protected inActivityTimeout;

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
      if (message.type === STATUS_TYPE || message.type === CONTROL_TYPE) return;
      console.log('PUSHING CHAT MESSAGE:',this.chatMessages);
      this.chatMessages.push(message);
      this.checkFailedActions(message);
      this.checkInActivity(message);

    });

  }

  protected checkFailedActions(message) {
    (message.data.value === TO_BE_TRAINED) ? this.failedActionsCount += 1 :
      this.failedActionsCount = 1;
    (this.failedActionsCount > MAX_FAILED_ACTIONS) ? this.sendFailedActionMessage()
      : null;
  }

  protected checkInActivity(message) {
    if(this.chatMessages.length > INITIAL_NUM_MESSAGES)  {
      switch (message.data.value) {
        case INACTIVE_SECOND_TIME:
          return;
        case INACTIVE_FIRST_TIME:
          this.initInactivityTimer(INACTIVE_SECOND_TIME);
          break;
        default:
          this.initInactivityTimer(INACTIVE_FIRST_TIME);
      }
    }
  }

  protected initInactivityTimer(type) {
    clearTimeout(this.inActivityTimeout);
    this.inActivityTimeout = setTimeout(() => {
      const newMessage = {
        type: CONTROL_TYPE,
        timestamp: Date.now(),
        data: {
          command: type
        }
      };
      this.chatService.sendMessage(newMessage);
    }, INACTIVITY_TIMEOUT);
  }

  protected sendFailedActionMessage() {
    const newMessage = {
      type: CONTROL_TYPE,
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
      type: MESSAGE_TYPE,
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
      type: MESSAGE_TYPE,
      timestamp: Date.now(),
      data: {
        type: 'basic-preset',
        text: action.name,
        value: action.value
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
