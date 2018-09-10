import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-map-point',
  styleUrls: ['./point.scss'],
  templateUrl: './point.html'
})
export class MapPoint {
  @Input('selectedPoint') selectedPoint: any;
}
