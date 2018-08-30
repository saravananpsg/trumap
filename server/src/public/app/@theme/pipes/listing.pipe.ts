import { Pipe, PipeTransform } from '@angular/core';
const BEDROOM_FACTOR = 10;
@Pipe({ name: 'ngxListingFormat' })
export class ListingPipe implements PipeTransform {

  transform(input: number): number {
    let bedroomNum = input/BEDROOM_FACTOR;
    bedroomNum = (bedroomNum > 1) ? bedroomNum: 1;
    return bedroomNum;
  }
}
