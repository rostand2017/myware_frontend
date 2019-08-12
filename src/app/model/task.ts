import {List} from './list';
import {User} from './user';

export class Task {
    private _key: String;
    private _description: String;
    private _endDate: String;
    private _isCompleted: String;
    private _list: List;
    private _users: User[] = [];

    constructor(key: String, description: String, endDate: String) {
        this._key = key;
        this._description = description;
        this._endDate = endDate;
    }

    get users(): User[] {
        return this._users;
    }

    set users(value: User[]) {
        this._users = value;
    }

    get list(): List {
        return this._list;
    }

    set list(value: List) {
        this._list = value;
    }

    get key(): String {
        return this._key;
    }

    set key(value: String) {
        this._key = value;
    }

    get description(): String {
        return this._description;
    }

    set description(value: String) {
        this._description = value;
    }

    get endDate(): String {
        return this._endDate;
    }

    set endDate(value: String) {
        this._endDate = value;
    }

    get isCompleted(): String {
        return this._isCompleted;
    }

    set isCompleted(value: String) {
        this._isCompleted = value;
    }
}