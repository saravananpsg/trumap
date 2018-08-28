import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'ngx-toolbar-legend',
  styleUrls: ['./legend.component.scss'],
  templateUrl: './legend.component.html'
})
export class LegendComponent {
  @Output() onLegendSelected: EventEmitter<any> = new EventEmitter<any>();
  protected showDropDown = false;
  protected legends = [
    { name: 'AED Locations', value: 'aed_locations'},
    { name: 'AXS Stations', value: 'axs_locations'},
    { name: 'Child Care', value: 'child_care'},
    { name: 'Community Clubs', value: 'community_clubs'},
    { name: 'Constituency Offices', value: 'constituency_offices'},
    { name: 'Disability Care', value: 'disability_care'},
    { name: 'Elder Care', value: 'elder_care'},
    { name: 'Hawker Centers', value: 'hawker_centers'},
    { name: 'Historic Sites', value: 'historic_sites'},
    { name: 'Hospitals', value: 'hospitals'},
    { name: 'Hotels', value: 'hotels'},
    { name: 'Kindergardens', value: 'kinder_gardens'},
    { name: 'Libraries', value: 'libraries'},
    { name: 'Money Exchangers', value: 'money_xchanger'},
    { name: 'Museums', value: 'museum'},
    { name: 'Nursing Homes', value: 'nursing_home'},
    { name: 'Pharmacies', value: 'pharmacy'},
    { name: 'Pre-Schools', value: 'preschools'},
    { name: 'Private Institutions', value: 'private_inst'},
    { name: 'Remittance', value: 'remittance'},
    { name: 'Schools', value: 'schools'},
    { name: 'Student Care', value: 'student_care'},
    { name: 'Supermarket', value: 'supermarket'},
    { name: 'Voluntary Welfare', value: 'voluntary_welfare'},
  ];
  protected legendFilter = {
    voluntary_welfare: true
  };

  protected toggleLegendFilter(legend: any) {
    this.legendFilter[legend.value]= !this.legendFilter[legend.value]
    const legendsSelected = Object.keys(this.legendFilter).reduce((accumulator, key) => {
      (this.legendFilter[key]) ? accumulator.push(key) : null;
      return accumulator;
    },[]);
    this.onLegendSelected.emit(legendsSelected);
  }
}
