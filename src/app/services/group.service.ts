import { Injectable } from '@angular/core';
import {catchError, tap} from 'rxjs/internal/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Group} from '../model/group';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  GROUP: Group[] = [
      new Group('629JGST202', 'Global Groups', 'Groupe global ou se trouve tous les employés'),
      new Group('629JGST20G', 'Marketing', 'Groupe de marketing'),
      new Group('629JGST20S', 'Dev', 'Groupe de développeur'),
  ];
  private groupUrl = 'api/group';
  httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }

  getGroups(): Group[] {
      return this.GROUP;
      /*return this.http.get<Group[]>(this.groupUrl).pipe(
          tap( (group: Group[])_ => this.log(`fetched group`)),
          catchError(this.handleError<any>('error'))
      );*/
  }
  add(group: Group): Observable<Group> {
      return this.http.post<Group>(this.groupUrl, group, this.httpOptions).pipe(
          tap( (_group: Group) => this.log(`fetched group id=${_group.key}`)),
          catchError(this.handleError<Group>('error'))
      );
  }
  getGroup(): Observable<Group> {
      return this.http.get<Group>(this.groupUrl).pipe(
          tap(_ => this.log(`fetched hero id`)),
          catchError(this.handleError<any>('error'))
      );
  }
  delete(group: Group | number): Observable<Group> {
      const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
      return this.http.delete<Group>('', httpOptions).pipe(
          tap(_ => this.log(`group deleted`)),
          catchError(this.handleError<any>('error'))
      );
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
