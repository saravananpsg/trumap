import { Injectable } from '@angular/core';


@Injectable()
export class UtilsService {
  constructor() {
  }

  round(value) {
    return (!value) ? 0 :
      Math.round(value * 100) / 100
  }
}
