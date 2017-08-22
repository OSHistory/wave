import {Component, OnDestroy, ChangeDetectorRef} from '@angular/core';

import {Observable, Subscription, BehaviorSubject} from 'rxjs/Rx';

import {IBasket, BasketTypeAbcdGrouped} from './gfbio-basket.model';
import {UserService} from '../../../users/user.service';

@Component({
    selector: 'wave-gfbio-baskets',
    template: `
    <wave-sidenav-header>GFBio Search Baskets</wave-sidenav-header>
    <div class="container" layout="column">
        <md-toolbar>
          <label>Basket:&nbsp;</label>
            <md-select [(ngModel)]='selectedBasket' class='toolbar-fill-remaining-space' >
                <md-option *ngFor='let basket of baskets' [value]='basket'> 
                    {{basket.timestamp}} - {{basket.query}}
                    </md-option>
            </md-select> 
          <span class="toolbar-fill-remaining-space"></span>
          <button md-icon-button aria-label='sync' (click)='reload()'>
            <md-icon>sync</md-icon>
          </button>
        </md-toolbar>
        <div *ngIf="isLoading$ | async" class="loading">
            <md-progress-spinner mode="indeterminate"></md-progress-spinner>
        </div>
        <div *ngIf="!(isLoading$ | async)" fxFlex="grow" fxLayout="column">
             <ng-template [ngIf]='selectedBasket'>       
                <ng-template ngFor let-result [ngForOf]='selectedBasket.results | waveBasketResultGroupByDatasetPipe' >
                      
                      <ng-template [ngIf]='result.type === _abcdGroupedType'>
                        <wave-grouped-abcd-basket-result [result]='result'></wave-grouped-abcd-basket-result>
                      </ng-template>
                      <ng-template [ngIf]='result.type !== _abcdGroupedType'>
                        <wave-pangaea-basket-result [result]='result'></wave-pangaea-basket-result>
                      </ng-template>
                </ng-template>
             </ng-template>
        </div>
    </div>
    `,
    styles: [`
    select {
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .container {
        height: 100%;
        min-width: 300px;
        max-width: 100%;
    }
    
    .toolbar-fill-remaining-space {
        flex: 1 1 auto;
    }
    md-list-item {
        cursor: pointer;
    }
    md-list >>> md-subheader {
        color: white;
        background-color: #009688;
        font-weight: bold;
    }
    img {
      padding: 5px 5px 5px 0;
    }
    div.loading {
        padding: 32px calc(50% - 100px/2);
    }
    md-progress-spinner {
        width: 100px;
        height: 100px;
    }
    `],
})

export class GfbioBasketsComponent implements OnDestroy {

    baskets: Array<IBasket> = [];
    selectedBasket: IBasket;

    private _abcdGroupedType: BasketTypeAbcdGrouped = 'abcd_grouped';

    private gfbioBasketStream: Observable<Array<IBasket>>;
    private subscription: Subscription;
    private isLoading$ = new BehaviorSubject<boolean>(true);

    constructor(
        private userService: UserService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.gfbioBasketStream = this.userService.getGfbioBasketStream();
        this.subscribeToBasketStream();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    reload() {
        this.baskets = [];
        this.selectedBasket = undefined;

        this.subscribeToBasketStream();

        this.isLoading$.next(true);
    }

    private subscribeToBasketStream() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.gfbioBasketStream.subscribe(baskets => {
            this.baskets = baskets;
            if (!this.selectedBasket && !!baskets && baskets.length > 0) {
                this.selectedBasket = baskets[0];
            }
            this.isLoading$.next(false);
            this.changeDetectorRef.markForCheck();
        });
    }
}
