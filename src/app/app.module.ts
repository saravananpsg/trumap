import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

import { BasicGeoqueryComponent } from './basic-geoquery/basic-geoquery.component';
import { RealtimeGeoqueryComponent } from './realtime-geoquery/realtime-geoquery.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
export const config = {
  apiKey: 'AIzaSyCdMSf2ycGKFSd3QmRCvaU7JBU6_8dmYio',
  authDomain: 'firestore-test-d4910.firebaseapp.com',
  databaseURL: 'https://firestore-test-d4910.firebaseio.com',
  projectId: 'firestore-test-d4910',
  storageBucket: 'firestore-test-d4910.appspot.com',
  messagingSenderId: '728715043568'
};

@NgModule({
  declarations: [
    AppComponent,
    BasicGeoqueryComponent,
    RealtimeGeoqueryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBTyQHGGFTooUvfR0_PpfVx8TI8Q7K-0HA'
    }),
    AgmSnazzyInfoWindowModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
