import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { TokensService } from '../services/tokens.service';

@Injectable({ providedIn: 'root' })
export class CanAuthGuard implements CanActivate {
  constructor(private router: Router, private tokensService: TokensService) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    const user = this.tokensService.loggedUserValue;
    if (user) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
