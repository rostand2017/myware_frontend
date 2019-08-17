import {Group} from './group';

export class Project {
    private _keyy: String = '';
    private _name: String = '';
    private _group: Group[] = [];

    constructor(keyy: String, name: String, group: Group[]) {
        this._keyy = keyy;
        this._name = name;
        this._group = group;
    }

    get group(): Group[] {
        return this._group;
    }

    set group(value: Group[]) {
        this._group = value;
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
}