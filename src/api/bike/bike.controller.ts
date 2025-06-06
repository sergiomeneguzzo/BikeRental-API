import { NextFunction, Request, Response } from 'express';
import bikeService from './bike.service';
import { CreateBikeDTO, UpdateBikeDTO, BikeQueryDTO } from './bike.dto';
import { BikeStatus } from './bike.entity';
import { TypedRequest } from '../../utils/typed-request';
import { plainToInstance } from 'class-transformer';

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
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const queryDto = plainToInstance(BikeQueryDTO, req.query, { excludeExtraneousValues: true });
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
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getBikeInventoryCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { locationId, bikeTypeId, status } = req.query;

        if (!locationId) {
            res.status(400).json({ message: 'locationId query parameter is required.' });
            return;
        }

        const count = await bikeService.getInventoryCount(
            locationId as string,
            bikeTypeId as string | undefined,
            status as BikeStatus | undefined,
        );

        res.status(200).json({ count });

    } catch (error) {
        next(error);
    }
};

export const getBikesByLocation = async (
    req: Request<{ locationId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { locationId } = req.params;

        const queryDto = plainToInstance(BikeQueryDTO, {
            locationId,
            status: BikeStatus.AVAILABLE,
            page: 1,
            limit: 1000,
        }, { excludeExtraneousValues: true });

        const result = await bikeService.findAll(queryDto);
        res.status(200).json(result.bikes);
    } catch (error) {
        next(error);
    }
};