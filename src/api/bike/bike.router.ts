import express from 'express';
import { validate } from '../../utils/validation-middleware';
import { isAuthenticated, authorizeRoles } from '../../utils/auth/authenticated-middleware';
import { UserRole } from '../user/user.entity';
import {
  createBike,
  getAllBikes,
  getBikeById,
  updateBike,
  deleteBike,
  getBikeInventoryCount, getBikesByLocation,
} from './bike.controller';
import { CreateBikeDTO, UpdateBikeDTO, BikeQueryDTO } from './bike.dto';

const router = express.Router();

router.post(
  '/',
  isAuthenticated,
  authorizeRoles(UserRole.OPERATOR, UserRole.ADMIN),
  validate(CreateBikeDTO, 'body'),
  createBike,
);

router.get(
  '/',
  isAuthenticated,
  authorizeRoles(UserRole.OPERATOR),
  validate(BikeQueryDTO, 'query'),
  getAllBikes,
);

router.get(
    '/location/:locationId',
    getBikesByLocation,
);

router.get(
  '/inventory/count',
  isAuthenticated,
  authorizeRoles(UserRole.OPERATOR),
  getBikeInventoryCount,
);

router.get(
  '/:id',
  isAuthenticated,
  authorizeRoles(UserRole.OPERATOR),
  getBikeById,
);

router.put(
  '/:id',
  isAuthenticated,
  authorizeRoles(UserRole.OPERATOR),
  validate(UpdateBikeDTO, 'body'),
  updateBike,
);

router.delete(
  '/:id',
  isAuthenticated,
  authorizeRoles(UserRole.OPERATOR),
  deleteBike,
);


export default router;