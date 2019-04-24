import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { CsvDialogComponent } from './csv-dialog.component';
import {CsvPropertiesService} from './csv.properties.service';
import {CsvPropertiesComponent, FormStatus} from '../csv-config/csv-properties/csv-properties.component';
import {CsvTableComponent} from '../csv-config/csv-table/csv-table.component';
import {CsvUploadComponent} from '../csv-upload/csv-upload.component';
import {MaterialModule} from '../../../../material.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule, MatDialogRef} from "@angular/material";
import {DialogSectionHeadingComponent} from "../../../../dialogs/dialog-section-heading/dialog-section-heading.component";
import {DialogHeaderComponent} from "../../../../dialogs/dialog-header/dialog-header.component";
import {UserService} from "../../../../users/user.service";
import {RandomColorService} from "../../../../util/services/random-color.service";
import {ProjectService} from "../../../../project/project.service";
import {Operator} from "../../../operator.model";
import {Observable} from "rxjs/index";
import {of} from 'rxjs';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {interpolationV} from '@angular/core/src/render3';

class MockUserService {
    getFeatureDBList(): Observable<Array<{ name: string, operator: Operator }>> {
        return of([
            {name: 'name is taken', operator: null}
        ]);
    }
}
class MockProjectService {

}

describe('CsvDialogComponent', () => {
    let component: CsvDialogComponent;
    let fixture: ComponentFixture<CsvDialogComponent>;
    let service: CsvPropertiesService;
    let cd: ChangeDetectorRef;
    let el: any;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                CsvDialogComponent,
                CsvPropertiesComponent,
                CsvTableComponent,
                CsvUploadComponent,
                DialogSectionHeadingComponent,
                DialogHeaderComponent
            ],
            imports: [
                MaterialModule,
                FormsModule,
                MatDialogModule,
                ReactiveFormsModule,
                BrowserAnimationsModule
            ],
            providers: [
                CsvPropertiesService,
                RandomColorService,
                {provide: ProjectService, useClass: MockProjectService},
                {provide: UserService, useClass: MockUserService},
                {provide: MatDialogRef, useValue: {}}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CsvDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        el = fixture.nativeElement;
        cd = fixture.componentRef.injector.get(ChangeDetectorRef);
        service = fixture.componentRef.injector.get(CsvPropertiesService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('should update table', (done) => {
    //     const modifiedDate = new Date();
    //     component.data = {
    //         file: new File(['"a,b",c,d\n"1,2",3,4'], 'test-file.csv', {lastModified : modifiedDate.getDate(), type: 'csv'}),
    //         content: '"a,b",c,d\n"1,2",3,4',
    //         progress: 100,
    //         isNull: false
    //     };
    //     component.uploading$.next(false);
    //     fixture.detectChanges();
    //
    //     component.csvProperties.dataProperties.patchValue({isTextQualifier: true});
    //     fixture.detectChanges();
    //     component.csvTable._changeDetectorRef.detectChanges();
    //     fixture.detectChanges();
    //     setTimeout(() => {
    //         fixture.detectChanges();
    //         const table_rows = document.getElementsByTagName('tr');
    //         expect(table_rows[table_rows.length - 1].getElementsByTagName('td').length).toBe(7);
    //         done();
    //     }, 200);
    // });

    it('should disable/enable temporal properties', () => {
        const modifiedDate = new Date();
        component.data = {
            file: new File(['"a,b",c\n"1,2",3'], 'test-file.csv', {lastModified : modifiedDate.getDate(), type: 'csv'}),
            content: '"a,b",c\n"1,2",3',
            progress: 100,
            isNull: false
        };
        component.uploading$.next(false);
        cd.detectChanges();
        expect(component.csvProperties.temporalProperties.get('isTime').disabled).toBeTruthy();
        component.csvProperties.dataProperties.patchValue({isTextQualifier: false});
        cd.detectChanges();
        expect(component.csvProperties.temporalProperties.get('isTime').disabled).toBeFalsy();
        // TODO: Check if interval type options are getting disabled according to their columns attribute.
    });

    // it('should parse correctly', inject([CsvPropertiesService], (propertiesService: CsvPropertiesService) => {
    //   const modifiedDate = new Date();
    //   component.data = {
    //       file: new File(['"a,b",c,d\n"1,2",3,4'], 'test-file.csv', {lastModified : modifiedDate.getDate(), type: 'csv'}),
    //       content: '"a,b",c,d\n"1,2",3,4',
    //       progress: 100,
    //       isNull: false
    //   };
    //   component.uploading$.next(false);
    //   propertiesService.changeDataProperties({
    //         delimiter: ',',
    //         decimalSeparator: '.',
    //         isTextQualifier: false,
    //         textQualifier: '"',
    //         isHeaderRow: true,
    //         headerRow: 0,
    //   });
    //   fixture.detectChanges();
    //   component.csvTable._changeDetectorRef.detectChanges();
    //   const table_rows = document.getElementsByTagName('tr');
    //   expect(table_rows[table_rows.length - 1].getElementsByTagName('td').length).toBe(5);
    //   // propertiesService.changeDataProperties({
    //   //     delimiter: ',',
    //   //     decimalSeparator: '.',
    //   //     isTextQualifier: false,
    //   //     textQualifier: '"',
    //   //     isHeaderRow: true,
    //   //     headerRow: 0,
    //   // });
    //   // fixture.detectChanges();
    //   // const table_rows_notext = document.getElementsByTagName('tr');
    //   // expect(table_rows_notext[table_rows_notext.length - 1].getElementsByTagName('td').length).toBe(5);
    // }));
});
