import {SafeUrl} from '@angular/platform-browser';

export class User {
    private _keyy: String = '';
    private _name: String = '';
    private _subname: String = '';
    private _email: String = '';
    private _password: String = '';
    private _tel: String = '';
    private _fonction: String = '';
    private _type: String = '';
    private _image: String = '';
    private _imageUrl: SafeUrl;

    constructor(keyy: String, name: String, subname: String, email: String, password: String,
                tel: String, fonction: String, type: String, image: String) {
        this._keyy = keyy;
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

    get imageUrl(): SafeUrl {
        return this._imageUrl;
    }

    set imageUrl(value: SafeUrl) {
        this._imageUrl = value;
    }
}
