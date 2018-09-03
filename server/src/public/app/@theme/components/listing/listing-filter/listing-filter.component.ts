import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild }
  from '@angular/core';
import { ChangeEvent } from 'angular2-virtual-scroll';
import { NGXLogger } from 'ngx-logger';
import { NgbInputDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
const TYPES = {
  LISTING: 'property_types',
  CONDOMINIUM: 'condominium',
  HDB: 'hdb',
  LANDED: 'landed',
  BUDGET: 'budget',
  SIZE: 'bedroom_num',
  STAY_LENGTH: 'stayLength',
  TX: 'tx',
  LOCATION: 'location'
};

@Component({
  selector: 'ngx-listing-filter',
  templateUrl: './listing-filter.component.html',
  styleUrls: ['./listing-filter.component.scss']
})
export class ListingFilterComponent {
  @Input() count = 0;
  @Input() isLoading: any;
  @Output() onSelectFilter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('dp') datePicker: NgbInputDatepicker;
  readonly types = TYPES;
  protected filterMap: { [key: string]: any } = {};
  protected moveInDate: NgbDateStruct;
  protected listingTypes = [
    { name: 'Any', value: 'any' },
    { name: 'HDB', value: 'hdb' },
    { name: 'Condo', value: 'condominium' },
    { name: 'Landed', value: 'landed' }
  ];

  protected txTypes = [
    { name: 'Rent', value: 'rent'},
    { name: 'Buy', value: 'buy' }
  ];

  protected sizeTypes = [
    { name: 'Room Rental', value: '5' },
    { name: 'Studio', value: '7' },
    { name: '1 Bedroom', value: '10' },
    { name: '2 Bedrooms', value: '20' },
    { name: '3 Bedrooms', value: '30' },
    { name: '4 Bedrooms', value: '40' },
    { name: '5 Bedrooms', value: '50' },
    { name: '6 Bedrooms', value: '60' },
    { name: '7 Bedrooms', value: '70' },
    { name: '8 Bedrooms+', value: '81' },
  ];

  protected stayLengthTypes = [
    { name: '12 months', value: '12 months'},
    { name: '24 months', value: '24 months'},
    { name: '36 months', value: '36 months'}
  ];

  protected budgetTypes = [
    { name: '$500-$2000', value: { min: 500, max: 2000 } },
    { name: '$2000-$10000', value: {min: 2000, max: 10000 } },
  ];

  protected onListingTypeFilterSelect(listingType) {
    this.filterMap[TYPES.LISTING] = listingType;
    this.onFilter(this.filterMap);
  }

  protected onBudgetFilterSelect(budgetType) {
    this.filterMap[TYPES.BUDGET] = budgetType;
    this.onFilter(this.filterMap);
  }

  protected onSizeFilterSelect(sizeType) {
    this.filterMap[TYPES.SIZE] = sizeType;
    this.onFilter(this.filterMap);

  }

  protected onStayLengthFilterSelect(stayLengthType) {
    this.filterMap[TYPES.STAY_LENGTH] = stayLengthType;
  }

  protected constructListingParams(filterMap) {
    const listingType = filterMap[TYPES.LISTING];
    switch (listingType.value) {
      case 'any':
        filterMap[TYPES.LISTING] = `${TYPES.CONDOMINIUM},${TYPES.HDB},${TYPES.LANDED}`;
        break;
      default:
        filterMap[TYPES.LISTING]= filterMap[TYPES.LISTING].value;
        break;
    }
    return filterMap;
  }

  protected constructBudgetParams(filterMap) {
    const budgetType = filterMap[TYPES.BUDGET];
    filterMap[TYPES.BUDGET] = budgetType.value.max;
    return filterMap;
  }

  protected constructLocationParams(filterMap) {
    // TBD implements when search api is ready
    delete filterMap[TYPES.LOCATION];
    return filterMap;
  };

  protected constructSizeParams(filterMap) {
    const sizeType = filterMap[TYPES.SIZE];
    filterMap[TYPES.SIZE] = sizeType.value;
    return filterMap;
  };

  protected constructStayLengthParams(filterMap) {
    // TBD implements when search api is ready
    delete filterMap[TYPES.STAY_LENGTH];
    return filterMap;
  };


  protected constructParamsForSearch(filterMap) {
    let newFilterMap = { ...filterMap };
    newFilterMap = this.constructListingParams(newFilterMap);
    newFilterMap = this.constructBudgetParams(newFilterMap);
    newFilterMap = this.constructLocationParams(newFilterMap);
    newFilterMap = this.constructSizeParams(newFilterMap);
    newFilterMap = this.constructStayLengthParams(newFilterMap);

    return newFilterMap;
  }

  protected onFilter(filterMap) {
    const newParams = this.constructParamsForSearch(filterMap);
    this.onSelectFilter.emit(newParams);
  }

  constructor() {
    this.initFilter();
  }

  initFilter() {
    let currentDate = moment();
    this.moveInDate = { year: currentDate.year(), month: currentDate.month() + 1,
      day: currentDate.date()}
    this.filterMap[TYPES.LISTING] = this.listingTypes[0];
    this.filterMap[TYPES.SIZE] = this.sizeTypes[0];
    this.filterMap[TYPES.STAY_LENGTH] = this.stayLengthTypes[0];
    // this.filterMap[TYPES.TX] = this.txTypes[0];
    this.filterMap[TYPES.BUDGET] = this.budgetTypes[0];
  }

  @HostListener('mouseleave')
  onMouseLeave($event){
    this.datePicker.close();
  }
}
