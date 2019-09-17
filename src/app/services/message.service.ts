import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ReceiveMessage} from '../model/receive-message';
import {Constant} from '../model/constant';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    constructor(private http: HttpClient) { }

    getMessages(offset: number, discussionKey: String): Observable<ReceiveMessage[]> {
        return this.http.post<ReceiveMessage[]>(Constant.BASE_URL + 'message/' + offset,
            {offset: offset, keyy: discussionKey}, this.httpOptions);
    }

    getNewMessages(lastDate: String, discussionKey: String): Observable<ReceiveMessage[]> {
        return this.http.post<ReceiveMessage[]>(Constant.BASE_URL + 'message/new' ,
            {lastDate: lastDate, keyy: discussionKey}, this.httpOptions);
    }

    getAllNewMessages(lastDate: number, type: String): Observable<ReceiveMessage[]> {
        return this.http.post<ReceiveMessage[]>(Constant.BASE_URL + 'message/allnew' ,
            {lastDate: lastDate, type: type}, this.httpOptions);
    }

    getCountUnreadMessages(): Observable<any> {
        return this.http.get<any>(Constant.BASE_URL + 'message/countunread', this.httpOptions);
    }

    getDiscussionType(discussionKey: String): Observable<any> {
        return this.http.post<any>(Constant.BASE_URL + 'discussionType', {keyy: discussionKey}, this.httpOptions);
    }

    sendMessage(message: String, discussionKey: String): Observable<any> {
        return this.http.post<any>(Constant.BASE_URL + 'message/send', {message: message, keyy: discussionKey},
            this.httpOptions);
    }
    addFile(data: FormData): Observable<any> {
        return this.http.post<any>(Constant.BASE_URL + 'message/file', data);
    }
}
