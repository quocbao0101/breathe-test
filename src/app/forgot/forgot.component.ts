/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { BaseInputControlComponent } from 'src/app/core/input/base-input-control/base-input-control.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TokensService } from 'src/app/services/tokens.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 't-pest-forgot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    BaseInputControlComponent,
    NzModalModule,
    RouterModule
  ],
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.less'],
})
export class ForgotComponent {
  forgotForm: FormGroup<{
    email: FormControl<string>;
  }> = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  emailModal: string = '';
  isVisible = false;
  loading = false;
  forgotFormValidator = {
    email: [
      {
        type: 'required',
        message: this.translate.instant('auth.enterEmail'),
        
      },
      {
        type: 'email',
        message: this.translate.instant('auth.emailInvalid'),
      },
    ],
  };

  constructor(
    private fb: NonNullableFormBuilder,
    private translate: TranslateService,
    private tokensService: TokensService,
    private message: NzMessageService,
    private router: Router
  ) {}

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
    this.router.navigate(['change-pass'], { queryParams: { email: this.emailModal } });
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  submitForm(): void {
    if (this.forgotForm.valid) {
      const { email } = this.forgotForm.value;
      if (!email) {
        return;
      }
      this.loading = true;
      this.tokensService
        .forgot({email})
        .pipe(
          finalize(() => (this.loading = false)),
        )
        .subscribe({
          next: (token) => {
            this.isVisible = true;
            this.emailModal = email;
            this.forgotForm.reset();
          },
           error: (err: any) => {
            this.message.error(
              err.sysError.code
            );
          },
        });
    } else {
      Object.values(this.forgotForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
