"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(name, message) {
        super(message);
        this.name = name;
        this.name = name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
