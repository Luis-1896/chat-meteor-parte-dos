export class ResponseMessage {

    constructor() {
        this._isStatus = false;
        this._message = null;
        this._description = null;
        this._data = null;
    }

    create(isStatus, message, description = null, data = null) {
        this._isStatus = isStatus;
        this._message = message;
        this._description = description;
        this._data = data;
    }

    set message(message) {
        this._message = message;
    }

    get message() {
        return this._message;
    }

    set isStatus(status) {
        this._isStatus = status;
    }

    get isStatus() {
        return this._isStatus;
    }

    set description(description) {
        this._description = description;
    }

    get description() {
        return this._description;
    }

    set data(data) {
        this._data = data;
    }

    get data() {
        return this._data;
    }

}