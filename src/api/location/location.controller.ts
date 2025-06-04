import { Request, Response } from 'express';
import { LocationService } from './location.service';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import axios from 'axios';
import { CreateLocationDto, UpdateLocationDto } from './location.dto';

const service = new LocationService();

export class LocationController {
  async create(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateLocationDto, req.body);
      await validateOrReject(dto);

      const fullAddress = `${dto.address.street}, ${dto.address.city}, ${dto.address.zip}, ${dto.address.province}`;

      const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: fullAddress,
            format: 'json',
            limit: 1,
          },
          headers: {
            'User-Agent': 'location-app/1.0',
          },
        },
      );

      const locationData = response.data[0];
      if (locationData) {
        dto.latitude = parseFloat(locationData.lat);
        dto.longitude = parseFloat(locationData.lon);
      }

      const location = await service.create(dto);
      res.status(201).json(location);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }

  async getAll(req: Request, res: Response) {
    const locations = await service.findAll();
    res.json(locations);
  }

  async getById(req: Request, res: Response) {
    const location = await service.findById(req.params.id);
    if (!location) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(location);
  }

  async update(req: Request, res: Response) {
    try {
      const dto = plainToInstance(UpdateLocationDto, req.body);
      await validateOrReject(dto);
      const updated = await service.update(req.params.id, dto);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }

  async delete(req: Request, res: Response) {
    const deleted = await service.delete(req.params.id);
    res.json(deleted);
  }
}
