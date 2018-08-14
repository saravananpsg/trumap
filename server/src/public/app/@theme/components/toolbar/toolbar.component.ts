import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-toolbar',
  styleUrls: ['./toolbar.component.scss'],
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent {

  @Output() onZoomSelected: EventEmitter<any> = new EventEmitter<any>();
  protected zoomActions: any = [{
    name: 'Plus',
    icon: 'plus',
  },{
    name: 'property',
    icon: 'circle',
    tooltip: 'Poperty'
  },{
    name: 'street',
    icon: 'circle',
    tooltip: 'Street'
  },
  {
    name: 'neighbourhood',
    icon: 'circle',
    tooltip: 'Neighbourhood'
  },{
    name: 'street1',
    icon: 'circle',
    tooltip: 'Street1'
  },
  {
    name: 'street2',
    icon: 'circle',
    tooltip: 'Street2'

  },{
    name: 'street3',
    icon: 'circle',
    tooltip: 'Street3'
  },
  {
    name: 'minus',
    icon: 'minus',
  }];
  public presets:any = [
    {
      name: 'International student'
    }, {
      name: 'Couples'
    },
    {
      name: 'Parents'
    },
    {
      name: 'Foreigners'
    },
    {
      name: 'Permanent Residents'
    }
  ]

}
