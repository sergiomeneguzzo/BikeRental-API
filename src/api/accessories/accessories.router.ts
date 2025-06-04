import { Router } from 'express';
import { AccessoryController } from './accessories.controller';

const controller = new AccessoryController();
const router = Router();

router.post('/', controller.create);
router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
