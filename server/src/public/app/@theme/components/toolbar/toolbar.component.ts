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
    tooltip: 'Poperty',
    isDisabled: false
  },{
    name: 'street',
    icon: 'circle',
    tooltip: 'Street',
    isDisabled: false
  },
  {
    name: 'neighbourhood',
    icon: 'circle',
    tooltip: 'Neighbourhood',
    isDisabled: false
  },{
    name: 'district',
    icon: 'circle',
    tooltip: 'District',
    isDisabled: false
  },
  {
    name: 'region',
    icon: 'circle',
    tooltip: 'Region',
    isDisabled: false

  },{
    name: 'country',
    icon: 'circle',
    tooltip: 'Country',
    isDisabled: true
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
  ];

  protected selectedZoomAction = 'street';

}
