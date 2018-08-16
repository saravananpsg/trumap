import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { HomeComponent } from './home/home.component';
import { RealtimeGeoqueryComponent } from './realtime-geoquery/realtime-geoquery.component';
import { UiScrollModule } from 'ngx-ui-scroll';

import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

const PAGES_COMPONENTS = [
  PagesComponent,
  HomeComponent,
  RealtimeGeoqueryComponent
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBTyQHGGFTooUvfR0_PpfVx8TI8Q7K-0HA'
    }),
    AgmSnazzyInfoWindowModule,
    UiScrollModule,
    NgxMapboxGLModule.withConfig({
     accessToken: 'pk.eyJ1IjoiZ2FsdmludyIsImEiOiJjaXB2aGNhNHIwdmdwZmxtMnkxbmxjZm9mIn0.kftFOX2a7YKK4tS0Qbc9yw',
   })
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
