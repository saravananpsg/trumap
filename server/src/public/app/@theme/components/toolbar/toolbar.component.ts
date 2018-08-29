import { Component, Input, Output, EventEmitter } from '@angular/core';
const ZOOM_DELTA = 1;
const MIN_ZOOM = 1;
const NUM_OF_ZOOM_LEVELS = 5;
@Component({
  selector: 'ngx-toolbar',
  styleUrls: ['./toolbar.component.scss'],
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent {
  @Output() onZoomSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLegendSelected: EventEmitter<any> = new EventEmitter<any>();
  protected zoomActions: any = [{
    name: 'Plus',
    icon: 'plus',
    zoomLevel: 99,
  },{
    name: 'property',
    icon: 'circle',
    tooltip: 'Poperty',
    isDisabled: false,
    // zoomLevel: ZOOM_DELTA + (MIN_ZOOM * 5)
    zoomLevel: 16
  },{
    name: 'street',
    icon: 'circle',
    tooltip: 'Street',
    isDisabled: false,
    // zoomLevel: ZOOM_DELTA + (MIN_ZOOM * 4),
    zoomLevel: 15
  },
  {
    name: 'neighbourhood',
    icon: 'circle',
    tooltip: 'Neighbourhood',
    isDisabled: false,
    // zoomLevel: ZOOM_DELTA + (MIN_ZOOM * 3)
    zoomLevel: 14
  },{
    name: 'district',
    icon: 'circle',
    tooltip: 'District',
    isDisabled: false,
    // zoomLevel: ZOOM_DELTA + (MIN_ZOOM * 2)
    zoomLevel: 13
  },
  {
    name: 'region',
    icon: 'circle',
    tooltip: 'Region',
    isDisabled: false,
    // zoomLevel: ZOOM_DELTA + MIN_ZOOM,
    zoomLevel: 12

  },{
    name: 'country',
    icon: 'circle',
    tooltip: 'Country',
    isDisabled: true,
    // zoomLevel: MIN_ZOOM
    zoomLevel: 11
  },
  {
    name: 'minus',
    icon: 'minus',
    zoomLevel: 0
  }];
  public presets:any = [
    { name: 'International student', value: 'int_student' },
    { name: 'Couples', value: 'couples' },
    { name: 'Parents', value: 'parents' },
    { name: 'Foreigners', value: 'foreigners' },
    { name: 'Permanent Residents', value: 'perm_residents' }
  ];
  protected selectedPreset = this.presets[0];
  protected selectedZoomAction = 'street';
  /* protected zoomLevels: any = {
    // currentZoomLevel:(MIN_ZOOM * NUM_OF_ZOOM_LEVELS), // 2nd highest zoomlevel
    // maxZoom: ZOOM_DELTA + (MIN_ZOOM * NUM_OF_ZOOM_LEVELS),
    // minZoom: MIN_ZOOM + ZOOM_DELTA // COUNTRY is disabled as of now
  };*/

  protected zoomLevels: any = {
    currentZoomIndex: 2,
    minZoomIndex: 1,
    maxZoomIndex: 5
  };

  decrementZoom() {
    const { currentZoomIndex, minZoomIndex, maxZoomIndex } = this.zoomLevels;
    if (currentZoomIndex < maxZoomIndex) {
      this.zoomLevels.currentZoomIndex += 1;
      const newZoomAction = this.zoomActions[this.zoomLevels.currentZoomIndex];
      this.onZoomSelected.emit(newZoomAction.zoomLevel)
    }
  }

  incrementZoom() {
    const { currentZoomIndex, minZoomIndex, maxZoomIndex } = this.zoomLevels;
    if (currentZoomIndex > minZoomIndex) {
      this.zoomLevels.currentZoomIndex -= 1;
      const newZoomAction = this.zoomActions[this.zoomLevels.currentZoomIndex];
      this.onZoomSelected.emit(newZoomAction.zoomLevel)
    }
  }

  setZoomLevel(zoomAction, index) {
    this.zoomLevels.currentZoomIndex = index;
    this.onZoomSelected.emit(zoomAction.zoomLevel);
  }

  /* decrementZoom() {
    const { currentZoomLevel, maxZoom, minZoom }  = this.zoomLevels;
    if (currentZoomLevel > minZoom) {
      this.zoomLevels.currentZoomLevel -= ZOOM_DELTA;
      this.onZoomSelected.emit(-ZOOM_DELTA);

    }
  }

  incrementZoom() {
    const { currentZoomLevel, maxZoom, minZoom }  = this.zoomLevels;
    if (currentZoomLevel < maxZoom) {
      this.zoomLevels.currentZoomLevel += ZOOM_DELTA;
      this.onZoomSelected.emit(ZOOM_DELTA);
    }
  }

  setZoomLevel(zoomAction) {
    const zoomChange = zoomAction.zoomLevel - this.zoomLevels.currentZoomLevel;
    this.zoomLevels.currentZoomLevel = zoomAction.zoomLevel;
    this.onZoomSelected.emit(zoomChange);
  }*/

  selectZoomAction(zoomAction, index?) {
    switch (zoomAction.zoomLevel) {
      case 0:
        this.decrementZoom();
        break;
      case 99:
        this.incrementZoom();
        break;
      default:
        this.setZoomLevel(zoomAction, index);
        break;
    }
  }

  legendsSelected(legends) {
    this.onLegendSelected.emit(legends);
  }
}
