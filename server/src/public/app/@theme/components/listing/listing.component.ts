import { Component, OnInit, Output, Input, AfterViewInit, HostListener, EventEmitter, OnDestroy } from '@angular/core';
import { ChangeEvent } from 'angular2-virtual-scroll';
import { NGXLogger } from 'ngx-logger';
import { TruListings } from '../../../providers/listings/tru.listings';
import { trigger, state, style, animate, transition } from '@angular/animations';
import * as alertify from 'alertify.js';
import { Observable } from 'rxjs';
const LIMIT = 20;
@Component({
  selector: 'ngx-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
})
export class ListingComponent implements AfterViewInit, OnDestroy {
  protected listings: any = [];
  protected listingObj: Observable<any>;
  protected loading = false;
  protected error = '';
  protected selectedListing: any;
  protected selectToUnselect = false;
  protected defaultListingType = 'voluntary_welfare';
  protected filter = {
    bedroom_num: 20,
    budget: 10000,
    lat: 1.342863,
    lng: 103.844685,
    property_types: 'condominium,hdb',
    radius: 5000,
    size: 20
  };

  @Output() onAddListings: EventEmitter<any> = new EventEmitter<any>();
  constructor(private logger: NGXLogger,
      private truListings: TruListings) {
    this.truListings.getTruErrorNotification().subscribe((err) => {
      if(!err) return;
      this.logger.error('TruListingsComponentError:', err);
      this.error = `Error in loading data`;
      alertify.error(this.error);
    });
  }

  ngAfterViewInit() {
    this.load(this.filter);
    console.log('Listing: In Init');
  }

  ngOnDestroy() {
  }

  protected fetchMore(event: ChangeEvent) {
    if( event.end < 0) return;
    //if (event.end !== this.truListings.truData.data.length - 1) return;
    // console.log('FetchMore:', event);
    // this.loading = true;
    // this.fetchNextChunk(this.listings.length, LIMIT);
    this.fetchNextChunk(event.end);
  }

  //protected fetchNextChunk(skip: number, limit: number): void {
  protected fetchNextChunk(lastItemIndex): void {
    //this.load({ offset: skip, limit: limit });
    this.truListings.loadNext(this.filter, lastItemIndex);
  }


  protected load(filter?: any): void {
    //  this.listingsService.loadListings(this.defaultListingType, filter);

    this.truListings.loadListings(filter);
    /*this.listingsService.vwListings(filter).subscribe(data => {
          const listingsData: any = data;
          let newIndex = filter.offset + 1;

          listingsData.forEach((listingData) => {
            listingData.index = newIndex;
            newIndex++;
          });
          this.listings = this.listings.concat(listingsData);
          const listingSource = { type: 'voluntary_welfare', listings: this.listings};
          this.onAddListings.emit(listingSource);
          this.logger.debug('Listings Data:', this.listings);
          //this.listings = this.listings.concat(this.listings.slice(0, 19));
          this.loading = false;
        }, (err) => {
          this.error = `Error in loading data`;
          this.logger.debug('Listings:Error', err);
    });
    */
  }

  protected toggleSelectListing(listing): void {
    this.selectedListing = (this.selectedListing &&
        (listing.index === this.selectedListing.index))
      ? null : listing;
    (this.selectedListing) ? this.selectToUnselect = false : null;
    this.logger.debug('SELECT LISTING:', listing);
  }

  @HostListener('click',['$event'])
  onClick($event) {

    if(this.selectedListing) {
      this.selectedListing = null;
      this.selectToUnselect = true;
      setTimeout(() => {
        this.selectToUnselect = false;
      }, 700)
    }
  }
}
