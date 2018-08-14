import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'ngx-chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  protected isChatWindowExpanded = false;
  protected sendMessage(): void {
    (this.isChatWindowExpanded) ? null : (this.isChatWindowExpanded = true);
  }
}
