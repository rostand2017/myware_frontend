export class Message {
    private _message: String;
    private _type: String;
    private _link: String;

    constructor(message: String, type: String, link: String) {
        this._message = message;
        this._type = type;
        this._link = link;
    }

    get message(): String {
        return this._message;
    }

    set message(value: String) {
        this._message = value;
    }

    get type(): String {
        return this._type;
    }

    set type(value: String) {
        this._type = value;
    }

    get link(): String {
        return this._link;
    }

    set link(value: String) {
        this._link = value;
    }
}
