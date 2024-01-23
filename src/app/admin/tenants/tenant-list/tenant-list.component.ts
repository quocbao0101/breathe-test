import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { BaseTableModule } from 'src/app/core/base-table/base-table.module';
import { BaseInputControlComponent } from 'src/app/core/input/base-input-control/base-input-control.component';
import { BehaviorSubject, combineLatest, switchMap, tap, map } from 'rxjs';
import {
  FormInputType,
  UIFormData,
} from 'src/app/configs/base-input-constants';
import { BASE_PAGE_SIZE } from 'src/app/models/base-pagination.req';
import { TenantsService } from 'src/app/services/tenants.service';
import { COL_DATA_TYPE } from 'src/app/core/base-table/models/types';
import { NzTagModule } from 'ng-zorro-antd/tag';
import {
  HeaderBreadcrumb,
  PageHeaderComponent,
} from 'src/app/core/page-header/page-header.component';

@Component({
  selector: 't-pest-tenant-list',
  standalone: true,
  imports: [
    CommonModule,
    BaseInputControlComponent,
    TranslateModule,
    ReactiveFormsModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzToolTipModule,
    BaseTableModule,
    RouterModule,
    NzTagModule,
    PageHeaderComponent,
  ],
  templateUrl: './tenant-list.component.html',
  styleUrl: './tenant-list.component.less',
})
export class TenantListComponent implements OnInit {
  page$ = new BehaviorSubject(1);
  size$ = new BehaviorSubject(5);
  #keyword = new BehaviorSubject('');
  keyword$ = this.#keyword.asObservable();
  #status = new BehaviorSubject<'' | boolean>('');
  COL_DATA_TYPE = COL_DATA_TYPE;
  #tenantsService = inject(TenantsService);
  tenants$ = combineLatest([this.page$, this.keyword$, this.size$]).pipe(
    switchMap(([page, keyword, size]) => {
      return this.#tenantsService.getTenants(page, keyword, size).result$.pipe(
        tap((result) => {
          !result.data?.last &&
            this.#tenantsService.prefetch(page + 1, keyword, size);
        }),
        map((result) => {
          return ({
            ...result,
            page: page,
          })
        })
      );
    })
  );
  destroyRef = inject(DestroyRef);
  searchTenantsForm!: FormGroup;

  uiInfoFormData: Array<UIFormData> = [
    {
      controlName: 'keyword',
      validators: [],
      size: 'default',
      inputSpan: 12,
      formType: FormInputType.input,
      options: [],
      placeholder: this.translate.instant('tenant.search-placeholder'),
      isDelayed: true,
      handleDelayedInput: (key: string) => this.onChangeKeyword(key),
      type: 'search',
    },
  ];
  basePageSize = BASE_PAGE_SIZE;
  loadingToggleStatus = false;

  breadcrumb: HeaderBreadcrumb = {
    list: [
      {
        text: this.translate.instant('global.management'),
        link: '/admin',
      },
    ],
    active: this.translate.instant('tenant.tenant'),
  };

  constructor(private fb: FormBuilder, private translate: TranslateService, private router: Router) {

  }
  ngOnInit(): void {
    this.searchTenantsForm = this.fb.group({
      keyword: [null, []],
    });
  }

  onChangeKeyword(key: string): void {
    this.#keyword.next(key);
  }

  handlePageChange($event: any): void {
    this.page$.next($event);
  }

  handleSizeChange(value: number): void {
    this.size$.next(value)
  }

  handleAddTenant() {
    this.router.navigate(['/admin', 'tenants', 'create']);
  }
}
