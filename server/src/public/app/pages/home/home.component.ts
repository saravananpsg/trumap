import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';

@Component({
  selector: 'page-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('mapbox') mapbox: any;
  geo = geofirex.init(firebaseApp);
  points: Observable<any>;
  radius = new BehaviorSubject(0.5);
  listings:any = [];
  constructor() {}

  ngOnInit() {
    const center = this.geo.point(40.5, -80.0);
    const radius = 0.5;
    const field = 'pos';

    const collection = this.geo.collection('users', ref =>
      ref.where('status', '==', 'single').where('online', '==', true)
    );
    // this.initListings();
  }

  changeZoom(zoomLevel) {
    (this.mapbox.mapInstance) ?
      this.mapbox.mapInstance.zoomTo(this.mapbox.mapInstance.getZoom() + zoomLevel)
      : null;
  }

  update(v) {
    this.radius.next(v);
  }

}
