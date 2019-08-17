import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from './user.service';
import {User} from '../model/user';
import {Constant} from '../model/constant';
import {HttpClient} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.http.get<User>(Constant.BASE_URL + 'user/me', {withCredentials: true}).pipe(
            map(
                (user) => {
                    if (user.keyy) {
                        return true;
                    } else {
                        this.router.navigate(['/']);
                        return false;
                    }
                }
            )
        );
    }

  constructor(private userService: UserService, private router: Router, private http: HttpClient ) { }
}
