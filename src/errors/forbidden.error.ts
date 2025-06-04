import { BaseError } from './base.error';

export class ForbiddenError extends BaseError {
  constructor(message: string = 'Access to this resource is forbidden.') {
    super('ForbiddenError', 403, message);
  }
}