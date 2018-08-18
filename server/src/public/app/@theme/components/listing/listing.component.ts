import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ChangeEvent } from 'angular2-virtual-scroll';
import { NGXLogger } from 'ngx-logger';
import { Listings } from '../../../providers/listings/listings';
const LIMIT = 20;
@Component({
  selector: 'ngx-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements AfterViewInit {
  protected listings: any = [];
  protected loading = false;
  protected error = '';
  protected selectedListing: any;
  @Input() mouseEnterHomePage: boolean;
  constructor(private logger: NGXLogger, private listingsService: Listings){}

  private initListings() {
    for (let index = 0; index < 20; index++) {
      this.listings.push({
        name: `Listing ${index}`,
        url: `https://picsum.photos/300/300/?random=${index}`,
        status: 'visited',
        liked: ((index % 2) === 0)
      })
    }
  }

  ngAfterViewInit() {
    // this.initListings();
    this.load();
    console.log('Listing: In Init');
  }

  protected fetchMore(event: ChangeEvent) {
    if( event.end < 0) return;
    if (event.end !== this.listings.length-1) return;
    console.log('FetchMore:', event);
    this.loading = true;
    this.fetchNextChunk(this.listings.length, LIMIT);
  }

  protected fetchNextChunk(skip: number, limit: number): void {
    this.load({ offset: skip, limit: limit });
  }

  protected load(filter = { offset: 0, limit: LIMIT }): void {
    //return
    this.listingsService.uraListings(filter).subscribe(data => {
          const listingsData: any = data;
          let newIndex = filter.offset + 1;

          listingsData.forEach((listingData) => {
            listingData.index = newIndex;
            newIndex++;
          });
          this.listings = this.listings.concat(listingsData);
          this.logger.debug('Listings Data:', this.listings);
          //this.listings = this.listings.concat(this.listings.slice(0, 19));
          this.loading = false;
        }, (err) => {
          this.error = `Error in loading data`;
          this.logger.debug('Listings:Error', err);
    });
  }

  protected toggleSelectListing(listing): void {
    this.selectedListing = (this.selectedListing && (listing.id === this.selectedListing.id))
      ? null : listing;
    this.logger.debug('SELECT LISTING:', listing);
  }
}
