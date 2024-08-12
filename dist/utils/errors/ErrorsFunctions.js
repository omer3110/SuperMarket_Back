"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = getErrorMessage;
exports.getErrorName = getErrorName;
exports.getErrorData = getErrorData;
const CustomError_1 = require("./CustomError");
function getErrorMessage(error) {
    if (error instanceof Error || error instanceof CustomError_1.CustomError) {
        return error.message;
    }
    else if (error !== null &&
        typeof error === "object" &&
        "message" in error) {
        return error.message;
    }
    else if (typeof error === "string") {
        return error;
    }
    else {
        return "An unknown error occurred";
    }
}
function getErrorName(error) {
    if (error instanceof Error || error instanceof CustomError_1.CustomError) {
        return error.name;
    }
    else if (error !== null && typeof error === "object" && "name" in error) {
        return error.name;
    }
    else if (typeof error === "string") {
        return error;
    }
    else {
        return "Unknown error name";
    }
}
function getErrorData(error) {
    const errorName = getErrorName(error);
    const errorMessage = getErrorMessage(error);
    return { errorName, errorMessage };
}
