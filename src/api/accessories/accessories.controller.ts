import { Request, Response } from 'express';
import { validateOrReject } from 'class-validator';
import { CreateAccessoryDto, UpdateAccessoryDto } from './accessories.dto';
import { AccessoryService } from './accessories.service';

const service = new AccessoryService();

export class AccessoryController {
  async create(req: Request, res: Response) {
    try {
      const dto = Object.assign(new CreateAccessoryDto(), req.body);
      await validateOrReject(dto);
      const accessory = await service.create(dto);
      res.status(201).json(accessory);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }

  async findAll(_: Request, res: Response) {
    const accessories = await service.findAll();
    res.json(accessories);
  }

  async findById(req: Request, res: Response) {
    const accessory = await service.findById(req.params.id);
    if (!accessory) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(accessory);
  }

  async update(req: Request, res: Response) {
    try {
      const dto = Object.assign(new UpdateAccessoryDto(), req.body);
      await validateOrReject(dto);
      const updated = await service.update(req.params.id, dto);
      if (!updated) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }

  async delete(req: Request, res: Response) {
    const deleted = await service.delete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json({ message: 'Deleted successfully' });
  }
}
