import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';

import {ProjectService} from '../project/project.service';

import {Moment} from 'moment';

@Component({
    selector: 'wave-time-ribbon',
    template: `
      <div class="flex-column">
      <div class="flex-row">
        <md-input-container>
          <input md-input placeholder="year" type="number" maxLength="4"
              [ngModel]="moment.year()" (ngModelChange)="updateYear($event)"
              (wheel)="$event.stopPropagation()"
          >
        </md-input-container>
        <md-input-container>
          <input md-input placeholder="month" type="number" maxLength="2"
              [ngModel]="moment.month()+1" (ngModelChange)="updateMonth($event-1)"
              (wheel)="$event.stopPropagation()"
          >
        </md-input-container>
        <md-input-container>
          <input md-input placeholder="day" type="number" maxLength="2"
              [ngModel]="moment.date()" (ngModelChange)="updateDate($event)"
              (wheel)="$event.stopPropagation()"
          >
        </md-input-container>
      </div>
      <div class="flex-row">
        <md-input-container>
          <input md-input placeholder="hour" type="number" maxLength="2"
              [ngModel]="moment.hour()" (ngModelChange)="updateHour($event)"
              (wheel)="$event.stopPropagation()"
          >
        </md-input-container>
        <md-input-container>
          <input md-input placeholder="minute" type="number" maxLength="2"
              [ngModel]="moment.minute()" (ngModelChange)="updateMinute($event)"
              (wheel)="$event.stopPropagation()"
          >
         </md-input-container>
         <md-input-container>
          <input md-input placeholder="second" type="number" maxLength="2"
              [ngModel]="moment.second()" (ngModelChange)="updateSecond($event)"
              (wheel)="$event.stopPropagation()"
          >
        </md-input-container>
      </div>
    </div>
    `,
    styles: [`
    .flex-row {
      display: flex;
      flex-direction: row;
      box-sizing: border-box;      
    }
    .flex-column {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;  
    }
    md-input-container {
        width: 120px;
    }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeRibbonComponent implements OnInit {

    private moment: Moment;

    constructor(
        private projectService: ProjectService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    updateYear(event: string | number) {
        const value = this.eventToNumber(event);
        if ( value && !isNaN(value)) {
            this.moment.year(value);
            this.push();
        }
    }
    updateMonth(event: string | number) {
        const value = this.eventToNumber(event);
        if ( value && !isNaN(value)) {
            this.moment.month(value);
            this.push();
        }
    }
    updateDate(event: string | number) {
        const value = this.eventToNumber(event);
        if ( value && !isNaN(value)) {
            this.moment.date(value);
            this.push();
        }
    }
    updateHour(event: string | number) {
        const value = this.eventToNumber(event);
        if ( value && !isNaN(value)) {
            this.moment.hour(value);
            this.push();
        }
    }
    updateMinute(event: string | number) {
        const value = this.eventToNumber(event);
        if ( value && !isNaN(value)) {
            this.moment.minute(value);
            this.push();
        }
    }
    updateSecond(event: string | number) {
        const value = this.eventToNumber(event);
        if ( value && !isNaN(value)) {
            this.moment.second(value);
            this.push();
        }
    }

    ngOnInit() {
        this.projectService.getTimeStream().subscribe(time => {
            if (!time.isSame(this.moment)) {
                this.moment = time.clone();
                this.changeDetectorRef.markForCheck();
                // console.log("wave-time-ribbon", "projectService changed", this.moment);
            }
        });
    }

    private eventToNumber(event: string | number): number {
        if (typeof event === 'string') {
            if ( event === '' ) {
                return 0;
            }
            return parseInt(event, 10);
        }
        if (typeof event === 'number') {
            return event;
        }
        return NaN;
    }

    private push() {
        if (this.moment.isValid() && this.moment !== undefined) {
            this.projectService.setTime(this.moment.clone());
        }
    }
}
