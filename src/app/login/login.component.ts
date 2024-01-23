import { Component, DestroyRef, inject } from '@angular/core';
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

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { BaseInputControlComponent } from 'src/app/core/input/base-input-control/base-input-control.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { TokensService } from 'src/app/services/tokens.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 't-pest-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzTypographyModule,
    NzCheckboxModule,
    NzIconModule,
    BaseInputControlComponent,
    NzDividerModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent {
  loginForm: FormGroup<{
    username: FormControl<string>;
    password: FormControl<string>;
  }> = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  passwordVisible = false;
  loading = false;
  destroyRef = inject(DestroyRef);
  tokenValue: any;
  loginFormValidator = {
    username: [
      {
        type: 'required',
        message: this.translate.instant('auth.pleaseInputUsername'),
      },
    ],
    password: [
      {
        type: 'required',
        message: this.translate.instant('auth.pleaseInputPassword'),
      },
    ],
  };

  constructor(
    private fb: NonNullableFormBuilder,
    private translate: TranslateService,
    private tokensService: TokensService,
    private message: NzMessageService,
    private router: Router,
    private authService: AuthService,
  ) {}

  loginGoogle(): void {
    this.authService.signInWithGoogle().then((data) => {
      this.loading = false;
      if (data) {
        this.tokensService.updateAuthUser(this.tokenValue);
        this.router.navigate(['admin']);
        this.loginForm.reset();
      }
    })
    .catch((error) => {
      if (error) {
        this.loading = false;
        this.message.error(
          this.translate.instant('auth.wrongUsernameOrPassword')
      );
      }
    });;
  }

  loginFacebook(): void {
    this.authService.signInWithFacebook().then((data) => {
      this.loading = false;
      if (data) {
        // this.tokensService.updateAuthUser(this.tokenValue);
        this.router.navigate(['admin']);
        this.loginForm.reset();
      }
    })
    .catch((error) => {
      if (error) {
        console.log(error);
        this.loading = false;
        this.message.error(
          this.translate.instant('auth.wrongUsernameOrPassword')
      );
      }
    });;
  }

  loginApple(): void {
    this.authService.signInWithApple();
  }

  submitForm(): void {
    if (this.loginForm.valid) {
      const { password, username } = this.loginForm.value;
      if (!username || !password) {
        return;
      }
      this.loading = true;
      this.tokensService
        .tokensGetToken({
          username,
          password,
          device: 'Web',
        })
        .pipe(
          finalize(() => (this.loading = false)),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
          next: (token) => {
            this.tokenValue = token;
            this.tokensService.updateAuthUser(token);
            this.loginForm.reset();
            this.router.navigate(['admin']);
          },
          error: () => {
            this.message.error(
              this.translate.instant('auth.wrongUsernameOrPassword')
            );
          },
        });
      this.authService.signInWithEmailAndPassword(username, password).then((data) => {
        this.loading = false;
        if (data) {
            this.tokensService.updateAuthUser(this.tokenValue);
            this.loginForm.reset();
            this.router.navigate(['admin']);
        }
      })
      .catch((error) => {
        if (error) {
          this.loading = false;
          this.message.error(
            this.translate.instant('auth.wrongUsernameOrPassword')
        );
        }
      });
    } else {
      Object.values(this.loginForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
