import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
    statusCode = 400;
    constructor(public errors: ValidationError[]) {
        super("Invalid request parameter");
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(e => {
            if (e.type === 'field') {
                return {
                    message: e.msg,
                    field: e.path
                };
            }
            return { message: e.msg };
        });
    }
}