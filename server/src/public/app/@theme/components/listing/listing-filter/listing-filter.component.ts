import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild }
  from '@angular/core';
import { ChangeEvent } from 'angular2-virtual-scroll';
import { NGXLogger } from 'ngx-logger';
import { NgbInputDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
@Component({
  selector: 'ngx-listing-filter',
  templateUrl: './listing-filter.component.html',
  styleUrls: ['./listing-filter.component.scss']
})
export class ListingFilterComponent {
  @Input() count = 0;
  @Output() onSelectFilter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('dp') datePicker: NgbInputDatepicker;
  protected filterMap: { [key: string]: any } = {};
  protected moveInDate: NgbDateStruct;
  protected listingTypes = [
    { name: 'Any', value: 'any' },
    { name: 'HDB', value: 'hdb' },
    { name: 'Condo', value: 'condo' },
    { name: 'Landed', value: 'landed' }
  ];

  protected txTypes = [
    { name: 'Rent', value: 'rent'},
    { name: 'Buy', value: 'buy' }
  ];

  protected sizeTypes = [
    { name: 'Room', value: 'room' },
    { name: 'Whole unit', value: 'wholeunit' },
  ];

  protected stayLengthTypes = [
    { name: '12 months', value: '12 months'},
    { name: '24 months', value: '24 months'},
    { name: '36 months', value: '36 months'}
  ];

  protected budgetTypes = [
    { name: '$500-$2000', value: '500-2000' },
    { name: '$2000-$5000', value: '2000-5000'},
  ];

  protected onFilter() {
    this.onSelectFilter.emit(this.filterMap)
  }

  constructor() {
    this.initFilter();
  }

  initFilter() {
    let currentDate = moment();
    this.moveInDate = { year: currentDate.year(), month: currentDate.month() + 1,
      day: currentDate.date()}
    this.filterMap['listingType'] = this.listingTypes[0];
    this.filterMap['sizeType'] = this.sizeTypes[0];
    this.filterMap['stayLengthType'] = this.stayLengthTypes[0];
    this.filterMap['txType'] = this.txTypes[0];
    this.filterMap['budgetType'] = this.budgetTypes[0];
  }

  @HostListener('mouseleave')
  onMouseLeave($event){
    this.datePicker.close();
  }
}
