import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { BasicGeoqueryComponent } from './basic-geoquery/basic-geoquery.component';
import { RealtimeGeoqueryComponent } from './realtime-geoquery/realtime-geoquery.component';

import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

const PAGES_COMPONENTS = [
  PagesComponent,
  BasicGeoqueryComponent,
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
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
