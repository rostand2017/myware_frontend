export class User {
    private _key: String = '';
    private _name: String = '';
    private _subname: String = '';
    private _email: String = '';
    private _password: String = '';
    private _tel: String = '';
    private _fonction: String = '';
    private _type: String = '';
    private _image: String = '';

    constructor(key: String, name: String, subname: String, email: String, password: String,
                tel: String, fonction: String, type: String, image: String) {
        this._key = key;
        this._name = name;
        this._subname = subname;
        this._email = email;
        this._tel = tel;
        this._fonction = fonction;
        this._type = type;
        this._image = image;
        this._password = password;
    }

    get password(): String {
        return this._password;
    }

    set password(value: String) {
        this._password = value;
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

    get subname(): String {
        return this._subname;
    }

    set subname(value: String) {
        this._subname = value;
    }

    get email(): String {
        return this._email;
    }

    set email(value: String) {
        this._email = value;
    }

    get tel(): String {
        return this._tel;
    }

    set tel(value: String) {
        this._tel = value;
    }

    get fonction(): String {
        return this._fonction;
    }

    set fonction(value: String) {
        this._fonction = value;
    }

    get type(): String {
        return this._type;
    }

    set type(value: String) {
        this._type = value;
    }

    get image(): String {
        return this._image;
    }

    set image(value: String) {
        this._image = value;
    }
}
