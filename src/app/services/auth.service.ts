import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.userService.isAuthenticated()) {
            return true;
        } else {
          this.router.navigate(['/']);
        }
    }

  constructor(private userService: UserService, private router: Router) { }
}
