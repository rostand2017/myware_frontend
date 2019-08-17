import { Injectable } from '@angular/core';
import {catchError, tap} from 'rxjs/internal/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Project} from '../model/project';
import {Group} from '../model/group';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
    PROJECT: Project[] = [
        new Project('629JGST202', 'Projects', [
            new Group('629JGST202', 'Global Groups', 'Groupe global ou se trouve tous les employés'),
            new Group('629JGST20G', 'Marketing', 'Groupe de marketing'),
            new Group('629JGST20S', 'Dev', 'Groupe de développeur'),
        ]),
        new Project('629JGST20S', 'Marketing', [
            new Group('629JGST20G', 'Marketing', 'Groupe de marketing'),
            new Group('629JGST20S', 'Dev', 'Groupe de développeur'),
        ]),
        new Project('629JGST20S', 'Dev', [
            new Group('629JGST202', 'Global Groups', 'Groupe global ou se trouve tous les employés'),
            new Group('629JGST20S', 'Dev', 'Groupe de développeur'),
        ]),
    ];
    private projectUrl = 'api/project';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    constructor(private http: HttpClient) { }

    getProjects(): Project[] {
        return this.PROJECT;
        /*return this.http.get<Project[]>(this.projectUrl).pipe(
            tap( (project: Project[])_ => this.log(`fetched project`)),
            catchError(this.handleError<any>('error'))
        );*/
    }
    add(project: Project): Observable<Project> {
        return this.http.post<Project>(this.projectUrl, project, this.httpOptions).pipe(
            tap( (_project: Project) => this.log(`fetched project id=${_project.keyy}`)),
            catchError(this.handleError<Project>('error'))
        );
    }
    getProject(): Observable<Project> {
        return this.http.get<Project>(this.projectUrl).pipe(
            tap(_ => this.log(`fetched hero id`)),
            catchError(this.handleError<any>('error'))
        );
    }
    delete(project: Project | number): Observable<Project> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.delete<Project>('', httpOptions).pipe(
            tap(_ => this.log(`project deleted`)),
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
