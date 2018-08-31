import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { filter, share } from 'rxjs/operators';

const TRUEXPERT_TYPE = 'truexpert';
@Injectable()
export class Listings  {
  protected data$: BehaviorSubject<any> = new BehaviorSubject(null);
  protected error$: BehaviorSubject<any> = new BehaviorSubject(null);


  listingsUrl = 'listings/uralistings';
  vwlUrl = 'listings/voluntarywelfarelistings'
  allListingsUrl = 'listings/all';
  listingTypeUrl = 'listings/type';
  private dataMap = {};

  constructor(public api: Api, private logger: NGXLogger) {
  }


  query(params?: any) {
    return this.api.get(this.listingsUrl, params);
  }

  uraListings(params?: any) {
    return this.api.get(this.listingsUrl, params);
  }

  vwListings(params?: any) {
    return this.api.get(this.vwlUrl, params);
  }

  loadListings(listingType: string, params?: any) {
    // params = (params) ? params : { offset: 0, limit: 20 };
    if ((this.dataMap[listingType])) return;
    const url = `${this.listingTypeUrl}/${listingType}`;
    this.api.get(url, params).subscribe((data) => {
      this.dataMap[listingType] = (this.dataMap[listingType]) ?
        this.dataMap[listingType].concat(data) : data;
      this.publishDataChanged(listingType);
    }, (err) => {
      this.publishDataError(err)
    });
  }



  getData(listingType: string) {
    return this.dataMap[listingType];
  }


  dataChanged(): Observable<any> {
     return this.data$
       .pipe(
         filter(value => !!value),
         share(),
       );
  }

  public getDataNotification() {
    return this.data$;
  }

  public getErrorNotification() {
    return this.error$;
  }


  protected publishDataChanged(listingType: string) {
    this.data$.next(listingType);
  }

  protected publishDataError(err: any) {
    this.error$.next(err);
  }
}
