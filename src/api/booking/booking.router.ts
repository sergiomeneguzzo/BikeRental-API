import { Router } from 'express';
import { ReservationController } from './booking.controller';
import { isAuthenticated } from '../../utils/auth/authenticated-middleware';

const router = Router();
const controller = new ReservationController();

router.post('/', controller.create);

router.post('/confirm', isAuthenticated, controller.confirm); //middleware

router.get('/', isAuthenticated, controller.getAll); //middleware

router.delete('/:id', isAuthenticated, controller.cancel); //middleware

export default router;
