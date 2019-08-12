import {File} from './file';

export class Folder {
    private _key: String = '';
    private _name: String = '';
    private _folders: Folder[] = [];
    private _files: File[] = [];
    private _createdAt: String;

    constructor(key: String, name: String, folders: Folder[], files: File[], createdAt: String) {
        this._key = key;
        this._name = name;
        this._folders = folders;
        this._files = files;
        this._createdAt = createdAt;
    }

    get key(): String {
        return this._key;
    }

    set key(value: String) {
        this._key = value;
    }

    get name(): String {
        return this._name;
    }

    set name(value: String) {
        this._name = value;
    }

    get folders(): Folder[] {
        return this._folders;
    }

    set folders(value: Folder[]) {
        this._folders = value;
    }

    get files(): File[] {
        return this._files;
    }

    set files(value: File[]) {
        this._files = value;
    }

    get createdAt(): String {
        return this._createdAt;
    }

    set createdAt(value: String) {
        this._createdAt = value;
    }
}
