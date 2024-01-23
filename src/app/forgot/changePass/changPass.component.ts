import { NzImageModule } from 'ng-zorro-antd/image';
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
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { BaseInputControlComponent } from 'src/app/core/input/base-input-control/base-input-control.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TokensService } from 'src/app/services/tokens.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs';


@Component({
  selector: 't-pest-change-pass',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    BaseInputControlComponent,
    NzModalModule,
    NzImageModule,
    RouterModule
  ],
  templateUrl: './changPass.component.html',
  styleUrls: ['./changPass.component.less'],
})
export class ChangPassComponent implements OnInit {
  changPassForm: FormGroup<{
    code: FormControl<string>;
    newPass: FormControl<string>;
    confirmNewPass: FormControl<string>;
  }>
  email: string = '';
  submitted = false;
  isVisible = false;
  loading = false;
  passwordVisible = false;
  passwordVisibleConfirm = false;
  destroyRef = inject(DestroyRef);
  changPassFormValidator = {
    code: [
      {
        type: 'required',
        message: this.translate.instant('auth.codeEnter'),
        
      },
    ],
    newPass: [
      {
        type: 'required',
        message: this.translate.instant('auth.passwordEnterNew'),
        
      },
    ],
    confirmNewPass: [
      {
        type: 'required',
        message: this.translate.instant('auth.confirmPassword'),
      },
      {
        type: 'confirm',
        message: this.translate.instant('auth.passwordNotMatch'),
      },
    ],
  };

  confirmValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.changPassForm.controls.newPass.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  constructor(
    private fb: NonNullableFormBuilder,
    private translate: TranslateService,
    private tokensService: TokensService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
  ) {
   this.changPassForm = this.fb.group({
      code: ['', [Validators.required]],
      newPass: ['', [Validators.required]],
      confirmNewPass: ['', [this.confirmValidator],],
    })
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  handleOk(): void {
    this.isVisible = false;
    this.router.navigate(['login']);
  }

  submitForm(): void {
    this.submitted = true;
    if (this.changPassForm.valid) {
      const { code, newPass } = this.changPassForm.value;
      if (!code && !newPass) {
        return;
      }
      this.loading = true;
      this.tokensService
        .changePass({
          email: this.email,
          password: newPass,
          code,
        })
        .pipe(
          finalize(() => (this.loading = false)),
        )
        .subscribe({
          next: () => {
            this.isVisible = true
            this.changPassForm.reset();
          },
          error: (err: any) => {
            this.message.error(
              err.sysError.code
            );
          },
        });
    } else {
      Object.values(this.changPassForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
