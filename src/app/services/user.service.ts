import { Injectable } from '@angular/core';
import {User} from '../model/user';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tap, catchError} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
      USER: User[] = [
          new User('123K2NQ2', 'Rob', 'Royce', 'rob@gmail.com', '123456', '62232932', 'DG', 'Employé', 'ssds/sdsj.jpg'),
          new User('123K2NQ2', 'Carlos', 'Royce', 'carlos@gmail.com', '123456', '64232932', 'PDG', 'Admin', 'ssds/sdsj.jpg')
      ];
    private heroesUrl = 'api/user';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    constructor(private http: HttpClient) { }

  isAuthenticated(): boolean {
    return true;
  }
  getUsers(): User[] {
    return this.USER;
  }
  add(user: User): Observable<User> {
      return this.http.post<User>(this.heroesUrl, user, this.httpOptions).pipe(
          tap( (_user: User) => this.log(`fetched hero id=${_user.key}`)),
          catchError(this.handleError<User>('error'))
      );
  }
  getUser(): Observable<User> {
      return this.http.get<User>(this.heroesUrl).pipe(
          tap(_ => this.log(`fetched hero id`)),
          catchError(this.handleError<any>('error'))
      );
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
  disconnect(): Observable<any> {
      const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
      return this.http.get<any>('', httpOptions).pipe(
          tap(_ => this.log(`user disconnected`)),
          catchError(this.handleError<any>('error'))
      );
  }
  isAdmin() {
    return true;
  }
  authentication(login: String, password: String) {
    if ( login === 'admin' && password === 'admin') {
      // sd
    }
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
