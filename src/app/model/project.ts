import {Group} from './group';

export class Project {
    private _key: String = '';
    private _name: String = '';
    private _group: Group[] = [];

    constructor(key: String, name: String, group: Group[]) {
        this._key = key;
        this._name = name;
        this._group = group;
    }

    get group(): Group[] {
        return this._group;
    }

    set group(value: Group[]) {
        this._group = value;
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
}