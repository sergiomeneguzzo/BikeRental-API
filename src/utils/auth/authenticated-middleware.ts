import passport from "passport";
import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../../api/user/user.entity';
import { ForbiddenError } from '../../errors/forbidden.error';

export const isAuthenticated = passport.authenticate('jwt', {session: false});

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenError('User not authenticated.'));
    }
    const userRole = (req.user as any).role;
    if (!allowedRoles.includes(userRole)) {
      return next(new ForbiddenError(`Role ${userRole} is not authorized for this resource.`));
    }
    next();
  };
};