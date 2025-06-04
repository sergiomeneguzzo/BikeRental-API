import { Router } from 'express';
import { validate } from '../../utils/validation-middleware';
import { CreateBikeTypeDto } from './biketype.dto';
import { BikeTypeController } from './biketype.controller';
import { authorizeRoles } from '../../utils/auth/authenticated-middleware';
import { UserRole } from '../user/user.entity';

const router = Router();
const controller = new BikeTypeController();

router.post('/', validate(CreateBikeTypeDto), authorizeRoles(UserRole.OPERATOR, UserRole.ADMIN), controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', authorizeRoles(UserRole.OPERATOR, UserRole.ADMIN),controller.update);
router.delete('/:id', authorizeRoles(UserRole.OPERATOR, UserRole.ADMIN), controller.delete);

export default router;
