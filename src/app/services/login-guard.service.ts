import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.userService.isAuthenticated()) {
            this.router.navigate(['/users']);
        } else {
            return true;
        }
    }

    constructor(private userService: UserService, private router: Router) { }
}
