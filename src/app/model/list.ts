import {Task} from './task';

export class List {
    private _keyy: String = '';
    private _name: String = '';
    private _task: Task[] = [];

    constructor(keyy: String, name: String, task: Task[]) {
        this._keyy = keyy;
        this._name = name;
        this._task = task;
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

    get task(): Task[] {
        return this._task;
    }

    set task(value: Task[]) {
        this._task = value;
    }
}
