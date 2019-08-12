import {Task} from './task';

export class List {
    private _key: String = '';
    private _name: String = '';
    private _task: Task[] = [];

    constructor(key: String, name: String, task: Task[]) {
        this._key = key;
        this._name = name;
        this._task = task;
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

    get task(): Task[] {
        return this._task;
    }

    set task(value: Task[]) {
        this._task = value;
    }
}
