import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Legends } from './legend.constants';
@Component({
  selector: 'ngx-toolbar-legend',
  styleUrls: ['./legend.component.scss'],
  templateUrl: './legend.component.html'
})
export class LegendComponent {
  @Output() onLegendSelected: EventEmitter<any> = new EventEmitter<any>();
  protected showDropDown = false;
  readonly legends = Legends;
  protected legendFilter = {
    voluntary_welfare: true
  };

  protected toggleLegendFilter($event: any, legend: any) {
    // $event.stopImmediatePropagation();
    $event.preventDefault();
    $event.stopImmediatePropagation();
    this.legendFilter[legend.value]= !this.legendFilter[legend.value]
    /*const legendsSelected = Object.keys(this.legendFilter).reduce((accumulator, key) => {
      (this.legendFilter[key]) ? accumulator.push(key) : null;
      return accumulator;
    },[]);*/
    this.onLegendSelected.emit(this.legendFilter);
  }
}
