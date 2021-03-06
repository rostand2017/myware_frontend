import {List} from './list';
import {User} from './user';

export class Task {
    private _keyy: String;
    private _description: String;
    private _endDate: String;
    private _isCompleted: boolean;
    private _list: List;
    private _users: User[] = [];

    constructor(keyy: String, description: String, endDate: String, isCompleted: boolean) {
        this._keyy = keyy;
        this._description = description;
        this._endDate = endDate;
        this._isCompleted = isCompleted;
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

    get keyy(): String {
        return this._keyy;
    }

    set keyy(value: String) {
        this._keyy = value;
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

    get isCompleted(): boolean {
        return this._isCompleted;
    }

    set isCompleted(value: boolean) {
        this._isCompleted = value;
    }
}