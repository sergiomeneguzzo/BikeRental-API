export class BaseError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean; // Per distinguere errori operazionali da errori di programmazione

  constructor(name: string, statusCode: number, message: string, isOperational: boolean = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // Ripristina il prototipo corretto

    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor); // Cattura lo stack trace
  }
}