import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokensService } from './tokens.service';
import { parseJwt } from '../utils/jwt.parser';

@Injectable()
export class GuardService {
  constructor(private router: Router, private tokensService: TokensService) {}

  public checkValidId(id?: string) {
    if (!id) {
      this.router.navigate(['/not-found']);
      return false;
    }

    return true;
  }

  public checkPermission(ownerId?: string) {
    const loggedUser = this.tokensService.loggedUserValue;
    const jwtContent = parseJwt(loggedUser?.token ?? '');

    // if (
    //   ownerId !==
    //   jwtContent[
    //     'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    //   ]
    // ) {
    //   this.router.navigate(['/no-permission']);
    //   return false;
    // }

    return true;
  }

  public isOwner(ownerId?: string){
    const loggedUser = this.tokensService.loggedUserValue;
    const jwtContent = parseJwt(loggedUser?.token ?? '');

    // if (
    //   ownerId !==
    //   jwtContent[
    //     'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    //   ]
    // ) {      
    //   return false;
    // }

    return true;
  }
  
  public getCurrentUserId(): string {
    const loggedUser = this.tokensService.loggedUserValue;
    const jwtContent = parseJwt(loggedUser?.token ?? '');
    // return jwtContent[
    //   'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    // ] ?? '';
    return '';
  }
}
