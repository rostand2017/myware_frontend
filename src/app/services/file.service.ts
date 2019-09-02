import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/internal/operators';
import {Folder} from '../model/folder';
import {File} from '../model/file';
import {Constant} from '../model/constant';
import {User} from '../model/user';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    private fileUrl = 'api/file';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    constructor(private http: HttpClient) { }

    getFiles(folderKey: String): Observable<File[]> {
        return this.http.post<File[]>(Constant.BASE_URL + 'file/all', {keyy: folderKey}, this.httpOptions);
    }
    downloadFile(link: String): Observable<Blob> {
        return this.http.get<Blob>(Constant.BASE_URL + 'file/down/' + link, {responseType: 'blob' as 'json'});
    }
    downloadThumbnail(link: String): Observable<Blob> {
        return this.http.get<Blob>(Constant.BASE_URL + 'file/thumbnail/' + link, {responseType: 'blob' as 'json'});
    }
    getFolders(folderKey: String): Observable<Folder[]> {
        return this.http.post<Folder[]>(Constant.BASE_URL + 'folder/all', {keyy: folderKey}, this.httpOptions);
    }
    shareFile(data: any): Observable<any> {
        return this.http.post<any>(Constant.BASE_URL + 'file/share', data, this.httpOptions);
    }
    shareFolder(data: any): Observable<any> {
        return this.http.post<any>(Constant.BASE_URL + 'folder/share', data, this.httpOptions);
    }
    addFile(data: FormData): Observable<any> {
        if (data) {
            return this.http.post<File[]>(Constant.BASE_URL + 'file/edit', data);
        } else {
            return this.http.post<any>(Constant.BASE_URL + 'file/edit', data, this.httpOptions);
        }
    }
    addFolder(folder: Folder, folderKey: String): Observable<any> {
        return this.http.post<Folder>(Constant.BASE_URL + 'folder/edit',
            {keyy: folder.keyy, name: folder.name, folderKey: folderKey}, this.httpOptions);
    }
    deleteFile(fileKey: String): Observable<any> {
        return this.http.post<any>(Constant.BASE_URL + 'file/remove', {keyy: fileKey}, this.httpOptions);
    }
    deleteFolder(folderKey: String): Observable<any> {
        return this.http.post<any>(Constant.BASE_URL + 'folder/remove', {keyy: folderKey}, this.httpOptions);
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
