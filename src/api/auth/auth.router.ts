import express from 'express';
import { validate } from '../../utils/validation-middleware';
import { AddUserDTO, LoginDTO } from './auth.dto';
import { add, login } from './auth.controller';
import { list as userList } from '../user/user.controller';

const router = express.Router();

router.post('/login', validate(LoginDTO), login);
router.post('/register', validate(AddUserDTO, 'body'), add);
router.get('/users', userList);

export default router;
