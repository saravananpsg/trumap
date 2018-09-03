import { Component, OnInit, HostListener, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';
import { MapMouseEvent, Map } from 'mapbox-gl';
import { Listings } from '../../providers/listings/listings';
import { TruListings } from '../../providers/listings/tru.listings';
import { NGXLogger } from 'ngx-logger';
import { Legends } from '../../@theme/components';
import * as alertify from 'alertify.js';
const TRU_LISTING = 'trulisting';
const iconMap: any = Legends.reduce((accumulator, legend) => {
  accumulator[legend.value] = legend;
  return accumulator;
}, {});
/*const iconMap = {
  'aed_locations': 'rocket',
  'axs_stations': 'rail-metro',
  'child_care': 'ice-cream',
  'community_clubs': 'golf',
  'constituency_offices': 'information',
  'disability_care': 'doctor',
  'elder_care': 'lodging',
  'hawker_centres': 'fast-food',
  'historic_sites': 'monument',
  'hospitals': 'hospital',
  'hotels': 'restaurant',
  'kinder_gardens': 'playground',
  'libraries': 'library',
  'money_xchanger': 'stadium',
  'museum': 'museum',
  'nursing_home': 'garden',
  'pharmacy': 'pharmacy',
  'preschools': 'zoo',
  'private_inst': 'college',
  'remittance': 'town-hall',
  'schools': 'school',
  'student_care': 'triangle',
  'super_market': 'grocery',
  'train_station_names': 'rail-metro',
  'voluntary_welfare': 'star'
}*/
@Component({
  selector: 'page-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapbox') mapbox: any;
  map: Map;
  geo = geofirex.init(firebaseApp);
  points: Observable<any>;
  radius = new BehaviorSubject(0.5);
  selectedPoint: GeoJSON.Feature<GeoJSON.Point> | null;
  mapProperty = {
    lat: 1.352105,
    lng: 103.837126,
    zoom: 15,
    radius: 5000
  };
  geoSources = [];

  constructor(private listingsService: Listings, private truListings: TruListings,
    private logger: NGXLogger) {

    this.listingsService.getDataNotification().subscribe((listingType) => {
      if( !listingType ) return;
      const listingData = this.listingsService.getData(listingType)
      if (!listingType || !listingData) return;
      this.addListings(listingData, listingType);
    });

    this.listingsService.getErrorNotification().subscribe((err) => {
      if( !err ) return;
      this.logger.error('HomeComponentError:', err);
      alertify.error('Error while loading data');
    });

    this.truListings.truData.subscribe((data) => {
      if( !data || !Array.isArray(data.data)) return;
      const listingData = data.data;
      this.addListings(listingData, TRU_LISTING);

    });
  }

  ngOnDestroy() {
    this.listingsService.getDataNotification().unsubscribe();
    this.listingsService.getErrorNotification().unsubscribe();
  }

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
      //this.mapbox.mapInstance.zoomTo(this.mapbox.mapInstance.getZoom() + zoomLevel)
      this.mapbox.mapInstance.zoomTo(zoomLevel)
      : null;
  }


  update(v) {
    this.radius.next(v);
  }

  addListings(listings, listingType) {
    let geoListings: GeoJSON.FeatureCollection<GeoJSON.Point> = {
      type: 'FeatureCollection',
      features: []
    };
    listings.forEach((listing) => {
      const featureObj: any = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [listing.longitude || listing.lng,
            listing.latitude || listing.lat]
        },
        properties: {
          title: listing.name,
          description: `<br><h6>${listing.name || listing.property_name ||
            listing.description || 'Unknown'}</h6>`,
          icon: iconMap[listingType].icon || 'monument',
        }
      };
      geoListings.features.push(featureObj);
    });
    this.logger.debug('HomeComponent:GeoJSON', geoListings);
    const source = {
      id: listingType,
      listings: geoListings,
      layout: {
        'icon-image': '{icon}-15',
        'icon-allow-overlap': true,
        visibility: 'visible'
      }
    }
    let isGeoSourceAlreadyAvailable = false;
    for(let index = 0; index < this.geoSources.length; index++) {
      if(this.geoSources[index].id === listingType) {
        this.geoSources[index].listings = source.listings;
        isGeoSourceAlreadyAvailable = true;
        break;
      }
    }
    (!isGeoSourceAlreadyAvailable) ?
      this.geoSources = this.geoSources.concat([source]) : null;
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

  changeMapLayers(legendFilter: any) {
    this.logger.debug('HomeComponent:ChangeMapLayers:LegendFilter:', legendFilter);
    if(!legendFilter) return;


    for (let index = 0; index < this.geoSources.length; index++) {
      const source = this.geoSources[index];
      if(source.id === TRU_LISTING) continue;
      let layout = source.layout;

      if(legendFilter[source.id] && (layout.visibility !== 'visible')) {
        layout.visibility = 'visible';
        source.layout = { ...layout};
      } else if (!legendFilter[source.id] && (layout.visibility !== 'none')){
        layout.visibility = 'none';
        source.layout = { ...layout};
      }
    }

    Object.keys(legendFilter).forEach((legend) => {
      if(legend) this.listingsService.loadListings(legend);
    });
  }

  updateMapProperty() {
    if (!this.mapbox.mapInstance) return;
    this.mapProperty.zoom = this.mapbox.mapInstance.getZoom();
    this.mapProperty.lat = this.mapbox.mapInstance.getCenter().lat;
    this.mapProperty.lng = this.mapbox.mapInstance.getCenter().lng;
  }

  onZoomChange(event) {
    this.updateMapProperty();
  }

  onDragEnd(event) {
    this.updateMapProperty();
  }

  onMapLoad(event) {
    console.log('MapLoadEvent:', event);
    this.map = event;
  }
}
