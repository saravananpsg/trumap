import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { BasicGeoqueryComponent } from './basic-geoquery/basic-geoquery.component';
import { RealtimeGeoqueryComponent } from './realtime-geoquery/realtime-geoquery.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'map',
    component: BasicGeoqueryComponent,
  }, {
    path: 'rt',
    component: RealtimeGeoqueryComponent
  }, {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
