import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit,
  Output, Input, EventEmitter } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import _ from 'lodash';
import * as alertify from 'alertify.js';
import moment from 'moment';
import { NbThemeService } from '@nebular/theme';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;

@Component({
  selector: 'ngx-datepicker-range',
  template: `
    <ngb-datepicker #dp [(ngModel)]="dateModel"
      (navigate)="date = $event.next; onNavigation($event)"
      [firstDayOfWeek] = 7
      (ngModelChange)="onDateSelection($event)"
      [dayTemplate]="ranget">
    </ngb-datepicker>
    <ng-template #ranget let-date="date" let-focused="focused">
      <span class="custom-day"
        [class.focused]="focused"
        [class.range]="isFrom(date) || isTo(date) || isInside(date) || isHovered(date)"
        [class.faded]="isHovered(date) || isInside(date)"
        [ngStyle]="highlightedStyle(date)"
        (mouseenter)="hoveredDate = date"
        (mouseleave)="hoveredDate = null">
        {{ date.day }}
      </span>
    </ng-template>
  `,
  styleUrls: ['./datepicker.range.component.scss'],
})
export class DatepickerRangeComponent implements AfterViewInit {
  /* eventDates: Array<any> = [
    { fromDate: { year: 2017, month: 7, day: 3 }, toDate: { year: 2017, month: 7, day: 5 },
      highlight: { background: 'orange'}},
    { fromDate: { year: 2017, month: 7, day: 10 }, toDate: { year: 2017, month: 7, day: 12 }},
    { fromDate: { year: 2017, month: 7, day: 17 }, toDate: { year: 2017, month: 7, day: 23 }}]
    */
  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct = { year: 2017, month: 7, day: 10 };
  toDate: NgbDateStruct = { year: 2017, month: 7, day: 12 };
  dateModel: NgbDateStruct = { year: 2017, month: 7, day: 10 };
  isInitialized: Boolean = false;
  @Input() events: any;
  @Input() selectedEvent: any;
  @Output() onMonthChanged: EventEmitter<any> = new EventEmitter();
  @ViewChild('dp') dp;
  constructor(calendar: NgbCalendar) {
    // this.fromDate = calendar.getToday();
    // this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    this.fromDate = { year: 2017, month: 7, day: 10 };
    this.toDate = { year: 2017, month: 7, day: 12 };
  }

  ngAfterViewInit() {
    this.dp.navigateTo(this.dateModel);
  }

  onNavigation($event) {
    if ($event.current && $event.next) {
      this.onMonthChanged.emit($event.next);
    }
  }
  onDateSelection(date: NgbDateStruct) {
    /*if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = (this.isInitialized) ? null : this.toDate;
      this.fromDate = date;
      this.isInitialized = true;
    }*/
  }



  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate &&
    after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => {
    let isInside = false;
    if (!this.events) return isInside;
    this.events.some((eventDate) => {
      isInside = after(date, eventDate.fromDate) && before(date, eventDate.toDate);
      if (isInside) return isInside;
    });
    ;
    return isInside;
  };
  isFrom = date => {
    let isFrom = false;
    if (!this.events) return isFrom;
    this.events.some((eventDate) => {
      isFrom = equals(date, eventDate.fromDate);
      if (isFrom) return isFrom;
    });
    return isFrom;
  };
  isTo = date => {
    let isTo = false;
    if (!this.events) return isTo;
    this.events.some((eventDate) => {
      isTo = equals(date, eventDate.toDate);
      if (isTo) return isTo;
    });
    return isTo;
  };
  highlightedStyle = date => {
    let style = {};
    if (!this.events) return style;
    this.events.some((eventDate) => {
      if (eventDate.event_name === this.selectedEvent.event_name) {
        const isTo = equals(date, eventDate.toDate);
        const isFrom = equals(date, eventDate.fromDate);
        const isInside =  after(date, eventDate.fromDate) && before(date, eventDate.toDate);
        if (isTo || isFrom || isInside) {
          style = { background: 'orange'};
          return true;
        }
      }
    });
    return style;
  }
}
