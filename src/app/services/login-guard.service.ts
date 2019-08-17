import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from './user.service';
import {User} from '../model/user';
import {HttpClient} from '@angular/common/http';
import {Constant} from '../model/constant';
import {map} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.http.get<User>(Constant.BASE_URL + 'user/me', {withCredentials: true}).pipe(
            map(
                (user) => {
                    if (!user.keyy) {
                        return true;
                    } else {
                        this.router.navigate(['/groups']);
                        return false;
                    }
                }
            )
        );
    }

    constructor(private userService: UserService, private router: Router, private http: HttpClient) { }
}
