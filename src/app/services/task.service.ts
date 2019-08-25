import { Injectable } from '@angular/core';
import {catchError, tap} from 'rxjs/internal/operators';
import {Task} from '../model/task';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {List} from '../model/list';
import {Project} from '../model/project';
import {Group} from '../model/group';
import {Constant} from '../model/constant';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
    private taskUrl = 'api/task';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    constructor(private http: HttpClient) { }

    getLists(projectKey: String): Observable<List[]> {
        return this.http.post<List[]>(Constant.BASE_URL + 'list/all',
            {keyy: projectKey}, this.httpOptions);
    }
    getProjectUsers(projectKey: String): Observable<User[]> {
        return this.http.post<User[]>(Constant.BASE_URL + 'task/users',
            {keyy: projectKey}, this.httpOptions);
    }
    getOtherProjectUsers(taskKey: String, projectKey: String): Observable<User[]> {
        return this.http.post<User[]>(Constant.BASE_URL + 'task/otheruser',
            {projectKey: projectKey, taskKey: taskKey}, this.httpOptions);
    }
    addList(list: List, projectKey: String): Observable<any> {
        return this.http.post<any>(Constant.BASE_URL + 'list/edit',
            {keyy: list.keyy, name: list.name, projectKey: projectKey}, this.httpOptions);
    }
    add(task: Task, listKey: String): Observable<any> {
        return this.http.post<any>(Constant.BASE_URL + 'task/edit',
            {listKey: listKey, task: task}, this.httpOptions);
    }
    deleteTask(task: Task): Observable<any> {
        return this.http.post<any>(Constant.BASE_URL + 'task/remove', {keyy: task.keyy}, this.httpOptions);
    }
    deleteUserTask(user: User, task: Task): Observable<any> {
        return this.http.post<any>(Constant.BASE_URL + 'task/removeuser', {keyy: task.keyy}, this.httpOptions);
    }
    deleteList(list: List): Observable<any> {
        return this.http.post<any>(Constant.BASE_URL + 'list/remove', {keyy: list.keyy}, this.httpOptions);
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
