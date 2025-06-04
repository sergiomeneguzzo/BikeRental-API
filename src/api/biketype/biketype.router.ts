import { Router } from 'express';
import { validate } from '../../utils/validation-middleware';
import { CreateBikeTypeDto } from './biketype.dto';
import { BikeTypeController } from './biketype.controller';

const router = Router();
const controller = new BikeTypeController();

router.post('/', validate(CreateBikeTypeDto), controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
