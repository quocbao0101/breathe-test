import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import {
  UIFormData,
  FormInputType,
} from 'src/app/configs/base-input-constants';
import { BaseInputControlComponent } from 'src/app/core/input/base-input-control/base-input-control.component';
import {
  PageHeaderComponent,
  HeaderBreadcrumb,
} from 'src/app/core/page-header/page-header.component';
import {
  UpdateTenantReq,
} from 'src/app/models/tenant/tenant.req';
import { TenantsService } from 'src/app/services/tenants.service';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 't-pest-tenant-details',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    TranslateModule,
    NzButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NzGridModule,
    BaseInputControlComponent,
    NzTagModule,
  ],
  templateUrl: './tenant-details.component.html',
  styleUrl: './tenant-details.component.less',
})
export class TenantDetailsComponent {
  tenantId = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';
  tenant = inject(TenantsService).getTenantDetails(+this.tenantId);
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
    active: this.translate.instant('tenant.tenant-info'),
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

  #editTenant = inject(TenantsService).editTenant(+this.tenantId);
  #toggleStatusTenant = inject(TenantsService).toggleStatusTenant(+this.tenantId);

  isLoadingSubmit = false;
  isLoadingData = false;
  isLoadingToggleStatus = false;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private router: Router
  ) {
    this.infoTenantForm = this.fb.group({
      tenantName: [
        {
          value: '',
          disabled: true,
        },
        [Validators.required],
      ],
      displayName: [null, []],
      description: [null, []],
    });

    this.#editTenant.result$.pipe(takeUntilDestroyed()).subscribe((res) => {
      this.isLoadingSubmit = res.isPending;
    });
    this.#toggleStatusTenant.result$.pipe(takeUntilDestroyed()).subscribe((res) => {
      this.isLoadingToggleStatus = res.isPending;
    });

    this.tenant.result$
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        this.isLoadingData = data.isLoading;
        if (this.infoTenantForm && data.isSuccess) {
          const { tenantName, displayName, description } =
            this.infoTenantForm.controls;
          tenantName.setValue(data.data.tenantName);
          displayName.setValue(data.data.displayName);
          description.setValue(data.data.description);
        }
      });
  }

  handleSave() {
    if (this.infoTenantForm.valid) {
      const { displayName, description } = this.infoTenantForm.controls;
      const reqModel: UpdateTenantReq = {
        displayName: displayName.value?.trim(),
        description: description.value?.trim(),
      };
      this.#editTenant.mutate(reqModel);
    } else {
      Object.values(this.infoTenantForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleToggleStatus() {
    this.#toggleStatusTenant.mutate(null);
  }

  handleBack() {
    this.router.navigate(['/admin', 'tenants']);
  }
}
