import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild }
  from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'ngx-listing-tile',
  templateUrl: './listing-tile.component.html',
  styleUrls: ['./listing-tile.component.scss'],
  animations: [
    trigger('selectUnselect', [
      state('selected', style({
        height: '*'
      })),
      transition('* => *', animate('600ms ease-out'))
    ])
  ]
})
export class ListingTileComponent {
  @Input() listing: any;
  @Input() selectedListing: any;
  @Output() onToggleSelectListing: EventEmitter<any> = new EventEmitter<any>();
  protected animationComplete = false;
  protected fullListingUrl = 'https://www.truuue.com/listings/';
  toggleSelectListing($event, listing) {
    this.animationComplete = false;
    $event.stopImmediatePropagation();
    this.onToggleSelectListing.emit(listing);
  }

  animationDone($event) {
    this.animationComplete = true
    /*setTimeout(() => {
      this.animationComplete = true
    }, 600);*/
  }
}
