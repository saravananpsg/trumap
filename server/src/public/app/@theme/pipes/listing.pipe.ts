import { Pipe, PipeTransform } from '@angular/core';
const BEDROOM_FACTOR = 10;
@Pipe({ name: 'ngxBedNumFormat' })
export class BedroomNumberPipe implements PipeTransform {

  transform(input: number): number {
    let bedroomNum = input/BEDROOM_FACTOR;
    bedroomNum = (bedroomNum > 1) ? bedroomNum: 1;
    return bedroomNum;
  }
}

@Pipe({ name: 'ngxPricePerSqftFormat' })
export class PricePerSqftPipe implements PipeTransform {

  transform(input: any): string {
    let pricePerSft = 'NA';
    if (!input) return pricePerSft;
    if (!input.floor_area || !input.price) return pricePerSft;
    const floorArea = Number(input.floor_area);
    const price = Number(input.price);
    if (floorArea === 0 || price === 0) return pricePerSft;

    const perSqft =
      Math.round((price / floorArea) * 100)/100;
    return `$${String(perSqft).toString()}`;
  }
}
