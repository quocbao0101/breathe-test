/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderBreadcrumb, PageHeaderComponent } from 'src/app/core/page-header/page-header.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { BaseTableModule } from 'src/app/core/base-table/base-table.module';
import { BaseInputControlComponent } from 'src/app/core/input/base-input-control/base-input-control.component';
import { Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormInputType, UIFormData } from 'src/app/configs/base-input-constants';
import { BehaviorSubject, combineLatest, map, switchMap, tap } from 'rxjs';
import { COL_DATA_TYPE } from 'src/app/core/base-table/models/types';
import { UsersService } from 'src/app/services/users.service';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 't-pest-users',
  standalone: true,
  imports: [
    CommonModule,
    BaseTableModule,
    PageHeaderComponent,
    TranslateModule,
    NzButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NzGridModule,
    BaseInputControlComponent,
    NzTagModule,
    RouterModule,
    NzToolTipModule,
    NzIconModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.less',
})

export class UsersComponent {

}
