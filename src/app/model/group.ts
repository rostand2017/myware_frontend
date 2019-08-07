export class Group {
    private _key: String;
    private _name: string;
    private _description: string;

    constructor(key: String, name: string, description: string) {
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

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }
}
