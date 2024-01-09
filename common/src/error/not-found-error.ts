import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
    statusCode: number = 404;

    constructor(message: string = "Page not found") {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors(): { message: string; field?: string | undefined; }[] {
        return [{
            message: "Page Not found"
        }];
    }
}