import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

const roomName = 'filter';
@Injectable()
export class ChatService {
  private chatNotification: Subject<any> = new Subject<any>();
  private roomId = '';
  private initConversationFirstTime = false;
  constructor(private socket: Socket, private cookieService: CookieService) {
    this.initSocketListener();
  }


  sendMessage(msg: any) {
    console.log('SENDMESSAGE:', msg);
    this.socket.emit(this.roomId, msg);
  }

  getChatNotification() {
    return this.chatNotification;
  }

  removeRoomListeners() {
    this.socket.removeAllListeners(this.roomId)
  }

  initRoomListeners() {
    this.socket.fromEvent(this.roomId).subscribe((data) => {
      console.log('RECEIVED MESSAGE:', data);
      this.chatNotification.next(data);
    });
  }

  checkForFirstConversation() {
    if(!this.initConversationFirstTime) {
      this.initConversationFirstTime = true;
      const newMessage = {
        type: 'control',
        timestamp: Date.now(),
        data: {
          command: 'startConversation'
        }
      };
      this.sendMessage(newMessage);
    }

  }

  initSocketListener() {
    const sessionId = this.cookieService.get('connect.sid');
    this.socket.fromEvent('connect').subscribe((socket: any) => {
      const ioSocket = this.socket.ioSocket;
      console.log('SOCKET ID:', ioSocket.id, ', Session Id:', sessionId);
      this.removeRoomListeners();
      this.roomId = `${roomName}-${ioSocket.id}`;
      // this.roomId = `${roomName}-${sessionId}`;
      this.initRoomListeners();
      this.checkForFirstConversation();
    });
  }
}
