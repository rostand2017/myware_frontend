import { Injectable } from '@angular/core';
import {User} from '../model/user';
import {Observable, of, Subscriber} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tap, catchError, map} from 'rxjs/internal/operators';
import {Constant} from '../model/constant';
import {Router} from '@angular/router';
import {Form} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    public user: User;
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    constructor(private http: HttpClient, private router: Router) { }

    isAuthenticated(): Observable<boolean> {
      if (this.user) {
          return of(true);
      }
      return this.http.get<User>(Constant.BASE_URL + 'user/me', {withCredentials: true}).pipe(
          map(
              (user) => {
                  this.user = user;
                  return !!user.keyy;
              }
          )
      );
    }
    getCurrentUser(): Observable<User> {
      if (this.user) {
          return of(this.user);
      }
      return this.http.get<User>(Constant.BASE_URL + 'user/me');
    }
    getActiveUsers(): Observable<User[]> {
        return this.http.get<User[]>(Constant.BASE_URL + 'user/active');
    }
    getDiscussionUsers(): Observable<User[]> {
        return this.http.get<User[]>(Constant.BASE_URL + 'user/discussion');
    }
    login(email: String, password: String): Observable<any> {
      return this.http.post<any>(Constant.BASE_URL + 'login', {email: email, password: password}, this.httpOptions);
    }
    add(user: User): Observable<any> {
      return this.http.post<User>(Constant.BASE_URL + 'user/add', user, this.httpOptions).pipe(
          tap( (data: any) => this.log(`fetched user`)),
          catchError(this.handleError<any>('error'))
      );
    }
    modify(user: User): Observable<any> {
      return this.http.post<User>(Constant.BASE_URL + 'user/modify', user, this.httpOptions).pipe(
          tap( (data: any) => this.log(`fetched user`)),
          catchError(this.handleError<any>('error'))
      );
    }
    modifyMe(user: User): Observable<any> {
      return this.http.post<User>(Constant.BASE_URL + 'user/me/modify', user, this.httpOptions).pipe(
          tap( (data: any) => this.log(`fetched user`)),
          catchError(this.handleError<any>('error'))
      );
    }
    changePassword(password: String, newPassword: String): Observable<any> {
      return this.http.post<any>(Constant.BASE_URL + 'change_password',
          {password: password, newPassword: newPassword}, this.httpOptions).pipe(
          tap( ( data: any) => this.log(`fetched password`)),
          catchError(this.handleError<any>('error'))
      );
    }
    uploadPhoto(data: FormData): Observable<any> {
      return this.http.post<any>(Constant.BASE_URL + 'user/uploadphoto', data);
    }
    delete(userKey: String): Observable<any> {
      return this.http.post<any>(Constant.BASE_URL + 'user/remove', {keyy: userKey},
          this.httpOptions).pipe(
          tap(_ => this.log(`user deleted`)),
          catchError(this.handleError<any>('error'))
      );
    }
    disconnect() {
        localStorage.removeItem('token');
        this.user = null;
        this.router.navigate(['/']);
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error); // log to console instead
            console.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }
    private log(message: string) {
        console.log(message);
    }
}
