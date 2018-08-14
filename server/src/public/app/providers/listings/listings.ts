import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { filter, share } from 'rxjs/operators';
@Injectable()
export class Listings  {
  protected data$: BehaviorSubject<any> = new BehaviorSubject(null);
  listingsUrl = 'listings/uralistings';

  constructor(public api: Api, private logger: NGXLogger) {

  }


  query(params?: any) {
    return this.api.get(this.listingsUrl, params);
  }

  uraListings(params?: any) {
    return this.api.get(this.listingsUrl, params);
  }

  dataChanged(): Observable<any> {
     return this.data$
       .pipe(
         filter(value => !!value),
         share(),
       );
  }

  protected publishDataChanged() {
    this.data$.next(true);
  }

}
