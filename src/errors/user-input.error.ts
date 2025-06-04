import { BaseError } from './base.error';

export class UserInputError extends BaseError {
  constructor(message: string = 'Invalid user input.') {
    // Generalmente 400 Bad Request o 422 Unprocessable Entity
    super('UserInputError', 400, message);
  }
}