import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/internal/operators';
import {Project} from '../model/project';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Message} from '../model/message';
import {ReceiveMessage} from '../model/receive-message';
import {File} from '../model/file';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
    private messageUrl = 'api/message';
    private MESSAGE = [
        new ReceiveMessage('Salut frère, comment tu vas?', 'message', '', 'Fotso',
            'Ross', '25638SJ1', '22:00', '22 Aout 2019'),
        new ReceiveMessage('ça va et toi?', 'message', '', 'Fotso',
            'Ssor', '25638SJ2', '22:03', '22 Aout 2019'),
        new ReceiveMessage('Image envoyé par ', 'image', '/image/jslsp.png', 'Fotso',
            'Ross', '25638SJ1', '22:04', '22 Aout 2019'),
        new ReceiveMessage('fichier envoyé par ', 'file', '/file/slls.pdf', 'Fotso',
            'Ross', '25638SJ1', '22:40', '22 Aout 2019'),
        new ReceiveMessage('Salut frère, comment tu vas?', 'message', '', 'Fotso',
            'Ross', '25638SJ2', '22:50', '22 Aout 2019'),
        new ReceiveMessage('Salut frère, comment tu vas?', 'message', '', 'Fotso',
            'Ross', '25638SJ1', '22:50', '23 Aout 2019'),
        new ReceiveMessage('Salut frère, comment tu vas?', 'message', '', 'Fotso',
            'Ross', '25638SJ1', '22:50', '23 Aout 2019'),
    ];
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) { }

    getMessages(limit: number, offset: number, discussionKey: String): ReceiveMessage[] {
        return this.MESSAGE;
        /*return this.http.get<ReceiveMessage[]>(this.projectUrl).pipe(
            tap( (project: Project[])_ => this.log(`fetched project`)),
            catchError(this.handleError<any>('error'))
        );*/
    }
    loadImage(imageUrl): Observable<any> {
        return this.http.get<any>(imageUrl);
    }
    sendMessage(message: Message, senderKey: String, discussionKey: String): Observable<ReceiveMessage> {
        return this.http.post<any>(this.messageUrl, {message: message, senderKey: senderKey, discussionKey: discussionKey},
            this.httpOptions);
    }
    addFile(file: any, discussionKey: String): Observable<File> {
        return this.http.post<any>(this.messageUrl, {files: file, discussionKey: discussionKey}, this.httpOptions).pipe(
            tap( (_file: File) => this.log(`fetched file id=${_file.keyy}`)),
            catchError(this.handleError<File>('error'))
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
