import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { filter, share } from 'rxjs/operators';

const TRUEXPERT_TYPE = 'truexpert';
const intialState: any = {
  total_count: 0,
  data: [],
  next_cursor: null,
  size: 0,
  isInitialLoading: true,
  isLoading: true
};
@Injectable()
export class TruListings  {

  private _truData:  BehaviorSubject<any> = new BehaviorSubject(intialState);
  public truData: Observable<any> = this._truData.asObservable();
  protected truError$: BehaviorSubject<any> = new BehaviorSubject(null);

  truUrl = 'listings/truexpert';
  private data: any;

  constructor(public api: Api, private logger: NGXLogger) {

  }


  query(params?: any) {
    return this.api.get(this.truUrl, params);
  }

  processListingsData(data, concat: boolean) {
    const newData = JSON.parse(data);
    if( !Array.isArray(newData.data)) return this.publishTruErrorNotification(data);

    const currentData = this._truData.getValue();
    if (!Array.isArray(currentData.data)) return;

    let currentOffset = (concat) ? currentData.data.length : 0;
    for(let index = 0; index < newData.data.length; index++) {
      newData.data[index].index = ++currentOffset;
    }

    (concat) ? newData.data = currentData.data.concat(newData.data) : null;
    newData.isLoading = false;
    console.log('TruListings:', newData);
    this._truData.next(newData);
  }

  loadListings(params?: any, concat: boolean=false) {
    this._truData.next({ ...this._truData.getValue(), ...{isLoading: true}});
    this.api.get(this.truUrl, params).subscribe((data: any) => {
      this.processListingsData(data, concat);
    }, (err) => {
      this.publishTruErrorNotification(err)
    });
  }

  loadNext(filter, lastItemNumber) {
    const currentValue = this._truData.getValue();
    const nextCursor = currentValue.next_cursor;

    if (lastItemNumber !== (currentValue.data.length - 1)) return;
    if (!nextCursor) return;
    const newFilter = {...filter };
    newFilter.next_cursor = nextCursor;
    this.loadListings(newFilter, true);
  }


  dataChanged(): Observable<any> {
     return this.truData
       .pipe(
         filter(value => !!value),
         share(),
       );
  }


  public getTruErrorNotification() {
    return this.truError$.asObservable();
  }


  protected publishTruErrorNotification(err) {
    this.truError$.next(err);
  }

}
