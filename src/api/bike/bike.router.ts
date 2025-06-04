import express from 'express';
import { validate } from '../../utils/validation-middleware'; // Il tuo middleware di validazione
import { isAuthenticated, authorizeRoles } from '../../utils/auth/authenticated-middleware';
import { UserRole } from '../user/user.entity'; // Assumendo che UserRole sia definito qui o in utils/constants
import {
  createBike,
  getAllBikes,
  getBikeById,
  updateBike,
  deleteBike,
  getBikeInventoryCount,
} from './bike.controller';
import { CreateBikeDTO, UpdateBikeDTO, BikeQueryDTO } from './bike.dto';

const router = express.Router();

// Rotte per Operatori (e Admin se esistesse)
router.post(
  '/',
  isAuthenticated,
  authorizeRoles(UserRole.OPERATOR, UserRole.ADMIN), // O UserRole.ADMIN se separato
  validate(CreateBikeDTO, 'body'),
  createBike,
);

router.get(
  '/',
  isAuthenticated,
  authorizeRoles(UserRole.OPERATOR),
  validate(BikeQueryDTO, 'query'), // La validazione dei query params è più complessa
  getAllBikes, // La validazione dei query può essere fatta nel controller o con un middleware apposito
);

router.get(
  '/inventory/count', // Endpoint per il conteggio dell'inventario
  isAuthenticated,
  authorizeRoles(UserRole.OPERATOR),
  //getBikeInventoryCount,
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