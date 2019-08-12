export class Group {
    private _key: String = '';
    private _name: String = '';
    private _description: String = '';

    constructor(key: String, name: String, description: String) {
        this._key = key;
        this._name = name;
        this._description = description;
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

    get description(): String {
        return this._description;
    }

    set description(value: String) {
        this._description = value;
    }
}
