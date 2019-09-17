import {SafeUrl} from '@angular/platform-browser';

export class ReceiveMessage {
    private _message: String;
    private _type: String;
    private _link: String;
    private _senderName: String;
    private _senderSubname: String;
    private _senderKey: String;
    private _hour: String;
    private _date: String;
    private _dateToShow: Date;
    private _sent = true;
    private _thumbnail: SafeUrl;

    constructor(message: String, type: String, link: String, senderName: String,
                senderSubname: String, senderKey: String, hour: String, date: String) {
        this._message = message;
        this._type = type;
        this._link = link;
        this._senderName = senderName;
        this._senderSubname = senderSubname;
        this._senderKey = senderKey;
        this._hour = hour;
        this._date = date;
    }

    get message(): String {
        return this._message;
    }

    set message(value: String) {
        this._message = value;
    }

    get type(): String {
        return this._type;
    }

    set type(value: String) {
        this._type = value;
    }

    get link(): String {
        return this._link;
    }

    set link(value: String) {
        this._link = value;
    }

    get senderName(): String {
        return this._senderName;
    }

    set senderName(value: String) {
        this._senderName = value;
    }

    get senderSubname(): String {
        return this._senderSubname;
    }

    set senderSubname(value: String) {
        this._senderSubname = value;
    }

    get senderKey(): String {
        return this._senderKey;
    }

    set senderKey(value: String) {
        this._senderKey = value;
    }

    get hour(): String {
        return this._hour;
    }

    set hour(value: String) {
        this._hour = value;
    }

    get date(): String {
        return this._date;
    }

    set date(value: String) {
        this._date = value;
    }

    get dateToShow(): Date {
        return this._dateToShow;
    }

    set dateToShow(value: Date) {
        this._dateToShow = value;
    }

    get sent(): boolean {
        return this._sent;
    }

    set sent(value: boolean) {
        this._sent = value;
    }

    get thumbnail(): SafeUrl {
        return this._thumbnail;
    }

    set thumbnail(value: SafeUrl) {
        this._thumbnail = value;
    }
}
