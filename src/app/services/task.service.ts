import { Injectable } from '@angular/core';
import {catchError, tap} from 'rxjs/internal/operators';
import {Task} from '../model/task';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {List} from '../model/list';
import {Project} from '../model/project';
import {Group} from '../model/group';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
    TASK: Task[] = [
        new Task('629JGST202', 'Demmarrer', '27 Aout 2019'),
        new Task('629JGST20S', 'Arreter', '25 Aout 2019'),
        new Task('629JGST20S', 'Fusionner', '26 Aout 2019'),
    ];
    project: Project  = new Project('629JGST20S', 'Dev', [
        new Group('629JGST202', 'Global Groups', 'Groupe global ou se trouve tous les employés'),
        new Group('629JGST20S', 'Dev', 'Groupe de développeur'),
    ]);
    LIST: List[] = [
        new List('629JGST202', 'Demmarrer', this.TASK ),
        new List('629JGST20G', 'Fin', this.TASK ),
    ];
    private taskUrl = 'api/task';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    constructor(private http: HttpClient) { }

    getTasks(projectKey: String): Task[] {
        return this.TASK;
        /*return this.http.get<Task[]>(this.taskUrl).pipe(
            tap( (task: Task[])_ => this.log(`fetched task`)),
            catchError(this.handleError<any>('error'))
        );*/
    }

    getLists(projectKey: String): List[] {
        return this.LIST;
        /*return this.http.get<Task[]>(this.taskUrl).pipe(
            tap( (task: Task[])_ => this.log(`fetched task`)),
            catchError(this.handleError<any>('error'))
        );*/
    }
    addList(list: List, projectKey: String): Observable<List> {
        return this.http.post<List>(this.taskUrl, {list: list, projectKey: projectKey}, this.httpOptions).pipe(
            tap( (_list: List) => this.log(`fetched task id=${_list.key}`)),
            catchError(this.handleError<List>('error'))
        );
    }
    add(task: Task, listKey: String): Observable<Task> {
        return this.http.post<Task>(this.taskUrl, {task: task, list: List}, this.httpOptions).pipe(
            tap( (_task: Task) => this.log(`fetched task id=${_task.key}`)),
            catchError(this.handleError<Task>('error'))
        );
    }
    getTask(): Observable<Task> {
        return this.http.get<Task>(this.taskUrl).pipe(
            tap(_ => this.log(`fetched hero id`)),
            catchError(this.handleError<any>('error'))
        );
    }
    deleteTask(task: Task): Observable<Task> {
        return this.http.delete<Task>('', this.httpOptions).pipe(
            tap(_ => this.log(`task deleted`)),
            catchError(this.handleError<any>('error'))
        );
    }
    deleteList(list: List): Observable<List> {
        return this.http.delete<List>('', this.httpOptions).pipe(
            tap(_ => this.log(`task deleted`)),
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
