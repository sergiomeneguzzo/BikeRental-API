import { NextFunction, Response, Request } from 'express';
import { TypedRequest } from '../../utils/typed-request';
import userService from '../user/user.service';
import { AddUserDTO } from './auth.dto';
import { omit, pick } from 'lodash';
import { UserExistsError } from '../../errors/user-exists';
import passport from 'passport';
import * as jwt from 'jsonwebtoken';
import { sendConfirmationEmail } from '../services/email.service';
import logService from '../services/logs/log.service';
const JWT_SECRET = 'my_jwt_secret';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authMiddleware = passport.authenticate('local', (err, user, info) => {
      if (err) {
        next(err);
        logService.add('Login Error', false);
        return;
      }

      if (!user) {
        logService.add(`Login - ${info.message}`, false);
        res.status(401);
        res.json({
          error: 'LoginError',
          message: info.message,
        });
        return;
      }

      if (!user.isConfirmed) {
        logService.add(`Login - Email not Confirmed`, false);
        res.status(401);
        res.json({
          error: 'LoginError',
          message: 'email not confirmed',
        });
        return;
      }

      const token = jwt.sign(user, JWT_SECRET, { expiresIn: '10m' });
      logService.add('Login', true);

      res.status(200);
      res.json({
        user,
        token,
      });
    });

    authMiddleware(req, res, next);
  } catch (e) {
    next(e);
  }
};

export const add = async (
  req: TypedRequest<AddUserDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, confirmPassword, ...userData } = req.body;

    const userDto = new AddUserDTO();
    Object.assign(userDto, { ...userData, password, confirmPassword });

    userDto.validatePasswordMatch();

    const user = {
      ...omit(userDto, 'password', 'confirmPassword'),
      isConfirmed: true,
      picture: userDto.picture,
    };

    const credentials = pick(userDto, 'username', 'password');

    const newUser = await userService.add(user, credentials);

    // sendConfirmationEmail(newUser.username, newUser.id!);

    res.send(newUser);
  } catch (e) {
    if (e instanceof UserExistsError) {
      res.status(400).json({
        error: 'UserExistsError',
        message: 'username already in use. Please try a different one.',
      });
    } else if (
      e instanceof Error &&
      e.message === 'Password and confirm password do not match.'
    ) {
      res.status(400).json({
        error: 'PasswordMismatch',
        message: e.message,
      });
    } else {
      next(e);
    }
  }
};
