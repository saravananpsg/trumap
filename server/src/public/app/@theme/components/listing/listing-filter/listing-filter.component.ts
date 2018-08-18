import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild }
  from '@angular/core';
import { ChangeEvent } from 'angular2-virtual-scroll';
import { NGXLogger } from 'ngx-logger';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-listing-filter',
  templateUrl: './listing-filter.component.html',
  styleUrls: ['./listing-filter.component.scss']
})
export class ListingFilterComponent {
  @Input() count = 0;
  @Output() onSelectFilter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('dp') datePicker: NgbInputDatepicker;
  protected filterMap: { [key: string]: string } = {};
  protected listingTypes = [
    { name:'Condo', value: 'condo' },
    { name: 'Apartment', value: 'apartment' }];

  protected txTypes = [
    { name: 'Rent', value: 'rent'},
    { name: 'Buy', value: 'buy' }
  ];

  protected sizeTypes = [
    { name: 'Entire home/apt', value: 'full' }
  ];

  protected stayLengthTypes = [
    { name: '12 months', value: '12 months'}
  ];

  protected onFilter() {
    this.onSelectFilter.emit(this.filterMap)
  }

  @HostListener('mouseleave')
  onMouseLeave($event){
    this.datePicker.close();
  }
}
