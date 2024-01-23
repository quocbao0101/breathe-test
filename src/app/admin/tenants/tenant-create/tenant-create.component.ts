import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HeaderBreadcrumb,
  PageHeaderComponent,
} from '../../../core/page-header/page-header.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  UIFormData,
  FormInputType,
} from 'src/app/configs/base-input-constants';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { BaseInputControlComponent } from '../../../core/input/base-input-control/base-input-control.component';
import { TenantsService } from 'src/app/services/tenants.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateTenantReq } from 'src/app/models/tenant/tenant.req';

@Component({
  selector: 't-pest-tenant-create',
  standalone: true,
  templateUrl: './tenant-create.component.html',
  styleUrl: './tenant-create.component.less',
  imports: [
    CommonModule,
    PageHeaderComponent,
    TranslateModule,
    NzButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NzGridModule,
    BaseInputControlComponent,
  ],
})
export class TenantCreateComponent {
  breadcrumb: HeaderBreadcrumb = {
    list: [
      {
        text: this.translate.instant('global.management'),
        link: '/admin',
      },
      {
        text: this.translate.instant('tenant.tenant'),
        link: '/admin/tenants',
      },
    ],
    active: this.translate.instant('tenant.add-tenant'),
  };

  infoTenantForm!: FormGroup;

  uiInfoFormData: Array<UIFormData> = [
    {
      label: this.translate.instant('tenant.form-label-name'),
      controlName: 'tenantName',
      validators: [
        {
          type: 'required',
          message: this.translate.instant(
            'tenant.form-label-name-error-required'
          ),
        },
      ],
      size: 'default',
      inputSpan: 12,
      labelSpan: 12,
      isRequired: true,
      formType: FormInputType.input,
      options: [],
      prefixIcon: null,
      suffix: null,
      type: 'text',
      placeholder: this.translate.instant('tenant.form-label-name'),
    },
    {
      label: this.translate.instant('tenant.form-label-display-name'),
      controlName: 'displayName',
      size: 'default',
      inputSpan: 12,
      labelSpan: 12,
      isRequired: false,
      formType: FormInputType.input,
      options: [],
      prefixIcon: null,
      suffix: null,
      type: 'text',
      placeholder: this.translate.instant('tenant.form-label-display-name'),
    },
    {
      label: this.translate.instant('tenant.form-label-description'),
      controlName: 'description',
      size: 'default',
      inputSpan: 24,
      labelSpan: 24,
      isRequired: false,
      formType: FormInputType.input,
      options: [],
      prefixIcon: null,
      suffix: null,
      type: 'text',
      placeholder: this.translate.instant('tenant.form-label-description'),
    },
  ];

  #createTenant = inject(TenantsService).createTenant();

  isLoadingSubmit = false;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private router: Router
  ) {
    this.infoTenantForm = this.fb.group({
      tenantName: [null, [Validators.required]],
      displayName: [null, []],
      description: [null, []],
    });

    this.#createTenant.result$.pipe(takeUntilDestroyed()).subscribe((res) => {
      this.isLoadingSubmit = res.isPending;
    });
  }

  handleSave() {
    if (this.infoTenantForm.valid) {
      const {tenantName, displayName, description} = this.infoTenantForm.controls;
      const reqModel: CreateTenantReq = {
        tenantName: tenantName.value.trim(),
        displayName: displayName.value?.trim(),
        description: description.value?.trim(),
      }
      this.#createTenant.mutate(reqModel);
    } else {
      Object.values(this.infoTenantForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleBack() {
    this.router.navigate(['/admin', 'tenants']);
  }
}
