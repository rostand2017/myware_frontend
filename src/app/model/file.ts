export class File {
    private _key: String;
    private _name: String;
    private _link: String;
    private _extension: String;
    private _size: number;
    private _createdAt: String;

    constructor(key: String, name: String, link: String, extension: String, size: number, createdAt: String) {
        this._key = key;
        this._name = name;
        this._link = link;
        this._extension = extension;
        this._size = size;
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

    get link(): String {
        return this._link;
    }

    set link(value: String) {
        this._link = value;
    }

    get extension(): String {
        return this._extension;
    }

    set extension(value: String) {
        this._extension = value;
    }

    get size(): number {
        return this._size;
    }

    set size(value: number) {
        this._size = value;
    }
}
