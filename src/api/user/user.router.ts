import { Router } from 'express';
import { confirmEmail, me, updatePassword } from './user.controller';
import { isAuthenticated } from '../../utils/auth/authenticated-middleware';

const router = Router();

router.get('/me', isAuthenticated, me);
router.post('/email-confirmation', (req, res, next) => {
  confirmEmail(req, res, next).catch(next);
});
router.patch('/updatePassword', isAuthenticated, updatePassword);
export default router;
