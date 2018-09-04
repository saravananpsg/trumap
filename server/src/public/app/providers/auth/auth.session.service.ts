import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthSession  {

  sessionInitUrl = 'users/session';

  constructor(public api: Api, private logger: NGXLogger) {
  }

  query(params?: any) {
    return this.api.get(this.sessionInitUrl, params);
  }

}
