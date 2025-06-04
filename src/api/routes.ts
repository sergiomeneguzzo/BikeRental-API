import { Router } from 'express';
import userRouter from './user/user.router';
import authRouter from './auth/auth.router';
import locationRouter from './location/location.router';
import bikeTypeRouter from './biketype/biketype.router';
import accessoriesRouter from './accessories/accessories.router';
import insurancesRouter from './insurances/insurances.router';
import bikeRouter from './bike/bike.router';

const router = Router();

router.use('/users', userRouter);
router.use('/locations', locationRouter);
router.use('/biketypes', bikeTypeRouter);
router.use('/bikes', bikeRouter);
router.use('/accessories', accessoriesRouter);
router.use('/insurances', insurancesRouter);
router.use(authRouter);

export default router;
