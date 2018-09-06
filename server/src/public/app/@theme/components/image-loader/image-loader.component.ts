import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'image-loader',
  template: `
      <div [ngClass]="{'loading': loading}">
        <img #imgElement [src]="src" (load)="load()" (error)="error()" />
      </div>
  `
})
export class ImageLoaderComponent implements OnInit {

  @Input() src: string;
  @Input() default: string;
  public img: HTMLImageElement;
  public loading: boolean;

  @ViewChild('imgElement')imgElement:ElementRef;

  constructor(public el: ElementRef) {
    this.loading = true;
  };

  ngOnInit() {
    //this.img = this.el.nativeElement.querySelector('img');
    this.img = this.imgElement.nativeElement;

    if (!this.src) return this.error();
    this.img.crossOrigin = 'Anonymous';

  }


  load(): void {
    this.loading = false;
  }

  /**
   * This function will be triggered when http request fails
   */
  error(): void {
    //this.img.remove();
    //console.log('Error in Loading:',this.default);
    if(this.default) {
      this.img.src = this.default;
      this.load();
    }
  }

}
