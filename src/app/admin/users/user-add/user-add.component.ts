import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderBreadcrumb, PageHeaderComponent } from 'src/app/core/page-header/page-header.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseInputControlComponent } from 'src/app/core/input/base-input-control/base-input-control.component';
import { FormInputType, InputOptionData, UIFormData } from 'src/app/configs/base-input-constants';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UsersService } from 'src/app/services/users.service';
import { CreateUserReq, CreateUserRequest } from 'src/app/models/user/user.req';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { TokenResponse } from 'src/app/models/auth/token.response';
import { TokensService } from 'src/app/services/tokens.service';

@Component({
  selector: 't-pest-user-add',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule, 
    PageHeaderComponent, 
    NzInputModule, NzGridModule, NzTypographyModule,
    NzButtonComponent,
    PageHeaderComponent,
    TranslateModule,
    NzButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NzGridModule,
    BaseInputControlComponent,
    ],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.less',
})
export class UserAddComponent implements OnInit {
  breadcrumb: HeaderBreadcrumb = {
    list: [
      {
        text: this.translate.instant('global.management'),
        link: '/admin',
      },
      {
        text: this.translate.instant('users.users'),
        link: '/admin/users',
      }
    ],
    active: 'Thêm người dùng',
  };
  #usersService = inject(UsersService);
  destroyRef = inject(DestroyRef);
  #createUser = inject(UsersService).createUser();
  isLoadingSubmit: boolean = false;
  #user = new BehaviorSubject<null | TokenResponse>(null);
  user$ = this.#user.asObservable();
  loadRoles() {
    this.#usersService.getRoles().result$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.uiInfoFormData[3].loading = value.isPending;
      if (value.isSuccess) {
        const newValue = value.data?.data?.map((e: any) => ({
          label: e.description,
          value: e.roleId,
        }));
        this.uiInfoFormData[3].options = newValue;
      }
    });
  }

  loadProvinces() {
    this.#usersService.getProvinces().result$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.uiInfoFormData[4].loading = value.isPending;
      if (value.isSuccess) {
        const newValue = value.data?.data?.map((e: any) => ({
          label: e.provinceName,
          value: e.provinceId,
        }));
        this.uiInfoFormData[4].options = newValue;
      }
    });
  }

  loadDistrict(id: number): void {
    this.#usersService
      .getDistrict(id)
      .result$.pipe()
      .subscribe((value) => {
        this.uiInfoFormData[5].loading = value.isLoading;
        if (value.isSuccess) {
          const newValue = value.data?.data?.map((e: any) => ({
            label: e.districtName,
            value: e.districtId,
          }));
          this.uiInfoFormData[5].options = newValue;
        }
      });
  }

  loadCommunes(id: number): void {
    this.#usersService
    .getCommune(id)
    .result$.pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((value) => {
      this.uiInfoFormData[6].loading = value.isLoading;
      if (value.isSuccess) {
        const newValue = value.data?.data?.map((e: any) => ({
          label: e.communeName,
          value: e.communeId,
        }));
        this.uiInfoFormData[6].options = newValue;
      }
    });
  }

  getUser() {
    this.tokenService.user.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user: any) => {
      if (user) {
        this.#user.next(user);
      }
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadProvinces();
    this.getUser();
  }

  handleSave() {
    const { description, commune, email, fullName, password, phoneNumber, role, username } =this.infoUserForm.controls;
    if (this.infoUserForm.valid) {
      const reqModel: CreateUserRequest = {
        fullName: fullName.value?.trim(),
        username: username.value.trim(),
        password: password.value.trim(),
        phoneNumber: phoneNumber.value.trim(),
        email: email.value.trim(),
        roleId: role.value,
        communeId: commune?.value,
        description: description.value.trim(),
        tenantId: this.#user.value?.id ?? 0,
      }
      this.#createUser.mutate(reqModel);
    } else {
      Object.values(this.infoUserForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private tokenService: TokensService,
  ) {
    this.infoUserForm = this.fb.group({
      fullName: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      email: [null, [Validators.required, Validators.email]],
      role: [null, [Validators.required]],
      province: [null, [Validators.required]],
      district: [null, [Validators.required]],
      commune: [null, [Validators.required]],
      description: [null, []],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });

    this.#createUser.result$.pipe(takeUntilDestroyed()).subscribe((res) => {
      this.isLoadingSubmit = res.isPending;
    });

  }

  infoUserForm!: FormGroup;

  uiInfoFormData: Array<UIFormData> = [
    {
      id: 1,
      label: 'Họ và tên',
      controlName: 'fullName',
      size: 'large',
      inputSpan: 6,
      labelSpan: 0,
      isRequired: true,
      formType: FormInputType.input,
      options: [],
      prefixIcon: null,
      suffix: null,
      type: 'text',
      loading: false,
      isReadOnly: true,
      validators: [
        {
          type: 'required',
          message: 'Họ và tên là bắt buộc',
        },
      ],
      placeholder: 'Nhập họ và tên',
      inputChange: () => {}
    },
    {
      id: 2,
      label: this.translate.instant('users.form-label-phonenumber'),
      controlName: 'phoneNumber',
      size: 'large',
      inputSpan: 6,
      labelSpan: 0,
      isRequired: true,
      formType: FormInputType.input,
      options: [],
      prefixIcon: null,
      suffix: null,
      type: 'text',
      loading: false,
      isReadOnly: true,
      validators: [
        {
          type: 'required',
          message: this.translate.instant('users.form-placeholder-phonenumber'),
          
        },
        {
          type: 'pattern',
          message: this.translate.instant('profile.message-fail-phone'),
        },
      ],
      placeholder: this.translate.instant('users.form-placeholder-phonenumber'),
      inputChange: () => {}
    },
    {
      id: 3,
      label: this.translate.instant('users.form-label-email'),
      controlName: 'email',
      size: 'large',
      inputSpan: 6,
      labelSpan: 0,
      isRequired: true,
      formType: FormInputType.input,
      options: [],
      prefixIcon: null,
      suffix: null,
      type: 'text',
      loading: false,
      isReadOnly: true,
      validators: [
        {
          type: 'required',
          message: this.translate.instant('users.form-placeholder-email'),
          
        },
        {
          type: 'email',
          message: this.translate.instant('users.form-error-email'),
        },
        // {
        //   type: 'pattern',
        //   message: this.translate.instant('form-error-email'),
        // },
      ],
      placeholder: this.translate.instant('users.form-placeholder-email'),
      inputChange: () => {}
    },
    {
      id: 4,
      label: 'Vai trò',
      controlName: 'role',
      size: 'large',
      inputSpan: 6,
      labelSpan: 0,
      isRequired: true,
      formType: FormInputType.select,
      options: [],
      prefixIcon: null,
      suffix: null,
      type: 'text',
      loading: false,
      isReadOnly: true,
      placeholder: 'Chọn vai trò',
      validators: [
        {
          type: 'required',
          message: 'Nhập vai trò',
        },
      ],
      inputChange: () => {}
    },
    {
      id: 5,
      label: 'Tỉnh',
      controlName: 'province',
      size: 'large',
      inputSpan: 6,
      labelSpan: 0,
      isRequired: true,
      formType: FormInputType.select,
      options: [],
      prefixIcon: null,
      suffix: null,
      type: 'text',
      loading: false,
      isReadOnly: true,
      placeholder: 'Chọn tỉnh',
      inputChange: (event$: any) => {
        if (event$) {
          this.loadDistrict(event$)
        } else {
          this.infoUserForm.patchValue({
            district: null,
            commune: null,
          });
          this.uiInfoFormData[5].options = [];
        }
      },
      validators: [
        {
          type: 'required',
          message: 'Nhập tỉnh',
        },
      ],
      
    },
    {
      id: 6,
      label: 'Huyện - TX - TP',
      controlName: 'district',
      size: 'large',
      inputSpan: 6,
      labelSpan: 0,
      isRequired: true,
      formType: FormInputType.select,
      options: [],
      prefixIcon: null,
      suffix: null,
      type: 'text',
      loading: false,
      isReadOnly: true,
      placeholder: 'Chọn huyện - thị xã - thành phố',
      inputChange: (event$: any) => {
        if (event$) {
          this.loadCommunes(event$)
        } else {
          this.infoUserForm.patchValue({
            commune: null,
          });
          this.uiInfoFormData[6].options = [];
        }
      },
      validators: [
        {
          type: 'required',
          message: 'Nhập huyện - thị xã - thành phố',
        },
      ],
    },
    {
      id: 7,
      label: 'Xã - Phường - Thị Trấn',
      controlName: 'commune',
      size: 'large',
      inputSpan: 6,
      labelSpan: 0,
      isRequired: true,
      formType: FormInputType.select,
      options: [],
      prefixIcon: null,
      suffix: null,
      type: 'text',
      loading: false,
      isReadOnly: true,
      placeholder: 'Chọn xã - phường - thị trấn',
      inputChange: () => {},
      validators: [
        {
          type: 'required',
          message: 'Nhập xã - phường - thị trấn',
        },
      ],
    },
    {
      id: 8,
      label: 'Mô tả',
      controlName: 'description',
      size: 'large',
      inputSpan: 6,
      labelSpan: 0,
      isRequired: false,
      formType: FormInputType.input,
      options: [],
      prefixIcon: null,
      suffix: null,
      type: 'text',
      loading: false,
      isReadOnly: true,
      placeholder: 'Nhập mô tả',
      inputChange: () => {},
    },
    {
      id: 9,
      label: 'Tài khoản',
      controlName: 'username',
      size: 'large',
      inputSpan: 6,
      labelSpan: 0,
      isRequired: true,
      formType: FormInputType.input,
      options: [],
      prefixIcon: null,
      suffix: null,
      type: 'text',
      loading: false,
      isReadOnly: true,
      placeholder: 'Nhập tài khoản',
      validators: [
        {
          type: 'required',
          message: 'Nhập tài khoản',
        },
      ],
      inputChange: () => {},
    },
    {
      id: 10,
      label: 'Mật khẩu',
      controlName: 'password',
      size: 'large',
      inputSpan: 6,
      labelSpan: 0,
      isRequired: true,
      formType: FormInputType.input,
      options: [],
      prefixIcon: null,
      suffix: null,
      type: 'password',
      loading: false,
      isReadOnly: true,
      placeholder: 'Nhập mật khẩu',
      validators: [
        {
          type: 'required',
          message: 'Nhập mật khẩu',
        },
      ],
      inputChange: () => {}
    },
  ];
}
