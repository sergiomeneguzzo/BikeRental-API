import { Router } from 'express';
import userRouter from './user/user.router';
import authRouter from './auth/auth.router';
import locationRouter from './location/location.router';
import bikeTypeRouter from './biketype/biketype.router';
import accessoriesRouter from './accessories/accessories.router';

const router = Router();

router.use('/users', userRouter);
router.use('/locations', locationRouter);
router.use('/biketypes', bikeTypeRouter);
router.use('/accessories', accessoriesRouter);
router.use(authRouter);

export default router;
