import { Injectable } from '@angular/core';
import {User} from '../model/user';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tap, catchError, map} from 'rxjs/internal/operators';
import {Constant} from '../model/constant';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
      USER: User[] = [
          new User('123K2NQ2', 'Rob', 'Royce', 'rob@gmail.com', '123456', '62232932', 'DG', 'Employé', 'ssds/sdsj.jpg'),
          new User('123Ks2NQ2', 'Carlos', 'Royce', 'carlos@gmail.com', '123456', '64232932', 'PDG', 'Admin', 'ssds/sdsj.jpg')
      ];
    private heroesUrl = 'api/user';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    constructor(private http: HttpClient, private router: Router) { }

    isAuthenticated(): Observable<boolean> {
      return this.http.get<User>(Constant.BASE_URL + 'user/me', {withCredentials: true}).pipe(
          map(
              (user) => {
                  console.log('val: ' + user.keyy + !user.keyy);
                  return !!user.keyy;
              }
          )
      );
    }
    getUsers(): User[] {
    return this.USER;
    }
    getUsersGroup(): User[] {
    return this.USER;
    }
    getNotMember(groupKey: String): User[] {
    return this.USER;
    }
    getProjectUsers(projectKey: String): User[] {
    return this.USER;
    }
    getIntervenant(taskKey: String): User[] {
    return this.USER;
    }
    login(email: String, password: String): Observable<any> {
      return this.http.post<any>(Constant.BASE_URL + 'login', {email: email, password: password}, this.httpOptions);
    }
    add(user: User): Observable<User> {
      return this.http.post<User>(this.heroesUrl, user, this.httpOptions).pipe(
          tap( (_user: User) => this.log(`fetched user id=${_user.keyy}`)),
          catchError(this.handleError<User>('error'))
      );
    }
    changePassword(newPassword: String): Observable<any> {
      return this.http.post<any>(this.heroesUrl, newPassword, this.httpOptions).pipe(
          tap( ( data: any) => this.log(`fetched password`)),
          catchError(this.handleError<any>('error'))
      );
    }
    getUser(): Observable<User> {
      return this.http.get<User>(this.heroesUrl).pipe(
          tap(_ => this.log(`fetched hero id`)),
          catchError(this.handleError<any>('error'))
      );
    }
    getCurrentUser(): Observable<User> {
        return this.http.get<User>(Constant.BASE_URL + 'user/me', {withCredentials: true});
        // return new User('25638SJ1', 'Fotso', 'Ross', '', '', '', '', '', '');
    }
    delete(user: User | number): Observable<User> {
      const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
      return this.http.delete<User>('', httpOptions).pipe(
          tap(_ => this.log(`user deleted`)),
          catchError(this.handleError<any>('error'))
      );
    }
    disconnect() {
        localStorage.removeItem('token');
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
