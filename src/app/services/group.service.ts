import { Injectable } from '@angular/core';
import {catchError, tap} from 'rxjs/internal/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Group} from '../model/group';
import {Observable, of} from 'rxjs';
import {User} from '../model/user';
import {Constant} from '../model/constant';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groupUrl = 'api/group';
  httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }

  getGroups(): Observable<Group[]> {
      return this.http.get<Group[]>(Constant.BASE_URL + 'group/all');
  }
  getMembers(groupKey: String): Observable<any> {
    return this.http.post<any>(Constant.BASE_URL + 'group/members', {keyy: groupKey}, this.httpOptions);
  }
  getOtherMembers(groupKey: String): Observable<any> {
    return this.http.post<any>(Constant.BASE_URL + 'group/othermembers', {keyy: groupKey}, this.httpOptions);
  }

  otherGroupProject(key: String): Observable<Group[]> {
      return this.http.post<Group[]>(Constant.BASE_URL + 'project/othergroup', {keyy: key}, this.httpOptions);
  }
  add(group: Group): Observable<any> {
      return this.http.post<any>(Constant.BASE_URL + 'group/edit', group, this.httpOptions).pipe(
          tap( (_group) => this.log(`fetched group id=${_group.keyy}`)),
          catchError(this.handleError<any>('error'))
      );
  }
  addMember(users: any, groupKey: String): Observable<any> {
      return this.http.post<any>(Constant.BASE_URL + 'group/addMember',
          {users: users, keyy: groupKey}, this.httpOptions);
  }
  removeMember(userKey: String, groupKey: String): Observable<any> {
    return this.http.post<any>(Constant.BASE_URL + 'group/removeMember',
        {groupKey: groupKey, keyy: userKey}, this.httpOptions);
  }
  delete(groupKey: String): Observable<any> {
      return this.http.post<any>('', {key: groupKey}, this.httpOptions);
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
