import { Request, Response, NextFunction } from "express";

export class PasswordError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PasswordError";
    }
}

export class SamePasswordError extends PasswordError {
    constructor() {
        super("The new password must be different from the current one.");
    }
}

export class PasswordMismatchError extends PasswordError {
    constructor() {
        super("The confirmation password does not match.");
    }
}

export const passwordHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof PasswordError) {
        res.status(400); // Bad request for password-related errors
        res.json({
            error: err.name,
            message: err.message,
        });
    } else {
        next(err); // Pass to the default error handler for other types of errors
    }
};