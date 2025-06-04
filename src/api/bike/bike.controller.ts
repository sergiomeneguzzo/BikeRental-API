import { NextFunction, Request, Response } from 'express';
import bikeService from './bike.service';
import { CreateBikeDTO, UpdateBikeDTO, BikeQueryDTO } from './bike.dto';
import { BikeStatus } from './bike.entity';
import { TypedRequest } from '../../utils/typed-request'; // Assicurati che TypedQueryRequest esista
import { plainToInstance } from 'class-transformer'; // Utile per trasformare query params in DTO

export const createBike = async (
  req: TypedRequest<CreateBikeDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newBike = await bikeService.create(req.body);
    res.status(201).json(newBike);
  } catch (error) {
    next(error);
  }
};

export const getAllBikes = async (
  // req: TypedQueryRequest<BikeQueryDTO>, // Se hai TypedQueryRequest
  req: Request, // O usa Request standard e valida i query params
  res: Response,
  next: NextFunction,
) => {
  try {
    // Converte e valida i query params in BikeQueryDTO
    // plainToInstance è di class-transformer, class-validator può fare la validazione
    // Se non usi class-transformer, estrai i valori da req.query manualmente.
    const queryDto = plainToInstance(BikeQueryDTO, req.query, { excludeExtraneousValues: true });
    // Qui dovresti validare queryDto con class-validator se necessario, o farlo nel service/middleware

    const result = await bikeService.findAll(queryDto);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getBikeById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bike = await bikeService.findOne(req.params.id);
    res.status(200).json(bike);
  } catch (error) {
    next(error);
  }
};

export const updateBike = async (
  req: TypedRequest<UpdateBikeDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updatedBike = await bikeService.update(req.params.id, req.body);
    res.status(200).json(updatedBike);
  } catch (error) {
    next(error);
  }
};

export const deleteBike = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await bikeService.remove(req.params.id);
    res.status(200).json(result); // O res.status(204).send(); se non ritorni nulla
  } catch (error) {
    next(error);
  }
};

// Controller per l'inventario
export const getBikeInventoryCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { locationId, bikeTypeId, size, status } = req.query;
        if (!locationId) {
            return res.status(400).json({ message: 'locationId query parameter is required.' });
        }
        const count = await bikeService.getInventoryCount(
            locationId as string,
            bikeTypeId as string | undefined,
            //size as BikeSize | undefined,
            status as BikeStatus | undefined,
        );
        res.status(200).json({ count });
    } catch (error) {
        next(error);
    }
};