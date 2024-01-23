import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  RouterModule,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { TokensService } from '../services/tokens.service';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { MenuComponent } from './menu/menu.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TokenResponse } from '../models/auth/token.response';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 't-pest-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NzLayoutModule,
    NzDropDownModule,
    NzSpinModule,
    MenuComponent,
    NzMenuModule,
    NzToolTipModule,
    NzPopoverModule,
    NzIconModule,
    NzButtonModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.less',
})
export class AdminComponent implements OnInit {
  isCollapsed = true;
  public isShowingRouteLoadIndicator = false;
  pageTitle$ = new Observable<string>();
  #user = new BehaviorSubject<null | TokenResponse>(null);
  user$ = this.#user.asObservable();
  tokenService = inject(TokensService);
  isHovered = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
  ) {
    let asyncLoadCount = 0;
    router.events.subscribe((event: any): void => {
      if (event instanceof RouteConfigLoadStart) {
        asyncLoadCount++;
      } else if (event instanceof RouteConfigLoadEnd) {
        asyncLoadCount--;
      }
      this.isShowingRouteLoadIndicator = asyncLoadCount == 1;
    });
  }
  
  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.tokenService.user.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user: any) => {
      if (user) {
        this.#user.next(user);
      }
    });
  }

  toggleSider() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.tokenService.logout();
    this.router.navigate(['/login']);
  }
}

