import { Component, OnInit, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';
import { MapMouseEvent } from 'mapbox-gl';

@Component({
  selector: 'page-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('mapbox') mapbox: any;
  geo = geofirex.init(firebaseApp);
  points: Observable<any>;
  radius = new BehaviorSubject(0.5);
  selectedPoint: GeoJSON.Feature<GeoJSON.Point> | null;
  geoListings: GeoJSON.FeatureCollection<GeoJSON.Point> = {
    type: 'FeatureCollection',
    features: []
  };
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

  ngAfterViewInit() {
    this.initMapListingsLayer();
  }

  changeZoom(zoomLevel) {
    (this.mapbox.mapInstance) ?
      this.mapbox.mapInstance.zoomTo(this.mapbox.mapInstance.getZoom() + zoomLevel)
      : null;
  }


  update(v) {
    this.radius.next(v);
  }

  addListings(listings) {
    listings.forEach((listing) => {
      const featureObj: any = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [listing.longitude, listing.latitude]
        },
        properties: {
          title: listing.name,
          description: `<br><h6>${listing.name}</h6>
            <label>${listing.building_name}</label>`,
          icon: 'star'
        }
      };
      this.geoListings.features.push(featureObj);
    });
    console.log('GEOJSON:', this.geoListings);
    this.geoListings = { ...this.geoListings };
  }

  initMapListingsLayer() {
    /* const mapInstance = this.mapbox.mapInstance;
    if (!mapInstance) return;
    var highCount = 75, lowCount = 15;
    mapInstance.addSource('listings', {
      type: 'geojson',
      data: this.geoJSONListings,
      cluster: true,
      clusterMaxZoom: 19, // Max zoom to cluster points on
      clusterRadius: 400 // Radius of each cluster when clustering points (defaults to 400)
    });

    mapInstance.addLayer({
      id: 'non-cluster-markers',
      type: 'symbol',
      source: 'listings',
      layout: {
        'icon-image': 'marker-15'
      },
      paint: {},
      interactive: true
    });

    // Cluster categories
    mapInstance.addLayer({
      'id': 'cluster-low',
      'type': 'circle',
      'source': 'listings',
      // Set a filter the 'low' category
      'filter': ['<', 'point_count', lowCount],
      'layout': {},
      'paint': {
        'circle-color': '#1a9641',
        'circle-radius': 18
      },
      'interactive': true
    });
    mapInstance.addLayer({
      'id': 'cluster-medium',
      'type': 'circle',
      'source': 'listings',
      'filter': [
        'all',
          ['>', 'point_count', lowCount],
          ['<=', 'point_count', highCount]
        ],
        'layout': {},
        'paint': {
          'circle-color': '#ffffbf',
          'circle-radius': 18
        },
        'interactive': true
    });
    mapInstance.addLayer({
      'id': 'cluster-high',
      'type': 'circle',
      'source': 'listings',
      'filter': ['>', 'point_count', highCount],
      'layout': {},
      'paint': {
        'circle-color': '#fc8d59',
        'circle-radius': 18
      },
      'interactive': true
    });

    // Finally, add a layer for the clusters' count labels
    mapInstance.addLayer({
      'id': 'cluster-count',
      'type': 'symbol',
      'source': 'listings',
      'layout': {
        'text-field': '{point_count}',
        'text-size': 12
      },
      'paint': {},
      'interactive': true
    });
    */
  }

  onClick(evt: MapMouseEvent) {
    this.selectedPoint = (<any>evt).features[0];
  }

  changeMapLayers(legends) {
    console.log('legends:', legends);
  }
}
