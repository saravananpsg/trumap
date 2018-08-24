import { Component, OnInit, ViewChild } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ChatMessageComponent } from './chat.message/chat.message.component';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'ngx-chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  @ViewChild(ChatMessageComponent) chatMessage: ChatMessageComponent;
  protected isChatOpen: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public openChatBox() {
    this.isChatOpen.next(true);
  }

  public closeChatBox() {
    this.isChatOpen.next(false);
  }

}
