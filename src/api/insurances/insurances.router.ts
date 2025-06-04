import { Router } from 'express';
import { InsuranceController } from './insurances.controller';
import { authorizeRoles } from '../../utils/auth/authenticated-middleware';
import { UserRole } from '../user/user.entity';

const router = Router();
const controller = new InsuranceController();

router.post('/', authorizeRoles(UserRole.OPERATOR, UserRole.ADMIN), controller.create);
router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.put('/:id', authorizeRoles(UserRole.OPERATOR, UserRole.ADMIN), controller.update);
router.delete('/:id', authorizeRoles(UserRole.OPERATOR, UserRole.ADMIN), controller.delete);

export default router;
