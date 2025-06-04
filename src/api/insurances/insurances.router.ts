import { Router } from 'express';
import { InsuranceController } from './insurances.controller';

const router = Router();
const controller = new InsuranceController();

router.post('/', controller.create);
router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
