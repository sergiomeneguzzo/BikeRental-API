import { Request, Response } from 'express';
import { BikeTypeService } from './biketype.service';

const service = new BikeTypeService();

export class BikeTypeController {
  async create(req: Request, res: Response) {
    const created = await service.create(req.body);
    res.status(201).json(created);
  }

  async getAll(_, res: Response) {
    const bikes = await service.findAll();
    res.json(bikes);
  }

  async getById(req: Request, res: Response) {
    const bike = await service.findById(req.params.id);
    if (!bike) {
      res.status(404).send('Bike type not found');
      return;
    }
    res.json(bike);
  }

  async update(req: Request, res: Response) {
    const updated = await service.update(req.params.id, req.body);
    res.json(updated);
  }

  async delete(req: Request, res: Response) {
    await service.delete(req.params.id);
    res.status(204).send();
  }
}
