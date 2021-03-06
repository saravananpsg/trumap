import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CookieService } from 'ngx-cookie-service';

import { environment } from '../environments/environment';

const socketConfig: SocketIoConfig = { url: environment.socket.serverUrl, options: {} };

export const config = {
  apiKey: 'AIzaSyCdMSf2ycGKFSd3QmRCvaU7JBU6_8dmYio',
  authDomain: 'firestore-test-d4910.firebaseapp.com',
  databaseURL: 'https://firestore-test-d4910.firebaseio.com',
  projectId: 'firestore-test-d4910',
  storageBucket: 'firestore-test-d4910.appspot.com',
  messagingSenderId: '728715043568'
};

import { APP_BASE_HREF } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './@core/core.module';

import { ThemeModule } from './@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { Api } from './providers/api/api';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NbAuthJWTToken, NbAuthJWTInterceptor } from '@nebular/auth';
import { AuthGuard } from './providers/auth/auth.guard.service';
import { AuthLocalStorage } from './providers/auth/auth.local.storage.service';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Listings } from './providers/listings/listings';
import { ChatService } from './providers/socket/chat.service';
import { TruListings } from './providers/listings/tru.listings';
import { AuthSession } from './providers/auth/auth.session.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
   suppressScrollX: false
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    LoggerModule.forRoot({serverLoggingUrl: '/api/logs', level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.OFF}),
    PerfectScrollbarModule,
    LazyLoadImageModule,
    SocketIoModule.forRoot(socketConfig),
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: HTTP_INTERCEPTORS, useClass: NbAuthJWTInterceptor, multi: true},
    Api,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    AuthGuard,
    AuthLocalStorage,
    Listings,
    ChatService,
    CookieService,
    TruListings,
    AuthSession
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
