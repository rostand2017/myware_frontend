export class Group {
    private _keyy: String = '';
    private _name: String = '';
    private _description: String = '';
    private _unread: number;

    constructor(keyy: String, name: String, description: String) {
        this._keyy = keyy;
        this._name = name;
        this._description = description;
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

    get description(): String {
        return this._description;
    }

    set description(value: String) {
        this._description = value;
    }

    get unread(): number {
        return this._unread;
    }

    set unread(value: number) {
        this._unread = value;
    }
}
