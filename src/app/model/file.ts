import {SafeUrl} from '@angular/platform-browser';

export class File {
    private _keyy: String;
    private _name: String;
    private _link: String;
    private _thumbnail: SafeUrl;
    private _extension: String;
    private _size: number;
    private _createdAt: String;

    constructor(keyy: String, name: String, link: String, extension: String, size: number, createdAt: String) {
        this._keyy = keyy;
        this._name = name;
        this._link = link;
        this._extension = extension;
        this._size = size;
        this._createdAt = createdAt;
    }

    get keyy(): String {
        return this._keyy;
    }

    set keyy(value: String) {
        this._keyy = value;
    }

    get name(): String {
        return this._name;
    }

    set name(value: String) {
        this._name = value;
    }

    get link(): String {
        return this._link;
    }

    set link(value: String) {
        this._link = value;
    }

    get thumbnail(): SafeUrl {
        return this._thumbnail;
    }

    set thumbnail(value: SafeUrl) {
        this._thumbnail = value;
    }

    get extension(): String {
        return this._extension;
    }

    set extension(value: String) {
        this._extension = value;
    }

    get size(): number {
        return this._size;
    }

    set size(value: number) {
        this._size = value;
    }
}
