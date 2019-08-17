import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/internal/operators';
import {Folder} from '../model/folder';
import {File} from '../model/file';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    FILE: File[] = [
        new File('629JGST202', 'Sxl', '/ssd/ke.jpg', 'jpg', 10, '22 Mai 2019' ),
        new File('629JGST203', 'Sxl', '/ssd/ke.jpg', 'jpg', 10, '22 Mai 2019' ),
        new File('629JGST204', 'Sxl', '/ssd/ke.jpg', 'jpg', 10, '22 Mai 2019' ),
    ];
    FOLDER: Folder[] = [
        new Folder('629JGST20T', 'Sex', [ new Folder('2SD201L', 'Sex1', [], [], '22 aout 2019') ], [], ''),
        new Folder('629JGST20Z', 'Manger', [], [
            new File('629JGST204', 'Sxl', '/ssd/ke.jpg', 'jpg', 10, '22 Mai 2019' )
        ], '22 juin 2019'),
        new Folder('629JGST20E', 'Fusionner', [], this.FILE, '22 Juin 2002'),
    ];
    private fileUrl = 'api/file';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    constructor(private http: HttpClient) { }

    getFilesAndFolders(folderKey: String): [Folder[], File[]] {
        return [this.FOLDER, this.FILE];
        /*return this.http.get<[File[], Folder[]]>(this.fileUrl).pipe(
            tap( (files: [File[], Folder[]])_ => this.log(`fetched file`)),
            catchError(this.handleError<any>('error'))
        );*/
    }
    shareFile(data: any, fileKey: String): Observable<any> {
        return this.http.post<any>(this.fileUrl, {keyy: fileKey, data: data}, this.httpOptions).pipe(
            tap( (_data: any) => this.log(`shared file`)),
            catchError(this.handleError<any>('error'))
        );
    }
    shareFolder(data: any, folderKey: String): Observable<any> {
        return this.http.post<any>(this.fileUrl, {keyy: folderKey, data: data}, this.httpOptions).pipe(
            tap( (_data: any) => this.log(`shared folder`)),
            catchError(this.handleError<any>('error'))
        );
    }
    addFile(file: any, folderKey: String): Observable<File> {
        return this.http.post<any>(this.fileUrl, {files: file, folderKey: folderKey}, this.httpOptions).pipe(
            tap( (_file: File) => this.log(`fetched file id=${_file.keyy}`)),
            catchError(this.handleError<File>('error'))
        );
    }
    addFolder(folder: Folder, folderKey: String): Observable<Folder> {
        return this.http.post<Folder>(this.fileUrl, {folder: folder, folderKey: folderKey}, this.httpOptions).pipe(
            tap( (_folder: Folder) => this.log(`fetched file id=${_folder.keyy}`)),
            catchError(this.handleError<Folder>('error'))
        );
    }
    deleteFile(file: File): Observable<File> {
        return this.http.delete<File>('', this.httpOptions).pipe(
            tap(_ => this.log(`file deleted`)),
            catchError(this.handleError<any>('error'))
        );
    }
    deleteFolder(folder: Folder): Observable<Folder> {
        return this.http.delete<Folder>('', this.httpOptions).pipe(
            tap(_ => this.log(`file deleted`)),
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
