import { Router } from 'express';
import { ReservationController } from './booking.controller';
import {
  authorizeRoles,
  isAuthenticated,
} from '../../utils/auth/authenticated-middleware';
import { UserRole } from '../user/user.entity';

const router = Router();
const controller = new ReservationController();

router.post('/', controller.create);

router.post('/confirm', isAuthenticated, controller.confirm);

router.get('/', isAuthenticated, controller.getAll);

router.put('/cancel/:id', isAuthenticated, controller.cancel);

router.put('/:id', isAuthenticated, controller.update);

export default router;
