import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseTableModule } from 'src/app/core/base-table/base-table.module';
import { HeaderBreadcrumb, PageHeaderComponent } from 'src/app/core/page-header/page-header.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { BaseInputControlComponent } from 'src/app/core/input/base-input-control/base-input-control.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Router, RouterModule } from '@angular/router';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BehaviorSubject, combineLatest, map, switchMap, tap } from 'rxjs';
import { COL_DATA_TYPE } from 'src/app/core/base-table/models/types';
import { UsersService } from 'src/app/services/users.service';
import { FormInputType, UIFormData } from 'src/app/configs/base-input-constants';

@Component({
  selector: 't-pest-user-list',
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
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.less',
})
export class UserListComponent {
  searchUsersForm!: FormGroup;
  page$ = new BehaviorSubject(1);
  size$ = new BehaviorSubject(5);
  keyword$ = new BehaviorSubject('');
  COL_DATA_TYPE = COL_DATA_TYPE;
  #usersService = inject(UsersService);
  users$ = combineLatest([this.page$, this.size$, this.keyword$]).pipe(
    switchMap(([page, size, keyword]) => {
      return this.#usersService.getUsers(page, size, keyword).result$.pipe(
        tap((result) => {
          !result.data?.last &&
            this.#usersService.prefetch(page + 1, size, keyword);
        }),
        map((result: any) => {
          return ({
            ...result,
            page: page,
          })
        })
      );
    })
  );
  breadcrumb: HeaderBreadcrumb = {
    list: [
      {
        text: this.translate.instant('global.management'),
        link: '/admin',
      },
    ],
    active: this.translate.instant('users.users'),
  };
  constructor(    
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService) {

  }

  uiInfoFormData: Array<UIFormData> = [
    {
      controlName: 'keyword',
      validators: [],
      size: 'default',
      inputSpan: 12,
      formType: FormInputType.input,
      options: [],
      placeholder: 'Tìm kiếm người dùng',
      isDelayed: true,
      handleDelayedInput: (key: string) => this.onChangeKeyword(key),
      type: 'search',
    },
  ];

  onChangeKeyword(key: string): void {
    this.keyword$.next(key);
  }

  handlePageChange(value: number) {
    this.page$.next(value);
  }

  handleSizeChange(value: number): void {
    this.size$.next(value)
  }

  ngOnInit(): void {
    this.searchUsersForm = this.fb.group({
      keyword: [null, []],
    });
  }

  handleAddUser() {
    this.router.navigate(['/admin', 'users', 'create']);
  }
}
