import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild }
  from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'ngx-listing-tile',
  templateUrl: './listing-tile.component.html',
  styleUrls: ['./listing-tile.component.scss']
})
export class ListingTileComponent {
  @Input() listing: any;
  @Input() selectedListing: any;
  @Output() onToggleSelectListing: EventEmitter<any> = new EventEmitter<any>();
  toggleSelectListing(listing) {
    this.onToggleSelectListing.emit(listing);
  }
}
