import { Injectable } from '@angular/core';
import {catchError, tap} from 'rxjs/internal/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Project} from '../model/project';
import {Group} from '../model/group';
import {Constant} from '../model/constant';

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

    getProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(Constant.BASE_URL + 'project/all');
    }
    add(project: Project): Observable<any> {
        return this.http.post<any>(Constant.BASE_URL + 'project/edit', project, this.httpOptions).pipe(
            tap( (_project: Project) => this.log(`fetched project id=${_project.keyy}`)),
            catchError(this.handleError<Project>('error'))
        );
    }
    deleteProject(project: Project): Observable<any> {
        return this.http.post<any>(Constant.BASE_URL + 'project/remove', {keyy: project.keyy}, this.httpOptions);
    }
    deleteGroupProject(projectKey: String, groupKey: String): Observable<any> {
        return this.http.post<any>(Constant.BASE_URL + 'project/removegroup',
            {projectKey: projectKey, groupKey: groupKey}, this.httpOptions);
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
